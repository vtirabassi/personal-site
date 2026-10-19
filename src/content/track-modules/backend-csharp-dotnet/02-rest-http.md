---
title: "Semana 2 — APIs REST e semântica HTTP"
order: 2
duration: "~8h"
domain: "Fundamentos"
officialResources:
  - title: "Criar APIs Web com ASP.NET Core"
    description: "Rotas, métodos HTTP, validação, resultados e respostas de erro."
    url: "https://learn.microsoft.com/pt-br/aspnet/core/web-api/?view=aspnetcore-10.0"
  - title: "Semântica HTTP — RFC 9110"
    description: "Referência para métodos, idempotência, recursos e códigos de status."
    url: "https://www.rfc-editor.org/rfc/rfc9110.html"
exercises:
  - "Expor POST /pedidos, GET /pedidos/{id}, GET /pedidos e POST /pedidos/{id}/pagamentos com armazenamento temporário em memória"
  - "Definir respostas 201, 200, 400, 404 e 409 para criação, leitura, entrada inválida, ausência e conflito; usar Problem Details nos erros"
  - "Revisar os paths para usar recursos e substantivos; documentar por que cada verbo e código de status foi escolhido"
---

Transforme o modelo da primeira semana em uma API ASP.NET Core. Concentre-se no contrato HTTP antes de adicionar persistência: paths previsíveis, validação e respostas que descrevam corretamente o resultado.
