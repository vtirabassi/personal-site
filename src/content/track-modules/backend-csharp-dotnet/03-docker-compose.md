---
title: "Semana 3 — Docker e Compose para desenvolvimento local"
order: 3
duration: "~8h"
domain: "Fundamentos"
officialResources:
  - title: "Guia de Docker para .NET"
    description: "Dockerfile para aplicações .NET, build em múltiplos estágios e execução com Compose."
    url: "https://docs.docker.com/guides/dotnet/"
  - title: "Introdução ao Docker Compose"
    description: "Definição e execução de uma aplicação com vários serviços."
    url: "https://docs.docker.com/compose/gettingstarted/"
exercises:
  - "Criar um Dockerfile em múltiplos estágios para compilar e executar a API da semana 2"
  - "Criar um compose.yaml que inicie API e PostgreSQL com variáveis de ambiente, volume de dados e verificação de saúde"
  - "Subir e parar o ambiente com Compose; confirmar que o código da API não depende de endereços fixos do computador"
---

Prepare um ambiente reproduzível para os próximos laboratórios. Comece apenas com a API e o PostgreSQL; MongoDB, Redis e os brokers entram no Compose nas semanas em que forem usados.
