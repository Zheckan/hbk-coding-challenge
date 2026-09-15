import type { QueryClient } from '@tanstack/react-query'
import { RouterProvider, type RouterProviderProps } from 'react-router-dom'

import { AppProviders } from '@/app/AppProviders'

type AppProps = Readonly<{
  queryClient: QueryClient
  router: RouterProviderProps['router']
}>

export function App({ queryClient, router }: AppProps) {
  return (
    <AppProviders queryClient={queryClient}>
      <RouterProvider router={router} />
    </AppProviders>
  )
}
