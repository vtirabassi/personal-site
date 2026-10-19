---
title: "Semana 12 — Observabilidade: logs, métricas e traces"
order: 12
duration: "~8h"
domain: "Operação"
officialResources:
  - title: "Observabilidade com OpenTelemetry no .NET"
    description: "Instrumentação e os três sinais principais no ecossistema .NET."
    url: "https://learn.microsoft.com/pt-br/dotnet/core/diagnostics/observability-with-otel"
  - title: "OpenTelemetry para .NET"
    description: "Instrumentação de traces, métricas e logs em aplicações .NET."
    url: "https://opentelemetry.io/docs/languages/dotnet/"
exercises:
  - "Adicionar logs estruturados com identificadores de pedido e correlação, evitando dados sensíveis de pagamento"
  - "Medir taxa, latência e falhas da API e do processamento em background; criar traces que liguem a requisição ao consumidor e ao worker"
  - "Simular uma falha de pagamento e investigá-la com logs, métricas e traces; registrar causa, impacto e correção"
---

Conclua o projeto mostrando a jornada de um pedido desde a chamada HTTP até as tarefas assíncronas. Use os três sinais para distinguir lentidão, duplicação e falha de processamento no ambiente local.
