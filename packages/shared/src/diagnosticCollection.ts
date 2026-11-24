import * as Layer from "effect/Layer";
import * as Metric from "effect/Metric";
import * as References from "effect/References";

const disabledMetricRegistry: Metric.MetricRegistry = new Map();
disabledMetricRegistry.set = () => disabledMetricRegistry;

export const layer = Layer.mergeAll(
  Layer.succeed(Metric.MetricRegistry, disabledMetricRegistry),
  Layer.succeed(References.TracerEnabled, false),
  Layer.succeed(References.DisablePropagation, true),
);
