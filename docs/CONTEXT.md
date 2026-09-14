# Weather alerts explorer

This context covers finding and reading National Weather Service alerts. It distinguishes the alert message lifecycle from the weather event timeline so filters and labels remain unambiguous.

## Language

**Alert**:
An official message from the National Weather Service about a hazardous event or a test of its alerting system.
_Avoid_: Warning, notification

**Issued time**:
The time NWS originated the alert message. The application's date range filters this time.
_Avoid_: Alert date, start time

**Effective time**:
The time from which the alert message's information applies.
_Avoid_: Issued time

**Onset time**:
The expected beginning of the weather event described by the alert, when NWS provides one.
_Avoid_: Effective time

**Expected end time**:
The expected end of the weather event, when NWS provides one.
_Avoid_: Expiry time

**Expiry time**:
The time after which the alert message itself is no longer valid.
_Avoid_: Expected end time

**Affected area**:
The human-readable geographic area to which the alert applies.
_Avoid_: Location

**Severity**:
The magnitude of the event's expected impact, ordered Extreme, Severe, Moderate, Minor, then Unknown.
_Avoid_: Urgency

**Urgency**:
How soon recipients need to respond to the event.
_Avoid_: Severity

**Certainty**:
The confidence that the event has occurred or will occur.
_Avoid_: Severity, probability
