import { Stack, Typography } from "@mui/material";

import { AlertsFilters } from "../components/AlertsFilters";
import { AlertsResults } from "../components/AlertsResults";
import type { UseAlertsResult } from "../logic/useAlerts";

export function AlertsView({
  state,
  listSearch,
  filters,
  dateBounds,
  sort,
  direction,
  onFiltersChange,
  onClearFilters,
  onSort,
  onPageChange,
}: UseAlertsResult) {
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

      <AlertsResults
        direction={direction}
        listSearch={listSearch}
        onPageChange={onPageChange}
        onSort={onSort}
        sort={sort}
        state={state}
      />
    </Stack>
  );
}
