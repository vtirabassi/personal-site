---
name: trilhas-recursos-checklist
description: Redesign do progresso nas Trilhas — checklist por resource oficial, seção complementar separada, breakdown de domínios
metadata:
  type: project
---

# Trilhas — Checklist por Resource e Domínios

**Data:** 2026-05-29
**Status:** Aprovado

## Objetivo

Refinar a seção `/trilhas/[slug]` para que o progresso seja rastreado em nível de resource individual (não por semana/módulo), separar recursos oficiais Anthropic de recursos complementares visualmente, e exibir breakdown de domínios do exame abaixo da barra de progresso.

---

## Mudanças no Modelo de Dados

### Frontmatter dos módulos (`track-modules`)

Substituir o array genérico `resources` por dois arrays distintos:

```yaml
officialResources:
  - title: "Claude 101 — conceitos e funcionalidades core"
    description: "Entender modelos disponíveis, system prompts, limites e como Claude se comporta."
    url: "https://anthropic.skilljar.com/claude-101"

complementaryResources:
  - title: "GitHub Study Guide (paullarionov)"
    description: "Baixar o guia e ler a seção de Claude API. Usar como referência paralela ao longo das 8 semanas."
    url: "https://github.com/paullarionov/claude-certified-architect"
```

O campo `exercises` permanece inalterado (lista decorativa, sem persistência).

O campo `resources` é removido de todos os módulos da CCA Foundation.

### Frontmatter da trilha (`tracks`)

Adicionar campo `domains` com o breakdown dos domínios do exame:

```yaml
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
```

### Zod schema (`src/content/config.ts`)

`track-modules`:
- Remover `resources`
- Adicionar `officialResources` e `complementaryResources`, ambos opcionais:
  ```ts
  z.array(z.object({ title: z.string(), description: z.string(), url: z.string() })).optional()
  ```

`tracks`:
- Adicionar `domains` opcional:
  ```ts
  z.array(z.object({ name: z.string(), percent: z.number() })).optional()
  ```

### localStorage

**Antes:**
```js
// chave: "track-progress-{slug}"
{ completedModules: [1, 2, 3], lastUpdated: 1748000000000 }
```

**Depois:**
```js
// chave: "track-progress-{slug}"
{ completedResources: ["1-0", "1-1", "2-0"], lastUpdated: 1748000000000 }
```

Formato do ID: `"{moduleOrder}-{resourceIndex}"` (índice 0-based dentro de `officialResources`).

Dados salvos no formato antigo são incompatíveis e serão ignorados (array vazio). Aceitável pois é uso pessoal.

---

## Biblioteca de Progresso (`src/lib/track-progress.ts`)

Substituir as funções de módulo por funções de resource:

```ts
export interface TrackProgress {
  completedResources: string[];
  lastUpdated: number;
}

// Retorna array de IDs como ["1-0", "1-1"]
export function getCompletedResources(slug: string): string[]

// Toggle: marca se não estava marcado, desmarca se estava
export function toggleResourceComplete(slug: string, resourceId: string): void

// Calcula percentual (arredonda para inteiro)
export function calcProgressPercent(completedCount: number, totalCount: number): number
```

As funções `getCompletedModules` e `markModuleComplete` são removidas.

---

## UI — Página de Detalhe da Trilha (`/trilhas/[slug]`)

### Cabeçalho

Abaixo da barra de progresso, adicionar breakdown de domínios (renderizado estaticamente via SSG):

```
0 de N recursos · barra de progresso

Domínios: Agentic 27% · Claude Code 20% · Prompt eng. 20% · MCP & tools 18% · Context 15%
```

- Texto de progresso muda de "X de N módulos" para "X de N recursos"
- N = total de `officialResources` somados em todos os módulos da trilha
- Domínios renderizados como texto inline com `·` separador
- Cor: `text-apple-ink-48` (mesma dos metadados do cabeçalho)

### Conteúdo do módulo expandido

**Recursos oficiais** (seção padrão, sem label):

Cada item:
- Checkbox clicável (toggle) persistido no localStorage
- Título em `font-medium`
- Descrição em `text-apple-caption text-apple-ink-48`
- Link chip azul (`bg-apple-blue/10 text-apple-blue`) com ícone de external link
- Quando marcado: checkbox preenchido, título com `line-through opacity-50`

**Recursos complementares** (seção separada):

- Label "COMPLEMENTAR" em `text-apple-caption font-semibold uppercase tracking-wide text-apple-ink-48`
- Fundo levemente distinto: `bg-apple-parchment dark:bg-[#2c2c2e]`, `rounded-apple-md`, `p-3`
- Cada item: título + descrição + link chip verde (`bg-[#34c759]/10 text-[#1a7a33] dark:text-[#34c759]`)
- Sem checkbox — não conta para progresso

**Remoção:**
- Botão "Marcar como concluído" é removido

### Estado dos módulos

| Estado | Critério |
|--------|----------|
| Concluído | Todos os `officialResources` do módulo estão em `completedResources` |
| Atual | Primeiro módulo com pelo menos um resource não concluído |
| Pendente | Demais módulos |

Visual dos estados permanece igual (círculo azul / anel azul / cinza).

### Dados passados ao cliente

O elemento `#track-page` precisa de um atributo adicional com a contagem de official resources por módulo, para que o JS saiba quando um módulo está completo:

```html
<div id="track-page"
  data-slug="cca-foundation"
  data-total-resources="18"
  data-module-resource-counts='{"1":2,"2":3,...}'
>
```

O JS usa `data-module-resource-counts` para determinar o estado de cada módulo.

---

## Conteúdo — CCA Foundation (8 módulos)

Todos os 8 arquivos em `src/content/track-modules/cca-foundation/` precisam ser atualizados:

1. Remover campo `resources`
2. Adicionar `officialResources` com título, descrição e URL para cada resource Anthropic oficial
3. Adicionar `complementaryResources` com título, descrição e URL para os demais

O arquivo `src/content/tracks/cca-foundation.md` precisa do campo `domains` adicionado.

---

## Fora do Escopo

- Checklist de exercícios (exercícios continuam decorativos)
- Sincronização de progresso entre dispositivos
- Domínios em outras trilhas além de CCA Foundation
- Edição do progresso via UI (reset, etc.)
