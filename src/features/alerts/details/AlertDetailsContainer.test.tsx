import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'

import listFixture from '@/test/fixtures/nws-alert-list.json'
import { renderApp } from '@/test/renderApp'
import { server } from '@/test/server'

const completeFeature = listFixture.features[0]

if (completeFeature === undefined) {
  throw new Error('The alert fixture must contain an alert')
}

describe('alert details', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('opens a loaded alert and returns to the same list', async () => {
    const user = userEvent.setup()
    let detailRequestCount = 0

    server.use(
      http.get('https://api.weather.gov/alerts/*', () => {
        detailRequestCount += 1
        return HttpResponse.json(completeFeature)
      }),
    )

    renderApp({ initialEntries: ['/alerts?area=MO&q=flood'] })

    await user.click(
      await screen.findByRole('link', {
        name: 'View details for Flash Flood Warning',
      }),
    )

    const heading = await screen.findByRole('heading', {
      level: 1,
      name: 'Flash Flood Warning',
    })

    await waitFor(() => {
      expect(heading).toHaveFocus()
    })
    expect(detailRequestCount).toBe(0)

    const backLink = screen.getByRole('link', { name: 'Back to alerts' })
    expect(backLink).toHaveAttribute('href', '/alerts?area=MO&q=flood')

    await user.click(backLink)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Weather alerts' }),
    ).toBeVisible()
    expect(screen.getByRole('combobox', { name: 'Area code' })).toHaveValue(
      'MO',
    )
    expect(
      screen.getByRole('searchbox', { name: 'Search alerts' }),
    ).toHaveValue('flood')
  })

  it('loads and displays every alert detail from a direct URL', async () => {
    vi.stubEnv('TZ', 'America/Chicago')
    const detailFeature = {
      ...completeFeature,
      properties: {
        ...completeFeature.properties,
        description: 'Heavy rain has caused flash flooding.\nAvoid low areas.',
        instruction: "Turn around, don't drown.\nMove to higher ground.",
      },
    }

    server.use(
      http.get('https://api.weather.gov/alerts/*', () =>
        HttpResponse.json(detailFeature),
      ),
    )

    renderApp({
      initialEntries: ['/alerts/urn%3Aoid%3Atest.complete'],
    })

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Flash Flood Warning',
      }),
    ).toBeVisible()
    expect(
      screen.getByText('Flash Flood Warning issued September 14 at 8:29AM CDT'),
    ).toBeVisible()

    const information = screen.getByRole('region', {
      name: 'Alert information',
    })

    for (const value of [
      'Severe',
      'Immediate',
      'Likely',
      'Daviess, MO; DeKalb, MO',
      'Update',
      'Actual',
      'NWS Kansas City/Pleasant Hill MO',
      'w-nws.webmaster@noaa.gov',
    ]) {
      expect(within(information).getByText(value)).toBeVisible()
    }

    for (const label of [
      'Affected area',
      'Issued time',
      'Effective time',
      'Onset time',
      'Expiry time',
      'Expected end time',
      'Severity',
      'Urgency',
      'Certainty',
      'Message type',
      'Status',
      'Sender',
    ]) {
      expect(within(information).getByText(label)).toBeVisible()
    }

    expect(
      within(information).getAllByText('Sep 14, 2026, 8:29 AM CDT'),
    ).toHaveLength(3)
    expect(
      within(information).getAllByText('Sep 14, 2026, 1:30 PM CDT'),
    ).toHaveLength(2)

    const description = screen.getByText(
      'Heavy rain has caused flash flooding. Avoid low areas.',
    )
    const instructions = screen.getByText(
      "Turn around, don't drown. Move to higher ground.",
    )

    expect(description.textContent).toBe(
      'Heavy rain has caused flash flooding.\nAvoid low areas.',
    )
    expect(instructions.textContent).toBe(
      "Turn around, don't drown.\nMove to higher ground.",
    )
    expect(description).toHaveStyle({ whiteSpace: 'pre-wrap' })
    expect(instructions).toHaveStyle({ whiteSpace: 'pre-wrap' })
    expect(
      screen.getByRole('link', { name: 'View source alert' }),
    ).toHaveAttribute(
      'href',
      'https://api.weather.gov/alerts/urn:oid:test.complete',
    )
  })

  it('explains when optional alert details are missing', async () => {
    const nullableFeature = listFixture.features[1]

    if (nullableFeature === undefined) {
      throw new Error('The alert fixture must contain a nullable alert')
    }

    server.use(
      http.get('https://api.weather.gov/alerts/*', () =>
        HttpResponse.json(nullableFeature),
      ),
    )

    renderApp({
      initialEntries: ['/alerts/urn%3Aoid%3Atest.nullable'],
    })

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Special Weather Statement',
      }),
    ).toBeVisible()
    expect(screen.getByText('No headline provided')).toBeVisible()
    expect(screen.getAllByText('Not provided by NWS')).toHaveLength(4)
  })
})
