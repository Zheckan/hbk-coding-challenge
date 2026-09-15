import {
  type InfiniteData,
  type QueryClient,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'

import { fetchAlert } from '@/features/alerts/common/api/nws-alerts'
import {
  getNwsErrorKind,
  isRetryableNwsError,
  shouldRetryNwsRequest,
} from '@/features/alerts/common/api/nws-error-policy'
import { useCurrentTime } from '@/features/alerts/common/logic/useCurrentTime'
import type { Alert, AlertPage } from '@/features/alerts/common/model/alert'

export type AlertDetailsViewState =
  | Readonly<{ kind: 'loading' }>
  | Readonly<{ kind: 'not-found' }>
  | Readonly<{ kind: 'rate-limit'; onRetry: () => void }>
  | Readonly<{
      kind: 'request-error'
      onRetry: (() => void) | null
    }>
  | Readonly<{ kind: 'ready'; alert: Alert }>

export type UseAlertDetailsResult = Readonly<{
  state: AlertDetailsViewState
  now: number
  backTo: string
}>

export function useAlertDetails(alertId: string): UseAlertDetailsResult {
  const queryClient = useQueryClient()
  const location = useLocation()
  const now = useCurrentTime()
  const cachedAlert = findAlertInListCache(queryClient, alertId)
  const alertQuery = useQuery({
    queryKey: ['alerts', 'detail', alertId],
    queryFn: ({ signal }) => fetchAlert(alertId, { signal }),
    enabled: cachedAlert === undefined,
    initialData: cachedAlert,
    retry: shouldRetryNwsRequest,
  })

  let state: AlertDetailsViewState

  if (alertQuery.isError) {
    const errorKind = getNwsErrorKind(alertQuery.error)
    const onRetry = () => {
      void alertQuery.refetch()
    }

    if (errorKind === 'not-found') {
      state = { kind: 'not-found' }
    } else if (errorKind === 'rate-limit') {
      state = { kind: 'rate-limit', onRetry }
    } else {
      state = {
        kind: 'request-error',
        onRetry: isRetryableNwsError(alertQuery.error) ? onRetry : null,
      }
    }
  } else if (alertQuery.data !== undefined) {
    state = { kind: 'ready', alert: alertQuery.data }
  } else {
    state = { kind: 'loading' }
  }

  return {
    state,
    now,
    backTo: `/alerts${location.search}`,
  }
}

function findAlertInListCache(
  queryClient: QueryClient,
  alertId: string,
): Alert | undefined {
  const cachedQueries = queryClient.getQueriesData<InfiniteData<AlertPage>>({
    queryKey: ['alerts', 'list'],
  })

  for (const [, data] of cachedQueries) {
    const alert = data?.pages
      .flatMap((page) => page.alerts)
      .find((candidate) => candidate.id === alertId)

    if (alert !== undefined) {
      return alert
    }
  }

  return undefined
}
