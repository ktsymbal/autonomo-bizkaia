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

/** How the base splits across the scale's brackets (for the explainer). */
export function brackets(bl: number, p: Params): { from: number; to: number | null; rate: number; amount: number; tax: number }[] {
  const s = p.get('irpf.scale');
  const out = [];
  for (let i = 0; i < s.length; i++) {
    const [from, rate] = s[i];
    const to = i + 1 < s.length ? s[i + 1][0] : null;
    if (bl <= from) break;
    const amount = Math.min(bl, to ?? Infinity) - from;
    out.push({ from, to, rate, amount, tax: amount * rate });
  }
  return out;
}

/** Simplificada % by the prior year's ingresos − gastos (art. 28.1.b). null = first year [?]. */
export function tier(priorD: number | null, p: Params): number {
  if (priorD === null) return p.get('irpf.firstYearTier');
  for (const [upTo, pct] of p.get('irpf.simplificadaTiers')) if (upTo === null || priorD <= upTo) return pct;
  return 0.1;
}

/** Rendimiento neto of the activity. yi = years since alta (0 = alta year). */
export function activityRN(D: number, tierPct: number, input: CalcInput, p: Params, yi: number): number {
  // The coeficiente applies only to a positive difference: Gure Gida Id 4014, "20, 15 o 10 por ciento de la
  // diferencia positiva anterior". The old user setting S2 no longer changes this.
  let rn = D > 0 ? D * (1 - tierPct) : D;
  if (input.startup.claim && yi >= 0 && yi <= 1 && rn > 0) rn *= 1 - p.get('irpf.startup')[input.startup.sex];
  return rn;
}

export type Deductions = {
  descendants: number; rent: number; purchase: number; disability: number; ascendants: number;
  age: number; widow: number; carer: number; womenReturn: number; menChildcare: number;
};
export type AnnualIRPF = { bi: number; bl: number; ci: number; deductions: Deductions; cl: number };

const taper = (full: number, base: number, lo: number, hi: number) =>
  base <= lo ? full : base >= hi ? 0 : full - (full / (hi - lo)) * (base - lo);

/** Credits off the tax (cuota). `joint` = joint filing: children not split, purchase caps doubled. */
export function credits(input: CalcInput, p: Params, bl: number, joint = false): Deductions {
  const amounts = p.get('irpf.descendants');
  const n = input.kidsUnder6 + input.kids6to30;
  let descendants = 0;
  for (let i = 0; i < n; i++) descendants += amounts[Math.min(i, amounts.length - 1)];
  if (n) descendants += input.kidsUnder6 * p.get('irpf.descendantUnder6');
  if (input.partner && !joint) descendants /= 2;

  const enhanced = input.under36 || input.largeFamily;
  let rent = 0;
  if (input.rentMonthly > 0) {
    const r = p.get('irpf.rent');
    const t = enhanced ? r.enhanced : r.base;
    rent = Math.min(t.rate * input.rentMonthly * 12, t.cap);
    if (input.leaseFrom2026 && bl > r.blCap) rent = 0;
  }

  let purchase = 0;
  if (input.purchaseAnnual > 0) {
    const h = p.get('irpf.purchase');
    const t = enhanced ? h.enhanced : h.base;
    const cap = enhanced && input.under36 && input.purchaseThisYear ? Infinity : t.cap * (joint ? 2 : 1);
    purchase = Math.min(t.rate * input.purchaseAnnual, cap, h.lifetimeCap);
    if (input.purchaseFrom2026 && bl > h.blCap) purchase = 0;
  }

  const dis = p.get('irpf.disability');
  const disability = input.disability > 0 ? dis[input.disability - 1] : 0;
  const ascendants = input.ascendants * p.get('irpf.ascendant');
  const ag = p.get('irpf.age');
  const age = input.age65 === 'no' ? 0 : taper(input.age65 === '75' ? ag.over75 : ag.over65, bl, ag.lo, ag.hi);
  const w = p.get('irpf.widow');
  const widow = input.widow && input.age65 === 'no' ? taper(w.amount, bl, w.lo, w.hi) : 0;
  const c = p.get('irpf.carer');
  const carer = input.carer === 'none' ? 0 : input.carer === 'professional' ? c.professional : c.domestic;
  const womenReturn = input.womenReturnYears > 0 ? input.womenReturnYears * p.get('irpf.womenReturn') : 0;
  const menChildcare = input.menChildcare ? p.get('irpf.menChildcare') : 0;
  return { descendants, rent, purchase, disability, ascendants, age, widow, carer, womenReturn, menChildcare };
}

export const sumCredits = (d: Deductions) => Object.values(d).reduce((s, x) => s + x, 0);

export function annualIRPF(a: { rnAct: number; rnTrab: number; input: CalcInput; p: Params }): AnnualIRPF {
  const { input, p } = a;
  const bi = Math.max(0, a.rnAct) + Math.max(0, a.rnTrab); // activity losses are ring-fenced (art. 65.b)
  const bl = bi - Math.min(input.epsv, p.get('irpf.epsvCap'), bi);
  const ci = Math.max(0, scale(bl, p) - p.get('irpf.minoracion'));
  const deductions = credits(input, p, bl);
  const cl = Math.max(0, ci - sumCredits(deductions));
  return { bi, bl, ci, deductions, cl };
}
