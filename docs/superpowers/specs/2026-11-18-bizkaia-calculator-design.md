# Bizkaia autónomo calculator: formulas and controls spec (v2)

> 2026-11-18. This is v2. It rewrites v1 so that the product does what **avtonomo.com** does (see `00-reference-avtonomo-com.md`), but with **Bizkaia foral** rules.
> Research files: `01`–`05`, plus `06-trabajo-pluriactividad.md` and `07-modelo-130-casillas.md`.
> Status tags: **[V]** verified in the official text · **[S]** secondary source · **[P]** provisional or projected · **[?]** open, so the engine exposes it as a setting.

## 1. What the product is

**A copy of avtonomo.com for Bizkaia.** It is a free calculator that answers "how much do I keep each month as an autónomo in Bizkaia, and how much do I set aside, for which payment, by when", with the rule behind every number.

**Product decisions:**
- **Own name, brand and copy.** We copy what avtonomo does, not its text or identity. Name: TBD.
- **Interface in Ukrainian and English.** The Spanish term sits next to every concept, for example "щоквартальний аванс податку (modelo 130)".
- **Same privacy model as avtonomo.** The calculation runs in the browser, and inputs live only in the URL fragment `#…`, with no accounts and no cookies. Share link, save as PDF, and restore the last calculation all come from that.
- **Same trust model as avtonomo.** Every parameter has a source, a status and the date it was checked. A public "How we calculate" page lists them. A result that uses a [P] or [?] value shows a warning.
- **Bizkaia only.** There is no region picker. Tax residency in Bizkaia is assumed and not tested.

**Not in the product:** bookkeeping, invoicing and filing (filing requires TicketBAI software and carries liability), and advice. The product shows numbers and rules; decisions stay with the user and their gestor.

**Why it needs to exist:** avtonomo and every other Spanish calculator explicitly exclude the Basque Country, and almost every number there is different:
- the scale;
- the 20/15/10% simplificada reduction instead of 5%/€2,000;
- the start-up reduction (15% for women, 10% for men) instead of art. 32;
- the €1,615 minoración instead of the mínimo personal;
- a non-cumulative 130 that switches regime in year 3;
- no Q4 303;
- payments due on the 25th instead of the 20th;
- a rent deduction for under-36s.

### Scope v1
- The four avtonomo personas: **clients abroad**, **clients in Spain**, **employee + freelance (pluriactividad)**, and **only planning**.
- IRPF on activity income plus employment income.
- Modelo 130, including the box-by-box view.
- IVA 303 and 390 for services.
- RETA: tarifa plana, tramos and regularisation.
- The pluriactividad refund of overpaid contributions.
- Withholding by Spanish clients.
- Currency conversion.
- The filing calendar and threshold warnings.
- Comparisons and the "next year" view.
- Information on cuota subsidies.

### Out of scope v1 (avtonomo also excludes most of these)
- Joint filing.
- Estimación directa normal.
- Goods and retail, recargo de equivalencia.
- Exempt activities and prorrata.
- B2C digital services to EU consumers (OSS).
- Vehicles.
- Investment deductions.
- Working through a company (SL).
- Impatriados (the Beckham equivalent).
- Residency, double taxation and wealth tax.
- TRADE.

---

## 2. Income model: month-by-month, actual and forecast

Each client is a row of 12 months, and each month holds an amount and a currency.
- **Months already past** take what was **actually received** (`actual`).
- **Future months** take the **forecast** (`forecast`). By default the forecast is the average of the actual months so far, or what the user entered in simple mode.
- **Months before the alta** are ignored, with a note.
- **Changing clients:** a client the user lost has zeros from a given month on, and a new client starts in its first month.
- **Entry modes per client:** a monthly amount, an hourly rate × hours × days, or a different amount each month.
- **Uncertainty:** the result says "N of 12 months are forecast". It also shows the set-aside as a % to apply to each payment received, which stays valid when income is uneven, plus a fixed IVA amount.

Why not per invoice: the 130 and 303 settle by quarter, so the date within a quarter doesn't matter. Using a monthly exchange rate instead of a per-invoice rate costs a few euros at most. Per-invoice entry would also push the product towards bookkeeping.

---

## 3. Inputs (controls)

