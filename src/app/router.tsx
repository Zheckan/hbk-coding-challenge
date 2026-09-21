import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from 'react-router-dom'

import { AppLayout } from '@/app/AppLayout'

export const appRoutes = [
  {
    element: <AppLayout />,
    hydrateFallbackElement: (
      <div aria-label="Loading application" role="status">
        Loading…
      </div>
    ),
    children: [
      { index: true, element: <Navigate replace to="/alerts" /> },
      {
        path: '/alerts',
        // lazy render is to stop loading js for detailed pages until the user navigates to them
        lazy: async () => ({
          Component: (await import('@/pages/AlertsPage')).AlertsPage,
        }),
      },
      {
        path: '/alerts/:alertId',
        lazy: async () => ({
          Component: (await import('@/pages/AlertDetailsPage'))
            .AlertDetailsPage,
        }),
      },
      {
        path: '*',
        lazy: async () => ({
          Component: (await import('@/pages/NotFoundPage')).NotFoundPage,
        }),
      },
    ],
  },
] satisfies RouteObject[]

export function createAppRouter(): ReturnType<typeof createBrowserRouter> {
  return createBrowserRouter(appRoutes)
}
