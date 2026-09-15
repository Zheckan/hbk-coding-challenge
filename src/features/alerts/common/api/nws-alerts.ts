import type { Alert, AlertPage } from '../model/alert'
import type { AlertQuery } from '../model/AlertQuery'
import {
  parseAlert,
  parseAlertCollection,
  parseProblemDetails,
} from './nws-alerts.schema'

const NWS_API_BASE_URL = 'https://api.weather.gov'

export type NwsRequestOptions = Readonly<{
  signal?: AbortSignal
}>

export type NwsApiErrorKind = 'network' | 'http' | 'invalid-response'

type NwsApiErrorInput = Readonly<{
  kind: NwsApiErrorKind
  message: string
  status?: number | null
  correlationId?: string | null
  cause?: unknown
}>

export class NwsApiError extends Error {
  readonly kind: NwsApiErrorKind
  readonly status: number | null
  readonly correlationId: string | null

  constructor(input: NwsApiErrorInput) {
    super(input.message, { cause: input.cause })
    this.name = 'NwsApiError'
    this.kind = input.kind
    this.status = input.status ?? null
    this.correlationId = input.correlationId ?? null
  }
}

function buildAlertsUrl(query: AlertQuery): URL {
  const url = new URL('/alerts', NWS_API_BASE_URL)

  if (query.start !== undefined) {
    url.searchParams.set('start', query.start.toISOString())
  }

  if (query.end !== undefined) {
    url.searchParams.set('end', query.end.toISOString())
  }

  if (query.area !== undefined) {
    url.searchParams.set('area', query.area.toUpperCase())
  }

  if (query.status !== undefined) {
    url.searchParams.set('status', query.status.toLowerCase())
  }

  if (query.severity !== undefined) {
    url.searchParams.set('severity', query.severity)
  }

  if (query.limit !== undefined) {
    if (
      !Number.isInteger(query.limit) ||
      query.limit < 1 ||
      query.limit > 500
    ) {
      throw new RangeError('Alert query limit must be an integer from 1 to 500')
    }

    url.searchParams.set('limit', String(query.limit))
  }

  if (query.cursor !== undefined) {
    url.searchParams.set('cursor', query.cursor)
  }

  return url
}

async function createHttpError(response: Response): Promise<NwsApiError> {
  let input: unknown

  try {
    input = await response.json()
  } catch {
    input = null
  }

  const problem = parseProblemDetails(input)
  const correlationId =
    response.headers.get('X-Correlation-Id') ?? problem?.correlationId ?? null

  return new NwsApiError({
    kind: 'http',
    message:
      problem?.detail ??
      problem?.title ??
      `NWS request failed with status ${String(response.status)}`,
    status: response.status,
    correlationId,
  })
}

async function requestJson(
  url: URL,
  options: NwsRequestOptions,
): Promise<unknown> {
  let response: Response

  try {
    // Browsers set User-Agent and do not allow application code to replace it.
    response = await fetch(url, {
      headers: {
        Accept: 'application/geo+json',
      },
      ...(options.signal === undefined ? {} : { signal: options.signal }),
    })
  } catch (cause) {
    if (options.signal?.aborted === true) {
      const reason: unknown = options.signal.reason
      throw reason instanceof Error ? reason : cause
    }

    throw new NwsApiError({
      kind: 'network',
      message: 'Could not reach the NWS API',
      cause,
    })
  }

  if (!response.ok) {
    throw await createHttpError(response)
  }

  try {
    const input: unknown = await response.json()
    return input
  } catch (cause) {
    throw new NwsApiError({
      kind: 'invalid-response',
      message: 'NWS returned invalid JSON',
      cause,
    })
  }
}

export async function fetchAlerts(
  query: AlertQuery,
  options: NwsRequestOptions = {},
): Promise<AlertPage> {
  const input = await requestJson(buildAlertsUrl(query), options)

  try {
    return parseAlertCollection(input)
  } catch (cause) {
    throw new NwsApiError({
      kind: 'invalid-response',
      message: 'NWS returned an invalid alert collection',
      cause,
    })
  }
}

export async function fetchAlert(
  id: string,
  options: NwsRequestOptions = {},
): Promise<Alert> {
  const url = new URL(`/alerts/${encodeURIComponent(id)}`, NWS_API_BASE_URL)
  const input = await requestJson(url, options)

  try {
    return parseAlert(input)
  } catch (cause) {
    throw new NwsApiError({
      kind: 'invalid-response',
      message: 'NWS returned an invalid alert',
      cause,
    })
  }
}
