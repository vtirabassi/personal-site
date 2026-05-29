# Trilhas — Resource Checklist & Domain Breakdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace week-level completion with per-resource checkboxes, separate official Anthropic resources from complementary ones, and add exam domain breakdown below the progress bar.

**Architecture:** Five sequential tasks — (1) update the progress lib (TDD), (2) update content schema, (3) migrate CCA Foundation markdown files, (4) rewrite the track detail page UI and script, (5) update the listing page. Each task is self-contained and commitable.

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS, Vitest, localStorage

---

## File Map

| File | Change |
|------|--------|
| `src/lib/track-progress.ts` | Replace `completedModules`/`markModuleComplete`/`getCompletedModules` with `completedResources`/`toggleResourceComplete`/`getCompletedResources` |
| `tests/track-progress.test.ts` | Replace all tests to match new API |
| `src/content/config.ts` | Replace `resources` with `officialResources`+`complementaryResources`; add `domains` to tracks |
| `src/content/tracks/cca-foundation.md` | Add `domains` array |
| `src/content/track-modules/cca-foundation/*.md` (8 files) | Replace `resources` with `officialResources`+`complementaryResources` (with descriptions) |
| `src/pages/trilhas/[slug].astro` | New module UI, new JS, domain section, updated data attrs |
| `src/pages/trilhas/index.astro` | Use `resourceCount` instead of `moduleCount`; use `getCompletedResources` |

---

### Task 1: Update track-progress.ts

**Files:**
- Modify: `src/lib/track-progress.ts`
- Modify: `tests/track-progress.test.ts`

- [ ] **Step 1: Replace tests with failing tests for new API**

Replace the entire `tests/track-progress.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCompletedResources, toggleResourceComplete, calcProgressPercent } from '../src/lib/track-progress';

const store: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem:    (k: string) => store[k] ?? null,
  setItem:    (k: string, v: string) => { store[k] = v; },
  clear:      () => { Object.keys(store).forEach(k => delete store[k]); },
  removeItem: (k: string) => { delete store[k]; },
});

describe('getCompletedResources', () => {
  beforeEach(() => localStorage.clear());

  it('returns empty array when no data exists', () => {
    expect(getCompletedResources('unknown-track')).toEqual([]);
  });

  it('returns the completedResources array for a known slug', () => {
    localStorage.setItem('track-progress-my-track', JSON.stringify({
      completedResources: ['1-0', '1-1', '2-0'],
      lastUpdated: 0,
    }));
    expect(getCompletedResources('my-track')).toEqual(['1-0', '1-1', '2-0']);
  });

  it('returns empty array when stored JSON is malformed', () => {
    localStorage.setItem('track-progress-bad', 'not-valid-json');
    expect(getCompletedResources('bad')).toEqual([]);
  });

  it('returns empty array when completedResources field is missing', () => {
    localStorage.setItem('track-progress-empty', JSON.stringify({ lastUpdated: 0 }));
    expect(getCompletedResources('empty')).toEqual([]);
  });
});

describe('toggleResourceComplete', () => {
  beforeEach(() => localStorage.clear());

  it('adds a resource ID when not yet completed', () => {
    toggleResourceComplete('my-track', '1-0');
    expect(getCompletedResources('my-track')).toContain('1-0');
  });

  it('removes a resource ID when already completed (toggle off)', () => {
    toggleResourceComplete('my-track', '1-0');
    toggleResourceComplete('my-track', '1-0');
    expect(getCompletedResources('my-track')).not.toContain('1-0');
  });

  it('does not duplicate IDs', () => {
    toggleResourceComplete('my-track', '2-1');
    toggleResourceComplete('my-track', '2-1');
    toggleResourceComplete('my-track', '2-1');
    expect(getCompletedResources('my-track').filter(id => id === '2-1').length).toBe(1);
  });

  it('writes a lastUpdated timestamp', () => {
    const before = Date.now();
    toggleResourceComplete('my-track', '3-0');
    const raw = JSON.parse(localStorage.getItem('track-progress-my-track')!);
    expect(raw.lastUpdated).toBeGreaterThanOrEqual(before);
  });

  it('can track multiple resources independently', () => {
    toggleResourceComplete('my-track', '1-0');
    toggleResourceComplete('my-track', '1-1');
    toggleResourceComplete('my-track', '2-0');
    expect(getCompletedResources('my-track')).toEqual(expect.arrayContaining(['1-0', '1-1', '2-0']));
    expect(getCompletedResources('my-track')).toHaveLength(3);
  });
});

describe('calcProgressPercent', () => {
  it('returns 0 when totalCount is 0', () => {
    expect(calcProgressPercent(0, 0)).toBe(0);
  });

  it('returns 100 when all resources are complete', () => {
    expect(calcProgressPercent(18, 18)).toBe(100);
  });

  it('returns a rounded percentage', () => {
    expect(calcProgressPercent(3, 8)).toBe(38);
  });

  it('returns 0 when no resources are complete', () => {
    expect(calcProgressPercent(0, 18)).toBe(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: many failures (`getCompletedResources is not a function`, etc.)

- [ ] **Step 3: Replace src/lib/track-progress.ts**

```ts
export interface TrackProgress {
  completedResources: string[];
  lastUpdated: number;
}

