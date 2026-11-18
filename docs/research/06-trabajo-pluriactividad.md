# 06 — Employment income in pluriactividad: Bizkaia payroll withholding, Régimen General contributions, familia numerosa, Renta interactions

> Researched 2026-11-18 for the Bizkaia autónomo calculator. **Foral rules only** for IRPF (NF 13/2013 "NF", DF 47/2014 "RIRPF"). Social Security is state law (LGSS, annual Orden de cotización) and is the same in Bizkaia.
> Status legend: **[V]** read in the official text · **[S]** secondary source only · **[?]** unconfirmed.
> Not repeated here (see `01-irpf.md` §4 and §6, and `04-reta-ayudas.md`): art. 22 expenses, art. 23 bonificación and the €7,500 rule, the 2026 scale, the €1,615 minoración, family deductions, RETA rates and the LGSS art. 313 pluriactividad refund.

## Sources used

| Code | Source | Status |
|---|---|---|
| **DF 134/2025** | Decreto Foral 134/2025, de 29 de diciembre, porcentajes de retención 2026, BOB núm. 248, 30/12/2025 (cve BOB-2025a248-(I-1405)) — https://www.bizkaia.eus/lehendakaritza/Bao_bob/2025/12/30/I-1405_cas.pdf | [V] full PDF read |
| **RIRPF** | DF 47/2014, Reglamento IRPF Bizkaia, consolidated "última modificación normativa 23/03/2026" (bizkaia.eus `ca_47_2014.pdf`), arts. 73 bis, 87, 88, 107 | [V] |
| bizkaia.eus retention page | https://www.bizkaia.eus/es/normativa-tributaria/retenciones-de-trabajo — 2026 table, years listed up to **2026** (no 2027 tab) on 2026-11-18 | [V] |
| **NF** | NF 13/2013 consolidated to 01/01/2026 (a local copy of the consolidated text), arts. 17, 18, 71, 86, 87, 91 bis, 102, DA 44ª | [V] |
| **Orden 2026** | Orden PJC/297/2026, de 30 de marzo, BOE-A-2026-7296 — https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-7296 (in force 01/04/2026, effects 01/01/2026), arts. 1–4, 10, 16, 17, 33 | [V] |
| **RDL 3/2026** | RDL 3/2026, de 3 de febrero, art. 3 (maximum base €5,101.20). Read only as cited by Orden 2026 art. 2.1 | [V] via the Orden |
| **LGSS** | RDLeg 8/2015 consolidated — https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724 — arts. 19 bis, 127 bis, DT 38ª, 42ª, 43ª, DA 61ª (AT/EP premium table) | [V] |
| **Concierto** | Ley 12/2002, Concierto Económico, consolidated — https://www.boe.es/buscar/act.php?id=BOE-A-2002-9969 — arts. 6, 7, 12 | [V] |
| NF 4/2026 | NF 4/2026, de 21 de octubre (unidad familiar changes, BOB 02/11/2026, effects 2025) — summary at https://www.fiscal-impuestos.com/node/42003 | [S] |

---

## Summary

