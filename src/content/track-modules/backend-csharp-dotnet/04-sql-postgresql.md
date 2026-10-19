---
title: "Semana 4 — SQL relacional com PostgreSQL"
order: 4
duration: "~8h"
domain: "Dados"
officialResources:
  - title: "A linguagem SQL no PostgreSQL"
    description: "Tabelas, consultas, joins, agregações e atualização de dados."
    url: "https://www.postgresql.org/docs/current/tutorial-sql.html"
  - title: "Provedor PostgreSQL para EF Core"
    description: "Integração de modelos C# e DbContext com PostgreSQL por meio do Npgsql."
    url: "https://www.npgsql.org/efcore/"
  - title: "Migrations no EF Core"
    description: "Evolução controlada do esquema do banco de dados."
    url: "https://learn.microsoft.com/pt-br/ef/core/managing-schemas/migrations/"
exercises:
  - "Criar tabelas de pedidos, itens e pagamentos com chaves e restrições; persistir os dados da API com EF Core"
  - "Escrever uma consulta SQL com join e agregação para listar pedidos e totais; comparar com a consulta em EF Core"
  - "Criar uma migration, um índice para consulta frequente e uma transação que não deixe pagamento parcial após falha"
---

Faça do PostgreSQL a fonte de verdade dos pedidos e pagamentos. Aprenda SQL diretamente e use EF Core para conectar o modelo à API, sem esconder os efeitos das consultas e transações.
