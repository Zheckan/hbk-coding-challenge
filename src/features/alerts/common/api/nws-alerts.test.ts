import { delay, http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import listFixture from '@/test/fixtures/nws-alert-list.json'
import { server } from '@/test/server'
import { fetchAlert, fetchAlerts, NwsApiError } from './nws-alerts'

const detailFixture = listFixture.features[0]

if (detailFixture === undefined) {
  throw new Error('The alert list fixture must contain an alert')
}

describe('fetchAlerts', () => {
  it('requests filters and returns normalized alerts with the next cursor', async () => {
    let requestedUrl: URL | undefined
    let requestedAccept: string | null | undefined

    server.use(
      http.get('https://api.weather.gov/alerts', ({ request }) => {
        requestedUrl = new URL(request.url)
        requestedAccept = request.headers.get('Accept')
        return HttpResponse.json(listFixture)
      }),
    )

    const controller = new AbortController()
    const result = await fetchAlerts(
      {
        start: new Date('2026-09-14T05:00:00.000Z'),
        end: new Date('2026-09-15T04:59:59.999Z'),
        area: 'ks',
        status: 'Actual',
        severity: 'Severe',
        limit: 2,
        cursor: 'current-page-token',
      },
      { signal: controller.signal },
    )

    expect(requestedUrl?.searchParams.get('start')).toBe(
      '2026-09-14T05:00:00.000Z',
    )
    expect(requestedUrl?.searchParams.get('end')).toBe(
      '2026-09-15T04:59:59.999Z',
    )
    expect(requestedUrl?.searchParams.get('area')).toBe('KS')
    expect(requestedUrl?.searchParams.get('status')).toBe('actual')
    expect(requestedUrl?.searchParams.get('severity')).toBe('Severe')
    expect(requestedUrl?.searchParams.get('limit')).toBe('2')
    expect(requestedUrl?.searchParams.get('cursor')).toBe('current-page-token')
    expect(requestedAccept).toBe('application/geo+json')

    expect(result).toEqual({
      alerts: [
        {
          id: 'urn:oid:test.complete',
          sourceUrl: 'https://api.weather.gov/alerts/urn:oid:test.complete',
          affectedArea: 'Daviess, MO; DeKalb, MO',
          issuedAt: '2026-09-14T08:29:00-05:00',
          effectiveAt: '2026-09-14T08:29:00-05:00',
          onsetAt: '2026-09-14T08:29:00-05:00',
          expiresAt: '2026-09-14T13:30:00-05:00',
          expectedEndAt: '2026-09-14T13:30:00-05:00',
          status: 'Actual',
          messageType: 'Update',
          severity: 'Severe',
          certainty: 'Likely',
          urgency: 'Immediate',
          event: 'Flash Flood Warning',
          sender: 'w-nws.webmaster@noaa.gov',
          senderName: 'NWS Kansas City/Pleasant Hill MO',
          headline: 'Flash Flood Warning issued September 14 at 8:29AM CDT',
          description: 'Heavy rain has caused flash flooding.',
          instruction:
            "Turn around, don't drown when encountering flooded roads.",
        },
        {
          id: 'urn:oid:test.nullable',
          sourceUrl: 'https://api.weather.gov/alerts/urn:oid:test.nullable',
          affectedArea: 'Lake County',
          issuedAt: '2026-09-14T12:00:00+00:00',
          effectiveAt: '2026-09-14T12:00:00+00:00',
          onsetAt: null,
          expiresAt: '2026-09-14T18:00:00+00:00',
          expectedEndAt: null,
          status: 'Actual',
          messageType: 'Alert',
          severity: 'Unknown',
          certainty: 'Unknown',
          urgency: 'Unknown',
          event: 'Special Weather Statement',
          sender: 'w-nws.webmaster@noaa.gov',
          senderName: 'National Weather Service',
          headline: null,
          description: null,
          instruction: null,
        },
      ],
      nextCursor: 'next-page-token',
    })
  })

  it('skips an alert that does not match the NWS alert shape', async () => {
    server.use(
      http.get('https://api.weather.gov/alerts', () =>
        HttpResponse.json({
          ...listFixture,
          features: [detailFixture, { type: 'Feature', properties: {} }],
        }),
      ),
    )

    const result = await fetchAlerts({})

    expect(result.alerts.map((alert) => alert.id)).toEqual([
      'urn:oid:test.complete',
    ])
  })

  it('reads unrecognized severity, certainty, and urgency values as Unknown', async () => {
    server.use(
      http.get('https://api.weather.gov/alerts', () =>
        HttpResponse.json({
          ...listFixture,
          features: [
            {
              ...detailFixture,
              properties: {
                ...detailFixture.properties,
                severity: 'Catastrophic',
                certainty: 'Probable',
                urgency: 'Soon',
              },
            },
          ],
        }),
      ),
    )

    const [alert] = (await fetchAlerts({})).alerts

    expect(alert).toMatchObject({
      severity: 'Unknown',
      certainty: 'Unknown',
      urgency: 'Unknown',
    })
  })

  it('reports an invalid NWS response through the public error type', async () => {
    server.use(
      http.get('https://api.weather.gov/alerts', () =>
        HttpResponse.json({ type: 'FeatureCollection', features: {} }),
      ),
    )

    const request = fetchAlerts({})

    await expect(request).rejects.toBeInstanceOf(NwsApiError)
    await expect(request).rejects.toMatchObject({
      name: 'NwsApiError',
      kind: 'invalid-response',
      status: null,
      correlationId: null,
    })
  })

  it('reports HTTP status and NWS correlation details', async () => {
    server.use(
      http.get('https://api.weather.gov/alerts', () =>
        HttpResponse.json(
          {
            type: 'urn:noaa:nws:api:RateLimitExceeded',
            title: 'Rate limit exceeded',
            status: 429,
            detail: 'Wait before trying this request again.',
            instance: 'urn:noaa:nws:api:request:test-request',
            correlationId: 'body-correlation-id',
          },
          {
            status: 429,
            headers: { 'X-Correlation-Id': 'header-correlation-id' },
          },
        ),
      ),
    )

    const request = fetchAlerts({})

    await expect(request).rejects.toMatchObject({
      name: 'NwsApiError',
      message: 'Wait before trying this request again.',
      kind: 'http',
      status: 429,
      correlationId: 'header-correlation-id',
    })
  })

  it('reports a network failure through the public error type', async () => {
    server.use(
      http.get('https://api.weather.gov/alerts', () => HttpResponse.error()),
    )

    await expect(fetchAlerts({})).rejects.toMatchObject({
      name: 'NwsApiError',
      message: 'Could not reach the NWS API',
      kind: 'network',
      status: null,
      correlationId: null,
    })
  })

  it('cancels an in-flight request through its AbortSignal', async () => {
    server.use(
      http.get('https://api.weather.gov/alerts', async () => {
        await delay('infinite')
        return HttpResponse.json(listFixture)
      }),
    )

    const controller = new AbortController()
    const request = fetchAlerts({}, { signal: controller.signal })
    controller.abort()

    await expect(request).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('rejects a limit outside the NWS range before requesting', async () => {
    let requestCount = 0

    server.use(
      http.get('https://api.weather.gov/alerts', () => {
        requestCount += 1
        return HttpResponse.json(listFixture)
      }),
    )

    await expect(fetchAlerts({ limit: 501 })).rejects.toThrow(
      new RangeError('Alert query limit must be an integer from 1 to 500'),
    )
    expect(requestCount).toBe(0)
  })
})

describe('fetchAlert', () => {
  it('requests an encoded alert ID and returns a normalized alert', async () => {
    let requestedPath: string | undefined

    server.use(
      http.get('https://api.weather.gov/alerts/*', ({ request }) => {
        requestedPath = new URL(request.url).pathname
        return HttpResponse.json(detailFixture)
      }),
    )

    const result = await fetchAlert('urn:oid:test.complete')

    expect(requestedPath).toBe('/alerts/urn%3Aoid%3Atest.complete')
    expect(result).toMatchObject({
      id: 'urn:oid:test.complete',
      sourceUrl: 'https://api.weather.gov/alerts/urn:oid:test.complete',
      affectedArea: 'Daviess, MO; DeKalb, MO',
      event: 'Flash Flood Warning',
      severity: 'Severe',
      instruction: "Turn around, don't drown when encountering flooded roads.",
    })
  })
})
