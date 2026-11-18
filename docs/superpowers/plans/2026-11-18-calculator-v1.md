# Bizkaia autónomo calculator v1: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task by task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** a static site, in UK and EN, that does for Bizkaia autónomos what avtonomo.com does for common-regime Spain: how much you keep each month, what to set aside, and what is due when. It uses Bizkaia foral rules.

**Architecture:** a pure TypeScript engine (`src/engine/`) turns `CalcInput` into `CalcResult`, with no I/O. Parameters live in versioned JSON (`src/params/2026.json`), and every value carries `source`, `status` and `checked`. The Astro static site serves `/uk/` and `/en/`, and one Preact island holds the calculator. State is serialised into the URL fragment.

**Tech stack:**
- Node 26
- Astro 5 with `@astrojs/preact`
- TypeScript (strict)
- Vitest

**Spec:** `docs/superpowers/specs/2026-11-18-bizkaia-calculator-design.md`. Research with all the sources is in `docs/research/01`–`07`.

## Global constraints
- Foral rules only. No AEAT defaults anywhere.
- Every number in a result is traceable: `CalcResult.provenance` lists the parameter keys used. If any of them has status `P` or `?`, the result shows warning W16.
- The engine is deterministic and has no `Date.now()`. "Today" is an input (`asOf`).
- Money is handled as floats and rounded to cents only when displayed. Golden tests use `toBeCloseTo(x, 0)` for euro figures and `toBeCloseTo(x, 2)` for the 130 golden test.
- Interface strings live only in `src/i18n/{uk,en}.json`, with the Spanish term next to each concept. No copy is taken from avtonomo.com.
- No cookies, no backend, no accounts.
- Scope v1 follows spec §1. Out-of-scope inputs are not offered.

## Review Focus
1. **Alta in the middle of a year:** months before the alta count nothing, and the tarifa plana runs for alta month + 12 full months, crossing the year boundary. Test this in Task 3 and Task 8.
2. **Zero, negative or loss quarters:** the 130 result is 0 and filed as a "negativa", with no carry-forward. A negative D keeps the % reduction off (S2) and does not offset work income. Test in Tasks 4 and 5.
3. **Non-EUR currencies:** a missing rate is an error, not a silent 1:1 conversion. Test in Task 2.
4. **Salary withholding cliffs:** exactly €20,000.00 gives 0% and €20,000.01 gives 7%. Test in Task 7.
5. **Corrupt or old URL fragment:** fall back to the defaults, never crash. Test in Task 9.

---

### Task 1: Scaffold, parameters and their schema

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `src/params/2026.json`, `src/params/index.ts`, `tests/params.test.ts`

**Interfaces:**
- Produces:
  - `type Status = 'V'|'S'|'P'|'?'`
  - `type Param<T> = { value: T; source: string; status: Status; checked: string }`
  - `getParams(year: 2026|2027): Params`. 2027 is 2026 with these overrides: RETA rate 0.316, tarifa plana 89.51 and MEI 0.010. Every 2027 field has status `P` unless it is fixed by law.
- `Params` keys, with values copied from spec §4 and research files `04` and `06`:
  - `irpf.scale`: brackets `[from, rate]`
  - `irpf.minoracion`
  - `irpf.simplificadaTiers`
  - `irpf.startup` `{w: 0.15, m: 0.10}`
  - `irpf.descendants` `[682, 844, 1421, 1680, 2195]`, `irpf.descendantUnder6` 394
  - `irpf.rent` `{base: {rate: .20, cap: 1600}, enhanced: {rate: .35, cap: 2800}, blCap: 68000}`
  - `irpf.epsvCap` 5000
  - `irpf.workBonif` `{max: 8000, min: 3000, lo: 14800, hi: 23000, slope: 0.6098, otherIncomeCap: 7500}`
  - `p130` `{startRate: .20, generalRate: .05, lossRate: .005, generalRetShare: .25, waiverShare: .70}`
  - `retencion` `{std: .15, newcomer: .07}`
  - `iva.general` .21
  - `reta.rate` .315, `reta.mei` .009, `reta.tarifaPlana` 80, `reta.tarifaPlanaMeiBase` 950.98, `reta.genericDeduction` .07, `reta.tramos`: 15 rows `{upTo, minBase, maxBase}` from `04 §1`
  - `smi` 17094
  - `pluriRefund` `{cap: 17323.68, share: .5}`
  - `rg.employee` .065, `rg.employer` .3215, `rg.maxBaseMonth` 5101.20, `rg.solidarity` (bands and employee shares from `06 §2`)
  - `salaryWithholding`: the full 2026 table from `06 §1.3`, with columns 0–6+
  - `deadlines`: quarters Q1–Q3 on the 25th of the following month; Q4 130 by 31 Jan; 390 by 31 Jan; Renta 30 Jun

