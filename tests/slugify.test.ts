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
