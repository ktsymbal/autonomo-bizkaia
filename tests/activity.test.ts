import { describe, it, expect } from 'vitest';
import { activityLedger, defaultInput, effectiveAlta, isPast } from '../src/engine/activity';
import { getParams } from '../src/params';
import type { CalcInput, Client } from '../src/engine/types';

const p = () => getParams(2026);
const flat = (amount: number): Client['months'] => Array.from({ length: 12 }, () => ({ amount }));

function input(over: Partial<CalcInput>): CalcInput {
  return { ...defaultInput('2026-11-18'), alta: { year: 2026, month: 1 }, expenseMode: 'none', ...over };
}

describe('activityLedger', () => {
  it('non-EU invoice: no IVA, no retención', () => {
    const rows = activityLedger(input({
      clients: [{ name: 'A', type: 'non_eu_company', months: flat(5000), newcomer7: false }],
    }), p());
    expect(rows[0].income).toBe(5000);
    expect(rows[0].ivaOut).toBe(0);
    expect(rows[0].retencion).toBe(0);
  });

  it('Spanish company: 21 % IVA and 15 % retención, 7 % for newcomers in S..S+2', () => {
    const c: Client = { name: 'B', type: 'es_company', months: flat(1000), newcomer7: false };
    let rows = activityLedger(input({ clients: [c] }), p());
    expect(rows[0].ivaOut).toBeCloseTo(210);
    expect(rows[0].retencion).toBeCloseTo(150);
    expect(rows[0].incomeWithRet).toBeCloseTo(1000);
    rows = activityLedger(input({ clients: [{ ...c, newcomer7: true }], alta: { year: 2024, month: 5 } }), p());
    expect(rows[0].retencion).toBeCloseTo(70);
    rows = activityLedger(input({ clients: [{ ...c, newcomer7: true }], alta: { year: 2023, month: 5 } }), p());
    expect(rows[0].retencion).toBeCloseTo(150);
  });

  it('Spanish private client: IVA but no retención', () => {
    const rows = activityLedger(input({ clients: [{ name: 'C', type: 'es_private', months: flat(100), newcomer7: false }] }), p());
    expect(rows[0].ivaOut).toBeCloseTo(21);
    expect(rows[0].retencion).toBe(0);
  });

  it('months before the alta are inactive and zero', () => {
    const rows = activityLedger(input({ alta: { year: 2026, month: 7 }, clients: [{ name: 'A', type: 'eu_company', months: flat(1000), newcomer7: false }] }), p());
    expect(rows.slice(0, 6).every((r) => !r.active && r.income === 0)).toBe(true);
    expect(rows[6].active).toBe(true);
    expect(rows[6].income).toBe(1000);
  });

  it('alta in a later year → whole year inactive', () => {
    const rows = activityLedger(input({ alta: { year: 2027, month: 1 } }), p());
    expect(rows.every((r) => !r.active)).toBe(true);
  });

  it('expenses: pct mode has no IVA; itemized with IVA splits base and deductible IVA', () => {
    const c: Client = { name: 'A', type: 'non_eu_company', months: flat(2000), newcomer7: false };
    let rows = activityLedger(input({ clients: [c], expenseMode: 'pct', expensePct: 5 }), p());
    expect(rows[0].expenses).toBeCloseTo(100);
    expect(rows[0].ivaIn).toBe(0);
    rows = activityLedger(input({ clients: [c], expenseMode: 'itemized', expenses: [{ name: 'cowork', monthly: 121, ivaIncluded: true, foreign: false }] }), p());
    expect(rows[0].expenses).toBeCloseTo(100);
    expect(rows[0].ivaIn).toBeCloseTo(21);
    rows = activityLedger(input({ clients: [c], expenseMode: 'itemized', expenses: [{ name: 'saas', monthly: 50, ivaIncluded: false, foreign: true }] }), p());
    expect(rows[0].expenses).toBeCloseTo(50);
    expect(rows[0].ivaIn).toBe(0);
  });


  it('not registered yet → alta next month, or 1 Jan next year from October', () => {
    expect(effectiveAlta({ ...defaultInput('2026-05-18'), alta: null })).toEqual({ year: 2026, month: 6 });
    expect(effectiveAlta({ ...defaultInput('2026-11-18'), alta: null })).toEqual({ year: 2027, month: 1 });
  });

  it('months before the current one are real; the current month and later are an estimate', () => {
    const rows = activityLedger(input({ clients: [{ name: 'A', type: 'eu_company', months: flat(1000), newcomer7: false }] }), p());
    expect(rows[9].forecast).toBe(false); // October, asOf 18 November
    expect(rows[10].forecast).toBe(true); // November
    expect(rows[11].forecast).toBe(true);
  });
  it('a past year has no estimated months, a future year only estimates', () => {
    expect(isPast({ ...defaultInput('2027-03-01'), year: 2026 }, 11)).toBe(true);
    expect(isPast({ ...defaultInput('2026-11-18'), year: 2027 }, 0)).toBe(false);
  });
});
