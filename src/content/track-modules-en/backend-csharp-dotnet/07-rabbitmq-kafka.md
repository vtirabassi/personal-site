---
title: "Week 7 — Messaging with RabbitMQ and Kafka"
order: 7
duration: "~8h"
domain: "Distributed systems"
officialResources:
  - title: "Work queues with RabbitMQ and .NET"
    description: "Publishing, consuming, acknowledgements and task redelivery."
    url: "https://www.rabbitmq.com/tutorials/tutorial-two-dotnet"
  - title: "Introduction to Apache Kafka"
    description: "Topics, producers, consumers and event retention."
    url: "https://kafka.apache.org/quickstart/"
  - title: ".NET client for Apache Kafka"
    description: "C# producer and consumer with Confluent.Kafka."
    url: "https://docs.confluent.io/kafka-clients/dotnet/current/overview.html"
exercises:
  - "Add RabbitMQ to Compose and send simulated payment authorization requests to a work queue"
  - "Add Kafka to Compose, publish order events and consume them to update history in MongoDB"
  - "Compare acknowledgements, offsets, retention and redelivery; identify the failure risk between writing to PostgreSQL and publishing an event"
---

Use RabbitMQ to distribute work and Kafka to record events consumed by a projection. They address different needs; keep producers and consumers minimal at this stage and observe what happens when they fail.
