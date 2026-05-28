# Personal Site — Claude Code Guide

Site pessoal com blog, perfil e biblioteca de recursos. Stack: Astro 5 + Tailwind CSS + Vercel.

## Comandos

```bash
npm run dev        # servidor local em http://localhost:4321
npm run build      # build de produção
npm test           # testa com Vitest
git push           # deploy automático via Vercel
```

## Estrutura

```
src/
  pages/
    index.astro              # Perfil (/)
    blog/index.astro         # Listagem de artigos (/blog)
    blog/[slug].astro        # Artigo individual (/blog/[slug])
    library/index.astro      # Biblioteca de recursos (/library)
    api/ratings.ts           # GET/POST /api/ratings (Vercel KV)
    api/telegram-webhook.ts  # Bot do Telegram
  content/blog/              # Artigos em Markdown
  data/library.json          # Fonte de verdade da biblioteca
  lib/
    library-schema.ts        # Tipos TypeScript (LibraryItem, etc.)
    slugify.ts               # slugify() + inferType()
    fetch-metadata.ts        # Busca og:title/og:description de URLs
    classify-theme.ts        # Classifica tema via Claude API (Haiku)
    github-api.ts            # Commit de library.json via GitHub API
  layouts/BaseLayout.astro   # Nav preta + footer parchment
  components/
    ShareButton.astro        # Web Share API + clipboard fallback
    StarRating.astro         # Estrelas com localStorage dedup
tests/                       # Vitest unit tests
```

## Design System (Apple)

Definido em `DESIGN.md`. Regras principais:
- Cor de ação: `#0066cc` → classe `apple-blue`
- Fonte: `system-ui, -apple-system, BlinkMacSystemFont`
- Body: 17px/400 → `text-apple-body`
- Nav: preta (`bg-black`), 44px (`h-11`), sticky
- Footer: parchment (`bg-apple-parchment` = `#f5f5f7`)
- CTAs primários: `rounded-full`, padding `px-[22px] py-[11px]`
- Cards: `rounded-apple-lg` (18px), borda `border-apple-hairline`
- Sem sombras no chrome da UI

## Como publicar um artigo

Cria um arquivo `.md` em `src/content/blog/`:

```markdown
---
title: "Título do artigo"
date: 2026-05-28
description: "Resumo curto."
tags: ["tag1", "tag2"]
---

Conteúdo em Markdown aqui.
```

Depois `git push` — o Vercel faz deploy automático.

## Como adicionar um recurso à biblioteca

**Via Telegram:** manda o link pro bot. Ele busca os metadados, classifica o tema com Claude, e pede confirmação. Responde ✅ para confirmar.

**Via Claude Code CLI:** fala o link e a nota pessoal. Eu busco os metadados, classifico o tema e edito `src/data/library.json` diretamente. Você revisa e faz `git push`.

## Variáveis de ambiente

Configuradas no Vercel. Para rodar localmente, copia `.env.example` para `.env` e preenche:

| Variável | Onde pegar |
|----------|-----------|
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `TELEGRAM_BOT_TOKEN` | @BotFather no Telegram |
| `GITHUB_TOKEN` | github.com/settings/tokens (Contents: read+write no repo) |
| `GITHUB_REPO` | `vtirabassi/personal-site` |
| `KV_REST_API_URL` | Upstash via Vercel Storage |
| `KV_REST_API_TOKEN` | Upstash via Vercel Storage |

## Deploy

Qualquer `git push` na branch `main` dispara deploy automático no Vercel (~2 min).

Site: https://personal-site-chi-seven-12.vercel.app
Repo: https://github.com/vtirabassi/personal-site
