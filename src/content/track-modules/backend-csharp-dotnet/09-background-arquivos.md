---
title: "Semana 9 — Processamento em background e arquivos em chunks"
order: 9
duration: "~8h"
domain: "Processamento assíncrono"
officialResources:
  - title: "Serviços hospedados no ASP.NET Core"
    description: "Ciclo de vida de workers e implementação de tarefas com BackgroundService."
    url: "https://learn.microsoft.com/pt-br/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-10.0"
  - title: "File.ReadLinesAsync"
    description: "Leitura assíncrona de linhas sem carregar o arquivo inteiro na memória."
    url: "https://learn.microsoft.com/pt-br/dotnet/api/system.io.file.readlinesasync?view=net-10.0"
exercises:
  - "Montar um diretório de CSV no Compose, adicionar à API uma solicitação de importação e processá-la em um BackgroundService"
  - "Ler um CSV grande por streaming e gravar lotes limitados, por exemplo de 500 registros, sem carregar o arquivo inteiro na memória"
  - "Persistir progresso e erros no PostgreSQL; interromper e retomar a importação após uma falha sem duplicar pedidos"
---

Use o ambiente Docker Compose das semanas anteriores para executar a API e suas dependências enquanto a importação ocorre. Compare o uso de memória com uma leitura integral do arquivo e exponha o estado da importação para consulta pela API.