### 3.1 Wizard, step 1: persona
`abroad` (clients abroad) · `spain` (clients in Spain) · `pluri` (job + freelance) · `plan` (only planning). The persona sets the defaults that follow. Every field can be changed later.

### 3.2 Simple mode
| ID | Control | Type and default | Notes |
|---|---|---|---|
| I1 | Income per month, before tax, without IVA | money; EUR/USD/GBP/PLN | ECB rate on the stated date (F1) |
| I2 | Where the clients are | Spanish company/autónomo · private people in Spain · EU company · non-EU company (default for `abroad`) | Drives IVA, withholding and the 130 waiver |
| E0 | Expenses | almost none (0) · about X% (default 5%, no IVA) · itemized | Same as avtonomo |
| P1 | Already an autónomo? | not yet (calculate the first year from the next month) · yes, since month/year | Drives tarifa plana, the 130 regime, 7% withholding and the start-up years |
| H1 | Family | no partner / with partner | With a partner, the per-child deduction is split between the two parents |
| P3 | Under 36 on 31 December? | yes/no | Drives the rent deduction rate. **Bizkaia-specific: in simple mode because it is worth up to €2,800** |
| D1 | Rent you pay for your home (your share), per month | money; 0 = none | Bizkaia rent deduction |
| W1 | (`pluri` only) Gross salary per month | money | = annual contract salary ÷ 12 |

### 3.3 Detailed mode adds
| ID | Control | Notes |
|---|---|---|
| I3 | Several clients, each with name, type, currency and entry mode, by month as actual or forecast (§2) | Max ~10 rows, like avtonomo |
| I4 | (Spanish company) 7% withholding communicated to the client? | Only in years S, S+1, S+2 |
| E1 | Itemized monthly expenses: name, amount, "price includes Spanish IVA" | IVA is recovered via the 303 only if the expense is work-only and has a factura in your name |
| E2 | Supplier is EU or non-EU (SaaS) | Reverse charge, net IVA effect 0. If an EU supplier charged its own VAT, warn |
| K1 | Children living with you: number under 6, number aged 6–30 | **Bizkaia ages differ from avtonomo's <3 / 3–25** (NF art. 79) |
| K2 | Large family (familia numerosa) | In Bizkaia it gives no deduction of its own and no advance payment. It only unlocks the 35% / €2,800 rent rate regardless of age (`06` [V]) |
| P4 | Start-up reduction (art. 25.5): claim? Sex for the rate (15% W / 10% M) | Exclusions: the same activity group before (including abroad, e.g. a closed ФОП in IT), or >50% of income from last year's employer. Default **off** |
| P6 | Last year's income − expenses (D) | Blank in year 1 → 20% tier [?] |
| D1b | Lease signed or extended from 1 Jan 2026? | Yes means the €68k cap applies |
| D3 | EPSV / pension contributions per year | Cap €5,000 |
| W2 | (`pluri`) IRPF withheld per month on the payslip | Default = estimate from the Bizkaia table (F9.3). Asking for the real figure from the payslip is better |
| W3 | (`pluri`) Contract shorter than one year? | Minimum withholding 2% |
| R1 | RETA base per month | Default = minimum of the forecast tramo |
| — | Settings (§3.4) | Collapsed by default |

### 3.4 Settings: open legal points, shown rather than hidden
| ID | Setting | Default | Why it is a setting |
|---|---|---|---|
| R2 | Which income figure Social Security uses | **Reading A** (before the 20/15/10%) | The Bizkaia wording is ambiguous [?] |
| S1 | Apply the simplificada % inside the 130 | **No** (law text) | The form and the instructions have no box for it, and box 09 reads "ingresos − gastos deducibles" (`07`). Gestorías apply 15%, which matches no tier. Still open [?]. Options: off / tier % (20/15/10) / 15% |
| S2 | Apply the % reduction when D < 0 | No | The text is ambiguous [?] |
| S3 | How the start year is annualised for the year-3 130 | By days | The method is not specified [?] |
| S4 | 2027 parameters | 2026 values flagged [P] | Not yet published |

### 3.5 Reverse mode
"I want to keep €X a month" → the engine solves for I1, with every other input unchanged. It is a monotonic bisection on F10.

