import { Box, Container } from '@mui/material'
import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <Box component="main" sx={{ minHeight: '100svh', py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Outlet />
      </Container>
    </Box>
  )
}