- **Bizkaia payroll withholding is a single lookup.** There is no AEAT-style "cuota de retención" algorithm. % = table(**gross** expected annual pay, number of descendants) → applied to **gross** pay (RIRPF arts. 87.1.a and 88). Employee SS, the bonificación and the minoración are not computed explicitly; they are built into the table. 2026: **0 % up to €20,000** (all columns), **7 %** from €20,000.01 (single), up to **40 %** above €236,060. No 2027 table had been published as of 2026-11-18.
- **Minimums:** 2 % for contracts shorter than 1 year; 15 % for special dependent employment relationships; 35 % flat for company directors (RIRPF 87.1.b, 88.2.4º) [V]. **There is no catch-up regularisation.** A change in pay triggers a new % that applies **only from that date** (88.2.3º) [V].
- **Régimen General 2026, indefinite contract:** employee **6.50 %** (CC 4.70 + desempleo 1.55 + FP 0.10 + MEI 0.15). Employer **30.65 % + AT/EP** (CC 23.60 + desempleo 5.50 + FOGASA 0.20 + FP 0.60 + MEI 0.75). Office AT/EP = **1.50 %** → employer **32.15 %**. Base max **€5,101.20/month** (€61,214.40/yr). Base min €1,424.40 (groups 4–7) up to €1,989.30 (group 1). Solidarity contribution above the max: **1.15 / 1.25 / 1.46 %** (employee share 0.19 / 0.21 / 0.24) [V].
- **Familia numerosa:** Bizkaia has **no specific deduction and no abono anticipado** (no equivalent of art. 81 bis LIRPF). It only unlocks the enhanced housing rates: rent 35 % with a €2,800 cap (art. 86.2.a), and purchase 23 % with a €1,955 cap (art. 87.4) [V]. The descendant deduction simply grows by birth order.
- **Pluriactividad and the Renta:** the payroll table ignores activity income, so it **under-withholds** in two ways: through the 0 % band and through the bonificación falling to €3,000 (€7,500 rule). The fix is to ask the employer in writing for a higher % (RIRPF 107.4) or to rely on the Modelo 130. Employer EPSV contributions are in-kind work income, stay out of the withholding base up to €10,000, and reduce the base under art. 71.1.b (€8,000; joint cap €10,000 with the autónomo €4,000 bucket).

---

## 1. Bizkaia withholding on salaries (2026)

### 1.1 Plain explanation

The employer estimates what the worker will **normally earn in the calendar year**: fixed plus foreseeable variable pay, cash plus in-kind (88.2.2º). It reads off a % from the art. 88.1 table, using the column for the number of descendants that qualify for the art. 79 NF deduction, and applies that % to every **gross** payment. The worker's SS contributions are **not** subtracted first. Only employer contributions to EPSV and pension plans (and a few RETA items paid by cooperatives or mutuas) are taken out of the base (87.4) [V].

The family situation is the one on **1 January**, or on the start date of the contract (88.2.1º). Descendants who turn more than 30 during the year are left out, unless they give right to the disability deduction (art. 82). The worker must tell the payer the number of descendants, any court-ordered compensatory pension, disability, and any opt-in to the impatriate regime or art. 92.2. If the worker does not, the payer uses column 0 (RIRPF 107.1–2) [V]. The table does **not** depend on ascendants, the spouse's income, or joint vs individual filing.

### 1.2 Formula

```
# RIRPF arts. 87–88, DF 134/2025 (effects 01/01/2026)
base_pct  = expected_gross_annual_cash + expected_in_kind            # 88.2.2º
          - employer_EPSV_contrib (≤ 10_000) - employer_pension_plan_contrib   # 87.4.a–b
          [- court-ordered pensión compensatoria, only on an indefinite contract, from the year after it is set]  # 88.3.4º
          # art. 19/20 irregular income enters at its integration % (60 %/...)                # 88.2.2º
n_desc    = descendants giving the art. 79 deduction on 1 Jan (or contract start); excluded if they turn > 30 that year
            unless they give the art. 82 deduction                                               # 88.2.1º
            column "Más" = 6 or more
pct       = TABLE_2026[bracket(base_pct)][min(n_desc, 6)]                                        # 88.1
if disability_33_65:                     pct -= RED_A[bracket]                                  # 88.4.a
if disability_33_65_reduced_mobility or disability_>=65: pct -= RED_BC[bracket]                 # 88.4.b/c
pct = max(pct, 0)            # floor at 0 (guiafiscal: "no puede bajar de cero" [S]; implicit in the text)
if contract_shorter_than_1_year:    pct = max(pct, 2)                                           # 88.2.4º
if relación laboral especial dependiente (not prisoners / disability special relationship): pct = max(pct, 15)
if director / board member pay:     pct = 35                                                     # 87.1.b
if impatriate regime (art. 56 bis) on request: pct *= 0.70;  if art. 92.2 on request: pct *= 0.50  # 87.5
pct = max(pct, pct_requested_by_worker)                                                          # 107.4 (written request)
retencion_mes = pct/100 * gross_payment_mes            # applies to ALL pay, cash + in-kind (87.3, 88.2.3º)
```

**Brackets are cliffs, not marginal rates.** Crossing a threshold applies the higher % to the whole salary. For example, €20,000.00 → €0, but €20,000.01 → 7 % = €1,400.

