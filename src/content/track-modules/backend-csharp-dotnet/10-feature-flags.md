---
title: "Semana 10 — Feature flags"
order: 10
duration: "~8h"
domain: "Entrega de funcionalidades"
officialResources:
  - title: "Gerenciamento de funcionalidades no .NET"
    description: "Conceitos de flags, filtros e configuração de recursos."
    url: "https://learn.microsoft.com/pt-br/azure/azure-app-configuration/feature-management-overview"
  - title: "Biblioteca Microsoft.FeatureManagement para .NET"
    description: "Registro e avaliação de flags na aplicação .NET."
    url: "https://learn.microsoft.com/en-us/azure/azure-app-configuration/feature-management-dotnet-reference"
exercises:
  - "Criar uma nova regra para o pagamento simulado e protegê-la com uma flag avaliada por Microsoft.FeatureManagement"
  - "Configurar a flag localmente e demonstrar os dois comportamentos no mesmo fluxo de pagamento, sem mudar o contrato HTTP"
  - "Registrar qual regra foi aplicada e escrever um teste para cada estado da flag"
---

Use a flag para liberar a regra de forma controlada e praticar sua reversão. Documente o valor padrão e um critério para remover a flag depois que a regra estiver estável.
