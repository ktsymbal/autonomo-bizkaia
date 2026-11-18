import type { Params } from '../params';
import type { CalcInput } from './types';

/** Bizkaia general scale (NF art. 75), progressive over brackets [from, rate]. */
export function scale(bl: number, p: Params): number {
  const s = p.get('irpf.scale');
  let tax = 0;
  for (let i = 0; i < s.length; i++) {
    const [from, rate] = s[i];
    const to = i + 1 < s.length ? s[i + 1][0] : Infinity;
    if (bl > from) tax += (Math.min(bl, to) - from) * rate;
  }
  return tax;
}

/** Simplificada % by the prior year's ingresos − gastos (art. 28.1.b). null = first year [?]. */
export function tier(priorD: number | null, p: Params): number {
  if (priorD === null) return p.get('irpf.firstYearTier');
  for (const [upTo, pct] of p.get('irpf.simplificadaTiers')) if (upTo === null || priorD <= upTo) return pct;
  return 0.1;
}

/** Rendimiento neto of the activity. yi = years since alta (0 = alta year). */
export function activityRN(D: number, tierPct: number, input: CalcInput, p: Params, yi: number): number {
  let rn = D > 0 || input.settings.s2 ? D * (1 - tierPct) : D;
  if (input.startup.claim && yi >= 0 && yi <= 1 && rn > 0) rn *= 1 - p.get('irpf.startup')[input.startup.sex];
  return rn;
}

export type AnnualIRPF = { bi: number; bl: number; ci: number; deductions: { descendants: number; rent: number }; cl: number };

export function annualIRPF(a: { rnAct: number; rnTrab: number; input: CalcInput; p: Params }): AnnualIRPF {
  const { input, p } = a;
  const bi = Math.max(0, a.rnAct) + Math.max(0, a.rnTrab); // activity losses are ring-fenced (art. 65.b)
  const bl = bi - Math.min(input.epsv, p.get('irpf.epsvCap'), bi);
  const ci = Math.max(0, scale(bl, p) - p.get('irpf.minoracion'));

  const amounts = p.get('irpf.descendants');
  const n = input.kidsUnder6 + input.kids6to30;
  let descendants = 0;
  for (let i = 0; i < n; i++) descendants += amounts[Math.min(i, amounts.length - 1)];
  if (n) descendants += input.kidsUnder6 * p.get('irpf.descendantUnder6');
  if (input.partner) descendants /= 2;

  let rent = 0;
  if (input.rentMonthly > 0) {
    const r = p.get('irpf.rent');
    const tierR = input.under36 || input.largeFamily ? r.enhanced : r.base;
    rent = Math.min(tierR.rate * input.rentMonthly * 12, tierR.cap);
    if (input.leaseFrom2026 && bl > r.blCap) rent = 0;
  }

  const cl = Math.max(0, ci - descendants - rent);
  return { bi, bl, ci, deductions: { descendants, rent }, cl };
}
