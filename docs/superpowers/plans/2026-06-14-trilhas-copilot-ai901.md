# Trilhas GitHub Copilot (GH-300) e AI-901 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar duas novas trilhas de estudo de certificação (GitHub Copilot GH-300 e AI-901 Azure AI Fundamentals) ao site, em PT e EN, reusando o modelo de content collection existente da trilha `cca-foundation`.

**Architecture:** Puro conteúdo. Nenhuma mudança de código, schema ou páginas. Os collections `tracks` / `track-modules` (+ variantes `-en`) e as páginas `/trilhas`, `/trilhas/[slug]`, `/en/tracks`, `/en/tracks/[slug]` já renderizam qualquer trilha. Cada trilha = 1 arquivo de metadados (PT + EN) + N módulos de semana (PT + EN). Validação = `npm run build` (Astro valida o schema do collection).

**Tech Stack:** Astro 5 content collections (Markdown + frontmatter YAML), Zod schema em `src/content/config.ts`.

**Convenção de links:** versão PT usa `learn.microsoft.com/pt-br/...`; versão EN usa `/en-us/...`. Links de `docs.github.com`, `github.com`, `aka.ms`, `ai.azure.com` são neutros — iguais nas duas versões.

---

### Task 1: Metadados da trilha GitHub Copilot (GH-300)

**Files:**
- Create: `src/content/tracks/github-copilot-gh300.md`
- Create: `src/content/tracks-en/github-copilot-gh300.md`

- [ ] **Step 1: Criar o arquivo de metadados PT**

`src/content/tracks/github-copilot-gh300.md`:

```markdown
---
title: "GitHub Copilot (GH-300)"
description: "Cronograma de estudos para a certificação GitHub Copilot (exame GH-300). 4 semanas, ~30 horas, cobrindo os 6 domínios oficiais do exame."
category: "certificação"
source: "GitHub Copilot (GH-300) | Microsoft / GitHub"
estimatedHours: 30
domains:
  - name: "Recursos do Copilot"
    percent: 28
  - name: "Uso responsável"
    percent: 18
  - name: "Prompt eng."
    percent: 14
  - name: "Privacidade"
    percent: 14
  - name: "Produtividade"
    percent: 13
  - name: "Dados & arquitetura"
    percent: 13
---
```

- [ ] **Step 2: Criar o arquivo de metadados EN**

`src/content/tracks-en/github-copilot-gh300.md`:

```markdown
---
title: "GitHub Copilot (GH-300)"
description: "Study schedule for the GitHub Copilot certification (exam GH-300). 4 weeks, ~30 hours, covering the 6 official exam domains."
category: "certification"
source: "GitHub Copilot (GH-300) | Microsoft / GitHub"
estimatedHours: 30
domains:
  - name: "Copilot features"
    percent: 28
  - name: "Responsible use"
    percent: 18
  - name: "Prompt eng."
    percent: 14
  - name: "Privacy"
    percent: 14
  - name: "Productivity"
    percent: 13
  - name: "Data & architecture"
    percent: 13
---
```

- [ ] **Step 3: Validar o build**

Run: `npm run build`
Expected: build passa sem erro de schema; nenhum erro mencionando `github-copilot-gh300`.

- [ ] **Step 4: Commit**

```bash
git add src/content/tracks/github-copilot-gh300.md src/content/tracks-en/github-copilot-gh300.md
git commit -m "feat(trilhas): add GH-300 GitHub Copilot track metadata"
```

---

### Task 2: Módulos PT da trilha GH-300

**Files:**
- Create: `src/content/track-modules/github-copilot-gh300/01-fundamentos-uso-responsavel.md`
- Create: `src/content/track-modules/github-copilot-gh300/02-recursos-ide-cli-agent.md`
- Create: `src/content/track-modules/github-copilot-gh300/03-dados-arquitetura-prompt.md`
- Create: `src/content/track-modules/github-copilot-gh300/04-produtividade-privacidade-revisao.md`

- [ ] **Step 1: Criar Semana 1 (PT)**

`src/content/track-modules/github-copilot-gh300/01-fundamentos-uso-responsavel.md`:

