import { Alert as MuiAlert, Button, LinearProgress, Stack } from '@mui/material'

import type { AlertsTableControls, AlertsViewState } from '../logic/useAlerts'
import { AlertsFeedback } from './AlertsFeedback'
import { AlertsMobileSort } from './AlertsMobileSort'
import { AlertsTable } from './AlertsTable'
import { AlertsTableSkeleton } from './AlertsTableSkeleton'

type AlertsLoadedState = Extract<AlertsViewState, { kind: 'empty' | 'ready' }>

type AlertsResultsProps = Readonly<{
  now: number
  state: AlertsViewState
  tableControls: AlertsTableControls
}>

export function AlertsResults({
  now,
  state,
  tableControls,
}: AlertsResultsProps) {
  switch (state.kind) {
    case 'loading':
      return <AlertsTableSkeleton />
    case 'invalid':
    case 'rate-limit':
    case 'request-error':
      return <AlertsFeedback state={state} />
    case 'empty':
      return (
        <Stack spacing={1} sx={{ minWidth: 0 }}>
          <MuiAlert
            aria-label="No weather alerts"
            role="status"
            severity="info"
          >
            No matching alerts in the loaded results.
          </MuiAlert>
          <LoadMoreAction state={state} />
        </Stack>
      )
    case 'ready':
      return (
        <Stack spacing={1} sx={{ minWidth: 0 }}>
          {state.isUpdating ? (
            <LinearProgress
              aria-label="Updating weather alerts"
              role="status"
            />
          ) : null}
          <AlertsMobileSort
            direction={tableControls.direction}
            onSort={tableControls.onSort}
            sort={tableControls.sort}
          />
          <AlertsTable now={now} state={state} tableControls={tableControls} />
          <LoadMoreAction state={state} />
        </Stack>
      )
    default: {
      const _exhaustive: never = state
      return _exhaustive
    }
  }
}

function LoadMoreAction({ state }: Readonly<{ state: AlertsLoadedState }>) {
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
