import { AlertTriangle, CheckCircle2, Info, Link2, Check as CheckIcon } from 'lucide-preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import type { CalcResult } from '../engine/compute';
import type { Warning } from '../engine/warnings';
import { date, eur, pct, t, tList, type Lang } from '../i18n/t';

type R = { lang: Lang; r: CalcResult };

export function regimeLabel(lang: Lang, r: CalcResult): string {
  const k = r.annual.retaRegime;
  if (k === 'tramo') return t(lang, 'res.regime.tramo', { n: (r.reta.tramo?.index ?? 0) + 1 });
  return t(lang, `res.regime.${k}`);
}

const TONE: Record<string, 'info' | 'warn' | 'good'> = {
  W1: 'info', W2: 'warn', W3: 'info', W4: 'good', W5: 'warn', W6: 'warn', W7: 'info', W8: 'good',
  W12: 'info', W13: 'warn', W14: 'info', W15: 'good', W16: 'info', W17: 'info', W18: 'info',
};

const FORM_KEY: Record<string, string> = { '130': 'form.130', '303': 'form.303', '390': 'form.390', renta: 'form.renta' };

export function warningText(lang: Lang, w: Warning, r: CalcResult): string {
  const p = w.params;
  const n = (k: string) => Number(p[k]);
  switch (w.id) {
    case 'W1': return t(lang, 'w.W1', { gap: eur(lang, n('gap')), edge: eur(lang, n('edge')), next: n('edge') === 35000 ? '15 %' : '10 %' });
    case 'W2': return t(lang, 'w.W2', { cap: eur(lang, n('cap')) });
    case 'W3': return t(lang, 'w.W3', { quarter: eur(lang, n('quarter')), base: p.base });
    case 'W4': case 'W5': case 'W6': case 'W15': return t(lang, `w.${w.id}`, { amount: eur(lang, n('amount')), year: p.year });
    case 'W7': {
      const [y, m] = String(p.end).split('-').map(Number);
      return t(lang, 'w.W7', { end: `${tList(lang, 'months.long')[m - 1]} ${y}` });
    }
    case 'W13': return t(lang, 'w.W13', { form: t(lang, FORM_KEY[String(p.form)] ?? 'form.130'), due: date(lang, String(p.due), r.year), amount: eur(lang, n('amount')) });
    case 'W14': return t(lang, 'w.W14', { cap: eur(lang, n('cap')) });
    case 'W16': {
      const labels = String(p.keys).split(',').map((k) => (r.year >= 2027 && !['irpf.firstYearTier', 'reta.tarifaPlana', 'p130.simplificadaInside', 'reta.ssIncomeReading', 'smi', 'irpf.womenReturn', 'irpf.menChildcare'].includes(k) ? 'pk.2027' : `pk.${k}`));
      const uniq = [...new Set(labels)].map((k) => t(lang, k)).filter((x) => !x.startsWith('pk.'));
      return t(lang, 'w.W16', { keys: uniq.join(', ') });
    }
    case 'W18': return t(lang, 'w.W18', { months: n('months') });
    default: return t(lang, `w.${w.id}`);
  }
}

function Icon({ tone }: { tone: 'info' | 'warn' | 'good' }) {
  if (tone === 'warn') return <AlertTriangle size={16} aria-hidden="true" />;
  if (tone === 'good') return <CheckCircle2 size={16} aria-hidden="true" />;
  return <Info size={16} aria-hidden="true" />;
}

export function Notices({ lang, r }: R) {
  const order = ['W13', 'W5', 'W6', 'W2', 'W4', 'W15', 'W8', 'W7', 'W3', 'W12', 'W14', 'W1', 'W18', 'W17', 'W16'];
  const ws = [...r.warnings].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  if (!ws.length) return null;
  return (
    <div class="notes" aria-live="polite">
      {ws.map((w) => {
        const tone = TONE[w.id] ?? 'info';
        return (
          <p class={`notice ${tone}`}>
            <Icon tone={tone} />
            <span>
              {warningText(lang, w, r)}
              {w.id === 'W5' && w.params.pluri ? <> {t(lang, 'w.W5pluri')}</> : null}
            </span>
          </p>
        );
      })}
    </div>
  );
}

