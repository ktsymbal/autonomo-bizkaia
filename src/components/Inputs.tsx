import type { ComponentChildren } from 'preact';
import { ChevronRight, Plus, Trash2 } from 'lucide-preact';
import { defaultClient, effectiveAlta, isActive, isPast } from '../engine/activity';
import { clientView, clientsToStreams, emptyRow, setClient, setRows, setUntil, streamsToClients, type IncomeRow } from '../engine/periods';
import type { CalcInput, Client, ClientType, Expense, YM } from '../engine/types';
import type { CalcResult } from '../engine/compute';
import { eur, pct as fpct, t, tList, type Lang } from '../i18n/t';
import { salaryWithholdingPct } from '../engine/employment';
import { getParams } from '../params';
import { Check, Field, NumberInput, Seg, Select, Stepper } from './ui';

export type Setter = (fn: (i: CalcInput) => CalcInput) => void;
type P = { lang: Lang; input: CalcInput; set: Setter };

const CLIENT_TYPES: ClientType[] = ['non_eu_company', 'eu_company', 'es_company', 'es_private'];
const typeOptions = (lang: Lang) => CLIENT_TYPES.map((v) => ({ value: v, label: t(lang, `client.${v}`) }));

/** First month of activity in the selected year (0 = January). */
function startMonth(input: CalcInput): number {
  const a = effectiveAlta(input);
  return a.year === input.year ? a.month - 1 : a.year > input.year ? 12 : 0;
}
/** The earliest month a first income row may start: free when you registered this year (the row sets the alta month). */
const rowFloor = (input: CalcInput) => (input.alta && input.alta.year === input.year ? 0 : Math.min(11, startMonth(input)));
const yearsIn = (input: CalcInput) => input.year - effectiveAlta(input).year;
const ymAdd = (ym: YM, n: number): YM => { const z = ym.year * 12 + ym.month - 1 + n; return { year: Math.floor(z / 12), month: (z % 12) + 1 }; };
const ymText = (lang: Lang, ym: YM) => `${tList(lang, 'months.long')[ym.month - 1]} ${ym.year}`;

function Chips({ lang, input, type, newcomer7, amount }: { lang: Lang; input: CalcInput; type: ClientType; newcomer7: boolean; amount: number }) {
  const yi = input.year - effectiveAlta(input).year;
  const rate = newcomer7 && yi <= 2 ? 0.07 : 0.15;
  const chips: string[] = [];
  if (type === 'eu_company') chips.push(t(lang, 'chip.noIvaEu'), t(lang, 'chip.noRet'));
  if (type === 'non_eu_company') chips.push(t(lang, 'chip.noIvaNonEu'), t(lang, 'chip.noRet'));
  if (type === 'es_private') chips.push(t(lang, 'chip.iva', { amount: eur(lang, amount * 0.21) }), t(lang, 'chip.noRet'));
  if (type === 'es_company') chips.push(t(lang, 'chip.iva', { amount: eur(lang, amount * 0.21) }), t(lang, 'chip.ret', { rate: fpct(lang, rate, 0), amount: eur(lang, amount * rate) }));
  return <div class="chips">{chips.map((x) => <span class="chip">{x}</span>)}</div>;
}

/* ---------- Income as periods ---------- */

