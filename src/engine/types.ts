export type Currency = 'EUR' | 'USD' | 'GBP' | 'PLN';
export const CURRENCIES: Currency[] = ['EUR', 'USD', 'GBP', 'PLN'];
export type ClientType = 'es_company' | 'es_private' | 'eu_company' | 'non_eu_company';
export type Persona = 'abroad' | 'spain' | 'pluri' | 'plan';

/** One calendar month of one client. index 0 = January. */
export type Month = { amount: number; actual: boolean };
export type ClientEntry = { mode: 'monthly' | 'hourly' | 'byMonth'; rate?: number; hours?: number; days?: number };
export type Client = { name: string; type: ClientType; currency: Currency; months: Month[]; newcomer7: boolean; entry?: ClientEntry };
export type Expense = { name: string; monthly: number; ivaIncluded: boolean; foreign: boolean };
export type YM = { year: number; month: number }; // month 1..12

export type CalcInput = {
  year: 2026 | 2027;
  asOf: string; // ISO date, "today"
  persona: Persona;
  alta: YM | null; // null = not registered yet → first year starts next month
  clients: Client[];
  expenseMode: 'none' | 'pct' | 'itemized';
  expensePct: number; // e.g. 5 = 5 %
  expenses: Expense[];
  fx: Record<Currency, number>; // EUR per 1 unit of currency
  fxDate: string;
  under36: boolean;
  rentMonthly: number;
  leaseFrom2026: boolean;
  partner: boolean;
  kidsUnder6: number;
  kids6to30: number;
  largeFamily: boolean;
  startup: { claim: boolean; sex: 'w' | 'm' };
  priorD: number | null; // user-entered previous-year ingresos − gastos; null = derive / first year
  epsv: number;
  salary: { grossMonthly: number; withheldMonthly: number | null; shortContract: boolean } | null;
  retaBase: number | null; // null = minimum of forecast tramo
  tpEligible: boolean; // no RETA in the last 2 years (3 if had tarifa plana before)
  settings: { r2: 'A' | 'B'; s1: 'off' | 'tier' | '15'; s2: boolean };
};

export type MonthRow = {
  m: number; // 0..11
  active: boolean;
  income: number; // € base, no IVA
  ivaOut: number;
  retencion: number;
  incomeWithRet: number; // income from payers that withhold
  expenses: number; // € for IRPF (incl. non-recoverable IVA)
  ivaIn: number; // deductible IVA
  forecast: boolean; // any forecast amount in this month
};
