# Diagnostic collection

Keep the production app's diagnostics disconnected. The [runtime policy](../../packages/shared/src/diagnosticCollection.ts)
discards spans and measurements. Server and desktop composition use local no-op
services for diagnostic interfaces that older clients still call. They keep the
session, project, and provider state needed to operate the app.

Pairing uses the request address only to distinguish a remote redemption of a
startup credential. The session's subject preserves that classification so a later
change to the remote-client policy can revoke it without storing the address.
Older rows can still use their saved address for this check.
