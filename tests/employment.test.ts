import { describe, it, expect } from 'vitest';
import { employeeSS, workRN, salaryWithholdingPct, pluriRefund, employerCost, equivalentGross, salaryOnlyNet } from '../src/engine/employment';
import { defaultInput } from '../src/engine/activity';
import { getParams } from '../src/params';

const p = () => getParams(2026);

describe('employment income (pluriactividad)', () => {
  it('withholding table cliffs: €20,000.00 → 0 %, €20,000.01 → 7 %', () => {
    expect(salaryWithholdingPct(20000, 0, false, p())).toBe(0);
    expect(salaryWithholdingPct(20000.01, 0, false, p())).toBe(7);
  });
  it('€40k: 17 / 16 / 15 % with 0 / 1 / 2 children → 6,800 / 6,400 / 6,000', () => {
    expect([0, 1, 2].map((n) => Math.round(salaryWithholdingPct(40000, n, false, p()) * 400))).toEqual([6800, 6400, 6000]);
  });
  it('6+ children column and the top band', () => {
    expect(salaryWithholdingPct(300000, 9, false, p())).toBe(37);
  });
  it('contract shorter than a year → at least 2 %', () => {
    expect(salaryWithholdingPct(15000, 0, true, p())).toBe(2);
  });
  it('employee SS 6.5 %; solidarity above the max base', () => {
    expect(employeeSS(40000, p())).toBeCloseTo(2600, 2);
    const over = employeeSS(12 * 6000, p());
    expect(over).toBeCloseTo(5101.2 * 12 * 0.065 + 12 * (510.12 * 0.0019 + (6000 - 5611.32) * 0.0021), 2);
  });
  it('work bonificación: 8,000 → taper → 3,000; forced to 3,000 when other income > 7,500', () => {
    expect(workRN(14800, 0, 0, p()).bonif).toBe(8000);
    expect(workRN(23000, 0, 0, p()).bonif).toBeCloseTo(3000, 0);
    expect(workRN(18900, 0, 0, p()).bonif).toBeCloseTo(8000 - 0.6098 * 4100, 2);
    expect(workRN(14800, 0, 7501, p()).bonif).toBe(3000);
    expect(workRN(5000, 0, 0, p()).rn).toBe(0);
  });
  it('pluriactividad refund: 50 % of the excess, capped at 50 % of RETA CC', () => {
    expect(pluriRefund(6000, 2000, 10000, p())).toBeCloseTo(0.5 * (18000 - 17323.68), 2);
    expect(pluriRefund(1000, 5000, 20000, p())).toBe(500);
    expect(pluriRefund(1000, 1000, 1000, p())).toBe(0);
  });
  it('employer cost = gross × 1.3215 under the max base', () => {
    expect(employerCost(40000, p())).toBeCloseTo(40000 * 1.3215, 2);
  });
  it('equivalentGross inverts salaryOnlyNet', () => {
    const i = defaultInput('2026-11-18');
    const net = salaryOnlyNet(45000, i, p());
    expect(equivalentGross(net, i, p())).toBeCloseTo(45000, 0);
  });
});
