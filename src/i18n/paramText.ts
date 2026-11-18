import type { Key, Values } from '../params';
import type { Lang } from './t';

/** Human-readable value of a parameter for the methodology page. */
export function paramText(lang: Lang, k: Key, v: Values[Key]): string {
  const uk = lang === 'uk';
  const loc = uk ? 'uk-UA' : 'en-GB';
  const n = (x: number, d = 2) => new Intl.NumberFormat(loc, { maximumFractionDigits: d }).format(x);
  const e = (x: number) => `${n(x)} €`;
  const p = (x: number) => `${n(x * 100)} %`;
  const L = (a: string, b: string) => (uk ? a : b);
  const val = v as never as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  switch (k) {
    case 'irpf.scale': return (val as [number, number][]).map(([f, r]) => `${L('від', 'from')} ${e(f)}: ${p(r)}`).join(' · ');
    case 'irpf.simplificadaTiers': return (val as [number | null, number][]).map(([u, r]) => (u === null ? `${L('більше', 'above')}: ${p(r)}` : `${L('до', 'up to')} ${e(u)}: ${p(r)}`)).join(' · ');
    case 'irpf.startup': return `${L('жінки', 'women')} ${p(val.w)} · ${L('чоловіки', 'men')} ${p(val.m)}`;
    case 'irpf.descendants': return (val as number[]).map((x, i) => `${i + 1}${i === 4 ? '+' : ''}: ${e(x)}`).join(' · ');
    case 'irpf.rent': return `${p(val.base.rate)} ${L('до', 'up to')} ${e(val.base.cap)} · ${L(`до ${val.ageLimit} років`, `under ${val.ageLimit}`)}: ${p(val.enhanced.rate)} ${L('до', 'up to')} ${e(val.enhanced.cap)} · ${L('не діє, якщо база вища за', 'lost above a base of')} ${e(val.blCap)}`;
    case 'irpf.workBonif': return `${e(val.max)} → ${e(val.min)} (${L('між', 'between')} ${e(val.lo)} ${L('і', 'and')} ${e(val.hi)}) · ${e(val.min)}, ${L('якщо інший дохід понад', 'if other income exceeds')} ${e(val.otherIncomeCap)}`;
    case 'p130': return `${L('роки 1–2', 'years 1–2')}: ${p(val.startRate)} ${L('кварталу', 'of the quarter')} · ${L('з 3-го року', 'from year 3')}: ${p(val.generalRate)} ${L('доходу двома роками раніше', 'of income two years earlier')} · ${L('при збитку', 'after a loss')}: ${p(val.lossRate)} ${L('виручки', 'of revenue')} · ${L('не подається, якщо з утриманням від', 'not filed if withholding covers')} ${p(val.waiverShare)}`;
    case 'p130.simplificadaInside': return val ? L('так', 'yes') : L('ні (за текстом закону)', 'no (by the law\'s text)');
    case 'retencion': return `${p(val.std)} · ${L('перші 3 роки', 'first 3 years')}: ${p(val.newcomer)}`;
    case 'reta.tramos': return L(`${(val as unknown[]).length} діапазонів`, `${(val as unknown[]).length} bands`);
    case 'reta.ssIncomeReading': return val === 'A' ? L('до знижки 20/15/10 %', 'before the 20/15/10 % reduction') : L('після знижки', 'after the reduction');
    case 'rg.cc': return `${L('працівник', 'employee')} ${p(val.employee)} · ${L('роботодавець', 'employer')} ${p(val.employer)}`;
    case 'pluriRefund': return `${p(val.share)} ${L('від суми понад', 'of the excess over')} ${e(val.cap)}`;
    case 'rg.solidarity': return (val.employee as number[]).map((x: number, i: number) => p(x + val.employer[i])).join(' / ');
    case 'salaryWithholding': return L(`таблиця, ${(val as unknown[]).length} рядків`, `table, ${(val as unknown[]).length} rows`);
    case 'salaryWithholding.shortContractMin': return `${n(val)} %`;
    case 'deadlines': return `130 / 303: ${(val.q303 as string[]).map((d: string) => d.split('-').reverse().join('.')).join(', ')} · ${L('4-й квартал і 390', 'Q4 and 390')}: ${val.m390.split('-').reverse().join('.')} · Renta ${L('до', 'by')} ${val.rentaEnd.split('-').reverse().join('.')}`;
    case 'irpf.purchase': return `${p(val.base.rate)} ${L('до', 'up to')} ${e(val.base.cap)} · ${L('до 36 років', 'under 36')}: ${p(val.enhanced.rate)} ${L('до', 'up to')} ${e(val.enhanced.cap)} · ${L('не діє вище бази', 'lost above a base of')} ${e(val.blCap)}`;
    case 'irpf.disability': return (val as number[]).map(e).join(' · ');
    case 'irpf.age': return `65+: ${e(val.over65)} · 75+: ${e(val.over75)} · ${L('зменшується між', 'tapers between')} ${e(val.lo)} ${L('і', 'and')} ${e(val.hi)}`;
    case 'irpf.widow': return `${e(val.amount)} · ${L('зменшується між', 'tapers between')} ${e(val.lo)} ${L('і', 'and')} ${e(val.hi)}`;
    case 'irpf.carer': return `${e(val.domestic)} · ${L('професійна', 'professional')}: ${e(val.professional)}`;
    case 'irpf.womenReturn': return `${e(val)} ${L('за рік перерви', 'per year away')}`;
    default:
      if (typeof val === 'number') return val > 0 && val < 1 ? p(val) : e(val);
      return String(val);
  }
}
