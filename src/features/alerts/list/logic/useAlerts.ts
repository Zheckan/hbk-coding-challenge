import {
  keepPreviousData,
  skipToken,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'

import { fetchAlerts } from '@/features/alerts/common/api/nws-alerts'
import {
  getNwsErrorKind,
  isRetryableNwsError,
  shouldRetryNwsRequest,
} from '@/features/alerts/common/api/nws-error-policy'
import { useCurrentTime } from '@/features/alerts/common/logic/useCurrentTime'
import type { Alert } from '@/features/alerts/common/model/alert'
import {
  type AlertsDateBounds,
  type AlertsListFilters,
  type AlertsListState,
  type AlertsPageSize,
  type AlertsSortDirection,
  type AlertsSortKey,
  DEFAULT_ALERTS_FILTERS,
} from './alerts-list-state'
import { getAlertsListRows } from './getAlertsListRows'
import { parseAlertsListState } from './parseAlertsListState'
import { serializeAlertsListState } from './serializeAlertsListState'

export type AlertsViewState =
  | Readonly<{ kind: 'loading' }>
  | Readonly<{ kind: 'invalid'; errors: readonly string[] }>
  | Readonly<
      {
        kind: 'empty'
      } & AlertsPaginationState
    >
  | Readonly<{ kind: 'rate-limit'; onRetry: () => void }>
  | Readonly<{
      kind: 'request-error'
      onRetry: (() => void) | null
    }>
  | Readonly<
      {
        kind: 'ready'
        alerts: readonly Alert[]
        total: number
        page: number
        pageCount: number
        pageSize: AlertsPageSize
        isUpdating: boolean
      } & AlertsPaginationState
    >
    | Readonly<{
        kind: 'asdfkbakjbf'
      }>

type AlertsPaginationState = Readonly<{
  hasMore: boolean
  isLoadingMore: boolean
  isLoadMoreDisabled: boolean
  loadMoreFailed: boolean
  onLoadMore: () => void
}>

export type AlertsTableControls = Readonly<{
  listSearch: string
  sort: AlertsSortKey
  direction: AlertsSortDirection
  onSort: (sort: AlertsSortKey) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: AlertsPageSize) => void
}>

export type UseAlertsResult = Readonly<{
  state: AlertsViewState
  now: number
  filters: AlertsListFilters
  dateBounds: AlertsDateBounds
  onFiltersChange: (filters: AlertsListFilters) => void
  onClearFilters: () => void
  tableControls: AlertsTableControls
}>

export function useAlerts(): UseAlertsResult {
  const [searchParams, setSearchParams] = useSearchParams()
  const now = useCurrentTime()
  const parsedState = parseAlertsListState(searchParams)
  const listState = parsedState.state
  const alertsQuery = useInfiniteQuery({
    queryKey: [
      'alerts',
      'list',
      listState.issuedFrom,
      listState.issuedTo,
      listState.area,
      listState.severity,
      listState.status,
    ],
    queryFn:
      parsedState.kind === 'valid'
        ? ({ signal, pageParam }) =>
            fetchAlerts(
              {
                ...parsedState.query,
                ...(pageParam === undefined ? {} : { cursor: pageParam }),
              },
              { signal },
            )
        : skipToken,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    placeholderData: keepPreviousData,
    retry: shouldRetryNwsRequest,
  })

  function updateUrl(nextState: AlertsListState): void {
    setSearchParams(serializeAlertsListState(nextState), { replace: true })
  }

  function handleFiltersChange(nextFilters: AlertsListFilters): void {
    updateUrl({ ...listState, ...nextFilters, page: 1 })
  }

  function handleSort(sort: AlertsSortKey): void {
    updateUrl({
      ...listState,
      sort,
      direction:
        listState.sort === sort && listState.direction === 'asc'
          ? 'desc'
          : 'asc',
      page: 1,
    })
  }

  let state: AlertsViewState

  if (parsedState.kind === 'invalid') {
    state = { kind: 'invalid', errors: parsedState.errors }
  } else if (alertsQuery.isPending) {
    state = { kind: 'loading' }
  } else if (alertsQuery.isError && alertsQuery.data === undefined) {
    const onRetry = () => {
      void alertsQuery.refetch()
    }

    state =
      getNwsErrorKind(alertsQuery.error) === 'rate-limit'
        ? { kind: 'rate-limit', onRetry }
        : {
            kind: 'request-error',
            onRetry: isRetryableNwsError(alertsQuery.error) ? onRetry : null,
          }
  } else {
    const loadedAlerts = alertsQuery.data.pages.flatMap((page) => page.alerts)
    const listRows = getAlertsListRows(loadedAlerts, listState)
    const isRefreshing =
      alertsQuery.isFetching && !alertsQuery.isFetchingNextPage
    const paginationState: AlertsPaginationState = {
      hasMore: alertsQuery.hasNextPage,
      isLoadingMore: alertsQuery.isFetchingNextPage,
      isLoadMoreDisabled: isRefreshing,
      loadMoreFailed: alertsQuery.isFetchNextPageError,
      onLoadMore: () => {
        void alertsQuery.fetchNextPage()
      },
    }

    state =
      listRows.total === 0
        ? {
            kind: 'empty',
            ...paginationState,
          }
        : {
            kind: 'ready',
            alerts: listRows.rows,
            total: listRows.total,
            page: listRows.page,
            pageCount: listRows.pageCount,
            pageSize: listState.pageSize,
            isUpdating: isRefreshing,
            ...paginationState,
          }
  }

  state.kind = 'asd'

  return {
    state,
    now,
    filters: selectFilters(listState),
    dateBounds: parsedState.dateBounds,
    onFiltersChange: handleFiltersChange,
    onClearFilters: () => {
      handleFiltersChange(DEFAULT_ALERTS_FILTERS)
    },
    tableControls: {
      listSearch: serializeAlertsListState(listState).toString(),
      sort: listState.sort,
      direction: listState.direction,
      onSort: handleSort,
      onPageChange: (page) => {
        updateUrl({ ...listState, page })
      },
      onPageSizeChange: (pageSize) => {
        updateUrl({ ...listState, page: 1, pageSize })
      },
    },
  }
}

function selectFilters(state: AlertsListState): AlertsListFilters {
  return {
    issuedFrom: state.issuedFrom,
    issuedTo: state.issuedTo,
    area: state.area,
    severity: state.severity,
    status: state.status,
    search: state.search,
  }
}
