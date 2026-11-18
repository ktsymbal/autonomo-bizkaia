import { defaultInput } from '../engine/activity';
import type { CalcInput } from '../engine/types';

const PREFIX = '#calc=';
const VERSION = 1;

function toB64url(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromB64url(s: string): string {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

/** Everything except asOf goes into the fragment (never sent to a server). */
export function encode(input: CalcInput): string {
  const { asOf: _asOf, fx: _fx, fxDate: _fxDate, fxByMonth: _fxm, ...d } = input; // rates always come fresh from the build
  return PREFIX + toB64url(JSON.stringify({ v: VERSION, d }));
}

/** Keep a stored value only if it has the same JSON shape as the default. */
function sameShape(def: unknown, val: unknown): boolean {
  if (def === null) return val === null || typeof val === 'object' || typeof val === 'number';
  if (Array.isArray(def)) return Array.isArray(val);
  if (typeof def === 'object') return typeof val === 'object' && val !== null && !Array.isArray(val);
  return typeof def === typeof val;
}

function merge<T>(def: T, val: unknown): T {
  if (!sameShape(def, val)) return def;
  if (def && typeof def === 'object' && !Array.isArray(def) && val && typeof val === 'object') {
    const out: Record<string, unknown> = { ...(def as Record<string, unknown>) };
    for (const k of Object.keys(out)) if (k in (val as object)) out[k] = merge(out[k], (val as Record<string, unknown>)[k]);
    return out as T;
  }
  return val as T;
}

export function decode(hash: string, asOf: string): CalcInput {
  const def = defaultInput(asOf);
  if (!hash.startsWith(PREFIX)) return def;
  try {
    const parsed = JSON.parse(fromB64url(hash.slice(PREFIX.length)));
    if (parsed?.v !== VERSION || typeof parsed.d !== 'object') return def;
    delete parsed.d.fx;
    delete parsed.d.fxDate;
    delete parsed.d.fxByMonth;
    const out = merge(def, parsed.d);
    // nullable objects: accept a stored object even though the default is null
    if ('alta' in parsed.d) out.alta = parsed.d.alta && typeof parsed.d.alta.year === 'number' ? { year: parsed.d.alta.year, month: Number(parsed.d.alta.month) || 1 } : null;
    if (parsed.d.salary && typeof parsed.d.salary.grossMonthly === 'number') out.salary = { grossMonthly: parsed.d.salary.grossMonthly, withheldMonthly: typeof parsed.d.salary.withheldMonthly === 'number' ? parsed.d.salary.withheldMonthly : null, shortContract: !!parsed.d.salary.shortContract };
    return { ...out, asOf };
  } catch {
    return def;
  }
}
