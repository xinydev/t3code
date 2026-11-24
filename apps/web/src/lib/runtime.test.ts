import { afterEach, expect, it, vi } from "@effect/vitest";
import { withRelayClientTracing } from "@t3tools/shared/relayTracing";
import * as Effect from "effect/Effect";
import * as Metric from "effect/Metric";
import * as Tracer from "effect/Tracer";
import "./runtime";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

it("discards client spans and measurements even with relay tracing configured", async () => {
  vi.resetModules();
  vi.stubEnv("VITE_RELAY_OTLP_TRACES_URL", "https://telemetry.example.test/v1/traces");
  vi.stubEnv("VITE_RELAY_OTLP_TRACES_DATASET", "relay-test");
  vi.stubEnv("VITE_RELAY_OTLP_TRACES_TOKEN", "test-token");
  const request = vi.fn<typeof fetch>(async () => new Response(null, { status: 202 }));
  vi.stubGlobal("fetch", request);
  const { runtime } = await import("./runtime");
  const { setServerRelayTelemetry } = await import("../cloud/publicConfig");
  setServerRelayTelemetry(true);
  const span = vi.fn(
    (options: Parameters<Tracer.Tracer["span"]>[0]) => new Tracer.NativeSpan(options),
  );

  try {
    const recorded = await runtime.runPromise(
      Metric.update(Metric.counter("privacy.test-counter"), 1).pipe(
        Effect.andThen(Metric.snapshot),
        Effect.withSpan("relay.first-operation"),
        withRelayClientTracing,
        Effect.provideService(Tracer.Tracer, Tracer.make({ span })),
      ),
    );
    expect(recorded).toEqual([]);
    expect(span).not.toHaveBeenCalled();
  } finally {
    await runtime.dispose();
  }
  expect(request).not.toHaveBeenCalled();
});
