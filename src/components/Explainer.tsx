import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { X } from 'lucide-preact';
import type { CalcResult } from '../engine/compute';
import type { CalcInput } from '../engine/types';
import { eur, pct, t, type Lang } from '../i18n/t';
import { explain, type LedgerKey, type Step, type Viz } from './explain';

const LEDGER: LedgerKey[] = ['income', 'profit', 'base', 'tax', 'keep'];
const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function CountUp({ lang, value }: { lang: Lang; value: number }) {
  const [shown, setShown] = useState(reduced() ? value : 0);
  useEffect(() => {
    if (reduced()) return setShown(value);
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 450);
      setShown(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{value < 0 ? '− ' : ''}{eur(lang, Math.abs(shown))}</>;
}

/** Widths animate from 0 once the step is on screen. */
function useGrow(): boolean {
  const [on, setOn] = useState(reduced());
  useEffect(() => {
    const id = requestAnimationFrame(() => setTimeout(() => setOn(true), 30));
    return () => cancelAnimationFrame(id);
  }, []);
  return on;
}

function VizView({ lang, v }: { lang: Lang; v: Viz }) {
  const on = useGrow();
  if (v.kind === 'brackets') {
    const shades = ['var(--b1)', 'var(--b2)', 'var(--b3)', 'var(--b4)', 'var(--b5)', 'var(--b6)'];
    return (
      <div class="ex-brackets">
        <div class="ex-bbar">{v.rows.map((r, k) => <i style={{ width: on ? `${r.share * 100}%` : '0%', background: shades[k] }} />)}</div>
        <table>
          <tbody>
            {v.rows.map((r, k) => (
              <tr>
                <td><span class="ex-sw" style={{ background: shades[k] }} />{r.label} · {pct(lang, r.rate, 0)}</td>
                <td class="r">{eur(lang, r.tax)}</td>
              </tr>
            ))}
            <tr class="sum"><td>{t(lang, 'ex.scale.total')}</td><td class="r">{eur(lang, v.total)}</td></tr>
          </tbody>
        </table>
      </div>
    );
  }
  if (v.kind === 'taxbar') {
    const cut = (a: number) => `${(a / v.total) * 100}%`;
    return (
      <div class="ex-tax">
        <div class="ex-taxbar">
          <i class="left" style={{ width: cut(v.left) }} />
          {[...v.cuts].reverse().map((c) => <i class={`cut${c.now ? ' now' : ''}`} style={{ width: cut(c.amount) }} />)}
        </div>
        <div class="ex-taxlegend"><b>{t(lang, 'ex.taxleft', { x: eur(lang, v.left) })}</b><span>{t(lang, 'ex.taxof', { x: eur(lang, v.total) })}</span></div>
      </div>
    );
  }
  if (v.kind === 'checks') {
    return (
      <ul class="ex-checks">
        {v.items.map((c) => <li><span class={`m${c.mark === '✗' ? ' bad' : ''}`}>{c.mark}</span>{c.text}</li>)}
      </ul>
    );
  }
  if (v.kind === 'pair') {
    return (
      <>
        <div class="ex-pair">
          <div><span>{v.a.label}</span><b>{v.a.value}</b></div>
          <div><span>{v.b.label}</span><b>{v.b.value}</b></div>
        </div>
        {v.note ? <p class="ex-note">{v.note}</p> : null}
      </>
    );
  }
  const at = (x: number) => `${Math.min(100, (x / v.max) * 100)}%`;
  return (
    <div class="ex-gauge">
      <div class="track">
        <div class="fill" style={{ width: on ? at(v.value) : '0%' }} />
        {v.marks.map((m) => <div class="mark" style={{ left: at(m.at) }} />)}
        <span class="you" style={{ left: on ? at(v.value) : '0%' }}>{v.you}</span>
      </div>
      <div class="legend"><span>0</span>{v.marks.map((m) => <span>{m.label}</span>)}</div>
    </div>
  );
}

function StepView({ lang, s, base }: { lang: Lang; s: Step; base: string }) {
  return (
    <>
      <h3 id="ex-title">{s.title}</h3>
      {s.amount !== null ? <p class={`ex-amount${s.amount < 0 ? ' minus' : ''}`}><CountUp lang={lang} value={s.amount} /></p> : null}
      <p class="ex-line">{s.line}</p>
      {s.viz?.map((v) => <VizView lang={lang} v={v} />)}
      {s.formula || s.src ? (
        <details class="ex-more">
          <summary>{t(lang, 'ex.how')}</summary>
          <div>
            {s.formula ? <div class="ex-formula" dangerouslySetInnerHTML={{ __html: s.formula }} /> : null}
            {s.src ? <a class="ex-src" href={`${base}/${lang}/how-we-calculate/#p-${s.src.key}`}>{s.src.label} · {t(lang, 'ex.source')}</a> : null}
          </div>
        </details>
      ) : null}
    </>
  );
}

export function Explainer({ lang, input, r, open, onClose }: { lang: Lang; input: CalcInput; r: CalcResult; open: boolean; onClose: () => void }) {
  const steps = useMemo(() => explain(lang, input, r), [lang, input, r]);
  const [i, setI] = useState(0);
  const dlg = useRef<HTMLDialogElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (open && !d.open) {
      setI(0);
      d.showModal();
    } else if (!open && d.open) d.close();
  }, [open]);
  useEffect(() => {
    if (i > steps.length - 1) setI(steps.length - 1);
    body.current?.scrollTo(0, 0);
  }, [i, steps.length]);

  const s = steps[Math.min(i, steps.length - 1)];
  if (!s) return null;
  const chapters = [0, 1, 2].map((ch) => steps.map((x, k) => ({ x, k })).filter(({ x }) => x.ch === ch));
  const last = i >= steps.length - 1;

  return (
    <dialog
      ref={dlg}
      class="ex"
      aria-labelledby="ex-title"
      onClose={onClose}
      onClick={(e) => { if (e.target === dlg.current) dlg.current?.close(); }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' && !last) setI(i + 1);
        if (e.key === 'ArrowLeft' && i > 0) setI(i - 1);
      }}
    >
      <div class="ex-sheet">
        <div class="ex-top">
          <div class="ex-head">
            <div class="ex-chapters">
              {chapters.map((list, ch) => (
                <div class={s.ch === ch ? 'on' : ''}>
                  <small>{t(lang, `ex.ch${ch + 1}`)}</small>
                  <span class="ticks">{list.map(({ k }) => <i class={k <= i ? 'done' : ''} />)}</span>
                </div>
              ))}
            </div>
            <button type="button" class="ex-close" aria-label={t(lang, 'ex.close')} onClick={() => dlg.current?.close()}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <div class="ex-ledger">
            {LEDGER.map((k) => {
              const v = s.ledger[k];
              return (
                <div class={`cell${v === undefined ? ' empty' : ''}${s.focus === k ? ' now' : ''}`}>
                  <span>{t(lang, `ex.l.${k}`)}</span>
                  <b>{v === undefined ? '—' : eur(lang, v)}</b>
                </div>
              );
            })}
          </div>
        </div>
        <div class="ex-body" ref={body} aria-live="polite" tabIndex={-1} autofocus>
          <p class="ex-kicker">{t(lang, 'ex.stepOf', { ch: t(lang, `ex.ch${s.ch + 1}`), n: i + 1, total: steps.length })}</p>
          <StepView key={i} lang={lang} s={s} base={base} />
        </div>
        <div class="ex-nav">
          <button type="button" class="btn" disabled={i === 0} onClick={() => setI(i - 1)}>{t(lang, 'ex.prev')}</button>
          <button type="button" class="btn ex-next" onClick={() => (last ? dlg.current?.close() : setI(i + 1))}>{last ? t(lang, 'ex.done') : t(lang, 'ex.next')}</button>
        </div>
      </div>
    </dialog>
  );
}
