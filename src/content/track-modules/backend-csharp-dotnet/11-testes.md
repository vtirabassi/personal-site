---
title: "Semana 11 — Pirâmide de testes e carga"
order: 11
duration: "~8h"
domain: "Qualidade"
officialResources:
  - title: "Testes de integração no ASP.NET Core"
    description: "Testes da aplicação HTTP com WebApplicationFactory e dependências de teste."
    url: "https://learn.microsoft.com/pt-br/aspnet/core/test/integration-tests?view=aspnetcore-10.0"
  - title: "Primeiro teste de carga com k6"
    description: "Criação de cenários, métricas e limiares de desempenho."
    url: "https://grafana.com/docs/k6/latest/get-started/write-your-first-test/"
exercises:
  - "Escrever testes unitários para regras de pedido, pagamento e idempotência, incluindo a nova regra com a flag ligada e desligada"
  - "Testar a API integrada ao PostgreSQL e executar um cenário ponta a ponta de criação do pedido ao resultado do pagamento simulado"
  - "Criar um teste de carga com k6 para consultas e criação de pedidos; definir limiares e comparar resultados com e sem cache"
---

Organize a suíte por custo e finalidade: muitos testes rápidos de comportamento, testes integrados para fronteiras reais e poucos cenários ponta a ponta. Registre a linha de base de latência e falhas antes de interpretar o teste de carga.
