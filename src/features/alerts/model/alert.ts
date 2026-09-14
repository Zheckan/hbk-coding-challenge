export const ALERT_STATUSES = [
  "Actual",
  "Exercise",
  "System",
  "Test",
  "Draft",
] as const;

export const ALERT_MESSAGE_TYPES = [
  "Alert",
  "Update",
  "Cancel",
  "Ack",
  "Error",
] as const;

export const ALERT_SEVERITIES = [
  "Extreme",
  "Severe",
  "Moderate",
  "Minor",
  "Unknown",
] as const;

export const ALERT_CERTAINTIES = [
  "Observed",
  "Likely",
  "Possible",
  "Unlikely",
  "Unknown",
] as const;

export const ALERT_URGENCIES = [
  "Immediate",
  "Expected",
  "Future",
  "Past",
  "Unknown",
] as const;

export type AlertStatus = (typeof ALERT_STATUSES)[number];
export type AlertMessageType = (typeof ALERT_MESSAGE_TYPES)[number];
export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];
export type AlertCertainty = (typeof ALERT_CERTAINTIES)[number];
export type AlertUrgency = (typeof ALERT_URGENCIES)[number];

export type Alert = Readonly<{
  id: string;
  sourceUrl: string;

  affectedArea: string;
  issuedAt: string;
  effectiveAt: string;
  onsetAt: string | null;
  expiresAt: string;
  expectedEndAt: string | null;
  status: AlertStatus;
  messageType: AlertMessageType;
  severity: AlertSeverity;
  certainty: AlertCertainty;
  urgency: AlertUrgency;
  event: string;
  sender: string;
  senderName: string;
  headline: string | null;
  description: string;
  instruction: string | null;
}>;

export type AlertPage = Readonly<{
  alerts: readonly Alert[];
  nextCursor: string | null;
}>;
