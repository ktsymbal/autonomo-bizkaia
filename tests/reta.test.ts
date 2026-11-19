import { describe, it, expect } from 'vitest';
import { retaYear, tramoFor, tarifaPlanaCuota } from '../src/engine/reta';
import { activityLedger, defaultInput } from '../src/engine/activity';
import { getParams } from '../src/params';
import type { CalcInput } from '../src/engine/types';

const flat = (a: number) => Array.from({ length: 12 }, () => ({ amount: a }));
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
  it('year 2 at €60k income, €840 expenses, 20 % tier → SS income after the % → tramo ≤ 4,050 minimum', () => {
    // (59,160 − cuotas) × 0.8 + cuotas, ×0.93/12 ≈ 3,762 → general 10 (index 12), min base 1,601.31
    const r = run(inp({ year: 2027 }));
    expect(r.tramo?.index).toBe(12);
    expect(r.total).toBeCloseTo(504.41 * 12, 2);
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
    expect(r.regularisation).toBeCloseTo((1601.31 - 1000) * 0.315 * 12, 2);
  });
  // Resolved 2026-11-19 (reading B): Bizkaia reports the "rendimiento neto previo atribuido"
  // (https://www.bizkaia.eus/es/nuevo-sistema-cotizacion-seguridad-social-autonomos), and Gure Gida 2025 Id 4014 puts
  // "RENDIMIENTO PREVIO" after the 20/15/10 % coeficiente and before the start-up reduction. LGSS 308.1.c r. 1ª;
  // RD 2064/1995 art. 46.1 (rendimiento neto under each Administración's IRPF rules). The old R2 setting is ignored.
  it('SS income is taken after the simplificada %, whatever the old R2 setting says', () => {
    const i = inp({ year: 2027, expenses: [], clients: [{ name: 'A', type: 'non_eu_company', months: flat(2000), newcomer7: false }] });
    const a = run({ ...i, settings: { ...i.settings, r2: 'A' } });
    const b = run({ ...i, settings: { ...i.settings, r2: 'B' } });
    expect(a).toEqual(b);
    // 24,000/yr: (24,000 − c) × 0.8 + c with c = 12 × 960.78 × 0.315 → ×0.93/12 ≈ 1,544 → general 3 (index 5)
    expect(a.tramo!.index).toBe(5);
  });
  it('the start-up reduction does not lower the SS income', () => {
    const i = inp({ year: 2027 });
    expect(run({ ...i, startup: { claim: true, sex: 'w' } })).toEqual(run(i));
  });
});
