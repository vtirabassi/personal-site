---
title: "Hexagonal Architecture"
date: 2021-08-13
description: "Well, every time I study something new in this world of technology I tell myself that I will document it to share about it and even to remember it"
tags: ["architecture", "backend", "engineering"]
---

Well, every time I study something new in this world of technology I tell myself that I will document it to share about it and even to remember it in the near future haha. There are so many things we study that sometimes we don't have the subject on the tip of our tongue. I hope this time it sticks!

> Hexagonal architecture was presented by Alistair Cockburn in 2005 as an alternative to the layered model. Cockburn is one of the main exponents of the "use case" for documenting processes and behavioral requirements of software.

When we discuss the architecture of software, we have some themes as a starting point.

1\. Software should not be defined by a framework.

What I mean by this is that yes, your software is built WITH a framework and not built BY a framework, in other words, if you always need to inherit a class or define a naming pattern from a framework for your classes, attributes, methods, this is a negative point because you will always be adapting yourself to a framework.

2\. Layered Architecture

This approach is widely used by projects that are already in production, it is a way to organize and structure software. I'm not saying it's a wrong pattern and shouldn't be used, in fact, in this world of software development, we don't have right or wrong, just concepts and tools that help and facilitate our daily work.

Well, with this we can see that the concept of hexagonal architecture aims to be an option to replace the hierarchy pattern we have when developing software thinking in layers (_from top to bottom or from left to right_), as we can see below:

![](https://cdn-images-1.medium.com/max/194/1*PnW73a69KP-b5iL8wZcF-w.png)

In general, this symmetrical form tends to lead the developer to a simplistic view of how to implement the software, making it generally impossible to develop a more complex, robust application.

We normally develop software solutions almost always focused on top of a framework and database, that is, the software is still modeled as a reflection of the database instead of doing software design focused on the business domain.

Hexagonal Architecture (_Ports and Adapters_) is a strategy to decouple and create use cases that abstract external details, with the goal of creating decoupled systems, both from the user interface and from the database.

![](https://cdn-images-1.medium.com/max/361/1*H1SFC_1FllZDYIQe4EnCtQ.png)

The Application Core, represented by a hexagon, is where all the business rules that the application needs to know and execute are contained. Here we have the concept of **UseCases**, nothing more than an abstraction of what you would like to do in your application core, all the logical layers, validations should happen here.

![](https://cdn-images-1.medium.com/max/566/1*51N6dGMWryYFQqe3E0U3FQ.png)

The **Ports** is a way that the application core can communicate with the outside world, allowing data to enter or exit, that is, they are interfaces through which the core will communicate. Here we have the concept of input port, where the application core will expose its functionality to the outside world, example: **IManipuleteOperationUseCase.** We also have the concept of output port, an interface which the core uses to fetch information outside of itself, example: **IOperationRepository.**

![](https://cdn-images-1.medium.com/max/517/1*MGeKyNGf1p1q-V2yFenZeA.png)

The **Adapters** are software components that allow a particular technology to interact with a port, that is, interactions happen via adapters.

We have two types of adapters, when adapters invoke the application core we call them inbound adapters, example **OperationController** of a WebAPI, while when the opposite happens they are called outbound adapters.

But how can we get started? Well, I believe the first step is to have a project to specify the application core (Domain), for example, if we want to develop an API, we have 2 projects, a WebAPI that references the Application project and the conversation between the two happens through an application service and a project for Infrastructure.

![](https://cdn-images-1.medium.com/max/582/1*K2ZnRXLcC2USJcPKxc5lMg.png)

There are several ways to do this, you can try to create your own.

**Positive Points**

*   Technologies easy to swap;
*   Easy creation and removal of adapters;
*   Ease of testing the application.

**Negative Points**

*   There is no guidance on how to organize the code;
*   Initial complexity (understanding, creation).

**When to use?**

Much is said about applying hexagonal architecture only to large systems, due to a degree of development effort and understanding at first, since in small systems it will rarely generate maintenance, development of new features and perhaps the cost and effort may not be worthwhile.

However, this is not set in stone, since all software development demands analysis and technical discussions, and can have n variables, from team knowledge to business needs.

---
*Originally published on [Medium](https://medium.com/@viniciustirabassi/arquitetura-hexagonal-de58e8c495be?source=rss-93f65ddb28b5------2).*