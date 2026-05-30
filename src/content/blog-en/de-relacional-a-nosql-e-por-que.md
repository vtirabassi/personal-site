---
title: "From Relational to NoSQL and Why?"
date: 2023-10-13
description: "At some point in your professional journey as a programmer, analyst or software engineer, you must have encountered the following question"
tags: []
---

![](https://cdn-images-1.medium.com/max/1024/1*CcTjcvXTFfIcSkY2AEmP2g.png)

At some point in your professional journey as a programmer, analyst or software engineer, you must have encountered the following question:

> What are the ideal scenarios for using relational databases and NoSQL (non-relational) databases?

Well, the answer I used for many years was something like: "_I opt for a relational database when I have well-structured data (well-defined schemas) and when I don't, I opt for NoSQL_".

Well, the answer is not entirely disposable, but it can and should be better elaborated and understood. I hope to enrich this discussion in some way with this article.

#### Why the term NoSQL?

For the curious, the term NoSQL originates from a name given to a meeting held in the United States between developers who intended to foster and better understand the topic of the moment that occurred in mid-2009, which was about these new databases that were emerging.

Although NoSQL databases do not use the SQL language, the name does not have a direct connection to this characteristic, even though there are NoSQL databases that have a similar query language.

Another interesting point is that the term NoSQL does not have a generic definition. What we can do is analyze the common characteristics among the databases that fall under this term (umbrella), so to speak.

#### **But why fix something that's working?**

With the web in the 21st century, the world is connected all the time, consequently large volumes of information and data are generated constantly. Faced with this scenario, there is a crucial need to store this data effectively.

But why not store this data in already existing databases, such as relational databases?

What stands out most in NoSQL is its ability to execute a database in a large cluster. As data volumes increase, the work of expanding relational databases becomes more difficult and expensive, since there is a need to purchase a new server larger than the relational database (vertical scaling).

An option that becomes interesting is horizontal scaling, a distributed form of data. This becomes possible with databases running in a cluster that has a pool (a quantity) of nodes. It is worth noting that this decision introduces a drawback for teams: complexity.

In summary, there are two ways for data distribution in a cluster: **replication** and **sharding**. We won't go into details, but in general terms, replication copies the same data across multiple nodes, while sharding places different data on different nodes. You don't necessarily have to choose between the two; you can use both.

Another interesting fact for more reasons to consider using NoSQL is the need for delivery teams to be constantly challenged in terms of efficiency (in planning, development) of projects, so that the great goal of "time to market" for companies is achieved. We know that planning and performing data mapping (schemas) is a costly process and NoSQL databases can be an option in this challenge.

Some main characteristics we can highlight from NoSQL databases are:

*   Good execution in clusters;
*   No schemas;
*   Do not use the relational model;
*   Are open-source.

We should also highlight the term polyglot persistence, which is nothing more than having now diverse options for data storage. With this, we need to understand the data we are working with and the problem in question and try to make the best choice given the database options we now have available.

Let's understand a little better the categories of existing NoSQL databases.

#### Key-value databases

These are databases that store their data in a simple hash table. What is that? They are tables where you store data in the form of key-value pairs. Here we have the concept of key-value store, which is nothing more than the simplest NoSQL data stores to use, enabling insert, update, delete and search functions based on a provided key.

![](https://cdn-images-1.medium.com/max/698/1*EiLo6pTU2L1dvDsWcaI_ow.png)

They are indicated for fast storage and retrieval of data with simple read and write operations. Ideal for temporary data storage, making it highly recommended for sessions, cache, user shopping carts, for example.

They are not very indicated when there is a need for more complex queries and more structured data modeling that have great relationships between them.

Example databases: Redis, MemCachedDB, DynamoDB.

#### Columnar databases

They allow data storage with keys mapped to values, where values are grouped into multiple column families.

Column families are groups of related data that in most cases are accessed together.

Each column family can be compared to a container, a set of rows in a SQL table, where the key identifies the row, which consists of multiple columns. The difference is that the row does not need to have the same columns, where a new column can be easily added to any row without needing to be added to all of them.

![](https://cdn-images-1.medium.com/max/760/1*YV-g_aSHP-T-Aw21zEvICA.png)

Due to its high efficiency in data compression and optimization for queries, they are usually indicated and used in event logs, such as logs, due to the large volume of data that is generated and stored and many times there is a need for complex analytical queries.

On the other hand, when fast access to a single piece of data is necessary or there is a highly related data structure, columnar databases are not very indicated because they are not optimized for these operations.

Example databases: Cassandra, HBase, Google BigQuery, Azure SQL Data Warehouse.

#### Graph databases

These are databases that store entities, also enabling relationships between them.

Entities are known as nodes which in turn have one or more properties.

Relationships are known as edges which can also have properties. Edges have directional significance. What does this mean? That they have a unidirectional relation, a defined direction from a source node to a destination node.

![](https://cdn-images-1.medium.com/max/580/1*i9A0JVcx56mYOU0XiMjwnA.jpeg)

With these characteristics and easy relationships between nodes through edges, this type of database is widely used and recommended when data has complex and interconnected relationships. We can make a connection with social networks or recommendation systems where all data is interconnected.

This category is not very recommended when there is no need to explore these relationships, and when there is a need for simple queries, mainly with a single piece of data.

Example databases: Neo4J, Amazon Neptune.

#### Document databases

These are databases that store and retrieve documents that are similar to each other, but not necessarily identical. In most cases, documents are XML and JSON.

Think of key-value storage; documents are stored in the value part and that value can be examined (queries).

![](https://cdn-images-1.medium.com/max/798/1*3JIvwG38SlkYVksM0bGL1w.png)

One characteristic is in the document value; there are no empty, null attributes. Also, documents allow new attributes to be added without needing to map the new attribute to already existing documents.

This category of database is strongly indicated when there is a need for flexible schemas, since you can add new documents with different attributes without having to change the existing ones.

On the other hand, when data is strongly typed, highly related, fast access is a requirement, complex queries will be frequent, and strict consistency that guarantees that all data replicas will be updated, this category is not the most indicated.

Example databases: MongoDB, CouchDB, Firebase Firestore.

We have many subjects to explore when talking about NoSQL databases, such as distribution models, consistency (CAP Theorem), version markers, but my main intention was to give a general overview of the existing categories of non-relational databases and enrich the answer that could be given to the first question of this article.

Keep in mind that none of today's existing technologies is considered a silver bullet. This rule applies to NoSQL databases as well. With this, it is essential for the engineering team to test and validate their expectations about productivity and team performance before deciding to use one of these databases.


---
*Originally published on [Medium](https://medium.com/@viniciustirabassi/de-relacional-a-nosql-e-por-qu%C3%AA-5b521c348216?source=rss-93f65ddb28b5------2).*