**Changes during the year (88.2.3º):** when pay changes, the payer calculates a new % from the new expected annual amount and applies it **only from that date**. Unlike common Spain (RD 439/2007 art. 87.5), the % is **not** raised to recover under-withholding from earlier months. If a contract shorter than one year is extended, or the worker returns to the same employer in the same year, the new % uses past plus expected pay for the calendar year.

### 1.3 Table — art. 88.1 RIRPF (DF 134/2025), 2026 [V]

Gross annual pay (€) × number of descendants → retention %.

| From | To | 0 | 1 | 2 | 3 | 4 | 5 | 6+ |
|---|---|---|---|---|---|---|---|---|
| 0.00 | 20,000.00 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 20,000.01 | 20,510.00 | 7 | 5 | 3 | 0 | 0 | 0 | 0 |
| 20,510.01 | 21,300.00 | 8 | 6 | 4 | 1 | 0 | 0 | 0 |
| 21,300.01 | 22,150.00 | 9 | 7 | 5 | 2 | 0 | 0 | 0 |
| 22,150.01 | 23,220.00 | 10 | 9 | 7 | 4 | 0 | 0 | 0 |
| 23,220.01 | 24,050.00 | 11 | 10 | 8 | 5 | 1 | 0 | 0 |
| 24,050.01 | 25,410.00 | 12 | 11 | 9 | 6 | 3 | 0 | 0 |
| 25,410.01 | 27,440.00 | 13 | 12 | 10 | 7 | 4 | 0 | 0 |
| 27,440.01 | 29,790.00 | 14 | 13 | 11 | 9 | 6 | 2 | 0 |
| 29,790.01 | 32,610.00 | 15 | 14 | 13 | 10 | 8 | 4 | 0 |
| 32,610.01 | 36,350.00 | 16 | 15 | 14 | 12 | 9 | 6 | 0 |
| 36,350.01 | 40,670.00 | 17 | 16 | 15 | 13 | 11 | 8 | 0 |
| 40,670.01 | 44,560.00 | 18 | 17 | 16 | 15 | 13 | 10 | 2 |
| 44,560.01 | 48,060.00 | 19 | 18 | 17 | 16 | 14 | 12 | 4 |
| 48,060.01 | 52,020.00 | 20 | 19 | 18 | 17 | 15 | 13 | 7 |
| 52,020.01 | 56,780.00 | 21 | 20 | 20 | 18 | 17 | 15 | 9 |
| 56,780.01 | 61,820.00 | 22 | 21 | 21 | 20 | 18 | 16 | 11 |
| 61,820.01 | 65,710.00 | 23 | 22 | 22 | 21 | 19 | 18 | 12 |
| 65,710.01 | 70,080.00 | 24 | 23 | 23 | 22 | 21 | 19 | 14 |
| 70,080.01 | 75,020.00 | 25 | 25 | 24 | 23 | 22 | 20 | 16 |
| 75,020.01 | 80,730.00 | 26 | 26 | 25 | 24 | 23 | 22 | 17 |
| 80,730.01 | 86,770.00 | 27 | 27 | 26 | 25 | 24 | 23 | 19 |
| 86,770.01 | 92,190.00 | 28 | 28 | 27 | 26 | 25 | 24 | 21 |
| 92,190.01 | 98,350.00 | 29 | 29 | 28 | 27 | 27 | 25 | 22 |
| 98,350.01 | 105,380.00 | 30 | 30 | 29 | 29 | 28 | 27 | 23 |
| 105,380.01 | 113,180.00 | 31 | 31 | 30 | 30 | 29 | 28 | 25 |
| 113,180.01 | 122,030.00 | 32 | 32 | 31 | 31 | 30 | 29 | 26 |
| 122,030.01 | 132,200.00 | 33 | 33 | 32 | 32 | 31 | 30 | 28 |
| 132,200.01 | 144,140.00 | 34 | 34 | 33 | 33 | 32 | 32 | 29 |
| 144,140.01 | 157,300.00 | 35 | 35 | 34 | 34 | 33 | 33 | 31 |
| 157,300.01 | 172,280.00 | 36 | 36 | 36 | 35 | 35 | 34 | 32 |
| 172,280.01 | 190,410.00 | 37 | 37 | 37 | 36 | 36 | 35 | 33 |
| 190,410.01 | 212,820.00 | 38 | 38 | 38 | 37 | 37 | 36 | 35 |
| 212,820.01 | 236,060.00 | 39 | 39 | 39 | 38 | 38 | 37 | 36 |
| 236,060.01 | — | 40 | 40 | 40 | 39 | 39 | 39 | 37 |

