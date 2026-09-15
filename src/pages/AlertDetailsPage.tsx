import { Navigate, useParams } from 'react-router-dom'

import { AlertDetailsContainer } from '@/features/alerts/details/AlertDetailsContainer'

export function AlertDetailsPage() {
  const { alertId } = useParams()

  if (alertId === undefined) {
    return <Navigate replace to="/alerts" />
  }

  return <AlertDetailsContainer alertId={alertId} />
}
