---
title: "Semana 1 — C# e programação orientada a objetos"
order: 1
duration: "~8h"
domain: "Fundamentos"
officialResources:
  - title: "Programação orientada a objetos em C#"
    description: "Abstração, encapsulamento, herança e polimorfismo aplicados à linguagem."
    url: "https://learn.microsoft.com/pt-br/dotnet/csharp/fundamentals/tutorials/oop"
  - title: "Classes, structs e records em C#"
    description: "Tipos, membros, visibilidade e identidade de objetos no modelo de domínio."
    url: "https://learn.microsoft.com/pt-br/dotnet/csharp/fundamentals/object-oriented/"
exercises:
  - "Criar uma solução .NET 10 com classes Pedido, ItemPedido e Pagamento; manter o total do pedido consistente ao adicionar ou remover itens"
  - "Definir interfaces para cálculo de frete e autorização simulada de pagamento; implementar duas estratégias de cada"
  - "Usar encapsulamento para impedir pedidos sem itens e pagamentos com valor negativo; verificar esses comportamentos com testes simples"
---

Comece pelo domínio do projeto, sem banco nem API. Modele regras que façam sentido por si só e use interfaces apenas onde houver comportamentos alternativos; a autorização de pagamento permanece simulada em toda a trilha.
