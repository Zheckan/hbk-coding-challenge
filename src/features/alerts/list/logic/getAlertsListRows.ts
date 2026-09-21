import {
  type Alert,
  type AlertSeverity,
} from '@/features/alerts/common/model/alert'
import { type AlertsListState, type AlertsSortKey } from './alerts-list-state'

type AlertsListRows = Readonly<{
  rows: readonly Alert[]
  total: number
  page: number
  pageCount: number
}>

const severityOrder = {
  Extreme: 0,
  Severe: 1,
  Moderate: 2,
  Minor: 3,
  Unknown: 4,
} satisfies Record<AlertSeverity, number>

export function getAlertsListRows(
  alerts: readonly Alert[],
  state: AlertsListState,
): AlertsListRows {
  const search = state.search.toLocaleLowerCase()

  const matchingAlerts =
    search === ''
      ? alerts
      : alerts.filter((alert) =>
          [alert.event, alert.headline ?? '', alert.affectedArea].some(
            (value) => value.toLocaleLowerCase().includes(search),
          ),
        )
  const sortedAlerts = matchingAlerts.toSorted((left, right) => {
    const comparison = compareAlerts(left, right, state.sort)
    return state.direction === 'asc' ? comparison : -comparison
  })
  const pageCount = Math.max(1, Math.ceil(sortedAlerts.length / state.pageSize))

  const page = Math.min(state.page, pageCount)
  const startIndex = (page - 1) * state.pageSize

  return {
    rows: sortedAlerts.slice(startIndex, startIndex + state.pageSize),
    total: sortedAlerts.length,
    page,
    pageCount,
  }
}

function compareAlerts(left: Alert, right: Alert, sort: AlertsSortKey): number {
  switch (sort) {
    case 'severity':
      return severityOrder[right.severity] - severityOrder[left.severity]
    case 'event':
      return left.event.localeCompare(right.event)
    case 'affectedArea':
      return left.affectedArea.localeCompare(right.affectedArea)
    case 'issuedAt':
      return Date.parse(left.issuedAt) - Date.parse(right.issuedAt)
    case 'expiresAt':
      return Date.parse(left.expiresAt) - Date.parse(right.expiresAt)
    default: {
      const _exhaustive: never = sort
      return _exhaustive
    }
  }
}
