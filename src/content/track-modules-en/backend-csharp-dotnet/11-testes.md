---
title: "Week 11 — Test pyramid and load testing"
order: 11
duration: "~8h"
domain: "Quality"
officialResources:
  - title: "Integration tests in ASP.NET Core"
    description: "Testing the HTTP application with WebApplicationFactory and test dependencies."
    url: "https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests?view=aspnetcore-10.0"
  - title: "First load test with k6"
    description: "Creating scenarios, metrics and performance thresholds."
    url: "https://grafana.com/docs/k6/latest/get-started/write-your-first-test/"
exercises:
  - "Write unit tests for order, payment and idempotency rules, including the new rule with its flag on and off"
  - "Test the API against PostgreSQL and run an end-to-end scenario from order creation to the simulated payment result"
  - "Create a k6 load test for order reads and creation; set thresholds and compare results with and without cache"
---

Organize the suite by cost and purpose: many fast behavior tests, integration tests for real boundaries and a few end-to-end scenarios. Record baseline latency and failure rates before interpreting the load test.
