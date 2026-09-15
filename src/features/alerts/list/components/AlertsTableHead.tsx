import { TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";

import type {
  AlertsSortDirection,
  AlertsSortKey,
} from "../logic/alerts-list-state";

type AlertsTableHeadProps =
  | Readonly<{ kind: "static" }>
  | Readonly<{
      kind: "sortable";
      sort: AlertsSortKey;
      direction: AlertsSortDirection;
      onSort: (sort: AlertsSortKey) => void;
    }>;

export function AlertsTableHead(props: AlertsTableHeadProps) {
  return (
    <TableHead>
      <TableRow>
        <SortableTableCell label="Severity" props={props} sort="severity" />
        <SortableTableCell label="Event" props={props} sort="event" />
        <TableCell scope="col">Headline</TableCell>
        <SortableTableCell
          label="Affected area"
          props={props}
          sort="affectedArea"
        />
        <SortableTableCell label="Issued" props={props} sort="issuedAt" />
        <SortableTableCell label="Expires" props={props} sort="expiresAt" />
        <TableCell scope="col">Details</TableCell>
      </TableRow>
    </TableHead>
  );
}

function SortableTableCell({
  label,
  sort,
  props,
}: Readonly<{
  label: string;
  sort: AlertsSortKey;
  props: AlertsTableHeadProps;
}>) {
  if (props.kind === "static") {
    return <TableCell scope="col">{label}</TableCell>;
  }

  const active = props.sort === sort;

  return (
    <TableCell scope="col" sortDirection={active ? props.direction : false}>
      <TableSortLabel
        active={active}
        aria-label={`Sort by ${label.toLocaleLowerCase()}`}
        direction={active ? props.direction : "asc"}
        onClick={() => {
          props.onSort(sort);
        }}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
}
