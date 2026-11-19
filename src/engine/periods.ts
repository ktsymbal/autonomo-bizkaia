import type { CalcInput, Client, ClientType } from './types';

/** From month `from` (0 = January) until the next row of the same stream: `amount` a month from this kind of client. */
export type IncomeRow = { from: number; amount: number; type: ClientType; newcomer7: boolean };
/** One stream is one line of work over the year (a raise or a job change is a new row); parallel clients are separate streams. */
export type Income = { mode: 'periods' | 'byMonth'; streams: IncomeRow[][] };

export const emptyRow = (from = 0, type: ClientType = 'non_eu_company'): IncomeRow => ({ from, amount: 0, type, newcomer7: false });

export function sortRows(rows: IncomeRow[]): IncomeRow[] {
  return [...rows].sort((a, b) => a.from - b.from);
}

/** Expand the periods into the engine's per-client months: one client per (stream, client type). */
export function streamsToClients(streams: IncomeRow[][]): Client[] {
  const out: Client[] = [];
  streams.forEach((rows) => {
    const sorted = sortRows(rows);
    const byType = new Map<string, Client>();
    sorted.forEach((row, k) => {
      const end = k + 1 < sorted.length ? sorted[k + 1].from : 12;
      const key = `${row.type}|${row.newcomer7}`;
      let c = byType.get(key);
      if (!c) {
        c = { name: '', type: row.type, newcomer7: row.newcomer7, months: Array.from({ length: 12 }, () => ({ amount: 0 })) };
        byType.set(key, c);
        out.push(c);
      }
      for (let m = Math.max(0, row.from); m < Math.min(12, end); m++) c.months[m] = { amount: row.amount };
    });
  });
  return out.length ? out : [{ name: '', type: 'non_eu_company', newcomer7: false, months: Array.from({ length: 12 }, () => ({ amount: 0 })) }];
}

/** Turn per-client months back into periods: a new row wherever the monthly amount changes. */
export function clientsToStreams(clients: Client[], start = 0): IncomeRow[][] {
  const streams = clients.map((c) => {
    const rows: IncomeRow[] = [];
    for (let m = start; m < 12; m++) {
      const amount = c.months[m]?.amount ?? 0;
      if (!rows.length && !amount) continue; // a client starts at its first paid month
      if (!rows.length || rows[rows.length - 1].amount !== amount) rows.push({ from: m, amount, type: c.type, newcomer7: c.newcomer7 });
    }
    return rows.length ? rows : [emptyRow(start, c.type)];
  });
  return streams.length ? streams : [[emptyRow(start)]];
}

export const scaleStreams = (streams: IncomeRow[][], f: number): IncomeRow[][] => streams.map((rows) => rows.map((r) => ({ ...r, amount: Math.round(r.amount * f) })));

/** In periods mode the per-client months are rebuilt from the periods, and when you registered this year
 *  the registration month is the first month with income (one question, not two). */
export function applyPeriods(i: CalcInput): CalcInput {
  if (i.income.mode !== 'periods') return i;
  const out = { ...i, clients: streamsToClients(i.income.streams) };
  if (i.alta && i.alta.year === i.year) {
    const first = Math.min(...i.income.streams.map((rows) => Math.min(...rows.map((r) => r.from))));
    if (Number.isFinite(first) && first + 1 !== i.alta.month) out.alta = { ...i.alta, month: first + 1 };
  }
  return out;
}

/* ---------- One client as the form shows it ---------- */

/** A client card: who pays, the amounts from each month, and the last month (null = still working). A trailing zero row stores the end. */
export function clientView(rows: IncomeRow[]): { type: ClientType; newcomer7: boolean; rows: IncomeRow[]; until: number | null } {
  const sorted = sortRows(rows);
  const tail = sorted[sorted.length - 1];
  const ended = sorted.length > 1 && tail.amount === 0;
  return { type: sorted[0].type, newcomer7: sorted[0].newcomer7, rows: ended ? sorted.slice(0, -1) : sorted, until: ended ? tail.from - 1 : null };
}

export function setUntil(rows: IncomeRow[], until: number | null): IncomeRow[] {
  const v = clientView(rows);
  const kept = v.rows.filter((r) => until === null || r.from <= until);
  const base = kept.length ? kept : [v.rows[0]];
  return until === null || until >= 11 ? base : [...base, { ...base[0], from: until + 1, amount: 0 }];
}

export const setClient = (rows: IncomeRow[], type: ClientType, newcomer7: boolean): IncomeRow[] => rows.map((r) => ({ ...r, type, newcomer7 }));

/** Replace the visible rows of a client, keeping its end month. */
export function setRows(rows: IncomeRow[], visible: IncomeRow[]): IncomeRow[] {
  const v = clientView(rows);
  return setUntil(sortRows(visible), v.until);
}

/** Links from before client cards could mix client types in one stream; split them into one client per run of the same type. */
export function splitByClient(streams: IncomeRow[][]): IncomeRow[][] {
  const out: IncomeRow[][] = [];
  for (const rows of streams) {
    let cur: IncomeRow[] = [];
    for (const r of sortRows(rows)) {
      const head = cur[0];
      if (head && r.amount > 0 && (r.type !== head.type || r.newcomer7 !== head.newcomer7)) {
        const tail = cur[cur.length - 1];
        if (tail.amount > 0) cur.push({ ...head, from: r.from, amount: 0 });
        out.push(cur);
        cur = [];
      }
      cur.push(cur[0] && r.amount === 0 ? { ...r, type: cur[0].type, newcomer7: cur[0].newcomer7 } : r);
    }
    if (cur.length) out.push(cur);
  }
  return out;
}
