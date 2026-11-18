# 01 — IRPF for an autónomo resident in Bizkaia (annual Renta)

> Research for a Bizkaia autónomo tax calculator. Researched 2026-11-18. **Foral rules only** (Norma Foral 13/2013, "NF IRPF"). Common-Spain rules (Ley 35/2006, AEAT) are cited only to say they do *not* apply.

## Sources used

| Code | Source | Status |
|---|---|---|
| **NF** | NF 13/2013 IRPF Bizkaia, consolidated text "actualizado a 01/01/2026" — a local copy of the consolidated text (official consolidated text from bizkaia.eus) | Primary; grepped/read in full for arts. 12–28, 61–112, DAs, DTs |
| **RIRPF** | Decreto Foral 47/2014, Reglamento IRPF Bizkaia, consolidated "última modificación normativa 23/03/2026" (copy in session scratchpad, from bizkaia.eus) | Primary; arts. 20–31, 73–76, 94, 109–111 read |
| **NF 7/2025** | NF 7/2025, de 29 de diciembre, Presupuestos Bizkaia 2026, BOB núm. 248, 30/12/2025, arts. 47–54 — https://www.bizkaia.eus/lehendakaritza/Bao_bob/2025/12/30/I-1446_cas.pdf | Primary (BOB PDF downloaded and read) |
| **NF 2/2025** | NF 2/2025, de 9 de abril, de revisión del sistema tributario, BOB núm. 75, 22/04/2025. Full text read via the BOB reproduction at https://derecholocal.es/novedad-legislativa/nuevas-medidas-tributarias-para-el-territorio-historico-de-bizkaia (the BOB PDF itself was not located) | Primary text, secondary host |
| **DFN 1/2026** | Decreto Foral Normativo 1/2026, de 16 de abril (crisis Oriente Medio), BOB 20/04/2026 — summary at fiscal-impuestos.com | Secondary summary only |
| **Proyecto NF Medidas 2026** | Diputación press release 10/09/2026 — https://www.bizkaia.eus/es/web/comunicacion/noticias/-/news/detailView/la-diputacion-aprueba-el-proyecto-de-norma-foral-de-medidas-tributarias-2026 ; Andersen alert June 2026 | Bill, **not law** |
| Campaign | bizkaia.eus press release 16/03/2026 (Renta 2025 campaign) | Official |

bizkaia.eus/ogasuna/faq/ returns HTTP 403 to automated fetches (curl and WebFetch), so **no FAQ page could be re-read in this session**. Where a point depends on FAQ/administrative practice it is marked in "Unverified / open".

---

## Summary (calculator pipeline)

```
# per taxpayer, tax year Y (Bizkaia resident on 31-Dec, art. 100 NF)
RN_act   = activity_net_income(Y)                 # §1  (simplificada or normal)
RN_trab  = work_net_income(Y)                     # §6  (with bonificación art. 23)
BI_gen   = integrate_general(RN_trab, RN_act, ...)# §2  (activity losses ring-fenced, art. 65.b)
BI_aho   = integrate_savings(...)                 # §2
BL_gen   = max(0, BI_gen - pens_comp - prevision_social - red_conjunta) - BLG_neg_carry  # §2, arts. 67–73, 68
BL_aho   = max(0, BI_aho - remanente_pens_comp)
CI       = max(0, escala_general(BL_gen) - minoracion) + escala_ahorro(BL_aho)          # §3, arts. 74–77
CL       = max(0, CI - deducciones)                                                      # §4, art. 78
CD       = CL - retenciones - ingresos_a_cuenta - pagos_fraccionados_130                 # §7, art. 95
```

Key 2026 parameters: scale 23 %→49 % with first bracket €18,080; minoración €1,615/declaración; joint-filing base reduction €4,896; simplificada reduction 20/15/10 % by **prior-year** (ingresos − gastos) ≤ €35k / ≤ €85k / > €85k; start-up reduction 10 % (men) / 15 % (women); rent deduction 20 %/€1,600 or 35 %/€2,800 (<36, etc.), lost if base liquidable > €68,000 for contracts signed/extended from 2026; EPSV individual cap €5,000. No estimación objetiva (módulos) in Bizkaia since 2014.

---

## 1. Rendimiento neto de actividades económicas

### 1.1 Plain explanation

Bizkaia has **only estimación directa**, in two modalities: **normal** (full accounting-style rules, real amortisation) and **simplificada** (same income/expense rules minus amortisation & impairment, replaced by a flat % cut of the net). Módulos/estimación objetiva was **abolished from 1 Jan 2014** (NF preamble; art. 25.1 lists only normal and simplificada; DA 5ª on módulos retention is a dead letter).

Simplificada is open if the **volumen de operaciones** (all activities, excl. IVA — RIRPF art. 20) did not exceed **€600,000** in the prior year (NF art. 25.1.b; RIRPF art. 28). It is **not automatic**: the taxpayer must elect it **in each year's Renta** (RIRPF art. 29), changeable after the voluntary period if no administrative action has started. If any activity is in normal, all are in normal (RIRPF art. 31), except an activity started during the year.

### 1.2 Formulas

