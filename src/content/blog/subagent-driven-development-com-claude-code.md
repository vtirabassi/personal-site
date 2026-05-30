---
title: "Subagent-Driven Development: como eu uso o Claude Code para entregar features completas"
date: 2026-05-29
description: "Existe um plugin chamado superpowers que transforma o Claude Code num fluxo disciplinado de desenvolvimento — com specs, planos, subagentes por tarefa e revisão em duas etapas. Nesse artigo conto como foi construir a seção de Trilhas desse site com ele."
tags: ["claude", "ia", "engenharia", "produtividade"]
---

Quando comecei a usar o Claude Code, minha expectativa era simples: pedir uma feature e receber o código pronto. Funcionava, mas o resultado era inconsistente — às vezes perfeito, às vezes com uma arquitetura que eu precisava refatorar na hora.

O que mudou foi descobrir o plugin **superpowers**, que formaliza um fluxo de desenvolvimento inteiro dentro do Claude Code. A ideia central chama-se **Subagent-Driven Development (SDD)**.

## O que é o superpowers

O superpowers é um conjunto de skills (habilidades) que o Claude Code pode invocar durante uma conversa. Cada skill é um guia estruturado que diz ao modelo como se comportar numa determinada fase do trabalho: brainstorming, escrita de planos, execução, revisão, finalização.

As principais skills do fluxo de desenvolvimento são:

| Skill | O que faz |
|---|---|
| `superpowers:brainstorming` | Transforma uma ideia vaga numa spec documentada |
| `superpowers:writing-plans` | Converte a spec em tarefas com código real, passo a passo |
| `superpowers:subagent-driven-development` | Executa o plano com subagentes independentes por tarefa |
| `superpowers:finishing-a-development-branch` | Verifica testes, oferece opções de merge/PR/discard |

## O conceito de SDD

A ideia é simples: em vez de deixar o modelo acumular contexto de toda a sessão até travar ou alucinar, você **despacha um subagente limpo por tarefa**. Esse subagente:

1. Recebe exatamente o que precisa saber — o texto da tarefa, contexto relevante, arquivos relacionados
2. Implementa, roda testes, faz commit, faz self-review
3. Retorna um status: `DONE`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT` ou `BLOCKED`

Depois que o subagente termina, passam por **duas revisões independentes**:

- **Spec compliance**: o que foi implementado bate com o que foi especificado? Nada a mais, nada a menos.
- **Code quality**: o código está limpo? Tem code smells, duplicações, comentários desnecessários?

Só depois de passar nas duas revisões a tarefa é marcada como concluída e o próximo subagente entra em campo.

## Como usamos isso aqui

Nesse site pessoal, a seção de **Trilhas** foi construída inteiramente com esse fluxo. O exemplo mais recente foi um redesign do sistema de progresso: queria que os recursos oficiais da Anthropic tivessem um checklist individual, os complementares ficassem numa seção separada sem checkbox, e a barra de progresso refletisse os recursos — não as semanas.

O ciclo foi assim:

**1. Brainstorming**
Abri com `/superpowers:brainstorming` e descrevi a ideia. A skill fez perguntas uma de cada vez para afinar o escopo:

- *Dois arrays separados no frontmatter YAML ou um campo de tipo?* → Dois arrays (`officialResources` / `complementaryResources`)
- *Os exercícios entram no checklist?* → Não, decorativos
- *Os recursos oficiais precisam de campo de descrição?* → Sim

No final, gerou uma spec em `docs/superpowers/specs/` e commitou.

**2. Writing Plans**
Com a spec aprovada, `/superpowers:writing-plans` gerou o plano em `docs/superpowers/plans/`. Cada tarefa tinha:
- Arquivos exatos a criar ou modificar
- Testes a escrever (TDD)
- Código completo — sem "implemente conforme necessário"
- Comando exato para rodar e resultado esperado
- Commit message

**3. Subagent-Driven Development**
A execução foi feita com subagentes independentes. Para cada tarefa:

```
[Despachei subagente com texto completo da tarefa + contexto necessário]

Subagente: DONE
  - Refatorou track-progress.ts para rastrear recursos, não módulos
  - 13 testes passando
  - Commitou

[Despachei spec reviewer]
Spec reviewer: ✅ Spec compliant

[Despachei code quality reviewer]  
Code reviewer: Issues:
  - Título duplicado no chip de link
  