export function getCompletedResources(slug: string): string[] {
  try {
    const raw = localStorage.getItem(`track-progress-${slug}`);
    if (!raw) return [];
    const data = JSON.parse(raw) as TrackProgress;
    return Array.isArray(data.completedResources) ? data.completedResources : [];
  } catch {
    return [];
  }
}

export function toggleResourceComplete(slug: string, resourceId: string): void {
  const completed = getCompletedResources(slug);
  const idx = completed.indexOf(resourceId);
  const next = idx === -1 ? [...completed, resourceId] : completed.filter(id => id !== resourceId);
  const data: TrackProgress = { completedResources: next, lastUpdated: Date.now() };
  localStorage.setItem(`track-progress-${slug}`, JSON.stringify(data));
}

export function calcProgressPercent(completedCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return Math.round((completedCount / totalCount) * 100);
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: all tests pass

- [ ] **Step 5: Commit**

```bash
git add src/lib/track-progress.ts tests/track-progress.test.ts
git commit -m "feat: replace module-level progress with resource-level checklist"
```

---

### Task 2: Update content schema

**Files:**
- Modify: `src/content/config.ts`

- [ ] **Step 1: Replace config.ts**

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

const resourceItem = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string(),
});

const tracks = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    source: z.string(),
    estimatedHours: z.number(),
    domains: z.array(z.object({ name: z.string(), percent: z.number() })).optional(),
  }),
});

const trackModules = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number(),
    duration: z.string().optional(),
    domain: z.string().optional(),
    officialResources: z.array(resourceItem).optional(),
    complementaryResources: z.array(resourceItem).optional(),
    exercises: z.array(z.string()).optional(),
  }).passthrough(),
});

export const collections = { blog, tracks, 'track-modules': trackModules };
```

- [ ] **Step 2: Verify build compiles without errors**

```bash
npm run build 2>&1 | tail -20
```

Expected: build succeeds (some type warnings about old content files are OK — we'll fix those in Task 3)

- [ ] **Step 3: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: update content schema for resource-level checklist and domains"
```

---

### Task 3: Migrate CCA Foundation content

**Files:**
- Modify: `src/content/tracks/cca-foundation.md`
- Modify: `src/content/track-modules/cca-foundation/01-fundamentos-api.md`
- Modify: `src/content/track-modules/cca-foundation/02-prompt-engineering.md`
- Modify: `src/content/track-modules/cca-foundation/03-claude-code-pratica.md`
- Modify: `src/content/track-modules/cca-foundation/04-claude-code-avancado.md`
- Modify: `src/content/track-modules/cca-foundation/05-mcp-tool-design.md`
- Modify: `src/content/track-modules/cca-foundation/06-arquitetura-agentica.md`
- Modify: `src/content/track-modules/cca-foundation/07-context-evals.md`
- Modify: `src/content/track-modules/cca-foundation/08-revisao-final.md`

- [ ] **Step 1: Update cca-foundation.md**

Replace the entire file:

```markdown
---
title: "CCA Foundation"
description: "Cronograma de estudos para a certificação Claude Certified Architect — Foundations da Anthropic. 8 semanas, ~80 horas."
category: "certificação"
source: "Anthropic"
estimatedHours: 80
domains:
  - name: "Agentic"
    percent: 27
  - name: "Claude Code"
    percent: 20
  - name: "Prompt eng."
    percent: 20
  - name: "MCP & tools"
    percent: 18
  - name: "Context"
    percent: 15
---
```

- [ ] **Step 2: Update 01-fundamentos-api.md**

Replace the frontmatter (keep the body text unchanged):

