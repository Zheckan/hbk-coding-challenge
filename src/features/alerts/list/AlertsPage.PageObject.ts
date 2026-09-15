import { expect, type Page } from '@playwright/test'

import { testIds } from '@/ui/utils/testIds'

export class AlertsPageObject {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async open() {
    await this.page.goto('/alerts')
  }

  async expectAlertsLoaded(alertIds: readonly string[]) {
    await expect(
      this.page.getByRole('table', { name: 'Weather alerts' }),
    ).toBeVisible()

    for (const alertId of alertIds) {
      await expect(
        this.page.getByTestId(testIds.alerts.list.row(alertId)),
      ).toBeVisible()
    }
  }

  async sortByEventDescending() {
    const sortButton = this.page.getByRole('button', { name: 'Sort by event' })

    await sortButton.click()
    await sortButton.click()

    await expect(
      this.page.getByRole('columnheader', { name: 'Sort by event' }),
    ).toHaveAttribute('aria-sort', 'descending')
  }

  async expectFirstAlert(event: string) {
    await expect(this.page.locator('tbody tr').first()).toContainText(event)
  }

  async searchFor(search: string) {
    await this.page
      .getByRole('searchbox', { name: 'Search alerts' })
      .fill(search)
  }

  async expectOnlyAlert(alertId: string) {
    await expect(this.page.locator('tbody tr')).toHaveCount(1)
    await expect(
      this.page.getByTestId(testIds.alerts.list.row(alertId)),
    ).toBeVisible()
  }

  async openAlertDetails(event: string) {
    await this.page
      .getByRole('link', { name: `View details for ${event}` })
      .click()
  }

  async expectAlertDetails(event: string) {
    await expect(
      this.page.getByRole('heading', { level: 1, name: event }),
    ).toBeVisible()
  }

  async returnToAlerts() {
    await this.page.getByRole('link', { name: 'Back to alerts' }).click()
  }

  async expectSearchRestored(search: string) {
    await expect(
      this.page.getByRole('searchbox', { name: 'Search alerts' }),
    ).toHaveValue(search)
  }
}
