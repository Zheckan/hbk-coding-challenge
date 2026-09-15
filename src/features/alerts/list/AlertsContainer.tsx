import { skipToken, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { fetchAlerts } from "@/features/alerts/common/api/nws-alerts";
import { getAlertsListRows } from "./logic/alerts-list-rows";
import type { AlertsListFilters } from "./logic/alerts-list-state";
import {
  type AlertsSortKey,
  parseAlertsListState,
  serializeAlertsListState,
} from "./logic/alerts-list-state";
import { AlertsView } from "./views/AlertsView";

export function AlertsContainer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const parsedState = parseAlertsListState(searchParams);
  const listState = parsedState.state;
  const alertsQuery = useQuery({
    queryKey: [
      "alerts",
      "list",
      listState.issuedFrom,
      listState.issuedTo,
      listState.area,
      listState.severity,
      listState.status,
    ],
    queryFn:
      parsedState.kind === "valid"
        ? ({ signal }) => fetchAlerts(parsedState.query, { signal })
        : skipToken,
  });
  const filters = selectFilters(listState);

  function updateUrl(nextState: typeof listState): void {
    setSearchParams(serializeAlertsListState(nextState), { replace: true });
  }

  function handleFiltersChange(nextFilters: AlertsListFilters): void {
    updateUrl({ ...listState, ...nextFilters, page: 1 });
  }

  function handleSort(sort: AlertsSortKey): void {
    updateUrl({
      ...listState,
      sort,
      direction:
        listState.sort === sort && listState.direction === "asc"
          ? "desc"
          : "asc",
      page: 1,
    });
  }

  const commonProps = {
    filters,
    dateBounds: parsedState.dateBounds,
    sort: listState.sort,
    direction: listState.direction,
    onFiltersChange: handleFiltersChange,
    onClearFilters: () => {
      handleFiltersChange({
        issuedFrom: "",
        issuedTo: "",
        area: "",
        severity: "",
        status: "",
        search: "",
      });
    },
    onSort: handleSort,
    onPageChange: (page: number) => {
      updateUrl({ ...listState, page });
    },
  };

  if (parsedState.kind === "invalid") {
    return (
      <AlertsView
        {...commonProps}
        state={{ kind: "invalid", errors: parsedState.errors }}
      />
    );
  }

  if (alertsQuery.isPending) {
    return <AlertsView {...commonProps} state={{ kind: "loading" }} />;
  }

  if (alertsQuery.isError) {
    return <AlertsView {...commonProps} state={{ kind: "error" }} />;
  }

  const listRows = getAlertsListRows(alertsQuery.data.alerts, listState);

  return (
    <AlertsView
      {...commonProps}
      state={{
        kind: "ready",
        alerts: listRows.rows,
        total: listRows.total,
        page: listRows.page,
      }}
    />
  );
}

function selectFilters(
  state: ReturnType<typeof parseAlertsListState>["state"],
): AlertsListFilters {
  return {
    issuedFrom: state.issuedFrom,
    issuedTo: state.issuedTo,
    area: state.area,
    severity: state.severity,
    status: state.status,
    search: state.search,
  };
}