```markdown
---
title: "Semana 1 — Fundamentos e API"
order: 1
duration: "~8h"
domain: "Prompt Engineering"
officialResources:
  - title: "Claude 101"
    description: "Modelos disponíveis, system prompts, limites de contexto e comportamento base do Claude."
    url: "https://anthropic.skilljar.com/claude-101"
  - title: "Building with the Claude API"
    description: "Autenticação, chamadas básicas, streaming e roles (user/assistant/system)."
    url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api"
complementaryResources:
  - title: "GitHub Study Guide (paullarionov)"
    description: "Guia de estudos com exercícios práticos cobrindo os 5 domínios do exame."
    url: "https://github.com/paullarionov/claude-certified-architect"
  - title: "Complete Study Guide with Tutor Prompts (Medium)"
    description: "Guia completo com tutor prompts por domínio para usar o Claude como mentor interativo."
    url: "https://medium.com/data-science-collective/the-complete-claude-architect-study-guide-with-code-and-tutor-prompts-01f524e95c92"
exercises:
  - "Criar uma conta no Anthropic Console e fazer a primeira chamada à API via curl"
  - "Explorar os parâmetros temperature, max_tokens e system prompt"
  - "Implementar um script básico de chamada à API em Python ou TypeScript"
---

Semana introdutória: entenda o modelo Claude, a API REST e os principais parâmetros de configuração antes de avançar para técnicas mais sofisticadas.
```

- [ ] **Step 3: Update 02-prompt-engineering.md**

```markdown
---
title: "Semana 2 — Prompt Engineering e Structured Output"
order: 2
duration: "~9h"
domain: "Prompt Engineering"
officialResources:
  - title: "Building with the Claude API (módulos avançados)"
    description: "Técnicas avançadas de prompting, XML tags, chain-of-thought e controle de output."
    url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api"
  - title: "Tool Use — documentação oficial"
    description: "Como definir e usar tools para extrair dados estruturados e interagir com sistemas externos."
    url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use"
complementaryResources:
  - title: "Exercícios de structured output (GitHub)"
    description: "Exemplos práticos e exercícios de extração de dados estruturados com o Claude."
    url: "https://github.com/paullarionov/claude-certified-architect/blob/main/guide_en.MD"
exercises:
  - "Implementar chain-of-thought prompting em 3 problemas diferentes"
  - "Usar tool use para extrair dados estruturados de texto livre"
  - "Comparar outputs com e sem XML tags no system prompt"
---

Foco em técnicas de engenharia de prompt e extração de dados estruturados — competências centrais do exame.
```

- [ ] **Step 4: Update 03-claude-code-pratica.md**

```markdown
---
title: "Semana 3 — Claude Code na Prática"
order: 3
duration: "~9h"
domain: "Claude Code"
officialResources:
  - title: "Claude Code 101"
    description: "Instalação, configuração e primeiros passos com o Claude Code CLI."
    url: "https://anthropic.skilljar.com/claude-code-101"
  - title: "Claude Code in Action"
    description: "Uso prático do Claude Code em projetos reais — fluxos de trabalho e boas práticas."
    url: "https://anthropic.skilljar.com/claude-code-in-action"
  - title: "Claude Code — documentação oficial"
    description: "Referência completa: hooks, slash commands, configuração e integração com IDEs."
    url: "https://docs.anthropic.com/en/docs/claude-code"
  - title: "Introduction to Agent Skills"
    description: "Como criar e publicar skills personalizados para o Claude Code."
    url: "https://anthropic.skilljar.com/introduction-to-agent-skills"
complementaryResources:
  - title: "Claude Code — Coursera/Vanderbilt"
    description: "Curso prático de Claude Code com projetos guiados."
    url: "https://www.coursera.org/learn/claude-code"
exercises:
  - "Instalar e configurar Claude Code localmente"
  - "Usar Claude Code para refatorar um projeto existente revisando cada mudança"
  - "Criar um skill personalizado e testá-lo via slash command"
---

Claude Code como ferramenta de desenvolvimento assistido por IA — instalação, uso cotidiano e personalização via skills.
```

- [ ] **Step 5: Update 04-claude-code-avancado.md**

```markdown
---
title: "Semana 4 — Claude Code Avançado + Subagents"
order: 4
duration: "~8h"
domain: "Claude Code / Agentic"
officialResources:
  - title: "Introduction to Subagents"
    description: "Padrões de orquestração com subagentes — delegação, paralelismo e coordenação."
    url: "https://anthropic.skilljar.com/introduction-to-subagents"
  - title: "Claude Code — documentação oficial"
    description: "Configuração avançada: hooks de pre/post tool call, permissões e automação de workflows."
    url: "https://docs.anthropic.com/en/docs/claude-code"
complementaryResources:
  - title: "Agent SDK Cheat Sheet (Tutorials Dojo)"
    description: "Referência rápida do Agent SDK com exemplos de código e padrões comuns."
    url: "https://tutorialsdojo.com/claude-agent-sdk/"
exercises:
  - "Implementar um workflow com subagentes usando o Agent SDK"
  - "Configurar hooks de pre/post tool call no Claude Code"
  - "Criar um agente que delega subtarefas a subagentes especializados"
---

Orquestração de subagentes e configuração avançada do Claude Code — tópico com peso relevante no domínio Agentic.
```

