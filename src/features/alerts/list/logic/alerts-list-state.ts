import type {
  AlertSeverity,
  AlertStatus,
} from '@/features/alerts/common/model/alert'
import type { AlertQuery } from '@/features/alerts/common/model/AlertQuery'

export const ALERTS_PAGE_SIZES = [10, 25, 50, 100] as const
export type AlertsPageSize = (typeof ALERTS_PAGE_SIZES)[number]
export const DEFAULT_ALERTS_PAGE_SIZE: AlertsPageSize = 25

export function isAlertsPageSize(value: number): value is AlertsPageSize {
  return ALERTS_PAGE_SIZES.some((pageSize) => pageSize === value)
}

export const ALERTS_SORT_KEYS = [
  'severity',
  'event',
  'affectedArea',
  'issuedAt',
  'expiresAt',
] as const

export type AlertsSortKey = (typeof ALERTS_SORT_KEYS)[number]
export type AlertsSortDirection = 'asc' | 'desc'

export type AlertsListState = Readonly<{
  issuedFrom: string
  issuedTo: string
  area: string
  severity: AlertSeverity | ''
  status: AlertStatus | ''
  search: string
  sort: AlertsSortKey
  direction: AlertsSortDirection
  page: number
  pageSize: AlertsPageSize
}>

export type AlertsListFilters = Pick<
  AlertsListState,
  'issuedFrom' | 'issuedTo' | 'area' | 'severity' | 'status' | 'search'
>

export const DEFAULT_ALERTS_STATUS: AlertStatus = 'Actual'
export const ALL_ALERT_STATUSES_PARAMETER = 'all'

export const DEFAULT_ALERTS_FILTERS = {
  issuedFrom: '',
  issuedTo: '',
  area: '',
  severity: '',
  status: DEFAULT_ALERTS_STATUS,
  search: '',
} satisfies AlertsListFilters

export function hasNonDefaultFilters(filters: AlertsListFilters): boolean {
  return (
    filters.issuedFrom !== DEFAULT_ALERTS_FILTERS.issuedFrom ||
    filters.issuedTo !== DEFAULT_ALERTS_FILTERS.issuedTo ||
    filters.area !== DEFAULT_ALERTS_FILTERS.area ||
    filters.severity !== DEFAULT_ALERTS_FILTERS.severity ||
    filters.status !== DEFAULT_ALERTS_FILTERS.status ||
    filters.search !== DEFAULT_ALERTS_FILTERS.search
  )
}

export type AlertsDateBounds = Readonly<{
  min: string
  max: string
}>

export type ParsedAlertsListState =
  | Readonly<{
      kind: 'valid'
      state: AlertsListState
      dateBounds: AlertsDateBounds
      query: AlertQuery
    }>
  | Readonly<{
      kind: 'invalid'
      state: AlertsListState
      dateBounds: AlertsDateBounds
      errors: readonly string[]
    }>

export const DEFAULT_ALERTS_SORT: AlertsSortKey = 'issuedAt'
export const DEFAULT_ALERTS_SORT_DIRECTION: AlertsSortDirection = 'desc'
