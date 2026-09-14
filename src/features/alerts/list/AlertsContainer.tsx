import { useQuery } from "@tanstack/react-query";
import { fetchAlerts } from "@/features/alerts/common/api/nws-alerts";
import { AlertsView } from "./views/AlertsView";

const alertsQueryKey = ["alerts", "list"] as const;

export function AlertsContainer() {
  const alertsQuery = useQuery({
    queryKey: alertsQueryKey,
    queryFn: ({ signal }) => fetchAlerts({}, { signal }),
  });

  if (alertsQuery.isPending) {
    return <AlertsView state={{ kind: "loading" }} />;
  }

  if (alertsQuery.isError) {
    return <AlertsView state={{ kind: "error" }} />;
  }

  return (
    <AlertsView state={{ kind: "ready", alerts: alertsQuery.data.alerts }} />
  );
}
