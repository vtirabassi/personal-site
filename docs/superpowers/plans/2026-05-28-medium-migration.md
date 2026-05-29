# Medium Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar artigos do Medium para o site via RSS, ativar `/blog` como listagem completa, e exibir os 3 mais recentes na homepage.

**Architecture:** Script one-shot (`scripts/import-medium.ts`) busca o feed RSS do Medium, converte HTML→Markdown com `turndown`, e escreve arquivos `.md` em `src/content/blog/`. As páginas Astro existentes são ajustadas: `/blog` vira a listagem completa e a homepage exibe os 3 mais recentes.

**Tech Stack:** Astro 5, Vitest, `fast-xml-parser`, `turndown`, `turndown-plugin-gfm`, `tsx` (já disponível via Node), TypeScript.

---

## File Map

| Ação | Arquivo |
|------|---------|
| CREATE | `scripts/import-medium.ts` |
| CREATE | `tests/import-medium.test.ts` |
| MODIFY | `src/pages/blog/index.astro` |
| MODIFY | `src/pages/index.astro` |
| MODIFY | `src/layouts/BaseLayout.astro` |

---

### Task 1: Instalar dependências

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Instalar as libs de parsing e conversão**

```bash
cd /Users/vinicius/code/personal-site
npm install --save-dev fast-xml-parser turndown turndown-plugin-gfm @types/turndown
```

Expected output: packages added to `devDependencies` em `package.json`.

- [ ] **Step 2: Verificar instalação**

```bash
cat package.json | grep -E "fast-xml|turndown"
```

Expected: as 3 entradas aparecem em `devDependencies`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add fast-xml-parser, turndown and gfm plugin for Medium import"
```

---

### Task 2: Funções helpers + testes

**Files:**
- Create: `scripts/import-medium.ts` (só os helpers por enquanto)
- Create: `tests/import-medium.test.ts`

- [ ] **Step 1: Escrever o teste antes de implementar**

Crie `tests/import-medium.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { stripHtml, buildFrontmatter, buildFootnote } from '../scripts/import-medium';

describe('stripHtml', () => {
  it('removes HTML tags', () => {
    expect(stripHtml('<p>Hello <b>world</b></p>')).toBe('Hello world');
  });

  it('collapses whitespace', () => {
    expect(stripHtml('<p>  foo  </p>')).toBe('foo');
  });

  it('returns empty string for empty input', () => {
    expect(stripHtml('')).toBe('');
  });
});

describe('buildFrontmatter', () => {
  it('produces valid YAML frontmatter block', () => {
    const result = buildFrontmatter('My Article', '2024-01-15', 'A short description.');
    expect(result).toContain('title: "My Article"');
    expect(result).toContain('date: 2024-01-15');
    expect(result).toContain('description: "A short description."');
    expect(result).toContain('tags: []');
    expect(result.startsWith('---\n')).toBe(true);
    expect(result.endsWith('\n\n')).toBe(true);
  });

  it('escapes double quotes in title', () => {
    const result = buildFrontmatter('Say "hello"', '2024-01-15', 'desc');
    expect(result).toContain('title: "Say \\"hello\\""');
  });

  it('escapes double quotes in description', () => {
    const result = buildFrontmatter('Title', '2024-01-15', 'She said "hi"');
    expect(result).toContain('description: "She said \\"hi\\""');
  });

  it('truncates description to 200 chars', () => {
    const long = 'a'.repeat(300);
    const result = buildFrontmatter('T', '2024-01-15', long);
    const match = result.match(/description: "([^"]*)"/);
    expect(match![1].length).toBeLessThanOrEqual(200);
  });
});

describe('buildFootnote', () => {
  it('contains the Medium URL as a link', () => {
    const url = 'https://medium.com/@viniciustirabassi/my-article-abc123';
    const result = buildFootnote(url);
    expect(result).toContain(url);
    expect(result).toContain('Publicado originalmente no');
    expect(result).toContain('[Medium]');
  });

  it('starts with a horizontal rule', () => {
    expect(buildFootnote('https://medium.com/x')).toMatch(/^\n\n---\n/);
  });
});
```

- [ ] **Step 2: Rodar os testes — verificar que falham**

```bash
npm test -- --reporter=verbose 2>&1 | grep -E "FAIL|Cannot find|import-medium"
```

Expected: erro de importação pois `scripts/import-medium.ts` não existe ainda.

- [ ] **Step 3: Criar `scripts/import-medium.ts` com os helpers exportados**

```typescript
import { XMLParser } from 'fast-xml-parser';
import TurndownService from 'turndown';
// @ts-ignore — no type declarations for turndown-plugin-gfm
import { gfm } from 'turndown-plugin-gfm';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { slugify } from '../src/lib/slugify';

