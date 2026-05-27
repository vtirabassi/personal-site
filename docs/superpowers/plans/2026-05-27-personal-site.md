# Personal Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public personal site with blog, profile, and resource library, plus a Telegram bot that classifies and publishes resources automatically.

**Architecture:** Astro site with `output: 'hybrid'` — static pages (Profile, Blog, Library) pre-rendered at build time, API routes (ratings, Telegram webhook) deployed as Vercel Serverless Functions. Blog articles are Markdown files committed to Git. Library resources are stored in `src/data/library.json`. Ratings use Vercel KV. The Telegram bot stores conversation state in Vercel KV between turns to handle the confirmation step.

**Tech Stack:** Astro 4, Tailwind CSS, TypeScript, Vitest, `@astrojs/vercel`, Vercel KV (`@vercel/kv`), grammy (Telegram Bot framework), Anthropic SDK (`@anthropic-ai/sdk`)

**Design System:** `DESIGN.md` (Apple design analysis) — reference before writing any UI. Key rules: single Action Blue `#0066cc` for all interactive elements; `system-ui, -apple-system` font stack; body at 17px/400; display headlines at 600 with negative letter-spacing; no shadows on UI chrome (only on product imagery); no gradients; pill radius (`9999px`) for primary CTAs; `18px` radius for cards; black nav (44px); parchment footer (`#f5f5f7`).

---

## File Map

| File | Responsibility |
|------|---------------|
| `astro.config.mjs` | Astro + Tailwind + Vercel adapter (hybrid output) |
| `vitest.config.ts` | Vitest test runner config |
| `src/env.d.ts` | TypeScript env variable declarations |
| `src/content/config.ts` | Blog content collection schema |
| `src/lib/library-schema.ts` | Shared TypeScript types for library items |
| `src/lib/slugify.ts` | Slug generation + URL type inference |
| `src/lib/fetch-metadata.ts` | Fetch og: tags from a URL |
| `src/lib/classify-theme.ts` | Claude API theme classification |
| `src/lib/github-api.ts` | Read and commit `library.json` via GitHub API |
| `src/layouts/BaseLayout.astro` | Common HTML shell + navigation |
| `src/pages/index.astro` | Profile page (/) |
| `src/pages/blog/index.astro` | Blog listing (/blog) |
| `src/pages/blog/[slug].astro` | Individual article (/blog/[slug]) |
| `src/content/blog/hello-world.md` | Sample article |
| `src/data/library.json` | Resource library data (source of truth) |
| `src/pages/library/index.astro` | Library page with client-side theme filter |
| `src/components/ShareButton.astro` | Share button (Web Share API + clipboard fallback) |
| `src/components/StarRating.astro` | Star rating widget (API + localStorage dedup) |
| `src/pages/api/ratings.ts` | GET/POST rating endpoints |
| `src/pages/api/telegram-webhook.ts` | Telegram bot webhook handler |
| `tests/slugify.test.ts` | Tests for slugify and inferType |
| `tests/fetch-metadata.test.ts` | Tests for URL metadata fetching |
| `tests/classify-theme.test.ts` | Tests for Claude theme classification |
| `tests/github-api.test.ts` | Tests for GitHub API commit operations |
| `tests/ratings.test.ts` | Tests for rating calculation logic |

---

## Task 1: Project Scaffold

**Files:**
- Create: `astro.config.mjs` (modified after install)
- Create: `vitest.config.ts`
- Create: `src/env.d.ts`
- Create: `.env.example`

- [ ] **Step 1: Initialize Astro project inside existing directory**

```bash
cd /Users/vinicius/code/personal-site
npm create astro@latest . -- --template minimal --typescript strict --no-git --install
```

When prompted about existing files (the `docs/` folder), choose to continue.

Expected: Astro project files created, `node_modules` installed.

- [ ] **Step 2: Add Tailwind and Vercel adapter**

```bash
npx astro add tailwind vercel --yes
```

Expected: `@astrojs/tailwind` and `@astrojs/vercel` added to `astro.config.mjs` and installed.

- [ ] **Step 3: Install remaining dependencies**

```bash
npm install grammy @anthropic-ai/sdk @vercel/kv
npm install -D vitest @vitest/ui @tailwindcss/typography
```

- [ ] **Step 4: Configure Astro for hybrid output**

Replace the full contents of `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'hybrid',
  adapter: vercel(),
  integrations: [tailwind()],
});
```

- [ ] **Step 5: Configure Tailwind with Apple design tokens and typography plugin**

Replace the full contents of `tailwind.config.mjs`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Apple design tokens (from DESIGN.md)
        'apple-blue':      '#0066cc', // primary — every interactive element
        'apple-blue-focus':'#0071e3', // focus ring
        'apple-blue-dark': '#2997ff', // links on dark surfaces
        'apple-ink':       '#1d1d1f', // body text on light
        'apple-ink-80':    '#333333', // muted body / footer text
        'apple-ink-48':    '#7a7a7a', // disabled / fine-print
        'apple-parchment': '#f5f5f7', // alternating light tile / footer
        'apple-pearl':     '#fafafc', // secondary ghost button fill
        'apple-hairline':  '#e0e0e0', // 1px card borders
        'apple-divider':   '#f0f0f0', // soft ring on secondary buttons
        'apple-chip':      '#d2d2d7', // translucent chip on photography
        'apple-tile-1':    '#272729', // dark tile
        'apple-tile-2':    '#2a2a2c', // dark tile variant
        'apple-tile-3':    '#252527', // dark tile deepest
      },
      borderRadius: {
        'apple-sm': '8px',   // utility buttons
        'apple-md': '11px',  // pearl capsule buttons
        'apple-lg': '18px',  // cards (store-utility-card)
      },
      fontSize: {
        'apple-hero':    ['56px', { lineHeight: '1.07', letterSpacing: '-0.28px', fontWeight: '600' }],
        'apple-display': ['40px', { lineHeight: '1.10', letterSpacing: '0',       fontWeight: '600' }],
        'apple-tagline': ['21px', { lineHeight: '1.19', letterSpacing: '0.231px', fontWeight: '600' }],
        'apple-body':    ['17px', { lineHeight: '1.47', letterSpacing: '-0.374px',fontWeight: '400' }],
        'apple-caption': ['14px', { lineHeight: '1.43', letterSpacing: '-0.224px',fontWeight: '400' }],
        'apple-nav':     ['12px', { lineHeight: '1.0',  letterSpacing: '-0.12px', fontWeight: '400' }],
        'apple-fine':    ['12px', { lineHeight: '1.0',  letterSpacing: '-0.12px', fontWeight: '400' }],
      },
    },
  },
  plugins: [
    (await import('@tailwindcss/typography')).default,
  ],
};
```

- [ ] **Step 6: Create Vitest config**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
});
```