- [ ] **Step 6: Update 05-mcp-tool-design.md**

```markdown
---
title: "Semana 5 — MCP e Tool Design"
order: 5
duration: "~10h"
domain: "MCP & Tools"
officialResources:
  - title: "Introduction to Model Context Protocol"
    description: "Fundamentos do MCP — arquitetura, tipos de server e casos de uso."
    url: "https://anthropic.skilljar.com/introduction-to-model-context-protocol"
  - title: "Tool Use — documentação oficial"
    description: "Design de tools eficientes — schemas, descriptions e boas práticas de integração."
    url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use"
  - title: "MCP Build Guide (oficial)"
    description: "Guia prático para construir um servidor MCP do zero com suporte a resources e tools."
    url: "https://modelcontextprotocol.io/docs/develop/build-server"
complementaryResources:
  - title: "MCP: Build Rich Context AI Apps (DeepLearning.AI)"
    description: "Curso prático de construção de aplicações com MCP e a API Anthropic."
    url: "https://www.deeplearning.ai/courses/mcp-build-rich-context-ai-apps-with-anthropic"
  - title: "Hugging Face MCP Course"
    description: "Curso introdutório ao MCP com exemplos interativos e exercícios práticos."
    url: "https://huggingface.co/learn/mcp-course/en/unit0/introduction"
exercises:
  - "Construir um servidor MCP simples com 2-3 tools customizados"
  - "Conectar o servidor MCP ao Claude Code e testar as tools"
  - "Implementar um resource server MCP que expõe dados de uma API externa"
---

Model Context Protocol: como expor ferramentas e contexto ao Claude de forma estruturada e reutilizável.
```

- [ ] **Step 7: Update 06-arquitetura-agentica.md**

```markdown
---
title: "Semana 6 — Arquitetura Agêntica e Orquestração"
order: 6
duration: "~10h"
domain: "Agentic (27%)"
officialResources:
  - title: "MCP Advanced Topics"
    description: "Tópicos avançados de MCP — sampling, autenticação e padrões de composição."
    url: "https://anthropic.skilljar.com/model-context-protocol-advanced-topics"
  - title: "Agents & Tools — documentação oficial"
    description: "Padrões de arquitetura agêntica — orchestration, memory e design de sistemas confiáveis."
    url: "https://docs.anthropic.com/en/docs/agents-and-tools"
complementaryResources:
  - title: "Building AI Agents with Claude Agent SDK (KodeKloud)"
    description: "Curso prático de construção de agentes com o Claude Agent SDK."
    url: "https://kodekloud.com/courses/learn-by-doing-building-ai-agents-with-claude-agent-sdk/"
  - title: "Build an AI Agent with Claude Agent SDK (SerpAPI)"
    description: "Tutorial passo a passo de um agente real com integração à API do SerpAPI."
    url: "https://serpapi.com/blog/build-an-ai-agent-with-claude-agent-sdk/"
exercises:
  - "Projetar a arquitetura de um agente multi-step para um problema real"
  - "Implementar memory e context management em um agente"
  - "Criar um orquestrador que coordena agents especializados em paralelo"
---

O domínio Agentic vale 27% do exame — foco em padrões de arquitetura, orquestração e design de sistemas confiáveis.
```

- [ ] **Step 8: Update 07-context-evals.md**

```markdown
---
title: "Semana 7 — Context, Evals e Reliability"
order: 7
duration: "~9h"
domain: "Context (15%) / Evals"
officialResources:
  - title: "Prompt Engineering — documentação oficial"
    description: "Context management: caching, context windows e otimização de tokens em conversas longas."
    url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering"
  - title: "Develop Tests — documentação oficial"
    description: "Como construir eval suites, métricas de qualidade e pipelines de teste automatizado."
    url: "https://docs.anthropic.com/en/docs/build-with-claude/develop-tests"
complementaryResources:
  - title: "Practice Questions (claudecertifications.com)"
    description: "Banco de questões no estilo do exame para testar o conhecimento por domínio."
    url: "https://claudecertifications.com/claude-certified-architect/practice-questions"
  - title: "Exam Guide (claudecertifications.com)"
    description: "Guia oficial do exame com objetivos de aprendizado e pesos por domínio."
    url: "https://claudecertifications.com/claude-certified-architect/exam-guide"
  - title: "Community Exam Guide (GitHub)"
    description: "Guia colaborativo da comunidade com dicas de quem já fez o exame."
    url: "https://github.com/daronyondem/claude-architect-exam-guide"
exercises:
  - "Implementar um eval suite automatizado para um prompt crítico"
  - "Medir e otimizar o uso do context window em conversas longas"
  - "Resolver 25 questões práticas e revisar os erros"
---

Gestão de contexto e avaliação de qualidade — como garantir que sistemas com Claude funcionem de forma consistente e mensurável.
```