```
# Simplificada (art. 28 NF, as amended by NF 2/2025 art. 17.Tres, effects 1-1-2025)
D_Y   = ingresos_computables_Y - gastos_deducibles_Y
        # gastos EXCLUDE: amortizaciones, pérdidas por deterioro,
        # vehicle lease/cesión/depreciación amounts of art. 27 regla 5ª Dos.a / Tres.a,
        # and gains/losses on afectos (added in step c)
p     = tier(D_{Y-1})            # PRIOR year's D, same definition
        tier(x) = 0.20 if x <= 35_000
                  0.15 if 35_000 < x <= 85_000
                  0.10 if x > 85_000
RN_ord = D_Y * (1 - p)           # the p covers amortizaciones + deterioro + gastos de difícil justificación
RN     = RN_ord + ganancias_afectos - perdidas_afectos   # art. 28.1.c / 25.3

# Normal (art. 27 NF): RN = ingresos - gastos (IS rules, incl. amortización per IS tables)
#   + art. 27 special rules (below), + gains/losses on afectos

# Irregular (art. 25.4): if generation period > 2 yrs and not periodic/recurrent
pct = 0.50 if (gen > 5y or notoriamente_irregular) else 0.60 if gen > 2y else 1.00
RN_irreg_integrated = min(RN_irreg, 300_000) * pct + max(0, RN_irreg - 300_000)

# Start-up reduction (art. 25.5, wording NF 2/2025 art. 1.Tres, effects 2025)
if eligible_startup and RN > 0 and year in {first_positive_year, first_positive_year + 1}
   and first_positive_year <= start_year + 4:
    RN = RN * (1 - (0.15 if woman else 0.10))      # applied AFTER the 25.4 irregular %
```

- D can be negative; then p is still applied to the difference (the norm says "la cantidad resultante se minorará"). Whether the % reduction applies to a negative D (which would *shrink* the loss) — see Open items.
- **First year of activity** (no prior-year D): art. 28.1.b refers only to "el año inmediato anterior". Treating the prior-year difference as 0 → 20 % tier is the reading gestorías use, but **no official text states it**. If activity started mid-year, nothing in art. 28 annualises the prior-year D for the tier (annualisation exists only for the €600k volume test, art. 25.1.b / RIRPF 28.2, and for 130 payments).

### 1.3 Parameters