- [ ] **Step 7: Add test scripts to package.json**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 8: Add environment type declarations**

Create `src/env.d.ts`:

```typescript
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly TELEGRAM_BOT_TOKEN: string;
  readonly GITHUB_TOKEN: string;
  readonly GITHUB_REPO: string;
  readonly ANTHROPIC_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

- [ ] **Step 9: Create .env.example and .env**

Create `.env.example`:

```
TELEGRAM_BOT_TOKEN=
GITHUB_TOKEN=
GITHUB_REPO=username/personal-site
ANTHROPIC_API_KEY=
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
```

```bash
cp .env.example .env
echo ".env" >> .gitignore
```

- [ ] **Step 10: Verify Astro builds**

```bash
npx astro build
```

Expected: Build succeeds with no errors.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro project with Tailwind, Vercel adapter, and Vitest"
```

---

## Task 2: Shared Types and Utilities

**Files:**
- Create: `src/lib/library-schema.ts`
- Create: `src/lib/slugify.ts`
- Create: `tests/slugify.test.ts`

- [ ] **Step 1: Write failing tests for slugify and inferType**

Create `tests/slugify.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { slugify, inferType } from '../src/lib/slugify';

describe('slugify', () => {
  it('converts text to lowercase kebab-case', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes accents', () => {
    expect(slugify('Atenção ao Detalhe')).toBe('atencao-ao-detalhe');
  });

  it('strips leading and trailing whitespace', () => {
    expect(slugify('  hello  ')).toBe('hello');
  });

  it('collapses multiple non-alphanumeric chars into one hyphen', () => {
    expect(slugify('hello & world!')).toBe('hello-world');
  });
});

describe('inferType', () => {
  it('returns video for YouTube URLs', () => {
    expect(inferType('https://www.youtube.com/watch?v=abc')).toBe('video');
  });

  it('returns video for youtu.be URLs', () => {
    expect(inferType('https://youtu.be/abc')).toBe('video');
  });

  it('returns article for arxiv.org URLs', () => {
    expect(inferType('https://arxiv.org/abs/1706.03762')).toBe('article');
  });

  it('returns article for medium.com URLs', () => {
    expect(inferType('https://medium.com/some-post')).toBe('article');
  });

  it('returns link for unrecognized domains', () => {
    expect(inferType('https://example.com/page')).toBe('link');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/slugify.test.ts
```

Expected: FAIL — "Cannot find module '../src/lib/slugify'"

- [ ] **Step 3: Create library schema types**

Create `src/lib/library-schema.ts`:

```typescript
export type ResourceType = 'article' | 'video' | 'link';

export interface LibraryItem {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  theme: string;
  description: string;
  personalNote?: string;
  addedAt: string; // ISO 8601 date, e.g. "2026-05-27"
}

export interface LibraryData {
  items: LibraryItem[];
}
```

- [ ] **Step 4: Create slugify utility**

Create `src/lib/slugify.ts`:

```typescript
import type { ResourceType } from './library-schema';

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function inferType(url: string): ResourceType {
  if (
    url.includes('youtube.com') ||
    url.includes('youtu.be') ||
    url.includes('vimeo.com')
  ) {
    return 'video';
  }
  if (
    url.includes('arxiv.org') ||
    url.includes('medium.com') ||
    url.includes('dev.to') ||
    url.includes('substack.com')
  ) {
    return 'article';
  }
  return 'link';
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test -- tests/slugify.test.ts
```

Expected: PASS — 9 tests

- [ ] **Step 6: Commit**

```bash
git add src/lib/library-schema.ts src/lib/slugify.ts tests/slugify.test.ts
git commit -m "feat: add library schema types and slugify utility"
```

---

## Task 3: URL Metadata Fetcher

**Files:**
- Create: `src/lib/fetch-metadata.ts`
- Create: `tests/fetch-metadata.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/fetch-metadata.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchMetadata } from '../src/lib/fetch-metadata';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function makeHtml(ogTitle?: string, ogDesc?: string, titleTag?: string): string {
  return `<html><head>
    ${ogTitle ? `<meta property="og:title" content="${ogTitle}" />` : ''}
    ${ogDesc ? `<meta property="og:description" content="${ogDesc}" />` : ''}
    ${titleTag ? `<title>${titleTag}</title>` : ''}
  </head></html>`;
}

function mockResponse(html: string) {
  mockFetch.mockResolvedValueOnce({ text: async () => html });
}

beforeEach(() => mockFetch.mockClear());

describe('fetchMetadata', () => {
  it('extracts og:title and og:description', async () => {
    mockResponse(makeHtml('OG Title', 'OG Description'));
    const result = await fetchMetadata('https://example.com');
    expect(result).toEqual({ title: 'OG Title', description: 'OG Description' });
  });

  it('falls back to <title> tag when og:title is absent', async () => {
    mockResponse(makeHtml(undefined, undefined, 'Page Title'));
    const result = await fetchMetadata('https://example.com');
    expect(result.title).toBe('Page Title');
  });

  it('returns empty description when none found', async () => {
    mockResponse(makeHtml('Title'));
    const result = await fetchMetadata('https://example.com');
    expect(result.description).toBe('');
  });

  it('falls back to URL when no title found', async () => {
    mockResponse('<html></html>');
    const result = await fetchMetadata('https://example.com/page');
    expect(result.title).toBe('https://example.com/page');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/fetch-metadata.test.ts
```

