// Refresh src/params/fx.json from the ECB reference rates (via api.frankfurter.dev, which republishes them).
// latest = most recent ECB rate; monthly = average of each complete month since 1 January of last year.
// Run at build time (CI does it daily); on any failure the stored file is kept.
import { writeFileSync } from 'node:fs';

const CUR = ['USD', 'GBP', 'PLN'];
const API = 'https://api.frankfurter.dev/v1';
const get = async (url) => {
  const r = await fetch(url, { headers: { 'user-agent': 'autonomo-bizkaia-build' } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
};

const latest = await get(`${API}/latest?base=EUR&symbols=${CUR.join(',')}`);
const year = Number(latest.date.slice(0, 4));
const series = await get(`${API}/${year - 1}-01-01..${latest.date}?base=EUR&symbols=${CUR.join(',')}`);

const thisMonth = latest.date.slice(0, 7);
const sums = {};
for (const [day, rates] of Object.entries(series.rates)) {
  const ym = day.slice(0, 7);
  if (ym >= thisMonth) continue; // only complete months
  sums[ym] ??= { n: 0, ...Object.fromEntries(CUR.map((c) => [c, 0])) };
  sums[ym].n++;
  for (const c of CUR) sums[ym][c] += rates[c];
}
const monthly = Object.fromEntries(
  Object.entries(sums).sort().map(([ym, s]) => [ym, Object.fromEntries(CUR.map((c) => [c, +(s[c] / s.n).toFixed(5)]))]),
);
const out = { date: latest.date, source: 'ECB euro foreign exchange reference rates (via frankfurter.dev)', perEur: latest.rates, monthly };
writeFileSync(new URL('../src/params/fx.json', import.meta.url), JSON.stringify(out, null, 1) + '\n');
console.log(`fx: ${latest.date}, ${Object.keys(monthly).length} monthly averages`);
