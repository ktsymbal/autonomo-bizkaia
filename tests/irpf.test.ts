import { describe, it, expect } from 'vitest';
import { scale, tier, activityRN, annualIRPF } from '../src/engine/irpf';
import { defaultInput } from '../src/engine/activity';
import { getParams } from '../src/params';
import type { CalcInput } from '../src/engine/types';

const p = () => getParams(2026);
const inp = (o: Partial<CalcInput> = {}): CalcInput => ({ ...defaultInput('2026-11-18'), ...o });

describe('IRPF', () => {
  it('scale at bracket edges', () => {
    expect(scale(18080, p())).toBeCloseTo(4158.40, 2);
    expect(scale(36160, p())).toBeCloseTo(9220.80, 2);
    expect(scale(54240, p())).toBeCloseTo(15548.80, 2);
    expect(scale(0, p())).toBe(0);
  });
  it('simplificada tier by prior-year D', () => {
    expect(tier(null, p())).toBe(0.20);
    expect(tier(35000, p())).toBe(0.20);
    expect(tier(35000.01, p())).toBe(0.15);
    expect(tier(85000, p())).toBe(0.15);
    expect(tier(85001, p())).toBe(0.10);
  });
  it('first-year tier is flagged unverified', () => {
    const q = p(); tier(null, q);
    expect(q.unverifiedUsed()).toContain('irpf.firstYearTier');
  });
  it('golden year 1: D 58,097 → RN 46,478 → CL ≈ 8,417 (rent 700/mo, under 36)', () => {
    const i = inp({ under36: true, rentMonthly: 700 });
    const rn = activityRN(58097.29, 0.20, i, p(), 0);
    expect(rn).toBeCloseTo(46477.83, 1);
    const r = annualIRPF({ rnAct: rn, rnTrab: 0, input: i, p: p() });
    expect(r.deductions.rent).toBe(2800);
    expect(r.cl).toBeCloseTo(8417, 0);
  });
  it('golden year 2: D 52,613 at 15 % → CL ≈ 7,802', () => {
    const i = inp({ under36: true, rentMonthly: 700 });
    const r = annualIRPF({ rnAct: activityRN(52612.92, 0.15, i, p(), 1), rnTrab: 0, input: i, p: p() });
    expect(r.cl).toBeCloseTo(7802, 0);
  });
  it('rent: 20 %/€1,600 over 36; lost above €68k BL for leases from 2026', () => {
    let r = annualIRPF({ rnAct: 40000, rnTrab: 0, input: inp({ rentMonthly: 700 }), p: p() });
    expect(r.deductions.rent).toBe(1600);
    r = annualIRPF({ rnAct: 68001, rnTrab: 0, input: inp({ rentMonthly: 700, under36: true }), p: p() });
    expect(r.deductions.rent).toBe(0);
    r = annualIRPF({ rnAct: 68001, rnTrab: 0, input: inp({ rentMonthly: 700, under36: true, leaseFrom2026: false }), p: p() });
    expect(r.deductions.rent).toBe(2800);
    r = annualIRPF({ rnAct: 40000, rnTrab: 0, input: inp({ rentMonthly: 700, largeFamily: true }), p: p() });
    expect(r.deductions.rent).toBe(2800);
  });
  it('negative D: no % applied (S2 off), and it does not offset work income', () => {
    expect(activityRN(-5000, 0.2, inp(), p(), 0)).toBe(-5000);
    expect(activityRN(-5000, 0.2, inp({ settings: { r2: 'A', s1: 'off', s2: true } }), p(), 0)).toBe(-4000);
    const r = annualIRPF({ rnAct: -5000, rnTrab: 20000, input: inp(), p: p() });
    expect(r.bl).toBe(20000);
  });
  it('start-up reduction: 15 % women / 10 % men, years 0–1 only, positive RN', () => {
    const w = inp({ startup: { claim: true, sex: 'w' } });
    expect(activityRN(10000, 0.2, w, p(), 0)).toBeCloseTo(6800);
    expect(activityRN(10000, 0.2, inp({ startup: { claim: true, sex: 'm' } }), p(), 1)).toBeCloseTo(7200);
    expect(activityRN(10000, 0.2, w, p(), 2)).toBeCloseTo(8000);
  });
  it('descendants: ordinal amounts + under-6 extra, halved with a partner', () => {
    let r = annualIRPF({ rnAct: 40000, rnTrab: 0, input: inp({ kidsUnder6: 2 }), p: p() });
    expect(r.deductions.descendants).toBe(682 + 844 + 2 * 394);
    r = annualIRPF({ rnAct: 40000, rnTrab: 0, input: inp({ kidsUnder6: 2, partner: true }), p: p() });
    expect(r.deductions.descendants).toBe((682 + 844 + 2 * 394) / 2);
    r = annualIRPF({ rnAct: 40000, rnTrab: 0, input: inp({ kids6to30: 6 }), p: p() });
    expect(r.deductions.descendants).toBe(682 + 844 + 1421 + 1680 + 2195 + 2195);
  });
  it('EPSV reduces the base up to €5,000; CL never below 0', () => {
    const r = annualIRPF({ rnAct: 40000, rnTrab: 0, input: inp({ epsv: 7000 }), p: p() });
    expect(r.bl).toBe(35000);
    expect(annualIRPF({ rnAct: 5000, rnTrab: 0, input: inp({ kidsUnder6: 3 }), p: p() }).cl).toBe(0);
  });
});
