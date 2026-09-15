import { Box, Link, Paper, Stack, Typography } from "@mui/material";
import { type ReactNode, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";

import { AlertSeverityChip } from "@/features/alerts/common/components/AlertSeverityChip";
import { formatAlertDate } from "@/features/alerts/common/logic/formatAlertDate";
import type { Alert } from "@/features/alerts/common/model/alert";

type AlertDetailsProps = Readonly<{
  alert: Alert;
  backTo: string;
}>;

export function AlertDetails({ alert, backTo }: AlertDetailsProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [alert.id]);

  return (
    <Stack spacing={3}>
      <Link component={RouterLink} to={backTo}>
        Back to alerts
      </Link>

      <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
        <Typography color="text.secondary" variant="overline">
          Alert details
        </Typography>
        <Typography component="h1" ref={headingRef} tabIndex={-1} variant="h3">
          {alert.event}
        </Typography>
        <Typography color="text.secondary" component="p" variant="h6">
          {alert.headline ?? "No headline provided"}
        </Typography>
        <AlertSeverityChip severity={alert.severity} />
      </Stack>

      <Paper
        aria-labelledby="alert-information-heading"
        component="section"
        sx={{ p: { xs: 2, sm: 3 } }}
      >
        <Typography id="alert-information-heading" sx={{ mb: 2 }} variant="h5">
          Alert information
        </Typography>
        <Box
          component="dl"
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            m: 0,
          }}
        >
          <DetailItem label="Affected area">{alert.affectedArea}</DetailItem>
          <DetailItem label="Issued time">
            <AlertTime dateTime={alert.issuedAt} />
          </DetailItem>
          <DetailItem label="Effective time">
            <AlertTime dateTime={alert.effectiveAt} />
          </DetailItem>
          <DetailItem label="Onset time">
            <AlertTime dateTime={alert.onsetAt} />
          </DetailItem>
          <DetailItem label="Expiry time">
            <AlertTime dateTime={alert.expiresAt} />
          </DetailItem>
          <DetailItem label="Expected end time">
            <AlertTime dateTime={alert.expectedEndAt} />
          </DetailItem>
          <DetailItem label="Severity">{alert.severity}</DetailItem>
          <DetailItem label="Urgency">{alert.urgency}</DetailItem>
          <DetailItem label="Certainty">{alert.certainty}</DetailItem>
          <DetailItem label="Message type">{alert.messageType}</DetailItem>
          <DetailItem label="Status">{alert.status}</DetailItem>
          <DetailItem label="Sender">
            <Stack spacing={0.5}>
              <span>{alert.senderName}</span>
              <span>{alert.sender}</span>
            </Stack>
          </DetailItem>
        </Box>
      </Paper>

      <AlertTextSection
        content={alert.description}
        heading="Description"
        headingId="alert-description-heading"
      />
      <AlertTextSection
        content={alert.instruction}
        heading="Instructions"
        headingId="alert-instructions-heading"
      />

      <Link href={alert.sourceUrl} rel="noreferrer" target="_blank">
        View source alert
      </Link>
    </Stack>
  );
}

function DetailItem({
  label,
  children,
}: Readonly<{ label: string; children: ReactNode }>) {
  return (
    <Box component="div">
      <Typography color="text.secondary" component="dt" variant="body2">
        {label}
      </Typography>
      <Typography component="dd" sx={{ m: 0 }}>
        {children}
      </Typography>
    </Box>
  );
}

function AlertTime({ dateTime }: Readonly<{ dateTime: string | null }>) {
  if (dateTime === null) {
    return <>Not provided by NWS</>;
  }

  return <time dateTime={dateTime}>{formatAlertDate(dateTime)}</time>;
}

function AlertTextSection({
  heading,
  headingId,
  content,
}: Readonly<{
  heading: string;
  headingId: string;
  content: string | null;
}>) {
  return (
    <Paper
      aria-labelledby={headingId}
      component="section"
      sx={{ p: { xs: 2, sm: 3 } }}
    >
      <Typography id={headingId} sx={{ mb: 1 }} variant="h5">
        {heading}
      </Typography>
      <Typography sx={{ whiteSpace: "pre-wrap" }}>
        {content ?? "Not provided by NWS"}
      </Typography>
    </Paper>
  );
}
