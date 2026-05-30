import { describe, it, expect } from 'vitest';
import { ui } from '../src/i18n/ui';

describe('ui dictionary', () => {
  it('pt and en have the same top-level keys', () => {
    expect(Object.keys(ui.pt).sort()).toEqual(Object.keys(ui.en).sort());
  });

  it('pt.nav and en.nav have the same keys', () => {
    expect(Object.keys(ui.pt.nav).sort()).toEqual(Object.keys(ui.en.nav).sort());
  });

  it('pt.search and en.search have the same keys', () => {
    expect(Object.keys(ui.pt.search).sort()).toEqual(Object.keys(ui.en.search).sort());
  });

  it('both have 12 month names', () => {
    expect(ui.pt.monthNames).toHaveLength(12);
    expect(ui.en.monthNames).toHaveLength(12);
  });
});
