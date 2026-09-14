import { screen, within } from "@testing-library/react";
import { delay, HttpResponse, http } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderApp } from "@/test/render-app";
import { server } from "@/test/server";
import { testIds } from "@/ui/utils/testIds";

describe("alerts list", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("shows a table-shaped skeleton while alerts load", () => {
    server.use(
      http.get("https://api.weather.gov/alerts", async () => {
        await delay("infinite");

        return HttpResponse.json({});
      }),
    );

    renderApp({ initialEntries: ["/alerts"] });

    const loadingState = screen.getByRole("status", {
      name: "Loading weather alerts",
    });
    const loadingTable = within(loadingState).getByRole("table", {
      name: "Weather alerts loading",
    });

    expect(within(loadingTable).getAllByRole("row").length).toBeGreaterThan(1);
  });

  it("shows NWS alerts in a semantic table", async () => {
    vi.stubEnv("TZ", "America/Chicago");
    renderApp({ initialEntries: ["/alerts"] });

    const table = await screen.findByRole("table", {
      name: "Weather alerts",
    });

    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((heading) => heading.textContent),
    ).toEqual([
      "Severity",
      "Event",
      "Headline",
      "Affected area",
      "Issued",
      "Expires",
      "Details",
    ]);

    const alertRow = within(table).getByTestId(
      testIds.alerts.list.row("urn:oid:test.complete"),
    );

    expect(within(alertRow).getByText("Severe")).toBeVisible();
    expect(within(alertRow).getByText("Flash Flood Warning")).toBeVisible();
    expect(
      within(alertRow).getByText(
        "Flash Flood Warning issued September 14 at 8:29AM CDT",
      ),
    ).toBeVisible();
    expect(within(alertRow).getByText("Daviess, MO; DeKalb, MO")).toBeVisible();
    expect(
      within(alertRow).getByText("Sep 14, 2026, 8:29 AM CDT"),
    ).toBeVisible();
    expect(
      within(alertRow).getByText("Sep 14, 2026, 1:30 PM CDT"),
    ).toBeVisible();
    expect(
      within(alertRow).getByRole("link", {
        name: "View details for Flash Flood Warning",
      }),
    ).toHaveAttribute("href", "/alerts/urn%3Aoid%3Atest.complete");
  });
});
