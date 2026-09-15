import { Alert as MuiAlert, Button, Link, Skeleton, Stack } from '@mui/material'
import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { AlertDetails } from '../components/AlertDetails'
import type {
  AlertDetailsViewState,
  UseAlertDetailsResult,
} from '../logic/useAlertDetails'

export function AlertDetailsView({ state, backTo }: UseAlertDetailsResult) {
  if (state.kind === 'loading') {
    return <AlertDetailsSkeleton />
  }

  if (state.kind === 'ready') {
    return <AlertDetails alert={state.alert} backTo={backTo} />
  }

  return <AlertDetailsFeedback backTo={backTo} state={state} />
}

function AlertDetailsSkeleton() {
  return (
    <Stack aria-label="Loading alert details" role="status" spacing={2}>
      <Skeleton height={56} width="60%" />
      <Skeleton height={120} variant="rounded" />
    </Stack>
  )
}

type AlertDetailsFeedbackState = Exclude<
  AlertDetailsViewState,
  { kind: 'loading' | 'ready' }
>

function AlertDetailsFeedback({
  backTo,
  state,
}: Readonly<{ backTo: string; state: AlertDetailsFeedbackState }>) {
  let feedback: ReactNode

  switch (state.kind) {
    case 'not-found':
      feedback = (
        <MuiAlert aria-label="Alert not found" severity="info">
          This alert is no longer available from NWS.
        </MuiAlert>
      )
      break
    case 'rate-limit':
      feedback = (
        <MuiAlert
          action={
            <Button color="inherit" onClick={state.onRetry} size="small">
              Try again
            </Button>
          }
          aria-label="NWS rate limit reached"
          severity="warning"
        >
          The National Weather Service is receiving too many requests. Please
          wait a moment, then try again.
        </MuiAlert>
      )
      break
    case 'request-error':
      feedback = (
        <MuiAlert
          action={
            state.onRetry === null ? undefined : (
              <Button color="inherit" onClick={state.onRetry} size="small">
                Try again
              </Button>
            )
          }
          aria-label="Alert details request failed"
          severity="error"
        >
          Could not load alert details.
        </MuiAlert>
      )
      break
    default: {
      const _exhaustive: never = state
      return _exhaustive
    }
  }

  return (
    <Stack spacing={2}>
      <Link component={RouterLink} to={backTo}>
        Back to alerts
      </Link>
      {feedback}
    </Stack>
  )
}
