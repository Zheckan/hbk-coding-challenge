import { describe, expect, it } from 'vitest'

import { NwsApiError } from './nws-alerts'
import { shouldRetryNwsRequest } from './nws-error-policy'

describe('shouldRetryNwsRequest', () => {
  it.each([
    ['a network failure', new NwsApiError({ kind: 'network', message: '' })],
    [
      'rate limiting',
      new NwsApiError({ kind: 'http', message: '', status: 429 }),
    ],
    [
      'a server failure',
      new NwsApiError({ kind: 'http', message: '', status: 503 }),
    ],
  ])('retries %s once', (_description, error) => {
    expect(shouldRetryNwsRequest(0, error)).toBe(true)
    expect(shouldRetryNwsRequest(1, error)).toBe(false)
  })

  it('does not retry other client errors', () => {
    const error = new NwsApiError({ kind: 'http', message: '', status: 400 })

    expect(shouldRetryNwsRequest(0, error)).toBe(false)
  })
})
