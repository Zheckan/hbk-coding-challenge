import { useAlerts } from './logic/useAlerts'
import { AlertsView } from './views/AlertsView'

export function AlertsContainer() {
  const alerts = useAlerts()

  return <AlertsView {...alerts} />
}
