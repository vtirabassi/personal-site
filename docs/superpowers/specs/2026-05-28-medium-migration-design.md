---
name: medium-migration-design
description: Design for migrating Medium articles to the personal site blog with RSS-based import script and blog UI
metadata:
  type: project
---

# Design: Migração de Artigos do Medium

**Data:** 2026-05-28
**Status:** Aprovado

## Objetivo

Trazer os artigos publicados em `https://medium.com/@viniciustirabassi` para o site pessoal, migrando o conteúdo para arquivos Markdown no repositório. Cada artigo terá uma nota de rodapé com link para o post original no Medium. O blog será ativado com listagem completa em `/blog` e seção de artigos recentes na homepage.

## Abordagem

RSS Feed: o Medium expõe um feed em `https://medium.com/feed/@viniciustirabassi` com HTML completo de cada artigo. Um script de importação único faz o parse, converte para Markdown e gera os arquivos.

## Componentes

### 1. Script de importação (`scripts/import-medium.ts`)

Roda uma vez via `npx tsx scripts/import-medium.ts`. Não faz parte do build.

**Fluxo:**
1. Fetch de `https://medium.com/feed/@viniciustirabassi`
2. Parse do XML com `fast-xml-parser`
3. Para cada `<item>` do feed:
   - Extrai: `title`, `pubDate`, `link`, `description` (campo `<description>` do RSS, já vem como texto curto), `content:encoded` (HTML completo)
   - Converte HTML → Markdown com `turndown` + plugin `turndown-plugin-gfm`
   - Gera slug via `slugify()` já existente em `src/lib/slugify.ts`
   - Appenda nota de rodapé ao final do Markdown:
     ```
     ---
     *Publicado originalmente no [Medium](<link>).*
     ```
   - Escreve `src/content/blog/<slug>.md` com frontmatter:
     ```markdown
     ---
     title: "<título>"
     date: <YYYY-MM-DD>
     description: "<primeiro parágrafo ou resumo>"
     tags: []
     ---
     ```
4. Exibe sumário: quantos artigos importados, slugs gerados, eventuais erros

**Dependências novas:** `fast-xml-parser`, `turndown`, `turndown-plugin-gfm` (devDependencies)

**Idempotência:** se o arquivo já existir, pula (não sobrescreve). Isso permite re-rodar sem risco.

### 2. Página `/blog` — listagem completa

**Arquivo:** `src/pages/blog/index.astro`

Substitui o redirect atual por uma página real:
- Busca todos os posts com `getCollection('blog')`
- Ordena por `date` decrescente
- Renderiza cada post como card com: título (`text-apple-headline`), data formatada em pt-BR (`text-apple-caption text-apple-ink-48`), descrição (`text-apple-body`)
- Cards com `rounded-apple-lg`, `border border-apple-hairline`, link no título com `text-apple-blue`
- Link "← Voltar" no topo apontando para `/`

### 3. Seção "Artigos recentes" na homepage

**Arquivo:** `src/pages/index.astro`

Nova seção adicionada abaixo do conteúdo existente:
- Título da seção: "Artigos recentes"
- Exibe os 3 posts mais recentes (mesmo card da listagem, estilo consistente)
- Link "Ver todos →" apontando para `/blog`

### 4. Nav — link para Blog

**Arquivo:** `src/layouts/BaseLayout.astro`

Adiciona "Blog" na navegação existente, apontando para `/blog`.

## O que não muda

- Schema do content collection (`src/content/config.ts`) — campos existentes são suficientes
- `slugify()` — reutilizado sem alteração
- Design system — sem novos tokens, usa classes existentes

## Critérios de sucesso

- Todos os artigos do Medium importados como arquivos `.md` válidos em `src/content/blog/`
- Cada artigo tem nota de rodapé com link para o original no Medium
- `/blog` exibe todos os artigos ordenados por data
- Homepage exibe os 3 mais recentes com link para `/blog`
- "Blog" aparece na nav
- `npm run build` passa sem erros
