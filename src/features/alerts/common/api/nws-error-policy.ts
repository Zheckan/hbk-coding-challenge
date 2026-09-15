import { NwsApiError } from './nws-alerts'

export type NwsErrorKind = 'rate-limit' | 'not-found' | 'request'

export function getNwsErrorKind(error: unknown): NwsErrorKind {
  if (error instanceof NwsApiError && error.status === 429) {
    return 'rate-limit'
  }

  if (error instanceof NwsApiError && error.status === 404) {
    return 'not-found'
  }

  return 'request'
}

export function isRetryableNwsError(error: unknown): boolean {
  return (
    error instanceof NwsApiError &&
    (error.kind === 'network' ||
      error.status === 429 ||
      (error.status !== null && error.status >= 500))
  )
}

export function shouldRetryNwsRequest(
  failureCount: number,
  error: unknown,
): boolean {
  return failureCount === 0 && isRetryableNwsError(error)
}
