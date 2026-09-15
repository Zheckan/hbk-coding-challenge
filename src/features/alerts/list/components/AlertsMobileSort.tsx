import { Button, Stack, TextField } from '@mui/material'

import {
  ALERTS_SORT_KEYS,
  type AlertsSortDirection,
  type AlertsSortKey,
} from '../logic/alerts-list-state'

const SORT_LABELS = {
  severity: 'Severity',
  event: 'Event',
  affectedArea: 'Affected area',
  issuedAt: 'Issued time',
  expiresAt: 'Expiry time',
} satisfies Record<AlertsSortKey, string>

type AlertsMobileSortProps = Readonly<{
  sort: AlertsSortKey
  direction: AlertsSortDirection
  onSort: (sort: AlertsSortKey) => void
}>

export function AlertsMobileSort({
  sort,
  direction,
  onSort,
}: AlertsMobileSortProps) {
  const nextDirection = direction === 'asc' ? 'descending' : 'ascending'

  return (
    <Stack
      aria-label="Alert sorting"
      component="section"
      direction="row"
      spacing={1}
      sx={{
        alignItems: 'center',
        display: { xs: 'flex', md: 'none' },
      }}
    >
      <TextField
        fullWidth
        label="Sort alerts by"
        onChange={(event) => {
          const nextSort = ALERTS_SORT_KEYS.find(
            (sortKey) => sortKey === event.target.value,
          )

          if (nextSort !== undefined && nextSort !== sort) {
            onSort(nextSort)
          }
        }}
        select
        size="small"
        slotProps={{
          inputLabel: { shrink: true },
          select: { native: true },
        }}
        value={sort}
      >
        {ALERTS_SORT_KEYS.map((sortKey) => (
          <option key={sortKey} value={sortKey}>
            {SORT_LABELS[sortKey]}
          </option>
        ))}
      </TextField>
      <Button
        aria-label={`Change sort direction to ${nextDirection}`}
        onClick={() => {
          onSort(sort)
        }}
        size="large"
        sx={{ minWidth: 112 }}
        variant="outlined"
      >
        {direction === 'asc' ? 'Ascending' : 'Descending'}
      </Button>
    </Stack>
  )
}
