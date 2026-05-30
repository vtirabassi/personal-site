# Spec: i18n PT-BR / EN-US

**Data:** 2026-05-30  
**Status:** Aprovado

---

## Objetivo

Adicionar suporte a inglês (EN-US) no site pessoal, mantendo o português (PT-BR) como idioma padrão nas rotas atuais. O usuário alterna entre os idiomas via toggle no nav, que navega para a URL equivalente no outro idioma.

---

## Rotas

| PT-BR (atual, sem mudanças) | EN-US (novo) |
|---|---|
| `/` | `/en/` |
| `/blog/` | `/en/blog/` |
| `/blog/[slug]` | `/en/blog/[slug]` |
| `/trilhas/` | `/en/tracks/` |
| `/trilhas/[slug]` | `/en/tracks/[slug]` |
| `/library/` | `/en/library/` |
| `/sobre/` | `/en/about/` |

Rotas PT-BR não são modificadas. Todas as páginas EN são novas adições em `src/pages/en/`.

---

## Estrutura de arquivos

```
src/
  i18n/
    ui.ts                        # dicionário de strings estáticas PT + EN
  content/
    blog/                        # artigos PT-BR (existente, sem mudanças)
    blog-en/                     # artigos EN-US (gerados por script)
    tracks/                      # trilhas PT-BR (existente)
    tracks-en/                   # trilhas EN-US (geradas por script)
    track-modules/               # módulos PT-BR (existente)
    track-modules-en/            # módulos EN-US (gerados por script)
  data/
    library.json                 # ganha campos title_en e description_en
  pages/
    en/
      index.astro
      blog/
        index.astro
        [slug].astro
      tracks/
        index.astro
        [slug].astro
      library/
        index.astro
      about/
        index.astro
scripts/
  translate.ts                   # gera arquivos EN a partir do PT via Claude API
```

---

## Dicionário de UI (`src/i18n/ui.ts`)

Exporta um objeto tipado com todas as strings estáticas usadas nas páginas e no layout. Exemplo:

```ts
export const ui = {
  pt: {
    nav: { blog: 'Blog', tracks: 'Trilhas', library: 'Biblioteca', about: 'Sobre' },
    search: { placeholder: 'Buscar artigos e recursos...', empty: 'Nenhum resultado encontrado.' },
    library: { title: 'Biblioteca', description: 'Artigos, vídeos e links que estudo.' },
    // ...
  },
  en: {
    nav: { blog: 'Blog', tracks: 'Tracks', library: 'Library', about: 'About' },
    search: { placeholder: 'Search articles and resources...', empty: 'No results found.' },
    library: { title: 'Library', description: 'Articles, videos and links I study.' },
    // ...
  },
} as const;

export type Lang = keyof typeof ui;
```

`BaseLayout.astro` recebe `lang: Lang` como prop e usa `ui[lang]` para todas as strings estáticas. Páginas PT passam `lang="pt"`, páginas EN passam `lang="en"`.

---

## Toggle de idioma no nav

Posição: entre o botão de busca e o botão de tema.

```
[ Buscar ]  PT | EN  [ ◑ tema ]
```

- "PT" e "EN" são links `<a>` simples que navegam para a URL equivalente no outro idioma.
- Cada página conhece sua `lang` e seu `slug` equivalente, passados via props ao BaseLayout.
- A página ativa tem estilo destacado (ex: `font-semibold text-white`, o inativo fica `text-white/60`).
- Sem JavaScript — navegação nativa entre URLs.

---

## Conteúdo traduzido

### Blog e Tracks

Arquivos EN em `src/content/blog-en/` e `src/content/tracks-en/` espelham os slugs do PT. O frontmatter é idêntico ao PT, com campos traduzidos.

Páginas EN em `/en/blog/[slug]` fazem `getEntry('blog-en', slug)`. Se a entrada EN não existir para um slug, a página redireciona para a versão PT (fallback).

### Library

`library.json` ganha dois campos opcionais por item:

```json
{
  "title_en": "English title",
  "description_en": "English description."
}
```

A página `/en/library/` usa `title_en ?? title` e `description_en ?? description` (fallback para PT se não traduzido).

---

## Script de tradução (`scripts/translate.ts`)

Uso: `npm run translate`

Comportamento:
1. Lê todos os arquivos de `src/content/blog/` e `src/content/tracks/` e `src/content/track-modules/`.
2. Para cada arquivo que não tem equivalente em `-en/`, chama Claude Haiku via `@anthropic-ai/sdk` para traduzir o conteúdo Markdown (preservando frontmatter, código, termos técnicos).
3. Escreve o arquivo traduzido no diretório `-en/` correspondente.
4. Lê `library.json`, para cada item sem `title_en`/`description_en`, gera via Claude e atualiza o JSON.

O script é idempotente — não retraduz arquivos que já existem.

As traduções ficam **commitadas no git**. O build do Vercel não faz chamadas à API Claude.

---

## Content collections (`src/content/config.ts`)

Adicionar as três novas collections (`blog-en`, `tracks-en`, `track-modules-en`) com os mesmos schemas das coleções PT correspondentes.

---

## BaseLayout

Mudanças:
- Recebe props `lang: Lang` e `altHref: string` (URL do equivalente no outro idioma).
- Usa `ui[lang]` para todas as strings estáticas.
- Renderiza o toggle PT/EN no nav com links apontando para `altHref` (EN → PT) ou `/en/[path]` (PT → EN).
- `<html lang={lang === 'pt' ? 'pt-BR' : 'en-US'}>`.

---

## Critérios de aceitação

- [ ] Todas as rotas PT existentes funcionam sem alteração.
- [ ] Todas as rotas EN retornam 200 com conteúdo traduzido.
- [ ] Toggle PT/EN aparece no nav entre busca e tema.
- [ ] `npm run translate` gera os arquivos EN sem erros.
- [ ] Página EN com slug inexistente redireciona para PT (fallback).
- [ ] Library exibe EN quando `title_en` está preenchido.
- [ ] Build do Vercel passa sem variáveis de ambiente da Claude API.
