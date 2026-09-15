import { Chip, type ChipProps } from "@mui/material";

import type { AlertSeverity } from "../model/alert";

type AlertSeverityChipProps = Readonly<{
  severity: AlertSeverity;
}>;

const severityColors = {
  Extreme: "error",
  Severe: "warning",
  Moderate: "info",
  Minor: "success",
  Unknown: "default",
} satisfies Record<AlertSeverity, ChipProps["color"]>;

export function AlertSeverityChip({ severity }: AlertSeverityChipProps) {
  return (
    <Chip color={severityColors[severity]} label={severity} size="small" />
  );
}
