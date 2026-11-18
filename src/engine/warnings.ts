import type { Params } from '../params';
import type { CalcResult, YearCore } from './compute';
import type { CalcInput } from './types';

export type Warning = { id: string; params: Record<string, number | string> };

const daysBetween = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / 86_400_000;

/** Spec §7. Facts with numbers; no advice. */
export function buildWarnings(input: CalcInput, r: CalcResult, c: YearCore, p: Params): Warning[] {
  const w: Warning[] = [];
  const add = (id: string, params: Warning['params'] = {}) => w.push({ id, params });

  // W1 simplificada tier cliffs for next year
  for (const edge of [35000, 85000]) {
    if (c.D <= edge && edge - c.D <= 3000) add('W1', { edge, gap: edge - c.D });
  }
  // W2 €68k rent cliff
  const rentCap = p.get('irpf.rent').blCap;
  if (input.rentMonthly > 0 && input.leaseFrom2026 && Math.abs(r.annual.irpf.bl - rentCap) <= 3000) add('W2', { bl: r.annual.irpf.bl, cap: rentCap });
  // W3 130 switches to 5 % of year−2
  if (r.yi === 2 && r.q130.some((q) => q.regime === 'general' || q.regime === 'loss')) add('W3', { quarter: r.q130.find((q) => q.regime !== 'none')?.pay ?? 0, base: r.year - 2 });
  // W4 / W5 prepayments vs real tax
  if (r.annual.renta < -1000) add('W4', { amount: -r.annual.renta, year: r.year + 1 });
  if (r.annual.renta > 1000) add('W5', { amount: r.annual.renta, year: r.year + 1, pluri: input.salary ? 1 : 0 });
  // W6 chosen RETA base below the tramo minimum
  if (r.reta.regularisation > 0) add('W6', { amount: r.reta.regularisation, year: r.year + 2 });
  // W7 tarifa plana ends soon
  if (r.reta.tpEnd) {
    const end = `${r.reta.tpEnd.year}-${String(r.reta.tpEnd.month).padStart(2, '0')}-28`;
    const d = daysBetween(input.asOf, end);
    if (d >= 0 && d <= 92) add('W7', { end: `${r.reta.tpEnd.year}-${String(r.reta.tpEnd.month).padStart(2, '0')}` });
  }
  // W8 tarifa plana extension
  if (r.reta.extensionEligible && r.nextYear?.tpEndsThisYear) add('W8', {});
  // W12 130 waived
  if (r.q130.some((q) => q.regime === 'waived')) add('W12', {});
  // W13 deadline within 10 days
  if (r.nextPayment && daysBetween(input.asOf, r.nextPayment.due) <= 10 && daysBetween(input.asOf, r.nextPayment.due) >= 0) add('W13', { form: r.nextPayment.form, due: r.nextPayment.due, amount: r.nextPayment.amount });
  // W14 work bonificación forced to the minimum
  if (input.salary && r.annual.workBonif === p.get('irpf.workBonif').min && r.annual.rnAct > p.get('irpf.workBonif').otherIncomeCap) add('W14', { cap: p.get('irpf.workBonif').otherIncomeCap });
  // W15 pluriactividad refund
  if (r.pluri && r.pluri.refund > 0) add('W15', { amount: r.pluri.refund, year: r.pluri.refundYear });
  // W16 unverified parameters used
  if (r.unverified.length) add('W16', { keys: r.unverified.join(',') });
  // W17 start-up reduction claimed
  if (input.startup.claim) add('W17', {});
  // W18 months before alta
  if (r.alta.year === r.year && r.alta.month > 1) add('W18', { months: r.alta.month - 1 });
  return w;
}
