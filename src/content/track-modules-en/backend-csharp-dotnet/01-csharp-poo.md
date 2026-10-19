---
title: "Week 1 — C# and object-oriented programming"
order: 1
duration: "~8h"
domain: "Fundamentals"
officialResources:
  - title: "Object-oriented programming in C#"
    description: "Abstraction, encapsulation, inheritance and polymorphism in the language."
    url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/oop"
  - title: "Classes, structs and records in C#"
    description: "Types, members, visibility and object identity in the domain model."
    url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/"
exercises:
  - "Create a .NET 10 solution with Order, OrderItem and Payment classes; keep the order total consistent when items are added or removed"
  - "Define interfaces for shipping calculation and simulated payment authorization; implement two strategies for each"
  - "Use encapsulation to reject empty orders and negative payment amounts; verify these behaviors with simple tests"
---

Start with the project's domain, without a database or API. Model rules that stand on their own and use interfaces where behavior can vary; payment authorization stays simulated throughout the track.
