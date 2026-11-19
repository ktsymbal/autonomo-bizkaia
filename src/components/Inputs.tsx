import { ChevronRight, Plus, Trash2 } from 'lucide-preact';
import { defaultClient, effectiveAlta } from '../engine/activity';
import type { CalcInput, Client, ClientType, Expense } from '../engine/types';
import { date, eur, pct as fpct, t, tList, type Lang } from '../i18n/t';
import { salaryWithholdingPct } from '../engine/employment';
import { getParams } from '../params';
import { Check, Field, NumberInput, Seg, Select, Stepper } from './ui';

export type Setter = (fn: (i: CalcInput) => CalcInput) => void;
type P = { lang: Lang; input: CalcInput; set: Setter; detailed: boolean };

const CLIENT_TYPES: ClientType[] = ['non_eu_company', 'eu_company', 'es_company', 'es_private'];

const monthsOf = (amount: number, prev?: Client['months']) => Array.from({ length: 12 }, (_, m) => ({ amount, actual: prev?.[m]?.actual ?? false }));

function entryAmount(c: Client): number {
  const e = c.entry;
  if (e?.mode === 'hourly') return (e.rate ?? 0) * (e.hours ?? 0) * (e.days ?? 0);
  return c.months[0]?.amount ?? 0;
}

function ClientChips({ lang, c, input }: { lang: Lang; c: Client; input: CalcInput }) {
  const avg = c.months.reduce((s, m) => s + m.amount, 0) / 12;
  const yi = input.year - effectiveAlta(input).year;
  const rate = c.newcomer7 && yi <= 2 ? 0.07 : 0.15;
  const chips: string[] = [];
  if (c.type === 'eu_company') chips.push(t(lang, 'chip.noIvaEu'), t(lang, 'chip.noRet'));
  if (c.type === 'non_eu_company') chips.push(t(lang, 'chip.noIvaNonEu'), t(lang, 'chip.noRet'));
  if (c.type === 'es_private') chips.push(t(lang, 'chip.iva', { amount: eur(lang, avg * 0.21) }), t(lang, 'chip.noRet'));
  if (c.type === 'es_company') chips.push(t(lang, 'chip.iva', { amount: eur(lang, avg * 0.21) }), t(lang, 'chip.ret', { rate: fpct(lang, rate, 0), amount: eur(lang, avg * rate) }));
  return <div class="chips">{chips.map((x) => <span class="chip">{x}</span>)}</div>;
}

