import { managedCapabilityDenial, type ServerConfig } from "@t3tools/contracts";
import { HOSTED_SHARING_ENABLED } from "@t3tools/shared/connectAuth";

export function canShareWithGuest(
  permitted: boolean,
  config:
    | {
        readonly settings: Pick<ServerConfig["settings"], "guestSharingEnabled">;
        readonly managedPolicy?: ServerConfig["managedPolicy"];
      }
    | undefined,
) {
  return (
    HOSTED_SHARING_ENABLED &&
    permitted &&
    config?.settings.guestSharingEnabled === true &&
    managedCapabilityDenial(config.managedPolicy, "connect") === undefined
  );
}