```markdown
---
title: "Semana 1 — Fundamentos, planos e uso responsável"
order: 1
duration: "~7h"
domain: "Uso responsável"
officialResources:
  - title: "GitHub Copilot Fundamentals — Part 1"
    description: "Learning path oficial: o que é o Copilot, como funciona e onde usar."
    url: "https://learn.microsoft.com/pt-br/training/paths/copilot/"
  - title: "Responsible AI with GitHub Copilot"
    description: "Módulo sobre IA responsável: riscos, limitações de GenAI e mitigação de danos."
    url: "https://learn.microsoft.com/pt-br/training/modules/responsible-ai-with-github-copilot/"
  - title: "Planos e recursos do GitHub Copilot"
    description: "Documentação dos planos Free, Pro, Business e Enterprise e o que cada um inclui."
    url: "https://docs.github.com/copilot/about-github-copilot/plans-for-github-copilot"
complementaryResources:
  - title: "Guia de estudos GH-300"
    description: "Study guide oficial com os domínios e pesos do exame."
    url: "https://aka.ms/GH300-StudyGuide"
  - title: "Exam sandbox GH-300"
    description: "Demo do ambiente e dos tipos de questão do exame."
    url: "https://aka.ms/GHExamDemo-enu"
exercises:
  - "Comparar os recursos disponíveis entre os planos Free, Pro, Business e Enterprise"
  - "Listar 3 riscos de ferramentas de GenAI e uma estratégia de mitigação para cada"
  - "Ativar o GitHub Copilot na sua IDE e fazer a primeira sugestão inline"
---

Semana introdutória: entenda o que é o GitHub Copilot, os planos disponíveis e os princípios de uso responsável antes de explorar os recursos avançados.
```

- [ ] **Step 2: Criar Semana 2 (PT)**

`src/content/track-modules/github-copilot-gh300/02-recursos-ide-cli-agent.md`:

```markdown
---
title: "Semana 2 — Recursos no IDE, CLI e Agent Mode"
order: 2
duration: "~9h"
domain: "Recursos do Copilot"
officialResources:
  - title: "GitHub Copilot Fundamentals — Part 2"
    description: "Learning path oficial cobrindo recursos avançados, chat, CLI e Agent Mode."
    url: "https://learn.microsoft.com/pt-br/training/paths/gh-copilot-2/"
  - title: "GitHub Copilot no IDE (docs)"
    description: "Inline suggestions, chat, Plan Mode, Agent Mode, Edit Mode e MCP na prática."
    url: "https://docs.github.com/copilot/using-github-copilot"
complementaryResources:
  - title: "GitHub Copilot CLI (docs)"
    description: "Instalação, comandos e uso interativo do Copilot na linha de comando."
    url: "https://docs.github.com/copilot/github-copilot-in-the-cli"
  - title: "Políticas de organização do Copilot (docs)"
    description: "Configurar políticas, code review policies e disponibilidade de recursos."
    url: "https://docs.github.com/copilot/managing-copilot/managing-github-copilot-in-your-organization"
exercises:
  - "Usar o Agent Mode para concluir uma tarefa que toca múltiplos arquivos"
  - "Instalar o GitHub Copilot CLI e gerar um script de automação"
  - "Criar um instructions file para padronizar respostas do Copilot Chat"
---

Semana prática: domine os recursos do Copilot no IDE (inline, chat, Plan/Edit/Agent Mode), o Copilot CLI, MCP, code review e as políticas de organização.
```

- [ ] **Step 3: Criar Semana 3 (PT)**

`src/content/track-modules/github-copilot-gh300/03-dados-arquitetura-prompt.md`:

```markdown
---
title: "Semana 3 — Dados, arquitetura e prompt engineering"
order: 3
duration: "~7h"
domain: "Prompt eng."
officialResources:
  - title: "GitHub Trust Center"
    description: "Como o Copilot funciona: fluxo de dados, proxy de filtragem e pós-processamento."
    url: "https://github.com/trust-center"
  - title: "Prompt engineering para o Copilot Chat (docs)"
    description: "Estrutura de prompt, contexto, zero-shot/few-shot e boas práticas."
    url: "https://docs.github.com/copilot/using-github-copilot/copilot-chat/prompt-engineering-for-copilot-chat"
complementaryResources:
  - title: "GitHub Copilot Chat Cookbook (docs)"
    description: "Exemplos de prompts prontos por cenário para acelerar o aprendizado."
    url: "https://docs.github.com/copilot/copilot-chat-cookbook"
exercises:
  - "Reescrever um prompt fraco aplicando contexto explícito e few-shot"
  - "Desenhar o ciclo de vida de uma sugestão de código, do input ao pós-processamento"
  - "Identificar 3 limitações de LLMs que afetam as sugestões do Copilot"
---

Semana conceitual: entenda como o Copilot processa dados e constrói prompts, o ciclo de vida das sugestões e as técnicas de prompt engineering que melhoram a qualidade das respostas.
```

- [ ] **Step 4: Criar Semana 4 (PT)**

`src/content/track-modules/github-copilot-gh300/04-produtividade-privacidade-revisao.md`:

```markdown
---
title: "Semana 4 — Produtividade, privacidade e revisão final"
order: 4
duration: "~7h"
domain: "Produtividade"
officialResources:
  - title: "Developer use cases for AI with GitHub Copilot"
    description: "Geração, refatoração e documentação de código; modernização de código legado."
    url: "https://learn.microsoft.com/pt-br/training/modules/developer-use-cases-for-ai-with-github-copilot/"
  - title: "Develop unit tests using GitHub Copilot tools"
    description: "Gerar testes unitários e de integração, edge cases e asserts com o Copilot."
    url: "https://learn.microsoft.com/pt-br/training/modules/develop-unit-tests-using-github-copilot-tools/"
  - title: "Configurar content exclusion (docs)"
    description: "Excluir arquivos/repositórios, detecção de duplicação e salvaguardas."
    url: "https://docs.github.com/copilot/managing-copilot/configuring-and-auditing-content-exclusion"
complementaryResources:
  - title: "Practice assessment oficial GH-300"
    description: "Simulado oficial para avaliar a prontidão e mapear lacunas antes da prova."
    url: "https://learn.microsoft.com/pt-br/credentials/certifications/github-copilot/"
exercises:
  - "Gerar testes unitários para uma função existente e revisar os edge cases sugeridos"
  - "Configurar content exclusion em um repositório de teste"
  - "Fazer o practice assessment oficial e revisar os 2 domínios com menor pontuação"
---

Semana de consolidação: use o Copilot para produtividade (testes, refatoração, segurança), configure privacidade e content exclusions, e feche com o practice assessment oficial. Meta: passar dos 700 pontos no GH-300.
```

- [ ] **Step 5: Validar o build**

Run: `npm run build`
Expected: build passa; os 4 módulos de `github-copilot-gh300` são reconhecidos sem erro de schema.

- [ ] **Step 6: Commit**

```bash
git add src/content/track-modules/github-copilot-gh300/
git commit -m "feat(trilhas): add GH-300 PT week modules"
```

---

### Task 3: Módulos EN da trilha GH-300

**Files:**
- Create: `src/content/track-modules-en/github-copilot-gh300/01-fundamentos-uso-responsavel.md`
- Create: `src/content/track-modules-en/github-copilot-gh300/02-recursos-ide-cli-agent.md`
- Create: `src/content/track-modules-en/github-copilot-gh300/03-dados-arquitetura-prompt.md`
- Create: `src/content/track-modules-en/github-copilot-gh300/04-produtividade-privacidade-revisao.md`

> Mesmos nomes de arquivo da versão PT (regra de sincronização do CLAUDE.md). Conteúdo traduzido; links `learn.microsoft.com` trocam `/pt-br/` por `/en-us/`.

- [ ] **Step 1: Criar Week 1 (EN)**

`src/content/track-modules-en/github-copilot-gh300/01-fundamentos-uso-responsavel.md`:

