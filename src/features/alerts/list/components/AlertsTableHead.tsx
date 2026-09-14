import { TableCell, TableHead, TableRow } from "@mui/material";

export function AlertsTableHead() {
  return (
    <TableHead>
      <TableRow>
        <TableCell scope="col">Severity</TableCell>
        <TableCell scope="col">Event</TableCell>
        <TableCell scope="col">Headline</TableCell>
        <TableCell scope="col">Affected area</TableCell>
        <TableCell scope="col">Issued</TableCell>
        <TableCell scope="col">Expires</TableCell>
        <TableCell scope="col">Details</TableCell>
      </TableRow>
    </TableHead>
  );
}
