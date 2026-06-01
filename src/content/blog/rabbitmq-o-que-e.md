---
title: "RabbitMQ, O que é?"
date: 2021-09-22
description: "Antes de falarmos sobre o RabbitMQ, precisamos entender o que é um sistema de mensageria e seu objetivo. Um broker de mensagens capaz de processar até 20 mil mensagens por segundo."
tags: ["mensageria", "backend", "rabbitmq"]
---

Antes de falarmos sobre o RabbitMQ, precisamos entender o que é um sistema de mensageria e seu objetivo.

> Um sistema de mensageria tem a responsabilidade de prover uma comunicação entre sistemas, transferindo data de uma aplicação para outra por forma de mensagens (eventos). Essas mensagens são gerenciadas por um Message Broker (servidor de mensagens).

Com base nessa definição, pode perceber que é um sistema fortemente usado na arquitetura de microsserviços, principalmente quando é necessário uma comunicação assíncrona, onde não precisamos ter uma resposta imediata.

Atualmente temos diversos sistemas de mensageria no mercado, mas os principais e mais consolidados são o RabbitMQ e Apacha Kafka. Quando estamos trabalhando com mensageria temos alguns designs patterns bem interessantes para facilitar nosso cotidiano, um deles é o Request-Reply, onde temos um **requestor** que realiza uma request (um evento) que é consumido por um **repiler** que produz um reply (outro evento) que por sua vez o requestor que originou o fluxo recebe o reply e fecha o ciclo, para exemplificar, abaixo podemos ver uma ilustração:

