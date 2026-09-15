import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";

import listFixture from "@/test/fixtures/nws-alert-list.json";
import { renderApp } from "@/test/renderApp";
import { server } from "@/test/server";
import { testIds } from "@/ui/utils/testIds";

const completeFeature = listFixture.features[0];

if (completeFeature === undefined) {
  throw new Error("The alert fixture must contain an alert");
}

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

  it("offers NWS land and marine area codes", async () => {
    renderApp({ initialEntries: ["/alerts"] });

    const areaSelect = await screen.findByRole("combobox", {
      name: "Area code",
    });

    expect(
      within(areaSelect).getByRole("option", { name: "KS — Kansas" }),
    ).toBeVisible();
    expect(
      within(areaSelect).getByRole("option", {
        name: "PZ — Eastern Pacific and U.S. West Coast",
      }),
    ).toBeVisible();
  });

  it("offers only the seven dates available from NWS", async () => {
    renderApp({ initialEntries: ["/alerts"] });

    const issuedFrom = await screen.findByRole("combobox", {
      name: "Issued from",
    });
    const issuedTo = screen.getByRole("combobox", { name: "Issued to" });
    const fromValues = within(issuedFrom)
      .getAllByRole("option")
      .map((option) => option.getAttribute("value"));
    const toValues = within(issuedTo)
      .getAllByRole("option")
      .map((option) => option.getAttribute("value"));

    expect(fromValues).toHaveLength(8);
    expect(fromValues[0]).toBe("");
    expect(new Set(fromValues.slice(1)).size).toBe(7);
    expect(toValues).toEqual(fromValues);
  });

  it("restores filters from the URL and sends supported filters to NWS", async () => {
    let requestedUrl: URL | undefined;

    server.use(
      http.get("https://api.weather.gov/alerts", ({ request }) => {
        requestedUrl = new URL(request.url);
        return HttpResponse.json(listFixture);
      }),
    );

    renderApp({
      initialEntries: ["/alerts?area=mo&severity=severe&status=actual&q=flood"],
    });

    expect(
      await screen.findByRole("combobox", { name: "Area code" }),
    ).toHaveValue("MO");
    expect(screen.getByRole("combobox", { name: "Severity" })).toHaveValue(
      "Severe",
    );
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveValue(
      "Actual",
    );
    expect(
      screen.getByRole("searchbox", { name: "Search alerts" }),
    ).toHaveValue("flood");

    expect(requestedUrl?.searchParams.get("area")).toBe("MO");
    expect(requestedUrl?.searchParams.get("severity")).toBe("Severe");
    expect(requestedUrl?.searchParams.get("status")).toBe("actual");
    expect(requestedUrl?.searchParams.has("q")).toBe(false);

    const table = await screen.findByRole("table", { name: "Weather alerts" });
    expect(
      within(table).getByText("Flash Flood Warning", {
        selector: "th",
      }),
    ).toBeVisible();
    expect(
      within(table).queryByText("Special Weather Statement", {
        selector: "th",
      }),
    ).not.toBeInTheDocument();
  });

  it("updates the URL when filters and sorting change", async () => {
    const user = userEvent.setup();
    const { router } = renderApp({ initialEntries: ["/alerts"] });

    await screen.findByRole("table", { name: "Weather alerts" });
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Area code" }),
      "KS",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Severity" }),
      "Moderate",
    );
    await user.type(
      screen.getByRole("searchbox", { name: "Search alerts" }),
      "lake",
    );

    const table = await screen.findByRole("table", { name: "Weather alerts" });
    await user.click(
      within(table).getByRole("button", { name: "Sort by severity" }),
    );

    await waitFor(() => {
      expect(router.state.location.search).toBe(
        "?area=KS&severity=moderate&q=lake&sort=severity&direction=asc",
      );
    });
  });

  it("clears filters without resetting the selected sort", async () => {
    const user = userEvent.setup();
    const { router } = renderApp({
      initialEntries: [
        "/alerts?area=KS&severity=severe&q=flood&sort=severity&page=2",
      ],
    });

    await screen.findByRole("table", { name: "Weather alerts" });
    await user.click(screen.getByRole("button", { name: "Clear filters" }));

    await waitFor(() => {
      expect(router.state.location.search).toBe("?sort=severity");
    });
  });

  it("does not request alerts for an invalid date", () => {
    let requestCount = 0;

    server.use(
      http.get("https://api.weather.gov/alerts", () => {
        requestCount += 1;
        return HttpResponse.json(listFixture);
      }),
    );

    renderApp({ initialEntries: ["/alerts?from=not-a-date"] });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Issued from must be a valid date.",
    );
    expect(requestCount).toBe(0);
  });

  it("restores a 25-row page from the URL", async () => {
    const user = userEvent.setup();
    const pagedFixture = {
      ...listFixture,
      features: Array.from({ length: 26 }, (_, index) => {
        const number = String(index + 1).padStart(2, "0");

        return {
          ...completeFeature,
          id: `https://api.weather.gov/alerts/alert-${number}`,
          properties: {
            ...completeFeature.properties,
            id: `alert-${number}`,
            event: `Alert ${number}`,
          },
        };
      }),
    };

    server.use(
      http.get("https://api.weather.gov/alerts", () =>
        HttpResponse.json(pagedFixture),
      ),
    );

    const { router } = renderApp({ initialEntries: ["/alerts?page=2"] });
    const table = await screen.findByRole("table", { name: "Weather alerts" });

    expect(within(table).getByText("Alert 26")).toBeVisible();
    expect(within(table).queryByText("Alert 01")).not.toBeInTheDocument();

    await user.click(
      within(table).getByRole("button", { name: "Go to previous page" }),
    );

    await waitFor(() => {
      expect(router.state.location.search).toBe("");
    });
    expect(await within(table).findByText("Alert 01")).toBeVisible();
  });
});