**Disability reductions (art. 88.4, DF 134/2025), in points subtracted [V]:**

| From | To | 4.a (33–65 %) | 4.b/4.c (33–65 % + reduced mobility, or ≥ 65 %) |
|---|---|---|---|
| 0.00 | 25,410.00 | 9 | 12 |
| 25,410.01 | 32,610.00 | 7 | 12 |
| 32,610.01 | 48,060.00 | 6 | 10 |
| 48,060.01 | 56,780.00 | 5 | 10 |
| 56,780.01 | 80,730.00 | 4 | 8 |
| 80,730.01 | 122,030.00 | 3 | 6 |
| 122,030.01 | 190,410.00 | 2 | 5 |
| 190,410.01 | — | 1 | 3 |

### 1.4 Parameters

| Parameter | 2026 | 2027 | Source | Status |
|---|---|---|---|---|
| Retention table | above (DF 134/2025, in force 01/01/2026) | **not published** (bizkaia.eus lists up to 2026; guiafiscal.es found no 2027 decree as of 13/11/2026). It usually appears around 30 December | DF 134/2025 DF 2ª; bizkaia.eus page | [V] / [S] for 2027 |
| Why it changed | Tracks NF 7/2025's 2 % deflation of the scale, minoración and family deductions | expected 3 % foral deflation (see `01-irpf.md` §3.2) | DF 134/2025 preamble | [V] |
| Minimum %, contract < 1 year | 2 % | | RIRPF 88.2.4º | [V] |
| Minimum %, special dependent employment relationship | 15 % | | RIRPF 88.2.4º | [V] |
| Directors / board members | 35 % | | RIRPF 87.1.b | [V] |
| Employer EPSV contributions excluded from the base | up to €10,000 | | RIRPF 87.4.a | [V] |
| Deadline for telling the payer your data | before 1 Jan or at contract start; carries over until it changes | | RIRPF 107.3 | [V] |
| Voluntary higher % | any time, in writing; binding to year-end and later years until revoked | | RIRPF 107.4 | [V] |

### 1.5 Worked example (2026, indefinite office contract, 12 equal payments, no EPSV, work income only)

Gross **€40,000**, so table row 36,350.01–40,670.00:

| | 0 children | 1 child (≥ 6) | 2 children (≥ 6) |
|---|---|---|---|
| Retention % | 17 | 16 | 15 |
| **Withheld in the year** | **€6,800** | **€6,400** | **€6,000** |
| Check vs Renta: employee SS 6.50 % | 2,600 | 2,600 | 2,600 |
| RI − G = 37,400 → bonificación (> 23,000) | 3,000 | 3,000 | 3,000 |
| RN_trab = base liquidable | 34,400 | 34,400 | 34,400 |
| Scale: 4,158.40 + (34,400 − 18,080) × 28 % | 8,728.00 | 8,728.00 | 8,728.00 |
| − minoración 1,615 | 7,113.00 | 7,113.00 | 7,113.00 |
| − descendants (682; 682 + 844) | — | 6,431.00 | 5,587.00 |
| **Renta result (CL − retention)** | **+313 to pay** | **+31 to pay** | **−413 refund** |

Other check points (same assumptions, single, no children): €25,000 → 12 % = €3,000 withheld vs cuota €3,186 (+186). €70,000 → 24 % = €16,800 vs €17,439 (+639; SS is capped at the max base, plus €17 of solidarity). €20,000.00 → 0 % vs cuota €1,393. A work-only earner at ≤ €20,000 is not obliged to file (NF 102.2.a), so the 0 % is final for them, but **not** for a pluriactive autónoma (§4.1).

