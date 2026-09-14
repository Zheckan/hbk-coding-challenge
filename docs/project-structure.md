# Project Structure

Use this structure as a direction, not as a requirement to create empty folders.
Add folders when the code needs them.

## Main Idea

- Keep routing and app providers at the top level.
- Keep pages very thin.
- Put real product logic inside `features`.
- Put reusable business/domain logic inside `domain`.
- Put reusable UI primitives and layout pieces inside `ui`.
- Put environment, API, constants, and generated configuration in `config`.
- Keep tests, stories, and page objects close to the code they cover.

## Suggested Shape

```text
src/
  main.tsx
  App.tsx
  RootRouter.tsx

  pages/
    Root.tsx
    FeaturePage.tsx

  features/
    feature/
      FeatureContainer.tsx
      views/
        FeatureView.tsx
      components/
      logic/
      types.ts

  domain/
    state/
    business-logic/
    data-access/
    analytics/
    hooks/
    errors/
    types/

  ui/
    atoms/
    molecules/
    organisms/
    layouts/
    assets/
    charts/
    utils/

  config/
    paths.ts
    consts.ts
    query-client.ts
    feature-flags/
    api/
    generated/

  utils/
  test/
  css/
  fonts/
  exports/
```

## Rules

- `main.tsx` only boots React and global CSS.
- `App.tsx` wires app-wide providers such as router, query client, theme
  provider, and other global context providers.
- `RootRouter.tsx` defines routes and maps routes to page modules.
- `pages/*` should be thin route wrappers that mostly render a feature
  container.
- `features/*` are product modules. Each feature owns its own container, views,
  components, logic, types, tests, stories, and page objects.
- Use a container/view split:
  - `FeatureContainer.tsx` fetches data, calls hooks, handles state, and prepares props.
  - `views/FeatureView.tsx` renders the page from props and stays mostly
    presentational.
  - `logic/` contains hooks, form logic, validation, calculations, and data
    shaping.
  - `components/` contains feature-specific UI pieces.
- `domain/*` contains reusable business logic that can be shared across
  features. It should not be tied to one page.
- `ui/*` is the design system layer:
  - `atoms` are small primitives.
  - `molecules` are composed reusable UI pieces.
  - `organisms` are larger reusable UI sections.
  - `layouts` define page/app layout shells.
- Prefer absolute imports from `@/`, mapping to `src/*`.
- Keep shared interfaces small and let modules hide implementation complexity
  behind hooks, containers, or utility functions.

### Related features

Keep each feature in its own folder. When related child features share code, group them under a parent feature:

```text
features/
  parent-feature/
    common/
    feature-a/
    feature-b/
```

Put only code owned by at least two child features in `common/`. Keep everything else inside the child feature that owns it.

### Hook ownership and data flow:

- Feature containers own feature-level hooks, data fetching, state, and side effects.
- Containers pass hook results—state, derived data, and event handlers—to views and presentational components through props.
- Views should focus on rendering and user interaction wiring.
- Do not call feature-specific hooks deep inside presentational components unless the hook is intentionally reusable there.
- When a module needs a replaceable hook or service, pass it explicitly as a dependency.

### Unified fix and verification command

Provide a root-level `pnpm fix` command that:

1. Automatically formats the code and applies configured lint fixes.
2. Runs the verification checks for all packages.
3. Stops immediately if formatting or any verification step fails.

Verification should include linting, tests, type checking, and project-specific validation scripts. Independent checks may run in parallel to reduce execution time.

## End-to-end testing

Use Page Objects to encapsulate how tests interact with pages, features, and
dialogs.

A Page Object should:

- Extend a shared base Page Object when common behavior exists.
- Encapsulate locators, user actions, and UI assertions.
- Expose semantic methods such as `openSettings()`,
  `expectErrorMessage()`, or `selectAsset()`.
- Hide Playwright or browser selectors from test cases.
- Be reusable across multiple tests.
- Stay focused on UI interaction rather than application or business logic.

Keep Page Objects close to the page or feature they cover:

````text
features/
  feature/
    Feature.tsx
    Feature.PageObject.ts
    Feature.test-e2e.ts
    dialogs/
      ExampleDialog.PageObject.ts
      ExampleDialog.test-e2e.ts

pages/
  FeaturePage.tsx
  FeaturePage.PageObject.ts
  FeaturePage.test-e2e.ts

test/
  e2e/
    BasePageObject.ts
    fixtures/
    helpers/
````

Use a shared base Page Object for cross-application behavior such as:

- Accessing the browser page and test context.
- Locating common dialogs, panels, and notifications.
- Shared interactions such as selecting options or closing dialogs.
- Common assertions that apply to multiple features.

A Page Object may be organized into three sections:

````ts
class FeaturePageObject extends BasePageObject {
  // locators
  // actions
  // assertions
}
````

Tests should describe user behavior and expected outcomes:

````ts
const feature = new FeaturePageObject(testContext)

await feature.openSettings()
await feature.changeOption('advanced')
await feature.expectSettingsSaved()
````

Avoid putting the following in Page Objects:

- Product or domain business logic.
- Data-fetching implementation.
- React component state.
- Arbitrary waits used to hide race conditions.
- Assertions unrelated to the Page Object's responsibility.
- Large generic utility collections with no feature ownership.

When several related Page Objects share behavior, introduce a parent or common
Page Object only when at least two child Page Objects need it.

## Test selectors

Use a centralized test-selector registry for stable selectors required by
end-to-end or integration tests.

The registry should:

- Group selectors by product area or reusable component.
- Use descriptive names based on semantic purpose.
- Support repeated elements with parameterized selectors when necessary.
- Provide a single source of truth for `data-testid` values.
- Avoid coupling tests to CSS classes, generated markup, or styling details.

Example:

````ts
export const testIds = defineTestIds({
  component: {
    AssetSelector: {
      trigger: true,
      option: true,
    },
  },
  feature: {
    summary: {
      container: true,
      balance: true,
    },
  },
})
````

Application components use the registry:

````tsx
<div data-testid={testIds.feature.summary.container}>
  <span data-testid={testIds.feature.summary.balance}>
    {balance}
  </span>
</div>
````

Page Objects use the same registry:

````ts
locateBalance(): Locator {
  return this.page.getByTestId(testIds.feature.summary.balance)
}
````

Prefer accessible locators such as roles, labels, and visible text when they
represent the intended public interface. Use test IDs when an element needs a
stable, implementation-independent selector or when accessible selectors are
ambiguous.

Do not add test IDs to every element. Add them to important interaction and
assertion points, such as:

- Buttons with unstable or repeated labels.
- Inputs and selectors.
- Important status values.
- Table rows or repeated items.
- Dialog regions.
- Components whose visible text may change.
- Elements that need reliable scoping in a Page Object.

Test IDs should not encode styling, DOM structure, or implementation details.
Prefer names such as `summary.balance` over names such as
`div2.greenText.span`.

Keep test IDs stable when possible. Changing a test ID is an intentional test
contract change and should normally be updated together with the affected Page
Objects and tests.

The dependency direction should be:

````text
E2E test
   ↓
Page Object
   ↓
roles / labels / testIds
   ↓
rendered application
````
