# Design — Trilhas GitHub Copilot (GH-300) e AI-901

Data: 2026-06-14

## Objetivo

Adicionar duas novas trilhas de estudo ao site, seguindo exatamente o modelo da trilha existente `cca-foundation`. As trilhas cobrem:

1. **GitHub Copilot (GH-300)** — certificação GitHub Copilot
2. **AI-901** — Microsoft Azure AI Fundamentals (beta)

## Decisões de design (do brainstorming)

- **Formato:** "Semana N — ..." como na CCA, porém mais enxuto por serem fundamentals.
- **Tamanho:** GH-300 = 4 semanas (~30h). AI-901 = 3 semanas (~25h).
- **Idioma dos links:** versão PT usa `learn.microsoft.com/pt-br/...`; versão EN usa `/en-us/...`.
- **Sincronização PT/EN obrigatória** (regra do CLAUDE.md): corpo e exercícios traduzidos.

## Arquitetura

Nenhuma mudança de código, schema ou páginas. As páginas `/trilhas`, `/trilhas/[slug]`, `/en/tracks`, `/en/tracks/[slug]` já renderizam qualquer item dos collections `tracks` / `track-modules`. Só criamos conteúdo.

Schema relevante (`src/content/config.ts`, já existente):

- `tracks` → `title, description, category, source, estimatedHours, domains[]{name, percent}`
- `track-modules` → `title, order, duration?, domain?, officialResources[]?, complementaryResources[]?, exercises[]?` + corpo Markdown. `.passthrough()`.

Arquivos a criar por trilha:

| Caminho | Conteúdo |
|---|---|
| `src/content/tracks/<slug>.md` | metadados PT |
| `src/content/tracks-en/<slug>.md` | metadados EN |
| `src/content/track-modules/<slug>/NN-*.md` | módulos PT (1 por semana) |
| `src/content/track-modules-en/<slug>/NN-*.md` | módulos EN (1 por semana) |

Cada `resourceItem` = `{ title, description, url }`.

---

## Trilha 1 — GitHub Copilot (GH-300)

- **slug:** `github-copilot-gh300`
- **category:** `"certificação"`
- **source:** `"GitHub Copilot (GH-300) | Microsoft / GitHub"`
- **estimatedHours:** 30
- **domains** (pesos normalizados a partir dos oficiais; soma 100):
  - Recursos do Copilot — 28
  - Uso responsável — 18
  - Prompt eng. — 14
  - Privacidade — 14
  - Produtividade — 13
  - Dados & arquitetura — 13

Domínios oficiais GH-300 (referência): Use responsibly (15–20%), Use features (25–30%), Data & architecture (10–15%), Prompt engineering & context crafting (10–15%), Developer productivity (10–15%), Privacy/content exclusions/safeguards (10–15%). Exame: 100 min, nota 700.

### Módulos

**Semana 1 — Fundamentos, planos e uso responsável** · order 1 · ~7h · domain "Uso responsável"
- Conteúdo: o que é o GitHub Copilot; planos (Free/Pro/Business/Enterprise) e recursos por plano; princípios de IA responsável; riscos e limitações de GenAI; necessidade de validar output; operar o Copilot com responsabilidade.
- officialResources:
  - GitHub Copilot Fundamentals Part 1 — `/training/paths/copilot/`
  - Responsible AI with GitHub Copilot (módulo) — `/training/modules/responsible-ai-with-github-copilot/`
  - GitHub Copilot plans and features (docs) — `https://docs.github.com/copilot/about-github-copilot/plans-for-github-copilot`
- complementaryResources: GH-300 study guide (`https://aka.ms/GH300-StudyGuide`); Exam sandbox (`https://aka.ms/GHExamDemo-enu`).
- exercises: comparar recursos entre planos; listar 3 riscos de GenAI e mitigações; ativar o Copilot na sua IDE.

**Semana 2 — Recursos no IDE, CLI e Agent Mode** · order 2 · ~9h · domain "Recursos do Copilot"
- Conteúdo: inline suggestions, chat, Plan Mode; Copilot CLI (instalação, comandos, sessões); Agent Mode, Edit Mode, MCP, sub-agents; code review com Copilot; Spaces, Spark, PR summaries, instruction/prompt files; políticas de organização, audit log, REST API de subscriptions.
- officialResources:
  - GitHub Copilot Fundamentals Part 2 — `/training/paths/gh-copilot-2/`
  - GitHub Copilot CLI / Agent Mode (docs github.com)
- complementaryResources: docs de organization policies; Copilot Chat cookbook.
- exercises: usar Agent Mode para uma tarefa multi-arquivo; gerar um script via Copilot CLI; criar um instructions file.

**Semana 3 — Dados, arquitetura e prompt engineering** · order 3 · ~7h · domain "Prompt eng."
- Conteúdo: uso/fluxo/compartilhamento de dados; processamento de input e construção do prompt; proxy filtering e pós-processamento; ciclo de vida da sugestão; limitações de LLMs; estrutura de prompt e contexto; zero-shot/few-shot; boas práticas; uso do histórico de chat.
- officialResources:
  - How GitHub Copilot works / Trust Center — `https://github.com/trust-center`
  - Prompt engineering for Copilot Chat (docs) — `https://docs.github.com/copilot/using-github-copilot/copilot-chat/prompt-engineering-for-copilot-chat`
