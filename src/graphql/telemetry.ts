/** Client telemetry — hand-maintained until Amplify codegen includes this mutation. */
export const reportClientTelemetry = /* GraphQL */ `
  mutation ReportClientTelemetry($events: [ClientTelemetryEventInput!]!) {
    reportClientTelemetry(events: $events)
  }
`;
