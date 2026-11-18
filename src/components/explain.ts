import type { CalcResult } from '../engine/compute';
import type { CalcInput } from '../engine/types';
import { brackets } from '../engine/irpf';
import { getParams, type Key } from '../params';
import { eur, pct, t, type Lang } from '../i18n/t';

export type LedgerKey = 'income' | 'profit' | 'base' | 'tax' | 'keep';

export type Viz =
  | { kind: 'brackets'; rows: { label: string; rate: number; tax: number; share: number }[]; total: number }
  | { kind: 'taxbar'; total: number; left: number; cuts: { amount: number; now: boolean }[] }
  | { kind: 'checks'; items: { mark: '✓' | '✗' | '=' | '↓'; text: string }[] }
  | { kind: 'pair'; a: { label: string; value: string }; b: { label: string; value: string }; note?: string }
  | { kind: 'gauge'; value: number; max: number; marks: { at: number; label: string }[]; you: string };

export type Step = {
  ch: 0 | 1 | 2;
  focus: LedgerKey;
  title: string;
  amount: number | null; // signed: negative = taken away
  line: string;
  viz?: Viz[];
  formula?: string;
  src?: { label: string; key: Key };
  ledger: Partial<Record<LedgerKey, number>>; // values known after this step
};

/** Build the guided walkthrough from a finished calculation. Steps that don't apply are skipped. */
export function explain(lang: Lang, input: CalcInput, r: CalcResult): Step[] {
  const p = getParams(r.year as 2026 | 2027);
  const a = r.annual;
  const e = (x: number) => eur(lang, x);
  const steps: Step[] = [];
  const known: Partial<Record<LedgerKey, number>> = {};
  const push = (s: Omit<Step, 'ledger'>, set?: Partial<Record<LedgerKey, number>>) => {
    Object.assign(known, set);
    steps.push({ ...s, ledger: { ...known } });
  };
  const months = r.activeMonths;
  const totalIn = a.income + a.salaryGross;

  // ── Chapter 1: profit ─────────────────────────────────────────
  push(
    {
      ch: 0, focus: 'income', title: t(lang, 'ex.income.t'), amount: a.income, line: t(lang, 'ex.income.l'),
      formula: t(lang, 'ex.income.f', { months, monthly: e(a.income / Math.max(1, months)), total: e(a.income) }),
    },
    { income: totalIn },
  );
  if (a.expenses > 0.5) {
    push({
      ch: 0, focus: 'profit', title: t(lang, 'ex.exp.t'), amount: -a.expenses, line: t(lang, 'ex.exp.l'),
      formula: input.expenseMode === 'pct'
        ? t(lang, 'ex.exp.fPct', { pct: input.expensePct, income: e(a.income), x: e(a.expenses) })
        : t(lang, 'ex.exp.fList', { months, x: e(a.expenses) }),
      src: { label: 'NF 13/2013, art. 25', key: 'irpf.scale' },
    });
  }
  if (a.reta > 0.5) {
    const tp = r.reta.months.find((m) => m.regime === 'tp' || m.regime === 'tpExt');
    const tr = r.reta.months.find((m) => m.regime === 'tramo');
    push({
      ch: 0, focus: 'profit', title: t(lang, 'ex.reta.t'), amount: -a.reta,
      line: tp && !tr ? t(lang, 'ex.reta.lTp', { m: eur(lang, tp.cuota, true) }) : t(lang, 'ex.reta.lTramo', { m: e(tr?.cuota ?? a.reta / months), n: (r.reta.tramo?.index ?? 0) + 1 }),
      formula: t(lang, 'ex.reta.f', { months, x: e(a.reta) }),
      src: tp ? { label: 'Ley 20/2007, art. 38 ter', key: 'reta.tarifaPlana' } : { label: 'LGSS art. 308; Orden PJC/297/2026', key: 'reta.tramos' },
    });
  }
  push(
    {
      ch: 0, focus: 'profit', title: t(lang, 'ex.profit.t'), amount: a.D, line: t(lang, 'ex.profit.l'),
      formula: `${e(a.income)} − ${e(a.expenses)} − ${e(a.reta)} = <b>${e(a.D)}</b>`,
    },
    { profit: a.D },
  );

  // ── Chapter 2: tax ────────────────────────────────────────────
  const tierAmt = a.D > 0 ? a.D * a.tier : 0;
  if (tierAmt > 0.5) {
    push({
      ch: 1, focus: 'base', title: t(lang, 'ex.tier.t', { pct: pct(lang, a.tier, 0) }), amount: -tierAmt,
      line: t(lang, r.yi <= 0 ? 'ex.tier.lFirst' : 'ex.tier.l', { pct: pct(lang, a.tier, 0) }),
      formula: t(lang, 'ex.tier.f', { pct: pct(lang, a.tier, 0), D: e(a.D), x: e(tierAmt) }),
      src: { label: 'NF 13/2013, art. 28.1.b', key: 'irpf.simplificadaTiers' },
    });
  }
  const startupAmt = Math.max(0, a.D - tierAmt - Math.max(0, a.rnAct));
  if (startupAmt > 0.5) {
    push({
      ch: 1, focus: 'base', title: t(lang, 'ex.startup.t'), amount: -startupAmt,
      line: t(lang, 'ex.startup.l', { pct: pct(lang, p.get('irpf.startup')[input.startup.sex], 0) }),
      src: { label: 'NF 13/2013, art. 25.5', key: 'irpf.startup' },
    });
  }
  if (a.salaryGross > 0) {
    push({
      ch: 1, focus: 'base', title: t(lang, 'ex.salary.t'), amount: a.rnTrab, line: t(lang, 'ex.salary.l'),
      formula: t(lang, 'ex.salary.f', { gross: e(a.salaryGross), ss: e(a.salarySS), bonif: e(a.workBonif), x: e(a.rnTrab) }),
      src: { label: 'NF 13/2013, arts. 22–23', key: 'irpf.workBonif' },
    });
  }
  const epsv = a.irpf.bi - a.irpf.bl;
  if (epsv > 0.5) {
    push({ ch: 1, focus: 'base', title: t(lang, 'ex.epsv.t'), amount: -epsv, line: t(lang, 'ex.epsv.l'), src: { label: 'NF 13/2013, art. 71', key: 'irpf.epsvCap' } });
  }
  push(
    { ch: 1, focus: 'base', title: t(lang, 'ex.base.t'), amount: a.irpf.bl, line: t(lang, 'ex.base.l') },
    { base: a.irpf.bl },
  );

  const br = brackets(a.irpf.bl, p);
  const scaleTax = br.reduce((s, b) => s + b.tax, 0);
  if (scaleTax > 0.5) {
    push(
      {
        ch: 1, focus: 'tax', title: t(lang, 'ex.scale.t'), amount: scaleTax, line: t(lang, 'ex.scale.l'),
        viz: [{
          kind: 'brackets', total: scaleTax,
          rows: br.map((b, k) => ({
            label: k === br.length - 1 && b.to !== null && a.irpf.bl < b.to ? t(lang, 'ex.scale.rest', { amt: e(b.amount) }) : b.to === null ? t(lang, 'ex.scale.rest', { amt: e(b.amount) }) : t(lang, 'ex.scale.upto', { upto: e(b.to) }),
            rate: b.rate, tax: b.tax, share: b.amount / a.irpf.bl,
          })),
        }],
        formula: t(lang, 'ex.scale.f'),
        src: { label: 'NF 13/2013, art. 75', key: 'irpf.scale' },
      },
      { tax: scaleTax },
    );
  }

  // Credits off the tax, each its own step, the tax bar shrinking.
  const credits: { key: string; amount: number; build: (from: number, to: number) => Omit<Step, 'ledger'> }[] = [];
  const minor = Math.min(p.get('irpf.minoracion'), scaleTax);
  if (minor > 0.5) {
    credits.push({
      key: 'minor', amount: minor,
      build: (from, to) => ({
        ch: 1, focus: 'tax', title: t(lang, 'ex.minor.t', { x: e(minor) }), amount: -minor, line: t(lang, 'ex.minor.l'),
        formula: t(lang, 'ex.minor.f', { from: e(from), x: e(minor), to: e(to) }),
        src: { label: 'NF 13/2013, art. 77', key: 'irpf.minoracion' },
      }),
    });
  }
  const kids = Math.min(a.irpf.deductions.descendants, Math.max(0, a.irpf.ci));
  if (kids > 0.5) {
    credits.push({
      key: 'kids', amount: kids,
      build: (from, to) => ({
        ch: 1, focus: 'tax', title: t(lang, 'ex.kids.t'), amount: -kids, line: t(lang, input.partner ? 'ex.kids.lHalf' : 'ex.kids.l'),
        formula: `${e(from)} − ${e(kids)} = <b>${e(to)}</b>`,
        src: { label: 'NF 13/2013, art. 79', key: 'irpf.descendants' },
      }),
    });
  }
  if (input.rentMonthly > 0) {
    const rp = p.get('irpf.rent');
    const enhanced = input.under36 || input.largeFamily;
    const tierR = enhanced ? rp.enhanced : rp.base;
    const rentYear = input.rentMonthly * 12;
    const raw = tierR.rate * rentYear;
    const lost = input.leaseFrom2026 && a.irpf.bl > rp.blCap;
    const rentCredit = Math.min(a.irpf.deductions.rent, Math.max(0, a.irpf.ci - kids));
    const items: { mark: '✓' | '✗' | '=' | '↓'; text: string }[] = [
      { mark: '✓', text: input.largeFamily && !input.under36 ? t(lang, 'ex.rent.large', { rate: pct(lang, tierR.rate, 0) }) : t(lang, enhanced ? 'ex.rent.young' : 'ex.rent.old', { rate: pct(lang, tierR.rate, 0) }) },
      { mark: '=', text: t(lang, 'ex.rent.calc', { rate: pct(lang, tierR.rate, 0), rent: e(rentYear), x: e(raw) }) },
    ];
    if (raw > tierR.cap) items.push({ mark: '↓', text: t(lang, 'ex.rent.cap', { cap: e(tierR.cap) }) });
    if (input.leaseFrom2026) items.push(lost ? { mark: '✗', text: t(lang, 'ex.rent.over', { bl: e(a.irpf.bl), lim: e(rp.blCap) }) } : { mark: '✓', text: t(lang, 'ex.rent.under', { bl: e(a.irpf.bl), lim: e(rp.blCap) }) });
    credits.push({
      key: 'rent', amount: rentCredit,
      build: (from, to) => ({
        ch: 1, focus: 'tax', title: t(lang, 'ex.rent.t'), amount: -rentCredit, line: t(lang, lost ? 'ex.rent.lLost' : 'ex.rent.l'),
        viz: [{ kind: 'checks', items }],
        formula: `${e(from)} − ${e(rentCredit)} = <b>${e(to)}</b>`,
        src: { label: 'NF 13/2013, art. 86', key: 'irpf.rent' },
      }),
    });
  }
  let running = scaleTax;
  credits.forEach((c, k) => {
    const from = running;
    running = Math.max(0, running - c.amount);
    const s = c.build(from, running);
    const cuts = credits.slice(0, k + 1).map((x, j) => ({ amount: x.amount, now: j === k }));
    s.viz = [{ kind: 'taxbar', total: scaleTax, left: running, cuts }, ...(s.viz ?? [])];
    push(s, { tax: running });
  });
  if (!credits.length) Object.assign(known, { tax: a.irpf.cl });

  // ── Chapter 3: what's left ────────────────────────────────────
  const keptYear = r.keptMonthly * r.denominator;
  push(
    {
      ch: 2, focus: 'keep', title: t(lang, 'ex.keep.t'), amount: keptYear, line: t(lang, 'ex.keep.l', { m: e(r.keptMonthly) }),
      formula: a.salaryGross
        ? t(lang, 'ex.keep.fSalary', { inc: e(totalIn), out: e(a.expenses + a.reta + a.salarySS + a.irpf.cl), x: e(keptYear) })
        : `${e(a.income)} − ${e(a.expenses)} − ${e(a.reta)} − ${e(a.irpf.cl)} = <b>${e(keptYear)}</b>`,
    },
    { tax: a.irpf.cl, keep: keptYear },
  );
  if (Math.abs(a.renta) > 0.5) {
    const refund = a.renta < 0;
    push({
      ch: 2, focus: 'tax', title: t(lang, refund ? 'ex.refund.t' : 'ex.pay.t'), amount: Math.abs(a.renta), line: t(lang, refund ? 'ex.refund.l' : 'ex.pay.l'),
      viz: [{ kind: 'pair', a: { label: t(lang, 'ex.refund.prepaid'), value: e(a.prepaid) }, b: { label: t(lang, 'ex.refund.real'), value: e(a.irpf.cl) }, note: t(lang, refund ? 'ex.refund.when' : 'ex.pay.when', { year: r.year + 1 }) }],
      formula: t(lang, 'ex.refund.f'),
      src: { label: 'RIRPF Bizkaia, art. 110', key: 'p130' },
    });
  }
  if (r.nextYear) {
    const n = r.nextYear;
    const viz: Viz[] = [];
    const tierChanged = Math.abs(n.tier - a.tier) > 0.001;
    const retaThis = months ? a.reta / months : 0;
    const retaChanged = Math.abs(n.retaMonthly - retaThis) > 1;
    if (tierChanged || retaChanged) {
      viz.push({
        kind: 'pair',
        a: { label: t(lang, 'ex.next.tier'), value: `${pct(lang, a.tier, 0)} → ${pct(lang, n.tier, 0)}` },
        b: { label: t(lang, 'ex.next.reta'), value: `${e(retaThis)} → ${e(n.retaMonthly)}` },
      });
    }
    if (a.D > 0) {
      const tiers = p.get('irpf.simplificadaTiers').filter(([u]) => u !== null) as [number, number][];
      const max = Math.max(tiers[tiers.length - 1][0], a.D * 1.1);
      viz.push({ kind: 'gauge', value: a.D, max, you: t(lang, 'ex.next.you'), marks: tiers.map(([u, r2], k) => ({ at: u, label: `${e(u)} → ${pct(lang, tiers[k + 1]?.[1] ?? 0.1, 0)}` })) });
    }
    push({
      ch: 2, focus: 'keep', title: t(lang, 'ex.next.t', { year: n.year }), amount: null,
      line: t(lang, 'ex.next.l', { m: e(n.keptMonthly) }),
      viz,
      src: { label: 'NF 13/2013, art. 28.1.b · LGSS art. 308', key: 'irpf.simplificadaTiers' },
    });
  }
  return steps;
}
