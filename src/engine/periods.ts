import type { Client, ClientType } from './types';

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
      if (!rows.length || rows[rows.length - 1].amount !== amount) rows.push({ from: m, amount, type: c.type, newcomer7: c.newcomer7 });
    }
    return rows.length ? rows : [emptyRow(start, c.type)];
  });
  return streams.length ? streams : [[emptyRow(start)]];
}

export const scaleStreams = (streams: IncomeRow[][], f: number): IncomeRow[][] => streams.map((rows) => rows.map((r) => ({ ...r, amount: Math.round(r.amount * f) })));
