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
