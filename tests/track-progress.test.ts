import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCompletedModules, markModuleComplete, calcProgressPercent } from '../src/lib/track-progress';

// Mock localStorage (not available in Node test environment)
const store: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem:    (k: string) => store[k] ?? null,
  setItem:    (k: string, v: string) => { store[k] = v; },
  clear:      () => { Object.keys(store).forEach(k => delete store[k]); },
  removeItem: (k: string) => { delete store[k]; },
});

describe('getCompletedModules', () => {
  beforeEach(() => localStorage.clear());

  it('returns empty array when no data exists for slug', () => {
    expect(getCompletedModules('unknown-track')).toEqual([]);
  });

  it('returns the completedModules array for a known slug', () => {
    localStorage.setItem('track-progress-my-track', JSON.stringify({
      completedModules: [1, 2, 3],
      lastUpdated: 0,
    }));
    expect(getCompletedModules('my-track')).toEqual([1, 2, 3]);
  });

  it('returns empty array when stored JSON is malformed', () => {
    localStorage.setItem('track-progress-bad', 'not-valid-json');
    expect(getCompletedModules('bad')).toEqual([]);
  });

  it('returns empty array when completedModules field is missing', () => {
    localStorage.setItem('track-progress-empty', JSON.stringify({ lastUpdated: 0 }));
    expect(getCompletedModules('empty')).toEqual([]);
  });
});

describe('markModuleComplete', () => {
  beforeEach(() => localStorage.clear());

  it('adds module order to the completed list', () => {
    markModuleComplete('my-track', 1);
    expect(getCompletedModules('my-track')).toContain(1);
  });

  it('does not add duplicate entries', () => {
    markModuleComplete('my-track', 2);
    markModuleComplete('my-track', 2);
    expect(getCompletedModules('my-track')).toEqual([2]);
  });

  it('keeps the list sorted in ascending order', () => {
    markModuleComplete('my-track', 3);
    markModuleComplete('my-track', 1);
    markModuleComplete('my-track', 2);
    expect(getCompletedModules('my-track')).toEqual([1, 2, 3]);
  });

  it('writes a lastUpdated timestamp', () => {
    const before = Date.now();
    markModuleComplete('my-track', 1);
    const raw = JSON.parse(localStorage.getItem('track-progress-my-track')!);
    expect(raw.lastUpdated).toBeGreaterThanOrEqual(before);
  });
});

describe('calcProgressPercent', () => {
  it('returns 0 when totalCount is 0', () => {
    expect(calcProgressPercent(0, 0)).toBe(0);
  });

  it('returns 100 when all modules are complete', () => {
    expect(calcProgressPercent(8, 8)).toBe(100);
  });

  it('returns a rounded percentage', () => {
    expect(calcProgressPercent(3, 8)).toBe(38); // 3/8 = 0.375 → 38%
  });

  it('returns 0 when no modules are complete', () => {
    expect(calcProgressPercent(0, 8)).toBe(0);
  });
});
