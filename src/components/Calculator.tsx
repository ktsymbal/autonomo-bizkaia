import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { compute, solveIncomeFor } from '../engine/compute';
import { defaultInput } from '../engine/activity';
import type { CalcInput, Persona } from '../engine/types';
import { decode, encode } from '../state/url';
import { date, t, type Lang } from '../i18n/t';
import { rawParams } from '../params';
import { AboutCard, DeductionsCard, ExpensesCard, IncomeCard, SalaryCard, SettingsCard } from './Inputs';
import { Dock, Hero, Notices, Panel } from './Results';
import { Details } from './Details';
import { Explainer } from './Explainer';
import { Seg } from './ui';

const today = () => new Date().toISOString().slice(0, 10);

function applyPersona(i: CalcInput, p: Persona): CalcInput {
  const clients = i.clients.length ? i.clients : defaultInput(i.asOf).clients;
  const first = clients[0];
  const next: CalcInput = { ...i, persona: p };
  if (p === 'abroad') return { ...next, salary: null, clients: [{ ...first, type: first.type.startsWith('es_') ? 'non_eu_company' : first.type }, ...clients.slice(1)] };
  if (p === 'spain') return { ...next, salary: null, clients: [{ ...first, type: 'es_company' }, ...clients.slice(1)] };
  if (p === 'pluri') return { ...next, salary: i.salary ?? { grossMonthly: 0, withheldMonthly: null, shortContract: false } };
  return { ...next, salary: null, alta: null };
}

const looksDetailed = (i: CalcInput) => i.purchaseAnnual > 0 || i.disability > 0 || i.ascendants > 0 || i.age65 !== 'no' || i.widow || i.carer !== 'none' || i.womenReturnYears > 0 || i.menChildcare || i.partnerGross !== null || i.clients.length > 1 || i.expenseMode === 'itemized' || i.kidsUnder6 + i.kids6to30 > 0 || i.startup.claim || i.epsv > 0 || i.priorD !== null;