- [ ] **Step 9: Update 08-revisao-final.md**

```markdown
---
title: "Semana 8 — Revisão Final e Simulados"
order: 8
duration: "~9h"
domain: "Revisão Geral"
officialResources:
  - title: "Anthropic Academy — simulado oficial"
    description: "Revisão dos 5 domínios via simulados e exercícios na plataforma oficial da Anthropic."
    url: "https://anthropic.skilljar.com"
complementaryResources:
  - title: "Study Guide completo (GitHub)"
    description: "Guia de estudos completo com questões e exemplos de código por domínio."
    url: "https://github.com/paullarionov/claude-certified-architect/blob/main/guide_en.MD"
  - title: "Agent SDK Cheat Sheet (Tutorials Dojo)"
    description: "Referência rápida do Agent SDK para revisão dos conceitos de orquestração."
    url: "https://tutorialsdojo.com/claude-agent-sdk/"
  - title: "25 Practice Questions"
    description: "Set de 25 questões práticas para simular a prova final."
    url: "https://claudecertifications.com/claude-certified-architect/practice-questions"
  - title: "CertificationPractice — simulado completo"
    description: "Simulado completo com cronômetro e feedback detalhado por questão."
    url: "https://certificationpractice.com/practice-exams/anthropic-claude-certified-architect-foundations"
exercises:
  - "Fazer o simulado completo no CertificationPractice e identificar pontos fracos"
  - "Revisar os 2 domínios com menor pontuação nos simulados"
  - "Refazer as 25 questões práticas visando 100% de acerto"
---

Semana de consolidação. Meta: atingir >900/1000 no exame. Foque nas lacunas identificadas nos simulados anteriores.
```

- [ ] **Step 10: Verify build is clean**

```bash
npm run build 2>&1 | tail -20
```

Expected: build succeeds, routes `/trilhas` and `/trilhas/cca-foundation` pre-rendered

- [ ] **Step 11: Commit**

```bash
git add src/content/tracks/cca-foundation.md src/content/track-modules/cca-foundation/
git commit -m "feat: migrate CCA Foundation modules to officialResources/complementaryResources schema"
```

---

### Task 4: Update [slug].astro

**Files:**
- Modify: `src/pages/trilhas/[slug].astro`

The total official resources across all 8 modules is 18 (2+2+4+2+3+2+2+1).

- [ ] **Step 1: Replace the entire file**

