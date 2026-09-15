import {
  FormControl,
  IconButton,
  InputLabel,
  Select,
  Stack,
  SvgIcon,
  TableCell,
  TableFooter,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'

import {
  ALERTS_PAGE_SIZES,
  type AlertsPageSize,
  isAlertsPageSize,
} from '../logic/alerts-list-state'

type AlertsPaginationProps = Readonly<{
  page: number
  pageCount: number
  pageSize: AlertsPageSize
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: AlertsPageSize) => void
}>

export function AlertsPagination({
  page,
  pageCount,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: AlertsPaginationProps) {
  const [pageDraft, setPageDraft] = useState({
    page,
    value: String(page),
  })
  const pageInput = pageDraft.page === page ? pageDraft.value : String(page)

  function handlePageInput(value: string): void {
    setPageDraft({ page, value })

    const nextPage = Number(value)

    if (
      Number.isSafeInteger(nextPage) &&
      nextPage >= 1 &&
      nextPage <= pageCount &&
      nextPage !== page
    ) {
      onPageChange(nextPage)
    }
  }

  function handlePageInputCommit(): void {
    const requestedPage = Number(pageInput)

    if (!Number.isSafeInteger(requestedPage)) {
      setPageDraft({ page, value: String(page) })
      return
    }

    const nextPage = Math.min(Math.max(requestedPage, 1), pageCount)
    setPageDraft({ page: nextPage, value: String(nextPage) })

    if (nextPage !== page) {
      onPageChange(nextPage)
    }
  }

  const firstRow = (page - 1) * pageSize + 1
  const lastRow = Math.min(page * pageSize, total)

  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={7} sx={{ py: 1 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{
              alignItems: { xs: 'stretch', sm: 'center' },
              flexWrap: 'wrap',
              gap: 1.5,
              justifyContent: 'flex-end',
            }}
          >
            <FormControl size="small" sx={{ minWidth: 136 }}>
              <InputLabel htmlFor="alerts-page-size">Rows per page</InputLabel>
              <Select<string>
                inputProps={{
                  'aria-label': 'Rows per page',
                  id: 'alerts-page-size',
                }}
                label="Rows per page"
                native
                onChange={(event) => {
                  const nextPageSize = Number.parseInt(event.target.value, 10)

                  if (isAlertsPageSize(nextPageSize)) {
                    onPageSizeChange(nextPageSize)
                  }
                }}
                value={String(pageSize)}
              >
                {ALERTS_PAGE_SIZES.map((option) => (
                  <option key={option} value={String(option)}>
                    {option}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Typography color="text.secondary" variant="body2">
              {firstRow}–{lastRow} of {total}
            </Typography>

            <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
              <TextField
                aria-label="Page"
                label="Page"
                onBlur={handlePageInputCommit}
                onChange={(event) => {
                  handlePageInput(event.target.value)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    handlePageInputCommit()
                  }
                }}
                size="small"
                slotProps={{
                  htmlInput: {
                    inputMode: 'numeric',
                    max: pageCount,
                    min: 1,
                  },
                }}
                sx={{ width: 76 }}
                type="number"
                value={pageInput}
              />
              <Typography color="text.secondary" variant="body2">
                of {pageCount}
              </Typography>
              <IconButton
                aria-label="Go to previous page"
                disabled={page === 1}
                onClick={() => {
                  onPageChange(page - 1)
                }}
              >
                <PreviousPageIcon />
              </IconButton>
              <IconButton
                aria-label="Go to next page"
                disabled={page === pageCount}
                onClick={() => {
                  onPageChange(page + 1)
                }}
              >
                <NextPageIcon />
              </IconButton>
            </Stack>
          </Stack>
        </TableCell>
      </TableRow>
    </TableFooter>
  )
}

function PreviousPageIcon() {
  return (
    <SvgIcon aria-hidden="true">
      <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </SvgIcon>
  )
}

function NextPageIcon() {
  return (
    <SvgIcon aria-hidden="true">
      <path d="m8.59 16.59 1.41 1.41 6-6-6-6-1.41 1.41L13.17 12z" />
    </SvgIcon>
  )
}
