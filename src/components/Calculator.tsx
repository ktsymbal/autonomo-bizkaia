import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { compute, solveIncomeFor } from '../engine/compute';
import { defaultInput } from '../engine/activity';
import type { CalcInput } from '../engine/types';
import { applyPeriods, scaleStreams } from '../engine/periods';
import { decode, encode } from '../state/url';
import { date, t, type Lang } from '../i18n/t';
import { rawParams } from '../params';
import { ExpensesCard, IncomeCard, MoreSections, StatusCard } from './Inputs';
import { Dock, Hero, Notices, Panel } from './Results';
import { Details } from './Details';
import { Explainer } from './Explainer';
import { Seg } from './ui';

const today = () => new Date().toISOString().slice(0, 10);

const derive = applyPeriods;

export default function Calculator({ lang }: { lang: Lang }) {
  const [input, setInput] = useState<CalcInput>(() => defaultInput(today()));
  const [reverse, setReverse] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const [target, setTarget] = useState<number | null>(null);
  const ready = useRef(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Restore from the URL fragment once on the client.
  useEffect(() => {
    const i = decode(location.hash, today());
    setInput(i);
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

  const avgIncome = useMemo(() => input.clients.reduce((s, c) => s + c.months.reduce((a, m) => a + m.amount, 0), 0) / 12, [input]);
  // With no income entered yet, solve from a neutral €1,000/month on the first client.
  const solveBase = useMemo(
    () => (avgIncome > 0 ? input : { ...input, clients: (input.clients.length ? input.clients : defaultInput(input.asOf).clients).map((c, k) => (k === 0 ? { ...c, months: c.months.map((m) => ({ ...m, amount: 1000 })) } : c)) }),
    [input, avgIncome],
  );
  const baseIncome = avgIncome > 0 ? avgIncome : 1000;
  const factor = useMemo(() => (reverse && target && target > 0 ? solveIncomeFor(target, solveBase) : null), [reverse, target, solveBase]);
  const solved = factor !== null ? factor * baseIncome : null;

  const set = (fn: (i: CalcInput) => CalcInput) => setInput((i) => derive(fn(i)));
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
          <div class="toolbar">
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
            reverse={reverse}
            setReverse={setReverse}
            target={target}
            setTarget={setTarget}
            solved={solved}
            applySolved={() => {
              if (factor === null) return;
              if (input.income.mode === 'periods' && avgIncome > 0) setInput(derive({ ...input, income: { ...input.income, streams: scaleStreams(input.income.streams, factor) } }));
              else if (input.income.mode === 'periods') setInput(derive({ ...input, income: { ...input.income, streams: input.income.streams.map((rows, k) => (k === 0 ? rows.map((r) => ({ ...r, amount: Math.round(1000 * factor) })) : rows)) } }));
              else setInput({ ...solveBase, clients: solveBase.clients.map((c) => ({ ...c, months: c.months.map((m) => ({ amount: Math.round(m.amount * factor) })) })) });
            }}
          />
          <div class="cols">
            <StatusCard lang={lang} input={input} set={set} r={r} />
            <ExpensesCard lang={lang} input={input} set={set} />
          </div>
        </div>
        <aside class="results" aria-label={t(lang, 'res.headline', { year: r.year })}>
          {hasIncome ? (
            <>
              <div class="results-pin">
                <Hero lang={lang} r={r} heroRef={heroRef} onExplain={() => setExplaining(true)} />
                <Panel lang={lang} r={r} />
              </div>
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
        <div class="inputs more">
          {hasIncome ? <Notices lang={lang} r={r} /> : null}
          <MoreSections lang={lang} input={input} set={set} r={r} />
        </div>
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
