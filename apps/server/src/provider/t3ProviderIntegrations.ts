import {
  idleCompactionOf,
  type OrchestrationV2ConversationMessage,
  type OrchestrationV2Run,
  type ProviderDriverKind,
} from "@t3tools/contracts";
import * as Context from "effect/Context";
import * as Layer from "effect/Layer";

export const t3ProviderIntegrationsEnabled = (_driver: ProviderDriverKind): boolean => false;

export class AutomaticProviderContext extends Context.Reference(
  "t3/provider/AutomaticProviderContext",
  { defaultValue: () => true },
) {}

export const layerWithoutAutomaticContext = Layer.succeed(AutomaticProviderContext, false);

export function isAutomaticProviderPrompt(
  message: Pick<
    OrchestrationV2ConversationMessage,
    | "text"
    | "attachments"
    | "createdBy"
    | "creationSource"
    | "idleCompaction"
    | "scheduledTaskId"
    | "notification"
    | "delegatedCompletion"
  >,
  run: Pick<
    OrchestrationV2Run,
    "restartContinuationOfRunId" | "usageLimitContinuationOfRunId"
  > = {},
): boolean {
  return (
    run.restartContinuationOfRunId !== undefined ||
    run.usageLimitContinuationOfRunId !== undefined ||
    (message.createdBy === "agent" &&
      message.creationSource === "server" &&
      message.scheduledTaskId === undefined &&
      (message.notification !== undefined ||
        message.delegatedCompletion !== undefined ||
        idleCompactionOf({ ...message, role: "user" }) !== undefined))
  );
}
