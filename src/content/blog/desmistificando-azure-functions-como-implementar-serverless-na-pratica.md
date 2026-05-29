---
title: "Desmistificando Azure Functions: Como Implementar Serverless na Prática"
date: 2024-08-21
description: "Para entendermos melhor o Azure Functions, vamos dar um pequeno passo para trás. O que vem à mente quando você ouve a palavra Serverless?"
tags: []
---

### Desmistificando Azure Functions: Como implementar serverless na prática

Para entendermos melhor o Azure Functions, vamos dar um pequeno passo para trás. Prometo que será breve!

O que vem à mente quando você ouve a palavra "**Serverless**"? Sem servidores? Menos servidores?

Embora o nome "**Serverless**" possa sugerir a ausência de servidores, na prática, os servidores ainda estão presentes. No entanto, tarefas rotineiras e essenciais, como o provisionamento de servidores, gerenciamento do sistema operacional, atualizações de segurança, escalonamento, balanceamento de carga, geração de logs e monitoramento, são gerenciadas pelo provedor de nuvem.

**Serveless** é um modelo de arquitetura em nuvem, onde o provedor cloud (AWS, Azure, Google Cloud, OCI, …) é responsável pela gestão de servidores, ou seja, da infraestrutura necessária para o funcionamento da sua aplicação.

Quando procuramos entender melhor sobre o Azure Functions, notamos que ele é uma implementação da Microsoft para o modelo Serveless, tornando-se um modelo FaaS (Function as a Service), modelo de computação em nuvem que permite aos desenvolvedores implantar e executar funções "pequenos pedaços de código", individuais em resposta a eventos específicos.

Alguns exemplos de FaaS conhecidos, são:

*   IBM Cloud Functions
*   Amazon's AWS Lambda
*   Google Cloud Functions
*   **Microsoft Azure Functions**

Nesse artigo entenderemos na teoria e na prática como implementar e executar as Azure Functions localmente. Para isso, vamos analisar algumas características principais do Azure Functions, são elas:

**Execução sob demanda**: as funções são executadas a partir de um evento "trigger", iremos abordar mais para frente os tipos de triggers disponíveis. Isso significa que o código só é executado quando necessário, resultando em maior eficiência e menor custo.

**Suporte a múltiplas linguagens:** C#, JavaScript, Python, Java, e PowerShell. São linguagens suportadas pelas funções, permitindo que desenvolvedores usem as linguagens com as quais estão mais confortáveis.

**Modelo de pagamento por uso, pay-per-use:** você paga apenas pelo tempo de execução do código e pelos recursos consumidos durante essa execução. Não há custos para o tempo em que a função não está ativa.

