---
title: "Week 6 — In-memory and distributed caching"
order: 6
duration: "~8h"
domain: "Data"
officialResources:
  - title: "In-memory caching in ASP.NET Core"
    description: "IMemoryCache, expiration, limits and reading the source when the cache fails."
    url: "https://learn.microsoft.com/en-us/aspnet/core/performance/caching/memory?view=aspnetcore-10.0"
  - title: "Distributed caching in ASP.NET Core"
    description: "IDistributedCache and Redis across application instances."
    url: "https://learn.microsoft.com/en-us/aspnet/core/performance/caching/distributed?view=aspnetcore-10.0"
exercises:
  - "Add an in-memory cache to the product catalog lookup used by orders, with expiration and a size limit"
  - "Add Redis to Compose and implement the same read with distributed caching; observe what happens after restarting the API"
  - "Invalidate the entry when a product changes and confirm that reads still work when Redis is unavailable"
---

Compare the reach and limits of each cache. The catalog remains in PostgreSQL; the cache is a temporary copy with expiration, invalidation and a read path that works without it.