---

## 4. Parameters (versioned data: `params/2026.json` …, each with `source`, `status`, `checked`)

| Key | 2026 | 2027 | Source |
|---|---|---|---|
| IRPF general scale | 0 / 18,080 / 36,160 / 54,240 / 77,450 / 107,260 / 142,960 / 208,390 at 23/28/35/40/45/46/47/49% | = 2026 [P] | NF 7/2025 art. 49 [V] |
| Minoración | 1,615 | [P] | NF art. 77 [V] |
| Simplificada tiers | ≤35k 20% · ≤85k 15% · >85k 10% (by prior-year D) | same | NF art. 28.1.b [V] |
| Start-up reduction | 15% W / 10% M | same | NF art. 25.5 [V] |
| Descendants 1st…5th / extra for <6 | 682 / 844 / 1,421 / 1,680 / 2,195 / +394 | [P] | NF 7/2025 art. 51 [V] |
| Rent deduction | 20% up to 1,600 · 35% up to 2,800 (<36 or large family) · lost if BL > 68,000 (lease from 2026) | same | NF art. 86, 86.8 [V] |
| EPSV cap | 5,000 | same | NF art. 71.1.a [V] |
| Work bonificación | 8,000 → 3,000 (14,800 / 23,000; slope 0.6098); forced to 3,000 if other income > 7,500 | same | NF art. 23 [V] |
| Work deductible expenses | employee SS contributions (+ party contributions) only | same | NF art. 22 [V] |
| RG employee rate | 6.50% (indefinite contract) | MEI changes [P] | Orden PJC/297/2026 [V] (`06`) |
| RG employer rate | 30.65% + AT/EP 1.50% (office work) = 32.15% | [P] | Orden PJC/297/2026 [V] |
| RG bases (monthly) | max 5,101.20; min 1,424.40–1,989.30 by group | [P] | Orden PJC/297/2026 [V] |
| Solidarity contribution above the max base | 1.15 / 1.25 / 1.46% by band | 1.38 / 1.50 / 1.75% [V by law] | RDL 3/2026 [V] |
| Salary withholding | Table: % by gross annual pay × number of descendants, applied to all of gross pay; 0% up to €20,000, 7% from €20,000.01 (single), 40% top band; minimum 2% for contracts < 1 year | 2027 table [?] | DF 134/2025 (BOB 30/12/2025); RIRPF 87–88 [V] |
| 130 rates | 20% of the quarter (S, S+1) · 5% × RN(Y−2) per quarter after that · 0.5% of revenue if RN ≤ 0 | same | RIRPF art. 110 [V] |
| 130 waiver | ≥70% of income with withholding (professionals) | same | RIRPF art. 109 [V] |
| Withholding | 15% · 7% in S, S+1, S+2 | same | RIRPF art. 94 [V] |
| IVA | 21% | same | NFIVA 90 [V] |
| RETA rate | 31.5% | 31.6% [P] | Orden PJC/297/2026 [V] |
| RETA tramos | 15 rows (see 04 §1) | = 2026 [P] | Orden PJC/297/2026 art. 18 [V] |
| Tarifa plana | 80 + MEI = 88.56 | 89.51 [P] | LETA 38 ter [V]; €80 basis [?] |
| Pluriactividad refund | 50% of the CC excess over 17,323.68, capped at 50% of RETA CC | [P] | LGSS 313; Orden 2026 art. 18.8 [V] |
| SMI | 17,094 | [P] | RD 126/2026 [S] |
| SS generic deduction | 7% | same | LGSS 308.1.c [V] |
| Late payment | recargo 5% (0.5% if paid within 3 business days) → 20%; interest 4.0625% | [P] | NFGT arts. 26, 28 [V] |
| Deadlines | 1–25 Apr/Jul/Oct, 1–31 Jan; Renta ~15 Apr–30 Jun; 2nd instalment by 10 Nov | yearly | RIRPF 111; RIRPF 76 [V] |

---

## 5. Formulas (pure functions; € values rounded to cents at the end)

Notation: Y = tax year, S = start year, q = quarter, m = month, D = activity income − activity expenses.

### F1 Currency
```
base_eur_m = amount_m / ECB_rate(date)        # date: shown to the user, like avtonomo. NFIVA 79.Once says BdE [?]
```

