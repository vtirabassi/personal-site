---
title: "SaaS, you've most likely already heard about it…"
date: 2022-02-15
description: "SaaS (software-as-a-service), you've most likely already heard about this term, whether developing it yourself or consuming some SaaS product."
tags: ["saas", "product", "business"]
---

![](https://cdn-images-1.medium.com/max/845/1*Pu3vnbFzM2sRCkOEK6Gyfw.png)

SaaS (software-as-a-service), you've most likely already heard about this term, whether developing it yourself or consuming some SaaS product. One of the most famous examples we have is Netflix, a video streaming platform that sells its software as a service to end users (us).

SaaS allows users to connect to and use cloud-based applications over the Internet, without the need to purchase a license or install it locally.

The Twelve-Factor is a methodology designed and built by Heroku developers (cloud platform and services), with the goal of evangelizing and sharing best practices for developing software-as-a-service applications.

A way to understand the 12 factors is to initially think of 3 larger blocks, they are: **Code Factor**, **Deploy Factor**, **Operate Factor**.

### Code Factor

#### 1\. Codebase

It may seem obvious, but it doesn't hurt to remember, right?  
All code should be in a version control system, such as GitHub, Bitbucket. This makes it possible to track any changes to the code and to have control of all deployments already performed.

There should be only one repository (code base) for each project. Having a 1:1 relationship.

#### 5\. Build, Release, Run

_Build_: Transform a version of your repository and make it an executable version.

_Release_: Combination of the build with its respective environment configurations, leaving it ready for run.

_Run_: Execution of all processes necessary for possible use by the end user in the desired environment.

#### 10\. Dev/Prod parity

Every developer's dream.  
Whenever possible, keep your development, staging, and production environments (DEV/HOM/PROD) as similar as possible, whether front-end applications, back-end, even the data.

### Deploy Factor

#### 2\. Dependencies

Make sure your code explicitly declares all necessary dependencies, ensuring that no application depends on packages specific to operating systems, where they need to be installed on the machine. An example would be the _package.json_ file.

One of the benefits to highlight is also the easy configuration of the environment for a new developer joining the team, ensuring that there will be no differences between environments.

#### 3\. Config

Application configurations should be stored separately from the source code, that is, have one repository for the application's source code and another for the configurations.

But what is part of a config?  
We can consider all information that varies between environments, where each environment needs to have information that differs from the other.

Have separate configurations by environment, an example would be the files _appsettings-release.json_ and _appsettings-development.json_, used in production environment and the other in development environment respectively.

#### 4\. Backing services

Backing services is any service that the application consumes over the network. Your application should not distinguish between the origin of the service, whether it's local or third-party. They should be connected via a URL or other locator, where the information will be stored in the config.

#### 6\. Process

Think of your application as **_stateless,_** that is, there is no sharing of any information. Any data that needs to be persisted must be stored in a _stateful_ _service_, such as a database.

#### 7\. Port binding

Your application must be independent, it cannot be dependent on an external server, such as: (java + tomcat). Always expose your application on a specific HTTP port, this makes your application able to serve as support for others, that is, we can think that we should not use services that are not exposed on a port.

#### 9\. Disposability

Processes should be started quickly and stopped smoothly at any time without side effects, this will facilitate rapid horizontal scalability, rapid deployment, or a change to some configuration information.

#### 11\. Logs

A super important point is logs, they enable the power to gain visibility into the application's behavior, possible preventive identification of a potential error, or certain points for improvement.

Applications should not have knowledge of where logs are stored, they should always write logs to STDOUT and consequently some external service, such as Kibana, Datadog, Splunk should consume the logs and organize them.

### Operate Factor

#### 8\. Concurrency

Concurrent processes can be used for application scalability, when thinking about building a SaaS, we must always keep in mind the large volume of data we can receive and think about the project in the form of various processes that can be performed in parallel.

#### 12\. Admin processes

More robust applications sometimes have the need to execute some routines to maintain the system or simply update them.

These routines should be included in your application's codebase and should never open an SSL to the application's specific container and execute. The process should not compete with user requests.

It's worth noting that simply applying the 12 factors does not mean you'll automatically have a scalable application, but not applying them will make it much harder. 🙌

---
*Originally published on [Medium](https://medium.com/@viniciustirabassi/saas-muito-provavelmente-voc%C3%AA-j%C3%A1-deve-ter-ouvido-falar-sobre-d8e5fe1d878a?source=rss-93f65ddb28b5------2).*