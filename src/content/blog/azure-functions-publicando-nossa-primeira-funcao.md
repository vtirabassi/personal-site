---
title: "Azure Functions: Publicando nossa primeira função"
date: 2024-09-11
description: "Neste artigo, vamos aprender como publicar no Azure uma função desenvolvida localmente e também como interagir com uma fila como gatilho."
tags: ["azure", "serverless", "cloud"]
---

![](https://cdn-images-1.medium.com/max/600/0*lVfAfJXcvjoUVyf4)

Olá pessoal, aqui estou eu novamente, apresentando um segundo artigo, a continuação sobre Azure Functions. Para quem não acompanhou o primeiro, recomendo a leitura: [Desmistificando Azure Functions: Como Implementar Serverless na Prática](https://medium.com/@viniciustirabassi/desmistificando-azure-functions-como-implementar-serverless-na-pr%C3%A1tica-7c6dc811a4ad).

Neste artigo, vamos aprender como publicar no Azure uma função desenvolvida localmente e também como interagir com uma fila como gatilho.

Utilizaremos o Azure CLI, mas é importante saber que também é possível realizar o processo através da IDE ou simplesmente arrastando seus arquivos pelo portal do Azure.

Para instalar o Azure CLI, basta rodar os seguintes comandos:

```bash
brew update
brew install azure-cli

az login # irá abrir uma página web para a autenticação em sua conta do Azure
```

Uma vez logado no Azure via CLI, se faz necessário a criação de um Resource Group no Azure. O **Resource Group,** ou **RG** no Azure é um contêiner lógico que agrupa os recursos relacionados a um projeto específico, como máquinas virtuais, bancos de dados e redes. Isso oferece vários benefícios:

**Redução de latência**: Ao agrupar os recursos dentro do mesmo Resource Group e região, você garante que eles estão fisicamente próximos uns dos outros, o que pode minimizar a latência na comunicação entre eles, especialmente em arquiteturas distribuídas.

**Organização e governança**: O Resource Group facilita o gerenciamento centralizado dos recursos, permitindo aplicar políticas, como controle de custos, e simplificar o rastreamento dos gastos por projeto ou departamento. Também é uma maneira eficaz de aplicar e gerenciar permissões de acesso, garantindo que apenas usuários ou grupos específicos possam gerenciar ou visualizar certos recursos.

**Facilidade de gerenciamento**: Com um Resource Group, você pode realizar ações em massa, como apagar, mover ou replicar todos os recursos de uma vez, o que simplifica operações de manutenção e migração.

Para executar uma função no Azure, também precisaremos criar uma Storage Account. O **Azure Storage** é essencial para armazenar não apenas o código da função, mas também outros dados fundamentais para o funcionamento de uma function, como logs, filas, tabelas e blobs. Independentemente de o código-fonte estar versionado no GitHub ou outra plataforma, durante a execução da função, o Azure precisa de um espaço próprio para armazenar o código, artefatos temporários, e arquivos de configuração.

```bash
az group create \
  --name demofunc-rg \          # nome do resource group
  --location brazilsouth        # location do rg

az storage account create \
  --name demofuncvinistorage \  # nome do storage account
  --location brazilsouth \      # location do storage
  --resource-group demofunc-rg \# nome do rg que o storage estará
  --sku Standard_LRS \          # tipo de replicação e o nível de desempenho
  --allow-blob-public-access false # se o acesso público será permitido ou não
```

Ótimo! Até o momento, preparamos o terreno para criar a função no Azure e publicar nossa função local que construímos no artigo anterior.

Para criarmos nossa aplicação de função no Azure, é necessário seguir o comando a seguir:

```bash
az functionapp create \
  --resource-group demofunc-rg \          # nome do rg que o storage estará
  --consumption-plan-location brazilsouth \# região onde o plano de consumo será configurado
  --runtime dotnet-isolated \             # runtime de execução
  --functions-version 4 \                 # versão do runtime de Azure Functions a ser usada
  --name demofuncvini \                   # nome da função
  --storage-account demofuncvinistorage   # nome do storage account
```

Após criar a função no Azure com sucesso, é necessário publicar a função local. Para isso, acesse a pasta raiz da função local e execute o comando a seguir:

```bash
cd MyFuncProjFolder

func azure functionapp publish demofuncvini
```

Podemos observar em nosso CLI que a função está ativa e operando corretamente.

![](https://cdn-images-1.medium.com/max/1024/1*3STnwvN5mqUn64eo6elg1Q.png)

Acessando o Portal Azure:

![](https://cdn-images-1.medium.com/max/1024/1*FzPIJD90vZrkOPlPXcK_Ow.png)

Sempre importante excluir seu Resource Group no final, para não gerar custos desnecessários, já que os recursos alocados dentro dele continuam sendo faturados enquanto estiverem ativos, mesmo que não estejam em uso.

```bash
az group delete --name demofunc-rg
```

Para concluirmos, gostaria de criar mais um exemplo de como podemos testar nossa função localmente, desta vez com uma QueueTrigger. Para isso, vamos retornar ao nosso projeto local e executar o comando a seguir:

```bash
func new --template "QueueTrigger" --name QueueTriggerExample
```

O arquivo QueueTriggerExample.cs é criado em nosso projeto com o seguinte conteúdo:

```csharp
[Function(nameof(QueueTriggerExample))]
public void Run([QueueTrigger("myqueue-items", Connection = "")] QueueMessage message)
{
  _logger.LogInformation($"C# Queue trigger function processed: {message.MessageText}");
}
```

Antes de iniciarmos os testes, é necessário ativar o Azurite e configurar a Connection no projeto.

```bash
azurite --location ./azurite \  # diretório onde o Azurite deve armazenar seus dados
  --silent \                    # modo silencioso, ou seja, não imprime mensagens de log
  --debug ./azurite/debug.log   # ativa o modo de depuração e direciona os logs
```

Após configurar, atualize a Connection no atributo `QueueTrigger`:

```csharp
[Function(nameof(QueueTriggerExample))]
public void Run([QueueTrigger("myqueue-items", Connection = "AzureWebJobsStorage")] QueueMessage message)
{
  _logger.LogInformation($"C# Queue trigger function processed: {message.MessageText}");
}
```

```bash
func start # inicia a função
```

Agora, vamos publicar nossa mensagem na fila "myqueue-items". Você notará que a mensagem publicada está em base64, pois o Azure Functions processa as mensagens da fila como se fossem codificadas em Base64.

```bash
az storage queue list --connection-string "UseDevelopmentStorage=true"

az storage queue create --name myqueue-items --connection-string "UseDevelopmentStorage=true"

az storage message put --queue-name myqueue-items --content "dGVzdGU=" --connection-string "UseDevelopmentStorage=true"
```

Conseguimos observar a mensagem pública sendo processada pela nossa função.

![](https://cdn-images-1.medium.com/max/1024/1*o_wKPvtKIEJ75RTqgYJykQ.png)

Ótimo! Isso é o que eu queria compartilhar com vocês neste segundo artigo sobre Azure Functions. Espero ter contribuído um pouco mais à nossa jornada sem fim de aprendizado. 👨🏻‍💻

---
*Publicado originalmente no [Medium](https://medium.com/@viniciustirabassi/azure-functions-publicando-nossa-primeira-fun%C3%A7%C3%A3o-3eb0fdd91a1d?source=rss-93f65ddb28b5------2).*
