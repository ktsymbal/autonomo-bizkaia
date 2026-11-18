import { describe, it, expect } from 'vitest';
import uk from '../src/i18n/uk.json';
import en from '../src/i18n/en.json';
import { t, eur, date } from '../src/i18n/t';

describe('i18n', () => {
  it('uk and en have identical key sets', () => {
    expect(Object.keys(uk).sort()).toEqual(Object.keys(en).sort());
  });
  it('placeholders are filled', () => {
    expect(t('en', 'res.headline', { year: 2026 })).toBe('In 2026 you keep');
  });
  it('formats euros per locale', () => {
    expect(eur('en', 4140)).toBe('€4,140');
    expect(eur('uk', 4140).replace(/\s/g, ' ')).toBe('4 140 €');
  });
  it('formats dates', () => {
    expect(date('en', '2026-04-25', 2026)).toBe('25 April');
    expect(date('en', '2027-01-31', 2026)).toBe('31 January 2027');
  });
});