A child under 6 adds €394 to the deduction in the Renta, but the payroll table ignores age: the Renta refund gets bigger.

### 1.6 Edge cases

- **Which administration's table applies (Concierto art. 7.Uno.a)** [V]. The territory where the work is done decides, not the worker's residence. With **teletrabajo**, or work across territorio común and País Vasco, it is the **centro de trabajo the worker is assigned to**. A Bizkaia resident teleworking for a Madrid-assigned contract gets **AEAT-rule** withholding, paid to the AEAT. It still counts in the foral Renta (Concierto art. 12: "tendrán validez los pagos a cuenta que se hayan realizado en uno y otro territorio"). The calculator should offer a "workplace outside País Vasco → common-Spain withholding" toggle, or just warn.
- **Foreign employer with no establishment in Spain**: it has no obligation to withhold (RIRPF art. 83 lists Spanish entities and PEs) [?]. Then the IRPF is all settled in the Renta and the 130 does not cover work income.
- **Two employers (pluriempleo)**: each applies the table to its own pay only, so withholding comes out **low** (two salaries of €20k each → 0 % each; €40k total). Bizkaia has **no "second payer" rule** in the filing obligation (the threshold is €20,000 whatever the number of payers: NF 102.2.a, RIRPF 73 bis) [V]. This is different from LIRPF 96.3.
- **Pay rise mid-year**: the new % applies only from then (88.2.3º). The year's total withholding is the sum of each month's pay × the % then in force.
- **Extra payments (pagas extra)**: they do not change the %. The table uses the annual figure.

---

## 2. Régimen General contribution rates 2026

### 2.1 Formula

```
# Orden PJC/297/2026 arts. 1–4, 16, 17, 33; monthly, with extra payments prorated (art. 1.1 Segunda)
rem_m   = (annual_gross_computable) / 12                                   # 14 payments → prorated
base_cc = clamp(rem_m, BASE_MIN[grupo], 5_101.20)                         # art. 3 (CC)
base_at = clamp(rem_m, 1_424.40, 5_101.20)                                 # art. 2 (AT/EP; also desempleo, FOGASA, FP: art. 33.1)

emp_m   = base_cc * (4.70 + 0.15)%  + base_at * (1.55 + 0.10)%            # CC + MEI ; desempleo + FP
          + solidarity_employee(rem_m)
er_m    = base_cc * (23.60 + 0.75)% + base_at * (5.50 + 0.20 + 0.60 + AT_EP)% + solidarity_employer(rem_m)

excess  = max(0, rem_m - 5_101.20)                                         # art. 17 / LGSS 19 bis
band1   = min(excess, 510.12)                                              # 5,101.21 … 5,611.32
band2   = min(max(excess - 510.12, 0), 2_040.48)                           # 5,611.33 … 7,651.80
band3   = max(excess - 2_550.60, 0)                                        # > 7,651.80
solidarity_employee = band1*0.19% + band2*0.21% + band3*0.24%
solidarity_employer = band1*0.96% + band2*1.04% + band3*1.22%

# Annual shortcut, salary between min and max (most cases), indefinite contract, office:
employee_SS  = 0.0650 * gross
employer_SS  = 0.3215 * gross                  # 30.65 % + 1.50 % AT/EP
employer_cost = gross + employer_SS            # "coste empresa"
# above the max: rates apply to 61,214.40, plus solidarity on the excess
```

### 2.2 Parameters (2026) [V unless marked]

| Concept | Employer | Employee | Total | Source |
|---|---|---|---|---|
| Contingencias comunes | 23.60 % | 4.70 % | 28.30 % | Orden art. 4.a |
| Desempleo — indefinite (incl. part-time, fijo discontinuo, disability ≥ 33 %) | 5.50 % | 1.55 % | 7.05 % | Orden art. 33.2.a.1º |
| Desempleo — fixed-term | 6.70 % | 1.60 % | 8.30 % | Orden art. 33.2.a.2º |
| FOGASA | 0.20 % | — | 0.20 % | Orden art. 33.2.b |
| Formación profesional | 0.60 % | 0.10 % | 0.70 % | Orden art. 33.2.c |
| MEI | 0.75 % | 0.15 % | 0.90 % | Orden art. 16; LGSS DT 43ª |
| AT/EP — "personal en trabajos exclusivos de oficina" (cuadro II a) | 1.50 % (IT 0.80 + IMS 0.70) | — | 1.50 % | LGSS DA 61ª cuadro II; Orden art. 4.b |
| AT/EP — CNAE 62 programming/consulting (cuadro I) | 1.50 % (0.80 + 0.70) | — | | LGSS DA 61ª cuadro I |
| **Total, indefinite, office** | **32.15 %** | **6.50 %** | 38.65 % | sum |
| Additional contribution for short contracts (< 30 days) | per Orden art. 28 (not modelled) | | | Orden art. 28 [?] amount not read |