```astro
---
import { getCollection, getEntry, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProgressBar from '../../components/ProgressBar.astro';

export const prerender = true;

export async function getStaticPaths() {
  const tracks = await getCollection('tracks');
  return tracks.map(track => ({ params: { slug: track.slug } }));
}

const { slug } = Astro.params;
const track = await getEntry('tracks', slug!);
if (!track) return Astro.redirect('/trilhas');

const slugPrefix = slug + '/';
const modules = (await getCollection('track-modules', ({ id }) => id.startsWith(slugPrefix)))
  .sort((a, b) => a.data.order - b.data.order);

const categoryColors: Record<string, string> = {
  'certificação': 'bg-apple-blue/10 text-apple-blue dark:bg-apple-blue/20 dark:text-apple-blue-dark',
  'engenharia':   'bg-[#34c759]/10 text-[#1a7a33] dark:bg-[#34c759]/20 dark:text-[#34c759]',
  'produto':      'bg-[#ff9500]/10 text-[#8a5100] dark:bg-[#ff9500]/20 dark:text-[#ff9500]',
};
const tagClass = categoryColors[track.data.category] ?? 'bg-apple-parchment text-apple-ink-48 dark:bg-[#2c2c2e] dark:text-[#98989d]';

const totalResources = modules.reduce((sum, mod) => {
  return sum + ((mod.data.officialResources as any[] | undefined)?.length ?? 0);
}, 0);

const moduleResourceCounts: Record<string, number> = {};
for (const mod of modules) {
  moduleResourceCounts[String(mod.data.order)] =
    (mod.data.officialResources as any[] | undefined)?.length ?? 0;
}

const renderedModules = await Promise.all(
  modules.map(async (mod) => {
    const { Content } = await render(mod);
    return { mod, Content };
  })
);
---

<BaseLayout title={track.data.title + ' — Trilhas'} description={track.data.description}>

  <!-- Breadcrumb + header -->
  <div class="mb-10">
    <a href="/trilhas" class="text-apple-caption text-apple-ink-48 dark:text-[#98989d] hover:text-apple-blue dark:hover:text-apple-blue-dark transition-colors inline-block mb-4">
      ← Trilhas
    </a>
    <div class="flex items-start justify-between gap-4 mb-4">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class={'text-apple-nav font-medium px-2 py-0.5 rounded-full uppercase tracking-wide ' + tagClass}>
            {track.data.category}
          </span>
        </div>
        <h1 class="text-apple-display font-semibold text-apple-ink dark:text-[#f5f5f7] mb-1">
          {track.data.title}
        </h1>
        <p class="text-apple-body text-apple-ink-48 dark:text-[#98989d]">
          {track.data.source} · ~{track.data.estimatedHours}h ·
          <span id="modules-progress-text">0 de {totalResources} recursos</span>
        </p>
      </div>
      <span id="track-pct" class="text-apple-tagline font-semibold text-apple-blue dark:text-apple-blue-dark shrink-0 mt-1 hidden">
        0%
      </span>
    </div>
    <ProgressBar percent={0} id="track-progress-bar" />

    {track.data.domains && (track.data.domains as any[]).length > 0 && (
      <p class="text-apple-caption text-apple-ink-48 dark:text-[#98989d] mt-2">
        {'Domínios: ' + (track.data.domains as any[]).map((d: any) => d.name + ' ' + d.percent + '%').join(' · ')}
      </p>
    )}
  </div>

  <!-- Modules list -->
  <div
    id="track-page"
    data-slug={slug}
    data-total-resources={totalResources}
    data-module-resource-counts={JSON.stringify(moduleResourceCounts)}
    class="flex flex-col gap-3"
  >
    {renderedModules.map(({ mod, Content }) => (
      <div
        data-module
        data-order={mod.data.order}
        id={'module-' + mod.data.order}
        class="border border-apple-hairline dark:border-[#3a3a3c] rounded-apple-lg overflow-hidden transition-colors duration-200"
      >
        <!-- Module header -->
        <button
          class="w-full flex items-center gap-3 p-4 text-left hover:bg-apple-parchment dark:hover:bg-[#2c2c2e] transition-colors"
          onclick={'window.__toggleModule(' + mod.data.order + ')'}
        >
          <div
            id={'indicator-' + mod.data.order}
            class="w-4 h-4 rounded-full border border-apple-hairline bg-apple-divider dark:bg-[#3a3a3c] flex-shrink-0"
          />
          <div class="flex-1 min-w-0">
            <p class="text-apple-body font-medium text-apple-ink dark:text-[#f5f5f7]">
              {mod.data.title}
            </p>
            {(mod.data.duration || mod.data.domain) && (
              <p class="text-apple-caption text-apple-ink-48 dark:text-[#98989d] mt-0.5">
                {[mod.data.duration, mod.data.domain].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        </button>

        <!-- Module content -->
        <div
          id={'content-' + mod.data.order}
          class="hidden border-t border-apple-hairline dark:border-[#3a3a3c] p-4"
        >
          <!-- Official resources checklist -->
          {mod.data.officialResources && (mod.data.officialResources as any[]).length > 0 && (
            <div class="mb-4 flex flex-col gap-3">
              {(mod.data.officialResources as any[]).map((r: any, idx: number) => (
                <div class="flex items-start gap-3">
                  <button
                    id={'resource-check-' + mod.data.order + '-' + idx}
                    onclick={'window.__toggleResource(' + mod.data.order + ', ' + idx + ')'}
                    class="mt-0.5 w-4 h-4 rounded border border-apple-chip dark:border-[#3a3a3c] flex-shrink-0 bg-white dark:bg-[#2c2c2e] transition-colors hover:border-apple-blue"
                  />
                  <div class="flex-1 min-w-0">
                    <p
                      id={'resource-label-' + mod.data.order + '-' + idx}
                      class="text-apple-body font-medium text-apple-ink dark:text-[#f5f5f7]"
                    >
                      {r.title}
                    </p>
                    <p class="text-apple-caption text-apple-ink-48 dark:text-[#98989d] mt-0.5">
                      {r.description}
                    </p>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="mt-1.5 inline-flex items-center gap-1 text-apple-caption text-apple-blue dark:text-apple-blue-dark bg-apple-blue/10 dark:bg-apple-blue/20 px-2 py-0.5 rounded-full hover:opacity-70 transition-opacity"
                    >
                      {r.title}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 opacity-60"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          <!-- Complementary resources -->
          {mod.data.complementaryResources && (mod.data.complementaryResources as any[]).length > 0 && (
            <div class="mb-4 bg-apple-parchment dark:bg-[#2c2c2e] rounded-apple-md p-3">
              <p class="text-apple-caption font-semibold text-apple-ink-48 dark:text-[#6e6e73] uppercase tracking-wide mb-3">
                + Complementar
              </p>
              <div class="flex flex-col gap-3">
                {(mod.data.complementaryResources as any[]).map((r: any) => (
                  <div>
                    <p class="text-apple-body font-medium text-apple-ink dark:text-[#f5f5f7]">
                      {r.title}
                    </p>
                    <p class="text-apple-caption text-apple-ink-48 dark:text-[#98989d] mt-0.5">
                      {r.description}
                    </p>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="mt-1.5 inline-flex items-center gap-1 text-apple-caption text-[#1a7a33] dark:text-[#34c759] bg-[#34c759]/10 dark:bg-[#34c759]/20 px-2 py-0.5 rounded-full hover:opacity-70 transition-opacity"
                    >
                      {r.title}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 opacity-60"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <!-- Exercises (decorative) -->
          {mod.data.exercises && (mod.data.exercises as any[]).length > 0 && (
            <div class="mb-4">
              <p class="text-apple-caption font-semibold text-apple-ink-48 dark:text-[#6e6e73] uppercase tracking-wide mb-2">
                Exercícios
              </p>
              <ul class="flex flex-col gap-2">
                {(mod.data.exercises as any[]).map((ex: any) => (
                  <li class="flex items-start gap-2 text-apple-body text-apple-ink dark:text-[#f5f5f7]">
                    <span class="mt-1 w-4 h-4 rounded border border-apple-chip dark:border-[#3a3a3c] flex-shrink-0 bg-white dark:bg-[#2c2c2e]" />
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <article class="prose prose-apple dark:prose-invert prose-sm mt-4 max-w-none">
            <Content />
          </article>
        </div>
      </div>
    ))}
  </div>
</BaseLayout>

<script>
  import { getCompletedResources, toggleResourceComplete, calcProgressPercent } from '../../lib/track-progress';

  const page = document.getElementById('track-page')!;
  const slug            = page.dataset.slug!;
  const totalResources  = parseInt(page.dataset.totalResources!);
  const moduleResourceCounts: Record<string, number> = JSON.parse(page.dataset.moduleResourceCounts!);

  function updateProgress() {
    const completed = getCompletedResources(slug);
    const pct = calcProgressPercent(completed.length, totalResources);

    const progressText = document.getElementById('modules-progress-text');
    const progressBar  = document.getElementById('track-progress-bar');
    const pctEl        = document.getElementById('track-pct');
    if (progressText) progressText.textContent = `${completed.length} de ${totalResources} recursos`;
    if (progressBar)  progressBar.style.width = `${pct}%`;
    if (pctEl)        { pctEl.textContent = `${pct}%`; pctEl.classList.remove('hidden'); }

    const moduleEls = document.querySelectorAll<HTMLElement>('[data-module]');
    let currentFound = false;

    moduleEls.forEach(el => {
      const order = parseInt(el.dataset.order!);
      const count = moduleResourceCounts[String(order)] ?? 0;

      let moduleDone = count > 0;
      for (let i = 0; i < count; i++) {
        if (!completed.includes(`${order}-${i}`)) { moduleDone = false; break; }
      }

      const isCurrent = !moduleDone && !currentFound;
      if (isCurrent) currentFound = true;

      const indicator   = document.getElementById(`indicator-${order}`);
      const content     = document.getElementById(`content-${order}`);

      if (indicator) {
        if (moduleDone) {
          indicator.className = 'w-4 h-4 rounded-full bg-apple-blue flex-shrink-0';
        } else if (isCurrent) {
          indicator.className = 'w-4 h-4 rounded-full border-2 border-apple-blue bg-white dark:bg-[#1c1c1e] flex-shrink-0';
        } else {
          indicator.className = 'w-4 h-4 rounded-full border border-apple-hairline bg-apple-divider dark:bg-[#3a3a3c] flex-shrink-0';
        }
      }

      if (isCurrent) {
        el.classList.add('border-apple-blue', 'border-2');
        el.classList.remove('border-apple-hairline', 'dark:border-[#3a3a3c]');
      } else {
        el.classList.remove('border-apple-blue', 'border-2');
        el.classList.add('border-apple-hairline', 'dark:border-[#3a3a3c]');
      }

      if (content) {
        if (isCurrent) content.classList.remove('hidden');
        else if (moduleDone) content.classList.add('hidden');
      }

      for (let i = 0; i < count; i++) {
        const isDoneResource = completed.includes(`${order}-${i}`);
        const checkbox = document.getElementById(`resource-check-${order}-${i}`);
        const label    = document.getElementById(`resource-label-${order}-${i}`);
        if (checkbox) {
          checkbox.classList.toggle('bg-apple-blue', isDoneResource);
          checkbox.classList.toggle('border-apple-blue', isDoneResource);
        }
        if (label) {
          label.classList.toggle('line-through', isDoneResource);
          label.classList.toggle('opacity-50', isDoneResource);
        }
      }
    });
  }

  (window as any).__toggleResource = (order: number, index: number) => {
    toggleResourceComplete(slug, `${order}-${index}`);
    updateProgress();
  };

  (window as any).__toggleModule = (order: number) => {
    document.getElementById(`content-${order}`)?.classList.toggle('hidden');
  };

  updateProgress();
</script>
```

