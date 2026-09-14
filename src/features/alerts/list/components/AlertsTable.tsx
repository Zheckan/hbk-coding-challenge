import {
  Chip,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  type ChipProps,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  type Alert,
  type AlertSeverity,
} from "@/features/alerts/common/model/alert";
import { testIds } from "@/ui/utils/testIds";
import { formatAlertDate } from "../logic/format-alert-date";
import { AlertsTableHead } from "./AlertsTableHead";

type AlertsTableProps = Readonly<{
  alerts: readonly Alert[];
}>;

const severityColors = {
  Extreme: "error",
  Severe: "warning",
  Moderate: "info",
  Minor: "success",
  Unknown: "default",
} satisfies Record<AlertSeverity, ChipProps["color"]>;

export function AlertsTable({ alerts }: AlertsTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="Weather alerts">
        <AlertsTableHead />
        <TableBody>
          {alerts.map((alert) => (
            <TableRow
              data-testid={testIds.alerts.list.row(alert.id)}
              key={alert.id}
            >
              <TableCell>
                <Chip
                  color={severityColors[alert.severity]}
                  label={alert.severity}
                  size="small"
                />
              </TableCell>
              <TableCell component="th" scope="row">
                {alert.event}
              </TableCell>
              <TableCell>{alert.headline ?? "No headline provided"}</TableCell>
              <TableCell>{alert.affectedArea}</TableCell>
              <TableCell>
                <AlertTime dateTime={alert.issuedAt} />
              </TableCell>
              <TableCell>
                <AlertTime dateTime={alert.expiresAt} />
              </TableCell>
              <TableCell>
                <Link
                  aria-label={`View details for ${alert.event}`}
                  component={RouterLink}
                  to={`/alerts/${encodeURIComponent(alert.id)}`}
                >
                  View details
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function AlertTime({ dateTime }: Readonly<{ dateTime: string }>) {
  return (
    <time dateTime={dateTime} style={{ whiteSpace: "nowrap" }}>
      {formatAlertDate(dateTime)}
    </time>
  );
}
