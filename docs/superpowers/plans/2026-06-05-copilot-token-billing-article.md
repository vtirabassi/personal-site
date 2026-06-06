# GitHub Copilot Token Billing Article — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar artigo bilíngue (PT + EN) explicando a nova cobrança por tokens do GitHub Copilot e como otimizar custos com estratégias comportamentais e as ferramentas RTK e Caveman.

**Architecture:** Dois arquivos Markdown independentes com o mesmo slug, seguindo as convenções de frontmatter e estilo do blog existente. A versão PT vai em `src/content/blog/`, a versão EN em `src/content/blog-en/`.

**Tech Stack:** Markdown, Astro content collections, frontmatter YAML.

---

## File Map

| Ação | Arquivo |
|---|---|
| Criar | `src/content/blog/github-copilot-pay-per-token.md` |
| Criar | `src/content/blog-en/github-copilot-pay-per-token.md` |

---

## Task 1: Escrever artigo PT

**Files:**
- Create: `src/content/blog/github-copilot-pay-per-token.md`

- [ ] **Step 1: Criar o arquivo PT com conteúdo completo**

Criar `src/content/blog/github-copilot-pay-per-token.md` com o conteúdo abaixo:

```markdown
---
title: "GitHub Copilot virou pay-per-token: como não levar um susto na fatura"
date: 2026-06-05
description: "Em 1 de junho de 2026 o Copilot trocou mensalidade fixa por cobrança por tokens. Entenda o que mudou e saia com um plano concreto para não esgotar seus créditos a meio do mês."
tags: ["ia", "produtividade", "ferramentas", "engenharia"]
---

Você abre um repositório grande, pede ao agente do Copilot para entender a arquitetura e propor um refactor. Vinte minutos depois, ele terminou. Você fecha a sessão satisfeito.

O que você ainda não sabe: acabou de consumir 35 dos seus 1.000 créditos mensais. No plano Pro, isso é $0,35 do seu orçamento de $10. Repita quatro vezes na semana e você chega em meados do mês sem créditos para qualquer sessão avançada.

Em 1 de junho de 2026, o GitHub migrou o Copilot de mensalidade fixa para cobrança por tokens via **GitHub AI Credits**. Se você usa agentes, isso muda a conta. Este artigo explica o que mudou, por que sessões agênticas são caras, e deixa você com um plano concreto para sair na frente.

---

## O que mudou (e quando)

A mudança substituiu os antigos Premium Request Units (PRUs) por **GitHub AI Credits**. A regra: 1 crédito = $0,01. Cada token processado — entrada, saída e tokens em cache — é convertido em créditos usando o rate do modelo escolhido.

O que **não** muda: code completion inline (as sugestões enquanto você digita) e Next Edit suggestions continuam gratuitos em todos os planos.

O que **passa a custar**:

| Recurso | Consome créditos? |
|---|---|
| Code completion inline | Não |
| Next Edit suggestions | Não |
| Chat (perguntas simples) | Sim |
| Modo agente (Agent Mode) | Sim |
| Sessões longas com ferramentas | Sim |
| Copilot Code Review em PRs | Sim |

Os preços dos planos não mudaram:

| Plano | Preço | Créditos/mês |
|---|---|---|
| Copilot Pro | $10/mês | $10 |
| Copilot Pro+ | $39/mês | $39 |
| Copilot Business | $19/usuário/mês | $19/usuário |
| Copilot Enterprise | $39/usuário/mês | $39/usuário |

O detalhe que assusta: antes havia um buffer. Agora a franquia de créditos equivale exatamente ao valor do plano — sem sobra. Quando os créditos acabam, o uso avançado pausa até o próximo ciclo. **Não há fallback automático para modelo mais barato.**

---

## Por que sessões agênticas são caras

A conta funciona assim: cada chamada ao modelo soma tokens de entrada (o contexto enviado) + tokens de saída (a resposta gerada) + tokens em cache. Esse total é multiplicado pelo rate do modelo e convertido em créditos.

O modo agente é caro porque uma única tarefa envolve várias chamadas encadeadas:

1. O agente lê o arquivo relevante
2. Executa um comando e recebe o output
3. Decide o próximo passo
4. Escreve o código
5. Verifica se funcionou
6. Itera se necessário

Cada etapa é uma chamada separada ao modelo. Uma sessão de 20 minutos num repositório médio pode consumir entre 30 e 40 créditos. Com um plano Pro de $10 (1.000 créditos), você tem margem para cerca de 25 a 30 sessões assim por mês — menos de uma por dia útil.

Modelos mais pesados (frontier models) consomem créditos mais rápido. **A escolha do modelo é a alavanca de custo mais direta que você tem.**

---

## Quatro hábitos que reduzem a conta

**1. Escopo antes de delegar**
Defina o que o agente deve fazer *antes* de iniciar a sessão. Reorientações no meio do caminho custam tokens: o agente recapitula o contexto, descarta trabalho e reinicia. Uma instrução clara no início vale mais do que dez correções durante.

**2. Prompts hiper-específicos**
Forneça arquivo de referência, objetivo e formato esperado. "Refatora o módulo de autenticação" é caro. "Extrai a validação de JWT de `src/auth/middleware.ts` para uma função pura em `src/auth/jwt.ts` sem mudar a interface" é cirúrgico.

**3. Modelo por complexidade**
Tarefas rotineiras — explicar código, gerar testes unitários simples, renomear variáveis — usam modelo leve. Refatoração arquitetural, análise de codebase grande, debugging complexo — aí vale o modelo robusto. A maioria dos planos deixa você escolher.

**4. Não deixe agente rodando sem supervisão**
Especialmente em repos grandes. Uma sessão aberta sem escopo claro consome créditos em loop. Se você vai se afastar, pause a sessão.

---

## RTK e Caveman: ferramentas complementares, não substitutas

Antes de instalar qualquer coisa, vale entender por que as duas atuam em camadas diferentes — e por que empilhá-las faz mais sentido do que escolher uma.

**RTK opera na camada de entrada.** Ele intercepta os outputs de comandos de terminal (git, npm, cargo, docker etc.) *antes* de chegarem ao contexto do modelo. O agente recebe um input mais compacto e denso. A economia vem do que o modelo *vê*.

**Caveman opera na camada de saída.** Ele não modifica o contexto, mas constrange *como* o modelo expressa a resposta — linguagem telegráfica, sem rodeios, sem formalidades. A economia vem do que o modelo *escreve*.

**O efeito cumulativo:** em workflows agênticos, cada output vira contexto da próxima iteração. Respostas mais curtas do Caveman significam contexto menor nas rodadas seguintes. O benefício propaga para frente.

| | RTK | Caveman |
|---|---|---|
| **Foco** | Tokens de **entrada** | Tokens de **saída** |
| **Camada** | Execução (filtra antes do modelo) | Geração (constrange durante a resposta) |
| **Como age** | Proxy CLI que comprime output de terminal | Skill que instrui o agente a ser telegráfico |
| **Economia típica** | 60–90% nos outputs de terminal | ~65% nas respostas do agente |
| **Quando usar** | Sessões com muitos comandos | Sessões de chat/agente com respostas longas |
| **Repositório** | [github.com/rtk-ai/rtk](https://github.com/rtk-ai/rtk) | [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) |

---

## Mini-guia: RTK

RTK é um proxy CLI open-source escrito em Rust. Quando o agente executa um comando de terminal, o RTK intercepta o output, filtra ruído, agrupa itens similares e entrega ao modelo só o que importa.

**Instalação:**
```bash
brew install rtk
rtk init -g
```

O segundo comando ativa um hook global que intercepta comandos automaticamente — você não precisa prefixar manualmente.

**Antes e depois:**

Sem RTK, um `git status` num repositório médio retorna dezenas de linhas listando cada arquivo modificado individualmente, incluindo caminhos completos, status de staging e metadados. Com RTK, você recebe um sumário agrupado por diretório com contagem de arquivos — uma fração dos tokens.

O mesmo vale para `npm test` ou `./gradlew test`: testes que passam desaparecem, falhas aparecem completas. Rafael Pazini documentou 5,3 milhões de tokens economizados em 612 comandos — sem mudar uma linha de código. Veja o relato completo em [dev.to/rflpazini](https://dev.to/rflpazini/rtk-como-economizei-53-milhoes-de-tokens-sem-mudar-uma-linha-de-codigo-5e1m).

---

## Mini-guia: Caveman

Caveman é uma skill instalável para Claude Code e mais de 30 agentes. Ela instrui o modelo a responder de forma telegráfica — cortando saudações, explicações longas e formalidades — mantendo toda a precisão técnica.

**Instalação (macOS/Linux):**
```bash
curl -fsSL https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.sh | bash
```

Requer Node.js 18+. O script detecta automaticamente quais agentes você tem instalados.

**Ativação no Claude Code:**
```
/caveman
```

Ou simplesmente escreva "talk like caveman" na sessão.

**Antes e depois:**

> Sem caveman: "The reason your React component is re-rendering is likely because you're creating a new object reference on every render cycle. To fix this, you should wrap the object creation in a `useMemo` hook, which will memoize the value and prevent unnecessary re-renders."

> Com caveman: "New object ref each render. Wrap in `useMemo`."

Mesma solução. 73% menos tokens.

**Níveis disponíveis:** `lite`, `full` (padrão) e `ultra`. Use `/caveman-stats` para acompanhar a economia acumulada.

---

## Configurar orçamento no painel

Mesmo com os hábitos certos e as ferramentas instaladas, é bom ter um limite explícito para não ter surpresas no fim do mês.

**Como configurar:**
1. Acesse **GitHub Settings → Copilot → Usage & billing**
2. Defina um limite mensal de gastos
3. Configure alertas (recomendo setar a 70% da cota — você ainda tem margem para ajustar o comportamento antes de pausar)

**Planos individuais** têm controle pessoal. **Planos Business e Enterprise** permitem controle por equipe ou cost center — útil para times que compartilham uma cota corporativa.

---

## Conclusão

Code completion continua gratuito — a IA no editor do dia a dia não mudou. O que mudou é o custo de usar agentes com autonomia ampla e sem escopo definido.

A boa notícia: a maior parte da economia vem de comportamento, não de ferramenta. Prompts claros, escopo antes de delegar e escolha consciente de modelo já resolvem boa parte do problema. RTK e Caveman atacam o que sobra nas camadas de input e output.

Empilhados, os ganhos se multiplicam. E você continua com o benefício dos agentes sem deixar a conta explodir.
```

