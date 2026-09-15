import {
  type AlertsListState,
  ALL_ALERT_STATUSES_PARAMETER,
  DEFAULT_ALERTS_PAGE_SIZE,
  DEFAULT_ALERTS_SORT,
  DEFAULT_ALERTS_SORT_DIRECTION,
  DEFAULT_ALERTS_STATUS,
} from './alerts-list-state'

export function serializeAlertsListState(
  state: AlertsListState,
): URLSearchParams {
  const searchParams = new URLSearchParams()

  setWhenPresent(searchParams, 'from', state.issuedFrom)
  setWhenPresent(searchParams, 'to', state.issuedTo)
  setWhenPresent(searchParams, 'area', state.area)
  setWhenPresent(searchParams, 'severity', state.severity.toLowerCase())

  if (state.status !== DEFAULT_ALERTS_STATUS) {
    searchParams.set(
      'status',
      state.status === ''
        ? ALL_ALERT_STATUSES_PARAMETER
        : state.status.toLowerCase(),
    )
  }

  setWhenPresent(searchParams, 'q', state.search)

  if (state.sort !== DEFAULT_ALERTS_SORT) {
    searchParams.set('sort', state.sort)
  }

  if (state.direction !== DEFAULT_ALERTS_SORT_DIRECTION) {
    searchParams.set('direction', state.direction)
  }

  if (state.pageSize !== DEFAULT_ALERTS_PAGE_SIZE) {
    searchParams.set('pageSize', String(state.pageSize))
  }

  if (state.page > 1) {
    searchParams.set('page', String(state.page))
  }

  return searchParams
}

function setWhenPresent(
  searchParams: URLSearchParams,
  name: string,
  value: string,
): void {
  if (value !== '') {
    searchParams.set(name, value)
  }
}