Expected: FAIL — "Cannot find module '../src/lib/fetch-metadata'"

- [ ] **Step 3: Implement fetch-metadata**

Create `src/lib/fetch-metadata.ts`:

```typescript
export interface UrlMetadata {
  title: string;
  description: string;
}

export async function fetchMetadata(url: string): Promise<UrlMetadata> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PersonalSiteBot/1.0)' },
  });
  const html = await response.text();

  const ogTitle =
    html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/)?.[1] ??
    html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:title"/)?.[1];

  const ogDesc =
    html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/)?.[1] ??
    html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:description"/)?.[1];

  const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/)?.[1]?.trim();

  return {
    title: ogTitle ?? titleTag ?? url,
    description: ogDesc ?? '',
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/fetch-metadata.test.ts
```

Expected: PASS — 4 tests

- [ ] **Step 5: Commit**

```bash
git add src/lib/fetch-metadata.ts tests/fetch-metadata.test.ts
git commit -m "feat: add URL metadata fetcher"
```

---

## Task 4: Theme Classifier

**Files:**
- Create: `src/lib/classify-theme.ts`
- Create: `tests/classify-theme.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/classify-theme.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: { create: vi.fn() },
  })),
}));

import Anthropic from '@anthropic-ai/sdk';
import { classifyTheme } from '../src/lib/classify-theme';

const mockCreate = vi.fn();

beforeEach(() => {
  vi.mocked(Anthropic).mockImplementation(
    () => ({ messages: { create: mockCreate } }) as any
  );
  mockCreate.mockClear();
});

describe('classifyTheme', () => {
  it('returns the theme text from Claude response', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: 'Machine Learning' }],
    });
    const theme = await classifyTheme('Attention Is All You Need', 'Original Transformer paper');
    expect(theme).toBe('Machine Learning');
  });

  it('trims whitespace from the response', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: '  Engenharia de Software  ' }],
    });
    const theme = await classifyTheme('Clean Code', 'Writing maintainable code');
    expect(theme).toBe('Engenharia de Software');
  });

  it('calls Claude with title and description in the prompt', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: 'DevOps' }],
    });
    await classifyTheme('Docker Compose Guide', 'Setting up containers');
    const call = mockCreate.mock.calls[0][0];
    expect(call.messages[0].content).toContain('Docker Compose Guide');
    expect(call.messages[0].content).toContain('Setting up containers');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/classify-theme.test.ts
```

Expected: FAIL — "Cannot find module '../src/lib/classify-theme'"

- [ ] **Step 3: Implement classify-theme**

Create `src/lib/classify-theme.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function classifyTheme(title: string, description: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 50,
    messages: [
      {
        role: 'user',
        content: `Classifique este recurso em um tema de 1 a 3 palavras em português. Responda APENAS com o tema, sem explicação.\n\nTítulo: ${title}\nDescrição: ${description}`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Unexpected response from Claude API');
  }

  return textBlock.text.trim();
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/classify-theme.test.ts
```

Expected: PASS — 3 tests

- [ ] **Step 5: Commit**

```bash
git add src/lib/classify-theme.ts tests/classify-theme.test.ts
git commit -m "feat: add Claude API theme classifier"
```

---

## Task 5: GitHub API Helper

**Files:**
- Create: `src/lib/github-api.ts`
- Create: `tests/github-api.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/github-api.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addLibraryItem } from '../src/lib/github-api';
import type { LibraryItem } from '../src/lib/library-schema';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const sampleItem: LibraryItem = {
  id: 'attention-is-all-you-need',
  title: 'Attention Is All You Need',
  url: 'https://arxiv.org/abs/1706.03762',
  type: 'article',
  theme: 'Machine Learning',
  description: 'Original Transformer paper',
  addedAt: '2026-05-27',
};

function mockGitHubGet(data: object, sha = 'abc123') {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ content: btoa(JSON.stringify(data)), sha }),
  });
}

function mockGitHubPut() {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ commit: {} }),
  });
}

beforeEach(() => {
  mockFetch.mockClear();
  process.env.GITHUB_TOKEN = 'test-token';
  process.env.GITHUB_REPO = 'user/repo';
});

describe('addLibraryItem', () => {
  it('fetches current library.json and commits updated version', async () => {
    mockGitHubGet({ items: [] });
    mockGitHubPut();

    await addLibraryItem(sampleItem);

    expect(mockFetch).toHaveBeenCalledTimes(2);
    const putBody = JSON.parse(mockFetch.mock.calls[1][1].body);
    const committed = JSON.parse(atob(putBody.content));
    expect(committed.items).toHaveLength(1);
    expect(committed.items[0].id).toBe('attention-is-all-you-need');
  });

  it('preserves existing items when adding a new one', async () => {
    mockGitHubGet({ items: [{ id: 'old-item', title: 'Old' }] });
    mockGitHubPut();

    await addLibraryItem(sampleItem);

    const putBody = JSON.parse(mockFetch.mock.calls[1][1].body);
    const committed = JSON.parse(atob(putBody.content));
    expect(committed.items).toHaveLength(2);
  });

  it('uses the correct SHA in the PUT request', async () => {
    mockGitHubGet({ items: [] }, 'specific-sha-123');
    mockGitHubPut();

    await addLibraryItem(sampleItem);

    const putBody = JSON.parse(mockFetch.mock.calls[1][1].body);
    expect(putBody.sha).toBe('specific-sha-123');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/github-api.test.ts
```

