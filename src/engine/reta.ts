import type { Params, Tramo } from '../params';
import { effectiveAlta } from './activity';
import type { CalcInput, MonthRow, YM } from './types';

export type RetaRegime = 'none' | 'tp' | 'tpExt' | 'tramo';
export type RetaMonth = { m: number; cuota: number; regime: RetaRegime; base: number };
export type RetaYear = {
  months: RetaMonth[];
  total: number;
  tpEnd: YM | null; // last month of the (first) tarifa plana period
  tramo: (Tramo & { index: number }) | null; // tramo implied by this year's income (null if no tramo months)
  rendSSMonthly: number; // after the 7 % generic deduction
  extensionEligible: boolean;
  regularisation: number; // >0 to pay, <0 refund; settled ~Jan–Apr of year+2
};

const cents = (x: number) => Math.round(x * 100) / 100;

/** Monthly cuotas are charged in whole cents. */
export function tarifaPlanaCuota(p: Params): number {
  return cents(p.get('reta.tarifaPlana') + p.get('reta.mei') * p.get('reta.tarifaPlanaMeiBase'));
}

export function tramoFor(rendMonthly: number, p: Params): Tramo & { index: number } {
  const t = p.get('reta.tramos');
  const i = t.findIndex((r) => r.upTo === null || rendMonthly <= r.upTo);
  return { ...t[i], index: i };
}

/** Months since alta (0 = alta month). */
function sinceAlta(input: CalcInput, m: number): number {
  const a = effectiveAlta(input);
  return (input.year - a.year) * 12 + m - (a.month - 1);
}

function addMonths(ym: YM, n: number): YM {
  const z = ym.year * 12 + (ym.month - 1) + n;
  return { year: Math.floor(z / 12), month: (z % 12) + 1 };
}

/**
 * RETA for the input's year. `tierPct` is the simplificada % (art. 28 NF), applied to a positive D for the SS income.
 * Alta is assumed on the 1st of the month; tarifa plana = 12 months from the alta month.
 */
export function retaYear(input: CalcInput, p: Params, ledger: MonthRow[], tierPct: number): RetaYear {
  const rate = p.get('reta.rate');
  const tp = tarifaPlanaCuota(p);
  const gen = p.get('reta.genericDeduction');
  const income = ledger.reduce((s, r) => s + r.income, 0);
  const expenses = ledger.reduce((s, r) => s + r.expenses, 0);
  const activeMonths = ledger.filter((r) => r.active).length;
  const extensionEligible = input.tpEligible && (income - expenses) * (1 - gen) < p.get('smi');

  const regimeOf = (m: number): RetaRegime => {
    const k = sinceAlta(input, m);
    if (k < 0 || !ledger[m].active) return 'none';
    if (input.tpEligible && k < 12) return 'tp';
    if (input.tpEligible && extensionEligible && k < 24) return 'tpExt';
    return 'tramo';
  };
  const regimes = ledger.map((r) => regimeOf(r.m));
  const tramoMonths = regimes.filter((r) => r === 'tramo').length;

  // Fixed point: the cuotas are expenses inside D, so the income figure depends on them.
  // Bizkaia sends the TGSS the "rendimiento neto previo atribuido" (bizkaia.eus, nuevo sistema de cotización);
  // Gure Gida Id 4014 places "RENDIMIENTO PREVIO" after the 20/15/10 % coeficiente (on a positive difference only)
  // and before the art. 25.5 start-up reduction → reading B. The old user setting R2 no longer changes this.
  const reading = p.get('reta.ssIncomeReading');
  let tramo: (Tramo & { index: number }) | null = null;
  let rendSSMonthly = 0;
  let cuotas = 0;
  for (let pass = 0; pass < 10; pass++) {
    const D = income - expenses - cuotas;
    const rendSS = reading === 'A' ? D + cuotas : (D > 0 ? D * (1 - tierPct) : D) + cuotas;
    rendSSMonthly = activeMonths ? (rendSS * (1 - gen)) / activeMonths : 0;
    tramo = tramoMonths ? tramoFor(rendSSMonthly, p) : null;
    const base = input.retaBase ?? tramo?.minBase ?? 0;
    const next = regimes.reduce((s, r) => s + (r === 'tramo' ? cents(base * rate) : r === 'none' ? 0 : tp), 0);
    if (Math.abs(next - cuotas) < 0.005) break;
    cuotas = next;
  }

  const base = input.retaBase ?? tramo?.minBase ?? 0;
  const months: RetaMonth[] = regimes.map((regime, m) => ({
    m,
    regime,
    base: regime === 'tramo' ? base : regime === 'none' ? 0 : p.get('reta.tarifaPlanaMeiBase'),
    cuota: regime === 'tramo' ? cents(base * rate) : regime === 'none' ? 0 : tp,
  }));

  let regularisation = 0;
  if (tramo && input.retaBase !== null) {
    if (base < tramo.minBase) regularisation = (tramo.minBase - base) * rate * tramoMonths;
    else if (base > tramo.maxBase) regularisation = -(base - tramo.maxBase) * rate * tramoMonths;
  }

  return {
    months,
    total: months.reduce((s, x) => s + x.cuota, 0),
    tpEnd: input.tpEligible ? addMonths(effectiveAlta(input), 11) : null,
    tramo,
    rendSSMonthly,
    extensionEligible,
    regularisation,
  };
}