- [ ] **Step 2: Run build to verify no errors**

```bash
npm run build 2>&1 | tail -20
```

Expected: build succeeds, `/trilhas/cca-foundation` pre-rendered

- [ ] **Step 3: Start dev server and manually verify**

```bash
npm run dev
```

Open `http://localhost:4321/trilhas/cca-foundation`. Check:
- Each module shows official resource checklist items (checkbox + title + description + blue chip)
- "COMPLEMENTAR" section appears with green chips, no checkboxes
- Clicking a checkbox toggles it (filled blue / empty)
- Progress bar and "X de 18 recursos" counter update on checkbox click
- Domain breakdown appears below the progress bar: "Domínios: Agentic 27% · ..."
- Module marked done (blue circle) when all its official resources are checked
- No "Marcar como concluído" button anywhere

- [ ] **Step 4: Commit**

```bash
git add src/pages/trilhas/[slug].astro
git commit -m "feat: resource checklist UI with complementary section and domain breakdown"
```

---

### Task 5: Update listing page

**Files:**
- Modify: `src/pages/trilhas/index.astro`

- [ ] **Step 1: Update the frontmatter to compute resourceCount**

In the frontmatter section, replace the block that computes `moduleCounts`:

```ts
// Replace this:
const allModules = await getCollection('track-modules');
const moduleCounts: Record<string, number> = {};
for (const mod of allModules) {
  const trackSlug = mod.id.split('/')[0];
  moduleCounts[trackSlug] = (moduleCounts[trackSlug] ?? 0) + 1;
}
```

