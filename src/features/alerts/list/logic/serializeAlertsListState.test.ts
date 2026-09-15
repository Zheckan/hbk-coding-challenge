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
      status: 'Test',
      search: 'flood',
      sort: 'severity',
      direction: 'asc',
      page: 2,
      pageSize: 50,
    } satisfies AlertsListState

    expect(serializeAlertsListState(state).toString()).toBe(
      'from=2026-09-10&to=2026-09-14&area=KS&severity=severe&status=test&q=flood&sort=severity&direction=asc&pageSize=50&page=2',
    )
  })

  it('leaves the default status out and writes every status as all', () => {
    const defaultState = {
      issuedFrom: '',
      issuedTo: '',
      area: '',
      severity: '',
      status: 'Actual',
      search: '',
      sort: 'issuedAt',
      direction: 'desc',
      page: 1,
      pageSize: 25,
    } satisfies AlertsListState

    expect(serializeAlertsListState(defaultState).toString()).toBe('')
    expect(
      serializeAlertsListState({ ...defaultState, status: '' }).toString(),
    ).toBe('status=all')
  })
})
