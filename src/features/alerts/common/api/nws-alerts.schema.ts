import { z } from "zod";

import {
  type Alert,
  ALERT_CERTAINTIES,
  ALERT_MESSAGE_TYPES,
  ALERT_SEVERITIES,
  ALERT_STATUSES,
  ALERT_URGENCIES,
  type AlertPage,
} from "../model/alert";

const dateTimeSchema = z.iso.datetime({ offset: true });
const optionalDateTimeSchema = dateTimeSchema
  .nullish()
  .transform((value) => value ?? null);
const optionalTextSchema = z
  .string()
  .nullish()
  .transform((value) => value ?? null);

const alertPropertiesSchema = z.object({
  id: z.string().min(1),
  areaDesc: z.string(),
  sent: dateTimeSchema,
  effective: dateTimeSchema,
  onset: optionalDateTimeSchema,
  expires: dateTimeSchema,
  ends: optionalDateTimeSchema,
  status: z.enum(ALERT_STATUSES),
  messageType: z.enum(ALERT_MESSAGE_TYPES),
  severity: z.enum(ALERT_SEVERITIES),
  certainty: z.enum(ALERT_CERTAINTIES),
  urgency: z.enum(ALERT_URGENCIES),
  event: z.string(),
  sender: z.string(),
  senderName: z.string(),
  headline: optionalTextSchema,
  description: optionalTextSchema,
  instruction: optionalTextSchema,
});

const alertFeatureSchema = z.object({
  id: z.url(),
  type: z.literal("Feature"),
  properties: alertPropertiesSchema,
});

const alertCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(alertFeatureSchema),
  pagination: z
    .object({
      next: z.url().optional(),
    })
    .optional(),
});

const problemDetailsSchema = z.object({
  title: z.string().optional(),
  detail: z.string().optional(),
  correlationId: z.string().optional(),
});

type AlertFeature = z.infer<typeof alertFeatureSchema>;

function toAlert(feature: AlertFeature): Alert {
  const properties = feature.properties;

  return {
    id: properties.id,
    sourceUrl: feature.id,
    affectedArea: properties.areaDesc,
    issuedAt: properties.sent,
    effectiveAt: properties.effective,
    onsetAt: properties.onset,
    expiresAt: properties.expires,
    expectedEndAt: properties.ends,
    status: properties.status,
    messageType: properties.messageType,
    severity: properties.severity,
    certainty: properties.certainty,
    urgency: properties.urgency,
    event: properties.event,
    sender: properties.sender,
    senderName: properties.senderName,
    headline: properties.headline,
    description: properties.description,
    instruction: properties.instruction,
  };
}

function readNextCursor(nextUrl: string | undefined): string | null {
  if (nextUrl === undefined) {
    return null;
  }

  const cursor = new URL(nextUrl).searchParams.get("cursor");

  if (cursor === null || cursor.length === 0) {
    throw new Error("NWS pagination link does not contain a cursor");
  }

  return cursor;
}

export function parseAlertCollection(input: unknown): AlertPage {
  const collection = alertCollectionSchema.parse(input);

  return {
    alerts: collection.features.map(toAlert),
    nextCursor: readNextCursor(collection.pagination?.next),
  };
}

export function parseAlert(input: unknown): Alert {
  return toAlert(alertFeatureSchema.parse(input));
}

export function parseProblemDetails(input: unknown): Readonly<{
  title: string | null;
  detail: string | null;
  correlationId: string | null;
}> | null {
  const result = problemDetailsSchema.safeParse(input);

  if (!result.success) {
    return null;
  }

  return {
    title: result.data.title ?? null,
    detail: result.data.detail ?? null,
    correlationId: result.data.correlationId ?? null,
  };
}
