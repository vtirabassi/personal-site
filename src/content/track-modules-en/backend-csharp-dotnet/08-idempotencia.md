---
title: "Week 8 — Idempotency in APIs and consumers"
order: 8
duration: "~8h"
domain: "Distributed systems"
officialResources:
  - title: "Idempotent Consumer pattern"
    description: "Persistent deduplication to prevent repeated effects after message redelivery."
    url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/idempotent-consumer"
  - title: "Idempotent method semantics in HTTP"
    description: "Definition of idempotency and expected behavior of HTTP methods."
    url: "https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2"
exercises:
  - "Accept an idempotency key when creating a simulated payment; store the key, request fingerprint and result in PostgreSQL"
  - "Return the same result for a repeated request and reject reuse of the same key with different content"
  - "Redeliver a Kafka event and a RabbitMQ task; use persisted identifiers and unique constraints to prevent duplicate effects"
---

Examine idempotency in both the HTTP contract and asynchronous processing. Deduplication must survive restarts and concurrency; also discuss the outbox pattern to reduce the risk of losing an event between a transaction and publication.
