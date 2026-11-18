import { describe, it, expect } from 'vitest';
import { annualIRPF } from '../src/engine/irpf';
import { jointCompare } from '../src/engine/employment';
import { defaultInput } from '../src/engine/activity';
import { getParams } from '../src/params';
import type { CalcInput } from '../src/engine/types';

const p = () => getParams(2026);
const inp = (o: Partial<CalcInput> = {}): CalcInput => ({ ...defaultInput('2026-11-18'), ...o });
const ded = (o: Partial<CalcInput>, rnAct = 40000) => annualIRPF({ rnAct, rnTrab: 0, input: inp(o), p: p() }).deductions;

describe('other Bizkaia deductions', () => {
  it('home purchase: 18 % up to €1,530; 23 % up to €1,955 under 36; no cap in the purchase year under 36', () => {
    expect(ded({ purchaseAnnual: 6000 }).purchase).toBeCloseTo(1080);
    expect(ded({ purchaseAnnual: 10000 }).purchase).toBe(1530);
    expect(ded({ purchaseAnnual: 6000, under36: true }).purchase).toBeCloseTo(1380);
    expect(ded({ purchaseAnnual: 10000, under36: true }).purchase).toBe(1955);
    expect(ded({ purchaseAnnual: 10000, under36: true, purchaseThisYear: true }).purchase).toBeCloseTo(2300);
  });
  it('home purchase from 2026 is lost above a €68,000 base', () => {
    expect(ded({ purchaseAnnual: 6000, purchaseFrom2026: true }, 68001).purchase).toBe(0);
    expect(ded({ purchaseAnnual: 6000, purchaseFrom2026: false }, 68001).purchase).toBeCloseTo(1080);
  });
  it('disability by grade; ascendants €328 each', () => {
    expect(ded({ disability: 1 }).disability).toBe(906);
    expect(ded({ disability: 4 }).disability).toBe(1935);
    expect(ded({ ascendants: 2 }).ascendants).toBe(656);
  });
  it('age 65+/75+ tapers to 0 between €20k and €30k; widowhood likewise and not with age', () => {
    expect(ded({ age65: '65' }, 18000).age).toBe(393);
    expect(ded({ age65: '75' }, 25000).age).toBeCloseTo(714 - 0.0714 * 5000, 2);
    expect(ded({ age65: '65' }, 31000).age).toBe(0);
    expect(ded({ widow: true }, 25000).widow).toBeCloseTo(100, 2);
    expect(ded({ widow: true, age65: '65' }, 18000).widow).toBe(0);
  });
  it('carer, women returning, men reducing work', () => {
    expect(ded({ carer: 'domestic' }).carer).toBe(250);
    expect(ded({ carer: 'professional' }).carer).toBe(500);
    expect(ded({ womenReturnYears: 2 }).womenReturn).toBe(3000);
    expect(ded({ menChildcare: true }).menChildcare).toBe(200);
  });
  it('tax never goes below zero', () => {
    expect(annualIRPF({ rnAct: 8000, rnTrab: 0, input: inp({ disability: 4, ascendants: 3 }), p: p() }).cl).toBe(0);
  });
  it('joint filing: cheaper when the partner has no income, dearer when both earn similar', () => {
    const one = jointCompare(inp({ partner: true, partnerGross: 0 }), 40000, 0, p());
    expect(one.joint).toBeLessThan(one.separate);
    const both = jointCompare(inp({ partner: true, partnerGross: 50000 }), 40000, 0, p());
    expect(both.joint).toBeGreaterThan(both.separate);
  });
});
