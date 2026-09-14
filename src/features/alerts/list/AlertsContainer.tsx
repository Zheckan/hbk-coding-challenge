import { Stack, Typography } from "@mui/material";

export function AlertsContainer() {
  return (
    <Stack spacing={1}>
      <Typography component="h1" variant="h3">
        Weather alerts
      </Typography>
      <Typography color="text.secondary" variant="body1">
        National Weather Service alert explorer
      </Typography>
    </Stack>
  );
}
