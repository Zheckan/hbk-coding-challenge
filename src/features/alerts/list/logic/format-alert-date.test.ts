import { describe, expect, it } from "vitest";
import { formatAlertDate } from "./format-alert-date";

describe("formatAlertDate", () => {
  it("displays an alert date in the selected local timezone", () => {
    expect(
      formatAlertDate("2026-09-14T08:29:00-05:00", {
        locale: "en-US",
        timeZone: "America/Chicago",
      }),
    ).toBe("Sep 14, 2026, 8:29 AM CDT");
  });
});
