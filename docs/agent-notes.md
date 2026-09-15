# Agent notes

Record verified surprises that another agent may hit again.

## How to write a note

Use this format:

### YYYY-MM-DD: Short title

- Symptom:
- Cause:
- Fix:
- Evidence:

Keep each field to one or two sentences. Update a matching note instead of adding another one. Correct or remove a note when later evidence shows that it is no longer true.

## Notes

### 2026-09-15: NWS alert descriptions can be null

- Symptom: The unfiltered alerts request returned HTTP 200, but the app rejected the whole collection and showed an error.
- Cause: A live NWS alert had a `null` description while the response schema required a string.
- Fix: Keep alert descriptions nullable in the response schema and domain model, with a nullable fixture case.
- Evidence: The live 500-alert response contained one null description; the parser regression test and browser check passed after the fix.

### 2026-09-15: Date tests depend on the host locale

- Symptom: Assertions such as `Sep 14, 2026, 8:29 AM CDT` failed under `LC_ALL=de_DE.UTF-8`, which rendered `14. Sept. 2026, 08:29 GMT-5`.
- Cause: The app formats dates with the default locale, and Node takes that default from the host when it starts.
- Fix: `src/test/setup.ts` pins the default `Intl.DateTimeFormat` locale to `en-US`. Keep the pin when adding date assertions.
- Evidence: Both date tests failed under `de_DE` before the pin and passed after it.