```markdown
---
title: "Week 1 — Fundamentals, plans and responsible use"
order: 1
duration: "~7h"
domain: "Responsible use"
officialResources:
  - title: "GitHub Copilot Fundamentals — Part 1"
    description: "Official learning path: what Copilot is, how it works and where to use it."
    url: "https://learn.microsoft.com/en-us/training/paths/copilot/"
  - title: "Responsible AI with GitHub Copilot"
    description: "Module on responsible AI: GenAI risks, limitations and harm mitigation."
    url: "https://learn.microsoft.com/en-us/training/modules/responsible-ai-with-github-copilot/"
  - title: "GitHub Copilot plans and features"
    description: "Documentation of the Free, Pro, Business and Enterprise plans and what each includes."
    url: "https://docs.github.com/copilot/about-github-copilot/plans-for-github-copilot"
complementaryResources:
  - title: "GH-300 study guide"
    description: "Official study guide with exam domains and weights."
    url: "https://aka.ms/GH300-StudyGuide"
  - title: "GH-300 exam sandbox"
    description: "Demo of the exam environment and question types."
    url: "https://aka.ms/GHExamDemo-enu"
exercises:
  - "Compare the features available across the Free, Pro, Business and Enterprise plans"
  - "List 3 risks of GenAI tools and one mitigation strategy for each"
  - "Enable GitHub Copilot in your IDE and make your first inline suggestion"
---

Intro week: understand what GitHub Copilot is, the available plans and the principles of responsible use before exploring the advanced features.
```

- [ ] **Step 2: Criar Week 2 (EN)**

`src/content/track-modules-en/github-copilot-gh300/02-recursos-ide-cli-agent.md`:

```markdown
---
title: "Week 2 — Features in the IDE, CLI and Agent Mode"
order: 2
duration: "~9h"
domain: "Copilot features"
officialResources:
  - title: "GitHub Copilot Fundamentals — Part 2"
    description: "Official learning path covering advanced features, chat, CLI and Agent Mode."
    url: "https://learn.microsoft.com/en-us/training/paths/gh-copilot-2/"
  - title: "GitHub Copilot in the IDE (docs)"
    description: "Inline suggestions, chat, Plan Mode, Agent Mode, Edit Mode and MCP in practice."
    url: "https://docs.github.com/copilot/using-github-copilot"
complementaryResources:
  - title: "GitHub Copilot CLI (docs)"
    description: "Installation, commands and interactive use of Copilot in the command line."
    url: "https://docs.github.com/copilot/github-copilot-in-the-cli"
  - title: "Copilot organization policies (docs)"
    description: "Configure policies, code review policies and feature availability."
    url: "https://docs.github.com/copilot/managing-copilot/managing-github-copilot-in-your-organization"
exercises:
  - "Use Agent Mode to complete a task that spans multiple files"
  - "Install the GitHub Copilot CLI and generate an automation script"
  - "Create an instructions file to standardize Copilot Chat responses"
---

Hands-on week: master Copilot features in the IDE (inline, chat, Plan/Edit/Agent Mode), the Copilot CLI, MCP, code review and organization policies.
```

- [ ] **Step 3: Criar Week 3 (EN)**

`src/content/track-modules-en/github-copilot-gh300/03-dados-arquitetura-prompt.md`:

```markdown
---
title: "Week 3 — Data, architecture and prompt engineering"
order: 3
duration: "~7h"
domain: "Prompt eng."
officialResources:
  - title: "GitHub Trust Center"
    description: "How Copilot works: data flow, proxy filtering and post-processing."
    url: "https://github.com/trust-center"
  - title: "Prompt engineering for Copilot Chat (docs)"
    description: "Prompt structure, context, zero-shot/few-shot and best practices."
    url: "https://docs.github.com/copilot/using-github-copilot/copilot-chat/prompt-engineering-for-copilot-chat"
complementaryResources:
  - title: "GitHub Copilot Chat Cookbook (docs)"
    description: "Ready-made prompt examples by scenario to speed up learning."
    url: "https://docs.github.com/copilot/copilot-chat-cookbook"
exercises:
  - "Rewrite a weak prompt applying explicit context and few-shot examples"
  - "Sketch the lifecycle of a code suggestion, from input to post-processing"
  - "Identify 3 LLM limitations that affect Copilot suggestions"
---

Conceptual week: understand how Copilot processes data and builds prompts, the suggestion lifecycle and the prompt engineering techniques that improve response quality.
```

- [ ] **Step 4: Criar Week 4 (EN)**