| Base | 2026 | Source |
|---|---|---|
| Maximum base (all groups) | **€5,101.20/month** = €61,214.40/yr | Orden art. 2.1, citing RDL 3/2026 art. 3 |
| Minimum CC base, group 1 (Ingenieros y Licenciados, alta dirección) | €1,989.30/month | Orden art. 3 |
| group 2 | €1,649.70 | Orden art. 3 |
| group 3 | €1,435.20 | Orden art. 3 |
| groups 4–7 | €1,424.40 | Orden art. 3 |
| groups 8–11 (daily) | €47.48/day min, €170.04/day max | Orden art. 3 |
| AT/EP floor | SMI + 1/6, not below €1,424.40 | Orden art. 2.2 |

| Solidarity band (monthly pay) | Total | Employer | Employee | Source |
|---|---|---|---|---|
| 5,101.21 – 5,611.32 (max base + 10 %) | 1.15 % | 0.96 % | 0.19 % | Orden art. 17.1.a; LGSS DT 42ª |
| 5,611.33 – 7,651.80 (+ 50 %) | 1.25 % | 1.04 % | 0.21 % | Orden art. 17.1.b |
| > 7,651.80 | 1.46 % | 1.22 % | 0.24 % | Orden art. 17.1.c |

**2027 (only what the law already fixes):** MEI **1.00 %** (0.83 employer / 0.17 employee; LGSS DT 43ª) [V]. Solidarity **1.38 / 1.50 / 1.75 %** (LGSS DT 42ª; split in the CC proportion per art. 19 bis, roughly 83.4/16.6) [V]. Maximum base: set by the PGE/RDL as CPI + 1.2 points (LGSS DT 38ª). **No 2027 figure published** [?]. CC/desempleo/FP rates have been stable for years but need the 2027 Orden.

### 2.3 Worked examples (2026, indefinite, office, group 1)

| Gross | Employee SS | Employer SS | Employer cost | Net after SS + table withholding (single) |
|---|---|---|---|---|
| 25,000 | 1,625.00 | 8,037.50 | 33,037.50 | 25,000 − 1,625 − 3,000 = 20,375 |
| 40,000 | 2,600.00 | 12,860.00 | 52,860.00 | 40,000 − 2,600 − 6,800 = 30,600 |
| 70,000 | 3,996.16 (incl. 17.23 solidarity) | 19,766.90 (incl. 86.47 solidarity) | 89,766.90 | 70,000 − 3,996 − 16,800 = 49,204 |

### 2.4 Edge cases

- **Group-1 minimum base:** below €23,871.60/yr (full-time), the employee still pays on €1,989.30/month. For part-time work the bases are proportional (not modelled).
- **Pluriempleo** (two RG employers): each employer's share of the max base is in proportion to its pay (Orden art. 10). Total employee SS is still capped at €5,101.20/month.
- **Pluriactividad (RG + RETA)**: the two are computed independently, with no shared cap. The excess comes back as a refund under LGSS art. 313 (see `04-reta-ayudas.md`). The CC cuota of an employee in RG counts toward the €17,323.68 threshold.
- **"Equivalent gross salary" comparison:** for an autónomo income Y, the right comparison is `employer_cost = gross × 1.3215` (below the max base). That is the money a company would spend to buy the same work. Solve `gross = Y_equiv / 1.3215` for invoice-equivalence. Above €61,214.40 the employer cost grows only by the 0.96–1.22 % solidarity rates, so the marginal factor is about 1.01.
- **Solidarity in the Renta:** the employee's solidarity contribution is a "cotización a la Seguridad Social", so it counts as a deductible expense under NF art. 22 like the other shares [?]. This is an inference: the text says "cotizaciones a la Seguridad Social" without listing them.

