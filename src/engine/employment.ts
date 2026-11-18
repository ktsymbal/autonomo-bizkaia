import type { Params } from '../params';
import { annualIRPF, credits, scale, sumCredits } from './irpf';
import type { CalcInput } from './types';

/** Monthly excess over the max base split into the 3 solidarity bands. */
function solidarity(grossYear: number, p: Params, side: 'employee' | 'employer'): number {
  const s = p.get('rg.solidarity');
  const ex = Math.max(0, grossYear / 12 - p.get('rg.maxBaseMonth'));
  const b1 = Math.min(ex, s.bands[0]);
  const b2 = Math.min(Math.max(ex - s.bands[0], 0), s.bands[1]);
  const b3 = Math.max(ex - s.bands[0] - s.bands[1], 0);
  const r = s[side];
  return 12 * (b1 * r[0] + b2 * r[1] + b3 * r[2]);
}

const cappedBase = (grossYear: number, p: Params) => Math.min(grossYear, p.get('rg.maxBaseMonth') * 12);

export function employeeSS(grossYear: number, p: Params): number {
  return cappedBase(grossYear, p) * p.get('rg.employee') + solidarity(grossYear, p, 'employee');
}

export function employerCost(grossYear: number, p: Params): number {
  return grossYear + cappedBase(grossYear, p) * p.get('rg.employer') + solidarity(grossYear, p, 'employer');
}

/** NF arts. 22–23. otherIncome = non-work income in the base (activity RN). */
export function workRN(grossYear: number, ss: number, otherIncome: number, p: Params): { bonif: number; rn: number } {
  const b = p.get('irpf.workBonif');
  const diff = grossYear - ss;
  let bonif = 0;
  if (diff > 0) {
    if (otherIncome > b.otherIncomeCap) bonif = b.min;
    else if (diff <= b.lo) bonif = b.max;
    else if (diff <= b.hi) bonif = Math.max(b.min, b.max - b.slope * (diff - b.lo));
    else bonif = b.min;
  }
  return { bonif, rn: Math.max(0, diff - bonif) };
}

/** RIRPF Bizkaia art. 88: % read from the table by gross annual pay × descendants. */
export function salaryWithholdingPct(grossYear: number, nDesc: number, shortContract: boolean, p: Params): number {
  const row = p.get('salaryWithholding').find((r) => r.upTo === null || grossYear <= r.upTo)!;
  const pct = row.pct[Math.min(nDesc, row.pct.length - 1)];
  return shortContract ? Math.max(pct, p.get('salaryWithholding.shortContractMin')) : pct;
}

/** LGSS art. 313: amounts are contingencias comunes cuotas for the year. */
export function pluriRefund(retaCC: number, rgEmployeeCC: number, rgEmployerCC: number, p: Params): number {
  const r = p.get('pluriRefund');
  const excess = Math.max(0, retaCC + rgEmployeeCC + rgEmployerCC - r.cap);
  return Math.min(r.share * excess, r.share * retaCC);
}

/** Net a year for a salary-only employee with the same family/rent situation. */
export function salaryOnlyNet(grossYear: number, input: CalcInput, p: Params): number {
  const ss = employeeSS(grossYear, p);
  const { rn } = workRN(grossYear, ss, 0, p);
  return grossYear - ss - annualIRPF({ rnAct: 0, rnTrab: rn, input, p }).cl;
}

/** Gross salary giving the same yearly net (bisection; net is monotonic in gross). */
export function equivalentGross(targetNetYear: number, input: CalcInput, p: Params): number {
  let lo = 0;
  let hi = 1_000_000;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (salaryOnlyNet(mid, input, p) < targetNetYear) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Joint filing (tributación conjunta, NF arts. 97–99) vs separate returns, for you + a salaried partner.
 * Your base is passed in; the partner's comes from their gross salary. Not applied to the main result.
 */
export function jointCompare(input: CalcInput, myRnAct: number, myRnTrab: number, p: Params): { separate: number; joint: number; mine: number; partners: number } {
  const g = input.partnerGross ?? 0;
  const pSS = g > 0 ? employeeSS(g, p) : 0;
  const pRn = g > 0 ? workRN(g, pSS, 0, p).rn : 0;
  const mine = annualIRPF({ rnAct: myRnAct, rnTrab: myRnTrab, input, p }).cl;
  const partnerInput: CalcInput = { ...input, rentMonthly: 0, purchaseAnnual: 0, epsv: 0, disability: 0, ascendants: 0, age65: 'no', widow: false, carer: 'none', womenReturnYears: 0, menChildcare: false };
  const partners = g > 0 ? annualIRPF({ rnAct: 0, rnTrab: pRn, input: partnerInput, p }).cl : 0;
  const bi = Math.max(0, myRnAct) + Math.max(0, myRnTrab) + pRn;
  const bl = Math.max(0, bi - Math.min(input.epsv, p.get('irpf.epsvCap'), bi) - p.get('irpf.jointReduction'));
  const ci = Math.max(0, scale(bl, p) - p.get('irpf.minoracion'));
  const joint = Math.max(0, ci - sumCredits(credits(input, p, bl, true)));
  return { separate: mine + partners, joint, mine, partners };
}
