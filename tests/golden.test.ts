import { describe, it, expect } from 'vitest';
import { compute, solveIncomeFor } from '../src/engine/compute';
import { defaultInput } from '../src/engine/activity';
import { getParams } from '../src/params';
import type { CalcInput } from '../src/engine/types';

const flat = (a: number) => Array.from({ length: 12 }, () => ({ amount: a }));
const all2026 = { paramsFor: () => getParams(2026) };

/** Spec §8.1: €5,000/month non-EU B2B, alta 1 Jan, under 36, rent €700/month, expenses €840/yr.
 *  SS income after the 20/15/10 % (reading B, resolved 2026-11-19: Gure Gida Id 4014 + bizkaia.eus "rendimiento neto previo atribuido"). */
function nomad(year: 2026 | 2027): CalcInput {
  return {
    ...defaultInput('2026-11-18'),
    year,
    alta: { year: 2026, month: 1 },
    clients: [{ name: 'Client', type: 'non_eu_company', months: flat(5000), newcomer7: false }],
    expenseMode: 'itemized',
    expenses: [{ name: 'gestoría', monthly: 70, ivaIncluded: false, foreign: false }],
    under36: true,
    rentMonthly: 700,
  };
}
const shift = (i: CalcInput, years: number): CalcInput => ({ ...i, alta: { year: 2026 - years, month: 1 } });

describe('golden: the abroad nomad, years 1–3 (2026 parameters)', () => {
  it('year 1', () => {
    const r = compute(nomad(2026), all2026);
    expect(r.annual.reta).toBeCloseTo(1063, 0);
    expect(r.annual.irpf.cl).toBeCloseTo(8417, 0);
    expect(r.annual.prepaid).toBeCloseTo(11619, 0);
    expect(r.annual.renta).toBeCloseTo(-3202, 0);
    expect(r.keptMonthly).toBeCloseTo(4140, 0);
    expect(r.warnings.map((w) => w.id)).toContain('W4');
  });
  it('year 2', () => {
    const r = compute(shift(nomad(2026), 1), all2026);
    expect(r.yi).toBe(1);
    // SS income (59,160 − 6,052.92) × 0.85 + 6,052.92 = 51,193.94 → ×0.93/12 = 3,967.53 → tramo ≤ 4,050, min 1,601.31
    expect(r.annual.reta).toBeCloseTo(6052.92, 2);
    expect(r.annual.tier).toBe(0.15);
    expect(r.annual.irpf.cl).toBeCloseTo(7949, 0);
    expect(r.annual.prepaid).toBeCloseTo(10621, 0);
    expect(r.annual.renta).toBeCloseTo(-2672, 0);
    expect(r.keptMonthly).toBeCloseTo(3763, 0);
  });
  it('year 3: 130 = 5 % × RN of year 1', () => {
    const r = compute(shift(nomad(2026), 2), all2026);
    expect(r.q130[0].regime).toBe('general');
    expect(r.annual.prepaid).toBeCloseTo(9296, 0);
    expect(r.annual.renta).toBeCloseTo(-1346, 0);
    expect(r.warnings.map((w) => w.id)).toContain('W3');
  });
  it('next-year card from year 1 shows the drop once the tarifa plana ends', () => {
    const r = compute(nomad(2026), all2026);
    expect(r.nextYear!.keptMonthly).toBeCloseTo(3763, 0);
    expect(r.nextYear!.tpEndsThisYear).toBe(true);
    expect(r.compare!.noTarifaPlanaMonthly).toBeLessThan(r.keptMonthly);
  });
});

describe('compute: other cases', () => {
  it('pluri: €40k salary + €2k/month freelance → bonificación forced to €3,000 and a Renta bill', () => {
    const r = compute({
      ...nomad(2026), persona: 'pluri', rentMonthly: 0, under36: false, tpEligible: false,
      clients: [{ name: 'C', type: 'non_eu_company', months: flat(2000), newcomer7: false }],
      salary: { grossMonthly: 40000 / 12, withheldMonthly: null, shortContract: false },
    });
    expect(r.annual.salaryWithheld).toBeCloseTo(6800, 0);
    expect(r.annual.workBonif).toBe(3000);
    const ids = r.warnings.map((w) => w.id);
    expect(ids).toContain('W14');
    expect(r.annual.irpf.cl).toBeGreaterThan(r.annual.salaryWithheld);
  });
  it('alta in July: 6 active months, first half zero, W18', () => {
    const r = compute({ ...nomad(2026), alta: { year: 2026, month: 7 } });
    expect(r.activeMonths).toBe(6);
    expect(r.months.slice(0, 6).every((m) => !m.active && m.income === 0)).toBe(true);
    expect(r.q130[0].regime).toBe('none');
    expect(r.warnings.map((w) => w.id)).toContain('W18');
  });
  it('not registered yet in November → first year is next calendar year', () => {
    const r = compute({ ...nomad(2026), alta: null });
    expect(r.year).toBe(2027);
    expect(r.alta).toEqual({ year: 2027, month: 1 });
  });
  it('reverse mode round-trips', () => {
    const i = nomad(2026);
    const k = solveIncomeFor(compute(i, all2026).keptMonthly, i, all2026);
    expect(k).toBeCloseTo(1, 3);
  });
  it('unverified params raise W16 and are listed', () => {
    const r = compute(nomad(2026));
    expect(r.unverified).toContain('reta.tarifaPlana'); // €80 has no 2026 legal text (RDL 13/2022 DT 5ª defers to an LPGE)
    expect(r.warnings.map((w) => w.id)).toContain('W16');
  });
  // Instrucción bizkaia.eus 900004921: "el rendimiento neto previo del ejercicio anterior no se eleva al año en los
  // supuestos de inicio de actividad". Alta Oct 2026 at €5,000/mo: 2026 D ≈ 15k (≈ 60k annualised) → 2027 tier 20 %, not 15 %.
  // https://www.bizkaia.eus/ogasuna/guregida/noticia.asp?Idioma=ca&idregistro=900004921
  it('part-year start year is not annualised for the next year\'s tier', () => {
    const r = compute({ ...nomad(2027), alta: { year: 2026, month: 10 } }, all2026);
    expect(r.annual.tier).toBe(0.2);
  });
  it('old share links: the deprecated settings r2 / s1 / s2 do not change the result', () => {
    const i = shift(nomad(2026), 1);
    const base = compute(i, all2026);
    for (const settings of [{ r2: 'B', s1: '15', s2: true }, { r2: 'A', s1: 'tier', s2: false }] as const) {
      const r = compute({ ...i, settings: { ...settings } }, all2026);
      expect(r.keptMonthly).toBe(base.keptMonthly);
      expect(r.q130).toEqual(base.q130);
      expect(r.annual.reta).toBe(base.annual.reta);
    }
  });
  it('Spanish company client: retención reduces the cash and is credited', () => {
    const r = compute({ ...nomad(2026), clients: [{ name: 'ES', type: 'es_company', months: flat(3000), newcomer7: true }] });
    expect(r.annual.retencion).toBeCloseTo(36000 * 0.07, 2);
    expect(r.q130.filter((q) => q.regime !== 'none').every((q) => q.regime === 'waived')).toBe(true);
    expect(r.iva.quarters[0].status).toBe('pay');
  });
  it('zero income does not crash and keeps nothing negative-infinite', () => {
    const r = compute({ ...nomad(2026), clients: [] });
    expect(Number.isFinite(r.keptMonthly)).toBe(true);
    expect(r.annual.irpf.cl).toBe(0);
  });
});
