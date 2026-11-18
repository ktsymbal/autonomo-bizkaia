import { describe, it, expect } from 'vitest';
import { explain } from '../src/components/explain';
import { compute } from '../src/engine/compute';
import { defaultInput } from '../src/engine/activity';
import type { CalcInput } from '../src/engine/types';

const flat = (a: number) => Array.from({ length: 12 }, () => ({ amount: a, actual: false }));
const base = (o: Partial<CalcInput> = {}): CalcInput => ({
  ...defaultInput('2026-11-18'),
  clients: [{ name: '', type: 'non_eu_company', currency: 'EUR', months: flat(4500), newcomer7: false }],
  rentMonthly: 700, under36: true, ...o,
});

describe('explainer steps', () => {
  it('reference example: 12 steps, ledger and amounts match the mockup', () => {
    const i = base();
    const s = explain('uk', i, compute(i));
    const norm = (x: string) => x.replace(/[\s\u00a0\u202f]+/g, ' ').replace(' %', '%');
    expect(s.map((x) => norm(x.title))).toEqual([
      'Дохід за рік', 'Мінус робочі витрати', 'Мінус соцстрах', 'Ваш прибуток',
      'Мінус 20% без податку', 'База для податку', 'Податок за шкалою', 'Мінус 1 615 €', 'Мінус оренда житла',
      'Вам залишається', 'Повернення після Renta', 'У 2027',
    ]);
    const by = (t: string) => s.find((x) => norm(x.title) === t)!;
    expect(by('Ваш прибуток').amount).toBeCloseTo(50237, 0);
    expect(by('База для податку').amount).toBeCloseTo(40190, 0);
    expect(by('Податок за шкалою').amount).toBeCloseTo(10631, 0);
    expect(by('Мінус 1 615 €').ledger.tax).toBeCloseTo(9016, 0);
    expect(by('Мінус оренда житла').ledger.tax).toBeCloseTo(6216, 0);
    expect(by('Вам залишається').amount).toBeCloseTo(44021, 0);
    expect(by('Повернення після Renta').amount).toBeCloseTo(3831, 0);
    const br = by('Податок за шкалою').viz![0];
    expect(br.kind === 'brackets' && br.rows.map((r) => Math.round(r.tax))).toEqual([4158, 5062, 1410]);
  });
  it('the ledger only gains values, never loses them', () => {
    const s = explain('uk', base(), compute(base()));
    for (let k = 1; k < s.length; k++) for (const key of Object.keys(s[k - 1].ledger)) expect(s[k].ledger).toHaveProperty(key);
  });
  it('skips steps that do not apply: no rent, no expenses', () => {
    const i = base({ rentMonthly: 0, expenseMode: 'none' });
    const titles = explain('en', i, compute(i)).map((x) => x.title);
    expect(titles).not.toContain('Minus rent');
    expect(titles).not.toContain('Minus work expenses');
  });
  it('rent lost above €68k for a lease from 2026 shows a ✗', () => {
    const i = base({ clients: [{ name: '', type: 'non_eu_company', currency: 'EUR', months: flat(9000), newcomer7: false }] });
    const rent = explain('en', i, compute(i)).find((x) => x.title === 'Minus rent')!;
    const checks = rent.viz!.find((v) => v.kind === 'checks');
    expect(checks && checks.kind === 'checks' && checks.items.some((x) => x.mark === '✗')).toBe(true);
  });
  it('salary adds a step; children add a credit step', () => {
    const i = base({ salary: { grossMonthly: 2500, withheldMonthly: null, shortContract: false }, kidsUnder6: 1 });
    const titles = explain('en', i, compute(i)).map((x) => x.title);
    expect(titles).toContain('Plus your salary');
    expect(titles).toContain('Minus the children deduction');
  });
  it('new deductions each get a step, and the tax ends at the engine\'s figure', () => {
    const i = base({ purchaseAnnual: 6000, ascendants: 1, disability: 1, carer: 'domestic' });
    const r = compute(i);
    const steps = explain('en', i, r);
    const titles = steps.map((x) => x.title);
    for (const t of ['Minus buying your home', 'Minus parents living with you', 'Minus disability', 'Minus a carer at home']) expect(titles).toContain(t);
    const lastTaxStep = [...steps].reverse().find((x) => x.ch === 1)!;
    expect(lastTaxStep.ledger.tax).toBeCloseTo(r.annual.irpf.cl, 2);
  });
  it('joint filing comparison is in the result when a partner salary is given', () => {
    const r = compute(base({ partner: true, partnerGross: 0 }));
    expect(r.joint).not.toBeNull();
    expect(r.joint!.joint).toBeLessThan(r.joint!.separate);
    expect(compute(base()).joint).toBeNull();
  });
});