export default function Calculator({ lang }: { lang: Lang }) {
  const [input, setInput] = useState<CalcInput>(() => defaultInput(today()));
  const [detailed, setDetailed] = useState(false);
  const [reverse, setReverse] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const [target, setTarget] = useState<number | null>(null);
  const ready = useRef(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Restore from the URL fragment once on the client.
  useEffect(() => {
    const i = decode(location.hash, today());
    setInput(i);
    setDetailed(looksDetailed(i));
    ready.current = true;
  }, []);
  // Keep the fragment in sync (never sent to the server).
  useEffect(() => {
    if (ready.current) history.replaceState(null, '', encode(input));
  }, [input]);

  const r = useMemo(() => {
    try {
      return compute(input);
    } catch {
      return compute(defaultInput(input.asOf));
    }
  }, [input]);

  const avgIncome = useMemo(() => input.clients.reduce((s, c) => s + c.months.reduce((a, m) => a + m.amount * (input.fx[c.currency] ?? 1), 0), 0) / 12, [input]);
  // With no income entered yet, solve from a neutral €1,000/month on the first client.
  const solveBase = useMemo(
    () => (avgIncome > 0 ? input : { ...input, clients: (input.clients.length ? input.clients : defaultInput(input.asOf).clients).map((c, k) => (k === 0 ? { ...c, months: c.months.map((m) => ({ ...m, amount: 1000 / (input.fx[c.currency] ?? 1) })) } : c)) }),
    [input, avgIncome],
  );
  const baseIncome = avgIncome > 0 ? avgIncome : 1000;
  const factor = useMemo(() => (reverse && target && target > 0 ? solveIncomeFor(target, solveBase) : null), [reverse, target, solveBase]);
  const solved = factor !== null ? factor * baseIncome : null;

  const set = (fn: (i: CalcInput) => CalcInput) => setInput((i) => fn(i));
  const hasIncome = r.annual.income > 0 || r.annual.salaryGross > 0;
  const checked = rawParams(2026)['irpf.scale'].checked;

  return (
    <>
      <section class="pagehead">
        <h1>{t(lang, 'h1', { year: r.year })}</h1>
        <p>{t(lang, 'lede')}</p>
      </section>
      <div class="layout">
        <div class="inputs">
          <div class="field">
            <span class="lbl">{t(lang, 'persona.label')}</span>
            <Seg
              name="persona"
              class="persona"
              label={t(lang, 'persona.label')}
              value={input.persona}
              options={(['abroad', 'spain', 'pluri', 'plan'] as const).map((v) => ({ value: v, label: t(lang, `persona.${v}`) }))}
              onChange={(p) => set((i) => applyPersona(i, p))}
            />
          </div>
          <div class="toolbar">
            <Seg
              name="mode"
              label={t(lang, 'mode.simple')}
              value={detailed ? 'd' : 's'}
              options={[{ value: 's', label: t(lang, 'mode.simple') }, { value: 'd', label: t(lang, 'mode.detailed') }]}
              onChange={(v) => setDetailed(v === 'd')}
            />
            <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
              {input.alta ? (
                <Seg
                  name="year"
                  pill
                  label={t(lang, 'year.label')}
                  value={String(input.year) as '2026' | '2027'}
                  options={[{ value: '2026', label: '2026' }, { value: '2027', label: '2027' }]}
                  onChange={(v) => set((i) => ({ ...i, year: Number(v) as 2026 | 2027 }))}
                />
              ) : null}
              {hasIncome ? <button
                type="button"
                class="linkbtn"
                onClick={() => {
                  setInput(defaultInput(today()));
                  setDetailed(false);
                  setReverse(false);
                }}
              >
                {t(lang, 'reset')}
              </button> : null}
            </div>
          </div>
          <IncomeCard
            lang={lang}
            input={input}
            set={set}
            detailed={detailed}
            reverse={reverse}
            setReverse={setReverse}
            target={target}
            setTarget={setTarget}
            solved={solved}
            applySolved={() => factor !== null && setInput({ ...solveBase, clients: solveBase.clients.map((c) => ({ ...c, months: c.months.map((m) => ({ ...m, amount: Math.round(m.amount * factor) })) })) })}
          />
          {input.salary ? <SalaryCard lang={lang} input={input} set={set} detailed={detailed} /> : null}
          <div class="cols">
            <AboutCard lang={lang} input={input} set={set} detailed={detailed} />
            <ExpensesCard lang={lang} input={input} set={set} detailed={detailed} />
          </div>
          {detailed ? <DeductionsCard lang={lang} input={input} set={set} detailed={detailed} /> : null}
          {detailed ? <SettingsCard lang={lang} input={input} set={set} detailed={detailed} /> : null}
        </div>
        <aside class="results" aria-label={t(lang, 'res.headline', { year: r.year })}>
          {hasIncome ? (
            <>
              <div class="results-pin">
                <Hero lang={lang} r={r} heroRef={heroRef} onExplain={() => setExplaining(true)} />
                <Panel lang={lang} r={r} />
              </div>
              <Notices lang={lang} r={r} />
            </>
          ) : (
            <div class="hero empty" ref={heroRef}>
              <p class="k">{t(lang, 'res.emptyTitle')}</p>
              <p class="emptytext">{t(lang, 'res.empty')}</p>
            </div>
          )}
          <p class="fine">
            {t(lang, 'checked', { year: r.year, date: date(lang, checked) })} ·{' '}
            <a href={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/${lang}/how-we-calculate/`}>{t(lang, 'nav.how')}</a>
          </p>
        </aside>
      </div>
      {hasIncome ? (
        <>
          <Details lang={lang} r={r} />
          <Explainer lang={lang} input={input} r={r} open={explaining} onClose={() => setExplaining(false)} />
          <Dock lang={lang} r={r} target={heroRef} />
        </>
      ) : null}
    </>
  );
}
