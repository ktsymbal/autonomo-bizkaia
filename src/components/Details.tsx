import { useState } from 'preact/hooks';
import type { CalcResult } from '../engine/compute';
import { date, eur, pct, t, tList, type Lang } from '../i18n/t';
import { regimeLabel } from './Results';
import aid from '../params/aid.json';
import { ExternalLink } from 'lucide-preact';

type R = { lang: Lang; r: CalcResult };
type Tab = 'overview' | 'months' | 'm130' | 'iva' | 'whatif' | 'aid';

function Row({ label, value, cls = '', note }: { label: string; value: string; cls?: string; note?: string }) {
  return (
    <tr class={cls}>
      <td>{label}{note ? <span class="tag">{note}</span> : null}</td>
      <td class="r">{value}</td>
    </tr>
  );
}

function Overview({ lang, r }: R) {
  const a = r.annual;
  const e = (x: number) => eur(lang, x);
  const tierAmt = a.D > 0 ? a.D * a.tier : 0;
  const startupAmt = Math.max(0, a.D - tierAmt - Math.max(0, a.rnAct));
  return (
    <>
      <div class="tablewrap">
        <table>
          <tbody>
            <Row label={t(lang, 'ov.income')} value={e(a.income)} />
            <Row cls="minus" label={t(lang, 'ov.expenses')} value={`− ${e(a.expenses)}`} />
            <Row cls="minus" label={t(lang, 'ov.reta', { regime: regimeLabel(lang, r) })} value={`− ${e(a.reta)}`} />
            <Row cls="sum" label={t(lang, 'ov.D')} value={e(a.D)} />
            {tierAmt > 0 ? <Row cls="minus" label={t(lang, 'ov.tier')} note={pct(lang, a.tier, 0)} value={`− ${e(tierAmt)}`} /> : null}
            {startupAmt > 0.5 ? <Row cls="minus" label={t(lang, 'ov.startup')} value={`− ${e(startupAmt)}`} /> : null}
            <Row cls="sum" label={t(lang, 'ov.rn')} value={e(a.rnAct)} />
            {a.salaryGross ? <Row label={t(lang, 'ov.salary', { bonif: e(a.workBonif) })} value={e(a.rnTrab)} /> : null}
            <Row label={t(lang, 'ov.bl')} value={e(a.irpf.bl)} />
            <Row label={t(lang, 'ov.ci')} value={e(a.irpf.ci)} />
            {a.irpf.deductions.descendants ? <Row cls="minus" label={t(lang, 'ov.desc')} value={`− ${e(a.irpf.deductions.descendants)}`} /> : null}
            {a.irpf.deductions.rent ? <Row cls="minus" label={t(lang, 'ov.rent')} value={`− ${e(a.irpf.deductions.rent)}`} /> : null}
            <Row cls="sum" label={t(lang, 'ov.cl')} value={e(a.irpf.cl)} />
            <Row cls="minus" label={t(lang, 'ov.prepaid130')} value={`− ${e(a.prepaid130)}`} />
            {a.retencion ? <Row cls="minus" label={t(lang, 'ov.retClients')} value={`− ${e(a.retencion)}`} /> : null}
            {a.salaryWithheld ? <Row cls="minus" label={t(lang, 'ov.retSalary')} value={`− ${e(a.salaryWithheld)}`} /> : null}
            <Row cls="sum" label={t(lang, 'ov.renta')} value={a.renta < 0 ? `+ ${e(-a.renta)}` : `− ${e(a.renta)}`} />
          </tbody>
        </table>
      </div>
      {a.renta < -1 ? <p>{t(lang, 'ov.why')}</p> : null}
    </>
  );
}

