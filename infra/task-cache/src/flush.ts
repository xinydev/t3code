import { TASK_CACHE_TELEMETRY_ENABLED, flushTelemetry } from "./telemetry.ts";

if (TASK_CACHE_TELEMETRY_ENABLED) await flushTelemetry();
