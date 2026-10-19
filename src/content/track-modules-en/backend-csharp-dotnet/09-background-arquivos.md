---
title: "Week 9 — Background processing and chunked files"
order: 9
duration: "~8h"
domain: "Asynchronous processing"
officialResources:
  - title: "Hosted services in ASP.NET Core"
    description: "Worker lifecycle and implementing jobs with BackgroundService."
    url: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-10.0"
  - title: "File.ReadLinesAsync"
    description: "Asynchronous line reading without loading the entire file into memory."
    url: "https://learn.microsoft.com/en-us/dotnet/api/system.io.file.readlinesasync?view=net-10.0"
exercises:
  - "Mount a CSV directory in Compose, add an import request to the API and process it in a BackgroundService"
  - "Stream a large CSV and write bounded batches, for example 500 records at a time, without loading the entire file into memory"
  - "Persist progress and errors in PostgreSQL; interrupt and resume the import after a failure without duplicating orders"
---

Use the Docker Compose environment from previous weeks to run the API and its dependencies while the import proceeds. Compare memory use with loading the whole file and expose the import status through the API.
