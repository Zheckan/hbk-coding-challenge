import { Alert as MuiAlert, Stack, Typography } from "@mui/material";

import type { Alert } from "@/features/alerts/common/model/alert";
import { AlertsFilters } from "../components/AlertsFilters";
import { AlertsTable } from "../components/AlertsTable";
import { AlertsTableSkeleton } from "../components/AlertsTableSkeleton";
import type {
  AlertsDateBounds,
  AlertsListFilters,
  AlertsSortDirection,
  AlertsSortKey,
} from "../logic/alerts-list-state";

type AlertsViewState =
  | Readonly<{ kind: "loading" }>
  | Readonly<{ kind: "invalid"; errors: readonly string[] }>
  | Readonly<{ kind: "error" }>
  | Readonly<{
      kind: "ready";
      alerts: readonly Alert[];
      total: number;
      page: number;
    }>;

type AlertsViewProps = Readonly<{
  state: AlertsViewState;
  filters: AlertsListFilters;
  dateBounds: AlertsDateBounds;
  sort: AlertsSortKey;
  direction: AlertsSortDirection;
  onFiltersChange: (filters: AlertsListFilters) => void;
  onClearFilters: () => void;
  onSort: (sort: AlertsSortKey) => void;
  onPageChange: (page: number) => void;
}>;

export function AlertsView({
  state,
  filters,
  dateBounds,
  sort,
  direction,
  onFiltersChange,
  onClearFilters,
  onSort,
  onPageChange,
}: AlertsViewProps) {
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

      <AlertsFilters
        dateBounds={dateBounds}
        filters={filters}
        onChange={onFiltersChange}
        onClear={onClearFilters}
      />

      {state.kind === "loading" && <AlertsTableSkeleton />}

      {state.kind === "invalid" && (
        <MuiAlert severity="warning">
          {state.errors.map((error) => (
            <Typography component="div" key={error}>
              {error}
            </Typography>
          ))}
        </MuiAlert>
      )}

      {state.kind === "error" && (
        <MuiAlert severity="error">Could not load weather alerts.</MuiAlert>
      )}

      {state.kind === "ready" && (
        <AlertsTable
          alerts={state.alerts}
          direction={direction}
          onPageChange={onPageChange}
          onSort={onSort}
          page={state.page}
          sort={sort}
          total={state.total}
        />
      )}
    </Stack>
  );
}
