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
