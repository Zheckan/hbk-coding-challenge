import { describe, expect, it } from 'vitest'

import type { AlertsListState } from './alerts-list-state'
import { serializeAlertsListState } from './serializeAlertsListState'

describe('serializeAlertsListState', () => {
  it('keeps non-default list state in the URL', () => {
    const state = {
      issuedFrom: '2026-09-10',
      issuedTo: '2026-09-14',
      area: 'KS',
      severity: 'Severe',
      status: 'Actual',
      search: 'flood',
      sort: 'severity',
      direction: 'asc',
      page: 2,
    } satisfies AlertsListState

    expect(serializeAlertsListState(state).toString()).toBe(
      'from=2026-09-10&to=2026-09-14&area=KS&severity=severe&status=actual&q=flood&sort=severity&direction=asc&page=2',
    )
  })
})