export interface RssItem {
  title: string;
  pubDate: string;
  link: string;
  description: string;
  htmlContent: string;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function buildFrontmatter(title: string, date: string, description: string): string {
  const escapedTitle = title.replace(/"/g, '\\"');
  const escapedDesc = description.replace(/"/g, '\\"').slice(0, 200);
  return `---\ntitle: "${escapedTitle}"\ndate: ${date}\ndescription: "${escapedDesc}"\ntags: []\n---\n\n`;
}

export function buildFootnote(url: string): string {
  return `\n\n---\n*Publicado originalmente no [Medium](${url}).*\n`;
}

export function buildMarkdownFile(item: RssItem): string {
  const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
  td.use(gfm);

  const date = new Date(item.pubDate).toISOString().split('T')[0];
  const description = stripHtml(item.description);
  const content = td.turndown(item.htmlContent);

  return buildFrontmatter(item.title, date, description) + content + buildFootnote(item.link);
}

const FEED_URL = 'https://medium.com/feed/@viniciustirabassi';
const OUTPUT_DIR = join(process.cwd(), 'src/content/blog');

async function main() {
  const res = await fetch(FEED_URL);
  if (!res.ok) throw new Error(`Falha ao buscar feed: ${res.status}`);
  const xml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    cdataPropName: '__cdata',
    parseTagValue: true,
    trimValues: true,
  });
  const feed = parser.parse(xml);
  const rawItems: any[] = [].concat(feed.rss.channel.item);

  let imported = 0;
  let skipped = 0;

  for (const raw of rawItems) {
    const title: string = raw.title?.__cdata ?? raw.title ?? '(sem título)';
    const slug = slugify(title);
    const filepath = join(OUTPUT_DIR, `${slug}.md`);

    if (existsSync(filepath)) {
      console.log(`Pulando (já existe): ${slug}.md`);
      skipped++;
      continue;
    }

    const item: RssItem = {
      title,
      pubDate: raw.pubDate,
      link: raw.link ?? raw.guid,
      description: raw.description?.__cdata ?? raw.description ?? '',
      htmlContent: raw['content:encoded']?.__cdata ?? raw['content:encoded'] ?? '',
    };

    const markdown = buildMarkdownFile(item);
    writeFileSync(filepath, markdown, 'utf-8');
    console.log(`Importado: ${slug}.md`);
    imported++;
  }

  console.log(`\nConcluído: ${imported} importados, ${skipped} pulados.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
```

- [ ] **Step 4: Rodar os testes — verificar que passam**

```bash
npm test -- --reporter=verbose 2>&1 | grep -E "PASS|FAIL|✓|✗|import-medium"
```

Expected: todos os testes de `import-medium` passam (✓).

- [ ] **Step 5: Commit**

```bash
git add scripts/import-medium.ts tests/import-medium.test.ts
git commit -m "feat: add Medium import script with helper functions and tests"
```

---

### Task 3: Rodar o script de importação

**Files:**
- Modify: `src/content/blog/` (novos arquivos .md gerados)

- [ ] **Step 1: Rodar o script**

```bash
cd /Users/vinicius/code/personal-site
npx tsx scripts/import-medium.ts
```

Expected: linhas `Importado: <slug>.md` para cada artigo do Medium, seguido de `Concluído: N importados, 0 pulados.`

> Se o feed retornar erro de rede, verifique a URL: `curl -I https://medium.com/feed/@viniciustirabassi`

- [ ] **Step 2: Verificar os arquivos gerados**

```bash
ls src/content/blog/
```

Expected: `hello-world.md` (existente) + N novos arquivos `.md`.

- [ ] **Step 3: Inspecionar um arquivo importado para validar frontmatter e rodapé**

```bash
head -10 src/content/blog/$(ls src/content/blog/ | grep -v hello-world | head -1)
```

Expected: bloco `---` com `title`, `date`, `description`, `tags: []`.

```bash
tail -5 src/content/blog/$(ls src/content/blog/ | grep -v hello-world | head -1)
```

Expected: linha com `Publicado originalmente no [Medium](https://medium.com/...)`.

- [ ] **Step 4: Commit dos artigos importados**

```bash
git add src/content/blog/
git commit -m "content: import articles from Medium"
```

---

### Task 4: Ativar `/blog` como listagem completa

**Files:**
- Modify: `src/pages/blog/index.astro`

- [ ] **Step 1: Substituir o redirect pela listagem real**

Substitua TODO o conteúdo de `src/pages/blog/index.astro` por:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export const prerender = true;

const posts = (await getCollection('blog')).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
);
---

<BaseLayout title="Blog — Vinicius Tirabassi" description="Artigos sobre engenharia de software e liderança técnica">
  <h1 class="text-apple-display font-semibold text-apple-ink dark:text-[#f5f5f7] mb-12">Blog</h1>

  {posts.length === 0 && (
    <p class="text-apple-body text-apple-ink-48 dark:text-[#98989d]">Nenhum artigo publicado ainda.</p>
  )}

  <ul class="flex flex-col gap-8">
    {posts.map((post) => (
      <li>
        <a href={`/blog/${post.slug}`} class="group block">
          <p class="text-apple-caption text-apple-ink-48 dark:text-[#6e6e73] mb-1">
            {post.data.date.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <h2 class="text-apple-tagline font-semibold text-apple-ink dark:text-[#f5f5f7] group-hover:text-apple-blue dark:group-hover:text-apple-blue-dark transition-colors">
            {post.data.title}
          </h2>
          <p class="text-apple-body text-apple-ink-48 dark:text-[#98989d] mt-1">{post.data.description}</p>
          <div class="flex gap-2 mt-2 flex-wrap">
            {post.data.tags.map((tag) => (
              <span class="text-apple-caption bg-apple-parchment dark:bg-[#2c2c2e] text-apple-ink-48 dark:text-[#98989d] px-3 py-1 rounded-full border border-apple-divider dark:border-[#3a3a3c]">{tag}</span>
            ))}
          </div>
        </a>
      </li>
    ))}
  </ul>
</BaseLayout>
```

- [ ] **Step 2: Verificar que o build não quebra**

```bash
npm run build 2>&1 | tail -20
```

Expected: sem erros. Warnings de prerender são normais.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: activate /blog as full article listing"
```

---

### Task 5: Atualizar homepage com artigos recentes

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Substituir a listagem completa pelos 3 mais recentes**

Substitua TODO o conteúdo de `src/pages/index.astro` por:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';

const recentPosts = (await getCollection('blog'))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 3);
---

<BaseLayout title="Vinicius Tirabassi" description="Artigos sobre engenharia de software e liderança técnica">
  <section>
    <div class="flex items-baseline justify-between mb-12">
      <h1 class="text-apple-display font-semibold text-apple-ink dark:text-[#f5f5f7]">Artigos recentes</h1>
      <a href="/blog" class="text-apple-body text-apple-blue dark:text-apple-blue-dark hover:opacity-70 transition-opacity shrink-0">
        Ver todos →
      </a>
    </div>

    {recentPosts.length === 0 && (
      <p class="text-apple-body text-apple-ink-48 dark:text-[#98989d]">Nenhum artigo publicado ainda.</p>
    )}

    <ul class="flex flex-col gap-8">
      {recentPosts.map((post) => (
        <li>
          <a href={`/blog/${post.slug}`} class="group block">
            <p class="text-apple-caption text-apple-ink-48 dark:text-[#6e6e73] mb-1">
              {post.data.date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <h2 class="text-apple-tagline font-semibold text-apple-ink dark:text-[#f5f5f7] group-hover:text-apple-blue dark:group-hover:text-apple-blue-dark transition-colors">
              {post.data.title}
            </h2>
            <p class="text-apple-body text-apple-ink-48 dark:text-[#98989d] mt-1">{post.data.description}</p>
          </a>
        </li>
      ))}
    </ul>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Verificar que o build não quebra**

```bash
npm run build 2>&1 | tail -20
```

Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: show 3 recent articles on homepage with link to /blog"
```

---

### Task 6: Adicionar "Blog" na nav

**Files:**
- Modify: `src/layouts/BaseLayout.astro:59`

- [ ] **Step 1: Adicionar link "Blog" na navegação**

Em `src/layouts/BaseLayout.astro`, localize a linha:

```html
          <a href="/sobre"    class="text-apple-nav text-white/80 hover:text-white transition-colors">Sobre</a>
```

Adicione a linha do Blog logo abaixo:

```html
          <a href="/sobre"    class="text-apple-nav text-white/80 hover:text-white transition-colors">Sobre</a>
          <a href="/blog"     class="text-apple-nav text-white/80 hover:text-white transition-colors">Blog</a>
```

- [ ] **Step 2: Verificar build final**

```bash
npm run build 2>&1 | tail -20
```

Expected: sem erros.

- [ ] **Step 3: Rodar os testes**

```bash
npm test
```

Expected: todos passam.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add Blog link to main nav"
```

---

### Task 7: Verificação final e deploy

- [ ] **Step 1: Checar os arquivos do blog importados**

```bash
ls src/content/blog/ | wc -l
```

Expected: pelo menos 2 arquivos (hello-world + artigos do Medium).

- [ ] **Step 2: Build limpo**

```bash
npm run build 2>&1 | grep -E "error|Error|✓|built"
```

Expected: sem erros, build concluído.

- [ ] **Step 3: Checar todos os testes passam**

```bash
npm test -- --reporter=verbose
```

Expected: todos os testes passam, nenhum falha.

- [ ] **Step 4: Deploy**

```bash
git push
```

Expected: Vercel inicia deploy (~2 min). Verificar em https://personal-site-chi-seven-12.vercel.app
