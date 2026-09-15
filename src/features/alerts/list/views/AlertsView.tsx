import { Box, Link, Stack, Typography } from '@mui/material'
import { useRef } from 'react'

import { AlertsFilters } from '../components/AlertsFilters'
import { AlertsResults } from '../components/AlertsResults'
import type { UseAlertsResult } from '../logic/useAlerts'

export function AlertsView({
  state,
  listSearch,
  filters,
  dateBounds,
  sort,
  direction,
  onFiltersChange,
  onClearFilters,
  onSort,
  onPageChange,
}: UseAlertsResult) {
  const resultsRef = useRef<HTMLElement>(null)

  return (
    <Stack spacing={{ xs: 2.5, md: 3.5 }} sx={{ minWidth: 0 }}>
      <Link
        href="#alert-results"
        onClick={(event) => {
          event.preventDefault()
          resultsRef.current?.focus()
        }}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 3,
          left: 8,
          px: 2,
          py: 1,
          position: 'fixed',
          top: 8,
          transform: 'translateY(calc(-100% - 16px))',
          transition: 'transform 120ms ease-out',
          zIndex: 1300,
          '&:focus': {
            transform: 'translateY(0)',
          },
        }}
      >
        Skip to alert results
      </Link>

      <Stack
        component="header"
        spacing={1}
        sx={{
          borderLeft: 4,
          borderColor: 'primary.main',
          maxWidth: 760,
          pl: { xs: 2, sm: 2.5 },
          py: 0.5,
        }}
      >
        <Typography component="h1" variant="h3">
          Weather alerts
        </Typography>
        <Typography color="text.secondary" variant="body1">
          National Weather Service alert explorer
        </Typography>
      </Stack>

      <AlertsFilters
        dateBounds={dateBounds}
        filters={filters}
        onChange={onFiltersChange}
        onClear={onClearFilters}
      />

      <Box
        aria-label="Alert results"
        component="section"
        id="alert-results"
        ref={resultsRef}
        sx={{ minWidth: 0, scrollMarginTop: 16 }}
        tabIndex={-1}
      >
        <AlertsResults
          direction={direction}
          listSearch={listSearch}
          onPageChange={onPageChange}
          onSort={onSort}
          sort={sort}
          state={state}
        />
      </Box>
    </Stack>
  )
}
