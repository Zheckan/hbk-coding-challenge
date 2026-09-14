# Weather alerts explorer: design

Status: accepted; application foundation initialized

## Decision

Build a client-rendered React application with Vite and TypeScript.

TanStack Start is not a good fit for this exercise. It is a full-stack framework built around TanStack Router, with server-side rendering, streaming, server functions, and server routes. This application has no search-engine indexing requirement, authentication, private credentials, database, or server-only business logic. The National Weather Service API supports browser requests, so a server runtime would add deployment and debugging work without improving the product.

Vite and TanStack Start are not direct alternatives at the same level. Vite is the development server and production build tool. TanStack Start is an application framework that can use Vite as its build layer. We can still use focused TanStack libraries in a Vite application.

## What the assignment asks for

The application must:

- use React and TypeScript;
- read alerts from the National Weather Service API;
- present alerts in a table;
- let the user sort and filter the table;
- let the user choose an alert and read more detail;
- let the user select a date range;
- display dates in the browser's local time zone;
- use consistent styling and deliberate navigation;
- be documented and maintained as commercial software would be.

The assignment leaves the specific columns, filters, routes, and visual design to us. Those choices are part of the evaluation.

## Product interpretation

### Primary user goal

A user wants to find important weather alerts within an issued-date range, assess urgency from the table, and open one alert for complete instructions and timing.

### Date range

"Date range" means the time in which NWS issued the alert. The filter controls will say **Issued from** and **Issued to** so the meaning is visible rather than hidden in code.

The user selects calendar dates in their local time zone. The application converts the start of the first local day and the end of the final local day to ISO-8601 instants for the API request. All timestamps returned by the API are displayed in the user's current time zone. The interface displays that time-zone name near the date controls.

The NWS `/alerts` endpoint only contains alerts issued within the past seven days. The date controls must enforce that limit and explain it next to the inputs.

### Default view

- Status: actual alerts only
- Issued range: today in the user's local time zone
- Area: all areas
- Sort: severity first, then newest issued time
- Table page size: 25 rows

The area filter should be prominent because nationwide date-range responses can be large. Test, exercise, and draft messages stay hidden unless the user changes the status filter.

### Table content

The table shows the fields needed to scan and compare alerts:

| Column        | Reason                               | Sorting                                                 |
| ------------- | ------------------------------------ | ------------------------------------------------------- |
| Severity      | Fast risk assessment                 | Domain order: Extreme, Severe, Moderate, Minor, Unknown |
| Event         | Recognizable alert type              | Alphabetical                                            |
| Headline      | Short explanation from NWS           | Not sortable                                            |
| Affected area | Geographic relevance                 | Alphabetical                                            |
| Issued        | Recency                              | Date                                                    |
| Expires       | Remaining relevance                  | Date                                                    |
| Details       | Clear keyboard-accessible navigation | Not sortable                                            |

Filters include issued date, state or territory, severity, status, and free-text search across event, headline, and affected area.

On narrow screens, the table retains Severity, Event, Area, and Details. Less important columns can be hidden behind the detail view. The table remains a semantic table inside a horizontally scrollable container rather than changing into an unrelated card layout.

### Alert detail

Selecting a row opens `/alerts/:alertId`. A separate route gives the browser back button predictable behavior, supports deep links, and works better on small screens than a wide modal.

The detail view shows:

- headline and event;
- severity, urgency, and certainty;
- affected area;
- issued, effective, onset, expected end, and expiry times when present;
- instructions in a visually prominent section;
- the full description with NWS line breaks preserved;
- sender, message type, and status;
- a link to the source alert.

If the user opens a detail URL directly, the application fetches that alert by ID. Returning to the table preserves filters and sorting because they live in the URL.

## Data behavior

### Request flow

```text
URL search parameters
        |
        v
validate and normalize query
        |
        v
TanStack Query -> NWS /alerts endpoint
        |               |
        |               +-> start, end, area, severity, status, cursor
        v
validate and normalize GeoJSON
        |
        v
application Alert[] -> TanStack Table -> MUI table
```

The NWS module hides GeoJSON and API-specific pagination from the rest of the application. It exposes normalized alerts plus the next cursor. UI modules never read nested `feature.properties` values directly.

### Runtime validation

TypeScript cannot prove that an external HTTP response matches our types. A small Zod schema validates only the fields the application uses and allows unrelated NWS fields to pass through. Invalid records produce a visible data error instead of broken cells or an unexplained crash.

### Pagination and result honesty

The API supports at most 500 alerts per response and returns a cursor for the next page. The first request loads up to 500 results. If another page exists, the interface says that more results are available and offers **Load more**.

Sorting, free-text filtering, and table pagination operate over the loaded rows. While more server pages remain, the result summary says, for example, "500+ alerts available, 500 loaded." This avoids implying that a client-side sort covered unseen rows. Date, area, status, and severity filters go to the API and reduce the complete result set before client-side work.

### Caching and retries

TanStack Query owns remote state, request cancellation, caching, retry behavior, and previous-data display during filter changes.

- Include every server filter and cursor in the query key.
- Cancel the old request when filters change.
- Retry transient network, `429`, and `5xx` failures once. Do not retry invalid `4xx` requests.
- Keep the last successful table visible while a new filter request loads, with an updating indicator.
- Do not persist alert responses across browser sessions. Alerts age quickly.