`src/content/track-modules-en/github-copilot-gh300/04-produtividade-privacidade-revisao.md`:

```markdown
---
title: "Week 4 — Productivity, privacy and final review"
order: 4
duration: "~7h"
domain: "Productivity"
officialResources:
  - title: "Developer use cases for AI with GitHub Copilot"
    description: "Code generation, refactoring and documentation; modernizing legacy code."
    url: "https://learn.microsoft.com/en-us/training/modules/developer-use-cases-for-ai-with-github-copilot/"
  - title: "Develop unit tests using GitHub Copilot tools"
    description: "Generate unit and integration tests, edge cases and assertions with Copilot."
    url: "https://learn.microsoft.com/en-us/training/modules/develop-unit-tests-using-github-copilot-tools/"
  - title: "Configure content exclusion (docs)"
    description: "Exclude files/repositories, duplication detection and safeguards."
    url: "https://docs.github.com/copilot/managing-copilot/configuring-and-auditing-content-exclusion"
complementaryResources:
  - title: "Official GH-300 practice assessment"
    description: "Official practice assessment to gauge readiness and map gaps before the exam."
    url: "https://learn.microsoft.com/en-us/credentials/certifications/github-copilot/"
exercises:
  - "Generate unit tests for an existing function and review the suggested edge cases"
  - "Configure content exclusion in a test repository"
  - "Take the official practice assessment and review the 2 lowest-scoring domains"
---

Consolidation week: use Copilot for productivity (tests, refactoring, security), configure privacy and content exclusions, and finish with the official practice assessment. Goal: score above 700 on GH-300.
```

- [ ] **Step 5: Validar o build**

Run: `npm run build`
Expected: build passa; os 4 módulos EN reconhecidos sem erro.

- [ ] **Step 6: Commit**

```bash
git add src/content/track-modules-en/github-copilot-gh300/
git commit -m "feat(trilhas): add GH-300 EN week modules"
```

---

### Task 4: Metadados da trilha AI-901

**Files:**
- Create: `src/content/tracks/ai-901-azure-ai-fundamentals.md`
- Create: `src/content/tracks-en/ai-901-azure-ai-fundamentals.md`

- [ ] **Step 1: Criar o arquivo de metadados PT**

`src/content/tracks/ai-901-azure-ai-fundamentals.md`:

```markdown
---
title: "AI-901: Azure AI Fundamentals"
description: "Cronograma de estudos para o exame AI-901 (Microsoft Azure AI Fundamentals, beta). 3 semanas, ~25 horas, com foco em conceitos de IA e implementação no Microsoft Foundry."
category: "certificação"
source: "AI-901: Azure AI Fundamentals (beta) | Microsoft"
estimatedHours: 25
domains:
  - name: "Implementar com Foundry"
    percent: 58
  - name: "Conceitos & responsabilidades"
    percent: 42
---
```

- [ ] **Step 2: Criar o arquivo de metadados EN**

`src/content/tracks-en/ai-901-azure-ai-fundamentals.md`:

```markdown
---
title: "AI-901: Azure AI Fundamentals"
description: "Study schedule for exam AI-901 (Microsoft Azure AI Fundamentals, beta). 3 weeks, ~25 hours, focused on AI concepts and implementation with Microsoft Foundry."
category: "certification"
source: "AI-901: Azure AI Fundamentals (beta) | Microsoft"
estimatedHours: 25
domains:
  - name: "Implement with Foundry"
    percent: 58
  - name: "Concepts & responsibilities"
    percent: 42
---
```

- [ ] **Step 3: Validar o build**

Run: `npm run build`
Expected: build passa; `ai-901-azure-ai-fundamentals` reconhecido nas duas variantes.

- [ ] **Step 4: Commit**

```bash
git add src/content/tracks/ai-901-azure-ai-fundamentals.md src/content/tracks-en/ai-901-azure-ai-fundamentals.md
git commit -m "feat(trilhas): add AI-901 Azure AI Fundamentals track metadata"
```

---

### Task 5: Módulos PT da trilha AI-901

