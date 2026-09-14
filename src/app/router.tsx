import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";
import { AppLayout } from "@/app/AppLayout";
import { NotFoundPage } from "@/app/NotFoundPage";
import { AlertDetailsPage } from "@/pages/AlertDetailsPage";
import { AlertsPage } from "@/pages/AlertsPage";

export const appRoutes = [
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate replace to="/alerts" /> },
      { path: "/alerts", element: <AlertsPage /> },
      { path: "/alerts/:alertId", element: <AlertDetailsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
] satisfies RouteObject[];

export function createAppRouter(): ReturnType<typeof createBrowserRouter> {
  return createBrowserRouter(appRoutes);
}