### F2 Client treatment (per client)
```
Spanish company/autónomo -> IVA 21 % (303 boxes 07/08); retención 15 % (7 % if I4 and Y in S..S+2)
Spanish private          -> IVA 21 %; no retención
EU company with VAT no.  -> no IVA, box 105, modelo 349 key S
non-EU company           -> no IVA, box 106
retención_m = base_eur_m * rate                 # prepayment, credited in Renta
```

### F3 Expenses
```
E0 = X % mode: gastos_m = X % * income_m, no IVA
E1 itemized: irpf_expense = base (+ IVA if not deductible); iva_deductible = IVA if work-only & factura
gastos_Y = Σ expenses + RETA cuotas paid in Y
```

### F4 RETA (unchanged from v1)
```
tarifa plana: alta month + 12 full months at 80 + MEI·950.98; extension if forecast rend_SS·0.93 < SMI
then: cuota_m = R1_base * rate; R1 default = min base of the tramo(rend_SS)
rend_SS = (D if R2==A else D·(1−p)) + RETA cuotas      # iterative, cuotas are inside D
regularisation of Y ≈ Jan–Apr Y+2 (difference to the min/max of the real tramo)
pluriactividad: no RETA reduction (old art. 31 LETA repealed); refund (F9.4)
```

### F5 IRPF activity income
```
p  = tier(D_{Y−1})  (Y==S → 20 % [?])
RN_act = D·(1−p) if D>0 else D (S2); start-up: RN_act ·= (1 − 15|10 %) if P4
# activity losses do not offset work income (art. 65.b)
```

### F9 Employment income (pluriactividad) (parameters: `06`)
```
F9.1 employee_SS_Y = Σ_m min(max(gross_m, base_min), base_max) * 6.50 %   # + solidarity share on the part above base_max
F9.2 RN_trab = max(0, gross_Y − employee_SS_Y − bonif)                               # art. 22–23
     bonif: 0 if diff≤0; 3,000 if other income in BI > 7,500; 8,000 / taper / 3,000
F9.3 salary_withheld_Y = W2·12 if given, else table_pct(gross_Y, n_descendants) · gross_Y   # DF 134/2025 table lookup
     # the table ignores activity income → under-withholding is normal in pluri (W5); thresholds are cliffs on the whole salary
     # example €40k gross: 17 / 16 / 15 % (0/1/2 children) = €6,800 / 6,400 / 6,000
     # a teleworker is withheld under the rules of the workplace they're assigned to (Concierto art. 7): a Madrid employer → AEAT tables (note, not computed)
F9.6 employee comparison: solve gross G such that net_employee(G) = kept_avg (autónomo)
     employer_cost = G + G·32.15 % (capped at the max base) + solidarity
F9.4 pluri_refund (paid ~4 months after the RETA regularisation, i.e. Y+2):
     cc_total = RETA CC + RG employee CC + RG employer CC
     refund = min(0.5·max(0, cc_total − 17,323.68), 0.5·RETA_CC)
F9.5 net salary per month = gross_m − employee_SS_m − salary_withheld_m
```

### F6 IRPF annual (Renta Y, paid Apr–Jun Y+1)
```
BI  = RN_act⁺ + RN_trab            # RN_act<0 → ring-fenced, carried forward
BL  = max(0, BI − min(EPSV, 5000, BI))
CI  = max(0, scale(BL) − 1,615)
ded = descendants(K1, split if H1=partner) + rent(D1, P3/K2, D1b, BL) + disability
CL  = max(0, CI − ded)
renta = CL − Σ130 − Σretención_clients − salary_withheld_Y     # >0 pay (60 % June + 40 % by 10 Nov), <0 refund
```

