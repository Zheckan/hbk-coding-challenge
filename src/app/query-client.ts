import { QueryClient } from '@tanstack/react-query'

// An NWS alert-list page can be several megabytes. Reuse loaded data for a
// minute instead of refetching every page on each mount or window focus.
const DEFAULT_STALE_TIME_MS = 60_000

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_STALE_TIME_MS,
      },
    },
  })
}
