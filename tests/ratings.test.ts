import { describe, it, expect } from 'vitest';

function computeAverage(total: number, count: number): number {
  if (count === 0) return 0;
  return total / count;
}

function validateVote(vote: unknown): vote is number {
  return typeof vote === 'number' && vote >= 1 && vote <= 5;
}

describe('computeAverage', () => {
  it('returns 0 when count is 0', () => {
    expect(computeAverage(0, 0)).toBe(0);
  });

  it('returns correct average', () => {
    expect(computeAverage(10, 2)).toBe(5);
    expect(computeAverage(7, 2)).toBe(3.5);
  });
});

describe('validateVote', () => {
  it('accepts votes from 1 to 5', () => {
    expect(validateVote(1)).toBe(true);
    expect(validateVote(3)).toBe(true);
    expect(validateVote(5)).toBe(true);
  });

  it('rejects votes outside range', () => {
    expect(validateVote(0)).toBe(false);
    expect(validateVote(6)).toBe(false);
  });

  it('rejects non-numbers', () => {
    expect(validateVote('3')).toBe(false);
    expect(validateVote(null)).toBe(false);
  });
});