**Files:**
- Create: `src/content/track-modules/ai-901-azure-ai-fundamentals/01-conceitos-ia-responsavel.md`
- Create: `src/content/track-modules/ai-901-azure-ai-fundamentals/02-apps-genai-agentes-foundry.md`
- Create: `src/content/track-modules/ai-901-azure-ai-fundamentals/03-visao-extracao-revisao.md`

- [ ] **Step 1: Criar Semana 1 (PT)**

`src/content/track-modules/ai-901-azure-ai-fundamentals/01-conceitos-ia-responsavel.md`:

```markdown
---
title: "Semana 1 — Conceitos de IA e IA Responsável"
order: 1
duration: "~8h"
domain: "Conceitos & responsabilidades"
officialResources:
  - title: "Introduction to AI in Azure (curso AI-901T00)"
    description: "Curso oficial com os conceitos fundamentais de IA e os serviços da Azure."
    url: "https://learn.microsoft.com/pt-br/training/courses/ai-901t00"
  - title: "Identificar princípios e práticas de IA responsável"
    description: "Learning path sobre os 6 princípios de IA responsável da Microsoft."
    url: "https://learn.microsoft.com/pt-br/training/paths/responsible-ai-business-principles/"
complementaryResources:
  - title: "Guia de estudos AI-901"
    description: "Study guide oficial com os domínios e pesos do exame."
    url: "https://aka.ms/AI901-StudyGuide"
  - title: "Exam sandbox AI-901"
    description: "Demo do ambiente de prova e dos tipos de questão."
    url: "https://go.microsoft.com/fwlink/?linkid=2226877"
exercises:
  - "Mapear cada um dos 6 princípios de IA responsável a um exemplo prático de aplicação"
  - "Classificar 5 cenários por tipo de carga de trabalho (GenAI, fala, visão, extração, texto)"
  - "Explicar em uma frase como um modelo de GenAI gera respostas"
---

Semana conceitual: domine os 6 princípios de IA responsável, como modelos de GenAI funcionam, como escolher um modelo e as principais cargas de trabalho de IA na Azure.
```

- [ ] **Step 2: Criar Semana 2 (PT)**

`src/content/track-modules/ai-901-azure-ai-fundamentals/02-apps-genai-agentes-foundry.md`:

```markdown
---
title: "Semana 2 — Apps GenAI e agentes no Microsoft Foundry"
order: 2
duration: "~9h"
domain: "Implementar com Foundry"
officialResources:
  - title: "Develop generative AI apps in Microsoft Foundry"
    description: "Learning path: criar prompts, fazer deploy de modelos e construir clients."
    url: "https://learn.microsoft.com/pt-br/training/paths/create-custom-copilots-ai-studio/"
  - title: "Microsoft Foundry — documentação"
    description: "Portal Foundry, deploy de modelos, Agent Service e Foundry SDK."
    url: "https://learn.microsoft.com/pt-br/azure/foundry/"
complementaryResources:
  - title: "Quickstart — Chat com um agente no Foundry"
    description: "Tutorial prático de criação e teste de um agente no portal Foundry."
    url: "https://learn.microsoft.com/pt-br/azure/foundry/quickstarts/get-started-code"
exercises:
  - "Fazer deploy de um modelo no portal Foundry e testá-lo no playground"
  - "Criar um chat client mínimo usando o Foundry SDK"
  - "Montar e testar uma solução single-agent no portal Foundry"
---

Semana prática: implemente apps de GenAI e agentes no Microsoft Foundry — system/user prompts, deploy de modelos, chat client com o SDK, single-agent e análise de texto e fala.
```

- [ ] **Step 3: Criar Semana 3 (PT)**

`src/content/track-modules/ai-901-azure-ai-fundamentals/03-visao-extracao-revisao.md`:

