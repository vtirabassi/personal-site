---
title: "Week 12 — Observability: logs, metrics and traces"
order: 12
duration: "~8h"
domain: "Operations"
officialResources:
  - title: "Observability with OpenTelemetry in .NET"
    description: "Instrumentation and the three main signals in the .NET ecosystem."
    url: "https://learn.microsoft.com/en-us/dotnet/core/diagnostics/observability-with-otel"
  - title: "OpenTelemetry for .NET"
    description: "Instrumenting traces, metrics and logs in .NET applications."
    url: "https://opentelemetry.io/docs/languages/dotnet/"
exercises:
  - "Add structured logs with order and correlation identifiers while excluding sensitive payment data"
  - "Measure API and background processing rates, latency and failures; create traces linking a request to the consumer and worker"
  - "Simulate a payment failure and investigate it with logs, metrics and traces; record the cause, impact and fix"
---

Finish the project by showing an order's journey from the HTTP call through asynchronous tasks. Use all three signals to distinguish slowness, duplication and processing failures in the local environment.
