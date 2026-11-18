import { describe, it, expect } from 'vitest';
import { m130, type QuarterAgg } from '../src/engine/m130';
import { getParams } from '../src/params';

const p = () => getParams(2026);
const q = (income: number, expenses: number, retencion = 0, incomeWithRet = 0): QuarterAgg => ({ income, expenses, retencion, incomeWithRet, active: true });
const none: QuarterAgg = { income: 0, expenses: 0, retencion: 0, incomeWithRet: 0, active: false };
const base = { year: 2026, yi: 0, tierPct: 0.2, s1: 'off' as const, rnYm2: null, incomeYm2: null, retYm2: null };

describe('modelo 130 (Bizkaia)', () => {
  it('start regime Q1 I 15,000 G 900: off → 2,820; tier 20 % → 2,256; 15 % → 2,397', () => {
    const quarters = [q(15000, 900), none, none, none];
    expect(m130({ ...base, quarters }, p())[0].pay).toBeCloseTo(2820, 2);
    expect(m130({ ...base, quarters, s1: 'tier' }, p())[0].pay).toBeCloseTo(2256, 2);
    expect(m130({ ...base, quarters, s1: '15' }, p())[0].pay).toBeCloseTo(2397, 2);
    const r = m130({ ...base, quarters }, p())[0];
    expect(r.boxes).toMatchObject({ '09': 14100, '10': 2820, '11': 0, '12': 2820, '28': 2820 });
    expect(r.due).toBe('2026-04-25');
  });
  it('quarter with S1 at 15 %: 20 % × (12,000 − 400) × 0.85 = 1,972.00', () => {
    const r = m130({ ...base, s1: '15', quarters: [none, none, q(12000, 400), none] }, p());
    expect(r[2].pay).toBeCloseTo(1972, 2);
    expect(r[2].due).toBe('2026-10-25');
  });
  it('loss quarter → pay 0, box 28 = 0, no carry into the next quarter', () => {
    const r = m130({ ...base, quarters: [q(1000, 3000), q(5000, 0), none, none] }, p());
    expect(r[0].pay).toBe(0);
    expect(r[0].boxes['28']).toBe(0);
    expect(r[0].negative).toBe(true);
    expect(r[1].pay).toBeCloseTo(1000, 2);
  });
  it('withholding is subtracted in the start regime', () => {
    expect(m130({ ...base, quarters: [q(10000, 0, 500, 3333), none, none, none] }, p())[0].pay).toBeCloseTo(1500, 2);
  });
  it('general regime from S+2: 5 % × RN(Y−2) each quarter − 25 % of Y−2 withholding', () => {
    const r = m130({ ...base, yi: 2, rnYm2: 46477.6, incomeYm2: 60000, retYm2: 0, quarters: [q(1, 0), q(1, 0), q(1, 0), q(1, 0)] }, p());
    expect(r[0].regime).toBe('general');
    expect(r[0].boxes).toMatchObject({ '01': 46477.6, '02': 2323.88 });
    expect(r.reduce((s, x) => s + x.pay, 0)).toBeCloseTo(9295.52, 2);
    expect(r[3].due).toBe('2027-01-31');
  });
  it('general regime with RN(Y−2) ≤ 0 → 0.5 % of Y−2 revenue', () => {
    const r = m130({ ...base, yi: 3, rnYm2: -100, incomeYm2: 20000, retYm2: 0, quarters: [q(1, 0), q(1, 0), q(1, 0), q(1, 0)] }, p());
    expect(r[0].regime).toBe('loss');
    expect(r[0].pay).toBeCloseTo(100, 2);
  });
  it('≥ 70 % of income from payers that withhold → waived', () => {
    const r = m130({ ...base, quarters: [q(10000, 0, 1500, 7000), q(10000, 0, 1500, 7000), none, none] }, p());
    expect(r.slice(0, 2).every((x) => x.regime === 'waived' && x.pay === 0)).toBe(true);
  });
  it('quarters before the alta are not filed', () => {
    const r = m130({ ...base, quarters: [none, none, q(5000, 0), q(5000, 0)] }, p());
    expect(r[0].regime).toBe('none');
    expect(r[2].regime).toBe('start');
  });
});
