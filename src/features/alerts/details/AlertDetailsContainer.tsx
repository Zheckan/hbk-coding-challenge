import { useAlertDetails } from "./logic/useAlertDetails";
import { AlertDetailsView } from "./views/AlertDetailsView";

type AlertDetailsContainerProps = Readonly<{
  alertId: string;
}>;

export function AlertDetailsContainer({ alertId }: AlertDetailsContainerProps) {
  const alertDetails = useAlertDetails(alertId);

  return <AlertDetailsView {...alertDetails} />;
}
