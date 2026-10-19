---
title: "Week 3 — Docker and Compose for local development"
order: 3
duration: "~8h"
domain: "Fundamentals"
officialResources:
  - title: "Docker guide for .NET"
    description: "Dockerfile for .NET applications, multi-stage builds and running with Compose."
    url: "https://docs.docker.com/guides/dotnet/"
  - title: "Docker Compose getting started"
    description: "Define and run an application made up of several services."
    url: "https://docs.docker.com/compose/gettingstarted/"
exercises:
  - "Create a multi-stage Dockerfile to build and run the API from week 2"
  - "Create a compose.yaml that starts the API and PostgreSQL with environment variables, a data volume and a health check"
  - "Start and stop the environment with Compose; confirm the API code does not depend on machine-specific addresses"
---

Prepare a reproducible environment for later labs. Start with only the API and PostgreSQL; add MongoDB, Redis and brokers to Compose in the weeks when they are needed.
