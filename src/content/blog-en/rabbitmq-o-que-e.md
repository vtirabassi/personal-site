---
title: "RabbitMQ, What is it?"
date: 2021-09-22
description: "Before we talk about RabbitMQ, we need to understand what a messaging system is and its purpose. A message broker capable of processing up to 20 thousand messages per second."
tags: []
---

Before we talk about RabbitMQ, we need to understand what a messaging system is and its purpose.

> A messaging system has the responsibility of providing communication between systems, transferring data from one application to another in the form of messages (events). These messages are managed by a Message Broker (message server).

Based on this definition, you can see that it is a system heavily used in microservices architecture, especially when asynchronous communication is needed, where we don't need an immediate response.

Currently we have several messaging systems on the market, but the main and most consolidated ones are RabbitMQ and Apache Kafka. When working with messaging we have some interesting design patterns to ease our daily lives, one of them is Request-Reply, where we have a **requestor** that makes a request (an event) that is consumed by a **replier** that produces a reply (another event) which in turn the requestor that originated the flow receives the reply and closes the cycle, to exemplify, below we can see an illustration:

![](https://cdn-images-1.medium.com/max/491/1*8vTbR7GmAph4I5IWlLFh_Q.png)

### RabbitMQ

It is a Message Broker, we can understand it as a middleman, that is, it will act as a middleman between who publishes (source) and who receives (destination) the message, in other words it is a messaging system.

Capable of processing up to 20 thousand messages per second, being able to use HTTP, AMQP, STOMP and MQTT communication protocols. It has great decoupling between services, bringing this as a major objective when using it. RabbitMQ has become a market standard, being used by several companies and already being well established.

Under the hood, we have Client to Server communication.

![](https://cdn-images-1.medium.com/max/262/1*XVoQbPJB65w5ocBRqxGxIQ.png)

The basis of the protocols used is TCP, so the first connection is a bit slow. To improve this process, RabbitMQ opens only a single persistent connection, with this inside this connection we create subconnections called Channels, it's also good to know that every time we open a new channel we're opening a new thread.

### Exchange

In RabbitMQ we have this concept, a little different from other messaging systems, but what is it?

The Exchange has the responsibility of routing messages to their respective queues, with this we can see that publishers (producers) do not publish messages directly in the queues, they are published in the Exchange which in turn has the responsibility of directing them.

Queues notify consumers as soon as they have messages, however, consumers are competitive, that is, when a message arrives in a queue, only one consumer will process it and as soon as it receives the message and confirms that it received it, this message is removed from the queue.

![](https://cdn-images-1.medium.com/max/339/1*T_AmFAWhJnf6PatxR32ETA.png)

RabbitMQ Flow

When working with messaging we have the most diverse use case scenarios, as we saw, exchanges have responsibilities for routing messages and to meet some scenarios, we have at our disposal some types of Exchange:

*   Direct: When a message is sent to the exchange, it will send it specifically to a queue.
*   Fanout: When a message is sent to the exchange, it will send it to all queues that are related to this exchange, that is, if I have 5 queues connected to the fanout exchange, messages will be directed to all 5 queues.
*   Topic: We can specify some rules so that, depending on the message we receive, it will be forwarded to a specific queue.
*   Headers: We specify in the message header information to determine to the exchange which queues this message should be forwarded to
*   Dead Letter: If there are no queues for certain messages, this exchange provides the functionality to capture these messages that were not delivered.

![](https://cdn-images-1.medium.com/max/551/1*-H678dZICyzC4YXeSud8Rg.png)

Direct Exchange

### Bind

It is the process that is performed when we relate a queue to an Exchange.

At this moment when we create a bind, we make explicit that we will have a _routing key: x_, which is the element that relates the queue to the exchange; But what's it for? When we create a message we can specify the routing key we want, so the message will be directed to the queue of that specific bind.

### **Queues**

We saw that we talked a lot about queues, I believe you should already understand what they are, but we have some points we need to address.

Queues work in the FIFO pattern, first in, first out, it's nothing more than the first message that comes in is the first one that goes out. They have properties that we can configure, here are some of them:

*   **Durable:** Possibility of persisting messages on disk or in memory, that is, if it is durable, when the broker restarts it will continue to exist, by default this property comes as true;
*   **Auto-delete:** When a consumer disconnects from the queue, the queue will be destroyed;
*   **Expiry:** Defines the time the queue will remain idle, that is, 2 hours without receiving a message or having no consumption, it will be removed;
*   **Message TTL:** Time To Live of the message (lifespan), that is, if no one consumes the message during this time, it will be removed;
*   **Max length or bytes:** Total number of messages in a queue or size in bytes of messages that will be accepted by a particular queue
*   **Overflow:** we can set some standards so that when a queue overflows, a message limit will trigger the configured action (drop head and reject publish):

**Drop head:** Removes the oldest message;

**Reject publish:** refuses the publication of new messages, the Publisher will receive an error.

#### Dead Letter Queues (DLQ)

When messages are not delivered for some reason, we can configure them to be forwarded to a Dead Letter Exchange which in turn will be directed to a dead letter queue.

Depending on the project and how it was structured, we can develop an application whose consumer will treat these messages that no one has seen to be analyzed later.

#### Lazy Queues

Messages are stored on disk as early as possible and are only loaded into RAM when requested by consumers

RabbitMQ provides a user interface automatically, so we have the possibility to see the messages that are stopped, that have already been consumed, the consumers, binds, among other information that will help in daily life.

I hope I could have helped and clarified some curiosities. Leave a suggestion in the comments and give it your like. I'm just like a YouTuber now! :)


---
*Originally published on [Medium](https://medium.com/@viniciustirabassi/rabbitmq-o-que-%C3%A9-3fff92a4ba18?source=rss-93f65ddb28b5------2).*