### F7 Modelo 130
```
waiver: professional & share of activity income with retención ≥ 70 % → "no 130 needed"
Y ∈ {S, S+1}: pago_q = max(0, 20 %·(I_q − G_q)·(1 − (p if S1)) − ret_q)   # non-cumulative
Y ≥ S+2:      pago_q = max(0, 5 %·RN_{Y−2} (0.5 %·ingresos_{Y−2} if RN≤0) − 25 %·ret_{Y−2})
# employment income never enters the 130
box-by-box view (Bizkaia form, OF 636/2014, BOB 57 of 24-03-2014; 2018 design) [V] (`07`):
  start years S, S+1:  09 = I_q − G_q (quarter only)  ·  10 = 20 % × 09  ·  11 = withholdings for the quarter (100 %)  ·  12 = 10 − 11
  general 5 %:         01 = RN_{Y−2}  ·  02 = 5 % × 01  ·  03 = 25 % of withholdings for Y−2  ·  04 = 02 − 03
  RN_{Y−2} ≤ 0:        section 15–20 (0.5 % of revenue for Y−2)
  28 = sum of the section results; ≤ 0 → file as "declaración negativa" (no refund, no carry-forward)
  sections 05–08 (agriculture): out of scope
  no boxes for earlier quarters, losses or deductions; the simplificada % has no box (S1 decides whether it reduces 09)
  example Q1: I 15,000, G 900 → 09 = 14,100 → 28 = 2,820 (S1 off) · 2,256 (S1 at 20 %) · 2,397 (S1 at 15 %, gestoría practice)
  payment: domiciliación or carta de pago
```

### F8 IVA
```
Q1–Q3: res_q = IVA_out − IVA_in − carry; >0 pay by the 25th; <0 carry forward
Q4: no 303 → modelo 390 (1–31 Jan): annual result; refund requested here
per-quarter status: to pay / file with zeros / carry forward / refunded after the year (avtonomo vocabulary)
```

### F10 Headline outputs
```
net_month_m = income_m + net_salary_m − expenses_m − cuota_m − tax_paid_in_m − iva_net_paid_m
              # cash view: tax_paid_in_m = 130 in Apr/Jul/Oct/Jan months, like avtonomo's calendar
kept_avg    = (Σ income + Σ net salary − expenses − RETA − CL ± RETA regularisation) / active months
                # the economic view: annual true cost, not the payments made
set_aside_pct = (CL − salary_withheld + RETA_after_tarifa) / Σ activity income  # "X % for tax"; + IVA collected as €
first_payment = first 130 (or 303) after the alta, with its date
```

---

## 6. Outputs (screen by screen, same as avtonomo, with Bizkaia additions marked ★)

1. **Headline:** "In {year} you keep €X a month". Then what tax, cuota and expenses take, and the refund or payment in spring.
2. **Breakdown table** (month or year view): income · salary (pluri) · expenses · cuota · IRPF · what you keep. It states the cuota regime.
3. **Year calendar** (by month, by quarter, or full year), with stamps on months where something is due: 130, 303, ★390 in January, RETA, the Renta instalments, the RETA regularisation in Y+2, and the ★pluriactividad refund.
4. **Next payment** and the **first payment after the alta**.
5. **Modelo 130 box by box** for the chosen quarter, on the ★Bizkaia form (boxes 09–12 in the start years, 01–04 later, 28 the total), or "no 130 needed". ★When Y ≥ S+2, it explains "your 130 is now fixed at 5% of your {Y−2} income".
6. **IVA per quarter**, ★with Q4 shown as "goes into the annual 390".
7. **Set aside from every payment:** "X% for tax + €Y IVA". ★"N of 12 months are forecast".
8. **Prepayments vs the annual return:** ★the 130 usually overpays in Bizkaia, which is the lead insight (see §8).
9. **Comparisons:** tarifa plana vs none · autónomo vs the gross salary as an employee that leaves the same amount, plus its employer cost (F9.6). The Beckham card is dropped (out of scope).
10. **Next year:** what you keep once the tarifa plana ends · extension when profit < SMI · ★the year-3 switch of the 130 · RETA regularisation note.
11. **Subsidies (information only, never subtracted):** Lanbide consolidation, DFB Fomento de Iniciativas Emprendedoras, and SPRI Ekintzaile, each with conditions, amount and window. The data comes from `04 §ayudas`, and every entry carries an "is the call currently open" date.
12. **Warnings and chips** (§7) and the "rules checked on {date}" line.

---

## 7. Checks and warnings

