import type { AlertsDateBounds } from './alerts-list-state'
import { formatLocalDate, parseLocalDate } from './local-dates'

export type AlertsDateOption = Readonly<{
  value: string
  label: string
}>

export function getAlertsDateOptions(
  dateBounds: AlertsDateBounds,
): readonly AlertsDateOption[] {
  const formatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const currentDate = parseLocalDate(dateBounds.min)
  const lastDate = parseLocalDate(dateBounds.max)

  if (currentDate === null || lastDate === null) {
    return []
  }

  const options: AlertsDateOption[] = []

  while (currentDate <= lastDate) {
    options.push({
      value: formatLocalDate(currentDate),
      label: formatter.format(currentDate),
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return options
}
