import { expect, type Page, test } from '@playwright/test'

import alertListFixture from '@/test/fixtures/nws-alert-list.json' with { type: 'json' }
import { AlertsPageObject } from './AlertsPage.PageObject'

test('loads alerts from NWS', async ({ page }) => {
  const alertsPage = await openAlertsPage(page)

  await alertsPage.expectAlertsLoaded([
    'urn:oid:test.complete',
    'urn:oid:test.nullable',
  ])
})

test('sorts alerts by event', async ({ page }) => {
  const alertsPage = await openAlertsPage(page)

  await alertsPage.sortByEventDescending()
  await alertsPage.expectFirstAlert('Special Weather Statement')
})

test('filters alerts by search text', async ({ page }) => {
  const alertsPage = await openAlertsPage(page)

  await alertsPage.searchFor('flood')
  await alertsPage.expectOnlyAlert('urn:oid:test.complete')
})

test('opens an alert and returns with the list state', async ({ page }) => {
  const alertsPage = await openAlertsPage(page)

  await alertsPage.searchFor('flood')
  await alertsPage.openAlertDetails('Flash Flood Warning')
  await alertsPage.expectAlertDetails('Flash Flood Warning')

  await alertsPage.returnToAlerts()
  await alertsPage.expectSearchRestored('flood')
  await alertsPage.expectOnlyAlert('urn:oid:test.complete')
})

async function openAlertsPage(page: Page): Promise<AlertsPageObject> {
  await page.route('https://api.weather.gov/alerts**', async (route) => {
    const requestUrl = new URL(route.request().url())

    expect(requestUrl.pathname).toBe('/alerts')
    await route.fulfill({ json: alertListFixture })
  })

  const alertsPage = new AlertsPageObject(page)

  await alertsPage.open()

  return alertsPage
}
