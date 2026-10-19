---
title: "Semana 5 — NoSQL documental com MongoDB"
order: 5
duration: "~8h"
domain: "Dados"
officialResources:
  - title: "Introdução ao driver C# do MongoDB"
    description: "Conexão, coleções e operações com documentos em uma aplicação .NET."
    url: "https://www.mongodb.com/docs/drivers/csharp/current/get-started/"
  - title: "Modelagem de dados no MongoDB"
    description: "Decisões sobre documentos, relacionamentos e padrões de consulta."
    url: "https://www.mongodb.com/docs/manual/data-modeling/"
exercises:
  - "Adicionar MongoDB ao Compose e criar uma coleção de histórico de pedidos com eventos e estados consultados em conjunto"
  - "Carregar alguns registros de exemplo a partir de pedidos existentes, sem escrever simultaneamente em PostgreSQL e MongoDB na mesma requisição"
  - "Consultar o histórico pelo identificador do pedido, criar um índice apropriado e comparar a modelagem com tabelas e joins"
---

Use MongoDB para uma visão documental do histórico, mantendo PostgreSQL como fonte de verdade. Nesta semana, alimente a coleção por um laboratório separado; a atualização por eventos virá na semana de mensageria.