```markdown
---
title: "Semana 3 — Visão, extração de informação e revisão"
order: 3
duration: "~8h"
domain: "Implementar com Foundry"
officialResources:
  - title: "Azure AI Content Understanding — documentação"
    description: "Extrair informação de documentos, imagens, áudio e vídeo no Foundry Tools."
    url: "https://learn.microsoft.com/pt-br/azure/ai-services/content-understanding/"
  - title: "Computer Vision — documentação"
    description: "Interpretar input visual e gerar saídas visuais com modelos multimodais."
    url: "https://learn.microsoft.com/pt-br/azure/ai-services/computer-vision/"
complementaryResources:
  - title: "Exam sandbox AI-901"
    description: "Practice assessment ainda indisponível (exame em beta) — use a sandbox e labs do Foundry."
    url: "https://go.microsoft.com/fwlink/?linkid=2226877"
exercises:
  - "Extrair os campos de um formulário usando o Content Understanding"
  - "Gerar uma imagem a partir de um prompt com um modelo de geração de imagem"
  - "Revisar os 2 domínios e refazer os exercícios das semanas 1 e 2"
---

Semana de fechamento: visão computacional multimodal, geração de imagem e extração de informação com o Content Understanding, seguida de revisão geral. Observação: o practice assessment ainda não está disponível por ser exame em beta.
```

- [ ] **Step 4: Validar o build**

Run: `npm run build`
Expected: build passa; os 3 módulos de `ai-901-azure-ai-fundamentals` reconhecidos.

- [ ] **Step 5: Commit**

```bash
git add src/content/track-modules/ai-901-azure-ai-fundamentals/
git commit -m "feat(trilhas): add AI-901 PT week modules"
```

---

### Task 6: Módulos EN da trilha AI-901

**Files:**
- Create: `src/content/track-modules-en/ai-901-azure-ai-fundamentals/01-conceitos-ia-responsavel.md`
- Create: `src/content/track-modules-en/ai-901-azure-ai-fundamentals/02-apps-genai-agentes-foundry.md`
- Create: `src/content/track-modules-en/ai-901-azure-ai-fundamentals/03-visao-extracao-revisao.md`

> Mesmos nomes de arquivo da versão PT. Links `learn.microsoft.com` trocam `/pt-br/` por `/en-us/`.

- [ ] **Step 1: Criar Week 1 (EN)**

`src/content/track-modules-en/ai-901-azure-ai-fundamentals/01-conceitos-ia-responsavel.md`:

```markdown
---
title: "Week 1 — AI concepts and Responsible AI"
order: 1
duration: "~8h"
domain: "Concepts & responsibilities"
officialResources:
  - title: "Introduction to AI in Azure (course AI-901T00)"
    description: "Official course covering fundamental AI concepts and the Azure services."
    url: "https://learn.microsoft.com/en-us/training/courses/ai-901t00"
  - title: "Identify principles and practices for responsible AI"
    description: "Learning path on Microsoft's 6 responsible AI principles."
    url: "https://learn.microsoft.com/en-us/training/paths/responsible-ai-business-principles/"
complementaryResources:
  - title: "AI-901 study guide"
    description: "Official study guide with exam domains and weights."
    url: "https://aka.ms/AI901-StudyGuide"
  - title: "AI-901 exam sandbox"
    description: "Demo of the exam environment and question types."
    url: "https://go.microsoft.com/fwlink/?linkid=2226877"
exercises:
  - "Map each of the 6 responsible AI principles to a practical application example"
  - "Classify 5 scenarios by workload type (GenAI, speech, vision, extraction, text)"
  - "Explain in one sentence how a GenAI model generates responses"
---

Conceptual week: master the 6 responsible AI principles, how GenAI models work, how to choose a model and the main AI workloads on Azure.
```

- [ ] **Step 2: Criar Week 2 (EN)**

`src/content/track-modules-en/ai-901-azure-ai-fundamentals/02-apps-genai-agentes-foundry.md`:

```markdown
---
title: "Week 2 — GenAI apps and agents in Microsoft Foundry"
order: 2
duration: "~9h"
domain: "Implement with Foundry"
officialResources:
  - title: "Develop generative AI apps in Microsoft Foundry"
    description: "Learning path: build prompts, deploy models and build clients."
    url: "https://learn.microsoft.com/en-us/training/paths/create-custom-copilots-ai-studio/"
  - title: "Microsoft Foundry — documentation"
    description: "Foundry portal, model deployment, Agent Service and Foundry SDK."
    url: "https://learn.microsoft.com/en-us/azure/foundry/"
complementaryResources:
  - title: "Quickstart — Chat with an agent in Foundry"
    description: "Hands-on tutorial for creating and testing an agent in the Foundry portal."
    url: "https://learn.microsoft.com/en-us/azure/foundry/quickstarts/get-started-code"
exercises:
  - "Deploy a model in the Foundry portal and test it in the playground"
  - "Build a minimal chat client using the Foundry SDK"
  - "Create and test a single-agent solution in the Foundry portal"
---

Hands-on week: implement GenAI apps and agents in Microsoft Foundry — system/user prompts, model deployment, a chat client with the SDK, single-agent solutions and text and speech analysis.
```

