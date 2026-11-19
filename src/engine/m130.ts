import type { Params } from '../params';

export type QuarterAgg = { income: number; expenses: number; retencion: number; incomeWithRet: number; active: boolean };
export type Regime130 = 'none' | 'start' | 'general' | 'loss' | 'waived';
export type Q130 = { q: 1 | 2 | 3 | 4; due: string; regime: Regime130; boxes: Record<string, number>; pay: number; negative: boolean };

export type M130Args = {
  year: number;
  yi: number; // years since alta
  quarters: QuarterAgg[]; // 4; expenses include RETA cuotas of the quarter
  tierPct: number;
  rnYm2: number | null; // RN of year−2, annualised if it was the alta year
  incomeYm2: number | null;
  retYm2: number | null;
};

/** Bizkaia modelo 130 (RIRPF arts. 109–110, OF 636/2014). Non-cumulative. */
export function m130(a: M130Args, p: Params): Q130[] {
  const r = p.get('p130');
  const dl = p.get('deadlines').q130;
  const yearIncome = a.quarters.reduce((s, x) => s + x.income, 0);
  const yearWithRet = a.quarters.reduce((s, x) => s + x.incomeWithRet, 0);
  const waived = yearIncome > 0 && yearWithRet / yearIncome >= r.waiverShare;
  // Box 09 = ingresos computables − gastos deducibles of the quarter, without the art. 28 NF % (RIRPF 110.1.a;
  // 130 instructions casilla 10; FAQs 900001004/900001005). The old user setting S1 no longer changes this.
  const s1Factor = p.get('p130.simplificadaInside') ? 1 - a.tierPct : 1;

  return a.quarters.map((x, i) => {
    const qn = (i + 1) as 1 | 2 | 3 | 4;
    const due = qn === 4 ? `${a.year + 1}-${dl[3]}` : `${a.year}-${dl[i]}`;
    if (!x.active) return { q: qn, due, regime: 'none' as const, boxes: {}, pay: 0, negative: false };
    if (waived) return { q: qn, due, regime: 'waived' as const, boxes: {}, pay: 0, negative: false };

    let boxes: Record<string, number>;
    let regime: Regime130;
    let result: number;
    if (a.yi <= 1 || a.rnYm2 === null) {
      regime = 'start';
      const b09 = (x.income - x.expenses) * (x.income - x.expenses > 0 ? s1Factor : 1);
      const b10 = Math.max(0, b09) * r.startRate;
      result = b10 - x.retencion;
      boxes = { '09': b09, '10': b10, '11': x.retencion, '12': result };
    } else if (a.rnYm2 > 0) {
      regime = 'general';
      const b02 = a.rnYm2 * r.generalRate;
      const b03 = (a.retYm2 ?? 0) * r.generalRetShare;
      result = b02 - b03;
      boxes = { '01': a.rnYm2, '02': b02, '03': b03, '04': result };
    } else {
      regime = 'loss';
      const b16 = (a.incomeYm2 ?? 0) * r.lossRate;
      const b17 = (a.retYm2 ?? 0) * r.generalRetShare;
      result = b16 - b17;
      boxes = { '15': a.incomeYm2 ?? 0, '16': b16, '17': b17, '18': result };
    }
    const pay = Math.max(0, result);
    boxes['28'] = pay;
    return { q: qn, due, regime, boxes, pay, negative: result <= 0 };
  });
}