function ClientEditor({ lang, input, set, idx }: { lang: Lang; input: CalcInput; set: Setter; idx: number }) {
  const c = input.clients[idx];
  const mode = c.entry?.mode ?? 'monthly';
  const upd = (patch: Partial<Client>) => set((i) => ({ ...i, clients: i.clients.map((x, k) => (k === idx ? { ...x, ...patch } : x)) }));
  const short = tList(lang, 'months.short');
  const actuals = c.months.filter((m) => m.actual);
  return (
    <div class="client">
      <div class="client-head">
        <span class="control">
          <input aria-label={t(lang, 'client.name')} placeholder={t(lang, 'client.namePh', { n: idx + 1 })} value={c.name} onInput={(e) => upd({ name: (e.target as HTMLInputElement).value })} />
        </span>
        {input.clients.length > 1 ? (
          <button type="button" class="iconbtn" aria-label={t(lang, 'client.remove')} onClick={() => set((i) => ({ ...i, clients: i.clients.filter((_, k) => k !== idx) }))}>
            <Trash2 size={18} aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <div class="cols">
        <Field label={t(lang, 'income.clients')}>
          <Select value={c.type} label={t(lang, 'income.clients')} options={CLIENT_TYPES.map((v) => ({ value: v, label: t(lang, `client.${v}`) }))} onChange={(v) => upd({ type: v })} />
        </Field>
      </div>
      <Seg
        name={`entry-${idx}`}
        wide
        label={t(lang, 'client.entry')}
        value={mode}
        options={(['monthly', 'hourly', 'byMonth'] as const).map((v) => ({ value: v, label: t(lang, `client.entry.${v}`) }))}
        onChange={(v) => upd({ entry: { ...c.entry, mode: v } })}
      />
      {mode === 'monthly' ? (
        <Field label={t(lang, 'income.amount')} hint={t(lang, 'income.amountHint')}>
          <NumberInput lang={lang} value={c.months[0]?.amount || null} min={0} unit="€" onChange={(v) => upd({ months: monthsOf(v ?? 0, c.months) })} />
        </Field>
      ) : null}
      {mode === 'hourly' ? (
        <div class="cols3">
          {(['rate', 'hours', 'days'] as const).map((k) => (
            <Field label={t(lang, `client.${k}`)}>
              <NumberInput
                lang={lang}
                min={0}
                value={c.entry?.[k] ?? null}
                unit={k === 'rate' ? '€' : undefined}
                onChange={(v) => {
                  const entry = { ...c.entry, mode: 'hourly' as const, [k]: v ?? 0 };
                  upd({ entry, months: monthsOf(entryAmount({ ...c, entry }), c.months) });
                }}
              />
            </Field>
          ))}
        </div>
      ) : null}
      {mode === 'byMonth' ? (
        <>
          <div class="monthgrid">
            {c.months.map((m, k) => (
              <div class={`monthcell${m.actual ? ' actual' : ''}`}>
                <span class="mname">
                  {short[k]}
                  <label class="tag" title={t(lang, m.actual ? 'client.actual' : 'client.forecast')}>
                    <input
                      type="checkbox"
                      style="width:14px;height:14px;vertical-align:-2px"
                      checked={m.actual}
                      aria-label={`${short[k]}: ${t(lang, 'client.actual')}`}
                      onChange={(e) => upd({ months: c.months.map((x, j) => (j === k ? { ...x, actual: (e.target as HTMLInputElement).checked } : x)) })}
                    />{' '}
                    {t(lang, m.actual ? 'client.actual' : 'client.forecast')}
                  </label>
                </span>
                <NumberInput compact lang={lang} min={0} label={short[k]} value={m.amount} onChange={(v) => upd({ months: c.months.map((x, j) => (j === k ? { ...x, amount: v ?? 0 } : x)) })} />
              </div>
            ))}
          </div>
          {actuals.length ? (
            <button
              type="button"
              class="linkbtn"
              style="justify-self:start"
              onClick={() => {
                const avg = actuals.reduce((s, m) => s + m.amount, 0) / actuals.length;
                upd({ months: c.months.map((m) => (m.actual ? m : { ...m, amount: Math.round(avg) })) });
              }}
            >
              {t(lang, 'client.fillAvg')}
            </button>
          ) : null}
        </>
      ) : null}
      {c.type === 'es_company' ? (
        <Check checked={c.newcomer7} onChange={(v) => upd({ newcomer7: v })}>{t(lang, 'client.newcomer7')}</Check>
      ) : null}
      <ClientChips lang={lang} c={c} input={input} />
    </div>
  );
}

export function IncomeCard(p: P & { reverse: boolean; setReverse: (v: boolean) => void; target: number | null; setTarget: (v: number | null) => void; solved: number | null; applySolved: () => void }) {
  const { lang, input, set } = p;
  const c0 = input.clients[0];
  return (
    <section class="card" aria-labelledby="h-income">
      <h2 id="h-income">{t(lang, 'income.title')}</h2>
      {!p.detailed ? (
        <>
          <div class="cols">
            <Field label={t(lang, 'income.amount')} hint={t(lang, 'income.amountHint')}>
              <NumberInput
                lang={lang}
                min={0}
                unit="€"
                value={c0 && entryAmount(c0) ? entryAmount(c0) : null}
                onChange={(v) => set((i) => ({ ...i, clients: [{ ...(i.clients[0] ?? defaultClient()), entry: { mode: 'monthly' }, months: monthsOf(v ?? 0, i.clients[0]?.months) }, ...i.clients.slice(1)] }))}
              />
            </Field>
            <Field label={t(lang, 'income.clients')}>
              <Select
                value={c0?.type ?? 'non_eu_company'}
                label={t(lang, 'income.clients')}
                options={CLIENT_TYPES.map((v) => ({ value: v, label: t(lang, `client.${v}`) }))}
                onChange={(v) => set((i) => ({ ...i, clients: i.clients.map((x, k) => (k === 0 ? { ...x, type: v } : x)) }))}
              />
            </Field>
          </div>
          {c0 ? <ClientChips lang={lang} c={c0} input={input} /> : null}
          {input.clients.length > 1 ? <p class="note">+ {input.clients.length - 1} · {t(lang, 'mode.detailed')}</p> : null}
        </>
      ) : (
        <>
          {input.clients.map((_, k) => <ClientEditor lang={lang} input={input} set={set} idx={k} />)}
          {input.clients.length < 10 ? (
            <button type="button" class="addbtn" onClick={() => set((i) => ({ ...i, clients: [...i.clients, defaultClient('non_eu_company', 0)] }))}>
              <Plus size={16} aria-hidden="true" /> {t(lang, 'client.add')}
            </button>
          ) : null}
        </>
      )}
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

export function AboutCard({ lang, input, set, detailed }: P) {
  const long = tList(lang, 'months.long');
  const a = effectiveAlta(input);
  const years = Array.from({ length: 13 }, (_, k) => 2015 + k);
  return (
    <section class="card" aria-labelledby="h-about">
      <h2 id="h-about">{t(lang, 'about.title')}</h2>
      <div style="display:grid;gap:14px">
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
            <Field label={t(lang, 'about.altaMonth')}>
              <Select value={input.alta.month} label={t(lang, 'about.altaMonth')} options={long.map((l, k) => ({ value: k + 1, label: l }))} onChange={(v) => set((i) => ({ ...i, alta: { ...i.alta!, month: v } }))} />
            </Field>
            <Field label={t(lang, 'about.altaYear')}>
              <Select value={input.alta.year} label={t(lang, 'about.altaYear')} options={years.map((y) => ({ value: y, label: String(y) }))} onChange={(v) => set((i) => ({ ...i, alta: { ...i.alta!, year: v } }))} />
            </Field>
          </div>
        ) : (
          <p class="note">{t(lang, 'about.notYetNote', { month: `${long[a.month - 1]} ${a.year}` })}</p>
        )}
      </div>
      <Field label={t(lang, 'about.rent')} hint={t(lang, 'about.rentHint')}>
        <NumberInput lang={lang} min={0} value={input.rentMonthly || null} placeholder="0" unit="€" onChange={(v) => set((i) => ({ ...i, rentMonthly: v ?? 0 }))} />
      </Field>
      <div style="display:grid;gap:16px">
        <div class="field">
          <span class="lbl">{t(lang, 'about.under36')}</span>
          <Seg name="u36" label={t(lang, 'about.under36')} value={input.under36 ? 'y' : 'n'} options={[{ value: 'y', label: t(lang, 'yes') }, { value: 'n', label: t(lang, 'no') }]} onChange={(v) => set((i) => ({ ...i, under36: v === 'y' }))} />
        </div>
        <div class="field">
          <span class="lbl">{t(lang, 'about.family')}</span>
          <Seg name="partner" label={t(lang, 'about.family')} value={input.partner ? 'p' : 'a'} options={[{ value: 'a', label: t(lang, 'about.alone') }, { value: 'p', label: t(lang, 'about.partner') }]} onChange={(v) => set((i) => ({ ...i, partner: v === 'p' }))} />
        </div>
      </div>
      {detailed ? (
        <>
          <div class="cols">
            <Stepper label={t(lang, 'about.kidsUnder6')} fewer={t(lang, 'fewer')} more={t(lang, 'more')} value={input.kidsUnder6} onChange={(v) => set((i) => ({ ...i, kidsUnder6: v }))} />
            <Stepper label={t(lang, 'about.kids6to30')} fewer={t(lang, 'fewer')} more={t(lang, 'more')} value={input.kids6to30} onChange={(v) => set((i) => ({ ...i, kids6to30: v }))} />
          </div>
          <Check checked={input.largeFamily} onChange={(v) => set((i) => ({ ...i, largeFamily: v }))}>{t(lang, 'about.largeFamily')}</Check>
          {input.rentMonthly > 0 ? <Check checked={input.leaseFrom2026} onChange={(v) => set((i) => ({ ...i, leaseFrom2026: v }))}>{t(lang, 'about.leaseFrom2026')}</Check> : null}
          <Check checked={input.tpEligible} onChange={(v) => set((i) => ({ ...i, tpEligible: v }))}>
            {t(lang, 'about.tp')}
            <br />
            <span class="note">{t(lang, 'about.tpHint')}</span>
          </Check>
          <Check checked={input.startup.claim} onChange={(v) => set((i) => ({ ...i, startup: { ...i.startup, claim: v } }))}>
            {t(lang, 'about.startup')}
            <br />
            <span class="note">{t(lang, 'about.startupHint')}</span>
          </Check>
          {input.startup.claim ? (
            <Seg name="sex" label={t(lang, 'about.startup')} value={input.startup.sex} options={[{ value: 'w', label: t(lang, 'about.sex.w') }, { value: 'm', label: t(lang, 'about.sex.m') }]} onChange={(v) => set((i) => ({ ...i, startup: { ...i.startup, sex: v } }))} />
          ) : null}
          <div class="cols">
            <Field label={t(lang, 'about.priorD')} hint={t(lang, 'about.priorDHint')}>
              <NumberInput lang={lang} value={input.priorD} unit="€" onChange={(v) => set((i) => ({ ...i, priorD: v }))} />
            </Field>
            <Field label={t(lang, 'about.epsv')}>
              <NumberInput lang={lang} min={0} value={input.epsv} unit="€" onChange={(v) => set((i) => ({ ...i, epsv: v ?? 0 }))} />
            </Field>
          </div>
        </>
      ) : null}
    </section>
  );
}

export function SalaryCard({ lang, input, set }: P) {
  if (!input.salary) return null;
  const s = input.salary;
  const p = getParams(input.year);
  const est = salaryWithholdingPct(s.grossMonthly * 12, input.kidsUnder6 + input.kids6to30, s.shortContract, p);
  const upd = (patch: Partial<NonNullable<CalcInput['salary']>>) => set((i) => ({ ...i, salary: { ...i.salary!, ...patch } }));
  return (
    <section class="card" aria-labelledby="h-sal">
      <h2 id="h-sal">{t(lang, 'salary.title')}</h2>
      <div class="cols">
        <Field label={t(lang, 'salary.gross')} hint={t(lang, 'salary.grossHint')}>
          <NumberInput lang={lang} min={0} value={s.grossMonthly || null} unit="€" onChange={(v) => upd({ grossMonthly: v ?? 0 })} />
        </Field>
        <Field label={t(lang, 'salary.withheld')} hint={t(lang, 'salary.withheldHint', { pct: est })}>
          <NumberInput lang={lang} min={0} value={s.withheldMonthly} unit="€" onChange={(v) => upd({ withheldMonthly: v })} />
        </Field>
      </div>
      <Check checked={s.shortContract} onChange={(v) => upd({ shortContract: v })}>{t(lang, 'salary.short')}</Check>
    </section>
  );
}

export function SettingsCard({ lang, input, set }: P) {
  const st = input.settings;
  const upd = (patch: Partial<CalcInput['settings']>) => set((i) => ({ ...i, settings: { ...i.settings, ...patch } }));
  return (
    <section class="card">
      <details class="more">
        <summary>
          <ChevronRight size={18} aria-hidden="true" />
          {t(lang, 'settings.title')}
        </summary>
        <div>
          <p class="note">{t(lang, 'settings.lede')}</p>
          <Field label={t(lang, 'settings.r2')}>
            <Select value={st.r2} label={t(lang, 'settings.r2')} options={[{ value: 'A', label: t(lang, 'settings.r2.A') }, { value: 'B', label: t(lang, 'settings.r2.B') }]} onChange={(v) => upd({ r2: v })} />
          </Field>
          <Field label={t(lang, 'settings.s1')}>
            <Select value={st.s1} label={t(lang, 'settings.s1')} options={(['off', 'tier', '15'] as const).map((v) => ({ value: v, label: t(lang, `settings.s1.${v}`) }))} onChange={(v) => upd({ s1: v })} />
          </Field>
          <Check checked={st.s2} onChange={(v) => upd({ s2: v })}>{t(lang, 'settings.s2')}</Check>
          <Field label={t(lang, 'settings.retaBase')} hint={t(lang, 'settings.retaBaseHint')}>
            <NumberInput lang={lang} min={0} value={input.retaBase} unit="€" onChange={(v) => set((i) => ({ ...i, retaBase: v }))} />
          </Field>
        </div>
      </details>
    </section>
  );
}

export function DeductionsCard({ lang, input, set }: P) {
  const upd = (patch: Partial<CalcInput>) => set((i) => ({ ...i, ...patch }));
  return (
    <section class="card" aria-labelledby="h-ded">
      <h2 id="h-ded">{t(lang, 'ded.title')}</h2>
      <p class="note">{t(lang, 'ded.lede')}</p>
      <Field label={t(lang, 'ded.buy')} hint={t(lang, 'ded.buyHint')}>
        <NumberInput lang={lang} min={0} value={input.purchaseAnnual || null} placeholder="0" unit="€" onChange={(v) => upd({ purchaseAnnual: v ?? 0 })} />
      </Field>
      {input.purchaseAnnual > 0 ? (
        <>
          <Check checked={input.purchaseThisYear} onChange={(v) => upd({ purchaseThisYear: v })}>{t(lang, 'ded.buyThisYear')}</Check>
          <Check checked={input.purchaseFrom2026} onChange={(v) => upd({ purchaseFrom2026: v })}>{t(lang, 'ded.buyFrom2026')}</Check>
        </>
      ) : null}
      <div class="cols">
        <Field label={t(lang, 'ded.dis')}>
          <Select value={input.disability} label={t(lang, 'ded.dis')} options={[0, 1, 2, 3, 4].map((v) => ({ value: v as CalcInput['disability'], label: t(lang, `ded.dis${v}`) }))} onChange={(v) => upd({ disability: v })} />
        </Field>
        <Field label={t(lang, 'ded.age')}>
          <Select value={input.age65} label={t(lang, 'ded.age')} options={(['no', '65', '75'] as const).map((v) => ({ value: v, label: t(lang, `ded.age.${v}`) }))} onChange={(v) => upd({ age65: v })} />
        </Field>
      </div>
      <Stepper label={t(lang, 'ded.asc')} fewer={t(lang, 'fewer')} more={t(lang, 'more')} value={input.ascendants} onChange={(v) => upd({ ascendants: v })} />
      <Field label={t(lang, 'ded.carer')}>
        <Select value={input.carer} label={t(lang, 'ded.carer')} options={(['none', 'domestic', 'professional'] as const).map((v) => ({ value: v, label: t(lang, `ded.carer.${v}`) }))} onChange={(v) => upd({ carer: v })} />
      </Field>
      <Check checked={input.widow} onChange={(v) => upd({ widow: v })}>{t(lang, 'ded.widow')}</Check>
      <Stepper label={t(lang, 'ded.women')} fewer={t(lang, 'fewer')} more={t(lang, 'more')} value={input.womenReturnYears} max={10} onChange={(v) => upd({ womenReturnYears: v })} />
      <Check checked={input.menChildcare} onChange={(v) => upd({ menChildcare: v })}>{t(lang, 'ded.men')}</Check>
      {input.partner ? (
        <Field label={t(lang, 'ded.partnerGross')} hint={t(lang, 'ded.partnerHint')}>
          <NumberInput lang={lang} min={0} value={input.partnerGross} unit="€" onChange={(v) => upd({ partnerGross: v })} />
        </Field>
      ) : null}
    </section>
  );
}
