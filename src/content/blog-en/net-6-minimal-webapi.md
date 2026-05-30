---
title: ".NET 6 — Minimal WebApi"
date: 2021-11-03
description: "With .NET 6 being released in November/2021, an LTS version. One of the major new features is the ease of creating small endpoints in a simple way."
tags: []
---

### .NET 6 — Minimal WebApi

With .NET 6 being released in November/2021, a version that will be LTS (Long Time Support). One of the major new features is the ease of being able to create small endpoints in a simple, fast and clear way.

One of the gains is the warm-up speed (application startup time), where there are benefits when working with serverless and also functions (azure function, lambdas).

> I also believe this is a way to "hook" and bring developers to .NET, since there are some perceptions of complexity and "oldschool" nature of the language when compared to others like Go, Python, NodeJS. We can see this in the image below which I took from Maria Nagagga's presentation, Senior Program Manager at Microsoft.

![](https://cdn-images-1.medium.com/max/1024/1*i9SdX7potVtj_gziyn_8kA.png)

[Minimal APIs in .NET 6 | DotNet 2021 — YouTube](https://www.youtube.com/watch?v=1daODFp6xvs)

I used Visual Studio Code for this brief tutorial, so Node.js developers can see how simple it is. 😎

**Prerequisites:**

*   Visual Studio Code
*   .NET 6

Run the command in your preferred directory, as usual I like to create a GIT folder for my projects like: `/Users/****/Git`

```bash
dotnet new webapi -minimal -o <ProjectName>
```

After running the code, a folder with the project name was generated, `/Users/****/Git/<ProjectName>`

Examining the created structure, you can see that a leaner structure was generated. There is no longer a `Startup.cs` file

![](https://cdn-images-1.medium.com/max/464/1*NncoBM8ZSArxegVoRijXjw.png)

#### **Everything is done in Program.cs**

The `Program.cs` file has the old and good known _Weatherforecast Controller_, but we don't have a Controller folder structure and classes that implement `ControllerBase`. To see the code in action, just run:

```bash
dotnet run
```

Let's delete all content and develop a CRUD with the TODO (tasks to be done) context.

For data storage, the EntityFramework Core in-memory database was used, to install it, you need to run:

```bash
dotnet add package Microsoft.EntityFrameworkCore.InMemory
```

After installing, we need to configure a context for the EF.

Note that in the _AppDbContext.cs_ file, another novelty that .NET 6 brought was used, **file-scoped namespace declaration**, with this it is no longer necessary to declare your namespace with braces, just put a **;** at the end.

A ViewModel was also created to receive the information input by users, and a small validation of the _Name_ field was performed using the **Flunt** framework.

```bash
dotnet add package Flunt
```

Now we can test our Minimal WebApi. Bringing a third novelty from .NET 6, the **Hot Reload** 🙌, a feature that allows you to change the code while it is being executed, allowing for quick validation.

Let's run our application with the following command:

```bash
dotnet watch run
```

With this, we can open swagger and test our routes.

![](https://cdn-images-1.medium.com/max/692/1*dX17DCX9hxxjarMiew3JmA.png)

In this first image, we can see the validation we developed with Fluent working. An empty string was sent in the name field and the expected validation was returned.

![](https://cdn-images-1.medium.com/max/1024/1*nkeRJ08T6oSw468N0h_VhQ.png)

![](https://cdn-images-1.medium.com/max/1024/1*0YZk3a1kbmGWYFInRkQ8Zg.png)

I think that's it! 🙌

We can see how simple it is to create new endpoints, microservices with the innovations that version 6 of dotnet brings.


---
*Originally published on [Medium](https://medium.com/@viniciustirabassi/net-6-minimal-webapi-19f56ab814e?source=rss-93f65ddb28b5------2).*