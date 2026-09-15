import { describe, expect, it } from "vitest";

import { parseAlertCollection } from "@/features/alerts/common/api/nws-alerts.schema";
import listFixture from "@/test/fixtures/nws-alert-list.json";
import { getAlertsListRows } from "./alerts-list-rows";
import type { AlertsListState } from "./alerts-list-state";

const alerts = parseAlertCollection(listFixture).alerts;
const firstAlert = alerts[0];

if (firstAlert === undefined) {
  throw new Error("The alert fixture must contain an alert");
}

const defaultState = {
  issuedFrom: "",
  issuedTo: "",
  area: "",
  severity: "",
  status: "",
  search: "",
  sort: "issuedAt",
  direction: "desc",
  page: 1,
} satisfies AlertsListState;

describe("alerts list rows", () => {
  it.each([
    {
      field: "event",
      search: "special weather",
      id: "urn:oid:test.nullable",
    },
    {
      field: "headline",
      search: "issued september",
      id: "urn:oid:test.complete",
    },
    {
      field: "affected area",
      search: "daviess",
      id: "urn:oid:test.complete",
    },
  ])("searches loaded alerts by $field", ({ search, id }) => {
    const result = getAlertsListRows(alerts, { ...defaultState, search });

    expect(result.rows.map((alert) => alert.id)).toEqual([id]);
    expect(result.total).toBe(1);
  });

  it("sorts severity using the domain order", () => {
    const result = getAlertsListRows(alerts, {
      ...defaultState,
      sort: "severity",
      direction: "asc",
    });

    expect(result.rows.map((alert) => alert.severity)).toEqual([
      "Severe",
      "Unknown",
    ]);
  });

  it("sorts timestamps by their actual instant", () => {
    const result = getAlertsListRows(alerts, {
      ...defaultState,
      sort: "expiresAt",
      direction: "asc",
    });

    expect(result.rows.map((alert) => alert.id)).toEqual([
      "urn:oid:test.nullable",
      "urn:oid:test.complete",
    ]);
  });

  it("returns 25 alerts per page", () => {
    const manyAlerts = Array.from({ length: 26 }, (_, index) => ({
      ...firstAlert,
      id: `alert-${String(index + 1).padStart(2, "0")}`,
      event: `Alert ${String(index + 1).padStart(2, "0")}`,
    }));

    const result = getAlertsListRows(manyAlerts, {
      ...defaultState,
      sort: "event",
      direction: "asc",
      page: 2,
    });

    expect(result.rows.map((alert) => alert.id)).toEqual(["alert-26"]);
    expect(result).toMatchObject({ total: 26, page: 2, pageCount: 2 });
  });
});
