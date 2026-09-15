import { Alert as MuiAlert, Typography } from '@mui/material'

import type {
  AlertsSortDirection,
  AlertsSortKey,
} from '../logic/alerts-list-state'
import type { AlertsViewState } from '../logic/useAlerts'
import { AlertsTable } from './AlertsTable'
import { AlertsTableSkeleton } from './AlertsTableSkeleton'

type AlertsResultsProps = Readonly<{
  state: AlertsViewState
  listSearch: string
  sort: AlertsSortKey
  direction: AlertsSortDirection
  onSort: (sort: AlertsSortKey) => void
  onPageChange: (page: number) => void
}>

export function AlertsResults({
  state,
  listSearch,
  sort,
  direction,
  onSort,
  onPageChange,
}: AlertsResultsProps) {
  switch (state.kind) {
    case 'loading':
      return <AlertsTableSkeleton />
    case 'invalid':
      return (
        <MuiAlert severity="warning">
          {state.errors.map((error) => (
            <Typography component="div" key={error}>
              {error}
            </Typography>
          ))}
        </MuiAlert>
      )
    case 'error':
      return (
        <MuiAlert severity="error">Could not load weather alerts.</MuiAlert>
      )
    case 'ready':
      return (
        <AlertsTable
          alerts={state.alerts}
          direction={direction}
          listSearch={listSearch}
          onPageChange={onPageChange}
          onSort={onSort}
          page={state.page}
          sort={sort}
          total={state.total}
        />
      )
    default: {
      const _exhaustive: never = state
      return _exhaustive
    }
  }
}