function Months({ lang, r }: R) {
  const short = tList(lang, 'months.short');
  const e = (x: number) => (x ? eur(lang, x) : '—');
  const hasSalary = r.annual.salaryGross > 0;
  return (
    <>
      <div class="tablewrap">
        <table>
          <thead>
            <tr>
              <th>{t(lang, 'mo.month')}</th>
              <th class="r">{t(lang, 'mo.income')}</th>
              {hasSalary ? <th class="r">{t(lang, 'mo.salary')}</th> : null}
              <th class="r">{t(lang, 'mo.expenses')}</th>
              <th class="r">{t(lang, 'mo.cuota')}</th>
              <th class="r">{t(lang, 'mo.tax')}</th>
              <th class="r">{t(lang, 'mo.net')}</th>
            </tr>
          </thead>
          <tbody>
            {r.months.map((m) => (
              <tr class={m.active ? '' : 'dim'}>
                <td>
                  {short[m.m]}
                  {!m.active ? <span class="tag">{t(lang, 'mo.inactive')}</span> : m.forecast ? <span class="tag">{t(lang, 'mo.forecastTag')}</span> : null}
                  {m.due.filter((d) => d !== '130-waived').map((d) => <span class="tag due">{d}</span>)}
                </td>
                <td class="r">{e(m.income - m.retencion)}</td>
                {hasSalary ? <td class="r">{e(m.salaryNet)}</td> : null}
                <td class="r">{m.expenses ? `− ${eur(lang, m.expenses)}` : '—'}</td>
                <td class="r">{m.cuota ? `− ${eur(lang, m.cuota)}` : '—'}</td>
                <td class="r">{m.tax130 ? `− ${eur(lang, m.tax130)}` : '—'}</td>
                <td class="r"><b>{m.active || hasSalary ? eur(lang, m.net) : '—'}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3 style="font-size:var(--step-1);margin-bottom:8px">{t(lang, 'mo.after')}</h3>
        <ul class="list">
          {r.after.map((p) => (
            <li>
              {p.form === 'renta'
                ? t(lang, 'res.renta', { year: r.year, next: r.year + 1 })
                : `${t(lang, p.form === '390' ? 'form.390' : 'form.130')}${p.form === '130' ? `, ${t(lang, 'quarter', { q: 4 })}` : ''}`}
              {' · '}
              {date(lang, p.due)}
              {' · '}
              {p.form === 'renta'
                ? p.amount < -1 ? t(lang, 'res.rentaRefund', { amount: eur(lang, -p.amount) }) : p.amount > 1 ? t(lang, 'res.rentaPay', { amount: eur(lang, p.amount) }) : t(lang, 'res.rentaZero')
                : eur(lang, Math.abs(p.amount))}
            </li>
          ))}
          {r.reta.months.some((m) => m.regime === 'tramo') ? <li>{t(lang, 'mo.retaReg', { year: r.year + 2 })}</li> : null}
          {r.pluri && r.pluri.refund > 0 ? <li>{t(lang, 'mo.ssRefund', { amount: eur(lang, r.pluri.refund), year: r.pluri.refundYear })}</li> : null}
        </ul>
      </div>
    </>
  );
}

function M130({ lang, r }: R) {
  const firstActive = Math.max(0, r.q130.findIndex((q) => q.regime !== 'none'));
  const [qi, setQi] = useState(firstActive);
  const q = r.q130[qi];
  const ym2 = r.year - 2;
  const order: Record<string, string[]> = { start: ['09', '10', '11', '12'], general: ['01', '02', '03', '04'], loss: ['15', '16', '17', '18'] };
  return (
    <>
      <p>{t(lang, 'm130.lede')}</p>
      <div class="tabs" role="tablist" aria-label={t(lang, 'm130.quarter')}>
        {r.q130.map((x, k) => (
          <button type="button" role="tab" aria-selected={k === qi} onClick={() => setQi(k)}>
            {t(lang, 'quarter', { q: x.q })} · {date(lang, x.due, r.year)}
          </button>
        ))}
      </div>
      {q.regime === 'none' ? <p>{t(lang, 'm130.none')}</p> : null}
      {q.regime === 'waived' ? <p>{t(lang, 'm130.waived')}</p> : null}
      {order[q.regime] ? (
        <>
          <p><b>{t(lang, `m130.regime.${q.regime}`, { year: ym2 })}</b></p>
          <div class="boxes">
            {order[q.regime].map((b) => (
              <div class="box">
                <b class="n">{b}</b>
                <span>{t(lang, `m130.box.${b}`, { year: ym2 })}</span>
                <span>{eur(lang, q.boxes[b] ?? 0, true)}</span>
              </div>
            ))}
            <div class="box total">
              <b class="n">28</b>
              <span>{t(lang, 'm130.box.28')}</span>
              <span>{eur(lang, q.boxes['28'] ?? 0, true)}</span>
            </div>
          </div>
          {q.negative ? <p class="fine">{t(lang, 'm130.negative')}</p> : null}
        </>
      ) : null}
    </>
  );
}

function Iva({ lang, r }: R) {
  const noIva = r.iva.annualOut === 0;
  const m = r.iva.m390;
  return (
    <>
      <p>{t(lang, 'iva.lede')}</p>
      <div class="tablewrap">
        <table>
          <thead>
            <tr><th>{t(lang, 'm130.quarter')}</th><th class="r">{t(lang, 'iva.out')}</th><th class="r">{t(lang, 'iva.in')}</th><th class="r">→</th><th></th></tr>
          </thead>
          <tbody>
            {r.iva.quarters.map((q) => (
              <tr class={q.status === 'none' ? 'dim' : ''}>
                <td>{t(lang, 'quarter', { q: q.q })}{q.due && q.status !== 'annual390' ? <span class="tag">{date(lang, q.due, r.year)}</span> : null}</td>
                <td class="r">{eur(lang, q.out)}</td>
                <td class="r">{eur(lang, q.in)}</td>
                <td class="r">{q.status === 'pay' ? eur(lang, q.result) : q.status === 'carry' ? `↪ ${eur(lang, q.carryOut)}` : '—'}</td>
                <td>{t(lang, `iva.status.${q.status}`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        <b>
          {m.result > 0.5 ? t(lang, 'iva.390pay', { amount: eur(lang, m.result), date: date(lang, m.due) })
            : m.refund > 0.5 ? t(lang, 'iva.390refund', { amount: eur(lang, m.refund), date: date(lang, m.due) })
            : t(lang, 'iva.390zero', { date: date(lang, m.due) })}
        </b>
      </p>
      {noIva ? <p class="fine">{t(lang, 'iva.noIva')}</p> : null}
    </>
  );
}

function WhatIf({ lang, r }: R) {
  const c = r.compare;
  const n = r.nextYear;
  return (
    <>
      <div class="compare">
        {c?.noTarifaPlanaMonthly !== null && c ? (
          <>
            <div class="cmp mine"><span class="lbl">{t(lang, 'wi.tp')}</span><span class="val">{eur(lang, r.keptMonthly)}</span></div>
            <div class="cmp"><span class="lbl">{t(lang, 'wi.noTp')}</span><span class="val">{eur(lang, c.noTarifaPlanaMonthly)}</span><p>{t(lang, 'wi.diff', { amount: eur(lang, r.keptMonthly - c.noTarifaPlanaMonthly) })}</p></div>
          </>
        ) : null}
        {c && c.employeeGross > 0 ? (
          <div class="cmp">
            <span class="lbl">{t(lang, 'wi.employee')}</span>
            <span class="val">{t(lang, 'wi.employeeValue', { gross: eur(lang, c.employeeGross) })}</span>
            <p>{t(lang, 'wi.employeeNote', { gross: eur(lang, c.employeeGross), monthly: eur(lang, c.employeeGross / 12), cost: eur(lang, c.employerCost) })}</p>
          </div>
        ) : null}
      </div>
      {n ? (
        <div>
          <h3 style="font-size:var(--step-1);margin-bottom:8px">{t(lang, 'wi.next', { year: n.year })}</h3>
          <ul class="list">
            <li>{t(lang, 'wi.nextKept', { amount: eur(lang, n.keptMonthly) })}</li>
            {n.tpEndsThisYear ? <li>{t(lang, 'wi.tpEnds')}</li> : null}
            {n.tpEndsThisYear && n.extensionEligible ? <li>{t(lang, 'wi.ext')}</li> : null}
            {n.m130Switch && n.m130Quarter !== null ? <li>{t(lang, 'wi.switch', { year: n.year, amount: eur(lang, n.m130Quarter) })}</li> : null}
            <li>{t(lang, 'wi.reg')}</li>
          </ul>
        </div>
      ) : null}
    </>
  );
}


function Aid({ lang, r }: R) {
  return (
    <>
      <p>{t(lang, 'aid.lede')}</p>
      <div class="compare">
        {aid.programs.map((p) => {
          const status = r.asOf > p.to ? t(lang, 'aid.closed', { year: p.to.slice(0, 4), from: date(lang, p.from), to: date(lang, p.to) })
            : r.asOf >= p.from ? t(lang, 'aid.open', { date: date(lang, p.to) })
            : t(lang, 'aid.upcoming', { from: date(lang, p.from), to: date(lang, p.to) });
          const open = r.asOf >= p.from && r.asOf <= p.to;
          return (
            <article class="cmp">
              <span class="lbl">{p.org}</span>
              <span class="val" style="font-size:var(--step-1)">{p.name[lang]}</span>
              <p style="color:var(--ink);font-weight:600">{p.amount[lang]}</p>
              <ul class="list" style="font-size:var(--step--1);color:var(--ink-2)">{p.conditions[lang].map((c) => <li>{c}</li>)}</ul>
              <p><span class={`chip${open ? '' : ' neutral'}`}>{status}</span></p>
              <p><a href={p.url} target="_blank" rel="noopener">{t(lang, 'aid.link')} <ExternalLink size={12} aria-hidden="true" /></a>{p.status !== 'V' ? ` · ${t(lang, 'aid.unverified')}` : ''}</p>
            </article>
          );
        })}
      </div>
      <p class="fine">{t(lang, 'aid.checked', { date: date(lang, aid.checked) })}</p>
    </>
  );
}

export function Details({ lang, r }: R) {
  const [tab, setTab] = useState<Tab>('overview');
  const tabs: Tab[] = ['overview', 'months', 'm130', 'iva', 'whatif', 'aid'];
  return (
    <section class="details" aria-labelledby="h-details">
      <header>
        <h2 id="h-details">{t(lang, 'details.title')}</h2>
        <p>{t(lang, 'details.lede')}</p>
      </header>
      <div class="tabs" role="tablist">
        {tabs.map((k) => (
          <button type="button" role="tab" id={`tab-${k}`} aria-controls={`panel-${k}`} aria-selected={tab === k} onClick={() => setTab(k)}>
            {t(lang, `tabs.${k}`)}
          </button>
        ))}
      </div>
      <div class="tabpanel" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'overview' ? <Overview lang={lang} r={r} /> : null}
        {tab === 'months' ? <Months lang={lang} r={r} /> : null}
        {tab === 'm130' ? <M130 lang={lang} r={r} /> : null}
        {tab === 'iva' ? <Iva lang={lang} r={r} /> : null}
        {tab === 'whatif' ? <WhatIf lang={lang} r={r} /> : null}
        {tab === 'aid' ? <Aid lang={lang} r={r} /> : null}
      </div>
    </section>
  );
}
