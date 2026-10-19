---
title: "Week 2 — REST APIs and HTTP semantics"
order: 2
duration: "~8h"
domain: "Fundamentals"
officialResources:
  - title: "Create web APIs with ASP.NET Core"
    description: "Routes, HTTP methods, validation, results and error responses."
    url: "https://learn.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-10.0"
  - title: "HTTP Semantics — RFC 9110"
    description: "Reference for methods, idempotency, resources and status codes."
    url: "https://www.rfc-editor.org/rfc/rfc9110.html"
exercises:
  - "Expose POST /orders, GET /orders/{id}, GET /orders and POST /orders/{id}/payments using temporary in-memory storage"
  - "Define 201, 200, 400, 404 and 409 responses for creation, retrieval, invalid input, missing resources and conflicts; use Problem Details for errors"
  - "Review paths to use resources and nouns; document why each method and status code was chosen"
---

Turn week one's model into an ASP.NET Core API. Focus on the HTTP contract before adding persistence: predictable paths, validation and responses that accurately describe the result.
