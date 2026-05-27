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
