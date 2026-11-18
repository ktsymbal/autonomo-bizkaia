import { getParams, type Key, type Params, type Year } from '../params';
import { activityLedger, effectiveAlta } from './activity';
import { employeeSS, employerCost, equivalentGross, pluriRefund, salaryWithholdingPct, workRN } from './employment';
import { activityRN, annualIRPF, tier, type AnnualIRPF } from './irpf';
import { ivaYear, type IvaYear } from './iva';
import { m130, type Q130, type QuarterAgg } from './m130';
import { retaYear, type RetaYear } from './reta';
import type { CalcInput, MonthRow, YM } from './types';
import { buildWarnings, type Warning } from './warnings';

export type CalcOptions = { paramsFor?: (year: number) => Params; nested?: boolean };

export type YearCore = {
  year: number;
  yi: number;
  p: Params;
  ledger: MonthRow[];
  reta: RetaYear;
  income: number;
  expenses: number;
  retencion: number;
  D: number;
  tierPct: number;
  rnAct: number;
  activeMonths: number;
};

export type MonthOut = { m: number; active: boolean; forecast: boolean; income: number; retencion: number; salaryNet: number; expenses: number; cuota: number; tax130: number; ivaPaid: number; net: number; due: string[] };

export type Payment = { form: '130' | '303' | '390' | 'renta'; label: string; due: string; amount: number };

export type CalcResult = {
  year: number;
  asOf: string;
  alta: YM;
  yi: number;
  keptMonthly: number;
  denominator: number; // months the monthly average is taken over (12 with a salary)
  activeMonths: number;
  forecastMonths: number;
  annual: {
    income: number; expenses: number; reta: number; retaRegime: string; tier: number; D: number; rnAct: number;
    salaryGross: number; salarySS: number; salaryWithheld: number; salaryWithholdingPct: number | null; rnTrab: number; workBonif: number;
    irpf: AnnualIRPF; prepaid130: number; retencion: number; prepaid: number; renta: number;
  };
  months: MonthOut[];
  q130: Q130[];
  iva: IvaYear;
  reta: RetaYear;
  setAside: { pct: number; amountMonthly: number; ivaMonthly: number };
  firstPayment: Payment | null;
  nextPayment: Payment | null;
  after: Payment[]; // due after the year ends
  nextYear: { year: number; keptMonthly: number; m130Quarter: number | null; m130Switch: boolean; tpEndsThisYear: boolean; extensionEligible: boolean; retaMonthly: number; tier: number } | null;
  compare: { noTarifaPlanaMonthly: number | null; employeeGross: number; employerCost: number } | null;
  pluri: { refund: number; refundYear: number } | null;
  warnings: Warning[];
  provenance: Key[];
  unverified: Key[];
};

const sum = <T>(xs: T[], f: (x: T) => number) => xs.reduce((s, x) => s + f(x), 0);
const defaultParamsFor = (year: number): Params => getParams((year >= 2027 ? 2027 : 2026) as Year);

/** Activity-only core for one year: ledger, RETA, D, tier and RN. Prior years recurse (≤ 3 levels). */
function core(input: CalcInput, year: number, paramsFor: (y: number) => Params, seen: Params[], depth = 0): YearCore {
  const alta = effectiveAlta(input);
  const yInput = { ...input, year: year as CalcInput['year'] };
  const p = paramsFor(year);
  seen.push(p);
  const ledger = activityLedger(yInput, p);
  const yi = year - alta.year;

  let priorD: number | null;
  if (depth === 0 && input.priorD !== null && yi > 0) priorD = input.priorD;
  else if (yi <= 0) priorD = null;
  else if (depth >= 3) priorD = sum(ledger, (r) => r.income - r.expenses); // steady-state approximation, deep history
  else priorD = core(input, year - 1, paramsFor, seen, depth + 1).D;
  const tierPct = tier(priorD, p);

  const reta = retaYear(yInput, p, ledger, tierPct);
  const income = sum(ledger, (r) => r.income);
  const expenses = sum(ledger, (r) => r.expenses);
  const D = income - expenses - reta.total;
  return {
    year, yi, p, ledger, reta, income, expenses, D, tierPct,
    retencion: sum(ledger, (r) => r.retencion),
    rnAct: activityRN(D, tierPct, yInput, p, yi),
    activeMonths: ledger.filter((r) => r.active).length,
  };
}

function quarterAggs(c: YearCore): QuarterAgg[] {
  return [0, 1, 2, 3].map((q) => {
    const rows = c.ledger.slice(q * 3, q * 3 + 3);
    const cuotas = c.reta.months.slice(q * 3, q * 3 + 3);
    return {
      active: rows.some((r) => r.active),
      income: sum(rows, (r) => r.income),
      expenses: sum(rows, (r) => r.expenses) + sum(cuotas, (x) => x.cuota),
      retencion: sum(rows, (r) => r.retencion),
      incomeWithRet: sum(rows, (r) => r.incomeWithRet),
    };
  });
}