- [ ] **Step 1: Scaffold** with `npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git`, then `npm i @astrojs/preact preact` and `npm i -D vitest`. Add the scripts `test: vitest run` and `build: astro build`.
- [ ] **Step 2: Write the failing test** `tests/params.test.ts`:
  - `every leaf param has source, status in V|S|P|?, checked ISO date`
  - `scale(2026) brackets == [[0,.23],[18080,.28],[36160,.35],[54240,.40],[77450,.45],[107260,.46],[142960,.47],[208390,.49]]`
  - `tramos has 15 rows; row 12 minBase 1928.10; row 11 minBase 1732.03; maxBase 5101.20`
  - `2027 reta.rate == .316 and status P`
- [ ] **Step 3: Run** `npm test`. Expect FAIL.
- [ ] **Step 4: Implement** `2026.json` and `getParams`.
- [ ] **Step 5: Run** `npm test`. Expect PASS. Commit with `feat: parameters 2026/2027 with provenance`.

### Task 2: Input model, currency, clients and expenses into a monthly activity ledger

**Files:**
- Create: `src/engine/types.ts`, `src/engine/activity.ts`
- Test: `tests/activity.test.ts`

**Interfaces:**
- Produces, in `types.ts`:
```ts
type Currency = 'EUR'|'USD'|'GBP'|'PLN'
type ClientType = 'es_company'|'es_private'|'eu_company'|'non_eu_company'
type Month = { amount: number; actual: boolean }           // 12 per client, index 0 = Jan
type Client = { name: string; type: ClientType; currency: Currency; months: Month[]; newcomer7: boolean }
type Expense = { name: string; monthly: number; ivaIncluded: boolean; foreign: boolean }
type CalcInput = {
  year: 2026|2027; asOf: string; persona: 'abroad'|'spain'|'pluri'|'plan'
  alta: { year: number; month: number } | null              // null = not yet → alta = next month after asOf
  clients: Client[]; expenseMode: 'none'|'pct'|'itemized'; expensePct: number; expenses: Expense[]
  fx: Record<Currency, number>                              // EUR per 1 unit; EUR = 1
  under36: boolean; rentMonthly: number; leaseFrom2026: boolean
  partner: boolean; kidsUnder6: number; kids6to30: number; largeFamily: boolean
  startup: { claim: boolean; sex: 'w'|'m' }; priorD: number | null; epsv: number
  salary: { grossMonthly: number; withheldMonthly: number | null; shortContract: boolean } | null
  retaBase: number | null
  settings: { r2: 'A'|'B'; s1: 'off'|'tier'|'15'; s2: boolean }
}
type MonthRow = { m: number; active: boolean; income: number; ivaOut: number; retencion: number;
                  expenses: number; ivaIn: number; incomeWithRet: number }
```
- `activityLedger(input: CalcInput, p: Params): MonthRow[]`, 12 rows.
- `defaultInput(asOf: string): CalcInput`, the `abroad` persona: €3,000/month non-EU, expensePct 5, not yet registered.

- [ ] **Step 1: Write the failing tests**
  - `non-EU 5000 USD at 0.9 → income 4500, ivaOut 0, retencion 0`
  - `es_company 1000 EUR → ivaOut 210, retencion 150; newcomer7 within S..S+2 → 70`
  - `months before alta inactive and zero`
  - `pct expenses 5% of income, ivaIn 0; itemized ivaIncluded 121 → expenses 100, ivaIn 21`
  - `missing fx rate for USD throws`
- [ ] **Step 2: Run** `npm test -- activity`. Expect FAIL.
- [ ] **Step 3: Implement** in `activity.ts`. Retencion applies only to `es_company`. The 7% rate applies when `newcomer7` is set and `year - alta.year <= 2`.
- [ ] **Step 4: Run** the tests. Expect PASS. Commit with `feat: activity ledger`.

