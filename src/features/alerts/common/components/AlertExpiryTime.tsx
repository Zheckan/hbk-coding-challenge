import { Box } from '@mui/material'

import { formatAlertDate } from '../logic/formatAlertDate'

type AlertExpiryTimeProps = Readonly<{
  expiresAt: string
  now: number
}>

export function AlertExpiryTime({ expiresAt, now }: AlertExpiryTimeProps) {
  const isExpired = Date.parse(expiresAt) <= now
  const validityLabel = isExpired ? 'Expired' : 'Active'

  return (
    <>
      <time dateTime={expiresAt}>{formatAlertDate(expiresAt)}</time>
      <Box
        component="span"
        sx={{
          color: isExpired ? 'text.secondary' : 'success.main',
          display: 'block',
          fontSize: '0.75rem',
          fontWeight: 500,
        }}
      >
        {validityLabel}
      </Box>
    </>
  )
}
