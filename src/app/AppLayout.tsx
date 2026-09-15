import { Box, Container } from '@mui/material'
import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <Box
      component="main"
      sx={{
        backgroundImage:
          'linear-gradient(180deg, rgba(0, 90, 139, 0.09) 0, rgba(244, 247, 250, 0) 22rem)',
        minHeight: '100svh',
        overflowX: 'hidden',
        py: { xs: 3, sm: 4, md: 6 },
      }}
    >
      <Container maxWidth="xl" sx={{ minWidth: 0, px: { xs: 2, sm: 3 } }}>
        <Outlet />
      </Container>
    </Box>
  )
}
