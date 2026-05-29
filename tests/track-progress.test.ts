import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCompletedResources, toggleResourceComplete, calcProgressPercent } from '../src/lib/track-progress';

const store: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem:    (k: string) => store[k] ?? null,
  setItem:    (k: string, v: string) => { store[k] = v; },
  clear:      () => { Object.keys(store).forEach(k => delete store[k]); },
  removeItem: (k: string) => { delete store[k]; },
});

describe('getCompletedResources', () => {
  beforeEach(() => localStorage.clear());

  it('returns empty array when no data exists', () => {
    expect(getCompletedResources('unknown-track')).toEqual([]);
  });

  it('returns the completedResources array for a known slug', () => {
    localStorage.setItem('track-progress-my-track', JSON.stringify({
      completedResources: ['1-0', '1-1', '2-0'],
      lastUpdated: 0,
    }));
    expect(getCompletedResources('my-track')).toEqual(['1-0', '1-1', '2-0']);
  });

  it('returns empty array when stored JSON is malformed', () => {
    localStorage.setItem('track-progress-bad', 'not-valid-json');
    expect(getCompletedResources('bad')).toEqual([]);
  });

  it('returns empty array when completedResources field is missing', () => {
    localStorage.setItem('track-progress-empty', JSON.stringify({ lastUpdated: 0 }));
    expect(getCompletedResources('empty')).toEqual([]);
  });
});

describe('toggleResourceComplete', () => {
  beforeEach(() => localStorage.clear());

  it('adds a resource ID when not yet completed', () => {
    toggleResourceComplete('my-track', '1-0');
    expect(getCompletedResources('my-track')).toContain('1-0');
  });

  it('removes a resource ID when already completed (toggle off)', () => {
    toggleResourceComplete('my-track', '1-0');
    toggleResourceComplete('my-track', '1-0');
    expect(getCompletedResources('my-track')).not.toContain('1-0');
  });

  it('does not duplicate IDs', () => {
    toggleResourceComplete('my-track', '2-1');
    toggleResourceComplete('my-track', '2-1');
    toggleResourceComplete('my-track', '2-1');
    expect(getCompletedResources('my-track').filter(id => id === '2-1').length).toBe(1);
  });

  it('writes a lastUpdated timestamp', () => {
    const before = Date.now();
    toggleResourceComplete('my-track', '3-0');
    const raw = JSON.parse(localStorage.getItem('track-progress-my-track')!);
    expect(raw.lastUpdated).toBeGreaterThanOrEqual(before);
  });

  it('can track multiple resources independently', () => {
    toggleResourceComplete('my-track', '1-0');
    toggleResourceComplete('my-track', '1-1');
    toggleResourceComplete('my-track', '2-0');
    expect(getCompletedResources('my-track')).toEqual(expect.arrayContaining(['1-0', '1-1', '2-0']));
    expect(getCompletedResources('my-track')).toHaveLength(3);
  });
});

describe('calcProgressPercent', () => {
  it('returns 0 when totalCount is 0', () => {
    expect(calcProgressPercent(0, 0)).toBe(0);
  });

  it('returns 100 when all resources are complete', () => {
    expect(calcProgressPercent(18, 18)).toBe(100);
  });

  it('returns a rounded percentage', () => {
    expect(calcProgressPercent(3, 8)).toBe(38);
  });

  it('returns 0 when no resources are complete', () => {
    expect(calcProgressPercent(0, 18)).toBe(0);
  });
});
