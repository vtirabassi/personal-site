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
  const escapedDesc = description.slice(0, 200).replace(/"/g, '\\"');
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
