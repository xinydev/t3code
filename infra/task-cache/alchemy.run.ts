import { adopt } from "alchemy/AdoptPolicy";
import * as Alchemy from "alchemy";
import * as Axiom from "@alchemy.run/axiom";
import * as Layer from "effect/Layer";
import { Observability } from "./src/observability.ts";
import * as Cloudflare from "@alchemy.run/cloudflare";
import * as Effect from "effect/Effect";
import * as Secrets from "alchemy/Secrets";
import { WriterSecrets } from "./src/deploymentConfig.ts";
import { TASK_CACHE_TELEMETRY_ENABLED } from "./src/telemetry.ts";
import * as Worker from "./src/worker.ts";

export default Alchemy.Stack(
  "T3TaskCache",
  {
    providers: TASK_CACHE_TELEMETRY_ENABLED
      ? Axiom.providers().pipe(Layer.provideMerge(Cloudflare.providers()))
      : Cloudflare.providers(),
    state: Cloudflare.state(),
    secrets: [Secrets.DotEnv(), Secrets.ProcessEnv(), WriterSecrets],
  },
  Effect.gen(function* () {
    const worker = yield* Worker.Worker;
    return {
      url: worker.url,
      workerName: worker.workerName,
      ...(TASK_CACHE_TELEMETRY_ENABLED ? { dashboard: (yield* Observability).dashboard.uid } : {}),
    };
  }).pipe(Effect.provide(Worker.layer), adopt(true)),
);
