---
title: "Semana 8 — Idempotência em APIs e consumidores"
order: 8
duration: "~8h"
domain: "Sistemas distribuídos"
officialResources:
  - title: "Padrão de consumidor idempotente"
    description: "Deduplicação persistente para evitar efeitos repetidos após reentrega de mensagens."
    url: "https://learn.microsoft.com/pt-br/azure/architecture/patterns/idempotent-consumer"
  - title: "Semântica de métodos idempotentes em HTTP"
    description: "Definição de idempotência e comportamento esperado dos métodos HTTP."
    url: "https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2"
exercises:
  - "Aceitar uma chave de idempotência na criação de pagamento simulado; salvar chave, impressão da requisição e resultado no PostgreSQL"
  - "Retornar o mesmo resultado ao repetir a mesma requisição e rejeitar o uso da mesma chave com conteúdo diferente"
  - "Reentregar um evento de Kafka e uma tarefa de RabbitMQ; usar identificadores persistidos e restrições únicas para impedir efeitos duplicados"
---

Examine a idempotência no contrato HTTP e no processamento assíncrono. A deduplicação precisa resistir a reinícios e concorrência; discuta também o padrão outbox para reduzir o risco de perder um evento entre a transação e a publicação.
