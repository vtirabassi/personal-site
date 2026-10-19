---
title: "Semana 6 — Cache em memória e distribuído"
order: 6
duration: "~8h"
domain: "Dados"
officialResources:
  - title: "Cache em memória no ASP.NET Core"
    description: "Uso de IMemoryCache, expiração, limites e leitura da fonte de dados quando o cache falha."
    url: "https://learn.microsoft.com/pt-br/aspnet/core/performance/caching/memory?view=aspnetcore-10.0"
  - title: "Cache distribuído no ASP.NET Core"
    description: "Uso de IDistributedCache e Redis entre instâncias da aplicação."
    url: "https://learn.microsoft.com/pt-br/aspnet/core/performance/caching/distributed?view=aspnetcore-10.0"
exercises:
  - "Adicionar cache em memória à consulta de um catálogo de produtos usado nos pedidos, com prazo de expiração e limite de tamanho"
  - "Adicionar Redis ao Compose e implementar a mesma leitura com cache distribuído; observar o comportamento após reiniciar a API"
  - "Invalidar a entrada ao alterar um produto e confirmar que a consulta continua funcionando quando Redis estiver indisponível"
---

Compare o alcance e as limitações de cada cache. O catálogo permanece no PostgreSQL; cache é uma cópia temporária, com expiração, invalidação e caminho de leitura sem cache.
