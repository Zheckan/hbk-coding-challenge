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
const SKELETON_ROW_HEIGHT = 88

export function AlertsTableSkeleton() {
  return (
    <Box aria-label="Loading weather alerts" role="status">
      <TableContainer
        component={Paper}
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          maxWidth: '100%',
          overflowX: 'hidden',
        }}
      >
        <Table
          aria-busy="true"
          aria-label="Weather alerts loading"
          size="small"
          sx={{
            minWidth: { xs: '100%', md: 1180 },
            width: '100%',
            '& .MuiTableCell-root': {
              px: { xs: 1, sm: 2 },
              py: 1.5,
              verticalAlign: 'middle',
            },
          }}
        >
          <AlertsTableHead kind="static" />
          <TableBody>
            {skeletonRows.map((row) => (
              <TableRow key={row} sx={{ height: SKELETON_ROW_HEIGHT }}>
                <TableCell
                  sx={{
                    textAlign: { xs: 'center', md: 'left' },
                    width: { xs: 92, md: 108 },
                  }}
                >
                  <Skeleton
                    height={24}
                    sx={{ mx: { xs: 'auto', md: 0 } }}
                    variant="rounded"
                    width={64}
                  />
                </TableCell>
                <TableCell>
                  <Skeleton width="75%" />
                  <Skeleton
                    sx={{ display: { xs: 'block', md: 'none' }, mt: 0.5 }}
                    width="90%"
                  />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Skeleton width="90%" />
                  <Skeleton width="75%" />
                  <Skeleton width="55%" />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Skeleton width="85%" />
                  <Skeleton width="65%" />
                  <Skeleton width="45%" />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Skeleton width={145} />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Skeleton width={145} />
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: 'background.paper',
                    px: { xs: 0.5, md: 1 },
                    position: { xs: 'static', md: 'sticky' },
                    right: 0,
                    width: { xs: 48, md: 72 },
                    zIndex: 1,
                  }}
                >
                  <Skeleton
                    height={24}
                    sx={{ mx: 'auto' }}
                    variant="circular"
                    width={24}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