export function Hero({ lang, r, heroRef, onExplain }: R & { heroRef?: preact.Ref<HTMLDivElement>; onExplain?: () => void }) {
  const d = r.denominator;
  const a = r.annual;
  const total = a.income + a.salaryGross;
  const parts = [
    { key: 'kept', v: Math.max(0, r.keptMonthly * d), color: 'var(--split-kept)', label: t(lang, 'res.kept') },
    { key: 'irpf', v: a.irpf.cl, color: 'var(--split-irpf)', label: t(lang, 'res.irpf') },
    { key: 'reta', v: a.reta + a.salarySS, color: 'var(--split-reta)', label: t(lang, 'res.reta') },
    { key: 'exp', v: a.expenses, color: 'var(--split-exp)', label: t(lang, 'res.expenses') },
  ];
  const sum = parts.reduce((s, x) => s + x.v, 0) || 1;
  const negative = r.keptMonthly < 0;
  return (
    <div class="hero" ref={heroRef}>
      <p class="k">{negative ? t(lang, 'res.negative', { year: r.year }) : t(lang, 'res.headline', { year: r.year })}</p>
      <p class="big">
        <span class="num" key={Math.round(r.keptMonthly)}>{eur(lang, r.keptMonthly)}</span> <small>{t(lang, 'res.perMonth')}</small>
      </p>
      <p class="sub">
        {r.activeMonths < 12 && !a.salaryGross ? t(lang, 'res.partial', { n: r.activeMonths }) : t(lang, 'res.averageNote')}
        {r.forecastMonths && r.forecastMonths < 12 ? ` ${t(lang, 'res.forecast', { n: r.forecastMonths })}.` : ''}
      </p>
      {total > 0 ? (
        <>
          <div class="split" role="img" aria-label={parts.map((x) => `${x.label} ${pct(lang, x.v / sum, 0)}`).join(', ')}>
            {parts.map((x) => <i style={{ width: `${(x.v / sum) * 100}%`, background: x.color }} />)}
          </div>
          <div class="legend">
            {parts.slice(1).map((x) =>
              x.v > 0 ? (
                <div>
                  <span><i style={{ background: x.color }} />{x.label}</span>
                  <b>{eur(lang, x.v / d)}</b>
                </div>
              ) : null,
            )}
          </div>
        </>
      ) : null}
      {onExplain ? <button type="button" class="ex-open" onClick={onExplain}>{t(lang, 'ex.open')}</button> : null}
    </div>
  );
}

function Timeline({ lang, r }: R) {
  const short = tList(lang, 'months.short');
  return (
    <div class="timeline" aria-hidden="true">
      {r.q130.map((q) => {
        const [, m, day] = q.due.split('-').map(Number);
        const cls = q.regime === 'none' || q.regime === 'waived' ? 'skip' : q.due < r.asOf ? 'done' : r.nextPayment?.due === q.due ? 'next' : '';
        return (
          <div class={cls}>
            <i />
            <span>{day} {short[m - 1]}</span>
          </div>
        );
      })}
    </div>
  );
}

export function Panel({ lang, r }: R) {
  const a = r.annual;
  const np = r.nextPayment ?? r.firstPayment;
  const [copied, setCopied] = useState(false);
  const share = async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard refused: the URL in the address bar is the share link */
    }
  };
  const formName = (f: string) => t(lang, FORM_KEY[f] ?? 'form.130');
  return (
    <>
      <div class="panel">
        {np && np.form !== 'renta' ? (
          <div class="row">
            <span class="lbl">{r.nextPayment ? t(lang, 'res.next') : t(lang, 'res.first')} · {formName(np.form)}{np.form !== '390' ? `, ${t(lang, 'quarter', { q: np.label.replace('Q', '') })}` : ''}</span>
            <span class="val">{eur(lang, Math.max(0, np.amount))} · {t(lang, 'due', { date: date(lang, np.due, r.year) })}</span>
            {r.q130.some((q) => q.regime !== 'none') ? <Timeline lang={lang} r={r} /> : null}
          </div>
        ) : null}
        <div class="row">
          <span class="lbl">{t(lang, 'res.setAside')}</span>
          <span class="val">{t(lang, 'res.setAsideValue', { pct: pct(lang, r.setAside.pct), amount: eur(lang, r.setAside.amountMonthly) })}</span>
          {r.setAside.ivaMonthly > 0 ? <span class="meta">{t(lang, 'res.setAsideIva', { amount: eur(lang, r.setAside.ivaMonthly) })}</span> : null}
        </div>
        <div class="row">
          <span class="lbl">{t(lang, 'res.renta', { year: r.year, next: r.year + 1 })}</span>
          <span class={`val ${a.renta < -1 ? 'ok' : a.renta > 1 ? 'bad' : ''}`}>
            {a.renta < -1 ? t(lang, 'res.rentaRefund', { amount: eur(lang, -a.renta) }) : a.renta > 1 ? t(lang, 'res.rentaPay', { amount: eur(lang, a.renta) }) : t(lang, 'res.rentaZero')}
          </span>
        </div>
      </div>
      <div class="actions">
        <button type="button" class="btn" onClick={share}>
          {copied ? <CheckIcon size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
          {copied ? t(lang, 'res.copied') : t(lang, 'res.share')}
        </button>
      </div>
    </>
  );
}

/** Mobile: a slim bar with the headline once the hero card has scrolled away. */
export function Dock({ lang, r, target }: R & { target: { current: HTMLElement | null } }) {
  const [show, setShow] = useState(false);
  const io = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    if (!target.current || typeof IntersectionObserver === 'undefined') return;
    io.current = new IntersectionObserver(([e]) => setShow(!e.isIntersecting), { threshold: 0 });
    io.current.observe(target.current);
    return () => io.current?.disconnect();
  }, [target.current]);
  return (
    <div class={`dock${show ? ' show' : ''}`} aria-hidden={!show}>
      <span>{t(lang, 'res.headline', { year: r.year })}</span>
      <b>{eur(lang, r.keptMonthly)} <span>{t(lang, 'res.perMonth')}</span></b>
    </div>
  );
}