### Task 3: RETA

**Files:**
- Create: `src/engine/reta.ts`
- Test: `tests/reta.test.ts`

**Interfaces:**
- Consumes: `MonthRow[]`, `Params`.
- Produces:
  - `retaMonths(input, p, rendSSMonthly: number): { m: number; cuota: number; regime: 'none'|'tp'|'tramo'; base: number }[]`
  - `tramoFor(rendMonthly, p): {index, minBase, maxBase}`
  - `retaYear(input, p, D: number): { months, total, tpEnd: {year, month} | null, tramo, extensionEligible: boolean, regularisation: number }`
  - Algorithm: `rendSS = (r2=='A' ? D : D*(1-tier)) + cuotas`, solved by fixed-point iteration (at most 10 passes). `rendMonthly = rendSS*0.93/activeNonTpMonths`. With `retaBase` null, the base is `tramo.minBase`. `regularisation = Σ(minBase-base)*rate` when the chosen base is below the minimum, negative when it is above the maximum.

- [ ] **Step 1: Write the failing tests**
  - `tarifa plana month = 80 + .009*950.98 = 88.56`
  - `alta Jan 2026, full year in tp → total 1062.72 (≈1,063)`
  - `alta Jul 2026 → tp runs Jul 2026..Jul 2027 (alta month + 12)`
  - `year 2 €60k income, €840 expenses → tramo 11, total 6547.07`
  - `tramo 12 cuota 607.35`
  - `rendSS*0.93 < smi → extensionEligible true`
- [ ] **Step 2: Run** the tests. Expect FAIL. **Step 3: Implement.** **Step 4: Run.** Expect PASS. Commit with `feat: RETA`.

### Task 4: IRPF (activity plus the annual calculation)

**Files:**
- Create: `src/engine/irpf.ts`
- Test: `tests/irpf.test.ts`

**Interfaces:**
- Produces:
  - `scale(bl, p): number`
  - `tier(priorD: number|null, p): number`, where null means 0.20
  - `activityRN(D, tierPct, input, p, yearIdx: number): number`. `yearIdx` is `year - alta.year`. The start-up reduction applies in years 0–1 when `claim` is set and RN > 0.
  - `annualIRPF({rnAct, rnTrab, input, p}): { bl, ci, deductions: {descendants, rent}, cl }`. A negative rnAct is ring-fenced, so BI = max(0, rnAct) + rnTrab. The rent rate is enhanced if `under36 || largeFamily`, and the rent deduction is 0 if `leaseFrom2026 && bl > 68000`. Descendants: the k-th child gets `descendants[min(k,4)]`, plus 394 per child under 6, all halved when `partner` is set.

- [ ] **Step 1: Write the failing tests**
  - `scale(18080) == 4158.40; scale(36160) == 9220.80; scale(54240) == 15548.80`
  - `tier(null)=.20, tier(35000)=.20, tier(35000.01)=.15, tier(85001)=.10`
  - `golden year 1: D 58097 → RN 46477.6 → CL ≈ 8417 (rent 700/mo, under 36)`
  - `golden year 2: D 52613, tier .15 → CL ≈ 7802`
  - `lease from 2026 and BL 68001 → rent deduction 0`
  - `negative D: RN = D (no %), BI uses 0 for activity`
  - `2 kids under 6, partner → (682+394 + 844+394)/2`
- [ ] **Steps 2–4:** fail, implement, pass. Commit with `feat: IRPF`.

### Task 5: Modelo 130 with boxes

**Files:**
- Create: `src/engine/m130.ts`
- Test: `tests/m130.test.ts`

**Interfaces:**
- Produces: `m130(input, p, ledger, reta, ctx: { yearIdx, tierPct, rnYm2: number|null, incomeYm2: number|null, retYm2: number|null }): Q130[]` where
  `Q130 = { q: 1|2|3|4; due: string; regime: 'start'|'general'|'loss'|'waived'; boxes: Record<string, number>; pay: number }`.
  - Start years (yearIdx 0–1): box 09 = I_q − G_q, where G_q includes that quarter's RETA cuotas. If `s1` is `tier`, box 09 is multiplied by (1 − tierPct); if `15`, by 0.85. Box 10 = 0.20 × max(0, 09); box 11 = ret_q; box 12 = 10 − 11; box 28 = max(0, 12).
  - From yearIdx ≥ 2: box 01 = rnYm2; 02 = 0.05 × 01; 03 = 0.25 × retYm2; 04 = 02 − 03. When rnYm2 ≤ 0, the loss section applies: 0.005 × incomeYm2.
  - Waived when the quarter's `incomeWithRet / income ≥ 0.70`.
  - Due dates: Q1 = `${year}-04-25`, Q2 = `-07-25`, Q3 = `-10-25`, Q4 = `${year+1}-01-31`. Moving dates off weekends is out of scope for v1.

