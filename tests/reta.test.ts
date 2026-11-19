import { describe, it, expect } from 'vitest';
import { retaYear, tramoFor, tarifaPlanaCuota } from '../src/engine/reta';
import { activityLedger, defaultInput } from '../src/engine/activity';
import { getParams } from '../src/params';
import type { CalcInput } from '../src/engine/types';

const flat = (a: number) => Array.from({ length: 12 }, () => ({ amount: a, actual: false }));
function inp(over: Partial<CalcInput>): CalcInput {
  return {
    ...defaultInput('2026-11-18'), alta: { year: 2026, month: 1 }, expenseMode: 'itemized',
    expenses: [{ name: 'gestoría', monthly: 70, ivaIncluded: false, foreign: false }],
    clients: [{ name: 'A', type: 'non_eu_company', months: flat(5000), newcomer7: false }], ...over,
  };
}
const run = (i: CalcInput) => { const p = getParams(2026); return retaYear(i, p, activityLedger(i, p), 0.2); };

describe('RETA', () => {
  it('tarifa plana = 80 + 0.9 % × 950.98 = 88.56', () => {
    expect(tarifaPlanaCuota(getParams(2026))).toBeCloseTo(88.56, 2);
  });
  it('alta Jan 2026: whole year on tarifa plana → 1,062.72', () => {
    const r = run(inp({}));
    expect(r.total).toBeCloseTo(1062.72, 2);
    expect(r.months.every((m) => m.regime === 'tp')).toBe(true);
    expect(r.tpEnd).toEqual({ year: 2026, month: 12 });
  });
  it('alta Jul 2026: tarifa plana Jul 2026 – Jun 2027', () => {
    const r = run(inp({ alta: { year: 2026, month: 7 } }));
    expect(r.months.slice(0, 6).every((m) => m.regime === 'none' && m.cuota === 0)).toBe(true);
    expect(r.months.slice(6).every((m) => m.regime === 'tp')).toBe(true);
    expect(r.tpEnd).toEqual({ year: 2027, month: 6 });
    const y2 = run(inp({ alta: { year: 2026, month: 7 }, year: 2027 }));
    expect(y2.months.slice(0, 6).every((m) => m.regime === 'tp')).toBe(true);
    expect(y2.months.slice(6).every((m) => m.regime === 'tramo')).toBe(true);
  });
  it('year 2 at €60k income, €840 expenses → tramo 11 minimum, 6,547.07', () => {
    const r = run(inp({ year: 2027 }));
    expect(r.tramo?.index).toBe(13); // 0-based: reduced 1–3, general 1–12 → general 11 = index 13
    expect(r.total).toBeCloseTo(545.59 * 12, 2); // 6,547.08
  });
  it('tramo 12 cuota at its minimum base = 607.35', () => {
    const p = getParams(2026);
    expect(tramoFor(7000, p).minBase * p.get('reta.rate')).toBeCloseTo(607.35, 2);
  });
  it('not eligible for tarifa plana → tramos from the alta month', () => {
    const r = run(inp({ tpEligible: false }));
    expect(r.months.every((m) => m.regime === 'tramo')).toBe(true);
  });
  it('income below SMI → extension eligible and applied in months 13–24', () => {
    const low = inp({ clients: [{ name: 'A', type: 'non_eu_company', months: flat(1200), newcomer7: false }] });
    expect(run(low).extensionEligible).toBe(true);
    const y2 = run({ ...low, year: 2027 });
    expect(y2.months.every((m) => m.regime === 'tpExt')).toBe(true);
    expect(run(inp({})).extensionEligible).toBe(false);
  });
  it('chosen base below the real tramo minimum → regularisation due', () => {
    const r = run(inp({ year: 2027, retaBase: 1000 }));
    expect(r.regularisation).toBeCloseTo((1732.03 - 1000) * 0.315 * 12, 2);
  });
  it('reading B uses income after the simplificada %', () => {
    // 2,000/month, no expenses: A → 2000*.93=1860 (gen 6); B → (24000−cuotas)*.8+cuotas … lower tramo
    const i = inp({ year: 2027, expenses: [], clients: [{ name: 'A', type: 'non_eu_company', months: flat(2000), newcomer7: false }] });
    const a = run(i);
    const b = run({ ...i, settings: { ...i.settings, r2: 'B' } });
    expect(b.tramo!.index).toBeLessThan(a.tramo!.index);
  });
});
