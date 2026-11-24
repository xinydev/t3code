import { describe, expect, it } from "vite-plus/test";

import { deriveAuthClientMetadata, resolveSessionCookieName } from "./utils.ts";

describe("deriveAuthClientMetadata", () => {
  it("keeps only the label and the remote classification", () => {
    const metadata = deriveAuthClientMetadata({
      request: {
        headers: {
          "user-agent": "Mozilla/5.0 (Macintosh) Chrome/136.0.7103.93 Electron/36.3.2",
          "x-forwarded-for": "100.64.0.2",
        },
        source: { remoteAddress: "::ffff:127.0.0.1" },
      } as never,
      presented: { label: "T3 Code Mobile", deviceType: "mobile", os: "iOS" },
    });

    expect(metadata).toEqual({
      label: "T3 Code Mobile",
      deviceType: "unknown",
      remoteConnection: true,
    });
  });

  it("keeps loopback pairing local and ignores proxy headers from a direct remote peer", () => {
    const local = deriveAuthClientMetadata({
      request: { headers: {}, source: { remoteAddress: "127.0.0.1" } } as never,
    });
    const remote = deriveAuthClientMetadata({
      request: {
        headers: { "x-forwarded-for": "127.0.0.1" },
        source: { remoteAddress: "192.168.1.20" },
      } as never,
    });
    expect(local).toEqual({ deviceType: "unknown" });
    expect(remote).toEqual({ deviceType: "unknown", remoteConnection: true });
  });
});

describe("session cookie isolation", () => {
  it("isolates loopback web servers by port and server state", () => {
    const first = resolveSessionCookieName({
      mode: "web",
      port: 5775,
      host: "127.0.0.1",
      instanceKey: "/tmp/t3-agent-one",
      environmentId: "environment-one",
      development: true,
    });
    const second = resolveSessionCookieName({
      mode: "web",
      port: 5775,
      host: "127.0.0.1",
      instanceKey: "/tmp/t3-agent-two",
      environmentId: "environment-two",
      development: true,
    });

    expect(first).toMatch(/^t3_session_5775_[a-f0-9]{12}$/);
    expect(second).toMatch(/^t3_session_5775_[a-f0-9]{12}$/);
    expect(first).not.toBe(second);
  });

  // regression: #8085 isolate remote web session cookies
  it("isolates remote web servers by server state", () => {
    const first = resolveSessionCookieName({
      mode: "web",
      port: 3773,
      host: "192.168.1.50",
      instanceKey: "/srv/t3-one",
      environmentId: "environment-one",
      development: false,
    });
    const second = resolveSessionCookieName({
      mode: "web",
      port: 5775,
      host: "192.168.1.50",
      instanceKey: "/srv/t3-two",
      environmentId: "environment-two",
      development: false,
    });

    expect(first).toMatch(/^t3_session_[a-f0-9]{12}$/);
    expect(second).toMatch(/^t3_session_[a-f0-9]{12}$/);
    expect(first).not.toBe(second);
  });

  it("keeps a remote web server cookie stable across port changes", () => {
    const first = resolveSessionCookieName({
      mode: "web",
      port: 8080,
      host: "0.0.0.0",
      instanceKey: "/srv/t3",
      environmentId: "environment-one",
      development: false,
    });
    const second = resolveSessionCookieName({
      mode: "web",
      port: 9090,
      host: "app.example.com",
      instanceKey: "/srv/t3",
      environmentId: "environment-one",
      development: false,
    });

    expect(first).toBe(second);
  });
});
