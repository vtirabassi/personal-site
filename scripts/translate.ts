import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const client = new Anthropic();

async function translateMarkdown(ptContent: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Translate the following Markdown file from Portuguese (PT-BR) to English (EN-US).

Rules:
- Translate all human-readable text (titles, descriptions, body text, list items).
- Keep YAML frontmatter keys unchanged; only translate the values.
- Keep technical terms in English (they are already English): e.g. "agentes", "sprint", "ticket", "prompt", "AI", "API", "MCP", brand names, code snippets.
- Keep all URLs unchanged.
- Keep all Markdown formatting (headings, bold, italic, lists, code blocks) unchanged.
- Do NOT add explanations or comments — output ONLY the translated Markdown.

---

${ptContent}`,
      },
    ],
  });

  const block = message.content.find((b) => b.type === 'text');
  if (!block || block.type !== 'text') throw new Error('Empty response from Claude');
  return block.text.trim();
}

async function translateDir(srcDir: string, destDir: string, label: string) {
  if (!existsSync(srcDir)) return;
  mkdirSync(destDir, { recursive: true });

  const entries = readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(srcDir, entry.name);
    const destPath = join(destDir, entry.name);

    if (entry.isDirectory()) {
      await translateDir(srcPath, destPath, label);
      continue;
    }

    if (!entry.name.endsWith('.md')) continue;
    if (existsSync(destPath)) {
      console.log(`  skip (exists): ${label}/${entry.name}`);
      continue;
    }

    console.log(`  translating: ${label}/${entry.name}`);
    const content = readFileSync(srcPath, 'utf-8');
    const translated = await translateMarkdown(content);
    writeFileSync(destPath, translated, 'utf-8');
  }
}

async function translateLibrary() {
  const libPath = 'src/data/library.json';
  const data = JSON.parse(readFileSync(libPath, 'utf-8'));
  let changed = false;

  for (const item of data.items) {
    if (!item.title_en) {
      console.log(`  translating library item: ${item.title.slice(0, 50)}`);
      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: `Translate this library item from PT-BR to EN-US. Keep technical terms in English. Respond with JSON only, no explanation.\n\n{"title":"${item.title}","description":"${item.description}"}`,
          },
        ],
      });
      const block = message.content.find((b) => b.type === 'text');
      if (!block || block.type !== 'text') continue;
      try {
        const parsed = JSON.parse(block.text.trim());
        item.title_en = parsed.title;
        item.description_en = parsed.description;
        changed = true;
      } catch {
        console.warn(`  failed to parse translation for: ${item.title}`);
      }
    }
  }

  if (changed) {
    writeFileSync(libPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    console.log('  library.json updated');
  }
}

async function main() {
  console.log('Translating blog...');
  await translateDir('src/content/blog', 'src/content/blog-en', 'blog');

  console.log('Translating tracks...');
  await translateDir('src/content/tracks', 'src/content/tracks-en', 'tracks');

  console.log('Translating track-modules...');
  await translateDir('src/content/track-modules', 'src/content/track-modules-en', 'track-modules');

  console.log('Translating library items...');
  await translateLibrary();

  console.log('Done.');
}

main().catch((err) => { console.error(err); process.exit(1); });
