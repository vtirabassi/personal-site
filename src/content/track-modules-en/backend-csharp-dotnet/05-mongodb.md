---
title: "Week 5 — Document NoSQL with MongoDB"
order: 5
duration: "~8h"
domain: "Data"
officialResources:
  - title: "Get started with the MongoDB C# driver"
    description: "Connections, collections and document operations in a .NET application."
    url: "https://www.mongodb.com/docs/drivers/csharp/current/get-started/"
  - title: "Data modeling in MongoDB"
    description: "Decisions about documents, relationships and query patterns."
    url: "https://www.mongodb.com/docs/manual/data-modeling/"
exercises:
  - "Add MongoDB to Compose and create an order-history collection with events and states that are read together"
  - "Load sample records from existing orders without writing to PostgreSQL and MongoDB in the same request"
  - "Query history by order ID, create a suitable index and compare the model with tables and joins"
---

Use MongoDB for a document view of history while PostgreSQL remains the source of truth. This week, populate the collection in a separate lab; event-driven updates come in the messaging week.