Expected: FAIL — "Cannot find module '../src/lib/github-api'"

- [ ] **Step 3: Implement github-api**

Create `src/lib/github-api.ts`:

```typescript
import type { LibraryItem, LibraryData } from './library-schema';

const GITHUB_API = 'https://api.github.com';
const FILE_PATH = 'src/data/library.json';

function headers() {
  return {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };
}

export async function addLibraryItem(item: LibraryItem): Promise<void> {
  const repo = process.env.GITHUB_REPO;
  const url = `${GITHUB_API}/repos/${repo}/contents/${FILE_PATH}`;

  const getRes = await fetch(url, { headers: headers() });
  const fileData: { content: string; sha: string } = await getRes.json();

  const library: LibraryData = JSON.parse(atob(fileData.content));
  library.items.push(item);

  await fetch(url, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({
      message: `feat: add resource "${item.title}"`,
      content: btoa(JSON.stringify(library, null, 2)),
      sha: fileData.sha,
    }),
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/github-api.test.ts
```

Expected: PASS — 3 tests

- [ ] **Step 5: Commit**

```bash
git add src/lib/github-api.ts tests/github-api.test.ts
git commit -m "feat: add GitHub API helper for committing library items"
```

---

## Task 6: Base Layout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create base layout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
interface Props {
  title: string;
  description?: string;
}
const { title, description = 'Meu site pessoal' } = Astro.props;
---

<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <!-- Apple: near-black ink on white canvas; system-ui resolves to SF Pro on Apple devices -->
  <body class="min-h-screen bg-white text-apple-ink" style="font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;">

    <!-- global-nav: pure black, 44px, nav-link typography (12px/400/-0.12px) -->
    <nav class="bg-black h-11 flex items-center px-6 sticky top-0 z-50">
      <div class="max-w-[980px] mx-auto w-full flex items-center justify-between">
        <a
          href="/"
          class="text-apple-nav text-white font-normal hover:opacity-70 transition-opacity"
        >
          Vinicius Vp
        </a>
        <div class="flex gap-5">
          <a href="/blog"    class="text-apple-nav text-white/80 hover:text-white transition-colors">Blog</a>
          <a href="/library" class="text-apple-nav text-white/80 hover:text-white transition-colors">Biblioteca</a>
        </div>
      </div>
    </nav>

    <main class="max-w-[980px] mx-auto px-6 py-20">
      <slot />
    </main>

    <!-- footer: parchment canvas, ink-muted-80 text, 64px vertical padding, fine-print -->
    <footer class="bg-apple-parchment px-6 py-16 mt-20">
      <div class="max-w-[980px] mx-auto text-center text-apple-fine text-apple-ink-80">
        © {new Date().getFullYear()} Vinicius Vp
      </div>
    </footer>
  </body>
</html>
```

- [ ] **Step 2: Verify dev server renders layout**

```bash
npx astro dev
```

Open `http://localhost:4321`. Expected: Page renders without errors (empty main content until pages are added).

Stop the dev server with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add base layout with navigation"
```

---

## Task 7: Profile Page

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create profile page**

Create `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<!-- Apple: centered single-column hero tile on white canvas -->
<BaseLayout title="Vinicius Vp" description="Perfil profissional">
  <div class="flex flex-col items-center text-center gap-8 py-20">

    <div class="w-24 h-24 rounded-full bg-apple-parchment flex items-center justify-center text-4xl">
      👤
    </div>

    <div class="flex flex-col gap-2">
      <!-- display-lg: 40px/600/0 letter-spacing -->
      <h1 class="text-apple-display font-semibold text-apple-ink">Vinicius Vp</h1>
      <!-- lead: 28px/400 -->
      <p class="text-[28px] leading-[1.14] font-normal text-apple-ink-48">
        Título profissional aqui
      </p>
    </div>

    <!-- body: 17px/400/1.47/-0.374px -->
    <p class="text-apple-body text-apple-ink max-w-lg">
      Breve bio sobre quem você é, suas áreas de interesse e o que você faz.
      Edite este texto em <code class="text-apple-blue text-[15px]">src/pages/index.astro</code>.
    </p>

    <!-- Two pill CTAs side by side — button-primary grammar -->
    <div class="flex gap-4 flex-wrap justify-center">
      <a
        href="https://github.com/seu-usuario"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-apple-blue text-white text-apple-body rounded-full px-[22px] py-[11px] transition-transform active:scale-95"
      >
        GitHub
      </a>
      <a
        href="https://linkedin.com/in/seu-perfil"
        target="_blank"
        rel="noopener noreferrer"
        class="border border-apple-blue text-apple-blue text-apple-body rounded-full px-[22px] py-[11px] transition-transform active:scale-95"
      >
        LinkedIn
      </a>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Update with your real info**

Edit `src/pages/index.astro` — replace the placeholder name, title, bio, GitHub and LinkedIn URLs with your actual information.

- [ ] **Step 3: Verify page renders**

```bash
npx astro dev
```

Open `http://localhost:4321`. Expected: Profile page with your name, bio, and links visible.

Stop the dev server with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add profile page"
```

---

## Task 8: Blog

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/blog/hello-world.md`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Define blog content collection**

Create `src/content/config.ts`:

```typescript
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

export const collections = { blog };
```

- [ ] **Step 2: Create sample article**

Create `src/content/blog/hello-world.md`:

```markdown
---
title: "Olá, mundo!"
date: 2026-05-27
description: "Primeiro artigo do blog — uma apresentação."
tags: ["meta"]
---

Bem-vindo ao meu blog. Aqui vou compartilhar artigos sobre temas que estou estudando e aprendendo.

## Como funciona

Este blog é gerado com [Astro](https://astro.build) e hospedado no Vercel. Os artigos são escritos em Markdown e commitados diretamente no repositório.

Para publicar um novo artigo, basta criar um arquivo `.md` em `src/content/blog/` com o frontmatter correto e fazer push.
```

