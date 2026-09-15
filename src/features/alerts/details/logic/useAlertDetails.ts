import {
  type QueryClient,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

import { fetchAlert } from "@/features/alerts/common/api/nws-alerts";
import type { Alert, AlertPage } from "@/features/alerts/common/model/alert";

export type AlertDetailsViewState =
  | Readonly<{ kind: "loading" }>
  | Readonly<{ kind: "error" }>
  | Readonly<{ kind: "ready"; alert: Alert }>;

export type UseAlertDetailsResult = Readonly<{
  state: AlertDetailsViewState;
  backTo: string;
}>;

export function useAlertDetails(alertId: string): UseAlertDetailsResult {
  const queryClient = useQueryClient();
  const location = useLocation();
  const cachedAlert = findAlertInListCache(queryClient, alertId);
  const alertQuery = useQuery({
    queryKey: ["alerts", "detail", alertId],
    queryFn: ({ signal }) => fetchAlert(alertId, { signal }),
    enabled: cachedAlert === undefined,
    initialData: cachedAlert,
  });

  let state: AlertDetailsViewState;

  if (alertQuery.isError) {
    state = { kind: "error" };
  } else if (alertQuery.data !== undefined) {
    state = { kind: "ready", alert: alertQuery.data };
  } else {
    state = { kind: "loading" };
  }

  return {
    state,
    backTo: `/alerts${location.search}`,
  };
}

function findAlertInListCache(
  queryClient: QueryClient,
  alertId: string,
): Alert | undefined {
  const cachedPages = queryClient.getQueriesData<AlertPage>({
    queryKey: ["alerts", "list"],
  });

  for (const [, page] of cachedPages) {
    const alert = page?.alerts.find((candidate) => candidate.id === alertId);

    if (alert !== undefined) {
      return alert;
    }
  }

  return undefined;
}