function q130For(input: CalcInput, c: YearCore, paramsFor: (y: number) => Params, seen: Params[]): Q130[] {
  let rnYm2: number | null = null;
  let incomeYm2: number | null = null;
  let retYm2: number | null = null;
  if (c.yi >= 2) {
    const c2 = core(input, c.year - 2, paramsFor, seen, 1);
    // RIRPF 110: if year−2 was the start year, its RN "se elevará al año" (S3: by months of activity)
    rnYm2 = c2.yi === 0 && c2.activeMonths > 0 ? (c2.rnAct * 12) / c2.activeMonths : c2.rnAct;
    incomeYm2 = c2.income;
    retYm2 = c2.retencion;
  }
  return m130({ year: c.year, yi: c.yi, quarters: quarterAggs(c), tierPct: c.tierPct, s1: input.settings.s1, rnYm2, incomeYm2, retYm2 }, c.p);
}

const QUARTER_PAY_MONTH = [3, 6, 9]; // Apr, Jul, Oct (0-based); Q4 is paid in January of the next year

export function compute(rawInput: CalcInput, opts: CalcOptions = {}): CalcResult {
  const alta = effectiveAlta(rawInput);
  const input: CalcInput = rawInput.alta === null ? { ...rawInput, year: Math.max(alta.year, 2026) as CalcInput['year'] } : rawInput;
  const paramsFor = opts.paramsFor ?? defaultParamsFor;
  const seen: Params[] = [];
  const c = core(input, input.year, paramsFor, seen);
  const p = c.p;
  const year = input.year;

  // Employment income (pluriactividad)
  const salaryGross = input.salary ? input.salary.grossMonthly * 12 : 0;
  const salarySS = input.salary ? employeeSS(salaryGross, p) : 0;
  const work = input.salary ? workRN(salaryGross, salarySS, Math.max(0, c.rnAct), p) : { bonif: 0, rn: 0 };
  const nDesc = input.kidsUnder6 + input.kids6to30;
  const salaryWithholdingPctV = input.salary && input.salary.withheldMonthly === null ? salaryWithholdingPct(salaryGross, nDesc, input.salary.shortContract, p) : null;
  const salaryWithheld = input.salary ? (input.salary.withheldMonthly !== null ? input.salary.withheldMonthly * 12 : (salaryGross * (salaryWithholdingPctV ?? 0)) / 100) : 0;

  const irpf = annualIRPF({ rnAct: c.rnAct, rnTrab: work.rn, input, p });
  const q130 = q130For(input, c, paramsFor, seen);
  const iva = ivaYear(c.ledger, year, p);
  const prepaid130 = sum(q130, (q) => q.pay);
  const prepaid = prepaid130 + c.retencion + salaryWithheld;
  const renta = irpf.cl - prepaid;

  const salaryNetYear = salaryGross - salarySS;
  const denom = input.salary ? 12 : c.activeMonths;
  const keptYear = c.income + salaryNetYear - c.expenses - c.reta.total - irpf.cl;
  const keptMonthly = denom ? keptYear / denom : 0;

  // Month-by-month cash view
  const months: MonthOut[] = c.ledger.map((r, m) => {
    const cuota = c.reta.months[m].cuota;
    const qi = QUARTER_PAY_MONTH.indexOf(m);
    const tax130 = qi >= 0 ? q130[qi].pay : 0;
    const ivaPaid = qi >= 0 && iva.quarters[qi].status === 'pay' ? iva.quarters[qi].result : 0;
    const salaryNet = input.salary ? (salaryGross - salarySS - salaryWithheld) / 12 : 0;
    const due: string[] = [];
    if (qi >= 0 && q130[qi].regime !== 'none') due.push(q130[qi].regime === 'waived' ? '130-waived' : '130');
    if (qi >= 0 && iva.quarters[qi].status !== 'none') due.push('303');
    const net = r.income - r.retencion + salaryNet - r.expenses - cuota - tax130;
    return { m, active: r.active, forecast: r.forecast, income: r.income, retencion: r.retencion, salaryNet, expenses: r.expenses, cuota, tax130, ivaPaid, net, due };
  });

  // Payments
  const pays: Payment[] = [];
  q130.forEach((q) => { if (q.regime !== 'none' && q.regime !== 'waived') pays.push({ form: '130', label: `Q${q.q}`, due: q.due, amount: q.pay }); });
  iva.quarters.forEach((q) => { if (q.status !== 'none' && q.status !== 'annual390' && q.due) pays.push({ form: '303', label: `Q${q.q}`, due: q.due, amount: q.result }); });
  if (iva.quarters[3].status === 'annual390') pays.push({ form: '390', label: `${year}`, due: iva.m390.due, amount: iva.m390.result - iva.m390.refund });
  pays.push({ form: 'renta', label: `${year}`, due: `${year + 1}-${p.get('deadlines').rentaEnd}`, amount: renta });
  pays.sort((a, b) => a.due.localeCompare(b.due));
  const firstPayment = pays.find((x) => x.form !== 'renta' && x.amount > 0) ?? null;
  const nextPayment = pays.find((x) => x.due >= input.asOf && (x.amount > 0 || x.form === '130' || x.form === '303')) ?? null;
  const after = pays.filter((x) => x.due > `${year}-12-31`);

  // Set-aside: cash you must hold back from what clients pay for 130s and a Renta bill
  const received = c.income - c.retencion;
  const toPay = prepaid130 + Math.max(0, renta);
  const setAside = {
    pct: received > 0 ? toPay / received : 0,
    amountMonthly: c.activeMonths ? toPay / c.activeMonths : 0,
    ivaMonthly: c.activeMonths ? sum(c.ledger, (r) => r.ivaOut) / c.activeMonths : 0,
  };

  // Pluriactividad refund (LGSS 313), paid after the RETA regularisation (~year+2)
  let pluri: CalcResult['pluri'] = null;
  if (input.salary) {
    const retaCC = c.reta.total * (p.get('reta.ccRate') / p.get('reta.rate'));
    const base = Math.min(salaryGross, p.get('rg.maxBaseMonth') * 12);
    const cc = p.get('rg.cc');
    pluri = { refund: pluriRefund(retaCC, base * cc.employee, base * cc.employer, p), refundYear: year + 2 };
  }

  let nextYear: CalcResult['nextYear'] = null;
  let compare: CalcResult['compare'] = null;
  if (!opts.nested && year < 2027) {
    const ny = compute({ ...input, year: (year + 1) as CalcInput['year'], priorD: null }, { ...opts, nested: true });
    const firstPaid = ny.q130.find((q) => q.regime === 'general');
    nextYear = {
      year: year + 1,
      keptMonthly: ny.keptMonthly,
      m130Quarter: firstPaid ? firstPaid.pay : null,
      m130Switch: ny.yi === 2,
      tpEndsThisYear: c.reta.tpEnd !== null && c.reta.tpEnd.year === year,
      extensionEligible: c.reta.extensionEligible,
      retaMonthly: ny.activeMonths ? ny.annual.reta / ny.activeMonths : 0,
      tier: ny.annual.tier,
    };
  }
  if (!opts.nested) {
    const tpThisYear = c.reta.months.some((m) => m.regime === 'tp' || m.regime === 'tpExt');
    const noTp = tpThisYear ? compute({ ...input, tpEligible: false }, { ...opts, nested: true }).keptMonthly : null;
    const target = keptMonthly * 12;
    const employeeGross = target > 0 ? equivalentGross(target, input, p) : 0;
    compare = { noTarifaPlanaMonthly: noTp, employeeGross, employerCost: employeeGross ? employerCost(employeeGross, p) : 0 };
  }

  const usedKeys = [...new Set(seen.flatMap((x) => x.used()))];
  const unverified = [...new Set(seen.flatMap((x) => x.unverifiedUsed()))];

  const result: CalcResult = {
    year, asOf: input.asOf, alta, yi: c.yi, keptMonthly, denominator: denom || 1, activeMonths: c.activeMonths,
    forecastMonths: c.ledger.filter((r) => r.forecast).length,
    annual: {
      income: c.income, expenses: c.expenses, reta: c.reta.total, retaRegime: regimeSummary(c.reta), tier: c.tierPct, D: c.D, rnAct: c.rnAct,
      salaryGross, salarySS, salaryWithheld, salaryWithholdingPct: salaryWithholdingPctV, rnTrab: work.rn, workBonif: work.bonif,
      irpf, prepaid130, retencion: c.retencion, prepaid, renta,
    },
    months, q130, iva, reta: c.reta, setAside, firstPayment, nextPayment, after, nextYear, compare, pluri,
    warnings: [], provenance: usedKeys as Key[], unverified: unverified as Key[],
  };
  result.warnings = buildWarnings(input, result, c, p);
  return result;
}

function regimeSummary(r: RetaYear): string {
  const kinds = new Set(r.months.filter((m) => m.regime !== 'none').map((m) => (m.regime === 'tpExt' ? 'tp' : m.regime)));
  if (kinds.size === 2) return 'mixed';
  if (kinds.has('tp')) return r.months.some((m) => m.regime === 'tpExt') ? 'tpExt' : 'tp';
  return kinds.has('tramo') ? 'tramo' : 'none';
}

/** Reverse mode: scale every client month so that keptMonthly ≈ target. Returns the factor. */
export function solveIncomeFor(targetMonthly: number, input: CalcInput, opts: CalcOptions = {}): number {
  const scaled = (k: number): CalcInput => ({ ...input, clients: input.clients.map((c) => ({ ...c, months: c.months.map((m) => ({ ...m, amount: m.amount * k })) })) });
  const kept = (k: number) => compute(scaled(k), { ...opts, nested: true }).keptMonthly;
  let lo = 0;
  let hi = 1;
  while (kept(hi) < targetMonthly && hi < 1e4) hi *= 2;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (kept(mid) < targetMonthly) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
