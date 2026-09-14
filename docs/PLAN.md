# Project plan

This file tracks the implementation order and progress.

Docs: https://www.weather.gov/documentation/services-web-api

## Core requirements

- Build the application with React and TypeScript.
- Load weather alerts from the National Weather Service API.
- Show the alerts in a table.
- Let users sort and filter the table.
- Let users select an alert and read its details.
- Let users select a date range.
- Display dates in the user's local time zone.
- Use consistent styling and clear navigation.
- Document the project and keep the code maintainable.

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

- [ ] Load alerts through TanStack Query using the Stage 1 data module.
- [ ] Format API timestamps in the browser's local time zone.
- [ ] Build a semantic MUI table showing severity, event, headline, affected area, issued time, expiry time, and a details link.
- [ ] Show severity as text with supporting color, never color alone.
- [ ] Add a clear details link for each alert.
- [ ] Test the table headings, alert values, local date display, and details links.

**Complete when:** a real NWS response can appear as normalized rows in the basic table without exposing raw GeoJSON to the UI.

### Stage 4: Filters, sorting, date range, and URL state

- [ ] Parse, validate, and normalize the list state from URL search parameters.
- [ ] Add issued-from, issued-to, area, severity, status, and text-search controls.
- [ ] Convert local calendar dates into the API's ISO date-time values and enforce its available date window.
- [ ] Send supported filters to the API and apply text search to the loaded alerts.
- [ ] Add severity, event, area, issued-time, and expiry-time sorting.
- [ ] Add 25-row table pages and preserve filters and sorting during navigation and reloads.
- [ ] Test valid and invalid ranges, URL updates, API queries, searching, sorting, and restored state.

**Complete when:** users can change every filter and sort option, copy the URL, and reopen the same table state.

### Stage 5: Alert details

- [ ] Navigate from each table row to its alert detail route.
- [ ] Fetch the selected alert when it is not already available from the list.
- [ ] Show its event, headline, severity, urgency, certainty, area, times, instructions, description, sender, message type, and status.
- [ ] Preserve NWS line breaks and provide a link to the source alert.
- [ ] Return to the list without losing its URL state.
- [ ] Move focus to the detail heading after navigation.
- [ ] Test list-to-detail navigation, direct detail URLs, missing optional fields, and return navigation.

**Complete when:** both table navigation and a direct detail URL show the correct alert, and returning restores the list state.

### Stage 6: Pagination and interface states

- [ ] Show table-shaped skeletons during the first request.
- [ ] Keep existing rows visible with an updating indicator while filters reload data.
- [ ] Add clear empty, invalid-range, request-error, rate-limit, and not-found states.
- [ ] Add retry actions; retry network, rate-limit, and server failures once, but do not retry other client errors.
- [ ] Follow the NWS pagination cursor with a Load more action.
- [ ] Show how many alerts are loaded without implying that unseen results were sorted or searched.
- [ ] Test every state and the multi-page loading flow with MSW.

**Complete when:** every request outcome has a deterministic test and the user always has a clear next action.

### Stage 7: Responsive design and accessibility

- [ ] Finish the MUI theme, page layout, spacing, typography, and visual hierarchy.
- [ ] Keep the table usable on narrow screens and show the most important columns there.
- [ ] Make filters usable on desktop and mobile without hiding their current values.
- [ ] Support keyboard operation, visible focus, field labels, and announced result or error updates.
- [ ] Expose table sort direction correctly and respect reduced-motion preferences.
- [ ] Check color contrast and test the main flow at desktop and mobile widths.

**Complete when:** the main flow works with keyboard input and at narrow and wide viewport sizes without losing information or actions.

### Stage 8: Final testing, documentation, and delivery

- [ ] Add a Playwright test for loading alerts, filtering, sorting, opening details, and returning to the list.
- [ ] Run a manual smoke test against the live NWS API and a production preview.
- [ ] Write the README with setup, commands, architecture, API limits, and important decisions.
- [ ] Update the AI usage note so it matches the work that was actually done.
- [ ] Check every core requirement and mark completed plan items.
- [ ] Run the full verification commands and review the final diff for secrets, generated files, and unrelated changes.
- [ ] Test the documented setup from a clean installation.

**Complete when:** all automated checks pass, the live smoke test passes, the documentation matches the project, and the repository is ready to submit.