- [ ] **Step 1: Write the failing tests**
  - `Q1 I 15000 G 900: s1 off → 2820; tier .20 → 2256; '15' → 2397`
  - `quarter example: I 12000, G 400, s1 '15' → 1972.00 (toBeCloseTo 2)`
  - `loss quarter → pay 0, boxes.28 = 0`
  - `yearIdx 2, rnYm2 46477.6 → 2323.88/quarter (Σ 9295.5 ≈ 9296)`
  - `≥70% es_company income → regime waived, pay 0`
- [ ] **Steps 2–4.** Commit with `feat: modelo 130 Bizkaia boxes`.

### Task 6: IVA 303/390

**Files:**
- Create: `src/engine/iva.ts`
- Test: `tests/iva.test.ts`

**Interfaces:**
- Produces: `ivaQuarters(ledger): { q, out, in, carryIn, result, status: 'pay'|'zero'|'carry'|'annual390' }[]` and `iva390(...)`: `{ annualResult, refund, due }`.
  - Q1–Q3: a positive result is paid and a negative one is carried forward.
  - Q4 has status `annual390`. The 390 settles the year: if the annual total is negative, that amount is the refund.

- [ ] **Tests:**
  - `es_company only: 1000/mo → each Q pays 630`
  - `non-EU only with €21 IVA expenses/mo → Q1–Q3 carry, 390 refund 252`
  - `Q4 never has status pay`
- [ ] **Steps 2–4.** Commit with `feat: IVA`.

### Task 7: Employment income (pluriactividad)

**Files:**
- Create: `src/engine/employment.ts`
- Test: `tests/employment.test.ts`

**Interfaces:**
- Produces:
  - `employeeSS(grossYear, p): number`, which includes the employee's share of the solidarity contribution.
  - `workRN(grossYear, ss, otherIncome, p): { bonif, rn }`
  - `salaryWithholdingPct(grossYear, nDesc, shortContract, p): number`
  - `pluriRefund(retaCC, rgEmployeeCC, rgEmployerCC, p): number`
  - `employerCost(grossYear, p): number`
  - `equivalentGross(targetNetYear, input, p): number`, found by bisection on salary-only net (gross − SS − CL).

- [ ] **Step 1: Write the failing tests**
  - `pct(20000.00,0)=0; pct(20000.01,0)=7`
  - `€40k: pct 17/16/15 → 6800/6400/6000`
  - `employeeSS(40000) = 2600`
  - `bonif: diff 14800 → 8000; 23000 → 3000; otherIncome 7501 → 3000`
  - `pluriRefund caps at 0.5*retaCC`
  - `shortContract → min 2%`
- [ ] **Steps 2–4.** Commit with `feat: employment income`.

### Task 8: Orchestrator `compute()` and reverse mode

**Files:**
- Create: `src/engine/compute.ts`, `src/engine/warnings.ts`
- Test: `tests/compute.test.ts`, `tests/golden.test.ts`

**Interfaces:**
- Produces: `compute(input: CalcInput): CalcResult`, together with `solveIncomeFor(targetNetMonthly: number, input): number` (bisection on the scale factor of every client month).
```ts
type CalcResult = {
  keptMonthly: number; activeMonths: number; forecastMonths: number
  annual: { income, salaryNet, expenses, reta, irpf: number, prepaid: number, renta: number }  // renta <0 refund
  months: { m, income, salaryNet, expenses, cuota, taxPaid, ivaPaid, net, due: string[] }[]
  q130: Q130[]; iva: ReturnType<typeof ivaQuarters>; iva390: ...
  setAside: { pct: number; ivaMonthly: number }
  firstPayment: { form: '130'|'303'; due: string; amount: number } | null
  nextYear: { keptMonthly: number; tpEnds: string | null; extensionEligible: boolean; m130Fixed: number | null }
  compare: { noTarifaPlanaMonthly: number | null; employeeGross: number; employerCost: number }
  pluri: { refund: number; refundYear: number } | null
  warnings: { id: string; params: Record<string, number|string> }[]   // W1–W18 per spec §7
  provenance: string[]; unverified: string[]
}
```
  - How to compute it:
    1. D = Σ income − Σ expenses − RETA total.
    2. Compute RETA, then IRPF. Prior years are simulated by running the same input for `year-1` and `year-2` when they fall after the alta. That gives `priorD`, `rnYm2`, `incomeYm2` and `retYm2`.
    3. `kept = (income + salaryNet − expenses − reta − cl) / activeMonths`, where `salaryNet = gross − employeeSS`.
    4. `nextYear` = compute for `year + 1` with the same months.

