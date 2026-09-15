import {
  ALERT_SEVERITIES,
  ALERT_STATUSES,
  type AlertSeverity,
  type AlertStatus,
} from "@/features/alerts/common/model/alert";
import type { AlertQuery } from "@/features/alerts/common/model/alert-query";
import { isAlertAreaCode } from "./alert-area-options";

export const ALERTS_PAGE_SIZE = 25;

export const ALERTS_SORT_KEYS = [
  "severity",
  "event",
  "affectedArea",
  "issuedAt",
  "expiresAt",
] as const;

export type AlertsSortKey = (typeof ALERTS_SORT_KEYS)[number];
export type AlertsSortDirection = "asc" | "desc";

export type AlertsListState = Readonly<{
  issuedFrom: string;
  issuedTo: string;
  area: string;
  severity: AlertSeverity | "";
  status: AlertStatus | "";
  search: string;
  sort: AlertsSortKey;
  direction: AlertsSortDirection;
  page: number;
}>;

export type AlertsListFilters = Pick<
  AlertsListState,
  "issuedFrom" | "issuedTo" | "area" | "severity" | "status" | "search"
>;

export type AlertsDateBounds = Readonly<{
  min: string;
  max: string;
}>;

export type ParsedAlertsListState =
  | Readonly<{
      kind: "valid";
      state: AlertsListState;
      dateBounds: AlertsDateBounds;
      query: AlertQuery;
    }>
  | Readonly<{
      kind: "invalid";
      state: AlertsListState;
      dateBounds: AlertsDateBounds;
      errors: readonly string[];
    }>;

const DEFAULT_SORT: AlertsSortKey = "issuedAt";
const DEFAULT_DIRECTION: AlertsSortDirection = "desc";

export function parseAlertsListState(
  searchParams: URLSearchParams,
  now = new Date(),
): ParsedAlertsListState {
  const today = startOfLocalDay(now);
  const earliestDate = new Date(today);
  earliestDate.setDate(earliestDate.getDate() - 6);

  const dateBounds = {
    min: formatLocalDate(earliestDate),
    max: formatLocalDate(today),
  };
  const state = parseState(searchParams);
  const errors: string[] = [];

  const issuedFrom = parseSelectedDate({
    label: "Issued from",
    value: state.issuedFrom,
    dateBounds,
    errors,
  });
  const issuedTo = parseSelectedDate({
    label: "Issued to",
    value: state.issuedTo,
    dateBounds,
    errors,
  });

  if (state.area !== "" && !isAlertAreaCode(state.area)) {
    errors.push("Area must be a supported state, territory, or marine code.");
  }

  if (issuedFrom !== null && issuedTo !== null && issuedFrom > issuedTo) {
    errors.push("Issued from must be on or before issued to.");
  }

  if (errors.length > 0) {
    return { kind: "invalid", state, dateBounds, errors };
  }

  return {
    kind: "valid",
    state,
    dateBounds,
    query: {
      ...(issuedFrom === null ? {} : { start: issuedFrom }),
      ...(issuedTo === null ? {} : { end: endOfLocalDay(issuedTo) }),
      ...(state.area === "" ? {} : { area: state.area }),
      ...(state.severity === "" ? {} : { severity: state.severity }),
      ...(state.status === "" ? {} : { status: state.status }),
    },
  };
}

export function serializeAlertsListState(
  state: AlertsListState,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  setWhenPresent(searchParams, "from", state.issuedFrom);
  setWhenPresent(searchParams, "to", state.issuedTo);
  setWhenPresent(searchParams, "area", state.area);
  setWhenPresent(searchParams, "severity", state.severity.toLowerCase());
  setWhenPresent(searchParams, "status", state.status.toLowerCase());
  setWhenPresent(searchParams, "q", state.search);

  if (state.sort !== DEFAULT_SORT) {
    searchParams.set("sort", state.sort);
  }

  if (state.direction !== DEFAULT_DIRECTION) {
    searchParams.set("direction", state.direction);
  }

  if (state.page > 1) {
    searchParams.set("page", String(state.page));
  }

  return searchParams;
}

function parseState(searchParams: URLSearchParams): AlertsListState {
  const severityParameter = searchParams.get("severity")?.toLowerCase();
  const statusParameter = searchParams.get("status")?.toLowerCase();
  const sortParameter = searchParams.get("sort");
  const directionParameter = searchParams.get("direction");
  const pageParameter = Number(searchParams.get("page"));

  return {
    issuedFrom: searchParams.get("from") ?? "",
    issuedTo: searchParams.get("to") ?? "",
    area: (searchParams.get("area") ?? "").trim().toUpperCase(),
    severity:
      ALERT_SEVERITIES.find(
        (severity) => severity.toLowerCase() === severityParameter,
      ) ?? "",
    status:
      ALERT_STATUSES.find(
        (status) => status.toLowerCase() === statusParameter,
      ) ?? "",
    search: (searchParams.get("q") ?? "").trim(),
    sort:
      ALERTS_SORT_KEYS.find((sortKey) => sortKey === sortParameter) ??
      DEFAULT_SORT,
    direction: directionParameter === "asc" ? "asc" : DEFAULT_DIRECTION,
    page:
      Number.isSafeInteger(pageParameter) && pageParameter > 0
        ? pageParameter
        : 1,
  };
}

function parseSelectedDate(input: {
  label: string;
  value: string;
  dateBounds: AlertsDateBounds;
  errors: string[];
}): Date | null {
  if (input.value === "") {
    return null;
  }

  const date = parseLocalDate(input.value);

  if (date === null) {
    input.errors.push(`${input.label} must be a valid date.`);
    return null;
  }

  const formattedDate = formatLocalDate(date);

  if (
    formattedDate < input.dateBounds.min ||
    formattedDate > input.dateBounds.max
  ) {
    input.errors.push(
      `${input.label} must be between ${input.dateBounds.min} and ${input.dateBounds.max}.`,
    );
  }

  return date;
}

function parseLocalDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [yearText, monthText, dayText] = value.split("-");

  if (
    yearText === undefined ||
    monthText === undefined ||
    dayText === undefined
  ) {
    return null;
  }

  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfLocalDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
}

function formatLocalDate(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function setWhenPresent(
  searchParams: URLSearchParams,
  name: string,
  value: string,
): void {
  if (value !== "") {
    searchParams.set(name, value);
  }
}
