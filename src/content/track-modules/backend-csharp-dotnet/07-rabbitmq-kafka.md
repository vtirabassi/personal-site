---
title: "Semana 7 — Mensageria com RabbitMQ e Kafka"
order: 7
duration: "~8h"
domain: "Sistemas distribuídos"
officialResources:
  - title: "Filas de trabalho com RabbitMQ e .NET"
    description: "Publicação, consumo, confirmação e reentrega de tarefas."
    url: "https://www.rabbitmq.com/tutorials/tutorial-two-dotnet"
  - title: "Introdução ao Apache Kafka"
    description: "Tópicos, produtores, consumidores e retenção de eventos."
    url: "https://kafka.apache.org/quickstart/"
  - title: "Cliente .NET para Apache Kafka"
    description: "Produtor e consumidor em C# com Confluent.Kafka."
    url: "https://docs.confluent.io/kafka-clients/dotnet/current/overview.html"
exercises:
  - "Adicionar RabbitMQ ao Compose e enviar pedidos de autorização simulada de pagamento para uma fila de trabalho"
  - "Adicionar Kafka ao Compose, publicar eventos de pedidos e consumi-los para atualizar o histórico no MongoDB"
  - "Comparar confirmação de mensagens, offsets, retenção e reentrega; identificar o risco de falha entre gravar no PostgreSQL e publicar um evento"
---

Use RabbitMQ para distribuir trabalho e Kafka para registrar eventos consumidos por uma projeção. Os dois mecanismos resolvem necessidades diferentes; nesta etapa, mantenha produtores e consumidores mínimos e observe o que ocorre quando eles falham.
