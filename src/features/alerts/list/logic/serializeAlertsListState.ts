import {
  type AlertsListState,
  DEFAULT_ALERTS_SORT,
  DEFAULT_ALERTS_SORT_DIRECTION,
} from './alerts-list-state'

export function serializeAlertsListState(
  state: AlertsListState,
): URLSearchParams {
  const searchParams = new URLSearchParams()

  setWhenPresent(searchParams, 'from', state.issuedFrom)
  setWhenPresent(searchParams, 'to', state.issuedTo)
  setWhenPresent(searchParams, 'area', state.area)
  setWhenPresent(searchParams, 'severity', state.severity.toLowerCase())
  setWhenPresent(searchParams, 'status', state.status.toLowerCase())
  setWhenPresent(searchParams, 'q', state.search)

  if (state.sort !== DEFAULT_ALERTS_SORT) {
    searchParams.set('sort', state.sort)
  }

  if (state.direction !== DEFAULT_ALERTS_SORT_DIRECTION) {
    searchParams.set('direction', state.direction)
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
