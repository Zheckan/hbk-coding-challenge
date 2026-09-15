import {
  Chip,
  type ChipProps,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import {
  type Alert,
  type AlertSeverity,
} from "@/features/alerts/common/model/alert";
import { testIds } from "@/ui/utils/testIds";
import {
  ALERTS_PAGE_SIZE,
  type AlertsSortDirection,
  type AlertsSortKey,
} from "../logic/alerts-list-state";
import { formatAlertDate } from "../logic/formatAlertDate";
import { AlertsTableHead } from "./AlertsTableHead";

type AlertsTableProps = Readonly<{
  alerts: readonly Alert[];
  total: number;
  page: number;
  sort: AlertsSortKey;
  direction: AlertsSortDirection;
  onSort: (sort: AlertsSortKey) => void;
  onPageChange: (page: number) => void;
}>;

const severityColors = {
  Extreme: "error",
  Severe: "warning",
  Moderate: "info",
  Minor: "success",
  Unknown: "default",
} satisfies Record<AlertSeverity, ChipProps["color"]>;

export function AlertsTable({
  alerts,
  total,
  page,
  sort,
  direction,
  onSort,
  onPageChange,
}: AlertsTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="Weather alerts">
        <AlertsTableHead
          direction={direction}
          kind="sortable"
          onSort={onSort}
          sort={sort}
        />
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
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={7}
              count={total}
              onPageChange={(_event, nextPage) => {
                onPageChange(nextPage + 1);
              }}
              page={page - 1}
              rowsPerPage={ALERTS_PAGE_SIZE}
              rowsPerPageOptions={[ALERTS_PAGE_SIZE]}
            />
          </TableRow>
        </TableFooter>
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
