---
title: ".NET 6 Minimal WebApi"
date: 2021-11-03
description: "Com a versão do .NET 6 sendo lançada em novembro/2021, versão LTS. Uma das grandes novidades é a facilidade de criar pequenos endpoints de forma simples."
tags: [".net", "backend", "api"]
---

### .NET 6 Minimal WebApi

Com a versão do .NET 6 sendo lançada em novembro/2021, versão a qual será LTS (Long Time Support). Uma das grandes novidades é a facilidade de poder criar pequenos endpoints de forma simples, rápida e clara.

Um dos ganhos é a velocidade de warm-up (tempo de aquecimento) da aplicação, onde há benefícios quando trabalhado com serverless e também functions (azure function, lambdas).

> Acredito que seja também uma forma de "fisgar", trazer desenvolvedores para para o .NET, uma vez que existe algumas percepções de complexidade, "oldschool" da linguagem quando comparado a outras como Go, Python, NodeJS. Podemos vir isso na imagem abaixo onde tirei da apresentação da Maria Nagagga, Senior Program Manager da Microsoft.

![](https://cdn-images-1.medium.com/max/1024/1*i9SdX7potVtj_gziyn_8kA.png)

[Minimal APIs in .NET 6 | DotNet 2021 YouTube](https://www.youtube.com/watch?v=1daODFp6xvs)

Utilizei o visual studio code para esse breve tutorial, assim programadores de node.js podem ver como é tão simples quanto. 😎

**Pré-requisitos:**

*   Visual Studio Code
*   .NET 6

Rode o comando no diretório de sua preferência, como de costume gosto de criar uma pasta GIT para meus projetos como: `/Users/****/Git`

```bash
dotnet new webapi -minimal -o <NomeProjeto>
```

Após a execução do código foi gerado uma pasta com o nome do projeto, `/Users/****/Git/<NomeProjeto>`

Examinando a estrutura criada, é possível ver que foi gerado uma estrutura mais enxuta. Não existe mas o arquivo `Startup.cs`

![](https://cdn-images-1.medium.com/max/464/1*NncoBM8ZSArxegVoRijXjw.png)

#### **Everything is done in Program.cs**

O arquivo `Program.cs` possui o velho e bom conhecido _Weatherforecast Controller_, mas não temos estrutura de pasta Controller e classes que implementam a `ControllerBase`. Para ver o código em ação, basta executar:

```bash
dotnet run
```

Vamos apagar todo conteúdo e realizar o desenvolvimento de um CRUD com o contexto de TODO (tarefas a serem feitas).

Para armazenamento dos dados foi utilizado o banco de dados em memória do EntityFramework Core, para instalar, é preciso executar:

```bash
dotnet add package Microsoft.EntityFrameworkCore.InMemory
```

Instalando precisamos configurar um contexto para o EF.

Note que no arquivo _AppDbContext.cs_ foi usado mais uma novidade que .NET 6 trouxe, **declaração de namespace com escopo de arquivo**, com isso não é mais necessário declarar sua namespace com chaves, basta colocar um **;** no final.

Foi criado também uma ViewModel para recebermos as informações imputadas pelos usuários, com isso, também foi realizada uma pequena validação do campo _Name_ com o uso do framework **Flunt**.

```bash
dotnet add package Flunt
```

Agora podemos testar nossa Minimal WebApi. Trazendo uma terceira novidade do .NET 6, o **Hot Reload** 🙌, recurso que permite alterar o código enquanto o mesmo esta sendo executado, permitindo uma rápida validação.

Vamos rodar nossa aplicação com o seguinte comando:

```bash
dotnet watch run
```

Com isso, podemos abrir o swagger e testar nossas rotas.

![](https://cdn-images-1.medium.com/max/692/1*dX17DCX9hxxjarMiew3JmA.png)

Nessa primeira imagem, podemos ver a validação que desenvolvemos com o Fluent funcionando. Foi enviado uma string vazia no campo name e foi retornado a validação esperada.

![](https://cdn-images-1.medium.com/max/1024/1*nkeRJ08T6oSw468N0h_VhQ.png)

![](https://cdn-images-1.medium.com/max/1024/1*0YZk3a1kbmGWYFInRkQ8Zg.png)

Acredito que seja isso! 🙌

Podemos ver o quão simples é realizar a criação de novos endpoints, microsserviços com as novidades que a versão 6 do dotnet traz.

---
*Publicado originalmente no [Medium](https://medium.com/@viniciustirabassi/net-6-minimal-webapi-19f56ab814e?source=rss-93f65ddb28b5------2).*
