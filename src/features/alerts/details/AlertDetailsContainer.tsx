import { Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { testIds } from "@/ui/utils/testIds";

type AlertDetailsContainerProps = Readonly<{
  alertId: string;
}>;

export function AlertDetailsContainer({ alertId }: AlertDetailsContainerProps) {
  return (
    <Stack spacing={2}>
      <Typography component="h1" variant="h3">
        Alert details
      </Typography>
      <Typography data-testid={testIds.alerts.details.alertId}>
        {alertId}
      </Typography>
      <Link component={RouterLink} to="/alerts">
        Back to alerts
      </Link>
    </Stack>
  );
}
