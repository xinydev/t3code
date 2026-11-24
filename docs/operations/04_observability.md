# Observability

The server writes operational messages to its console. The application disables
trace collection, OTLP export, resource samples, and the heap snapshot signal
handler. See [diagnostics and product usage data](../user/telemetry.md).

To inspect a trace file captured by an earlier build, run the offline summary
command against that file.

```sh
T3CODE_TRACE_FILE=/path/to/server.trace.ndjson t3 trace summary --since 30m --limit 40
```
