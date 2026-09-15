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
import type { Alert } from '@/features/alerts/common/model/alert'
import type {
  AlertsDateBounds,
  AlertsListFilters,
  AlertsListState,
  AlertsSortDirection,
  AlertsSortKey,
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
        loadedCount: number
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
        loadedCount: number
        isUpdating: boolean
      } & AlertsPaginationState
    >

type AlertsPaginationState = Readonly<{
  hasMore: boolean
  isLoadingMore: boolean
  isLoadMoreDisabled: boolean
  loadMoreFailed: boolean
  onLoadMore: () => void
}>

export type UseAlertsResult = Readonly<{
  state: AlertsViewState
  listSearch: string
  filters: AlertsListFilters
  dateBounds: AlertsDateBounds
  sort: AlertsSortKey
  direction: AlertsSortDirection
  onFiltersChange: (filters: AlertsListFilters) => void
  onClearFilters: () => void
  onSort: (sort: AlertsSortKey) => void
  onPageChange: (page: number) => void
}>

export function useAlerts(): UseAlertsResult {
  const [searchParams, setSearchParams] = useSearchParams()
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
    const paginationState: AlertsPaginationState = {
      hasMore: alertsQuery.hasNextPage,
      isLoadingMore: alertsQuery.isFetchingNextPage,
      isLoadMoreDisabled:
        alertsQuery.isFetching && !alertsQuery.isFetchingNextPage,
      loadMoreFailed: alertsQuery.isFetchNextPageError,
      onLoadMore: () => {
        void alertsQuery.fetchNextPage()
      },
    }

    state =
      listRows.total === 0
        ? {
            kind: 'empty',
            loadedCount: loadedAlerts.length,
            ...paginationState,
          }
        : {
            kind: 'ready',
            alerts: listRows.rows,
            total: listRows.total,
            page: listRows.page,
            loadedCount: loadedAlerts.length,
            isUpdating:
              alertsQuery.isFetching && !alertsQuery.isFetchingNextPage,
            ...paginationState,
          }
  }

  return {
    state,
    listSearch: serializeAlertsListState(listState).toString(),
    filters: selectFilters(listState),
    dateBounds: parsedState.dateBounds,
    sort: listState.sort,
    direction: listState.direction,
    onFiltersChange: handleFiltersChange,
    onClearFilters: () => {
      handleFiltersChange({
        issuedFrom: '',
        issuedTo: '',
        area: '',
        severity: '',
        status: '',
        search: '',
      })
    },
    onSort: handleSort,
    onPageChange: (page) => {
      updateUrl({ ...listState, page })
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