- [ ] **Step 1: Write the failing golden test** (spec §8.1): alta 2026-01, €5,000/mo non-EU, itemized expense €70/mo with no IVA, rent 700, under36, r2 A, s1 off, startup off.
  - year 1: `reta ≈1063, irpf ≈8417, prepaid ≈11619, renta ≈−3202, kept ≈4140`
  - year 2 (input year 2027 using 2026 params, via a test-only override): `reta ≈6547, irpf ≈7802, prepaid ≈10523, renta ≈−2720, kept ≈3734`
  - year 3: `prepaid ≈9296, renta ≈−1493`
- [ ] **Step 2:** further tests:
  - `pluri €40k salary + €2k/mo → warning W14, renta > 0 (W5)`
  - `alta 2026-07 → activeMonths 6, months 0–5 zero`
  - `solveIncomeFor(compute(x).keptMonthly, x) ≈ original income (±1 €)`
  - `any P/? param used → warnings contains W16`
- [ ] **Steps 3–5:** fail, implement, pass. Commit with `feat: compute + golden tests`.

### Task 9: URL fragment state

**Files:**
- Create: `src/state/url.ts`
- Test: `tests/url.test.ts`

**Interfaces:**
- Produces: `encode(input: CalcInput): string` and `decode(hash: string, asOf: string): CalcInput`. The fragment is `#calc=` + base64url of compact JSON, with a version field `v: 1`.
- **Tests:**
  - `round trip equals`
  - `garbage → defaultInput`
  - `v: 99 → defaultInput`
  - `missing fields filled from defaults`
- Commit with `feat: url state`.

### Task 10: Interface (Astro pages, Preact calculator, i18n)

**Files:**
- Create:
  - `src/i18n/uk.json`, `src/i18n/en.json`, `src/i18n/t.ts`
  - `src/pages/index.astro` (redirects to `/uk/`)
  - `src/pages/[lang]/index.astro`, `src/pages/[lang]/how-we-calculate.astro`
  - `src/components/Calculator.tsx`, `Wizard.tsx`, `InputForm.tsx`, `Results.tsx`, `results/*.tsx` (one per spec §6 block)
  - `src/styles/global.css`
- **Interfaces:** consumes `compute`, `encode`/`decode` and `getParams`. `t(lang, key, vars)` returns the string from the JSON files.
- **Pages:**
  - `Calculator` keeps a `CalcInput` in state, recomputes on every change, and writes the URL fragment on every change.
  - The wizard runs first when there is no fragment.
  - The simple/detailed toggle follows spec §3.2–3.3.
  - Results sections follow spec §6, items 1–12.
  - The "How we calculate" page is generated from params: rule, value, source link, status and checked date.
- **Copy:** our own Ukrainian and English text, with the Spanish term in brackets the first time it appears in each block.
- **Theme:** light/dark via `prefers-color-scheme`. Mobile first.
- [ ] **Step 1:** smoke test `tests/i18n.test.ts`: `uk and en have identical key sets`.
- [ ] **Step 2:** implement the pages and components.
- [ ] **Step 3:** `npm run build` succeeds. Then run `npm run dev`, open `/uk/` in the browser, and check three things:
  - the wizard works and the result shows;
  - editing a field changes the headline;
  - reloading with the fragment restores the state.
- [ ] **Step 4:** commit with `feat: UI`.

### Task 11: README and handoff
- `README.md`: what it is, `npm test`, `npm run dev`, how to add `params/2027.json`, the open legal points R2/S1/S2/S3 and where they live.
- Commit with `docs: readme`.