- [ ] **Step 2: Verificar se o arquivo foi criado corretamente**

```bash
head -10 src/content/blog/github-copilot-pay-per-token.md
```

Expected: frontmatter com `title`, `date`, `description` e `tags` visíveis.

- [ ] **Step 3: Commit**

```bash
git add src/content/blog/github-copilot-pay-per-token.md
git commit -m "feat(blog): add article on GitHub Copilot token billing and optimization (PT)"
```

---

## Task 2: Escrever artigo EN

**Files:**
- Create: `src/content/blog-en/github-copilot-pay-per-token.md`

- [ ] **Step 1: Criar o arquivo EN com conteúdo completo**

Criar `src/content/blog-en/github-copilot-pay-per-token.md` com o conteúdo abaixo:

```markdown
---
title: "GitHub Copilot switched to pay-per-token: how to avoid bill shock"
date: 2026-06-05
description: "On June 1, 2026, Copilot replaced flat-rate billing with token-based AI Credits. Here's what changed and a concrete plan to stop burning through your monthly allowance."
tags: ["ai", "productivity", "tools", "engineering"]
---

You open a large repository and ask the Copilot agent to understand the architecture and propose a refactor. Twenty minutes later, it's done. You close the session satisfied.

What you don't know yet: you just burned 35 of your 1,000 monthly credits. On the Pro plan, that's $0.35 of your $10 budget. Do that four times a week and you'll hit mid-month with no credits left for any advanced session.

On June 1, 2026, GitHub migrated Copilot from flat-rate billing to token-based billing via **GitHub AI Credits**. If you use agents, this changes the math. This article explains what changed, why agentic sessions are expensive, and leaves you with a concrete plan to stay ahead.

---

## What changed (and when)

The update replaced the old Premium Request Units (PRUs) with **GitHub AI Credits**. The rule is simple: 1 credit = $0.01. Every token processed — input, output, and cached tokens — is converted into credits using the rate for the model you're using.

What does **not** change: inline code completions (the suggestions as you type) and Next Edit suggestions remain free across all plans.

What **now costs credits**:

| Feature | Consumes credits? |
|---|---|
| Inline code completion | No |
| Next Edit suggestions | No |
| Chat (simple questions) | Yes |
| Agent Mode | Yes |
| Long sessions with tools | Yes |
| Copilot Code Review on PRs | Yes |

Plan prices are unchanged:

| Plan | Price | Credits/month |
|---|---|---|
| Copilot Pro | $10/mo | $10 |
| Copilot Pro+ | $39/mo | $39 |
| Copilot Business | $19/user/mo | $19/user |
| Copilot Enterprise | $39/user/mo | $39/user |

The detail that stings: there used to be a buffer. Now the credit allowance equals exactly the plan price — no cushion. When credits run out, advanced features pause until the next cycle. **There is no automatic fallback to a cheaper model.**

---

## Why agentic sessions are expensive

Here's how the math works: each model call adds up input tokens (the context you send) + output tokens (the generated response) + cached tokens. That total is multiplied by the model's rate and converted into credits.

Agent mode is expensive because a single task involves multiple chained calls:

1. The agent reads the relevant file
2. Executes a command and receives the output
3. Decides the next step
4. Writes the code
5. Checks if it worked
6. Iterates if needed

Each step is a separate model call. A 20-minute session on a medium-sized repo can consume 30–40 credits. With a Pro plan at $10 (1,000 credits), you have room for about 25–30 such sessions per month — fewer than one per working day.

Heavier models (frontier models) burn credits faster. **Model selection is the most direct cost lever you have.**

---

## Four habits that reduce the bill

**1. Scope before delegating**
Define what the agent should do *before* starting the session. Mid-session corrections are expensive: the agent recaps context, discards work, and restarts. A clear upfront instruction is worth more than ten corrections along the way.

**2. Hyper-specific prompts**
Provide a reference file, objective, and expected format. "Refactor the auth module" is expensive. "Extract JWT validation from `src/auth/middleware.ts` into a pure function in `src/auth/jwt.ts` without changing the interface" is surgical.

**3. Model by complexity**
Routine tasks — explaining code, generating simple unit tests, renaming variables — use a lightweight model. Architectural refactors, large codebase analysis, complex debugging — that's when the frontier model earns its keep. Most plans let you choose.

**4. Don't leave agents running unsupervised**
Especially on large repos. An open session with no clear scope burns credits in a loop. If you're stepping away, pause the session.

---

## RTK and Caveman: complementary tools, not substitutes

Before installing anything, it's worth understanding why these two tools operate at different layers — and why stacking them makes more sense than choosing one.

**RTK operates at the input layer.** It intercepts terminal command outputs (git, npm, cargo, docker, etc.) *before* they reach the model's context. The agent receives a more compact, dense input. The savings come from what the model *sees*.

**Caveman operates at the output layer.** It doesn't modify context, but constrains *how* the model expresses its response — telegraphic language, no preamble, no filler. The savings come from what the model *writes*.

**The compounding effect:** in agentic workflows, every output becomes part of the next turn's context. Shorter Caveman responses mean smaller context in subsequent iterations. The benefit propagates forward.

| | RTK | Caveman |
|---|---|---|
| **Focus** | **Input** tokens | **Output** tokens |
| **Layer** | Execution (filters before the model) | Generation (constrains during response) |
| **How it works** | CLI proxy that compresses terminal output | Skill that instructs the agent to be terse |
| **Typical savings** | 60–90% on terminal outputs | ~65% on agent responses |
| **When to use** | Sessions with many commands | Sessions with long chat/agent responses |
| **Repository** | [github.com/rtk-ai/rtk](https://github.com/rtk-ai/rtk) | [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) |

---

## Quick guide: RTK

RTK is an open-source CLI proxy written in Rust. When the agent runs a terminal command, RTK intercepts the output, filters noise, groups similar items, and delivers to the model only what matters.

**Installation:**
```bash
brew install rtk
rtk init -g
```

The second command activates a global hook that intercepts commands automatically — no need to manually prefix anything.

**Before and after:**

Without RTK, `git status` on a medium-sized repo returns dozens of lines listing each modified file individually, with full paths, staging status, and metadata. With RTK, you get a directory-grouped summary with file counts — a fraction of the tokens.

The same applies to `npm test` or `./gradlew test`: passing tests disappear, failures show up complete. Rafael Pazini documented 5.3 million tokens saved across 612 commands — without changing a single line of code. Read the full account at [dev.to/rflpazini](https://dev.to/rflpazini/rtk-como-economizei-53-milhoes-de-tokens-sem-mudar-uma-linha-de-codigo-5e1m).

---

## Quick guide: Caveman

Caveman is an installable skill for Claude Code and 30+ agents. It instructs the model to respond telegraphically — cutting greetings, long explanations, and filler — while keeping full technical accuracy.

**Installation (macOS/Linux):**
```bash
curl -fsSL https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.sh | bash
```

Requires Node.js 18+. The script auto-detects which agents you have installed.

**Activation in Claude Code:**
```
/caveman
```

Or just type "talk like caveman" in the session.

**Before and after:**

> Without caveman: "The reason your React component is re-rendering is likely because you're creating a new object reference on every render cycle. To fix this, you should wrap the object creation in a `useMemo` hook, which will memoize the value and prevent unnecessary re-renders."

> With caveman: "New object ref each render. Wrap in `useMemo`."

Same solution. 73% fewer tokens.

**Available levels:** `lite`, `full` (default), and `ultra`. Use `/caveman-stats` to track accumulated savings.

---

## Setting up budget controls

Even with the right habits and tools installed, an explicit spending limit helps avoid end-of-month surprises.

**How to configure:**
1. Go to **GitHub Settings → Copilot → Usage & billing**
2. Set a monthly spending limit
3. Configure alerts (recommended: set at 70% of your allowance — you still have room to adjust behavior before things pause)

**Individual plans** have personal controls. **Business and Enterprise plans** allow control per team or cost center — useful for teams sharing a corporate quota.

---

## Conclusion

Inline code completion is still free — the AI in your editor for day-to-day work hasn't changed. What changed is the cost of running agents with broad autonomy and no defined scope.

The good news: most of the savings come from behavior, not tooling. Clear prompts, scope before delegating, and conscious model selection already solve most of the problem. RTK and Caveman handle what's left at the input and output layers.

Stacked, the savings compound. And you keep the benefits of agents without letting the bill get out of hand.
```

