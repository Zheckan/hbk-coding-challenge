import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material'

import { AlertsTableHead } from './AlertsTableHead'

const skeletonRows = [0, 1, 2, 3, 4] as const

export function AlertsTableSkeleton() {
  return (
    <Box aria-label="Loading weather alerts" role="status">
      <TableContainer component={Paper}>
        <Table aria-busy="true" aria-label="Weather alerts loading">
          <AlertsTableHead kind="static" />
          <TableBody>
            {skeletonRows.map((row) => (
              <TableRow key={row}>
                <TableCell>
                  <Skeleton height={24} variant="rounded" width={64} />
                </TableCell>
                <TableCell>
                  <Skeleton width="75%" />
                </TableCell>
                <TableCell>
                  <Skeleton width="90%" />
                </TableCell>
                <TableCell>
                  <Skeleton width="85%" />
                </TableCell>
                <TableCell>
                  <Skeleton width={145} />
                </TableCell>
                <TableCell>
                  <Skeleton width={145} />
                </TableCell>
                <TableCell>
                  <Skeleton width={72} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
