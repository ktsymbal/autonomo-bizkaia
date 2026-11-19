import { defaultInput } from '../engine/activity';
import type { CalcInput, Client, ClientType } from '../engine/types';
import { clientsToStreams, streamsToClients, type Income, type IncomeRow } from '../engine/periods';

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
  const { asOf: _asOf, ...rest } = input;
  const { clients: _c, ...lean } = rest;
  const d = input.income.mode === 'periods' ? lean : rest; // in periods mode the clients are derived, so the link stays short
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

const TYPES: ClientType[] = ['es_company', 'es_private', 'eu_company', 'non_eu_company'];
const okRow = (r: any): r is IncomeRow => r && Number.isInteger(r.from) && r.from >= 0 && r.from < 12 && typeof r.amount === 'number' && TYPES.includes(r.type);

/** Income periods from a link; links made before periods existed are rebuilt from their per-client months. */
function readIncome(v: any, clients: Client[]): Income {
  if (v && Array.isArray(v.streams)) {
    const streams = v.streams.filter(Array.isArray).map((rows: any[]) => rows.filter(okRow).map((r) => ({ from: r.from, amount: r.amount, type: r.type, newcomer7: !!r.newcomer7 }))).filter((rows: IncomeRow[]) => rows.length);
    if (streams.length) return { mode: v.mode === 'byMonth' ? 'byMonth' : 'periods', streams };
  }
  const streams = clientsToStreams(clients);
  return { mode: streams.some((rows) => rows.length > 3) ? 'byMonth' : 'periods', streams };
}

export function decode(hash: string, asOf: string): CalcInput {
  const def = defaultInput(asOf);
  if (!hash.startsWith(PREFIX)) return def;
  try {
    const parsed = JSON.parse(fromB64url(hash.slice(PREFIX.length)));
    if (parsed?.v !== VERSION || typeof parsed.d !== 'object') return def;
    for (const k of ['fx', 'fxDate', 'fxByMonth']) delete parsed.d[k]; // fields from links made before currencies were removed
    const out = merge(def, parsed.d);
    out.income = readIncome(parsed.d.income, out.clients);
    if (out.income.mode === 'periods') out.clients = streamsToClients(out.income.streams);
    // nullable objects: accept a stored object even though the default is null
    if ('alta' in parsed.d) out.alta = parsed.d.alta && typeof parsed.d.alta.year === 'number' ? { year: parsed.d.alta.year, month: Number(parsed.d.alta.month) || 1 } : null;
    if (parsed.d.salary && typeof parsed.d.salary.grossMonthly === 'number') out.salary = { grossMonthly: parsed.d.salary.grossMonthly, withheldMonthly: typeof parsed.d.salary.withheldMonthly === 'number' ? parsed.d.salary.withheldMonthly : null, shortContract: !!parsed.d.salary.shortContract };
    return { ...out, asOf };
  } catch {
    return def;
  }
}
