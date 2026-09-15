import {
  Box,
  Link,
  Paper,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material'
import { darken } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'

import { AlertSeverityChip } from '@/features/alerts/common/components/AlertSeverityChip'
import { formatAlertDate } from '@/features/alerts/common/logic/formatAlertDate'
import { type Alert } from '@/features/alerts/common/model/alert'
import { testIds } from '@/ui/utils/testIds'
import {
  type AlertsPageSize,
  type AlertsSortDirection,
  type AlertsSortKey,
} from '../logic/alerts-list-state'
import { AlertsPagination } from './AlertsPagination'
import { AlertsTableHead } from './AlertsTableHead'

type AlertsTableProps = Readonly<{
  alerts: readonly Alert[]
  listSearch: string
  total: number
  page: number
  pageCount: number
  pageSize: AlertsPageSize
  sort: AlertsSortKey
  direction: AlertsSortDirection
  onSort: (sort: AlertsSortKey) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: AlertsPageSize) => void
}>

export function AlertsTable({
  alerts,
  listSearch,
  total,
  page,
  pageCount,
  pageSize,
  sort,
  direction,
  onSort,
  onPageChange,
  onPageSizeChange,
}: AlertsTableProps) {
  return (
    <TableContainer
      aria-label="Weather alerts table"
      component={Paper}
      role="region"
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        maxWidth: '100%',
        minWidth: 0,
        overflowX: { xs: 'hidden', md: 'auto' },
        width: '100%',
      }}
      tabIndex={0}
    >
      <Table
        aria-label="Weather alerts"
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
              hover
              key={alert.id}
              sx={(theme) => ({
                bgcolor: 'background.paper',
                '&.MuiTableRow-hover:hover': {
                  bgcolor: darken(
                    theme.palette.background.paper,
                    theme.palette.action.hoverOpacity,
                  ),
                },
              })}
            >
              <TableCell
                sx={{
                  textAlign: { xs: 'center', md: 'left' },
                  width: { xs: 92, md: 108 },
                }}
              >
                <AlertSeverityChip severity={alert.severity} />
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                sx={{ minWidth: { md: 180 }, overflowWrap: 'anywhere' }}
              >
                <Box
                  component="span"
                  sx={{ display: 'block', fontWeight: 500 }}
                >
                  {alert.event}
                </Box>
                <Box
                  component="span"
                  sx={{
                    color: 'text.secondary',
                    display: { xs: '-webkit-box', md: 'none' },
                    fontSize: '0.75rem',
                    lineHeight: 1.35,
                    mt: 0.5,
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                  }}
                >
                  {alert.affectedArea}
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  display: { xs: 'none', md: 'table-cell' },
                  minWidth: 280,
                }}
              >
                <ClampedTableText>
                  {alert.headline ?? 'No headline provided'}
                </ClampedTableText>
              </TableCell>
              <TableCell
                sx={{
                  display: { xs: 'none', md: 'table-cell' },
                  minWidth: 220,
                }}
              >
                <ClampedTableText>{alert.affectedArea}</ClampedTableText>
              </TableCell>
              <TableCell
                sx={{
                  display: { xs: 'none', md: 'table-cell' },
                  minWidth: 180,
                }}
              >
                <AlertTime dateTime={alert.issuedAt} />
              </TableCell>
              <TableCell
                sx={{
                  display: { xs: 'none', md: 'table-cell' },
                  minWidth: 180,
                }}
              >
                <AlertTime dateTime={alert.expiresAt} />
              </TableCell>
              <TableCell
                sx={{
                  bgcolor: 'inherit',
                  px: { xs: 0.25, md: 1 },
                  position: { xs: 'static', md: 'sticky' },
                  right: 0,
                  textAlign: 'center',
                  width: { xs: 48, md: 72 },
                  zIndex: 1,
                }}
              >
                <Link
                  aria-label={`View details for ${alert.event}`}
                  component={RouterLink}
                  sx={{
                    alignItems: 'center',
                    borderRadius: 1,
                    display: 'inline-flex',
                    justifyContent: 'center',
                    minHeight: 44,
                    minWidth: 44,
                  }}
                  to={`/alerts/${encodeURIComponent(alert.id)}${
                    listSearch === '' ? '' : `?${listSearch}`
                  }`}
                >
                  <DetailsArrowIcon />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <AlertsPagination
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          page={page}
          pageCount={pageCount}
          pageSize={pageSize}
          total={total}
        />
      </Table>
    </TableContainer>
  )
}

function AlertTime({ dateTime }: Readonly<{ dateTime: string }>) {
  return <time dateTime={dateTime}>{formatAlertDate(dateTime)}</time>
}

function ClampedTableText({ children }: Readonly<{ children: string }>) {
  return (
    <Box
      component="span"
      sx={{
        display: '-webkit-box',
        overflow: 'hidden',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 3,
      }}
    >
      {children}
    </Box>
  )
}

function DetailsArrowIcon() {
  return (
    <SvgIcon aria-hidden="true">
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
    </SvgIcon>
  )
}