| ID | Trigger | Message (gist) | Rule |
|---|---|---|---|
| W1 | D within €3k of 35,000 / 85,000 | "€X more profit moves next year to the 15% (10%) tier" | art. 28.1.b |
| W2 | BL within €3k of 68,000 and lease from 2026 | "Above €68k you lose the rent deduction; an EPSV of €X keeps you under" | art. 86.8, 71 |
| W3 | Y == S+2, or the view crosses it | "Your 130 is now fixed at €X per quarter" | RIRPF 110 |
| W4 | Σ130 − CL > €1,000 | "Prepayments exceed the tax by €X; refund ~June–July" | — |
| W5 | CL − prepayments > €1,000 | "Renta bill ~€X in June; 40% can wait until 10 Nov" (common for pluri: salary withholding ignores the freelance income) | RIRPF 76.5 |
| W6 | RETA base below the tramo minimum | "Regularisation bill ~€X around Jan–Apr Y+2; change your base by {date}" | LGSS 308 |
| W7 | Tarifa plana ends within 3 months | "From {date}, RETA ~€X/month" | LETA 38 ter |
| W8 | rend_SS < SMI and tarifa plana ending | "You can ask for 12 more months" | LETA 38 ter.2 |
| W9 | EU client without a VAT number | "Taxed as a private client (21%)" | NFIVA 69 |
| W10 | EU supplier charged its own VAT | "Not deductible; give the supplier your ROI number" | NFIVA |
| W11 | Spanish company client, withholding 0 | "It must withhold 15% (7%)" | RIRPF 94 |
| W12 | ≥70% of income with withholding | "No 130 this quarter" | RIRPF 109 |
| W13 | A deadline is ≤10 days away | Form, amount, date | calendar |
| W14 | Pluri: other income > €7,500 | "Your work bonificación drops to €3,000" | NF art. 23.2 |
| W15 | Pluri: total CC over the cap | "Social Security refunds ~€X around {date}" | LGSS 313 |
| W16 | Any [P]/[?] value is used | Badge plus a link to the rule and the setting | — |
| W17 | Start-up reduction claimed | Repeat the exclusions | art. 25.5 |
| W18 | Months before the alta | "Not counted" | — |

---

## 8. Golden tests

1. **`abroad`, the v1 planning example** (2026 parameters; €5,000/month non-EU B2B; alta 1 Jan; under 36; rent €700/month; expenses €840/yr; reading A; no start-up reduction):

   | Year | RETA | IRPF (CL) | 130 paid | Renta | Kept/month |
   |---|---|---|---|---|---|
   | 1 | 1,063 | 8,417 | 11,619 | −3,202 | 4,140 |
   | 2 | 6,547 | 7,802 | 10,523 | −2,720 | 3,734 |
   | 3 | 6,547 | 7,802 | 9,296 | −1,493 | 3,734 |

2. **Quarter example with S1 at 15%:** 20% × (12,000 − 400) × 0.85 = **€1,972.00**.
3. **RETA:** tarifa plana €88.56; tramo 12 cuota €607.35.
4. **`pluri` withholding:** gross salary €40k with 0 / 1 / 2 children → withheld €6,800 / 6,400 / 6,000; Renta on salary alone +€313 / +€31 / −€413 (`06`). Full pluri case: €40k salary + €2k/month freelance, bonificación forced to €3,000. The numbers are produced by the engine and checked by hand.
5. Spot checks of the scale at the bracket edges, and reverse mode as a round trip of F10.

## 9. Open items that change numbers
1. R2: the Social Security income figure. 2. S1: the simplificada % in the 130 (not settled by the form, see `07`). 3. The first-year 20% tier. 4. 2027 parameters. 5. S2. 6. S3. 7. The ECB vs BdE rate. 8. The 2027 salary-withholding table and SS bases are not published. Tax treatment of the RETA refund (F9.4) is unconfirmed. Withholding for a teleworker with a non-Bizkaia employer is not computed.
Items 1–3 are worth a consulta or a question to a gestoría before launch.

## 10. Engine requirements
- Pure, deterministic functions.
- Parameters as versioned data with `source`, `status` and `checked` (date).
- Each output carries the rule and parameter IDs it used, which feeds the "How we calculated it" panel and W16.
- State serialises into the URL fragment, so there is no server storage.
- Interface strings in UK and EN, with the Spanish term alongside.
- Golden tests per §8.