With this:

```ts
const allModules = await getCollection('track-modules');
const resourceCounts: Record<string, number> = {};
for (const mod of allModules) {
  const trackSlug = mod.id.split('/')[0];
  const count = (mod.data.officialResources as any[] | undefined)?.length ?? 0;
  resourceCounts[trackSlug] = (resourceCounts[trackSlug] ?? 0) + count;
}
```

- [ ] **Step 2: Update tracksData to use resourceCount**

Replace:

```ts
moduleCount: moduleCounts[t.slug] ?? 0,
```

With:

```ts
resourceCount: resourceCounts[t.slug] ?? 0,
```

- [ ] **Step 3: Update the client script**

Replace the entire `<script>` block:

```ts
<script>
  import { getCompletedResources, calcProgressPercent } from '../../lib/track-progress';

  const listing = document.getElementById('tracks-listing');
  if (listing) {
    const tracksData = JSON.parse(listing.dataset.tracks ?? '[]') as Array<{
      slug: string;
      resourceCount: number;
    }>;

    let featuredSlug = tracksData[0]?.slug;
    let maxCompleted = 0;
    for (const t of tracksData) {
      const count = getCompletedResources(t.slug).length;
      if (count > maxCompleted) {
        maxCompleted = count;
        featuredSlug = t.slug;
      }
    }

    const featuredTrack = tracksData.find(t => t.slug === featuredSlug);
    if (featuredTrack && maxCompleted > 0) {
      const completed = getCompletedResources(featuredTrack.slug);
      const pct = calcProgressPercent(completed.length, featuredTrack.resourceCount);

      const progressText = document.getElementById('featured-progress-text');
      const progressBar  = document.getElementById('featured-bar');
      const progressPct  = document.getElementById('featured-pct');
      const statusBadge  = document.getElementById('featured-status');

      if (progressText) progressText.textContent = `${completed.length} de ${featuredTrack.resourceCount} recursos`;
      if (progressBar)  progressBar.style.width = `${pct}%`;
      if (progressPct)  { progressPct.textContent = `${pct}%`; progressPct.classList.remove('hidden'); }
      if (statusBadge)  statusBadge.classList.remove('hidden');
    }
  }
</script>
```

- [ ] **Step 4: Run build and verify**

```bash
npm run build 2>&1 | tail -20
```

Expected: build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/pages/trilhas/index.astro
git commit -m "feat: update listing page to use resource-based progress"
```
