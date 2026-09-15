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
