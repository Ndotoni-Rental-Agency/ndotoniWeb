import { initTelemetry } from './src/lib/telemetry/sentry';
import { initTelemetryTransportLifecycle } from './src/lib/telemetry/transport';

initTelemetry();
initTelemetryTransportLifecycle();
