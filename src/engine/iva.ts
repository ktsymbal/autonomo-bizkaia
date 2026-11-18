import type { Params } from '../params';
import type { MonthRow } from './types';

export type IvaStatus = 'none' | 'pay' | 'zero' | 'carry' | 'annual390';
export type IvaQuarter = { q: number; out: number; in: number; carryIn: number; result: number; carryOut: number; status: IvaStatus; due: string | null };
export type IvaYear = { quarters: IvaQuarter[]; m390: { result: number; refund: number; due: string }; annualOut: number; annualIn: number };

/** Bizkaia: Q1–Q3 modelo 303 (carry forward, no refund); Q4 is settled in the annual 390 (refund requested there). */
export function ivaYear(ledger: MonthRow[], year: number, p: Params): IvaYear {
  const dl = p.get('deadlines');
  let carry = 0;
  const quarters: IvaQuarter[] = [];
  for (let i = 0; i < 4; i++) {
    const rows = ledger.slice(i * 3, i * 3 + 3);
    const active = rows.some((r) => r.active);
    const out = rows.reduce((s, r) => s + r.ivaOut, 0);
    const inn = rows.reduce((s, r) => s + r.ivaIn, 0);
    const net = out - inn - carry;
    const carryIn = carry;
    if (i === 3) {
      quarters.push({ q: 4, out, in: inn, carryIn, result: net, carryOut: 0, status: active ? 'annual390' : 'none', due: active ? `${year + 1}-${dl.m390}` : null });
      carry = net; // reused below as the 390 result
      break;
    }
    if (!active) {
      quarters.push({ q: i + 1, out, in: inn, carryIn, result: 0, carryOut: carry, status: 'none', due: null });
      continue;
    }
    const status: IvaStatus = net > 0.005 ? 'pay' : net < -0.005 ? 'carry' : 'zero';
    carry = net < 0 ? -net : 0;
    quarters.push({ q: i + 1, out, in: inn, carryIn, result: Math.max(0, net), carryOut: carry, status, due: `${year}-${dl.q303[i]}` });
  }
  const final = carry;
  return {
    quarters,
    m390: { result: Math.max(0, final), refund: Math.max(0, -final), due: `${year + 1}-${dl.m390}` },
    annualOut: ledger.reduce((s, r) => s + r.ivaOut, 0),
    annualIn: ledger.reduce((s, r) => s + r.ivaIn, 0),
  };
}
