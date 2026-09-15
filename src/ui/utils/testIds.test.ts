import { describe, expect, it } from 'vitest'

import { defineTestIds } from '@/ui/utils/testIds'

describe('defineTestIds', () => {
  it('builds IDs from nested object paths', () => {
    const ids = defineTestIds({
      alerts: {
        details: {
          alertId: true,
        },
      },
    })

    expect(ids.alerts.details.alertId).toBe('alerts-details-alertId')
  })

  it('appends values for repeated elements', () => {
    const ids = defineTestIds({
      alerts: {
        list: {
          row: (alertId: string) => alertId,
        },
      },
    })

    expect(ids.alerts.list.row('urn:oid:test.complete')).toBe(
      'alerts-list-row-urn:oid:test.complete',
    )
  })
})
