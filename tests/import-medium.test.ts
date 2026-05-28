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
