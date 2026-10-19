---
title: "Week 4 — Relational SQL with PostgreSQL"
order: 4
duration: "~8h"
domain: "Data"
officialResources:
  - title: "The SQL language in PostgreSQL"
    description: "Tables, queries, joins, aggregation and data updates."
    url: "https://www.postgresql.org/docs/current/tutorial-sql.html"
  - title: "PostgreSQL provider for EF Core"
    description: "Connect C# models and DbContext to PostgreSQL through Npgsql."
    url: "https://www.npgsql.org/efcore/"
  - title: "Migrations in EF Core"
    description: "Controlled evolution of the database schema."
    url: "https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/"
exercises:
  - "Create orders, items and payments tables with keys and constraints; persist API data with EF Core"
  - "Write a SQL query with a join and aggregation to list orders and totals; compare it with the EF Core query"
  - "Create a migration, an index for a frequent query and a transaction that leaves no partial payment after failure"
---

Make PostgreSQL the source of truth for orders and payments. Learn SQL directly and use EF Core to connect the model to the API without hiding the effects of queries and transactions.
