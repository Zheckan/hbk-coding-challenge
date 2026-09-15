import type { AlertSeverity, AlertStatus } from './alert'

export type AlertQuery = Readonly<{
  start?: Date
  end?: Date
  area?: string
  status?: AlertStatus
  severity?: AlertSeverity
  limit?: number
  cursor?: string
}>
