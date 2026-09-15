import { Alert as MuiAlert, Button } from '@mui/material'

type NwsRateLimitAlertProps = Readonly<{
  onRetry: () => void
}>

export function NwsRateLimitAlert({ onRetry }: NwsRateLimitAlertProps) {
  return (
    <MuiAlert
      action={
        <Button color="inherit" onClick={onRetry} size="small">
          Try again
        </Button>
      }
      aria-label="NWS rate limit reached"
      severity="warning"
    >
      The National Weather Service is receiving too many requests. Please wait a
      moment, then try again.
    </MuiAlert>
  )
}
