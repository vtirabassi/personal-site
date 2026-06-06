---
title: "Arquitetura Hexagonal"
date: 2021-08-13
description: "Bom, toda vez que estudo algo novo nesse mundo de tecnologia eu falo para mim mesmo que vou documentar para compartilhar sobre e até mesmo para eu lembrar"
tags: ["arquitetura", "backend", "engenharia"]
---

Bom, toda vez que estudo algo novo nesse mundo de tecnologia eu falo para mim mesmo que vou documentar para compartilhar sobre e até mesmo para eu lembrar e um futuro próximo rs. São tantas coisas que estudamos que as vezes não temos o assunto na ponta da língua. Espero que dessa vez vai!

> A arquitetura hexagonal foi apresentado por Alistair Cockburn em 2005 como uma alternativa ao modelo em camadas. Cockburn é um dos principais expositores do “caso de uso” para documentar processos e requisitos comportamentais de um software.

Quando discutimos sobre arquitetura de um software, temos alguns temas como forma de ponto de partida.

1\. O Software não deve ser definido por um framework.

O que quero dizer com isso é que, sim o seu software é construído COM um framework e não construído POR um framework, ou seja, se você precisar sempre herdar uma classe ou definir um padrão de nomenclatura de um framework para suas classes, atributos, métodos , isso é um ponto negativo pois você sempre estará se adequando a um framework.

2\. Arquitetura em camadas

Essa abordagem é muito usada por projetos que já estão em produção, é uma forma de organizar, estruturar o software. Não estou dizendo que é um padrão errado e não deve ser usado, aliás, nesse mundo de desenvolvimento de software, não temos certo ou errado, apenas conceitos e ferramentas que ajudam e facilitam o nosso cotidiano.

Bom, com isso podemos ver que o conceito de arquitetura hexagonal visa ser uma opção para substituir o padrão de hierarquia que temos quando desenvolvemos o software pensando em camadas (_de cima para baixo ou da esquerda para direita)_, como podemos ver abaixo:

![](https://cdn-images-1.medium.com/max/194/1*PnW73a69KP-b5iL8wZcF-w.png)

De uma forma geral, essa forma simétrica tende levar o desenvolvedor a uma visão simplista de como implementar o software, impossibilitando de uma forma geral desenvolver uma aplicação mais complexa, robusta.

Normalmente desenvolvemos soluções de softwares quase sempre focadas no topo de um framework e banco de dados, ou seja, o software ainda é modelado como um reflexo do banco de dados ao invés de realizarmos o design de software voltado ao domínio de negócio.

Hexagonal Architecture (_Ports and Adapters_) é uma estratégia para desacoplar e criar casos de uso que abstraem os detalhes externos, com objetivo de criar sistemas desacoplados, tanto com a interface do usuário quanto do banco de dados.

![](https://cdn-images-1.medium.com/max/361/1*H1SFC_1FllZDYIQe4EnCtQ.png)

O Application Core, representado por um hexágono é onde contêm todas as regras de negócio que a aplicação precisa conhecer e executar. Aqui temos o conceito de **UseCases**, nada mais é que uma abstração do que você gostaria de fazer no seu core da aplicação, todas a camadas lógicas, validações devem acontecer aqui.

![](https://cdn-images-1.medium.com/max/566/1*51N6dGMWryYFQqe3E0U3FQ.png)

As **Ports** é uma forma que o application core consiga se comunicar com o mundo à fora, permitindo a entrada ou saída de dados, ou seja, são interfaces as quais o core irá se comunicar. Aqui temos o conceito de input port, onde o application core irá expor para o mundo à fora sua funcionalidade, exemplo: **IManipuleteOperationUseCase.** Temos também o conceito de output port, uma interface a qual o core usa para buscar informações fora de si, exemplo: **IOperationRepository.**

![](https://cdn-images-1.medium.com/max/517/1*MGeKyNGf1p1q-V2yFenZeA.png)

Os **Adapters** são componentes de softwares que permitem uma tecnologia em particular interagir com uma porta, ou seja, as interações acontecem via adaptadores.

Temos dois tipos de adapters, quando os adapters invocam o application core chamamos de inbound adapters, exemplo **OperationController** de uma WebAPI, já quando acontece ao contrário eles são chamados de outbounds adapters.

Mas como podemos começar? Bom, acredito que o primeiro passo é ter um projeto para especificar a application core (Domain), exemplo, caso queremos desenvolver uma API, temos 2 projetos, um WebAPI que referência o projeto Application e a conversa entre os dois acontece pelo um serviço de aplicação e um projeto para Infrastructure.

![](https://cdn-images-1.medium.com/max/582/1*K2ZnRXLcC2USJcPKxc5lMg.png)

Há diversas maneiras para fazer isso, você pode tentar criar a sua.

**Pontos positivos**

*   Tecnologias fáceis de trocar;
*   Fácil criação e remoção de adapters;
*   Facilidade de testar a aplicação.

**Pontos negativos**

*   Não há uma orientação sobre como organizar o código;
*   Complexidade inicial (entendimento, criação).

**Quando utilizar?**

Muito se fala em aplicar a arquitetura hexagonal em apenas sistemas grandes, devido um grau de esforço de desenvolvimento e entendimento no primeiro momento, visto que em sistemas pequenos dificilmente gerará manutenções, desenvolvimento de novas features e talvez não seja interessante o custo, esforço.

Porém, isso não está escrito em pedra, uma vez que todo desenvolvimento de software demanda uma análise e discussões técnicas, podendo ter n variáveis, desde conhecimento do time quanto necessidade do negócio.

---
*Publicado originalmente no [Medium](https://medium.com/@viniciustirabassi/arquitetura-hexagonal-de58e8c495be?source=rss-93f65ddb28b5------2).*