![](https://cdn-images-1.medium.com/max/491/1*8vTbR7GmAph4I5IWlLFh_Q.png)

### RabbitMQ

É um Message Broker, podemos entender como um meio de campo, ou seja, ele vai fazer o meio de campo entre quem publica (origem) e quem recebe (destino) a mensagem, em outras palavras é um sistema de mensageria.

Capaz de processar até 20mil mensagens por segundo, podendo utilizar os protocolos de comunicação HTTP, AMQP, STOMP e MQTT. Ele tem um grande desacoplamento entre serviços, trazendo isso, como grande objetivo ao usá-lo. O RabbitMQ acabou se tornando um padrão de Mercado, sendo usado por diversas empresas e já estando bem consolidado.

Por baixo dos panos, temos uma comunicação Client to Server.

![](https://cdn-images-1.medium.com/max/262/1*XVoQbPJB65w5ocBRqxGxIQ.png)

A base dos protocolos usados é o TCP, ou seja a primeira conexão é um pouco lenta. Para melhorar esse processo, o RabbitMQ abre apenas uma única conexão persistente, com isso dentro dessa conexão criamos subconexões chamadas de Channel, é bom saber também que toda vez que abrirmos um novo channel estamos abrindo uma nova thread.

### Exchange

No RabbitMQ possuímos esse conceito, um pouco diferente de outros sistemas de mensageria, mas o que é isso?

A Exchange tem a responsabilidade de rotear as mensagens para suas respectivas filas (queues), com isso podemos perceber que os publishers (produtores) não publicam as mensagens diretamente nas filas, elas são publicadas na Exchange que por sua vez, possui responsabilidade de direcioná-las.

As queues notificam os consumidores assim que possuem mensagens, contudo, os consumidores são competitivos, ou seja, quando uma mensagem chega em uma fila, apenas um consumidor irá processar e assim que o mesmo receber a mensagem e acusar que a recebeu, essa mensagem é removida da fila.

![](https://cdn-images-1.medium.com/max/339/1*T_AmFAWhJnf6PatxR32ETA.png)

Fluxo do RabbitMQ

Quando trabalhamos com mensageria temos os mais diversos cenários de caso de uso, como vimos, as exchanges possuem responsabilidades de rotear as mensagens e para atender alguns cenários, temos a disposição alguns tipos de Exchange:

*   Direct: Quando enviado uma mensagem para a exchange, ela irá enviar a mesma especificamente para uma fila.
*   Fanout: Quando enviado uma mensagem para a exchange, ela irá enviar a mesma para todas as filas que estão relacionadas nessa exchange, ou seja, se eu tenho 5 filas ligadas a exchange de fanout, as mensagem irão ser direcionadas para todas as 5 filas.
*   Topic: Podemos especificar algumas regras para que, dependendo da mensagem que recebemos, ela irá ser encaminhada para uma determinada fila.
*   Headers: Especificamos no header da mensagem informações para determinar para a exchange quais filas essa mensagem deverá ser encaminhada
*   Dead Letter: Se não houver filas para determinadas mensagens, essa exchange fornece a funcionalidade de captar essas mensagens que não foram entregues.

![](https://cdn-images-1.medium.com/max/551/1*-H678dZICyzC4YXeSud8Rg.png)

Direct Exchange

### Bind

É o processo que é realizado quando relacionamos uma queue a uma Exchange.

Nesse momento quando criamos um bind, explicitamos que teremos um _routing key: x_, que é o elemento que relaciona a fila com a exchange; Mas para que serve? Quando criamos uma mensagem podemos especificar o rounting key que queremos, assim a mensagem será direcionada para fila daquele bind especifico.

### **Queues**

Vimos que falamos muito sobre queues, acredito que você já deve ter entendido o que são elas, mas temos alguns pontos que precisamos falar.

As queues trabalham no padrão FIFO, first in, first out, nada mais é que a primeira mensagem que entra, é a primeira que sai. Elas possuem propriedades que podemos configurar, aqui vão algumas delas:

*   **Durable:** Possibilidade de persistir no disco ou na memória as mensagens, ou seja, se ela for durable, quando houver o restart do broker ela continuará existindo, por padrão essa propriedade vem como true;
*   **Auto-delete:** Quando um consumer desconectar da fila, a fila será destruída;
*   **Expiry:** Define o tempo que a fila ficará ociosa, ou seja, 2 horas sem ter recebido uma mensagem ou não ter nenhum consumo, ela será removida;
*   **Message TTL:** Time To Live da mensagem (tempo de vida), ou seja, se ninguém consumir a mensagem durante esse tempo, ela irá ser removida;
*   **Max length ou bytes:** Quantidade de mensagens totais de uma queue ou tamanho em bytes das mensagens que serão aceitas por determinada queue
*   **Overflow:** podemos colocar alguns padrões para que quando acontecer o transbordo de uma fila, um limite de mensagem acontecerá a ação configurada (drop head e reject publish):

**Drop head:** Remove a mais mensagem mais antiga;

**Reject publish:** recusa a publicação de novas mensagem, o Publisher receberá um erro.

#### Dead Letter Queues (DLQ)

Quando as mensagens não são entregues por algum motivo, podemos configurar as mesmas para serem encaminhadas para uma Dead Letter Exchange que por sua vez serão direcionadas para uma dead letter queue.

Dependendo do projeto e de como foi estruturado, podemos desenvolver uma aplicação cujo o consumer irá tratar essas mensagens que ninguém viu para serem analisadas posteriormente.

#### Lazy Queues

As mensagens são armazenadas em disco o mais cedo possível e só são carregadas na RAM quando solicitadas pelos consumers

O RabbitMQ disponibiliza uma interface de usuário automaticamente, com isso temos a possibilidade de vermos as mensagens que estão paradas, que já foram consumidas, os consumers, binds, entre outras informações que ajudarão no dia a dia.

Espero poder ter ajudado e ter sanado algumas curiosidades ou curiosidades. Deixe uma sugestão nos comentários e de o seu like. To igual youtuber já! :)

---
*Publicado originalmente no [Medium](https://medium.com/@viniciustirabassi/rabbitmq-o-que-%C3%A9-3fff92a4ba18?source=rss-93f65ddb28b5------2).*
