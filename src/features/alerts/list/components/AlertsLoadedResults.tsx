import { Alert as MuiAlert, Button, LinearProgress, Stack } from '@mui/material'

import type {
  AlertsPageSize,
  AlertsSortDirection,
  AlertsSortKey,
} from '../logic/alerts-list-state'
import type { AlertsViewState } from '../logic/useAlerts'
import { AlertsTable } from './AlertsTable'

type AlertsLoadedState = Extract<AlertsViewState, { kind: 'empty' | 'ready' }>
type EmptyAlertsState = Extract<AlertsLoadedState, { kind: 'empty' }>
type ReadyAlertsState = Extract<AlertsLoadedState, { kind: 'ready' }>

type AlertsLoadedResultsProps = Readonly<{
  state: AlertsLoadedState
  listSearch: string
  sort: AlertsSortKey
  direction: AlertsSortDirection
  onSort: (sort: AlertsSortKey) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: AlertsPageSize) => void
}>

export function AlertsLoadedResults({
  state,
  listSearch,
  sort,
  direction,
  onSort,
  onPageChange,
  onPageSizeChange,
}: AlertsLoadedResultsProps) {
  if (state.kind === 'empty') {
    return <EmptyAlertsResults state={state} />
  }

  return (
    <ReadyAlertsResults
      direction={direction}
      listSearch={listSearch}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onSort={onSort}
      sort={sort}
      state={state}
    />
  )
}

function EmptyAlertsResults({ state }: Readonly<{ state: EmptyAlertsState }>) {
  return (
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      <MuiAlert aria-label="No weather alerts" role="status" severity="info">
        No matching alerts in the loaded results.
      </MuiAlert>
      <LoadMoreAction state={state} />
    </Stack>
  )
}

type ReadyAlertsResultsProps = Omit<AlertsLoadedResultsProps, 'state'> &
  Readonly<{ state: ReadyAlertsState }>

function ReadyAlertsResults({
  state,
  listSearch,
  sort,
  direction,
  onSort,
  onPageChange,
  onPageSizeChange,
}: ReadyAlertsResultsProps) {
  return (
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      {state.isUpdating ? (
        <LinearProgress aria-label="Updating weather alerts" role="status" />
      ) : null}
      <AlertsTable
        alerts={state.alerts}
        direction={direction}
        listSearch={listSearch}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onSort={onSort}
        page={state.page}
        pageCount={state.pageCount}
        pageSize={state.pageSize}
        sort={sort}
        total={state.total}
      />
      <LoadMoreAction state={state} />
    </Stack>
  )
}

function LoadMoreAction({ state }: Readonly<{ state: AlertsLoadedState }>) {
  if (state.kind === 'ready' && state.page !== state.pageCount) {
    return null
  }

  if (state.loadMoreFailed) {
    return (
      <MuiAlert
        action={
          <Button color="inherit" onClick={state.onLoadMore} size="small">
            Try again
          </Button>
        }
        aria-label="Could not load more alerts"
        severity="error"
      >
        The next page could not be loaded. The alerts above are still available.
      </MuiAlert>
    )
  }

  if (!state.hasMore) {
    return null
  }

  return (
    <Button
      disabled={state.isLoadingMore || state.isLoadMoreDisabled}
      onClick={state.onLoadMore}
      sx={{
        alignSelf: 'center',
        width: { xs: '100%', sm: 'auto' },
      }}
      variant="outlined"
    >
      {state.isLoadingMore ? 'Loading more alerts…' : 'Load more alerts'}
    </Button>
  )
}
