import { Alert as MuiAlert, Button, Typography } from '@mui/material'

import type { AlertsViewState } from '../logic/useAlerts'

type AlertsFeedbackState = Extract<
  AlertsViewState,
  { kind: 'invalid' | 'rate-limit' | 'request-error' }
>

export function AlertsFeedback({
  state,
}: Readonly<{ state: AlertsFeedbackState }>) {
  switch (state.kind) {
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
    case 'rate-limit':
      return (
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
    case 'request-error':
      return (
        <MuiAlert
          action={
            state.onRetry === null ? undefined : (
              <Button color="inherit" onClick={state.onRetry} size="small">
                Try again
              </Button>
            )
          }
          aria-label="Weather alerts request failed"
          severity="error"
        >
          Could not load weather alerts.
        </MuiAlert>
      )
    default: {
      const _exhaustive: never = state
      return _exhaustive
    }
  }
}