- [ ] **Step 3: Create blog listing page**

Create `src/pages/blog/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

const posts = (await getCollection('blog')).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
);
---

<BaseLayout title="Blog" description="Artigos e reflexões">
  <h1 class="text-3xl font-bold mb-8">Blog</h1>

  {posts.length === 0 && (
    <p class="text-gray-500">Nenhum artigo publicado ainda.</p>
  )}

  <ul class="flex flex-col gap-8">
    {posts.map((post) => (
      <li>
        <a href={`/blog/${post.slug}`} class="group block">
          <p class="text-sm text-gray-400 mb-1">
            {post.data.date.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <h2 class="text-xl font-semibold group-hover:text-blue-600 transition-colors">
            {post.data.title}
          </h2>
          <p class="text-gray-600 mt-1">{post.data.description}</p>
          <div class="flex gap-2 mt-2 flex-wrap">
            {post.data.tags.map((tag) => (
              <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{tag}</span>
            ))}
          </div>
        </a>
      </li>
    ))}
  </ul>
</BaseLayout>
```

- [ ] **Step 4: Create individual article page**

Create `src/pages/blog/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BaseLayout title={post.data.title} description={post.data.description}>
  <article>
    <header class="mb-8">
      <p class="text-sm text-gray-400 mb-2">
        {post.data.date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}
      </p>
      <h1 class="text-4xl font-bold leading-tight">{post.data.title}</h1>
      <p class="text-gray-600 mt-3 text-lg">{post.data.description}</p>
      <div class="flex gap-2 mt-4 flex-wrap">
        {post.data.tags.map((tag) => (
          <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{tag}</span>
        ))}
      </div>
    </header>

    <div class="prose prose-gray max-w-none">
      <Content />
    </div>

    <div class="mt-12 pt-8 border-t border-gray-200">
      <a href="/blog" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">
        ← Voltar para o blog
      </a>
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 5: Verify blog renders**

```bash
npx astro dev
```

Open `http://localhost:4321/blog`. Expected: "Olá, mundo!" listed.
Click the article. Expected: Full article with Markdown rendered.

Stop the dev server with Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add src/content/ src/pages/blog/
git commit -m "feat: add blog with content collection and sample article"
```

---

## Task 9: Library Data and Page

**Files:**
- Create: `src/data/library.json`
- Create: `src/pages/library/index.astro`
- Create: `src/components/ShareButton.astro` (placeholder)
- Create: `src/components/StarRating.astro` (placeholder)

- [ ] **Step 1: Create library data file**

Create `src/data/library.json`:

```json
{
  "items": [
    {
      "id": "attention-is-all-you-need",
      "title": "Attention Is All You Need",
      "url": "https://arxiv.org/abs/1706.03762",
      "type": "article",
      "theme": "Machine Learning",
      "description": "Paper original da arquitetura Transformer, base dos modelos de linguagem modernos.",
      "personalNote": "Leitura obrigatória para entender LLMs. Denso mas fundamental.",
      "addedAt": "2026-05-27"
    },
    {
      "id": "clean-code",
      "title": "Clean Code — Robert C. Martin",
      "url": "https://www.oreilly.com/library/view/clean-code-a/9780136083238/",
      "type": "link",
      "theme": "Engenharia de Software",
      "description": "Guia clássico para escrever código limpo e manutenível.",
      "personalNote": "Leitura obrigatória para qualquer engenheiro de software.",
      "addedAt": "2026-05-27"
    }
  ]
}
```

- [ ] **Step 2: Create placeholder ShareButton component**

Create `src/components/ShareButton.astro`:

```astro
---
interface Props {
  url: string;
  title: string;
}
const { url, title } = Astro.props;
---

<button class="share-btn text-sm text-gray-500" data-url={url} data-title={title}>
  Compartilhar
</button>
```

- [ ] **Step 3: Create placeholder StarRating component**

Create `src/components/StarRating.astro`:

```astro
---
interface Props {
  itemId: string;
}
const { itemId } = Astro.props;
---

<div class="star-rating" data-item-id={itemId}>
  <span class="text-sm text-gray-400">Sem avaliações</span>
</div>
```

- [ ] **Step 4: Create library page**

Create `src/pages/library/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import ShareButton from '../../components/ShareButton.astro';
import StarRating from '../../components/StarRating.astro';
import libraryData from '../../data/library.json';

const { items } = libraryData;
const themes = [...new Set(items.map((item) => item.theme))].sort();

const typeLabel: Record<string, string> = {
  article: 'Artigo',
  video: 'Vídeo',
  link: 'Link',
};
---