function ClientCard({ lang, input, rows, idx, count, setRowsOf, remove }: { lang: Lang; input: CalcInput; rows: IncomeRow[]; idx: number; count: number; setRowsOf: (rows: IncomeRow[]) => void; remove: () => void }) {
  const v = clientView(rows);
  const long = tList(lang, 'months.long');
  const floor = rowFloor(input);
  const short = tList(lang, 'months.short');
  const months = (min: number, names = long) => names.map((l, k) => ({ value: k, label: l })).filter((o) => o.value >= min);
  const firstFrom = Math.max(v.rows[0].from, floor);
  const last = v.rows[v.rows.length - 1];
  const paid = v.rows.some((r) => r.amount > 0);
  const avg = v.rows.reduce((s, r) => s + r.amount, 0) / v.rows.length;
  const editRow = (k: number, r: IncomeRow) => setRowsOf(setRows(rows, v.rows.map((x, n) => (n === k ? r : x))));
  return (
    <div class="client">
      <div class="client-head">
        <span style="flex:1">
          <Select value={v.type} label={t(lang, 'income.clientType')} options={typeOptions(lang)} onChange={(ty) => setRowsOf(setClient(rows, ty, v.newcomer7))} />
        </span>
        {count > 1 ? (
          <button type="button" class="iconbtn" aria-label={t(lang, 'client.remove')} onClick={remove}>
            <Trash2 size={18} aria-hidden="true" />
          </button>
        ) : null}
      </div>
      {v.rows.map((r, k) => (
        <div class="prow-main">
          <div class="p-from">
            <Field label={t(lang, 'income.from')}>
              <Select value={k === 0 ? firstFrom : r.from} label={t(lang, 'income.from')} options={months(k === 0 ? floor : v.rows[k - 1].from + 1, short)} onChange={(m) => editRow(k, { ...r, from: m })} />
            </Field>
          </div>
          <div class="p-amount">
            <Field label={t(lang, 'income.amount')}>
              <NumberInput lang={lang} min={0} unit="€" value={r.amount || null} placeholder="0" onChange={(x) => editRow(k, { ...r, amount: x ?? 0 })} />
            </Field>
          </div>
          {v.rows.length > 1 ? (
            <button type="button" class="iconbtn p-del" aria-label={t(lang, 'income.removeRow')} onClick={() => setRowsOf(setRows(rows, v.rows.filter((_, n) => n !== k)))}>
              <Trash2 size={18} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      ))}
      <div class="client-foot">
        {last.from < 11 && (v.until === null || last.from < v.until) ? (
          <button type="button" class="linkbtn" onClick={() => setRowsOf(setRows(rows, [...v.rows, { ...last, from: last.from + 1 }]))}>{t(lang, 'income.changed')}</button>
        ) : <span />}
        <label class="until">
          <span class="lbl">{t(lang, 'income.until')}</span>
          <Select
            value={v.until === null ? -1 : v.until}
            label={t(lang, 'income.until')}
            options={[{ value: -1, label: t(lang, 'income.ongoing') }, ...months(firstFrom)]}
            onChange={(u) => setRowsOf(setUntil(rows, u === -1 ? null : u))}
          />
        </label>
      </div>
      {v.type === 'es_company' && yearsIn(input) <= 2 ? <Check checked={v.newcomer7} onChange={(x) => setRowsOf(setClient(rows, v.type, x))}>{t(lang, 'client.newcomer7')}</Check> : null}
      {paid ? <Chips lang={lang} input={input} type={v.type} newcomer7={v.newcomer7} amount={avg} /> : null}
    </div>
  );
}

function Periods({ lang, input, set }: P) {
  const streams = input.income.streams;
  const setStreams = (fn: (s: IncomeRow[][]) => IncomeRow[][]) => set((i) => ({ ...i, income: { ...i.income, streams: fn(i.income.streams) } }));
  const floor = rowFloor(input);
  // A new client starts the month after the last one ended, if any ended.
  const nextStart = () => {
    const ends = streams.map((rows) => clientView(rows).until).filter((u): u is number => u !== null);
    return ends.length === streams.length ? Math.min(11, Math.max(floor, ...ends.map((u) => u + 1))) : floor;
  };
  return (
    <>
      {streams.map((rows, si) => (
        <ClientCard
          lang={lang}
          input={input}
          rows={rows}
          idx={si}
          count={streams.length}
          setRowsOf={(r) => setStreams((s) => s.map((x, j) => (j === si ? r : x)))}
          remove={() => setStreams((s) => s.filter((_, j) => j !== si))}
        />
      ))}
      <div class="linkrow">
        {streams.length < 6 ? (
          <button type="button" class="linkbtn" onClick={() => setStreams((s) => [...s, [emptyRow(nextStart())]])}>{t(lang, 'income.addClient')}</button>
        ) : null}
        <button type="button" class="linkbtn" onClick={() => set((i) => ({ ...i, clients: streamsToClients(i.income.streams), income: { ...i.income, mode: 'byMonth' } }))}>{t(lang, 'income.toMonths')}</button>
      </div>
    </>
  );
}

/* ---------- Income month by month ---------- */

function MonthGrid({ lang, input, set, idx }: P & { idx: number }) {
  const c = input.clients[idx];
  const upd = (patch: Partial<Client>) => set((i) => ({ ...i, clients: i.clients.map((x, k) => (k === idx ? { ...x, ...patch } : x)) }));
  const short = tList(lang, 'months.short');
  const past = c.months.map((_, k) => k).filter((k) => isActive(input, k) && isPast(input, k));
  const rest = c.months.map((_, k) => k).filter((k) => isActive(input, k) && !isPast(input, k));
  const pastAvg = past.length ? Math.round(past.reduce((s, k) => s + c.months[k].amount, 0) / past.length) : 0;
  const avg = c.months.reduce((s, m) => s + m.amount, 0) / 12;
  return (
    <div class="client">
      <div class="client-head">
        <span style="flex:1">
          <Select value={c.type} label={t(lang, 'income.clients')} options={typeOptions(lang)} onChange={(v) => upd({ type: v })} />
        </span>
        {input.clients.length > 1 ? (
          <button type="button" class="iconbtn" aria-label={t(lang, 'client.remove')} onClick={() => set((i) => ({ ...i, clients: i.clients.filter((_, k) => k !== idx) }))}>
            <Trash2 size={18} aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <div class="monthgrid">
        {c.months.map((m, k) => (
          <div class={`monthcell${isPast(input, k) ? ' past' : ''}${isActive(input, k) ? '' : ' off'}`}>
            <span class="mname">{short[k]}</span>
            <NumberInput compact lang={lang} min={0} label={short[k]} value={m.amount} onChange={(v) => upd({ months: c.months.map((x, j) => (j === k ? { amount: v ?? 0 } : x)) })} />
          </div>
        ))}
      </div>
      {pastAvg > 0 && rest.length ? (
        <button type="button" class="linkbtn" style="justify-self:start" onClick={() => upd({ months: c.months.map((x, k) => (rest.includes(k) ? { amount: pastAvg } : x)) })}>
          {t(lang, 'client.fillAvg', { amount: eur(lang, pastAvg) })}
        </button>
      ) : null}
      {c.type === 'es_company' && yearsIn(input) <= 2 ? <Check checked={c.newcomer7} onChange={(v) => upd({ newcomer7: v })}>{t(lang, 'client.newcomer7')}</Check> : null}
      <Chips lang={lang} input={input} type={c.type} newcomer7={c.newcomer7} amount={avg} />
    </div>
  );
}

function ByMonth({ lang, input, set }: P) {
  return (
    <>
      {input.clients.map((_, k) => <MonthGrid lang={lang} input={input} set={set} idx={k} />)}
      <div class="linkrow">
        {input.clients.length < 10 ? (
          <button type="button" class="linkbtn" onClick={() => set((i) => ({ ...i, clients: [...i.clients, defaultClient('non_eu_company', 0)] }))}>{t(lang, 'income.addClient')}</button>
        ) : null}
        <button type="button" class="linkbtn" onClick={() => set((i) => ({ ...i, income: { mode: 'periods', streams: clientsToStreams(i.clients, Math.min(11, startMonth(i))) } }))}>{t(lang, 'income.toPeriods')}</button>
      </div>
    </>
  );
}

export function IncomeCard(p: P & { reverse: boolean; setReverse: (v: boolean) => void; target: number | null; setTarget: (v: number | null) => void; solved: number | null; applySolved: () => void }) {
  const { lang, input, set } = p;
  return (
    <section class="card" aria-labelledby="h-income">
      <div>
        <h2 id="h-income">{t(lang, 'income.title')}</h2>
        <p class="note">{t(lang, 'income.amountHint')}</p>
      </div>
      {input.income.mode === 'periods' ? <Periods lang={lang} input={input} set={set} /> : <ByMonth lang={lang} input={input} set={set} />}
      <Check checked={!!input.salary} onChange={(v) => set((i) => ({ ...i, salary: v ? i.salary ?? { grossMonthly: 0, withheldMonthly: null, shortContract: false } : null }))}>{t(lang, 'salary.toggle')}</Check>
      {input.salary ? <SalaryFields lang={lang} input={input} set={set} /> : null}
      <Check checked={p.reverse} onChange={p.setReverse}>{t(lang, 'reverse.toggle')}</Check>
      {p.reverse ? (
        <div class="cols">
          <Field label={t(lang, 'reverse.target')}>
            <NumberInput lang={lang} min={0} value={p.target} unit="€" onChange={p.setTarget} />
          </Field>
          {p.solved !== null ? (
            <div class="field">
              <span class="lbl">{t(lang, 'reverse.result', { amount: eur(lang, p.solved) })}</span>
              <button type="button" class="btn" onClick={p.applySolved}>{t(lang, 'reverse.apply')}</button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function SalaryFields({ lang, input, set }: P) {
  const s = input.salary!;
  const p = getParams(input.year);
  const est = salaryWithholdingPct(s.grossMonthly * 12, input.kidsUnder6 + input.kids6to30, s.shortContract, p);
  const upd = (patch: Partial<NonNullable<CalcInput['salary']>>) => set((i) => ({ ...i, salary: { ...i.salary!, ...patch } }));
  return (
    <div class="client">
      <b>{t(lang, 'salary.title')}</b>
      <div class="cols">
        <Field label={t(lang, 'salary.gross')} hint={t(lang, 'salary.grossHint')}>
          <NumberInput lang={lang} min={0} value={s.grossMonthly || null} unit="€" onChange={(v) => upd({ grossMonthly: v ?? 0 })} />
        </Field>
        <Field label={t(lang, 'salary.withheld')} hint={t(lang, 'salary.withheldHint', { pct: est })}>
          <NumberInput lang={lang} min={0} value={s.withheldMonthly} unit="€" onChange={(v) => upd({ withheldMonthly: v })} />
        </Field>
      </div>
      <Check checked={s.shortContract} onChange={(v) => upd({ shortContract: v })}>{t(lang, 'salary.short')}</Check>
    </div>
  );
}

/* ---------- Registration and expenses ---------- */

export function StatusCard({ lang, input, set }: P & { r?: CalcResult }) {
  const long = tList(lang, 'months.long');
  const a = effectiveAlta(input);
  const monthFromIncome = !!input.alta && input.alta.year === input.year && input.income.mode === 'periods';
  const years = Array.from({ length: 13 }, (_, k) => 2015 + k);
  return (
    <section class="card" aria-labelledby="h-about">
      <h2 id="h-about">{t(lang, 'about.title')}</h2>
      <Field label={t(lang, 'about.status')}>
        <Select
          value={input.alta ? 'since' : 'notYet'}
          label={t(lang, 'about.status')}
          options={[{ value: 'notYet', label: t(lang, 'about.status.notYet') }, { value: 'since', label: t(lang, 'about.status.since') }]}
          onChange={(v) => set((i) => ({ ...i, alta: v === 'since' ? { year: 2026, month: 1 } : null, year: v === 'since' ? 2026 : i.year }))}
        />
      </Field>
      {input.alta ? (
        <div class="cols2">
          <Field label={t(lang, 'about.altaYear')}>
            <Select value={input.alta.year} label={t(lang, 'about.altaYear')} options={years.map((y) => ({ value: y, label: String(y) }))} onChange={(v) => set((i) => ({ ...i, alta: { ...i.alta!, year: v } }))} />
          </Field>
          {monthFromIncome ? null : (
            <Field label={t(lang, 'about.altaMonth')}>
              <Select value={input.alta.month} label={t(lang, 'about.altaMonth')} options={long.map((l, k) => ({ value: k + 1, label: l }))} onChange={(v) => set((i) => ({ ...i, alta: { ...i.alta!, month: v } }))} />
            </Field>
          )}
        </div>
      ) : (
        <p class="note">{t(lang, 'about.notYetNote', { month: `${long[a.month - 1]} ${a.year}` })}</p>
      )}
    </section>
  );
}

export function ExpensesCard({ lang, input, set }: P) {
  const upd = (idx: number, patch: Partial<Expense>) => set((i) => ({ ...i, expenses: i.expenses.map((x, k) => (k === idx ? { ...x, ...patch } : x)) }));
  return (
    <section class="card" aria-labelledby="h-exp">
      <h2 id="h-exp">{t(lang, 'exp.title')}</h2>
      <Seg
        name="expmode"
        wide
        label={t(lang, 'exp.title')}
        value={input.expenseMode}
        options={[
          { value: 'none', label: t(lang, 'exp.none') },
          { value: 'pct', label: t(lang, 'exp.pct', { pct: input.expensePct }) },
          { value: 'itemized', label: t(lang, 'exp.itemized') },
        ]}
        onChange={(v) => set((i) => ({ ...i, expenseMode: v, expenses: v === 'itemized' && !i.expenses.length ? [{ name: '', monthly: 70, ivaIncluded: true, foreign: false }] : i.expenses }))}
      />
      {input.expenseMode === 'none' ? <p class="note">{t(lang, 'exp.noneNote')}</p> : null}
      {input.expenseMode === 'pct' ? (
        <>
          <p class="note">{t(lang, 'exp.pctNote', { pct: input.expensePct })}</p>
          <Field label={t(lang, 'exp.pctLabel')}>
            <NumberInput lang={lang} min={0} max={90} value={input.expensePct} unit="%" onChange={(v) => set((i) => ({ ...i, expensePct: v ?? 0 }))} />
          </Field>
        </>
      ) : null}
      {input.expenseMode === 'itemized' ? (
        <>
          {input.expenses.map((e, k) => (
            <div class="client">
              <div class="client-head">
                <span class="control">
                  <input aria-label={t(lang, 'exp.name')} placeholder={t(lang, 'exp.namePh')} value={e.name} onInput={(ev) => upd(k, { name: (ev.target as HTMLInputElement).value })} />
                </span>
                <button type="button" class="iconbtn" aria-label={t(lang, 'exp.remove')} onClick={() => set((i) => ({ ...i, expenses: i.expenses.filter((_, j) => j !== k) }))}>
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </div>
              <Field label={t(lang, 'exp.monthly')}>
                <NumberInput lang={lang} min={0} value={e.monthly} unit="€" onChange={(v) => upd(k, { monthly: v ?? 0 })} />
              </Field>
              <Check checked={e.foreign} onChange={(v) => upd(k, { foreign: v, ivaIncluded: v ? false : e.ivaIncluded })}>{t(lang, 'exp.foreign')}</Check>
              {!e.foreign ? <Check checked={e.ivaIncluded} onChange={(v) => upd(k, { ivaIncluded: v })}>{t(lang, 'exp.iva')}</Check> : null}
            </div>
          ))}
          {input.expenses.length < 15 ? (
            <button type="button" class="addbtn" onClick={() => set((i) => ({ ...i, expenses: [...i.expenses, { name: '', monthly: 0, ivaIncluded: true, foreign: false }] }))}>
              <Plus size={16} aria-hidden="true" /> {t(lang, 'exp.add')}
            </button>
          ) : null}
          <p class="note">{t(lang, 'exp.hint')}</p>
        </>
      ) : null}
    </section>
  );
}

/* ---------- Optional sections, collapsed until needed ---------- */

function Section({ id, title, hint, open, children }: { id: string; title: string; hint: string; open: boolean; children: ComponentChildren }) {
  return (
    <details class="card sec" open={open} id={id}>
      <summary>
        <ChevronRight size={18} aria-hidden="true" />
        <span>
          <b>{title}</b>
          <span class="note">{hint}</span>
        </span>
      </summary>
      <div class="sec-body">{children}</div>
    </details>
  );
}

const yesNo = (lang: Lang) => [{ value: 'y' as const, label: t(lang, 'yes') }, { value: 'n' as const, label: t(lang, 'no') }];

export function MoreSections({ lang, input, set }: P & { r: CalcResult }) {
  const upd = (patch: Partial<CalcInput>) => set((i) => ({ ...i, ...patch }));
  const home = input.rentMonthly > 0 || input.purchaseAnnual > 0 || input.under36;
  const family = input.partner || input.kidsUnder6 + input.kids6to30 > 0 || input.largeFamily || input.ascendants > 0 || input.widow;
  const personal = input.disability > 0 || input.age65 !== 'no' || input.carer !== 'none' || input.womenReturnYears > 0 || input.menChildcare;
  const yi = yearsIn(input);
  const tpPossible = yi >= 0 && ymAdd(effectiveAlta(input), 23).year >= input.year; // 12 months, 24 with the extension
  const history = (tpPossible && !input.tpEligible) || input.startup.claim || input.priorD !== null || input.epsv > 0 || input.retaBase !== null;
  return (
    <div class="more-list">
      <h2 class="more-title">{t(lang, 'more.title')}</h2>

      <Section id="s-home" title={t(lang, 'sec.home')} hint={t(lang, 'sec.homeHint')} open={home}>
        <Field label={t(lang, 'about.rent')} hint={t(lang, 'about.rentHint')}>
          <NumberInput lang={lang} min={0} value={input.rentMonthly || null} placeholder="0" unit="€" onChange={(v) => upd({ rentMonthly: v ?? 0 })} />
        </Field>
        {input.rentMonthly > 0 ? <Check checked={input.leaseFrom2026} onChange={(v) => upd({ leaseFrom2026: v })}>{t(lang, 'about.leaseFrom2026')}</Check> : null}
        <Field label={t(lang, 'ded.buy')} hint={t(lang, 'ded.buyHint')}>
          <NumberInput lang={lang} min={0} value={input.purchaseAnnual || null} placeholder="0" unit="€" onChange={(v) => upd({ purchaseAnnual: v ?? 0 })} />
        </Field>
        {input.purchaseAnnual > 0 ? (
          <>
            <Check checked={input.purchaseThisYear} onChange={(v) => upd({ purchaseThisYear: v })}>{t(lang, 'ded.buyThisYear')}</Check>
            <Check checked={input.purchaseFrom2026} onChange={(v) => upd({ purchaseFrom2026: v })}>{t(lang, 'ded.buyFrom2026')}</Check>
          </>
        ) : null}
        <div class="field">
          <span class="lbl">{t(lang, 'about.under36')}</span>
          <Seg name="u36" label={t(lang, 'about.under36')} value={input.under36 ? 'y' : 'n'} options={yesNo(lang)} onChange={(v) => upd({ under36: v === 'y' })} />
        </div>
      </Section>

      <Section id="s-family" title={t(lang, 'sec.family')} hint={t(lang, 'sec.familyHint')} open={family}>
        <div class="field">
          <span class="lbl">{t(lang, 'about.family')}</span>
          <Seg name="partner" label={t(lang, 'about.family')} value={input.partner ? 'p' : 'a'} options={[{ value: 'a', label: t(lang, 'about.alone') }, { value: 'p', label: t(lang, 'about.partner') }]} onChange={(v) => upd({ partner: v === 'p' })} />
        </div>
        {input.partner ? (
          <Field label={t(lang, 'ded.partnerGross')} hint={t(lang, 'ded.partnerHint')}>
            <NumberInput lang={lang} min={0} value={input.partnerGross} unit="€" onChange={(v) => upd({ partnerGross: v })} />
          </Field>
        ) : null}
        <div class="cols">
          <Stepper label={t(lang, 'about.kidsUnder6')} fewer={t(lang, 'fewer')} more={t(lang, 'more')} value={input.kidsUnder6} onChange={(v) => upd({ kidsUnder6: v })} />
          <Stepper label={t(lang, 'about.kids6to30')} fewer={t(lang, 'fewer')} more={t(lang, 'more')} value={input.kids6to30} onChange={(v) => upd({ kids6to30: v })} />
        </div>
        <Check checked={input.largeFamily} onChange={(v) => upd({ largeFamily: v })}>{t(lang, 'about.largeFamily')}</Check>
        <Stepper label={t(lang, 'ded.asc')} fewer={t(lang, 'fewer')} more={t(lang, 'more')} value={input.ascendants} onChange={(v) => upd({ ascendants: v })} />
        <Check checked={input.widow} onChange={(v) => upd({ widow: v })}>{t(lang, 'ded.widow')}</Check>
      </Section>

      <Section id="s-personal" title={t(lang, 'sec.personal')} hint={t(lang, 'sec.personalHint')} open={personal}>
        <div class="cols">
          <Field label={t(lang, 'ded.dis')}>
            <Select value={input.disability} label={t(lang, 'ded.dis')} options={[0, 1, 2, 3, 4].map((v) => ({ value: v as CalcInput['disability'], label: t(lang, `ded.dis${v}`) }))} onChange={(v) => upd({ disability: v })} />
          </Field>
          <Field label={t(lang, 'ded.age')}>
            <Select value={input.age65} label={t(lang, 'ded.age')} options={(['no', '65', '75'] as const).map((v) => ({ value: v, label: t(lang, `ded.age.${v}`) }))} onChange={(v) => upd({ age65: v })} />
          </Field>
        </div>
        <Field label={t(lang, 'ded.carer')}>
          <Select value={input.carer} label={t(lang, 'ded.carer')} options={(['none', 'domestic', 'professional'] as const).map((v) => ({ value: v, label: t(lang, `ded.carer.${v}`) }))} onChange={(v) => upd({ carer: v })} />
        </Field>
        <Stepper label={t(lang, 'ded.women')} fewer={t(lang, 'fewer')} more={t(lang, 'more')} value={input.womenReturnYears} max={10} onChange={(v) => upd({ womenReturnYears: v })} />
        <Check checked={input.menChildcare} onChange={(v) => upd({ menChildcare: v })}>{t(lang, 'ded.men')}</Check>
      </Section>

      <Section id="s-history" title={t(lang, 'sec.history')} hint={t(lang, 'sec.historyHint')} open={history}>
        {tpPossible ? (
          <Check checked={input.tpEligible} onChange={(v) => upd({ tpEligible: v })}>
            {t(lang, 'about.tp')}
            <br />
            <span class="note">{t(lang, 'about.tpHint')}</span>
          </Check>
        ) : null}
        {yi <= 1 ? (
          <Check checked={input.startup.claim} onChange={(v) => upd({ startup: { ...input.startup, claim: v } })}>
            {t(lang, 'about.startup')}
            <br />
            <span class="note">{t(lang, 'about.startupHint')}</span>
          </Check>
        ) : null}
        {input.startup.claim && yi <= 1 ? (
          <Seg name="sex" label={t(lang, 'about.startup')} value={input.startup.sex} options={[{ value: 'w', label: t(lang, 'about.sex.w') }, { value: 'm', label: t(lang, 'about.sex.m') }]} onChange={(v) => upd({ startup: { ...input.startup, sex: v } })} />
        ) : null}
        <div class="cols">
          <Field label={t(lang, 'about.priorD')} hint={t(lang, 'about.priorDHint')}>
            <NumberInput lang={lang} value={input.priorD} unit="€" onChange={(v) => upd({ priorD: v })} />
          </Field>
          <Field label={t(lang, 'about.epsv')}>
            <NumberInput lang={lang} min={0} value={input.epsv} unit="€" onChange={(v) => upd({ epsv: v ?? 0 })} />
          </Field>
        </div>
        <Field label={t(lang, 'settings.retaBase')} hint={t(lang, 'settings.retaBaseHint')}>
          <NumberInput lang={lang} min={0} value={input.retaBase} unit="€" onChange={(v) => upd({ retaBase: v })} />
        </Field>
      </Section>

    </div>
  );
}
