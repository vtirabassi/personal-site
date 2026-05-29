---
name: trilhas-design
description: Design spec para a seção de Trilhas de Aprendizado — listagem e detalhe de trilhas com progresso via localStorage
metadata:
  type: project
---

# Trilhas de Aprendizado — Design Spec

**Data:** 2026-05-29
**Status:** Aprovado

## Objetivo

Adicionar uma seção `/trilhas` ao site pessoal com duas funções:
1. Compartilhar trilhas de aprendizado curadas com visitantes
2. Permitir rastreamento de progresso pessoal (módulos concluídos) armazenado em localStorage

A primeira trilha a ser adicionada é o cronograma de estudos para a certificação **CCA Foundation (Anthropic)**, baseado em https://cca-foundation-anthropic.netlify.app/

---

## Estrutura de Arquivos

### Content Collections

```
src/content/
  tracks/
    cca-foundation/
      _index.md          ← metadados da trilha
      01-fundamentos.md  ← módulo 1
      02-arquitetura.md  ← módulo 2
      ...                ← demais módulos ordenados por prefixo numérico
```

### Pages

```
src/pages/
  trilhas/
    index.astro          ← /trilhas (listagem)
    [slug].astro         ← /trilhas/cca-foundation (detalhe)
```

### Componentes

```
src/components/
  TrackCard.astro        ← card compacto para listagem
  ModuleItem.astro       ← item da lista linear com estados de progresso
  ProgressBar.astro      ← barra de progresso reutilizável
```

---

## Modelos de Dados

### Trilha — `_index.md` frontmatter

```yaml
title: "CCA Foundation"
description: "Certificação Claude Certified Architect — Foundations"
category: "certificação"          # usado para tag colorida na listagem
source: "Anthropic"
estimatedHours: 80
```

O campo `category` determina a cor da tag na UI. Categorias iniciais: `certificação`, `engenharia`, `produto`.

### Módulo — frontmatter livre

Apenas `title` e `order` são obrigatórios. Todos os demais campos são definidos por cada trilha conforme sua necessidade.

```yaml
title: "Semana 1 — Fundamentos de IA Generativa"
order: 1
duration: "~8h"                   # opcional
domain: "AI Fundamentals"         # opcional — domínio do exame

# campos livres — cada trilha define os seus:
resources:
  - title: "Introduction to Claude"
    url: "https://..."
  - title: "Anthropic Cookbook"
    url: "https://..."
exercises:
  - "Criar 3 prompts de sumarização com diferentes personas"
  - "Comparar outputs de temperature 0 vs 1"
notes: |                          # opcional — texto livre em Markdown
  Esta semana foca nos conceitos fundamentais antes de entrar
  em técnicas avançadas de prompting.
```

O corpo do arquivo Markdown (abaixo do frontmatter) é renderizado como prosa livre dentro do módulo.

---

## Páginas

### `/trilhas` — Listagem

**Comportamento estático (SSG):** renderiza todas as trilhas com estado "não iniciado".

**Comportamento client-side:** script inline lê localStorage e hidrata os estados após carregamento, sem flash visível.

**Layout:**

1. **Destaque no topo** — a trilha com maior progresso > 0% aparece em card grande com:
   - Tag de categoria colorida + "EM PROGRESSO"
   - Título e fonte (ex: "Anthropic")
   - Metadados: duração total, progresso em texto ("Semana 3 de 8")
   - Barra de progresso visual
   - Percentual em destaque (ex: "35%")

2. **Lista compacta abaixo** — demais trilhas (não iniciadas ou secundárias) em linhas simples:
   - Tag de categoria + título + metadados + status ("Não iniciada")

Se nenhuma trilha tiver progresso, o destaque exibe a trilha com o primeiro slug em ordem alfabética como sugestão de início (sem barra preenchida).

### `/trilhas/[slug]` — Detalhe da Trilha

**Cabeçalho da página:** título, fonte, barra de progresso geral e contagem de módulos concluídos.

**Lista linear de módulos:** renderizada em ordem crescente de `order`. Cada módulo tem três estados visuais:

| Estado | Visual | Interação |
|--------|--------|-----------|
| Concluído | Círculo azul preenchido, conteúdo colapsado | Expansível via clique |
| Atual (primeiro não concluído) | Borda azul, aberto por padrão | Botão "Marcar como concluído" |
| Pendente | Cinza, aparência reduzida | Expansível via clique |

**Conteúdo de um módulo expandido:**

Campos reconhecidos do frontmatter ganham formatação especial:
- `resources` → lista com links clicáveis
- `exercises` → lista com checkboxes visuais puramente decorativos (sem persistência — marcar um exercício não salva estado)
- `duration` / `domain` → metadados no cabeçalho do módulo

O corpo Markdown do arquivo é renderizado como prosa abaixo dos campos estruturados.

Campos não reconhecidos são ignorados silenciosamente (sem quebrar a página).

---

## Progresso (localStorage)

**Estrutura de dados:**

```js
// chave: "track-progress-{slug}"
// exemplo: "track-progress-cca-foundation"
{
  completedModules: [1, 2, 3],  // array de valores do campo `order`
  lastUpdated: 1748000000000    // timestamp Unix em ms
}
```

**Leitura:** script inline em cada página lê o localStorage após carregamento e atualiza classes CSS dos elementos de módulo. Não há reload de página.

**Escrita:** clicar em "Marcar como concluído" adiciona o `order` do módulo ao array, persiste no localStorage e atualiza o DOM imediatamente (sem reload). O percentual e a barra de progresso no cabeçalho também são atualizados via DOM.

**Escopo:** progresso é por dispositivo/navegador. Não há sincronização entre dispositivos.

---

## Navegação

Adicionar item "Trilhas" na nav de `BaseLayout.astro`, entre "Blog" e "Biblioteca":

```html
<a href="/blog"     ...>Blog</a>
<a href="/trilhas"  ...>Trilhas</a>   ← novo
<a href="/library"  ...>Biblioteca</a>
```

Seguir o mesmo padrão de classe dos outros itens da nav.

---

## Design System

Seguir o Apple Design System definido em `DESIGN.md`:
- Tag de categoria: pill com cor de fundo suave (ex: `bg-apple-blue/10 text-apple-blue` para certificação)
- Barra de progresso: altura 4px, `border-radius: 4px`, cor `#0066cc`
- Módulo atual: `border-2 border-apple-blue`
- Módulo concluído: círculo `bg-apple-blue` (16×16px)
- Módulo pendente: círculo `bg-[#f0f0f0] border border-[#d2d2d7]`
- Cards e bordas: `rounded-apple-lg`, `border-apple-hairline`
- Dark mode: suportado seguindo padrões do restante do site

---

## Fora do Escopo (desta iteração)

- Autenticação — progresso é sempre público por dispositivo, sem login
- Sincronização entre dispositivos
- Criação de trilhas via UI ou Telegram bot
- Busca dentro das trilhas
- Comentários ou anotações por módulo