<BaseLayout title="Biblioteca" description="Recursos que estudo e recomendo">
  <div class="mb-12">
    <!-- display-lg: 40px/600 -->
    <h1 class="text-apple-display font-semibold text-apple-ink">Biblioteca</h1>
    <!-- body: 17px/400 -->
    <p class="text-apple-body text-apple-ink-48 mt-2">
      Artigos, vídeos e links que estudo, organizados por tema.
    </p>
  </div>

  <!-- Theme filters: pill-shaped chips — configurator-option-chip grammar -->
  <div class="flex flex-wrap gap-2 mb-10">
    <button
      class="filter-btn px-4 py-[11px] text-apple-caption rounded-full border border-apple-blue bg-apple-blue text-white transition-all"
      data-theme="all"
    >
      Todos
    </button>
    {themes.map((theme) => (
      <button
        class="filter-btn px-4 py-[11px] text-apple-caption rounded-full border border-apple-hairline text-apple-ink hover:border-apple-blue hover:text-apple-blue transition-all"
        data-theme={theme}
      >
        {theme}
      </button>
    ))}
  </div>

  <!-- Cards: store-utility-card grammar — rounded-apple-lg, hairline border, 24px padding -->
  <ul class="flex flex-col gap-4" id="library-list">
    {items.map((item) => (
      <li
        class="library-item rounded-apple-lg border border-apple-hairline p-6"
        data-theme={item.theme}
      >
        <div class="flex items-start justify-between gap-6">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <!-- Type badge: pearl capsule style -->
              <span class="text-apple-caption text-apple-ink-48 bg-apple-parchment px-3 py-1 rounded-full border border-apple-divider">
                {typeLabel[item.type] ?? item.type}
              </span>
              <!-- Theme tag: caption, muted -->
              <span class="text-apple-caption text-apple-ink-48">
                {item.theme}
              </span>
            </div>
            <!-- Title: body-strong (17px/600) -->
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              class="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-apple-ink hover:text-apple-blue transition-colors block"
            >
              {item.title}
            </a>
            <!-- Description: body (17px/400) -->
            <p class="text-apple-body text-apple-ink-48 mt-1">{item.description}</p>
            {item.personalNote && (
              <!-- Personal note: caption, left border rule -->
              <p class="text-apple-caption text-apple-ink-48 mt-3 italic border-l-2 border-apple-hairline pl-3">
                {item.personalNote}
              </p>
            )}
          </div>
          <div class="flex flex-col items-end gap-3 shrink-0">
            <ShareButton url={item.url} title={item.title} />
            <StarRating itemId={item.id} />
          </div>
        </div>
        <p class="text-apple-caption text-apple-ink-48 mt-4">
          Adicionado em {new Date(item.addedAt).toLocaleDateString('pt-BR')}
        </p>
      </li>
    ))}
  </ul>
</BaseLayout>

<script>
  const filterBtns = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
  const libraryItems = document.querySelectorAll<HTMLLIElement>('.library-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('bg-apple-blue', 'text-white', 'border-apple-blue');
        b.classList.add('border-apple-hairline', 'text-apple-ink');
      });
      btn.classList.add('bg-apple-blue', 'text-white', 'border-apple-blue');
      btn.classList.remove('border-apple-hairline', 'text-apple-ink');

      const theme = btn.dataset.theme;
      libraryItems.forEach((item) => {
        item.style.display =
          theme === 'all' || item.dataset.theme === theme ? '' : 'none';
      });
    });
  });
</script>
```

- [ ] **Step 5: Verify library page renders**

```bash
npx astro dev
```

Open `http://localhost:4321/library`. Expected: Two items listed with theme filter buttons ("Todos", "Machine Learning", "Engenharia de Software").

Click "Machine Learning" filter. Expected: Only the Transformer paper is shown, without page reload.

Stop the dev server with Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add src/data/library.json src/pages/library/ src/components/
git commit -m "feat: add library page with theme filter and sample data"
```

---

## Task 10: Share Button Component

**Files:**
- Modify: `src/components/ShareButton.astro`

- [ ] **Step 1: Implement share button with Web Share API**

Replace the full contents of `src/components/ShareButton.astro`:

```astro
---
interface Props {
  url: string;
  title: string;
}
const { url, title } = Astro.props;
---

<!-- text-link style: Action Blue, caption size, no background -->
<button
  class="share-btn text-apple-caption text-apple-blue flex items-center gap-1 hover:opacity-70 transition-opacity active:scale-95"
  data-url={url}
  data-title={title}
  aria-label="Compartilhar"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
  <span class="share-label">Compartilhar</span>
</button>

<script>
  document.querySelectorAll<HTMLButtonElement>('.share-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const url = btn.dataset.url!;
      const title = btn.dataset.title!;
      const label = btn.querySelector('.share-label')!;

      if (navigator.share) {
        try {
          await navigator.share({ title, url });
        } catch {
          // user cancelled — do nothing
        }
      } else {
        await navigator.clipboard.writeText(url);
        label.textContent = 'Copiado!';
        setTimeout(() => {
          label.textContent = 'Compartilhar';
        }, 2000);
      }
    });
  });
</script>
```

- [ ] **Step 2: Verify on desktop**

```bash
npx astro dev
```

Open `http://localhost:4321/library`.
Click "Compartilhar" on any item. Expected: label changes to "Copiado!" for 2 seconds, then reverts.

Stop the dev server with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add src/components/ShareButton.astro
git commit -m "feat: implement share button with Web Share API and clipboard fallback"
```

---

## Task 11: Ratings API

**Files:**
- Create: `src/pages/api/ratings.ts`
- Create: `tests/ratings.test.ts`

- [ ] **Step 1: Write tests for rating logic**

Create `tests/ratings.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';

function computeAverage(total: number, count: number): number {
  if (count === 0) return 0;
  return total / count;
}

function validateVote(vote: unknown): vote is number {
  return typeof vote === 'number' && vote >= 1 && vote <= 5;
}

describe('computeAverage', () => {
  it('returns 0 when count is 0', () => {
    expect(computeAverage(0, 0)).toBe(0);
  });

  it('returns correct average', () => {
    expect(computeAverage(10, 2)).toBe(5);
    expect(computeAverage(7, 2)).toBe(3.5);
  });
});

