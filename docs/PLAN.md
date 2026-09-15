# Project plan

This file tracks the implementation order and progress.

Docs: https://www.weather.gov/documentation/services-web-api

## Core requirements

- [x] Build the application with React and TypeScript.
- [x] Load weather alerts from the National Weather Service API.
- [x] Show the alerts in a table.
- [x] Let users sort and filter the table.
- [x] Let users select an alert and read its details.
- [x] Let users select a date range.
- [x] Display dates in the user's local time zone.
- [x] Use consistent styling and clear navigation.
- [x] Document the project and keep the code maintainable.

## Implementation approach

We will start with the API integration. This will show us the real endpoints, response structure, date formats, pagination, and error behavior before we design the UI around them.

After we understand the API, we will build the UI using representative response data.

## Stages

Add tests with each stage. Run `pnpm fix` before marking a stage complete.

### Stage 1: NWS API exploration and data layer

- [x] Check the official NWS documentation and call the live alert list and detail endpoints.
- [x] Capture the API behavior in types and tests, with small comments only where the reason is not clear from the code.
- [x] Save representative API response data as a test fixture, including missing optional fields.
- [x] Define the application `Alert`, alert query, and paginated result types.
- [x] Validate unknown responses with Zod and convert NWS GeoJSON into application types.
- [x] Implement list and detail request functions with request cancellation and useful errors.
- [x] Test query building, response conversion, nullable fields, invalid responses, and pagination parsing.

**Complete when:** the list and detail functions return validated application data from fixtures, and a live smoke check confirms the endpoints still match our assumptions.

### Stage 2: Application structure, providers, and routing

- [x] Configure the `@/` import alias in Vite and TypeScript.
- [x] Move the existing app and theme files into the planned structure as the code needs it.
- [x] Keep app-wide providers at the app root and the MUI theme in the UI layer.
- [x] Add routes for the alerts list and alert details, plus a safe fallback route.
- [x] Create thin route pages and feature containers for both routes.
- [x] Configure Testing Library and MSW with shared test rendering helpers.

**Complete when:** both routes render through the real providers, direct navigation works, and a routing test passes.

### Stage 3: Alerts table

- [x] Load alerts through TanStack Query using the Stage 1 data module.
- [x] Format API timestamps in the browser's local time zone.
- [x] Build a semantic MUI table showing severity, event, headline, affected area, issued time, expiry time, and a details link.
- [x] Show severity as text with supporting color, never color alone.
- [x] Add a clear details link for each alert.
- [x] Test the table headings, alert values, local date display, and details links.

**Complete when:** a real NWS response can appear as normalized rows in the basic table without exposing raw GeoJSON to the UI.

### Stage 4: Filters, sorting, date range, and URL state

- [x] Parse, validate, and normalize the list state from URL search parameters.
- [x] Add issued-from, issued-to, area, severity, status, and text-search controls.
- [x] Convert local calendar dates into the API's ISO date-time values and enforce its available date window.
- [x] Send supported filters to the API and apply text search to the loaded alerts.
- [x] Add severity, event, area, issued-time, and expiry-time sorting.
- [x] Add configurable table pages with direct page navigation, and preserve the list state during navigation and reloads.
- [x] Test valid and invalid ranges, URL updates, API queries, searching, sorting, and restored state.

**Complete when:** users can change every filter and sort option, copy the URL, and reopen the same table state.

### Stage 5: Alert details

- [x] Navigate from each table row to its alert detail route.
- [x] Fetch the selected alert when it is not already available from the list.
- [x] Show its event, headline, severity, urgency, certainty, area, times, instructions, description, sender, message type, and status.
- [x] Preserve NWS line breaks and provide a link to the source alert.
- [x] Return to the list without losing its URL state.
- [x] Move focus to the detail heading after navigation.
- [x] Test list-to-detail navigation, direct detail URLs, missing optional fields, and return navigation.

**Complete when:** both table navigation and a direct detail URL show the correct alert, and returning restores the list state.

### Stage 6: Pagination and interface states

- [x] Show table-shaped skeletons during the first request.
- [x] Keep existing rows visible with an updating indicator while filters reload data.
- [x] Add clear empty, invalid-range, request-error, rate-limit, and not-found states.
- [x] Add retry actions; retry network, rate-limit, and server failures once, but do not retry other client errors.
- [x] Follow the NWS pagination cursor with a Load more action.
- [x] Show the current result total in table pagination and expose additional NWS results through the Load more action.
- [x] Test every state and the multi-page loading flow with MSW.

**Complete when:** every request outcome has a deterministic test and the user always has a clear next action.

### Stage 7: Responsive design and accessibility

- [x] Finish the MUI theme, page layout, spacing, typography, and visual hierarchy.
- [x] Keep the table usable on narrow screens and show the most important columns there.
- [x] Make filters usable on desktop and mobile without hiding their current values.
- [x] Support keyboard operation, visible focus, field labels, and announced result or error updates.
- [x] Expose table sort direction correctly and respect reduced-motion preferences.
- [x] Check color contrast and test the main flow at desktop and mobile widths.

**Complete when:** the main flow works with keyboard input and at narrow and wide viewport sizes without losing information or actions.

### Stage 8: Final testing, documentation, and delivery

- [x] Add Playwright tests for loading alerts, filtering, sorting, opening details, and returning to the list.
- [x] Run a manual smoke test against the live NWS API and a production preview.
- [x] Write the README with setup, commands, architecture, API limits, and important decisions.
- [x] Update the AI usage note so it matches the work that was actually done.
- [x] Check every core requirement and mark completed plan items.
- [x] Run the full verification commands and review the final diff for secrets, generated files, and unrelated changes.
- [x] Test the documented setup from a clean installation.

**Complete when:** all automated checks pass, the live smoke test passes, the documentation matches the project, and the repository is ready to submit.
