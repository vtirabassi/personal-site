---
name: month-nav-design
description: Design for month-grouped navigation sidebar on /blog and /library pages
metadata:
  type: project
---

# Design: Navegação por Mês — Blog e Biblioteca

**Data:** 2026-05-28
**Status:** Aprovado

## Objetivo

Adicionar agrupamento por mês/ano no conteúdo das páginas `/blog` e `/library`, com uma sidebar "Nesta página" à direita listando os meses como links âncora. O mês visível é destacado via scroll-spy. Na biblioteca, a sidebar sincroniza com o filtro por tema, ocultando meses sem itens visíveis.

## Layout

Ambas as páginas passam de coluna única para duas colunas via CSS grid, dentro do `<main>` existente de 980px:

```
[  conteúdo principal (1fr)  ] [ sidebar (220px) ]
```

- Sidebar: `position: sticky`, `top: 80px` (abaixo da nav de 44px)
- Mobile: sidebar oculta (`hidden lg:block`)
- Sem alteração no `BaseLayout.astro`

## Conteúdo agrupado por mês

Para cada página, os itens são agrupados por `YYYY-MM` em tempo de build (Astro). Meses sem itens são omitidos.

Cada grupo gera:
```html
<section id="YYYY-NomeMes">
  <h2>YYYY - NomeMes</h2>
  <!-- itens do mês -->
</section>
```

**Slug do id:** `YYYY-` + nome do mês em minúsculas sem acento (ex: `2021-agosto`, `2026-maio`).

**Blog (`/blog`):** cards com título + descrição + tags (data não exibida no card — mês/ano já está no heading).

**Biblioteca (`/library`):** cards iguais ao design atual (tipo, tema, nota pessoal, estrelas, compartilhar, data de adição).

## Sidebar "Nesta página"

```
Nesta página
  2026 - Maio   ← link âncora, destaque apple-blue quando visível
  2021 - Agosto
  ...
```

- Título: `text-apple-caption font-semibold text-apple-ink-48`
- Links: `text-apple-caption text-apple-ink-48`, ativo: `text-apple-blue font-semibold`
- Scroll-spy via `IntersectionObserver` com `threshold: 0` e `rootMargin: '-20% 0px -70% 0px'`

## Comportamento do filtro na Biblioteca

O script de filtro existente é estendido: após mostrar/ocultar itens, verifica quais seções de mês têm pelo menos um item visível e:
- Oculta seções vazias no conteúdo (`section.style.display = 'none'`)
- Oculta o link correspondente na sidebar

Quando filtro = "Todos", todos os meses voltam a aparecer.

## Implementação

**Um único commit** contendo todas as alterações:
- `src/pages/blog/index.astro` — layout grid + agrupamento por mês + sidebar + scroll-spy JS
- `src/pages/library/index.astro` — layout grid + agrupamento por mês + sidebar + sync com filtro existente + scroll-spy JS

## Critérios de sucesso

- `/blog` exibe posts agrupados por mês com sidebar sticky à direita
- `/library` exibe itens agrupados por mês com sidebar sticky, sidebar sincroniza com filtro de tema
- Meses vazios não aparecem em nenhum dos dois (conteúdo nem sidebar)
- Scroll-spy destaca o mês visível
- Mobile: sem sidebar (conteúdo em coluna única)
- `npm run build` passa sem erros
