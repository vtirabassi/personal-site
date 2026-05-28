---
title: "SaaS, muito provavelmente você já deve ter ouvido falar sobre…"
date: 2022-02-15
description: ""
tags: []
---

![](https://cdn-images-1.medium.com/max/845/1*Pu3vnbFzM2sRCkOEK6Gyfw.png)

SaaS (software-as-a-service _em inglês)_, muito provavelmente você já deve ter ouvido falar sobre esse termo, seja desenvolvendo o mesmo ou consumindo algum produto SaaS. Um dos exemplos mais famosos que temos, é o Netflix, plataforma de streaming de vídeos que vende seu software como serviço para clientes finais (nós).

O SaaS permite que os usuários possam se conectar e utilizar aplicativos baseados em nuvem pela Internet, sem a necessidade de adquirir uma licença ou instala-ló localmente.

O Twelve-Factor é um método pensado e construído pelos desenvolvedores da Heroku (plataforma e serviços em nuvem), com objetivo de evangelizar e compartilhar as melhores práticas para desenvolvimento de aplicativos software-as-a-service.

Uma maneira de poder compreender os 12 fatores, é pensarmos inicialmente em 3 blocos maiores, são eles: **Code Factor**, **Deploy Factor**, **Operate Factor**.

### Code Factor

#### 1\. Codebase

Pode parecer óbvio, mas não custa nada lembrar né?  
Todo código deve estar em um sistema de controle de versão, como GitHub, Bitbucket. Isso torna possível o rastreamento de qualquer alteração no código e termos também o controle de todos os deploys já realizados.

Deve haver apenas um repositório (base de código) para cada projeto. Tendo uma relação 1:1.

#### 5\. Buid, Release, Run

_Build_: Transformar uma versão do seu repositório e tornar-lá uma versão executável.

_Release_: Combinação do build com suas devidas configurações de ambiente deixando-á preparada para run.

_Run_: Execução de todos os processos necessários para o possível uso do cliente final no ambiente desejado.

#### 10\. Dev/Prod parity

O sonho de todos os desenvolvedores.  
Sempre que possível mantenha os ambientes de desenvolvimento, homologação e produção (DEV/HOM/PROD) o mais similar possível, seja aplicações front-end, back-end, até mesmo os dados.

### Deploy Factor

#### 2\. Dependencies

Tenha certeza que o código realiza a declaração explícita de todas as dependências necessárias, garantindo que nenhuma aplicação dependa de pacote específicos dos sistemas operacionais, onde é preciso estar instalados na máquina, um exemplo seria o arquivo _package.json_

Um dos benefícios a se destacar é também a fácil configuração do ambiente para um novo desenvolvedor que chegará na equipe, garantindo que não haverá diferenças entre ambientes.

#### 3\. Config

As configurações das aplicações devem ser armazenadas separadamente do código fonte, ou seja, ter um repositório para o código fonte da aplicação e outro para as configurações.

Mas o que faz parte de um config?  
Podemos considerar todas as informações que variam entre os ambientes, onde cada ambiente precisa ter uma informação divergente do outro.

Tenha configurações separadas por ambiente, um exemplo seria os arquivos _appsettings-release.json_ e _appsettings-development.json,_ usados em ambiente produtivo e o outro em ambiente de desenvolvimento respectivamente.

#### 4\. Backing services

Backing services é qualquer serviço que a aplicação consome por meio da rede. Sua aplicação não deve distinguir entre a origem do serviço, seja ela local ou de terceiros. Eles devem ser conectados através de um URL ou outro localizador, onde a informação será armazenada no config.

#### 6\. Proccess

Pense na sua aplicação como **_stateless,_** ou seja, não há o compartilhamento de nenhuma informação. Qualquer dado que precisa ser persistido, tem que ser armazenado em um _stateful_ _service_, como um banco de dados.

#### 7\. Port binding

Sua aplicação tem que ser independente, ela não pode ser dependente de um servidor externo, como: (java + tomcat). Exponha sempre sua aplicação em uma porta HTTP específica, isso faz com que sua aplicação possa servir como apoio para outras, ou seja, podemos pensar que não devemos utilizar serviços que não estejam expostos em uma porta.

#### 9\. Disposability

Os processos devem ser iniciados rápidos e parados com tranquilidade a qualquer momento sem dados colaterais, isso irá facilitar uma rápida escalabilidade horizontal, um rápido deploy ou uma alteração de alguma informação no config.

#### 11\. Logs

Um ponto super importante são os logs, eles habilitam o poder de obter visibilidade do comportamento da aplicação, uma possível identificação preventiva de um possível erro, ou determinados pontos de melhorias.

As aplicações não devem ter conhecimento onde os logs são armazenados, ela sempre deve escrever logs pro STDOUT e consequentemente algum serviço externo, como Kibana, Datadog, Splunk devem consumir os logs e organiza-lós.

### Operate Factor

#### 8\. Concurrency

Processos concorrentes podem ser usados para a escalabilidade da aplicação, ao pensar em construir um SaaS, temos que sempre ter em mente o grande volume de dados que podemos receber e pensar no projeto em forma de diversos processos que podem ser realizados paralelamente.

#### 12\. Admin processess

As aplicações mais robustas, as vezes apresentam a necessidade de execução de algumas rotinas para manter o sistema ou simplesmente atualiza-las.

Essas rotinas devem ser incluídas no codebase de sua aplicação e nunca deve ser aberto um SSL para o container específico da aplicação e executar, o processo não deve concorrer com requisições de usuários

Vale lembrar que simplesmente aplicar os 12 fatores não significa que você terá uma aplicação automaticamente escalável, mas não aplicá-los irá dificultar muito. 🙌

![](https://medium.com/_/stat?event=post.clientViewed&referrerSource=full_rss&postId=d8e5fe1d878a)

---
*Publicado originalmente no [Medium](https://medium.com/@viniciustirabassi/saas-muito-provavelmente-voc%C3%AA-j%C3%A1-deve-ter-ouvido-falar-sobre-d8e5fe1d878a?source=rss-93f65ddb28b5------2).*
