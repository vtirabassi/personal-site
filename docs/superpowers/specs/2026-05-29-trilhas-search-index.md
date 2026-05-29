---
name: trilhas-search-index
description: Adicionar trilhas ao índice de busca do header — uma entrada por trilha com label "Trilha"
metadata:
  type: project
---

# Trilhas — Indexação na Busca do Header

**Data:** 2026-05-29
**Status:** Aprovado

## Objetivo

Incluir as trilhas de aprendizado nos resultados da busca global do header, permitindo encontrar trilhas pelo título ou descrição.

## Mudança

Arquivo único: `src/layouts/BaseLayout.astro`

### Frontmatter

Adicionar `getCollection('tracks')` e um terceiro spread em `searchItems`:

```ts
const tracks = await getCollection('tracks');

const searchItems = [
  ...posts.map(p => ({ type: 'blog', ... })),
  ...library.items.map(i => ({ type: 'library', ... })),
  ...tracks.map(t => ({
    type: 'trilha',
    title: t.data.title,
    description: t.data.description,
    url: `/trilhas/${t.slug}`,
    external: false,
  })),
];
```

### Renderização do resultado

Estender a lógica de `label` e `labelColor` para o novo tipo:

```ts
const label = item.type === 'blog' ? 'Blog'
            : item.type === 'trilha' ? 'Trilha'
            : 'Biblioteca';

const labelColor = item.type === 'blog'
  ? 'bg-apple-blue/10 text-apple-blue'
  : item.type === 'trilha'
  ? 'bg-[#34c759]/10 text-[#1a7a33] dark:text-[#34c759]'
  : 'bg-[#3a3a3c]/10 text-apple-ink-48 dark:text-[#98989d]';
```

## Comportamento

- Buscar "CCA", "Anthropic", "certificação" ou qualquer palavra do título/descrição da trilha retorna a trilha como resultado
- Clique navega para `/trilhas/{slug}` (interno, sem `target="_blank"`)
- Label "Trilha" em verde (mesmo verde usado para categoria "engenharia") distingue visualmente de Blog e Biblioteca

## Fora do Escopo

- Indexação de módulos individuais dentro de cada trilha
- Busca por domínios ou recursos dentro das trilhas
