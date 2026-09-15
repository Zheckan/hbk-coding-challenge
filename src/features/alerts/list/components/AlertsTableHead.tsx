import type { SxProps, Theme } from '@mui/material'
import {
  Box,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  useMediaQuery,
} from '@mui/material'

import type {
  AlertsSortDirection,
  AlertsSortKey,
} from '../logic/alerts-list-state'

type AlertsTableHeadProps =
  | Readonly<{ kind: 'static' }>
  | Readonly<{
      kind: 'sortable'
      sort: AlertsSortKey
      direction: AlertsSortDirection
      onSort: (sort: AlertsSortKey) => void
    }>

export function AlertsTableHead(props: AlertsTableHeadProps) {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <TableHead>
      <TableRow>
        <SortableTableCell
          centerOnMobile
          label="Severity"
          minWidth={108}
          props={props}
          renderStatic={isMobile}
          sort="severity"
          width={{ xs: 92, md: 108 }}
        />
        <SortableTableCell
          label="Event"
          minWidth={180}
          props={props}
          renderStatic={isMobile}
          sort="event"
        />
        <TableCell
          scope="col"
          sx={{ display: { xs: 'none', md: 'table-cell' }, minWidth: 280 }}
        >
          Headline
        </TableCell>
        <SortableTableCell
          label="Affected area"
          minWidth={220}
          props={props}
          sort="affectedArea"
          desktopOnly
        />
        <SortableTableCell
          label="Issued"
          minWidth={180}
          props={props}
          sort="issuedAt"
          desktopOnly
        />
        <SortableTableCell
          label="Expires"
          minWidth={180}
          props={props}
          sort="expiresAt"
          desktopOnly
        />
        <TableCell
          scope="col"
          sx={{
            bgcolor: 'background.paper',
            position: { xs: 'static', md: 'sticky' },
            px: { xs: 0.25, md: 1 },
            right: 0,
            textAlign: 'center',
            width: { xs: 48, md: 72 },
            zIndex: 2,
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
            Details
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

function SortableTableCell({
  label,
  minWidth,
  sort,
  props,
  centerOnMobile = false,
  desktopOnly = false,
  renderStatic = false,
  width,
}: Readonly<{
  label: string
  minWidth: number
  sort: AlertsSortKey
  props: AlertsTableHeadProps
  centerOnMobile?: boolean
  desktopOnly?: boolean
  renderStatic?: boolean
  width?: Readonly<{ xs: number; md: number }>
}>) {
  const cellSx = {
    minWidth: { md: minWidth },
    ...(desktopOnly
      ? { display: { xs: 'none', md: 'table-cell' } }
      : undefined),
    ...(centerOnMobile
      ? { textAlign: { xs: 'center', md: 'left' } }
      : undefined),
    ...(width === undefined ? undefined : { width }),
  } satisfies SxProps<Theme>

  if (props.kind === 'static' || renderStatic) {
    return (
      <TableCell scope="col" sx={cellSx}>
        {label}
      </TableCell>
    )
  }

  const active = props.sort === sort

  return (
    <TableCell
      scope="col"
      sortDirection={active ? props.direction : false}
      sx={cellSx}
    >
      <TableSortLabel
        active={active}
        aria-label={`Sort by ${label.toLocaleLowerCase()}`}
        direction={active ? props.direction : 'asc'}
        onClick={() => {
          props.onSort(sort)
        }}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  )
}