- exercises: reescrever um prompt fraco aplicando contexto e few-shot; desenhar o ciclo de vida de uma sugestão.

**Semana 4 — Produtividade, privacidade e revisão final** · order 4 · ~7h · domain "Produtividade"
- Conteúdo: geração/refactor/documentação de código; geração de testes unitários e de integração, edge cases, asserts; sugestões de segurança e performance; content exclusions e configurações de editor; ownership/limitações de output; detecção de duplicação e avisos de segurança; troubleshooting; revisão geral + practice assessment.
- officialResources:
  - Developer use cases for AI with GitHub Copilot — `/training/modules/developer-use-cases-for-ai-with-github-copilot/`
  - Develop unit tests using GitHub Copilot tools — `/training/modules/develop-unit-tests-using-github-copilot-tools/`
  - Configuring content exclusion (docs) — `https://docs.github.com/copilot/managing-copilot/configuring-and-auditing-content-exclusion`
- complementaryResources: Practice assessment oficial GH-300 (na página da certificação).
- exercises: gerar testes para uma função existente; configurar content exclusion num repo; fazer o practice assessment e mapear lacunas.

---

## Trilha 2 — AI-901 Azure AI Fundamentals (beta)

- **slug:** `ai-901-azure-ai-fundamentals`
- **category:** `"certificação"`
- **source:** `"AI-901: Azure AI Fundamentals (beta) | Microsoft"`
- **estimatedHours:** 25
- **domains** (oficiais):
  - Implementar com Microsoft Foundry — 58
  - Conceitos & responsabilidades de IA — 42

Domínios oficiais AI-901 (skills measured de 15 abr 2026): Identify AI concepts and capabilities (40–45%); Implement AI solutions by using Microsoft Foundry (55–60%). Nota 700. Exame em beta — practice assessment ainda indisponível.

### Módulos

**Semana 1 — Conceitos de IA e IA Responsável** · order 1 · ~8h · domain "Conceitos & responsabilidades"
- Conteúdo: 6 princípios de IA responsável (fairness, reliability & safety, privacy & security, inclusiveness, transparency, accountability); como modelos de GenAI funcionam; identificar modelo apropriado por capacidade; opções de deploy e parâmetros; cargas de trabalho de IA (GenAI, agentic, análise de texto, fala, visão computacional, extração de informação); técnicas de análise de texto (keyword extraction, entity detection, sentiment, summarization).
- officialResources:
  - AI technical concepts (learning path) — `/training/paths/...` (learn.ai-technical-concepts)
  - Curso AI-901T00 — Introduction to AI in Azure — `/training/courses/ai-901t00`
- complementaryResources: AI-901 study guide (`https://aka.ms/AI901-StudyGuide`); Exam sandbox (`https://aka.ms/examdemo`).
- exercises: mapear cada princípio de IA responsável a um exemplo prático; classificar 5 cenários por tipo de carga de trabalho.

**Semana 2 — Apps GenAI e agentes no Microsoft Foundry** · order 2 · ~9h · domain "Implementar com Foundry"
- Conteúdo: criar system/user prompts eficazes; deploy de modelo e interação no portal Foundry; chat client leve com Foundry SDK; criar e testar solução single-agent no portal; client app leve para um agente; análise de texto e resposta a prompts falados com modelo multimodal; Azure Speech no Foundry Tools.
- officialResources:
  - Get started with AI apps and agents (learning path) — learn.wwl.get-started-ai-apps-agents
  - Azure AI Foundry docs — `/azure/ai-foundry/`
- exercises: fazer deploy de um modelo no Foundry portal e testar no playground; criar um chat client mínimo com o Foundry SDK; montar um agente single-agent.

**Semana 3 — Visão, extração de informação e revisão** · order 3 · ~8h · domain "Implementar com Foundry"
- Conteúdo: interpretar input visual com modelo multimodal; gerar outputs visuais com modelos generativos; app leve com visão; Content Understanding para extrair info de documentos/formulários, imagens, áudio e vídeo; app leve de extração de informação; revisão geral.
- officialResources:
  - Azure AI Content Understanding docs — `/azure/ai-services/content-understanding/`
  - Computer vision no Foundry (docs)
- complementaryResources: Exam sandbox AI-901. **Nota:** practice assessment indisponível (beta) → foco em labs do Foundry.
- exercises: extrair campos de um formulário com Content Understanding; gerar uma imagem com modelo generativo; revisar os 2 domínios e refazer exercícios das semanas 1–2.

---

## Detalhes de execução

- Validar URLs oficiais durante a implementação (alguns aka.ms/paths podem mudar; confirmar antes de gravar).
- Após criar os arquivos: `npm run build` deve passar (validação do content collection schema). Conferir que as duas trilhas aparecem em `/trilhas` e `/en/tracks`.
- Manter o tom e o nível de detalhe dos módulos da CCA (corpo curto de 1–2 frases por módulo + frontmatter rico).

## Fora de escopo (YAGNI)

- Sem mudanças de UI/layout/componentes.
- Sem badges, progresso persistente ou quizzes interativos.
- Sem novas categorias além de "certificação".