---

## 3. Familia numerosa in Bizkaia IRPF

### 3.1 Findings [V]

- **No specific familia numerosa deduction** in NF 13/2013 (full-text search for "numerosa": only arts. 86.2.a and the preamble).
- **No abono anticipado** for family or descendant deductions. Bizkaia has nothing like LIRPF art. 81 bis or the Modelo 143. The only "abono" of unused cuota is **DA 44ª** (2025–2029). It covers the **rent deduction only** and only for taxpayers **not obliged to file**. An autónoma is always obliged to file, so it never applies.
- **What familia numerosa changes:**
  - Rent of the vivienda habitual: **35 %, cap €2,800** instead of 20 %/€1,600 (art. 86.2.a). The status is the one on 31 Dec (86.4). The €68,000 base cap (86.8) still applies to contracts from 2026.
  - Purchase of the vivienda habitual: the under-36 rates **23 %, cap €1,955/yr** (art. 87.4, by reference to 86.2.a). This **excludes** the "no annual cap in the purchase year" rule and the cuenta-vivienda case (87.5.b).
  - **Payroll withholding:** none. The table only counts descendants.
- **Descendant deduction:** the higher-order amounts (3rd €1,421, 4th €1,680, 5th+ €2,195, plus €394 per child < 6) are the only "large family" weighting (art. 79, NF 7/2025 art. 51; see `01-irpf.md` §4.2).

### 3.2 Formula

```
rent_rate, rent_cap = (0.35, 2_800) if (familia_numerosa_31dic or age<36 or monoparental_98.1.B/C or disab>=65 or victim) else (0.20, 1_600)
# no other familia numerosa parameter in Bizkaia IRPF
```

### 3.3 Edge cases

- **Proving the status:** NF 86.2.a says "titulares de familia numerosa" without defining it. It presumably needs the official título (Ley 40/2003; in Euskadi issued by the Diputación) [?].
- **NF 4/2026** (BOB 02/11/2026, effects 2025) widens the single-parent unidad familiar (98.1.B): gender violence, and exclusive financial support when child support received is ≤ €235/month per child. This affects the 35 % rent rate through 86.2.b, not familia numerosa [S].
- Basque Government child benefits (for example the universal child allowance) are not part of IRPF. Whether they are exempt was not checked [?].

---

## 4. Pluriactividad and the Bizkaia Renta: further interactions

### 4.1 Filing and withholding

```
must_file = True                                  # any activity income (NF 102.2) — the €20,000 work threshold is irrelevant
work_withholding = table(gross_salary)             # ignores activity income → systematically low
renta_extra_due ≈ (marginal_rate × RN_act)        # all activity tax falls on the 130 + Renta
                + (8_000 or tapered bonif − 3_000) × marginal_rate   if non_work_BI > 7_500   # art. 23.2 (bonificación drops to 3,000)
                + table_0%_band_effect            # salary ≤ 20,000 withheld at 0 %
```

- **Low salary + activity:** a salary ≤ €20,000 is withheld at 0 %. With no other income the worker would not have to file. With activity income she must file and pays the whole work cuota in the Renta. If RN_act > €7,500, the bonificación also drops from up to €8,000 to €3,000.
- **Remedy:** the worker may ask the employer in writing for a **higher %** (RIRPF 107.4) [V]. It is binding until year-end and continues in later years unless revoked. The calculator could suggest `pct_needed = projected_cuota_on_work_share / gross`.
- **The 130 does not cover work income.** Art. 110 RIRPF computes it on activity figures only (see `02-pagos-retenciones-calendario.md` §1).
- **Two payers + activity:** the same as above. There is no extra filing trigger in Bizkaia.

### 4.2 EPSV / pension contributions through the employer

