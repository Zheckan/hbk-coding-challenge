import { afterEach, describe, expect, it, vi } from "vitest";

import { parseAlertsListState } from "./parseAlertsListState";

describe("alerts list URL state", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("parses valid URL values into normalized list state and an NWS query", () => {
    vi.stubEnv("TZ", "America/Chicago");

    const result = parseAlertsListState(
      new URLSearchParams({
        from: "2026-09-10",
        to: "2026-09-14",
        area: "ks",
        severity: "severe",
        status: "actual",
        q: "flood",
        sort: "severity",
        direction: "asc",
        page: "2",
      }),
      new Date(2026, 8, 14, 12),
    );

    expect(result).toEqual({
      kind: "valid",
      state: {
        issuedFrom: "2026-09-10",
        issuedTo: "2026-09-14",
        area: "KS",
        severity: "Severe",
        status: "Actual",
        search: "flood",
        sort: "severity",
        direction: "asc",
        page: 2,
      },
      dateBounds: {
        min: "2026-09-08",
        max: "2026-09-14",
      },
      query: {
        start: new Date(2026, 8, 10, 0, 0, 0, 0),
        end: new Date(2026, 8, 14, 23, 59, 59, 999),
        area: "KS",
        severity: "Severe",
        status: "Actual",
      },
    });
  });

  it("trims surrounding spaces from text search", () => {
    const result = parseAlertsListState(
      new URLSearchParams({ q: "  flood  " }),
      new Date(2026, 8, 14, 12),
    );

    expect(result.state.search).toBe("flood");
  });

  it.each([
    {
      name: "an invalid date",
      parameters: { from: "not-a-date" },
      error: "Issued from must be a valid date.",
    },
    {
      name: "a date outside the available history",
      parameters: { from: "2026-09-07" },
      error: "Issued from must be between 2026-09-08 and 2026-09-14.",
    },
    {
      name: "a reversed range",
      parameters: { from: "2026-09-14", to: "2026-09-13" },
      error: "Issued from must be on or before issued to.",
    },
    {
      name: "an unsupported area code",
      parameters: { area: "ZZ" },
      error: "Area must be a supported state, territory, or marine code.",
    },
  ])("rejects $name", ({ parameters, error }) => {
    const result = parseAlertsListState(
      new URLSearchParams(parameters),
      new Date(2026, 8, 14, 12),
    );

    expect(result.kind).toBe("invalid");

    if (result.kind !== "invalid") {
      throw new Error("Expected invalid alert list state");
    }

    expect(result.errors).toContain(error);
  });
});