- [ ] **Step 3: Criar Week 3 (EN)**

`src/content/track-modules-en/ai-901-azure-ai-fundamentals/03-visao-extracao-revisao.md`:

```markdown
---
title: "Week 3 — Vision, information extraction and review"
order: 3
duration: "~8h"
domain: "Implement with Foundry"
officialResources:
  - title: "Azure AI Content Understanding — documentation"
    description: "Extract information from documents, images, audio and video in Foundry Tools."
    url: "https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/"
  - title: "Computer Vision — documentation"
    description: "Interpret visual input and generate visual outputs with multimodal models."
    url: "https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/"
complementaryResources:
  - title: "AI-901 exam sandbox"
    description: "Practice assessment not yet available (beta exam) — use the sandbox and Foundry labs."
    url: "https://go.microsoft.com/fwlink/?linkid=2226877"
exercises:
  - "Extract the fields of a form using Content Understanding"
  - "Generate an image from a prompt with an image-generation model"
  - "Review the 2 domains and redo the exercises from weeks 1 and 2"
---

Wrap-up week: multimodal computer vision, image generation and information extraction with Content Understanding, followed by a general review. Note: the practice assessment is not yet available because the exam is in beta.
```

- [ ] **Step 4: Validar o build**

Run: `npm run build`
Expected: build passa; os 3 módulos EN reconhecidos.

- [ ] **Step 5: Commit**

```bash
git add src/content/track-modules-en/ai-901-azure-ai-fundamentals/
git commit -m "feat(trilhas): add AI-901 EN week modules"
```

---

### Task 7: Verificação final de renderização

**Files:** nenhum (verificação).

- [ ] **Step 1: Build de produção limpo**

Run: `npm run build`
Expected: build conclui sem erro; sem warnings de content collection para as duas trilhas.

- [ ] **Step 2: Conferir as duas trilhas no dev server**

Run: `npm run dev` e abrir no navegador:
- `http://localhost:4321/trilhas` → as duas novas trilhas aparecem na listagem junto da CCA Foundation.
- `http://localhost:4321/trilhas/github-copilot-gh300` → 4 semanas em ordem, domínios com percentuais, recursos e exercícios renderizados.
- `http://localhost:4321/trilhas/ai-901-azure-ai-fundamentals` → 3 semanas em ordem.
- `http://localhost:4321/en/tracks` → as duas trilhas em inglês.
- `http://localhost:4321/en/tracks/github-copilot-gh300` e `/en/tracks/ai-901-azure-ai-fundamentals` → conteúdo EN.

Expected: todas as páginas renderizam sem erro; semanas na ordem correta (1→N); barra de domínios soma 100%.

- [ ] **Step 3: Conferir os links oficiais (amostra)**

Abrir 2–3 links oficiais de cada trilha e confirmar que resolvem (sem 404). Caso algum path `learn.microsoft.com` redirecione, atualizar a URL no arquivo correspondente (PT e EN) e refazer `npm run build`.

- [ ] **Step 4: Commit final (se houve ajuste de URL no Step 3)**

```bash
git add src/content/
git commit -m "fix(trilhas): correct official resource URLs"
```

---

## Notas de execução

- **YAGNI:** sem mudanças de UI, componentes, badges ou quizzes. Só conteúdo.
- **DRY:** os arquivos EN espelham os PT em nome e estrutura; só o texto e o segmento de locale dos links MS mudam.
- **Sincronização PT/EN:** obrigatória (CLAUDE.md). Nunca commitar uma versão sem a outra.
- **Não dar `git push`** — o usuário revisa e publica (deploy automático Vercel no push).
```

