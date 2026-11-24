import type { AuthClientPresentationMetadata } from "@t3tools/contracts";
export function authClientMetadata(): AuthClientPresentationMetadata {
  return {
    // oxlint-disable-next-line t3code/no-untranslated-copy -- product name
    label: "T3 Code Mobile",
  };
}
