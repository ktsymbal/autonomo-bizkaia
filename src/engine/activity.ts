import type { Params } from '../params';
import type { CalcInput, Client, MonthRow, YM } from './types';
import { emptyRow } from './periods';

const months = (amount: number) => Array.from({ length: 12 }, () => ({ amount }));

export function defaultClient(type: Client['type'] = 'non_eu_company', amount = 0, name = ''): Client {
  return { name, type, months: months(amount), newcomer7: false };
}

const defaultYear = (asOf: string): 2026 | 2027 => (Number(asOf.slice(0, 4)) >= 2027 ? 2027 : 2026);

/** The `abroad` persona defaults: registered since January of the current year. */
export function defaultInput(asOf: string): CalcInput {
  return {
    year: defaultYear(asOf),
    asOf,
    persona: 'abroad',
    alta: { year: defaultYear(asOf), month: 1 },
    clients: [defaultClient('non_eu_company', 0)],
    income: { mode: 'periods', streams: [[emptyRow()]] },
    expenseMode: 'pct',
    expensePct: 5,
    expenses: [],
    under36: false,
    rentMonthly: 0,
    leaseFrom2026: true,
    partner: false,
    kidsUnder6: 0,
    kids6to30: 0,
    largeFamily: false,
    startup: { claim: false, sex: 'w' },
    priorD: null,
    epsv: 0,
    purchaseAnnual: 0,
    purchaseThisYear: false,
    purchaseFrom2026: false,
    disability: 0,
    ascendants: 0,
    age65: 'no',
    widow: false,
    carer: 'none',
    womenReturnYears: 0,
    menChildcare: false,
    partnerGross: null,
    salary: null,
    retaBase: null,
    tpEligible: true,
    settings: { r2: 'A', s1: 'off', s2: false },
  };
}

/**
 * Registration month. "Not yet" = the month after asOf, except from October on,
 * where a 1–3 month first year would be a misleading headline: then 1 January next year.
 */
export function effectiveAlta(input: CalcInput): YM {
  if (input.alta) return input.alta;
  const y = Number(input.asOf.slice(0, 4));
  const m = Number(input.asOf.slice(5, 7));
  return m >= 10 ? { year: y + 1, month: 1 } : { year: y, month: m + 1 };
}

/** Years since alta: 0 in the alta year. Negative = before alta. */
export function yearIdx(input: CalcInput): number {
  return input.year - effectiveAlta(input).year;
}

/** Months before the current one have already happened; the current month and later are an estimate. */
export function isPast(input: CalcInput, m: number): boolean {
  const y = Number(input.asOf.slice(0, 4));
  const cur = Number(input.asOf.slice(5, 7)) - 1;
  return input.year < y || (input.year === y && m < cur);
}

export function isActive(input: CalcInput, m: number): boolean {
  const a = effectiveAlta(input);
  return input.year > a.year || (input.year === a.year && m + 1 >= a.month);
}

export function activityLedger(input: CalcInput, p: Params): MonthRow[] {
  const iva = p.get('iva.general');
  const ret = p.get('retencion');
  const yi = yearIdx(input);
  const rows: MonthRow[] = [];
  for (let m = 0; m < 12; m++) {
    const row: MonthRow = { m, active: isActive(input, m), income: 0, ivaOut: 0, retencion: 0, incomeWithRet: 0, expenses: 0, ivaIn: 0, forecast: false };
    if (row.active) {
      for (const c of input.clients) {
        const mo = c.months[m];
        if (!mo) continue;
        const eur = mo.amount;
        if (mo.amount && !isPast(input, m)) row.forecast = true;
        row.income += eur;
        if (c.type === 'es_company' || c.type === 'es_private') row.ivaOut += eur * iva;
        if (c.type === 'es_company') {
          const rate = c.newcomer7 && yi <= 2 ? ret.newcomer : ret.std;
          row.retencion += eur * rate;
          row.incomeWithRet += eur;
        }
      }
      if (input.expenseMode === 'pct') row.expenses = (row.income * input.expensePct) / 100;
      else if (input.expenseMode === 'itemized') {
        for (const e of input.expenses) {
          if (e.ivaIncluded && !e.foreign) {
            const base = e.monthly / (1 + iva);
            row.expenses += base;
            row.ivaIn += e.monthly - base;
          } else row.expenses += e.monthly; // foreign: reverse charge nets to 0
        }
      }
    }
    rows.push(row);
  }
  return rows;
}
