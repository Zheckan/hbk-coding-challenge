import { TextField } from '@mui/material'

import type { AlertsDateBounds } from '../logic/alerts-list-state'
import { getAlertsDateOptions } from '../logic/getAlertsDateOptions'

type AlertsDateFilterProps = Readonly<{
  label: string
  emptyLabel: string
  value: string
  dateBounds: AlertsDateBounds
  onChange: (value: string) => void
}>

export function AlertsDateFilter({
  label,
  emptyLabel,
  value,
  dateBounds,
  onChange,
}: AlertsDateFilterProps) {
  const options = getAlertsDateOptions(dateBounds)
  const unsupportedDate =
    value !== '' && !options.some((option) => option.value === value)
      ? value
      : null

  return (
    <TextField
      fullWidth
      helperText="Past seven days available from NWS"
      label={label}
      onChange={(event) => {
        onChange(event.target.value)
      }}
      select
      slotProps={{
        inputLabel: { shrink: true },
        select: { native: true },
      }}
      value={value}
    >
      <option value="">{emptyLabel}</option>
      {unsupportedDate === null ? null : (
        <option disabled value={unsupportedDate}>
          Unsupported date: {unsupportedDate}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </TextField>
  )
}
