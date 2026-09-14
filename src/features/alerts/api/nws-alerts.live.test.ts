import { describe, expect, it } from "vitest";
import { fetchAlert, fetchAlerts } from "./nws-alerts";

const liveChecksEnabled = import.meta.env.VITE_NWS_LIVE === "1";

describe.skipIf(!liveChecksEnabled)("NWS alerts live smoke check", () => {
  it("loads an alert list and its first alert detail", async () => {
    const page = await fetchAlerts({ status: "Actual", limit: 1 });
    const [firstAlert] = page.alerts;

    expect(firstAlert).toBeDefined();

    if (firstAlert === undefined) {
      throw new Error("The live NWS response did not contain an alert");
    }

    const detail = await fetchAlert(firstAlert.id);

    expect(detail.id).toBe(firstAlert.id);
  }, 30_000);
});
