import uk from './uk.json';
import en from './en.json';

export type Lang = 'uk' | 'en';
export const LANGS: Lang[] = ['uk', 'en'];
const DICTS: Record<Lang, Record<string, unknown>> = { uk, en };

export type Vars = Record<string, string | number>;

/** Look up a string and fill {placeholders}. Missing keys show the key, so gaps are visible. */
export function t(lang: Lang, key: string, vars: Vars = {}): string {
  const v = DICTS[lang][key];
  const s = typeof v === 'string' ? v : key;
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export function tList(lang: Lang, key: string): string[] {
  const v = DICTS[lang][key];
  return Array.isArray(v) ? (v as string[]) : [];
}

const locale = (lang: Lang) => (lang === 'uk' ? 'uk-UA' : 'en-GB');

export function eur(lang: Lang, x: number, cents = false): string {
  return new Intl.NumberFormat(locale(lang), { style: 'currency', currency: 'EUR', currencyDisplay: 'narrowSymbol', minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 }).format(x);
}
export function num(lang: Lang, x: number, digits = 0): string {
  return new Intl.NumberFormat(locale(lang), { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(x);
}
export function pct(lang: Lang, x: number, digits = 1): string {
  return new Intl.NumberFormat(locale(lang), { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: digits }).format(x);
}
/** ISO date (YYYY-MM-DD) → "25 квітня" / "25 April"; with year when it differs from `year`. */
export function date(lang: Lang, iso: string, year?: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', timeZone: 'UTC' };
  if (year === undefined || y !== year) opts.year = 'numeric';
  return new Intl.DateTimeFormat(locale(lang), opts).format(new Date(Date.UTC(y, m - 1, d)));
}
