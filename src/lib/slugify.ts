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
