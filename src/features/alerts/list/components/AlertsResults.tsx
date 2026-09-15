import type {
  AlertsSortDirection,
  AlertsSortKey,
} from '../logic/alerts-list-state'
import type { AlertsViewState } from '../logic/useAlerts'
import { AlertsFeedback } from './AlertsFeedback'
import { AlertsLoadedResults } from './AlertsLoadedResults'
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
    case 'rate-limit':
    case 'request-error':
      return <AlertsFeedback state={state} />
    case 'empty':
    case 'ready':
      return (
        <AlertsLoadedResults
          direction={direction}
          listSearch={listSearch}
          onPageChange={onPageChange}
          onSort={onSort}
          sort={sort}
          state={state}
        />
      )
    default: {
      const _exhaustive: never = state
      return _exhaustive
    }
  }
}
