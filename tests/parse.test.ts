import { describe, it, expect } from 'vitest';
import { parse } from '../src/components/ui';

describe('number input parsing', () => {
  it('English: commas group thousands', () => {
    expect(parse('4,791.66', 'en')).toBe(4791.66);
    expect(parse('7,100', 'en')).toBe(7100);
    expect(parse('1,234,567', 'en')).toBe(1234567);
    expect(parse('4791,66', 'en')).toBe(4791.66);
  });
  it('Ukrainian: spaces group, comma or dot is the decimal mark', () => {
    expect(parse('4 791,66', 'uk')).toBe(4791.66);
    expect(parse('4 791,66', 'uk')).toBe(4791.66);
    expect(parse('4791.66', 'uk')).toBe(4791.66);
    expect(parse('7 100', 'uk')).toBe(7100);
  });
  it('round-trips what the field displays', () => {
    for (const [lang, loc] of [['en', 'en-GB'], ['uk', 'uk-UA']] as const) {
      for (const v of [7100, 4791.66, 9583.33, 0.5]) {
        expect(parse(new Intl.NumberFormat(loc, { maximumFractionDigits: 2 }).format(v), lang)).toBe(v);
      }
    }
  });
  it('empty and junk', () => {
    expect(parse('', 'en')).toBeNull();
    expect(Number.isNaN(parse('abc', 'uk') as number)).toBe(true);
  });
});
