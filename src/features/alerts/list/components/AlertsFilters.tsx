import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  ALERT_SEVERITIES,
  ALERT_STATUSES,
} from "@/features/alerts/common/model/alert";
import {
  isAlertAreaCode,
  MARINE_AREA_OPTIONS,
  STATE_TERRITORY_AREA_OPTIONS,
} from "../logic/alert-area-options";
import type {
  AlertsDateBounds,
  AlertsListFilters,
} from "../logic/alerts-list-state";

type AlertsFiltersProps = Readonly<{
  filters: AlertsListFilters;
  dateBounds: AlertsDateBounds;
  onChange: (filters: AlertsListFilters) => void;
  onClear: () => void;
}>;

export function AlertsFilters({
  filters,
  dateBounds,
  onChange,
  onClear,
}: AlertsFiltersProps) {
  const hasFilters = Object.values(filters).some((value) => value !== "");
  const unsupportedArea =
    filters.area !== "" && !isAlertAreaCode(filters.area) ? filters.area : null;

  return (
    <Paper
      aria-labelledby="alerts-filters-heading"
      component="section"
      sx={{ p: 2 }}
      variant="outlined"
    >
      <Stack spacing={2}>
        <Typography component="h2" id="alerts-filters-heading" variant="h6">
          Filters
        </Typography>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
          }}
        >
          <TextField
            fullWidth
            label="Search alerts"
            onChange={(event) => {
              onChange({ ...filters, search: event.target.value });
            }}
            type="search"
            value={filters.search}
          />
          <TextField
            fullWidth
            helperText="State, territory, or marine area"
            label="Area code"
            onChange={(event) => {
              const area = isAlertAreaCode(event.target.value)
                ? event.target.value
                : "";

              onChange({ ...filters, area });
            }}
            select
            slotProps={{
              inputLabel: { shrink: true },
              select: { native: true },
            }}
            value={filters.area}
          >
            <option value="">All areas</option>
            {unsupportedArea === null ? null : (
              <option disabled value={unsupportedArea}>
                Unsupported code: {unsupportedArea}
              </option>
            )}
            <optgroup label="States and territories">
              {STATE_TERRITORY_AREA_OPTIONS.map(({ code, label }) => (
                <option key={code} value={code}>
                  {code} — {label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Marine areas">
              {MARINE_AREA_OPTIONS.map(({ code, label }) => (
                <option key={code} value={code}>
                  {code} — {label}
                </option>
              ))}
            </optgroup>
          </TextField>
          <TextField
            fullWidth
            label="Severity"
            onChange={(event) => {
              const severity =
                ALERT_SEVERITIES.find(
                  (option) => option === event.target.value,
                ) ?? "";

              onChange({ ...filters, severity });
            }}
            select
            slotProps={{
              inputLabel: { shrink: true },
              select: { native: true },
            }}
            value={filters.severity}
          >
            <option value="">All severities</option>
            {ALERT_SEVERITIES.map((severity) => (
              <option key={severity} value={severity}>
                {severity}
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Status"
            onChange={(event) => {
              const status =
                ALERT_STATUSES.find(
                  (option) => option === event.target.value,
                ) ?? "";

              onChange({ ...filters, status });
            }}
            select
            slotProps={{
              inputLabel: { shrink: true },
              select: { native: true },
            }}
            value={filters.status}
          >
            <option value="">All statuses</option>
            {ALERT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            helperText={`Available from ${dateBounds.min}`}
            label="Issued from"
            onChange={(event) => {
              onChange({ ...filters, issuedFrom: event.target.value });
            }}
            slotProps={{
              htmlInput: { min: dateBounds.min, max: dateBounds.max },
              inputLabel: { shrink: true },
            }}
            type="date"
            value={filters.issuedFrom}
          />
          <TextField
            fullWidth
            helperText={`Available through ${dateBounds.max}`}
            label="Issued to"
            onChange={(event) => {
              onChange({ ...filters, issuedTo: event.target.value });
            }}
            slotProps={{
              htmlInput: { min: dateBounds.min, max: dateBounds.max },
              inputLabel: { shrink: true },
            }}
            type="date"
            value={filters.issuedTo}
          />
        </Box>

        <Box>
          <Button disabled={!hasFilters} onClick={onClear} type="button">
            Clear filters
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
