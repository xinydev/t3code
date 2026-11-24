import type { AuthClientPresentationMetadata, ClientOs } from "@t3tools/contracts";

export interface BrowserIdentity {
  readonly userAgent: string;
  readonly platform: string;
  readonly maxTouchPoints: number;
}

function isIpadosDesktopUserAgent(identity: BrowserIdentity): boolean {
  return (
    /macintosh/i.test(identity.userAgent) &&
    /mac/i.test(identity.platform) &&
    identity.maxTouchPoints > 1
  );
}

export function browserClientOs(identity: BrowserIdentity): ClientOs {
  const userAgent = identity.userAgent;
  if (userAgent.trim() === "") return "unknown";
  if (/iphone|ipad|ipod/i.test(userAgent) || isIpadosDesktopUserAgent(identity)) return "iOS";
  if (/android/i.test(userAgent)) return "Android";
  if (/cros/i.test(userAgent)) return "ChromeOS";
  if (/windows/i.test(userAgent)) return "Windows";
  if (/macintosh|mac os x/i.test(userAgent)) return "macOS";
  if (/linux|x11/i.test(userAgent)) return "Linux";
  return "other";
}

export function clientPresentationMetadata(desktop: boolean): AuthClientPresentationMetadata {
  return {
    // oxlint-disable-next-line t3code/no-untranslated-copy -- client label stored on the server
    label: desktop ? "T3 Code Desktop" : "T3 Code Web",
  };
}
