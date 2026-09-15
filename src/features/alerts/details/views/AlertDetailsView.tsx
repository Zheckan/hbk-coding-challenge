import { Alert as MuiAlert, Skeleton, Stack } from '@mui/material'

import { AlertDetails } from '../components/AlertDetails'
import type { UseAlertDetailsResult } from '../logic/useAlertDetails'

export function AlertDetailsView({ state, backTo }: UseAlertDetailsResult) {
  if (state.kind === 'loading') {
    return (
      <Stack aria-label="Loading alert details" role="status" spacing={2}>
        <Skeleton height={56} width="60%" />
        <Skeleton height={120} variant="rounded" />
      </Stack>
    )
  }

  if (state.kind === 'error') {
    return <MuiAlert severity="error">Could not load alert details.</MuiAlert>
  }

  return <AlertDetails alert={state.alert} backTo={backTo} />
}
