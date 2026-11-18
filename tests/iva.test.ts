import { describe, it, expect } from 'vitest';
import { ivaYear } from '../src/engine/iva';
import { getParams } from '../src/params';
import type { MonthRow } from '../src/engine/types';

const row = (m: number, ivaOut: number, ivaIn: number, active = true): MonthRow =>
  ({ m, active, income: 0, ivaOut, ivaIn, retencion: 0, incomeWithRet: 0, expenses: 0, forecast: false });
const year = (out: number, inn: number) => Array.from({ length: 12 }, (_, m) => row(m, out, inn));

describe('IVA 303 / 390', () => {
  it('Spanish company only: each of Q1–Q3 pays 630; Q4 settled in the 390', () => {
    const r = ivaYear(year(210, 0), 2026, getParams(2026));
    expect(r.quarters.slice(0, 3).map((q) => q.status)).toEqual(['pay', 'pay', 'pay']);
    expect(r.quarters[0].result).toBeCloseTo(630);
    expect(r.quarters[0].due).toBe('2026-04-25');
    expect(r.quarters[3].status).toBe('annual390');
    expect(r.m390.result).toBeCloseTo(630);
    expect(r.m390.due).toBe('2027-01-31');
    expect(r.m390.refund).toBe(0);
  });
  it('foreign clients only, €21 IVA on expenses each month → carry forward, refund 252 in the 390', () => {
    const r = ivaYear(year(0, 21), 2026, getParams(2026));
    expect(r.quarters.slice(0, 3).map((q) => q.status)).toEqual(['carry', 'carry', 'carry']);
    expect(r.quarters[2].carryOut).toBeCloseTo(189);
    expect(r.m390.refund).toBeCloseTo(252);
    expect(r.m390.result).toBe(0);
  });
  it('carry is used against a later positive quarter', () => {
    const rows = year(0, 0);
    rows[0] = row(0, 0, 100);
    rows[3] = row(3, 300, 0);
    const r = ivaYear(rows, 2026, getParams(2026));
    expect(r.quarters[1].result).toBeCloseTo(200);
    expect(r.quarters[1].carryIn).toBeCloseTo(100);
  });
  it('no IVA at all → file with zeros; inactive quarter not filed', () => {
    const rows = year(0, 0).map((x, m) => ({ ...x, active: m >= 3 }));
    const r = ivaYear(rows, 2026, getParams(2026));
    expect(r.quarters[0].status).toBe('none');
    expect(r.quarters[1].status).toBe('zero');
  });
});