describe('validateVote', () => {
  it('accepts votes from 1 to 5', () => {
    expect(validateVote(1)).toBe(true);
    expect(validateVote(3)).toBe(true);
    expect(validateVote(5)).toBe(true);
  });

  it('rejects votes outside range', () => {
    expect(validateVote(0)).toBe(false);
    expect(validateVote(6)).toBe(false);
  });

  it('rejects non-numbers', () => {
    expect(validateVote('3')).toBe(false);
    expect(validateVote(null)).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
npm test -- tests/ratings.test.ts
```

Expected: PASS — 6 tests

- [ ] **Step 3: Create ratings API endpoint**

Create `src/pages/api/ratings.ts`:

```typescript
import type { APIRoute } from 'astro';
import { kv } from '@vercel/kv';

export const prerender = false;

function computeAverage(total: number, count: number): number {
  if (count === 0) return 0;
  return total / count;
}

function validateVote(vote: unknown): vote is number {
  return typeof vote === 'number' && vote >= 1 && vote <= 5;
}

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id');
  if (!id) {
    return new Response(JSON.stringify({ error: 'id is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const total = (await kv.get<number>(`rating:total:${id}`)) ?? 0;
  const count = (await kv.get<number>(`rating:count:${id}`)) ?? 0;

  return new Response(
    JSON.stringify({ average: computeAverage(total, count), count }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== 'string' || !validateVote(body.vote)) {
    return new Response(JSON.stringify({ error: 'invalid input' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { id, vote } = body as { id: string; vote: number };
  const total = (await kv.get<number>(`rating:total:${id}`)) ?? 0;
  const count = (await kv.get<number>(`rating:count:${id}`)) ?? 0;

  await kv.set(`rating:total:${id}`, total + vote);
  await kv.set(`rating:count:${id}`, count + 1);

  return new Response(
    JSON.stringify({ average: computeAverage(total + vote, count + 1), count: count + 1 }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/api/ratings.ts tests/ratings.test.ts
git commit -m "feat: add ratings API with Vercel KV"
```

---

## Task 12: Star Rating Component

**Files:**
- Modify: `src/components/StarRating.astro`

- [ ] **Step 1: Implement star rating widget**

Replace the full contents of `src/components/StarRating.astro`:

```astro
---
interface Props {
  itemId: string;
}
const { itemId } = Astro.props;
---

<!-- Single accent color: apple-blue for filled stars, consistent with the design system rule -->
<div class="star-rating flex flex-col items-end gap-1" data-item-id={itemId}>
  <div class="stars flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        class="star text-apple-hairline hover:text-apple-blue transition-colors text-lg leading-none cursor-pointer"
        data-star={star}
        aria-label={`Dar ${star} estrela${star > 1 ? 's' : ''}`}
      >
        ★
      </button>
    ))}
  </div>
  <p class="rating-summary text-apple-caption text-apple-ink-48">Sem avaliações</p>
</div>

<script>
  document.querySelectorAll<HTMLDivElement>('.star-rating').forEach((widget) => {
    const itemId = widget.dataset.itemId!;
    const stars = widget.querySelectorAll<HTMLButtonElement>('.star');
    const summary = widget.querySelector<HTMLParagraphElement>('.rating-summary')!;
    const storageKey = `voted:${itemId}`;

    function updateDisplay(average: number, count: number) {
      const rounded = Math.round(average);
      stars.forEach((star, i) => {
        // apple-blue (#0066cc) for filled; apple-hairline (#e0e0e0) for empty
        star.style.color = i < rounded ? '#0066cc' : '#e0e0e0';
      });
      summary.textContent =
        count > 0
          ? `${average.toFixed(1)} (${count} ${count === 1 ? 'voto' : 'votos'})`
          : 'Sem avaliações';
    }

    async function loadRating() {
      try {
        const res = await fetch(`/api/ratings?id=${itemId}`);
        const { average, count } = await res.json();
        updateDisplay(average, count);
      } catch {
        // API not available locally — leave default state
      }
    }

    if (localStorage.getItem(storageKey)) {
      stars.forEach((s) => {
        s.disabled = true;
        s.style.cursor = 'default';
      });
    }

    stars.forEach((star) => {
      star.addEventListener('click', async () => {
        if (localStorage.getItem(storageKey)) return;
        const vote = Number(star.dataset.star);
        localStorage.setItem(storageKey, String(vote));
        stars.forEach((s) => {
          s.disabled = true;
          s.style.cursor = 'default';
        });
        try {
          const res = await fetch('/api/ratings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: itemId, vote }),
          });
          const { average, count } = await res.json();
          updateDisplay(average, count);
        } catch {
          // silently fail
        }
      });
    });

    loadRating();
  });
</script>
```

- [ ] **Step 2: Verify component renders**

```bash
npx astro dev
```

Open `http://localhost:4321/library`. Expected: 5 star buttons visible for each library item. Stars are gray by default. Hovering turns them yellow. Clicking a star disables further votes (stored in localStorage).

Stop the dev server with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add src/components/StarRating.astro
git commit -m "feat: implement star rating widget with localStorage vote deduplication"
```

---

## Task 13: Telegram Bot Webhook

**Files:**
- Create: `src/pages/api/telegram-webhook.ts`

- [ ] **Step 1: Create the webhook handler**

Create `src/pages/api/telegram-webhook.ts`:

```typescript
import type { APIRoute } from 'astro';
import { Bot, webhookCallback } from 'grammy';
import { kv } from '@vercel/kv';
import { fetchMetadata } from '../../lib/fetch-metadata';
import { classifyTheme } from '../../lib/classify-theme';
import { addLibraryItem } from '../../lib/github-api';
import { slugify, inferType } from '../../lib/slugify';
import type { LibraryItem } from '../../lib/library-schema';

export const prerender = false;

interface PendingItem {
  url: string;
  title: string;
  description: string;
  theme: string;
  personalNote?: string;
}

function isValidUrl(text: string): boolean {
  try {
    const parsed = new URL(text);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

const bot = new Bot(import.meta.env.TELEGRAM_BOT_TOKEN);

bot.on('message:text', async (ctx) => {
  const text = ctx.message.text.trim();
  const chatId = String(ctx.chat.id);
  const pending = await kv.get<PendingItem>(`pending:${chatId}`);

  if (pending) {
    const isConfirm =
      text === '✅' ||
      text.toLowerCase() === 'sim' ||
      text.toLowerCase() === 'confirma';
    const theme = isConfirm ? pending.theme : text;

    const item: LibraryItem = {
      id: slugify(pending.title),
      title: pending.title,
      url: pending.url,
      type: inferType(pending.url),
      theme,
      description: pending.description,
      personalNote: pending.personalNote,
      addedAt: new Date().toISOString().split('T')[0],
    };

    try {
      await addLibraryItem(item);
      await kv.del(`pending:${chatId}`);
      await ctx.reply('✅ Adicionado! O site será atualizado em ~2 minutos.');
    } catch {
      await ctx.reply('❌ Erro ao salvar. Tente novamente.');
    }
    return;
  }

  const pipeIndex = text.indexOf(' | ');
  const url = pipeIndex > -1 ? text.slice(0, pipeIndex).trim() : text;
  const personalNote = pipeIndex > -1 ? text.slice(pipeIndex + 3).trim() : undefined;

  if (!isValidUrl(url)) {
    await ctx.reply(
      'Manda um link válido\\! Exemplo:\n`https://exemplo.com`\n\nOu com nota pessoal:\n`https://exemplo.com | Minha nota sobre o link`',
      { parse_mode: 'MarkdownV2' }
    );
    return;
  }

  await ctx.reply('🔍 Buscando metadados\\.\\.\\.',  { parse_mode: 'MarkdownV2' });

  try {
    const metadata = await fetchMetadata(url);
    const theme = await classifyTheme(metadata.title, metadata.description);

    const pendingItem: PendingItem = {
      url,
      title: metadata.title,
      description: metadata.description,
      theme,
      personalNote,
    };

    await kv.set(`pending:${chatId}`, pendingItem, { ex: 3600 });

    await ctx.reply(
      `📌 *${escapeMarkdown(metadata.title)}*\n\nTema identificado: *${escapeMarkdown(theme)}*\n\nResponda ✅ para confirmar ou escreva o tema correto\\.`,
      { parse_mode: 'MarkdownV2' }
    );
  } catch {
    await ctx.reply('❌ Não consegui acessar esse link\\. Tente outro\\.', {
      parse_mode: 'MarkdownV2',
    });
  }
});

const handler = webhookCallback(bot, 'fetch');

export const POST: APIRoute = async ({ request }) => {
  return handler(request);
};
```

- [ ] **Step 2: Run full test suite to confirm nothing is broken**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/pages/api/telegram-webhook.ts
git commit -m "feat: add Telegram bot webhook with theme classification and GitHub commit"
```

---

## Task 14: Deploy and Wire Up

- [ ] **Step 1: Push repository to GitHub**

Create a new **public** repository on GitHub named `personal-site`, then:

```bash
git remote add origin https://github.com/<your-username>/personal-site.git
git push -u origin main
```

- [ ] **Step 2: Connect repository to Vercel**

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New Project"
3. Import the `personal-site` repository from GitHub
4. Leave framework preset as "Astro" (auto-detected)
5. Click "Deploy"

Expected: First deploy succeeds. Visit the URL shown (e.g., `personal-site-abc.vercel.app`).

- [ ] **Step 3: Add Vercel KV database**

In Vercel dashboard → your project → Storage tab:
1. Click "Create Database" → select "KV"
2. Name it (e.g., `personal-site-kv`) and connect it to the project
3. Vercel automatically injects: `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`

- [ ] **Step 4: Add remaining environment variables**

In Vercel dashboard → Project → Settings → Environment Variables, add:

| Name | Value |
|------|-------|
| `TELEGRAM_BOT_TOKEN` | Your token from @BotFather |
| `GITHUB_TOKEN` | GitHub PAT with "Contents: Read and write" for this repo |
| `GITHUB_REPO` | `<your-username>/personal-site` |
| `ANTHROPIC_API_KEY` | From [console.anthropic.com](https://console.anthropic.com) |

- [ ] **Step 5: Redeploy to apply environment variables**

In Vercel dashboard → Deployments → three dots on the latest → "Redeploy".

- [ ] **Step 6: Register Telegram webhook**

Replace `BOT_TOKEN` and `YOUR_VERCEL_URL` and run:

```bash
curl "https://api.telegram.org/botBOT_TOKEN/setWebhook?url=https://YOUR_VERCEL_URL/api/telegram-webhook"
```

Expected response: `{"ok":true,"result":true,"description":"Webhook was set"}`

- [ ] **Step 7: End-to-end test of the Telegram bot**

1. Open Telegram and send your bot a URL: `https://arxiv.org/abs/1706.03762`
2. Expected: Bot replies "Buscando metadados..." then asks to confirm the theme
3. Reply `✅`
4. Expected: "Adicionado! O site será atualizado em ~2 minutos."
5. Wait ~2 minutes, open `/library` on your deployed site
6. Expected: New resource appears under the correct theme

- [ ] **Step 8: Test Claude Code CLI flow**

To add a resource via Claude Code CLI:
1. Tell Claude: "Adicione este link à biblioteca: https://example.com | Nota pessoal aqui"
2. Claude will fetch metadata, classify the theme, and edit `src/data/library.json`
3. Review the change and run `git push`
4. Expected: Vercel deploys automatically and the resource appears on the site

- [ ] **Step 9: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and deploy verification"
git push
```

---

## Environment Variables Reference

| Variable | Where to get it |
|----------|----------------|
| `TELEGRAM_BOT_TOKEN` | Message @BotFather on Telegram → `/newbot` |
| `GITHUB_TOKEN` | GitHub → Settings → Developer Settings → Fine-grained Personal Access Tokens → "Contents: Read and write" for this repo |
| `GITHUB_REPO` | Format: `username/personal-site` |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys |
| `KV_URL` + 3 others | Auto-added by Vercel when you create the KV database |