| Parameter | 2025 | 2026 | Source |
|---|---|---|---|
| Simplificada volume cap | €600,000 prior-year volumen de operaciones (start year: that year's, annualised) | same | NF art. 25.1.b; RIRPF arts. 20, 28 |
| Simplificada % (prior-year D ≤ 35k / 35–85k / > 85k) | 20 / 15 / 10 % | same | NF art. 28.1.b; NF 2/2025 art. 17.Tres "con efectos desde 1 de enero de 2025" |
| Start-up reduction | 10 % men, 15 % women | same | NF art. 25.5; NF 2/2025 art. 1.Tres (effects 2025) |
| Irregular integration | 60 % (>2 y), 50 % (>5 y or notoriamente irregular), cap €300,000 | same | NF art. 25.4; RIRPF art. 24 |
| Activity-loss carry-forward | 30 years, against activity income only | same | NF art. 65.b |

### 1.4 Deductible expenses (normal and, via art. 28.1.a, simplificada)

General rule: IS rules (NF 11/2013 IS) apply — accounting expense, correlated with income, justified by invoice (NF art. 94 for deductions; IS for expenses). Special rules in **NF art. 27**:

| Item | Rule | Source |
|---|---|---|
| Own **Social Security (RETA)** cuotas | Not addressed by a specific foral article; deductible as an ordinary activity expense under IS rules (TGSS cuota is standard practice; gestorías book it as an expense) | NF art. 27 (general IS remission) — see Open |
| Own **mutualidad de previsión social** | Not deductible as expense (goes to base reduction, art. 70), **except** a mutualidad alternativa a RETA for professionals not in RETA, up to the RETA cuota máxima por contingencias comunes | NF art. 27 regla 1ª |
| Spouse/partner/minor children working in the activity | Deductible salary at market rate if labour contract + SS affiliation; taxed as their work income | NF art. 27 regla 2ª |
| Assets ceded by spouse/partner/children | Market-rate rent deductible (not for common property) | NF art. 27 regla 3ª |
| Relaciones públicas (restaurants, hotels, travel) | **50 %** of the expense, capped at **5 % of the activity's ingresos** | NF art. 27 regla 4ª.a |
| Gifts | Up to **€300 per recipient per year**, recipient documented | NF art. 27 regla 4ª.b |
| **Passenger cars, mopeds, motorcycles** | **Not deductible as a rule** (Uno). If "notoriamente relevante y habitual": **50 %** of costs of **one** vehicle, limits: lease/cesión/depreciación €3,000 (or 50 % × amort.% × €30,000); BEV/REEV/FCV/FCHV €4,000 (€40,000 ref.); financing costs pro-rata to €30k/€40k of price; **other running costs €3,600/vehicle/yr** (Dos). If **exclusive use proven**: 100 %, limits €6,000 / €8,000 (EV), financing pro-rata, **other costs €7,200** (Tres). Limits pro-rated by months of use. Exceptions without limits (Cuatro): goods vans, taxis, driving schools, security, commercial agents (with Tres a-b limits), etc. | NF art. 27 regla 5ª (wording NF 2/2025 art. 10, for 2025–2035); RIRPF art. 25 (financing costs) |
| — in simplificada | The lease/cesión/depreciación limb (Dos.a / Tres.a) is **excluded** and absorbed by the % reduction; running costs (c) remain deductible | NF art. 28.1.a |
| Boats, recreational aircraft | Not deductible unless exclusively used; then capped at the income they generate | NF art. 27 regla 6ª |
| Cash payments breaching Ley 7/2012 limit | Not deductible (pro-rata if partly cash) | NF art. 27 regla 7ª; RIRPF art. 26 |
| Bribes | Not deductible | NF art. 27 regla 8ª |
| Micro/small/medium enterprises (art. 13 NF IS) | Libertad de amortización / accelerated amortisation per NF IS arts. 21.1.b, 21.2–3, 22.3 (normal modality only, since simplificada excludes amortisation) | NF art. 27 regla 9ª; RIRPF art. 19 |
| Non-deductible per NF IS art. 31.4 (e.g. fines, gambling losses, IRPF itself, donations, liberalities) | Not deductible | NF art. 27 regla 1ª |
| **Home office — partly affected dwelling** | Only the part actually used is afecto (art. 26.2). **No foral equivalent of the common-Spain 30 %-of-m² suministros rule** (art. 30.2.5ª.b Ley 35/2006 does not apply). Ownership costs (IBI, comunidad, rent) proportional to m²; suministros: one gestoría (not official) says only with separate meters. Affecting rented housing also reduces the personal rent deduction base. | NF art. 26.2; a gestoría article — see Open |
| **Dietas / meals of the autónomo** | **No foral equivalent** of the common-Spain art. 30.2.5ª.c (€26.67/€48.08 in establishments paid electronically) for the self-employed. RIRPF art. 13 dietas exemptions apply to **employees** only. Business meals with clients fall under relaciones públicas (50 %, 5 % cap). | NF art. 27; RIRPF art. 13 — see Open |
| **Private health insurance** of the autónoma | Not deductible in Bizkaia (no foral equivalent of common-Spain €500/person). Per Bizkaia FAQ 900001803, Bizkaia FAQ 900001803 — **not re-read** (403). A 20 % *deduction* (base ≤ €1,500/person) is in the **Proyecto NF Medidas 2026**, not yet law. | brief.md; Proyecto NF 2026 |
| Amortización (normal) | IS tables (NF IS) | NF art. 27 |

### 1.5 Start-up reduction (art. 25.5) — conditions & edge cases

- **Who:** any taxpayer who *starts* an activity; 10 % (15 % women) of **positive** net activity income.
- **When:** first tax year with positive RN **and the next one** (2 years max), provided the first positive year is within the **first five tax periods** since the start.
- **Order:** after the art. 25.4 irregular integration %, i.e. last step on RN (and after the simplificada %).
- **Excluded if:** (a) the same activity was carried out before, directly or indirectly — "same" = **same IAE group**; no time or territorial limit in the text; (b) **in any year** where > 50 % of the activity's income comes from a person/entity that paid the taxpayer **employment income in the year before the start date**.
- Edge: year 2 with negative RN → that year is lost (the "next period" is consumed). Year 1 negative, year 2 first positive → years 2 and 3.
- Edge: not a deduction from cuota; it reduces RN, so it also lowers base liquidable for the €68k housing caps.

### 1.6 Edge cases for the calculator

- Tier p depends on **previous year's D** computed with the simplificada definition (before % cut). Store D per year.
- p is set by prior year even if the taxpayer was in **normal** that prior year — the law refers to "la diferencia entre los ingresos y los gastos mencionados en la letra anterior", so recompute D under simplificada rules (exclude amortisation). (Inference.)
- Activity losses do **not** offset work income in the same year (art. 65.b ring-fence) — a real difference from common Spain.
- Gains on business assets (sale of afecto) are added *after* the % cut and taxed as general (activity) income; art. 75.3 caps their tax at the IS general rate if the average rate is higher.

---

## 2. Base imponible, base liquidable, reductions

### 2.1 Plain explanation

Income is split into **general** (work, activity, most capital immobiliario, gains not from transfers) and **savings/ahorro** (interest, dividends, most residential rent, gains from transfers). Each base is integrated separately; reductions (alimony, pension/EPSV contributions, joint-filing) are taken off the **general** base in a fixed order, cannot make it negative, and leftovers carry forward.

### 2.2 Formulas

```
# Art. 65 — base imponible general
S_a = sum(work_net, capital_general_net, imputaciones)          # free offset
S_b = sum(activity_net)                                          # free offset among activities
if S_b < 0: activity_loss_carry += -S_b; S_b = 0                 # only vs future activity income, 30 y
S_b = max(0, S_b - min(S_b, activity_loss_carry_available))      # optional, elected in the return
S_c = gains_losses_general (non-transfer)
if S_c < 0: offset = min(-S_c, 0.25 * (S_a + S_b)); ...; rest carried 4 y
BI_gen = S_a + S_b + max(S_c,0) - offset

# Art. 66 — base imponible del ahorro (two ring-fenced buckets, negatives carry 4 y each)
BI_aho = max(0, rcm_and_residential_rent_net) + max(0, transfer_gains_net)

# Art. 67 — base liquidable general, reductions IN THIS ORDER, never below 0
r1 = pensiones_compensatorias + anualidades_alimentos (not for own children, not if cohabiting)   # art. 69
r2 = prevision_social_reduction()                                                                  # arts. 70–72
r3 = 4_896 if joint else 0   # 2026 (4,800 in 2025)                                                # art. 73
BL_gen = max(0, BI_gen - r1 - r2 - r3)
BL_aho = max(0, BI_aho - unused_r1)                                                                # art. 67.3
# Art. 68: negative BL_gen (possible only via carried items) → carry 4 years

# Arts. 70–71 — prevision social (EPSV, planes de pensiones, PPA, mutualidades, dependency insurance)
r2_individual = min(own_contributions_non_employment, 5_000)                 # 71.1.a
r2_autonomo_empleo = min(contrib_to_employment_systems_for_self_employed, 4_000)   # 71.1.c
r2_empresarial = min(employer_contribs + matched own (employment), 8_000)    # 71.1.b
r2 = min(r2_individual + r2_autonomo_empleo + r2_empresarial, joint_cap)     # 71.1.d joint_cap: 10,000 (2026) / 12,000 (2025)
r2 = min(r2, BI_gen_after_r1)
excess (over a)/c) caps, or insufficient base) → carried 5 years (71.3), if not retired
+ spouse/partner contribution: up to 2,400 if spouse's general income < 8,000 (70.3)
```

### 2.3 Parameters

| Parameter | 2025 | 2026 | Source |
|---|---|---|---|
| Joint-filing base reduction | €4,800 / declaración | **€4,896** | NF 2/2025 art. 1.Cuatro; NF 7/2025 art. 48 |
| Individual prevision social cap (EPSV, planes, PPA…) | €5,000 | €5,000 | NF art. 71.1.a |
| Employment systems / employer contributions | €8,000 | €8,000 | NF art. 71.1.b |
| Employment systems for autónomos (incl. autónomos without employees) | €4,000 | €4,000 | NF art. 71.1.c |
| Joint cap (a+b+c) | €12,000 | **€10,000** | NF art. 71.1.d; NF 2/2025 preamble + DF 3ª (71.1.d effective 2026) |
| Spouse/partner with < €8,000 general income | €2,400 | €2,400 | NF art. 70.3 |
| Contributions for disabled person | €8,000 per contributor; €24,250 total | same | NF art. 72 |
| Dependency insurance (all payers for one person) | €5,000 | same | NF art. 70.1.7º |
| Carry-forward of excess contributions | 5 years | same | NF art. 71.3 |
| Activity-loss carry-forward | 30 years (activity only) | same | NF art. 65.b |
| General gains/losses offset | 25 % of (S_a+S_b), rest 4 years | same | NF art. 65.c |
| Negative BL general | 4 years | same | NF art. 68 |
| Savings negatives | 4 years, within each bucket | same | NF art. 66 |

### 2.4 Edge cases

- **Limits are per person** even in joint filing (art. 71.2, 99.2.c).
- Contributions made after retirement are not reducible (70.5); in a year with a lump-sum retirement withdrawal, reduction is limited (70.6).
- Reductions cannot create/raise a negative base (67.2) — EPSV doesn't create a loss.
- Linked-entity interest goes to general, not savings (art. 63.b).
- Deducción art. 91 ter: autónomo contributions under 71.1.c also give **10 % cuota deduction** (15 % if < 36 at 31 Dec, or if to a Plan de Previsión Preferente), 5-year carry-forward.

---

## 3. Escalas

### 3.1 Formulas

```
cuota_gen = progressive(BL_gen, ESCALA_GENERAL[year])
cuota_gen = max(0, cuota_gen - MINORACION[year])          # art. 74 + 77: minoración only vs the general part
cuota_aho = progressive(BL_aho, ESCALA_AHORRO[year])
CI = cuota_gen + cuota_aho (+ DA 24ª special regime if applicable)
# Art. 75.3: if avg general rate > IS general rate, reduce CI by (avg_rate − IS_rate) × business-asset gains in RN_act
```

### 3.2 Escala general (art. 75)

**2026** — NF 7/2025 art. 49 (BOB 30/12/2025), "con efectos desde 1 de enero de 2026" (≈ 2 % deflation). Identical to the consolidated NF text.

| BL general from (€) | Cuota at that point (€) | Next band width (€) | Rate |
|---|---|---|---|
| 0.00 | 0.00 | 18,080.00 | 23 % |
| 18,080.00 | 4,158.40 | 18,080.00 | 28 % |
| 36,160.00 | 9,220.80 | 18,080.00 | 35 % |
| 54,240.00 | 15,548.80 | 23,210.00 | 40 % |
| 77,450.00 | 24,832.80 | 29,810.00 | 45 % |
| 107,260.00 | 38,247.30 | 35,700.00 | 46 % |
| 142,960.00 | 54,669.30 | 65,430.00 | 47 % |
| 208,390.00 | 85,421.40 | onwards | 49 % |

**2025** — **not read from an official source** (only secondary sites: billeo.es, iberley snippet). Thresholds reported: 17,720 / 35,440 / 53,160 / 75,910 / 105,130 / 140,130 / 204,270; same rates. Cuotas computed: 4,075.60 / 9,037.20 / 15,239.20 / 24,339.20 / 37,488.20 / 53,588.20 / 83,734.00. Mark unverified.

**2027** — **not published.** A press article (moncloa.com, 16/10/2026) reports that the three foral treasuries plan a **3 % deflation for 2027** to be put into their norma foral projects; no Bizkaia text found as of 2026-11-18. Calculator: parameterise by year and leave 2027 = 2026 with a "provisional" flag, or offer an optional ×1.03 scenario.

### 3.3 Escala del ahorro (art. 76)

**2026** — new 9-band scale from NF 2/2025 art. 15.Tres, which per NF 2/2025 DF 3ª "tendrá efectos a partir de 1 de enero de 2026". Text from consolidated NF art. 76.1:

| BL ahorro from (€) | Cuota (€) | Band (€) | Rate |
|---|---|---|---|
| 0 | 0 | 7,500 | 19 % |
| 7,500 | 1,425 | 7,500 | 20 % |
| 15,000 | 2,925 | 15,000 | 22 % |
| 30,000 | 6,225 | 20,000 | 24 % |
| 50,000 | 11,025 | 40,000 | 25.5 % |
| 90,000 | 21,225 | 30,000 | 26 % |
| 120,000 | 29,025 | 120,000 | 26.5 % |
| 240,000 | 60,825 | 60,000 | 27 % |
| 300,000 | 77,025 | onwards | 28 % |

**2025** — old 5-band scale (20 %→25 %); thresholds not verified (commonly cited: 2,500 / 10,000 / 15,000 / 30,000 at 20/21/22/23/25 %). Unverified.

---

## 4. Minoración de cuota and deducciones

### 4.1 Order of application

```
CI = max(0, escala_gen(BL_gen) - 1_615) + escala_aho(BL_aho)     # minoración can't push the general part below 0
CL = max(0, CI - Σ deducciones)                                    # art. 78
# carry-forwards first (art. 93 bis / 93 ter): pending amounts applied before the current year's same deduction
```

Unlike common Spain, there is **no mínimo personal y familiar** reducing the base; personal/family relief is via the flat minoración and cuota deductions.

### 4.2 Personal & family (2026 amounts — NF 7/2025 arts. 50–54; 2025 from secondary sources)

| Item | 2026 | 2025 | Conditions | Source |
|---|---|---|---|---|
| **Minoración de cuota** | **€1,615** per declaración (one per return, also in joint) | **unverified** (secondary sources disagree; ~€1,583 by back-deflation, €1,544 per taxdown) | Off the general cuota only | NF art. 77; NF 7/2025 art. 50 |
| Descendientes (cohabiting) 1st / 2nd / 3rd / 4th / 5th+ | €682 / 844 / 1,421 / 1,680 / 2,195 | €668 / ? / ? / ? / 2,151 (billeo) | ≤ 30 years old (unless disability deduction), income ≤ SMI, not filing own return; split equally between same-degree ascendants | NF art. 79; NF 7/2025 art. 51 |
| Descendiente < 6 years (extra) | €394 | €386 (billeo) | | same |
| Alimony to own children (court-ordered, exclusive) | 15 % of amounts, cap 30 % of the art. 79.1 amount per child | same | | NF art. 80 |
| Ascendientes (cohabiting all year, or paying residence) | €328 | unverified (~€321) | income ≤ SMI, not filing | NF art. 81; NF 7/2025 art. 52 |
| Discapacidad/dependencia: ≥33 % <65 % / ≥65 % or Grado I / Grado II / Grado III | €906 / 1,294 / 1,552 / 1,935 | unverified | For taxpayer, spouse/partner, or cohabiting relatives with income ≤ 2×SMI | NF art. 82; NF 7/2025 art. 53 |
| Edad > 65 / > 75 | €393 / €714 if BI ≤ 20,000; taper: 393 − 0.0393×(BI−20,000) / 714 − 0.0714×(BI−20,000) for 20,000 < BI < 30,000; 0 above | unverified | BI = BI_gen(≥0) + BI_aho − art. 69 reductions; joint: BI ≤ €35,000 | NF art. 83; NF 7/2025 art. 54; art. 99.2.d |
| Viudedad | €200; taper 200 − 0.02×(BI−20,000) to €30,000; incompatible with edad | same | | NF art. 83 quinquies (NF 2/2025) |
| Household employee for care | €250 (€500 if professional carer) | same | indefinite contract ≥183 days; both partners working | NF art. 83 bis |
| Women re-entering work after childcare | €1,500 per year out (+50 % multiples), 5-year carry | same | | NF art. 83 ter |
| Men pausing/reducing for children < 4 | up to €200/year | same | | NF art. 83 quater |
| Situation date | 31 December (no pro-rating by days) | | | NF art. 84 |

### 4.3 Housing

```
# Rent of vivienda habitual — art. 86 (wording NF 2/2025 art. 3.Cinco, effects 2025)
eligible_amount = rent_paid - exempt_rent_subsidies
if age_on_31Dec < 36 or familia_numerosa or monoparental (98.1.B/C) or disability>=65%/dependency (or cohabiting) or victim:
    ded = min(0.35 * eligible_amount, 2_800)
else:
    ded = min(0.20 * eligible_amount, 1_600)
if contract signed_or_extended >= 2026-01-01 and (BL_gen > 68_000 or BL_aho > 68_000):   # 86.8 — see Open on "and/or"
    ded = 0
# unapplied for insufficient cuota → carry 5 years (art. 93 bis)
# joint filing: if any member qualifies for 35 %, the 35 %/2,800 applies (86.5)

# Purchase of vivienda habitual — art. 87
base = amounts invested (incl. purchase costs) + interest & financing costs - exempt subsidies
if age < 36 (or familia numerosa, monoparental, disability, victim — except for cuenta vivienda):
    ded = 0.23 * base, annual cap 1_955 (NO annual cap in the year the purchase is formalised, <36 only)
else:
    ded = 0.18 * base, annual cap 1_530
lifetime cap: 36_000 (minus 18 % of reinvestment-exempt gains)                   # 87.3; DT 3ª
joint (unidad 98.1): annual caps doubled (99.2.e); lifetime cap per person
if acquisition (or asimilado, incl. cuenta vivienda deposits) made >= 2026-01-01
   and BL > 68_000: ded = 0                                                       # 87.10; NF 2/2025 DF 3ª
# Cuenta vivienda (87.5.b): deposits deductible at the same %; must be used within 6 years (10 if < 36 at opening)
```

| Parameter | 2025 | 2026 | Source |
|---|---|---|---|
| Rent general | 20 %, max €1,600 | same | NF art. 86.1 |
| Rent enhanced (< 36, etc.) | 35 %, max €2,800 | same | NF art. 86.2 |
| Rent €68,000 cap | n/a | contracts **signed or extended from 1/1/2026** | NF art. **86.8**; NF 2/2025 DF 3ª |
| Purchase general | 18 %, max €1,530/yr | same | NF art. 87.1–2 |
| Purchase < 36 | 23 %, max €1,955/yr (no cap in purchase year) | same | NF art. 87.4 |
| Lifetime cap | €36,000 | same | NF art. 87.3 |
| Purchase/cuenta vivienda €68,000 cap | n/a | acquisitions/asimilados **from 1/1/2026** | NF art. 87.10; NF 2/2025 DF 3ª |
| Cuenta vivienda term | 6 years (10 if < 36 at opening) | same | NF art. 87.5.b |
| Vivienda habitual | 3 years continuous residence (exceptions) | | NF art. 87.8; RIRPF art. 67 |
| Housing-market tension (cap may be changed by regulation) | | 2026–2030 | NF DA 43ª |
| Refund of unused rent deduction to **non-obligated** filers | 2025–2029 | | NF DA 44ª — autónomos are always obligated (§7), so not applicable |

### 4.4 Investment / entrepreneurship / other

| Deduction | Rule | Source |
|---|---|---|
| Investment in new/recent micro/SME (SA, SL, coop, laborales; or foreign analogue) | **25 %** (30 % women); **35 %** (40 % women) if innovative or "economía plateada". Shares bought at incorporation/capital increase or within 5 y (7 y innovative), held > 5 y; stake (with family) ≤ 25 %; certificate from the company. Cap: **20 % of base liquidable**; excess 5 years. Not for re-wrapping one's own previous activity. | NF art. 90 |
| Worker participation in employer | see article (10 %, limits) | NF art. 89 |
| EU innovation funds | 15 %, max €750/yr, 5-y hold | NF art. 90 bis |
| Inversiones y otras actividades (IS deductions applied to activity income: R&D, energy, etc.) | Same %/limits as NF IS; limit on the cuota attributable to activity income; carry 30 years; must be elected in the return | NF art. 88 |
| Mecenazgo (donations) | Per NF 4/2019 (rates not verified here — secondary: 30 %, 45 % priority); base ≤ 35 % of BI (gen+aho); excess 5 years | NF art. 91 |
| EPSV preferente (employees) | 10–25 % by employer contribution level (25 % if < 36) | NF art. 91 bis, DA 40ª |
| Autónomo employment pension systems | 10 % (15 % if < 36 or Plan Preferente) of contributions reduced under 71.1.c | NF art. 91 ter, DA 41ª |
| Energy efficiency works, EVs, chargers | arts. 91 quater–sexies (2025–2035) | NF |
| Sindicatos / partidos | 20 % | NF art. 93 |
| International double taxation | lesser of foreign tax and avg rate × foreign income | NF art. 92 |
| **Deducción por inicio de actividad** | **None** as a cuota deduction. Start-up relief is the RN reduction of art. 25.5 (§1.5). | NF (searched) |
| Health insurance (20 %, base ≤ €1,500/person), gym (20 %, base ≤ €1,000) | **Bill only** (Proyecto NF Medidas Tributarias 2026, approved by Diputación 10/09/2026, in Juntas Generales) | press release |

---

## 5. Tributación individual vs conjunta

### 5.1 Plain explanation

Default is individual. A **unidad familiar** can opt for joint filing each year (not binding for later years). In Bizkaia, **parejas de hecho** (registered under Basque Ley 2/2003 or analogous registers in other regions/EU/third countries — DA 1ª) are treated like spouses for the unidad familiar. Joint filing adds all incomes together and taxes them with the **same** single-person scale; the relief is a fixed base reduction (€4,896 in 2026) plus a single €1,615 minoración. It usually only pays off when one partner has little or no income.

### 5.2 Formula

```
# Unidad familiar on 31 Dec (art. 98): spouses not legally separated OR pareja de hecho,
#   + minor children (not living independently with consent), adult children under curatela,
#   minors in permanent foster/pre-adoption care; or single parent + those children (B),
#   or custody due to gender/domestic violence (C), or separated parent + exclusively dependent children (D).
# All members must be IRPF contribuyentes (art. 97.1).

joint.BI_gen = Σ members BI_gen (activity losses remain each member's; art. 99.2.b)
joint.BL_gen = max(0, joint.BI_gen - r1 - Σ_i r2_i - 4_896)       # EPSV limits per person (99.2.c)
joint.CI     = max(0, escala_gen(joint.BL_gen) - 1_615) + escala_aho(joint.BL_aho)
# work bonificación computed on total work income of all earners (99.2.a)
# housing purchase annual caps doubled for 98.1 units (99.2.e); rent 35 % if any member qualifies (86.5)
# age deduction per qualifying member, joint BI ≤ 35,000 (99.2.d)
compare individual_total = Σ CL_i  vs  joint CL; pick lower
```

| Parameter | 2025 | 2026 | Source |
|---|---|---|---|
| Joint base reduction | €4,800 | €4,896 | NF art. 73 |
| Minoración | 1 per declaración | €1,615 per declaración | NF art. 77 |
| Amounts/limits not multiplied | general rule | | NF art. 99.2 |

### 5.3 Edge cases

- Option is exercised by the first member to file; can't be changed during the voluntary period, but can after it if no administrative action (art. 97.4); the 2025 campaign allowed switching via declaración sustitutiva (press release).
- If any member files individually, all must (97.3). If no return filed → individual (97.5).
- Members in different territories (e.g. one in Gipuzkoa or common Spain): special rule art. 2 / 97.1.
- Solidary liability for the joint debt (99.5).
- €68,000 housing caps in joint filing: the text refers to "el o la contribuyente"; how it applies to the joint base is unclear — see Open.
- Marriage date: status at 31 Dec (98.3).

---

## 6. Rendimientos del trabajo (mixed employment + activity)

### 6.1 Formula

```
RI_trab = gross salary + in-kind (arts. 15–19)  [irregular integration per art. 19 where applicable]
G_trab  = employee SS contributions + mandatory political-party contributions (art. 22)   # exhaustive list
diff    = RI_trab - G_trab
if diff <= 0: bonif = 0
elif non_work_income_in_BI > 7_500: bonif = 3_000          # art. 23.2 — key for autónomos with a job
elif diff <= 14_800: bonif = 8_000
elif diff <= 23_000: bonif = 8_000 - 0.6098 * (diff - 14_800)
else: bonif = 3_000
bonif *= 2.0 if disability 33–65 %; *= 3.5 if 33–65 % with reduced mobility or ≥ 65 %   # +100 % / +250 %
RN_trab = max(0, diff - bonif)                               # art. 23.4
```

| Parameter | 2025 | 2026 | Source |
|---|---|---|---|
| Bonificación | 8,000 → 3,000 (14,800 / 23,000 steps, slope 0.6098) | same (not changed by NF 7/2025) | NF art. 23; NF 2/2025 art. 15.Dos (effects 2025) |
| Other-income threshold forcing €3,000 | €7,500 | same | NF art. 23.2 |

Edge: "rentas no procedentes del trabajo ... que se computen en la base imponible" > €7,500 — a modest autónomo net income switches the bonificación to €3,000. Whether "base imponible" means general+savings and before/after offsets is not defined; assume BI_gen non-work part + BI_aho.

Also: employment income from the same payer as the new activity (prior year) kills the start-up reduction that year (§1.5). Work and activity both feed BI_gen, but activity losses can't offset work income (art. 65.b).

---

## 7. Filing obligation, deadlines, cuota diferencial

### 7.1 Obligation

```
must_file = not ( income_only_from {gross work ≤ 20_000 (per earner), capital+gains incl. exempt ≤ 1_600} )
# any activity income → must file (no exemption covers activity income)
```
Source: NF art. 102.2 (NF 2/2025 art. 15.Cuatro, effects 2025); RIRPF art. 73 bis. Non-obligated taxpayers must still file to get refunds (RIRPF 73 bis.2). €20,000 single threshold first applied in Renta 2025 (press release 16/03/2026). Filing is electronic via sede/app, phone, or in person (NF 102.6; RIRPF 73.4).

### 7.2 Calendar

| Item | Value | Source |
|---|---|---|
| Voluntary period | Set yearly by Orden Foral (RIRPF art. 76.1). Renta 2025: **15 April – 30 June 2026** | bizkaia.eus press release 16/03/2026 |
| Renta 2026 (filed 2027) | Orden Foral not yet published; expect ~mid-April → 30 June 2027 (assumption) | — |
| Payment | Debit after the campaign, within the extra period set by the Orden Foral (RIRPF 76.2) | RIRPF art. 76 |
| Interest-free split | **60 %** in that period + **40 % before 10 November** of the same year, by domiciliation, if filed on time | RIRPF art. 76.5 |
| Refunds | Must be by domiciliation; ≤ 7 days after filing typically (press) | RIRPF 76.4; press release |
| Quarterly 130 | 1–25 April, July, October, January | RIRPF art. 111 |

### 7.3 Pagos fraccionados (Modelo 130) and cuota diferencial

```
# RIRPF art. 110 — each quarter
if year in {start_year, start_year + 1}:
    pago_q = 0.20 * (ingresos_q - gastos_q) - retenciones_q                 # "devengados en cada trimestre natural"
else:
    RN_pen = RN_activity(Y-2)  (annualised if Y-2 was the start year)
    pago_q = 0.05 * RN_pen if RN_pen > 0 else 0.005 * ventas(Y-2)          # 0.25 % for wholesalers
    pago_q -= 0.25 * retenciones_total(Y-2)
# no 130 obligation for professionals if ≥ 70 % of income had retención (penultimate year; start year & next: the quarter) — RIRPF 109.3–4
# negative result → declaración negativa still required (RIRPF 111.1)
# 2026 exception: Q1 2026 pago fraccionado waived for activities (DFN 1/2026 art. 3, BOB 20/04/2026 — secondary summary)

CD = CL - Σ retenciones - Σ ingresos_a_cuenta - Σ pagos_fraccionados (actually paid/declared)   # NF art. 95
# CD > 0 → pay; CD < 0 → refund
```

| Parameter | Value | Source |
|---|---|---|
| 130 rate, start year + next | 20 % of quarterly ingresos − gastos | RIRPF art. 110.1.a |
| 130 rate, general | 5 % of penultimate year RN per quarter (0.5 % of volume if RN ≤ 0) | RIRPF art. 110.1.a |
| Retention on professional invoices to Spanish payers | 15 %; 7 % in start year + 2 following if no professional activity the year before | RIRPF art. 94.1 |

Edge cases:
- Foreign clients withhold nothing → 130 is mandatory.
- Year 3 onward (e.g. 2028 for a 2026 start): base is the **penultimate year (start year) annualised** — for a mid-year start, a full-year extrapolation.
- 130 payments are computed on (I−G) **without** the simplificada % or start-up reduction, so the Renta often refunds/adjusts.
- Waived Q1 2026 payment simply isn't credited in CD; if paid voluntarily, it is not refundable as undue but is credited.

---

## Unverified / open

1. **2025 general scale, minoración and family amounts** — no official source read (bizkaia.eus FAQ/manual blocked; NF 3/2024 & 4/2024 not read). Secondary: scale 17,720…204,270; descendants €668…€2,151, +€386. Minoración 2025: conflicting (€1,544 taxdown vs ≈€1,583 back-deflated). Needed only if the app computes 2025 Renta.
2. **2025 savings scale** thresholds (old 5-band, 20–25 %) — unverified.
3. **2027**: no scale, minoración or deflation published. Only a press report of a planned 3 % foral deflation. 2027 retention tables not yet out.
4. **Proyecto NF Medidas Tributarias 2026** (in Juntas Generales): health-insurance 20 % deduction (base ≤ €1,500/person), gym 20 % (base ≤ €1,000), social-housing fund 15 %/€750, new displaced-worker regime, mobility expense. Effective year unknown; not law as of 2026-11-18.
5. **DFN 1/2026** (Q1 2026 pago fraccionado waiver) — read via fiscal-impuestos summary only, not the BOB text.
6. **First-year simplificada tier** (no prior-year D → 20 %): not written in art. 28; practitioner reading (gestorías). Consider a consulta or the Renta 2026 program behaviour.
7. **% reduction on negative D**: does the 20/15/10 % apply when ingresos − gastos < 0 (shrinking the loss)? Text is literal ("la cantidad resultante se minorará"); AEAT practice in common Spain differs; no foral guidance found.
8. **Home office suministros & autónomo meals (dietas)**: no foral rule found; common-Spain 30 % suministros rule and €26.67/€48.08 dietas rule do **not** exist in NF 13/2013. One gestoría claims separate meters are required. Needs bizkaia.eus FAQ or a consulta.
9. **Health insurance non-deductibility**: relies on Bizkaia FAQ 900001803; couldn't re-fetch (403). Consistent with art. 27 having no exception.
10. **RETA cuotas as expense**: standard practice, but no explicit foral article read (falls under IS general rules).
11. **€68,000 cap wording**: "base liquidable general y, en su caso, base liquidable del ahorro, iguales o inferiores a 68.000" — each base separately (likely) vs sum? And how it applies in joint filing (joint bases vs per member). Unresolved.
12. **71.1.d joint cap (€10,000)** — whether it caps a)+b)+c) together or only employer/employment contributions ("aportaciones y contribuciones empresariales"). Text ambiguous.
13. **Art. 23.2 "rentas no procedentes del trabajo" > €7,500**: whether savings income and pre-offset amounts count.
14. **Mecenazgo** deduction rates (NF 4/2019) not verified.
15. **Renta 2026 campaign dates** (spring 2027): Orden Foral not published.
16. Start-up reduction vs **foreign prior activity** (same IAE group abroad): no foral ruling.
