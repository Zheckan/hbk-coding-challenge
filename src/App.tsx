import { Box, Container, Stack, Typography } from "@mui/material";

function App() {
  return (
    <Box component="main" sx={{ minHeight: "100svh", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={1}>
          <Typography component="h1" variant="h3">
            Weather alerts
          </Typography>
          <Typography color="text.secondary" variant="body1">
            National Weather Service alert explorer
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