## User interface states

The implementation must design each state rather than only the successful response:

- Initial loading: table-shaped skeleton rows.
- Updating: retain the current table and mark it as updating.
- Empty: explain that no alerts match and offer to clear optional filters.
- Invalid date range: inline validation, no request.
- API unavailable or rate-limited: concise error with a retry action.
- Partial result: visible loaded count and **Load more** action.
- Detail not found: clear message and a link back to the alert list.

## Navigation and URL state

React Router provides two routes:

```text
/alerts                alert table
/alerts/:alertId       alert detail
```

Table state that changes what the user sees belongs in URL search parameters:

```text
?from=2026-09-14&to=2026-09-14&area=KS&severity=Severe&q=flood&sort=sent.desc
```

Local state is reserved for transient presentation such as an open mobile filter panel. No global state library is needed.

## Proposed technology

| Concern                    | Choice                                | Why                                                                                     |
| -------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------- |
| Build and development      | Vite                                  | Small React SPA, fast feedback, static production output                                |
| Language                   | TypeScript in strict mode             | Required by the assignment and useful at the API seam                                   |
| Runtime                    | Node.js 24 LTS for development and CI | Supported release line and reproducible tooling                                         |
| Package manager            | pnpm with a committed lockfile        | Fast, deterministic installation                                                        |
| Routing                    | React Router                          | Two routes and URL search state do not justify a full-stack router framework            |
| Remote state               | TanStack Query                        | Cancellation, caching, retries, and cursor pagination                                   |
| Table model                | TanStack Table                        | Explicit sorting, filtering, pagination, and column visibility without dictating markup |
| UI library                 | MUI                                   | Consistent accessible controls, tables, feedback, and theming                           |
| Response validation        | Zod                                   | Protects the application from malformed or changed external data                        |
| Date display               | Native `Intl.DateTimeFormat`          | Correct local-zone display without another runtime dependency                           |
| Unit and integration tests | Vitest, Testing Library, MSW          | Fast behavior tests with deterministic API responses                                    |
| Browser test               | Playwright                            | Verifies the main list-to-detail flow in a built application                            |
| Static checks              | ESLint, Prettier, TypeScript          | Consistent source and a CI-friendly quality gate                                        |

Do not add Redux, Zustand, Axios, a date library, Storybook, a custom backend, or TanStack Start unless implementation uncovers a concrete need.

## Module layout

```text
src/
  app/
    App.tsx
    router.tsx
    theme.ts
  features/
    alerts/
      api/
        nws-alerts.ts
        nws-alerts.schema.ts
      model/
        alert.ts
        alert-query.ts
      components/
        AlertFilters.tsx
        AlertsTable.tsx
        AlertStatus.tsx
      pages/
        AlertsPage.tsx
        AlertDetailsPage.tsx
  shared/
    dates/
      local-date.ts
  test/
    fixtures/
    server.ts
```

This is a feature-first layout, but it avoids one-file wrappers. The important module is `nws-alerts.ts`: a small interface hides request construction, cursor parsing, response validation, and normalization. Date conversion is separate because local-day boundaries and daylight-saving changes deserve focused tests.

## Accessibility

- Use native table elements and real buttons or links for actions.
- Make sortable headers keyboard operable and expose sort direction with `aria-sort`.
- Associate every filter label with its control.
- Move focus to the detail heading after navigation.
- Never encode severity with color alone. Include visible text.
- Announce result counts and asynchronous errors without stealing focus.
- Meet WCAG AA contrast for normal text and controls.
- Respect reduced-motion preferences.

## Verification strategy

### Unit tests

- API response normalization and nullable fields
- local date boundaries, including a daylight-saving transition
- severity ordering
- query parsing and invalid range rejection

### Integration tests

- loading, updating, empty, error, and partial-result states
- filters change the API request and URL
- table headers change sort order and `aria-sort`
- opening and returning from a detail route preserves table state
- a direct detail URL fetches its alert

### Browser test

Use Playwright with a mocked NWS response for one stable critical path: load alerts, filter, sort, open details, and return to the preserved list. Live API access should be a manual smoke test, not a CI dependency.

### CI gate

Every pull request should run formatting checks, lint, TypeScript, unit and integration tests, production build, and the mocked browser smoke test.

## Out of scope

- Authentication and user accounts
- Saved searches or notifications
- Maps and polygon rendering
- Historical alerts older than the API's seven-day window
- A server-side proxy or persistent cache
- Search-engine indexing and server-side rendering
- Automatic geolocation

These could be sensible product features, but none helps prove the requested behavior.

## Initialization

The project was initialized in the current directory with the plain React TypeScript template:

```bash
pnpm create vite@latest . --template react-ts --eslint
```

The existing planning files were preserved. Runtime dependencies and strict checks are installed. The two routes and NWS normalization tests will be added with the first application feature.

## References

- `Web_Coding_Exercise.pdf`, provided separately with the exercise
- [National Weather Service API documentation](https://www.weather.gov/documentation/services-web-api)
- [National Weather Service OpenAPI specification](https://api.weather.gov/openapi.json)
- [Vite guide](https://vite.dev/guide/)
- [TanStack Start](https://tanstack.com/start/latest)