```
in_kind_work_income += employer_EPSV_contrib                 # NF art. 17.1.a; valued at cost (art. 18.e)
RI_trab includes it → affects art. 23 bonificación (RI − G)  # can push diff past 14,800 / 23,000
retention_base excludes employer_EPSV_contrib ≤ 10_000       # RIRPF 87.4.a
red_71b = min(employer_contrib + employee_contrib_to_employment_system, 8_000)   # NF 71.1.b
red_71a = min(individual_EPSV_contrib, 5_000)                                     # NF 71.1.a
red_71c = min(autonomo_employment_system_contrib, 4_000)                          # NF 71.1.c (the autónomo side)
joint cap: red_71a + red_71b + red_71c ≤ 10_000, preference for employment systems   # 71.1.d (see 01-irpf Open #12)
excess / insufficient base → carry 5 years (71.3), not if retired
deduction 91 bis: employee's own contributions to a Plan de Previsión Social Preferente from collective bargaining
    15 % if total contributions 3–5 % of gross salary, 20 % if 5–8 %, 25 % if ≥ 8 % OR age < 36
    (base = employee contributions that reduced the base; carry 5 years)
```

- **Employee contributions** to the employer's EPSV do **not** lower payroll withholding (87.4 excludes only employer contributions). They reduce the base in the Renta.
- In pluriactividad the €10,000 joint cap is shared between the employment EPSV (71.1.b) and the autónomo employment-system bucket (71.1.c, €4,000, with the 91 ter 10/15 % deduction). The individual EPSV (€5,000) is also inside 71.1.d.
- Employer EPSV raises RI_trab, so it can **cut the bonificación** in the 14,800–23,000 band, at €0.6098 per € of contribution.

### 4.3 Other interactions (already documented elsewhere, listed for completeness)

| Interaction | Where |
|---|---|
| Bonificación falls to €3,000 if other income in BI > €7,500 | `01-irpf.md` §6 |
| Activity losses cannot offset work income (art. 65.b) | `01-irpf.md` §6 |
| Start-up reduction lost if the prior-year employer becomes the client | `01-irpf.md` §1.5 |
| RETA pluriactividad refund (LGSS 313) | `04-reta-ayudas.md` |
| RETA IT coefficient 0.055 when IT is covered in RG | `04-reta-ayudas.md` |

- **How the LGSS 313 refund is taxed** (received the year after): it presumably lowers the RETA expense, or counts as activity income, in the year it is recognised. No foral rule or consulta was found [?].

---

## Unverified / open

1. **2027 Bizkaia retention table** not published (expected around late December 2026). Use the 2026 table with a "provisional" flag. A 3 % deflation of the scale would probably shift the thresholds by about 3 %.
2. **2027 RG figures**: maximum base, minimum bases (tied to the 2027 SMI) and the Orden de cotización 2027 are not published. Only MEI 1.00 % (0.83/0.17) and solidarity 1.38/1.50/1.75 % are fixed by LGSS DT 43ª/42ª.
3. **Zero floor after the disability reduction**: the text does not say so explicitly. Logic and guiafiscal [S] support it.
4. **Foreign employer with no PE in Spain**: no withholding obligation. Inferred from RIRPF art. 83, which was not re-read line by line [?].
5. **Teletrabajo / workplace outside Euskadi → AEAT withholding**: Concierto art. 7 [V]. Common-Spain withholding (RD 439/2007 arts. 80–89) is **not documented here**. The calculator needs it if it supports that case.
6. **Employee solidarity contribution deductible under NF art. 22**: inferred [?].
7. **Additional contribution for contracts < 30 days** (Orden art. 28) and **fixed-term desempleo 8.30 %**: not modelled.
8. **Tax treatment of the LGSS 313 RETA refund** in the foral IRPF: no source [?].
9. **Familia numerosa proof** in Bizkaia (which título counts) [?]. Basque child benefits and their IRPF exemption were not checked [?].
10. **NF 4/2026** (unidad familiar) read only through a fiscal-impuestos summary. The BOB text (I-1233, 02/11/2026) was not read [S].
11. **AT/EP for remote/home office**: cuadro II "a" requires work "únicamente en los lugares destinados a oficinas de la empresa". Whether full teletrabajo qualifies, or falls back to the CNAE rate (1.50 % for CNAE 62, 1.65 % for 63), is [?]. The difference is ≤ 0.15 points.
