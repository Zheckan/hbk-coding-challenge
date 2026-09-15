# Weather Alerts Explorer

A responsive React application for finding and reading National Weather
Service (NWS) alerts. Filters, sorting, and pagination are stored in the URL, so
a list view can be bookmarked or shared.

## Requirements

- Node.js 24 or newer
- pnpm 10

The project does not need an API key or an `.env` file.

## Setup

```bash
pnpm i && pnpm dev
```

Vite prints the local development URL after it starts.

To run the production build locally:

```bash
pnpm build
pnpm preview
```

## Commands

| Command             | Purpose                                                |
| ------------------- | ------------------------------------------------------ |
| `pnpm test`         | Run Vitest component and logic tests                   |
| `pnpm test-e2e`     | Run the main browser flows with Playwright             |
| `pnpm test-e2e:ui`  | Open Playwright's interactive test runner              |
| `pnpm typecheck`    | Check TypeScript                                       |
| `pnpm lint`         | Check ESLint rules                                     |
| `pnpm format:check` | Check Prettier formatting                              |
| `pnpm check`        | Run formatting, linting, tests, and a production build |
| `pnpm fix`          | Fix lint/format issues, then run `pnpm check`          |

Playwright needs Chromium once on a new machine:

```bash
pnpm exec playwright install chromium
pnpm test-e2e
```

The browser tests mock only the NWS network boundary, which keeps them
repeatable. To check the current live API contract separately, run:

```bash
VITE_NWS_LIVE=1 pnpm exec vitest run src/features/alerts/common/api/nws-alerts.live.test.ts
```

## Architecture

- `src/app` owns application providers, routing, and layout.
- `src/pages` contains thin route entry points.
- `src/features/alerts/list` and `src/features/alerts/details` contain the two
  user-facing alert features.
- Feature containers compose the screen. Feature hooks own URL, request, and
  view-state orchestration. Views and components render the resulting props.
- `src/features/alerts/common` contains API, model, and UI code shared by both
  alert features.
- `src/test` contains shared test setup and representative NWS fixtures.

NWS responses are treated as unknown data. Zod validates them at the API
boundary and maps them into the smaller application model before UI code uses
them. TanStack Query handles caching, cancellation, retries, and cursor-based
pagination. Material UI and Emotion provide the component system and styling.

## NWS API limits

- The NWS API is public and does not require an API key.
- The `/alerts` endpoint only exposes alerts issued during the past seven days,
  so the date controls use the same range.
- NWS limits an alert-list page to 500 records. When it returns a pagination
  cursor, the last local page offers a **Load more alerts** action.
- Area, severity, status, and issued-date filters are sent to NWS. Text search,
  sorting, and table pagination operate on the pages already loaded in the
  browser.
- Live alert data changes continuously and may include test messages or missing
  optional fields.

See the [official NWS API documentation](https://www.weather.gov/documentation/services-web-api)
for the upstream contract.

## Important decisions

- Vite is enough because this is a client-side application with no server-side
  rendering requirement.
- List state lives in URL search parameters to preserve it across refreshes and
  list-to-detail navigation.
- The UI uses semantic roles and labels first. Stable test IDs are limited to
  alert rows, whose dynamic IDs are difficult to select clearly by role alone.
- Tests are split by purpose: focused Vitest tests cover logic and request
  states, while focused Playwright flows share one Page Object.

The implementation plan and progress are in [docs/PLAN.md](docs/PLAN.md). The
domain language is in [docs/CONTEXT.md](docs/CONTEXT.md). Where and how AI was
used is in [ai-note.md](ai-note.md).
