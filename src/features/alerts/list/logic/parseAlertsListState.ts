import {
  ALERT_SEVERITIES,
  ALERT_STATUSES,
} from '@/features/alerts/common/model/alert'
import { isAlertAreaCode } from './alert-area-options'
import {
  ALERTS_SORT_KEYS,
  type AlertsDateBounds,
  type AlertsListState,
  ALL_ALERT_STATUSES_PARAMETER,
  DEFAULT_ALERTS_PAGE_SIZE,
  DEFAULT_ALERTS_SORT,
  DEFAULT_ALERTS_SORT_DIRECTION,
  DEFAULT_ALERTS_STATUS,
  isAlertsPageSize,
  type ParsedAlertsListState,
} from './alerts-list-state'
import { formatLocalDate, parseLocalDate } from './local-dates'

const NWS_ALERT_HISTORY_DAYS = 7

export function parseAlertsListState(
  searchParams: URLSearchParams,
  now = new Date(),
): ParsedAlertsListState {
  const today = startOfLocalDay(now)
  const earliestDate = new Date(today)

  // The NWS /alerts endpoint only contains alerts issued in the past seven days.
  earliestDate.setDate(earliestDate.getDate() - (NWS_ALERT_HISTORY_DAYS - 1))

  const dateBounds = {
    min: formatLocalDate(earliestDate),
    max: formatLocalDate(today),
  }
  const state = parseState(searchParams)
  const errors: string[] = []

  const issuedFrom = parseSelectedDate({
    label: 'Issued from',
    value: state.issuedFrom,
    dateBounds,
    errors,
  })
  const issuedTo = parseSelectedDate({
    label: 'Issued to',
    value: state.issuedTo,
    dateBounds,
    errors,
  })

  if (state.area !== '' && !isAlertAreaCode(state.area)) {
    errors.push('Area must be a supported state, territory, or marine code.')
  }

  if (issuedFrom !== null && issuedTo !== null && issuedFrom > issuedTo) {
    errors.push('Issued from must be on or before issued to.')
  }

  if (errors.length > 0) {
    return { kind: 'invalid', state, dateBounds, errors }
  }

  return {
    kind: 'valid',
    state,
    dateBounds,
    query: {
      ...(issuedFrom === null ? {} : { start: issuedFrom }),
      ...(issuedTo === null ? {} : { end: endOfLocalDay(issuedTo) }),
      ...(state.area === '' ? {} : { area: state.area }),
      ...(state.severity === '' ? {} : { severity: state.severity }),
      ...(state.status === '' ? {} : { status: state.status }),
    },
  }
}

function parseState(searchParams: URLSearchParams): AlertsListState {
  const severityParameter = searchParams.get('severity')?.toLowerCase()
  const statusParameter = searchParams.get('status')?.toLowerCase()
  const sortParameter = searchParams.get('sort')
  const directionParameter = searchParams.get('direction')
  const pageParameter = Number(searchParams.get('page'))
  const pageSizeParameter = Number(searchParams.get('pageSize'))

  return {
    issuedFrom: searchParams.get('from') ?? '',
    issuedTo: searchParams.get('to') ?? '',
    area: (searchParams.get('area') ?? '').trim().toUpperCase(),
    severity:
      ALERT_SEVERITIES.find(
        (severity) => severity.toLowerCase() === severityParameter,
      ) ?? '',
    status:
      statusParameter === ALL_ALERT_STATUSES_PARAMETER
        ? ''
        : (ALERT_STATUSES.find(
            (status) => status.toLowerCase() === statusParameter,
          ) ?? DEFAULT_ALERTS_STATUS),
    search: (searchParams.get('q') ?? '').trim(),
    sort:
      ALERTS_SORT_KEYS.find((sortKey) => sortKey === sortParameter) ??
      DEFAULT_ALERTS_SORT,
    direction:
      directionParameter === 'asc' ? 'asc' : DEFAULT_ALERTS_SORT_DIRECTION,
    page:
      Number.isSafeInteger(pageParameter) && pageParameter > 0
        ? pageParameter
        : 1,
    pageSize: isAlertsPageSize(pageSizeParameter)
      ? pageSizeParameter
      : DEFAULT_ALERTS_PAGE_SIZE,
  }
}

function parseSelectedDate(input: {
  label: string
  value: string
  dateBounds: AlertsDateBounds
  errors: string[]
}): Date | null {
  if (input.value === '') {
    return null
  }

  const date = parseLocalDate(input.value)

  if (date === null) {
    input.errors.push(`${input.label} must be a valid date.`)
    return null
  }

  const formattedDate = formatLocalDate(date)

  if (
    formattedDate < input.dateBounds.min ||
    formattedDate > input.dateBounds.max
  ) {
    input.errors.push(
      `${input.label} must be between ${input.dateBounds.min} and ${input.dateBounds.max}.`,
    )
  }

  return date
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function endOfLocalDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  )
}