[Subagente corrigiu, novo commit]

Code reviewer: ✅ Aprovado
```

Um problema que o processo pegou que eu certamente teria deixado passar: o `index.astro` ainda importava `getCompletedModules` depois que a função foi renomeada. O subagente da tarefa 4 fez a correção parcial; a revisão de spec identificou o que faltava e a tarefa 5 completou.

**4. Finishing**
Com todas as tarefas concluídas, a skill `superpowers:finishing-a-development-branch` verificou os testes e apresentou as opções:

```
1. Merge localmente para main
2. Push e criar Pull Request
3. Manter a branch como está
4. Descartar o trabalho
```

Escolhi push direto.

## Outro exemplo: navegação por mês

A feature de navegação por mês no `/blog` e `/library` é um segundo exemplo com um sabor diferente: em vez de reestruturar dados, era uma mudança de UI — layout em duas colunas, sidebar sticky, scroll-spy com `IntersectionObserver` e sincronização com o filtro de temas da biblioteca.

O que vale destacar aqui é uma restrição que saiu da spec, não da minha cabeça na hora de implementar: *"um único commit contendo todas as alterações"*. O subagente seguiu sem questionar — e o resultado foi um histórico de git limpo, com o contexto da mudança todo junto em vez de fragmentado em commits incrementais.

A spec original está em `docs/superpowers/specs/2026-05-28-month-nav-design.md` no repositório, se quiser ver como fica uma spec completa com layout, critérios de sucesso e restrições explícitas.

## O que o SDD resolve na prática

O principal problema que ele endereça não é velocidade — é **consistência**. 

Sem esse fluxo, o Claude Code às vezes super-implementa (adiciona abstrações que não pedi), às vezes sub-implementa (esquece um campo que estava na descrição), e frequentemente perde o fio depois de muitos arquivos modificados na mesma sessão.

Com SDD:

- O subagente começa limpo, sem o acúmulo de contexto da sessão inteira
- A spec reviewe evita que o subagente entregue mais ou menos do que o combinado
- A revisão de qualidade pega os code smells antes de entrar na branch principal
- O plano escrito serve de contrato: o que vai ser feito, como vai ser testado, como vai ser commitado

## Uma resposta para o ceticismo de Fowler

Birgitta Böckeler, no blog do Martin Fowler, [levanta uma objeção válida ao SDD](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html): agentes frequentemente ignoram as specs, criando uma falsa sensação de controle — e o padrão lembra o fracasso histórico do Model-Driven Development.

É uma crítica justa quando a spec existe só como documentação. A resposta do superpowers é estrutural: o spec reviewer é um subagente separado que nunca tocou no código — ele só lê a spec e o diff. A separação de contexto é o que torna a revisão confiável. Sem isso, você está pedindo ao mesmo agente que implementou para auditar o próprio trabalho.

O exemplo do `getCompletedModules` é exatamente isso: quem implementou não percebeu o import quebrado. Quem revisou, percebeu.

## O que ainda falta

A limitação mais visível é que o fluxo assume que as tarefas são majoritariamente independentes. Quando uma tarefa depende do estado exato deixado pela anterior (por exemplo, um schema que muda e um template que usa esse schema), os subagentes independentes podem bater cabeça. O contorno é escrever o plano de forma que cada tarefa seja autocontida — o que por si só é uma boa disciplina.

Outra limitação: o custo. Cada tarefa gera pelo menos três subagentes (implementador + spec reviewer + code quality reviewer). Para features pequenas, às vezes é mais rápido implementar inline. A regra que uso: se a feature tem mais de 2-3 arquivos envolvidos ou leva mais de 20 minutos, vale o overhead do SDD.

---

Todas as specs e planos gerados pelo fluxo ficam versionados em `docs/superpowers/` no repositório. Se você quiser ver como uma spec real se parece — com layout, critérios de sucesso e restrições de implementação — o código desse site está público em [github.com/vtirabassi/personal-site](https://github.com/vtirabassi/personal-site). Os arquivos em `docs/superpowers/specs/` e `docs/superpowers/plans/` são o produto do brainstorming, não da minha edição manual.

O superpowers plugin está disponível no marketplace do Claude Code. Se você usa o Claude Code no dia a dia, vale experimentar — principalmente a skill de brainstorming, que sozinha já economiza bastante retrabalho.
