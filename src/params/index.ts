import p2026 from './2026.json';

export type Status = 'V' | 'S' | 'P' | '?';
export type Param<T> = { value: T; source: string; status: Status; checked: string };
export type Year = 2026 | 2027;

export type Tramo = { upTo: number | null; minBase: number; maxBase: number };
export type WithholdingRow = { upTo: number | null; pct: number[] };

export type Values = {
  'irpf.scale': [number, number][];
  'irpf.minoracion': number;
  'irpf.simplificadaTiers': [number | null, number][];
  'irpf.firstYearTier': number;
  'irpf.startup': { w: number; m: number };
  'irpf.descendants': number[];
  'irpf.descendantUnder6': number;
  'irpf.rent': { base: { rate: number; cap: number }; enhanced: { rate: number; cap: number }; blCap: number; ageLimit: number };
  'irpf.epsvCap': number;
  'irpf.purchase': { base: { rate: number; cap: number }; enhanced: { rate: number; cap: number }; blCap: number; lifetimeCap: number };
  'irpf.disability': number[];
  'irpf.ascendant': number;
  'irpf.age': { over65: number; over75: number; lo: number; hi: number };
  'irpf.widow': { amount: number; lo: number; hi: number };
  'irpf.carer': { domestic: number; professional: number };
  'irpf.womenReturn': number;
  'irpf.menChildcare': number;
  'irpf.jointReduction': number;
  'irpf.workBonif': { max: number; min: number; lo: number; hi: number; slope: number; otherIncomeCap: number };
  p130: { startRate: number; generalRate: number; lossRate: number; generalRetShare: number; waiverShare: number };
  'p130.simplificadaInside': boolean;
  retencion: { std: number; newcomer: number };
  'iva.general': number;
  'reta.rate': number;
  'reta.mei': number;
  'reta.tarifaPlana': number;
  'reta.tarifaPlanaMeiBase': number;
  'reta.genericDeduction': number;
  'reta.tramos': Tramo[];
  'reta.ssIncomeReading': 'A' | 'B';
  smi: number;
  'reta.ccRate': number;
  'rg.cc': { employee: number; employer: number };
  pluriRefund: { cap: number; share: number };
  'rg.employee': number;
  'rg.employer': number;
  'rg.maxBaseMonth': number;
  'rg.solidarity': { bands: number[]; employee: number[]; employer: number[] };
  salaryWithholding: WithholdingRow[];
  'salaryWithholding.shortContractMin': number;
  deadlines: { q130: string[]; q303: string[]; m390: string; rentaEnd: string; rentaSecond: string };
};
export type Key = keyof Values;
export type Raw = { [K in Key]: Param<Values[K]> };

const base2026 = p2026 as unknown as Raw;

const LAW_2027 = 'LGSS DT 43ª (MEI 1,0 % in 2027)';

function build2027(): Raw {
  const out = {} as Record<string, Param<unknown>>;
  for (const [k, v] of Object.entries(base2026)) {
    out[k] = { ...v, status: v.status === '?' ? '?' : 'P', source: `${v.source} — 2027 not published, 2026 value carried over` };
  }
  out['reta.mei'] = { value: 0.010, source: LAW_2027, status: 'V', checked: '2026-11-18' };
  out['reta.rate'] = { value: 0.316, source: LAW_2027, status: 'V', checked: '2026-11-18' };
  return out as Raw;
}

const RAW: Record<Year, Raw> = { 2026: base2026, 2027: build2027() };

export function rawParams(year: Year): Raw {
  return RAW[year];
}

export type Params = {
  year: Year;
  get<K extends Key>(k: K): Values[K];
  meta(k: Key): Omit<Param<unknown>, 'value'>;
  used(): Key[];
  unverifiedUsed(): Key[];
};

/** A fresh, usage-tracking view of one year's parameters. */
export function getParams(year: Year, overrides?: Partial<Raw>): Params {
  const raw = { ...RAW[year], ...overrides } as Raw;
  const used: Key[] = [];
  return {
    year,
    get(k) {
      if (!used.includes(k)) used.push(k);
      return raw[k].value;
    },
    meta(k) {
      const { value: _v, ...m } = raw[k];
      return m;
    },
    used: () => [...used],
    unverifiedUsed: () => used.filter((k) => raw[k].status !== 'V'),
  };
}
