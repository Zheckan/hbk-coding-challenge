import { Link, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <Stack spacing={2}>
      <Typography component="h1" variant="h3">
        Page not found
      </Typography>
      <Typography color="text.secondary">
        The page you requested does not exist.
      </Typography>
      <Link component={RouterLink} to="/alerts">
        View weather alerts
      </Link>
    </Stack>
  )
}
