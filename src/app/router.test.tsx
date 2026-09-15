import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderApp } from "@/test/renderApp";

describe("application routing", () => {
  it("redirects the root URL to the alerts page", async () => {
    const { router } = renderApp();

    expect(
      await screen.findByRole("heading", { name: "Weather alerts" }),
    ).toBeVisible();
    expect(router.state.location.pathname).toBe("/alerts");
  });

  it("shows the alerts page", async () => {
    renderApp({ initialEntries: ["/alerts"] });

    expect(
      await screen.findByRole("heading", { name: "Weather alerts" }),
    ).toBeVisible();
  });

  it("shows a safe fallback for an unknown URL", async () => {
    renderApp({ initialEntries: ["/missing"] });

    expect(
      await screen.findByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "View weather alerts" }),
    ).toHaveAttribute("href", "/alerts");
  });
});