- [ ] **Step 2: Verificar se o arquivo foi criado corretamente**

```bash
head -10 src/content/blog-en/github-copilot-pay-per-token.md
```

Expected: frontmatter com `title`, `date`, `description` e `tags` visíveis.

- [ ] **Step 3: Commit**

```bash
git add src/content/blog-en/github-copilot-pay-per-token.md
git commit -m "feat(blog): add article on GitHub Copilot token billing and optimization (EN)"
```

---

## Task 3: Verificar build e sincronização

**Files:**
- Verify: `src/content/blog/github-copilot-pay-per-token.md`
- Verify: `src/content/blog-en/github-copilot-pay-per-token.md`

- [ ] **Step 1: Checar que os dois arquivos existem com o mesmo slug**

```bash
ls src/content/blog/github-copilot-pay-per-token.md src/content/blog-en/github-copilot-pay-per-token.md
```

Expected: ambos os caminhos listados sem erro.

- [ ] **Step 2: Rodar build de produção**

```bash
npm run build
```

Expected: build completa sem erros. Se houver erro de tipo/frontmatter, corrigir no arquivo afetado antes de continuar.

- [ ] **Step 3: Verificar que os artigos aparecem no servidor local**

```bash
npm run dev
```

Abrir `http://localhost:4321/blog` e confirmar que o artigo novo aparece na listagem.

- [ ] **Step 4: Commit final se necessário**

Se houve qualquer correção nos steps anteriores:

```bash
git add src/content/blog/github-copilot-pay-per-token.md src/content/blog-en/github-copilot-pay-per-token.md
git commit -m "fix(blog): correct frontmatter or content issues in copilot article"
```