![](https://cdn-images-1.medium.com/max/1024/1*oVIb-GwvUmBmnBfmqHpfRw.png)

**Integração com o ecossistema Azure:** as funções se integram facilmente com outros serviços do Azure, como Azure Blob Storage, Azure Cosmos DB, e muito mais. Ponto de destaque é que as funções já são integradas com o Azure Monitor e Azure Application Insights.

**Desenvolvimento e implantação ágil:** as funções podem ser desenvolvidas e implantadas rapidamente usando ferramentas como Visual Studio, Visual Studio Code, ou diretamente através do portal do Azure. O Azure Functions Core Tools, permite o desenvolvimento e testes funções no computador local, ferramenta a qual iremos usar na prática.

Tá, mas e agora?  
Sabemos que as funções são executadas a partir de um evento, gatilho, que iremos nos referir pelo nome de trigger, consequentemente com essa trigger sendo disparada, o código é executado e um output é gerado.

![](https://cdn-images-1.medium.com/max/1024/1*vTQZb3MJj4O1SppVMLqwXQ.png)

A Microsoft fornece diversos tipos de triggers e bindings. Algumas trigger como: HTTP Trigger, Timer Trigger e Blob Trigger.

Como veremos na imagem a seguir, as Azure Functions suportam o conceito de bindings, que conectam a função a outros recursos ou serviços do Azure sem a necessidade de escrever muito código. Esses bindings permitem que você leia ou escreva dados de/para serviços do Azure. Existem dois tipos principais de bindings:

**Input Bindings**: Trazem dados para a função. Por exemplo, ler dados de um blob ou do Cosmos DB.

**Output Bindings**: Enviam dados de dentro da função para outro serviço. Por exemplo, enviar uma mensagem para o Event Hub ou gravar em uma tabela do Cosmos DB.

![](https://cdn-images-1.medium.com/max/1024/1*yj0jic6hijejzsVtaq9jfA.png)

Sabemos que as tecnologias evoluem rápido e podemos ter novas versões, ou até mesmo descontinuações de outras, por isso, deixarei abaixo o link oficial da Microsoft referente aos tipos de triggers e bindings.

[Triggers and bindings in Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings)

Sem mais delongas, vamos para prática.  
Iremos utilizar o Azure Functions Core Tools, vale a pena lembrar, que os comandos utilizados são os mesmos para todos os sistemas operacionais com exceção da forma de instalação deste pacote.

Estou utilizando o sistema macOS com o brew, para isso basta rodar o seguinte comando:

```bash
brew tap azure/functions
brew install azure-functions-core-tools@4
```

Após a instalação com sucesso, vamos criar nosso projeto:

```bash
func init MyFuncProjFolder \
  --worker-runtime dotnet-isolated \  # indica para isolar a execução da função em seu próprio processo.
  --target-framework net8.0           # versão do framework .NET que será usada no projeto.
```

![](https://cdn-images-1.medium.com/max/976/1*sSTljXHfX5G8aJEmEkOj3g.png)

Estrutura criada pelo comando **func init**

Notamos que foi criado a estrutura do projeto, mas não uma função em si. Mas como assim? Simples, criamos apenas um projeto, esse projeto comporta várias funções, onde elas podem ser de diferentes tipos de triggers, mas apenas de uma tecnologia.

Confuso? Veja a imagem abaixo:

![](https://cdn-images-1.medium.com/max/1024/1*owiFL6zcJ3Eh_VeSKJRSxw.png)

Próximo passo, criação da nossa primeira função:

```bash
cd MyFuncProjFolder

func new \
  --template "Http Trigger" \  # tipo da trigger que a func usará
  --name HttpTriggerExample \  # nome da func
  --authlevel "anonymous"      # nível de autenticação necessário para acessar a func via HTTP.
```

Para executar a função local e garantir o seu funcionamento, basta rodar o seguinte comando:

```bash
func start # iniciará todas as functions existentes no projeto.
```

![](https://cdn-images-1.medium.com/max/1024/1*-rGs_4mzIdnI85AXlqwH0Q.png)

![](https://cdn-images-1.medium.com/max/1024/1*kH6QFJDoRKTaWsPFKsxdhg.png)

Excelente!! Temos nossa primeira função.

Para finalizarmos esse primeiro post, vamos criar uma nova função, para vermos como é possível duas funções estarem em nosso projeto MyFuncProjFolder, dessa vez iremos criar com Timer Trigger.

```bash
func new \
  --template "Timer Trigger" \  # tipo da trigger que a func usará
  --name TimerTriggerExample    # nome da func
```

Foi gerado o arquivo da nossa função, TimerTriggerExample.cs

![](https://cdn-images-1.medium.com/max/1024/1*kz6oHNS4OU11iRcBrv5Y7Q.png)

Ao executar o projeto, é apresentado um erro de conexão.

![](https://cdn-images-1.medium.com/max/1024/1*WxAst1EyoLIhW2bHu-3jww.png)

Esse erro está relacionado à incapacidade da função se conectar ao serviço de armazenamento necessário para o funcionamento do Timer Trigger. Especificamente, a função está tentando se conectar a um serviço local (127.0.0.1) na porta 10000, mas a conexão está sendo recusada. Isso geralmente acontece quando o emulador de armazenamento (Azulite ou Azure Storage Emulator) não está em execução ou corretamente configurado.

Uma dúvida que possa existir, é porque preciso de um emulador de armazenamento para minha função disparada por um Timer Trigger, ou seja, porque o Azure Functions precisa de uma conta de armazenamento?

O Azure Functions utiliza uma conta de armazenamento para registrar logs, manter o estado das execuções e armazenar temporariamente dados que podem ser necessários durante a execução da função. Mesmo para uma função que é disparada por um Timer Trigger, o serviço precisa armazenar informações como o cronograma do timer, registros de execução e dados relacionados à função.

Outro ponto importante é, imagine que a função falhe, ou o serviço foi reiniciado, é fundamental que o cronograma seja respeitado, retornando de onde parou, para isso o Timer Trigger usa o Azure Storage para persistir o estado do cronograma.

```bash
npm install -g azurite # instala o azurite
azurite               # executa o azurite
```

Verifique se o arquivo `local.settings.json` está configurado para usar o Azurite como o serviço de armazenamento local:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated"
  }
}
```

Agora, ao executar o projeto com sucesso, poderemos visualizar os logs gerados pela nossa função TimerTriggerExample.

![](https://cdn-images-1.medium.com/max/1024/1*jaG-Uykux79ZNWbdx2QnHQ.png)

Espero ter contribuído para o seu conhecimento e desmistificado um pouco sobre a implementação do modelo serverless da Microsoft, o Azure Functions. 🙌


---
*Publicado originalmente no [Medium](https://medium.com/@viniciustirabassi/desmistificando-azure-functions-como-implementar-serverless-na-pr%C3%A1tica-7c6dc811a4ad?source=rss-93f65ddb28b5------2).*
