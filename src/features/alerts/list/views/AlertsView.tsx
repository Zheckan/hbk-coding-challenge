import { Alert as MuiAlert, Stack, Typography } from "@mui/material";
import type { Alert } from "@/features/alerts/common/model/alert";
import { AlertsTableSkeleton } from "../components/AlertsTableSkeleton";
import { AlertsTable } from "../components/AlertsTable";

type AlertsViewState =
  | Readonly<{ kind: "loading" }>
  | Readonly<{ kind: "error" }>
  | Readonly<{ kind: "ready"; alerts: readonly Alert[] }>;

type AlertsViewProps = Readonly<{
  state: AlertsViewState;
}>;

export function AlertsView({ state }: AlertsViewProps) {
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography component="h1" variant="h3">
          Weather alerts
        </Typography>
        <Typography color="text.secondary" variant="body1">
          National Weather Service alert explorer
        </Typography>
      </Stack>

      {state.kind === "loading" && <AlertsTableSkeleton />}

      {state.kind === "error" && (
        <MuiAlert severity="error">Could not load weather alerts.</MuiAlert>
      )}

      {state.kind === "ready" && <AlertsTable alerts={state.alerts} />}
    </Stack>
  );
}
