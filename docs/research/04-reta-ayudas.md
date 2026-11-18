# 04 — RETA (Social Security) and public support for autónomos in Bizkaia

> Researched 2026-11-18 for a calculator spec. Sources are state law (BOE consolidated texts), TGSS/Import@ss pages, Hacienda Foral de Bizkaia pages and official Basque/Bizkaia aid pages. Every parameter cites its source. Secondary sources (blogs, gestorías) appear only where noted and are never the sole basis for a parameter.
> Status legend: **[V]** verified in the official text · **[S]** secondary or partial source only · **[?]** open.

## Summary

- **RETA is state-level and identical in Bizkaia.** It is regulated by LGSS arts. 305–323 (RDLeg 8/2015), the cotización regulation (RD 2064/1995) and the annual Orden de cotización. Bizkaia's only role is supplying the income figure: Hacienda Foral de Bizkaia sends the TGSS each taxpayer's **"rendimiento neto previo atribuido"** from the foral IRPF return.
- **Tables:** 2026 uses the **2025 tables unchanged** (RDL 3/2026 art. 3.4, now convalidated; Orden PJC/297/2026 art. 18). The only change is that the tramo 11–12 maximum rises from €4,909.50 to **€5,101.20**. As of 1 Nov 2026 **no 2027 table has been published or agreed**: negotiations are frozen until after the general election. The only legally fixed change for 2027 is the **MEI rising to 1.0%**, which makes the total rate **31.6%**.
- **Rates:** 2025 = **31.40%** (CC 28.30 + CP 1.30 + cese 0.90 + FP 0.10 + MEI 0.80). 2026 = **31.50%** (MEI 0.90). The brief's 31.5% and tramo 12 minimum of €1,928.10 are re-verified.
- **Tarifa plana:** **€80/month** plus MEI on the tramo 1 minimum base. 2026: 80 + 0.9% × 950.98 = **€88.56**, which matches the real receipts. TGSS's own guide says €88.64, which is inconsistent with its own parameters. The tarifa plana runs 12 full calendar months, extendable 12 more only if net income is below the SMI (2026: **€17,094/yr**). It is never regularised, and cese and FP are not contributed during it.
- **Biggest Bizkaia-specific finding:** Bizkaia's own pages call the figure *before* the 20/15/10% simplificada reduction the "rendimiento neto previo" ("podrá minorar su rendimiento neto previo…"). Taken literally, SS income for a Bizkaia simplificada taxpayer = **ingresos − gastos (before the 20/15/10%)**, unlike common Spain, where the AEAT figure is *after* the difícil-justificación deduction. This is **strongly indicated but not confirmed**; see §2.
- **Basque/Bizkaia aid:** there is **no "cuota cero" in Euskadi**. The main 2026 schemes are:
  - Lanbide consolidation grant: €2,500, +15% under 30, +15% women. Requires prior unemployment. 2026 window **1–30 Oct 2026, closed**.
  - DFB "Fomento de Iniciativas Emprendedoras" Área 2: €5,000. For altas between 31/07/2025 and 30/07/2026. Requires prior unemployment and DFB-route advisory and training. Both 2026 calls are closed.
  - SPRI Ekintzaile: up to €30,000, for BIC-tutored innovative projects. Open until **11 Dec 2026**.
  - All of these are taxable activity income in foral IRPF (none is in art. 9 NF 13/2013). Only capitalised unemployment (pago único) is exempt.
- **New this autumn:** RDL 31/2026 (BOE 21/10/2026) adds an explicit RETA IT rule. The IT base reguladora is the base of the month before the previous month ÷ 30 (new LGSS art. 318.h). Its **convalidation is not yet recorded** in BOE.

---

## 1. Contributions by real income (cotización por rendimientos)

### Plain explanation

Each year you pick a **provisional monthly base** within the tramo that matches your forecast average monthly net income, and you pay base × rate every month. Once the tax administration reports your actual income, the TGSS regularises the year:

- If your average base was **below the minimum** of your real tramo, you pay the difference.
- If it was **above the maximum**, you get a refund.
- If it fell **inside the tramo's range**, nothing changes.

### Formula

```
# provisional, monthly
cuota_mes = base_elegida × tipo_total(year)        # prorated by days if alta/baja mid-month
tipo_total = CC + CP + cese + FP + MEI(year)

# tramo lookup (used at alta/base change with the forecast, and at regularisation with actuals)
rend_mensual = rend_computable_anual_neto / dias_alta_regularizables × 30
tramo = first T in tabla(year) where rend_mensual in T.range
# reduced table if rend_mensual < 1,166.70; general table otherwise
```

Sources for the formula:
- Elección de base: LGSS art. 308.1.a) reglas 1ª–3ª [V]
- Cuota = base × tipos: LGSS art. 308.1.b) [V]
- Promedio mensual = rendimientos / días de alta × 30: RD 2064/1995 art. 44.2.a) and art. 46.2 regla 2ª [V]

### Parameter table — 2025 and 2026 tramos (€/month)

Sources:
- 2025: Orden PJC/178/2025 art. 18.1 (BOE-A-2025-3780) [V]
- 2026: Orden PJC/297/2026 art. 18.1 (BOE-A-2026-7296, BOE 31/03/2026) [V]
- Legal basis for 2026 = 2025 tables: RDL 3/2026 art. 3.4 (BOE-A-2026-2548, convalidated by Resolution of 26/02/2026) [V]

Cuota columns are computed as base × rate (2025: 31.40%, 2026: 31.50%).

| Tramo | Rend. neto mensual | Base mín. | Base máx. 2025 | Base máx. 2026 | Cuota mín. 2025 | Cuota mín. 2026 | Cuota máx. 2026 |
|---|---|---|---|---|---|---|---|
| Red. 1 | ≤ 670 | 653.59 | 718.94 | 718.94 | 205.23 | 205.88 | 226.47 |
| Red. 2 | > 670 ≤ 900 | 718.95 | 900.00 | 900.00 | 225.75 | 226.47 | 283.50 |
| Red. 3 | > 900 < 1,166.70 | 849.67 | 1,166.70 | 1,166.70 | 266.80 | 267.65 | 367.51 |
| Gen. 1 | ≥ 1,166.70 ≤ 1,300 | 950.98 | 1,300.00 | 1,300.00 | 298.61 | 299.56 | 409.50 |
| Gen. 2 | > 1,300 ≤ 1,500 | 960.78 | 1,500.00 | 1,500.00 | 301.68 | 302.65 | 472.50 |
| Gen. 3 | > 1,500 ≤ 1,700 | 960.78 | 1,700.00 | 1,700.00 | 301.68 | 302.65 | 535.50 |
| Gen. 4 | > 1,700 ≤ 1,850 | 1,143.79 | 1,850.00 | 1,850.00 | 359.15 | 360.29 | 582.75 |
| Gen. 5 | > 1,850 ≤ 2,030 | 1,209.15 | 2,030.00 | 2,030.00 | 379.67 | 380.88 | 639.45 |
| Gen. 6 | > 2,030 ≤ 2,330 | 1,274.51 | 2,330.00 | 2,330.00 | 400.20 | 401.47 | 733.95 |
| Gen. 7 | > 2,330 ≤ 2,760 | 1,356.21 | 2,760.00 | 2,760.00 | 425.85 | 427.21 | 869.40 |
| Gen. 8 | > 2,760 ≤ 3,190 | 1,437.91 | 3,190.00 | 3,190.00 | 451.50 | 452.94 | 1,004.85 |
| Gen. 9 | > 3,190 ≤ 3,620 | 1,519.61 | 3,620.00 | 3,620.00 | 477.16 | 478.68 | 1,140.30 |
| Gen. 10 | > 3,620 ≤ 4,050 | 1,601.31 | 4,050.00 | 4,050.00 | 502.81 | 504.41 | 1,275.75 |
| Gen. 11 | > 4,050 ≤ 6,000 | 1,732.03 | 4,909.50 | **5,101.20** | 543.86 | 545.59 | 1,606.88 |
| Gen. 12 | > 6,000 | **1,928.10** | 4,909.50 | **5,101.20** | 605.42 | **607.35** | 1,606.88 |

The absolute RETA maximum base, whatever the income, is €4,909.50 in 2025 and €5,101.20 in 2026 (each Orden, art. 18.1).

**2027:** no table exists [V as of 1 Nov 2026: EFE in [Alicante Plaza, 01/11/2026](https://alicanteplaza.es/alicanteplaza/espana/los-autonomos-afrontan-2027-con-la-reforma-del-sistema-de-cotizacion-bloqueada) says autónomos are "sin conocer las cuotas que pagarán en 2027" and that negotiation is frozen until after the elections].
- The October 2025 ministry proposal was withdrawn [S]. It would have set the 2027 general table between ≈€313 and €1,002/month.
- The 2022 law expects the 2026–2028 tables in the LPGE (RDL 13/2022 DT 1ª) [V]. Without an LPGE, the most likely outcome is another RDL extension, as happened in 2026.
- **Calculator default for 2027:** 2026 bases, plus the 2027 general maximum base once it is published (it moved €4,909.50 → €5,101.20 in 2026), plus MEI 1.0%. Flag this as a projection.

### Rate breakdown (% of the chosen base)

| Component | 2025 | 2026 | 2027 | Source |
|---|---|---|---|---|
| Contingencias comunes (CC) | 28.30 | 28.30 | 28.30 (no change announced) | Orden 2025/2026 art. 18.2.a [V] |
| Contingencias profesionales (CP): 0.66 IT + 0.64 IP/MS | 1.30 | 1.30 | 1.30 | art. 18.2.b [V] |
| Cese de actividad | 0.90 | 0.90 | 0.90 | art. 37.5.a [V] |
| Formación profesional | 0.10 | 0.10 | 0.10 | art. 37.6 [V] |
| MEI | 0.80 | 0.90 | **1.00** | LGSS DT 43ª (scale 2023–2029: 0.6 / 0.7 / 0.8 / 0.9 / 1.0 / 1.1 / 1.2) [V] |
| **Total** | **31.40** | **31.50** | **31.60** | |

Notes:
- Base for cese and FP = the chosen base (Orden art. 37.1) [V].
- If IT is covered in another régimen (pluriactividad) and you don't opt in, the CC cuota is reduced by a coefficient of **0.055** (art. 18.2.a) [V].
- People without CP cover pay an additional **0.10%** (art. 18.2.b) [V].
- The mutua receives 0.06 × CC cuota for IT management (Orden 2026 art. 30.2). This is internal and doesn't affect the person.

### Edge cases

- **Up to 31 Dec 2022 legacy bases:** people registered on 31/12/2022 can keep a higher legacy base (RDL 13/2022 DT 6ª; Orden 2026 art. 18.5) [V]. Not relevant for new altas.
- **Societarios / familiares (305.2.b, e, k):** minimum base = Régimen General group 7 minimum, and the generic deduction is 3% (LGSS 308.1.a regla 4ª; 308.1.c regla 2ª) [V].
- **Late alta / alta de oficio:** base mínima of general tramo 1, and that period is never regularised (LGSS 308.1.a regla 5ª; RD 2064/1995 art. 44.3.c–d) [V].
- **No IRPF return filed, or zero income declared under estimación directa:** the definitive base = RG group 7 minimum (LGSS 308.1.c regla 5ª) [V].

---

## 2. Rendimiento neto computable for SS — and the Bizkaia interaction

### What state law says

LGSS art. 308.1.c) regla 1ª [V]: the computable income is computed "de acuerdo con lo previsto en las normas del IRPF". For **estimación directa** it is the **rendimiento neto, increased by the titular's own SS cuotas**.

Regla 2ª [V]: deduct **7%** gastos genéricos. The rate is 3% for 305.2.b/e (administradores and socios), provided they were in alta ≥90 days in the year.

RD 2064/1995 art. 46.1 [V] adds that the figures come from "las normas de los impuestos sobre la renta de las personas físicas existentes en el ámbito de **cada Administración tributaria**". This explicitly allows foral IRPF figures.

**Import@ss guide (TGSS)** [V]: [portal.seg-social.gob.es … /Trabajo+Autonomo/guia](https://portal.seg-social.gob.es/wps/portal/importass/importass/Colectivos/Trabajo+Autonomo/guia), section "¿Cómo calculo mis rendimientos?":

- AEAT casillas for estimación directa: **0224 + 0186 + 0196 − 0197**. That is rendimiento neto + own SS cuotas + any prior-year RETA regularisation paid − any refunded.
- For simplificada through an ERAR, it gives "Rendimiento neto – Provisiones deducibles y **gastos de difícil justificación**" (1577−1579). So in common Spain the SS figure is *after* the difícil-justificación deduction and *before* the art. 32 LIRPF reductions (such as the start-up reduction).
- It also says "si debes tributar en … Haciendas Forales … las casillas anteriores **variarán** según las normas del IRPF aplicables en dichos territorios forales". It links to bizkaia.eus.

### What Hacienda Foral de Bizkaia sends

Source [V]: [bizkaia.eus — "Nuevo sistema de cotización de la Seguridad Social para autónomos"](https://www.bizkaia.eus/es/nuevo-sistema-cotizacion-seguridad-social-autonomos)

> "Los rendimientos informados se extraen de la declaración de renta … En concreto la información que consta en el campo **rendimiento neto previo atribuido** de la declaración … El dato informado se corresponde con el sumatorio de estos campos para todas las actividades económicas … cualquiera que sea el método de determinación del rendimiento … Si se ha recibido una liquidación posterior … el dato informado será el rendimiento neto previo atribuido modificado."

For socios and administradores, Bizkaia also reports Modelo 190 claves A, E (01–04), F (01–07), L (15, 24, 25, 26, 30, 31) and Modelo 193 clave A (01, 02, 05, 07, 08, 09).

### What "rendimiento neto previo" means in Bizkaia

Hacienda Foral uses the term for the figure **before** the simplificada flat-rate reduction:

- [bizkaia.eus notice 900004921](https://www.bizkaia.eus/ogasuna/guregida/noticia.asp?Idioma=ca&idregistro=900004921) [V]: "**Sobre el rendimiento neto previo se aplica una deducción a tanto alzado**" and "Desde el 1 de enero de 2025 la deducción a tanto alzado sobre el rendimiento neto previo varía…". It also says the prior-year rendimiento neto previo "no se eleva al año" in a start year.
- Bizkaia Gure Gida, as quoted in search results [S]: "podrá **minorar su rendimiento neto previo** en un 10%…".
- NF 13/2013 art. 28.1.b) [V, `law/` copy] calls the same magnitude "la diferencia entre los ingresos y los gastos". The 20/15/10% "minorará" it.

### Resulting formula (Bizkaia, estimación directa simplificada)

```
dif        = ingresos − gastos_deducibles            # gastos INCLUDE own RETA cuotas (deductible expense)
                                                     # = "rendimiento neto previo" (Bizkaia usage)
# --- reading A (literal Bizkaia page; preferred, see confidence below) ---
rend_SS_base = dif
# --- reading B (common-Spain analogy: after the difícil-justificación-type reduction) ---
rend_SS_base = dif × (1 − pct_simplificada)          # pct = 20/15/10% by PRIOR-year dif (art. 28.1.b)

rend_SS = rend_SS_base + cuotas_RETA_propias_año (+ regularización RETA pagada − devuelta)   # LGSS 308.1.c r.1ª
rend_SS_neto = rend_SS × (1 − 0.07)                  # 0.03 for societarios 305.2.b/e
rend_mensual = rend_SS_neto / dias_alta_regularizables × 30
```

Neither reading applies the **art. 25.5 start-up reduction** (10%, or 15% for women). It applies *after* the previo figure ("una vez aplicado… lo dispuesto en el apartado anterior"), and the common-Spain casilla 0224 is also before the art. 32 reductions. The same goes for the **art. 25.4 irregular-income percentages**.

**Confidence:**
- Reading A is what the Bizkaia page literally says, given Bizkaia's own definition of "rendimiento neto previo" [V for each piece; the combination is my inference].
- I found no Bizkaia document showing the Renta form field layout ("rendimiento neto previo **atribuido**") or saying whether the TGSS adds back the cuotas for foral data. Mark as **[?] high-impact open item**.
- For high earners the reading doesn't matter: anything above ≈€6,452/month of dif lands in tramo 12 either way. It matters near tramo boundaries. A 20% difference moves income across one to three tramos in the €1,300–4,050 band.

### Edge cases

- **The whole year's income is divided by regularisable days only** (RD 2064/1995 art. 46.2 reglas 1ª–2ª: days of tarifa plana periods are deducted). In a year that is partly tarifa plana, this literally inflates the monthly average.
  - For the 2nd tarifa plana period, LETA art. 38 ter.6 instead takes the *proportional* share of the year's income.
  - The practice for 1st-period years is [?].
- **IT benefits received are activity income in Bizkaia.** NF 13/2013 art. 18.1 2nd paragraph: IT-type benefits for people with economic activities "se computarán como rendimiento de las mismas" [V]. So they flow into the SS income figure too.
- **Grants** (Lanbide, DFB) are activity income: they are not in art. 9 NF 13/2013, so they raise both IRPF and SS income (see §5).
- **Later foral liquidación changes income:** Hacienda Foral sends the corrected figure (Bizkaia page) [V].
  - If income goes down, you can ask for a refund (LGSS 308.1.c regla 6ª) [V].
  - If income goes up, the case goes to the Inspección de Trabajo [V].

---

## 3. Previsión, base changes, regularisation

### Plain explanation

At alta you declare your forecast average monthly net income and choose a base within that tramo (RD 2064/1995 art. 44.4–5) [V]. You can change the base **up to 6 times a year**, and each change takes effect on a fixed date. The year's provisional bases are regularised once the tax data arrives, normally **more than a year later**.

### Base-change calendar

Source: RD 2064/1995 art. 45.1 [V]; Import@ss guide [V].

| Request between | Takes effect |
|---|---|
| 1 Jan – last day of Feb | 1 Mar |
| 1 Mar – 30 Apr | 1 May |
| 1 May – 30 Jun | 1 Jul |
| 1 Jul – 31 Aug | 1 Sep |
| 1 Sep – 31 Oct | 1 Nov |
| 1 Nov – 31 Dec | 1 Jan (next year) |

Each request must include a new forecast (art. 45.2) [V]. A change requested during IT takes effect the day after the medical discharge (Orden 2026 art. 37.4; Import@ss guide) [V].

### Regularisation formula

Source: LGSS 308.1.c reglas 3ª–4ª; RD 2064/1995 art. 46.2 [V].

```
days_reg = dias_alta(year) − days(tarifa_plana, late/oficio alta, prestaciones periods, months used in a base reguladora)
avg_prov_base = (Σ monthly provisional bases − proportional bases of excluded days) / days_reg × 30
tramo = lookup(rend_mensual)                       # §1/§2
if avg_prov_base < tramo.min:  definitive = tramo.min → pay Σ (min − prov_m) × tipo_m
elif avg_prov_base > tramo.max: definitive = tramo.max → refund Σ (prov_m − max) × tipo_m
else: provisional bases become definitive (no change)
# partial months: tramo min/max prorated by days in alta (art. 46.2 r.5ª d)
# rates applied = those in force in each month regularised (r.7ª)
```

### Deadlines and money

All [V] unless marked otherwise.

- **Amounts due:** pay by the last day of the month after notification, with no interest or recargo. After that, recargo 10% (within the following month), then 20% (LGSS 308.1.c r.4ª; Import@ss guide).
- **Refunds:** paid ex officio, without interest, before **30 April** of the year after the tax administration reports the income (308.1.c r.4ª; RD 2064 art. 46.2 r.5ª c).
- **Unpaid provisional cuotas** that reached apremio are not refunded or changed downward. Recargos and interest are never refunded (308.1.c r.4ª).
- **Timing in practice:**
  - 2024 income: data received 25 Nov 2025, resolutions Jan–Mar 2026, refunds finished **15 Apr 2026** ([TGSS regularisation page](https://www.seg-social.es/wps/portal/wss/internet/HerramientasWeb/a0f05310-9c20-45ba-9dd2-47c9e88f34c1/4a7e4a73-afc6-4327-a462-048d35592cd7?changeLanguage=es)) [V].
  - So year N is regularised in roughly Jan–Apr of N+2.
  - 2025 regularisation: expected early 2027 [?].
- **If you never change your base:** the provisional base stays and the whole difference is settled in one lump at regularisation. There is no penalty if you pay within the deadline.
  - Risk: a large cash call about 15–18 months later.
  - Upside: you may keep the higher-base benefits; any months already used for a benefit's base reguladora become final (LGSS 309).

### Edge cases

- **Benefit periods are not regularised and become final** (LGSS 309.1; RDL 31/2026 rewrites 309.1 with effect 1/1/2027 and adds cuidado de menores con cáncer) [V]. Excluded periods: IT, maternity/paternity, risk during pregnancy, cese, and the months used in a base reguladora.
- **Tarifa plana months are excluded** from regularisation (RD 2064 art. 46.1 §3) [V].
- **Base after the tarifa plana ends:** LETA art. 38 ter.8 says "procederá la cotización por todas las contingencias" from the 1st of the following month [V]. Which provisional base the TGSS applies by default (tramo 1 minimum? the base implied by the forecast declared at alta?) is **[?]**.
  - A change requested in Jul–Aug would only take effect 1 Sep.

---

## 4. Tarifa plana, SMI, other reductions/bonuses, alta/baja day rules

### Tarifa plana (cuota reducida por inicio de actividad)

Source: **LETA (Ley 20/2007) art. 38 ter** [V]; amount: RDL 13/2022 DT 5ª [V].

**Amount:**
- DT 5ª fixed **€80/month for 2023–2025** and says that "a partir del año 2026, el importe … será fijado por la LPGE".
- No 2026 LPGE exists, and neither RDL 3/2026 nor the Orden PJC/297/2026 sets a new amount.
- TGSS keeps applying €80 (Import@ss guide: "una cuota de 80 € al mes durante los primeros 12 meses") [V for practice; **[?] for the explicit 2026 legal basis**].

**MEI on top:** MEI is outside the reduced cuota. It is charged on the base mínima of general tramo 1 (the tarifa plana base is that base: RD 2064 art. 44.3.f) [V].

```
cuota_TP(year) = 80 + MEI(year) × base_min_tramo1_general(year)
2025: 80 + 0.008 × 950.98 = 87.61
2026: 80 + 0.009 × 950.98 = 88.56   ← matches real TGSS receipts
2027: 80 + 0.010 × 950.98 = 89.51   (if base and €80 unchanged) [projection]
```

The Import@ss guide's "88,64 €" is inconsistent with the TGSS's own parameters and the real receipts. Use 88.56.

**Rules:**

| Rule | Detail | Source |
|---|---|---|
| Who | Initial alta, or **no alta in RETA in the previous 2 years** (3 years if you had the reduction last time) | 38 ter (intro) and ter.4 [V] |
| Period 1 | Fecha de efectos del alta + the **12 full calendar months** that follow (alta mid-month = partial month + 12) | 38 ter.1 [V] |
| Covers | CC + CP. **Exempt from cese and FP**, so no cese entitlement accrues | 38 ter.1 [V] |
| Period 2 | Another 12 full months if net income (308.1.c definition) **< annual SMI**. If the period spans two years, the test applies in each year. Must be requested before it starts, with a declaration of expected income | 38 ter.2–3 [V] |
| Disability ≥33%, gender-violence or terrorism victims | 24 + 36 months. Amount (2023–25): €80 for 24 months, then €160 | 38 ter.10; DT 5ª [V] |
| Excluded | Relatives up to the 2nd degree joining as familiar colaborador; religious | 38 ter.11 [V] |
| Ends | On baja during the period, the right is lost. Voluntary waiver takes effect the 1st of the following month | 38 ter.3–4 [V] |
| Benefits during it | Calculated on the base mínima of general tramo 1 (€950.98) | 38 ter.5 [V] |
| Regularisation | Period 1: never. Period 2: only if income ≥ SMI in that year, and only the proportional share of the year's income for the affected months | 38 ter.6; RD 2064 art. 46.1 [V] |
| Employees | Hiring staff doesn't cancel it | 38 ter.7 [V] |
| Applies to societarios too | Yes | 38 ter.9 [V] |

**SMI:**
- 2026: **€1,221/month × 14 = €17,094/yr** (RD 126/2026, BOE-A-2026-3815, effects 1/1/2026) [V via multiple legal publishers; BOE text not opened].
- 2025: €1,184 × 14 = €16,576 (RD 87/2025) [S].


### Other bonuses and reductions (current RETA)

| Measure | Formula | Source |
|---|---|---|
| Birth/adoption/foster rest, risk in pregnancy or lactation | 100% bonus on CC cuota = avg base of the prior 12 months × CC rate (excl. IT part). With <12 months in alta: Σ bases / days × 30. Not changed by later regularisation | LETA art. 38 [V] |
| Return to work within 2 years after cese for birth/adoption (women) | 80% of CC cuota on the avg base of the 12 months before the cese, for 24 months | LETA art. 38 bis [V] |
| Carer of a child with cancer or serious illness | 75% of CC cuota on the 12-month avg base while receiving the benefit | LETA art. 38 quater [V] |
| Conciliación (hiring a carer) | Kept but not detailed here | LETA art. 30 [V title only] |
| Startup founder (Ley 28/2022) who is also employed | 100% of the minimum-base cuota for 3 years | LETA art. 38 quinquies [V] |
| **Pluriactividad** (employee + autónomo) | Refund of **50% of the excess** of total CC contributions (RETA + RG employer + employee) over **€17,323.68 (2026)** / **€16,672.66 (2025)**, capped at 50% of the RETA CC cuotas. Paid within 4 months of the regularisation. The pre-2023 50%/25% base reductions for new pluriactividad were repealed (old LETA art. 31 repealed by RDL 13/2022) | LGSS art. 313; Orden 2026 art. 18.8; Orden 2025 art. 18.8 [V] |

### Alta/baja day rules

Source: RD 84/1996 art. 46.2 and 46.4, quoted via [supercontable](https://www.supercontable.com/informacion/laboral/Art.46_RD.84-1996-_inscripcion_de_empresas_y_afiliacion_.html) [S, verbatim quotes]; Import@ss guide [V].

```
altas_this_year ≤ 3  → effect from the actual start day
altas_this_year > 3 or late alta → effect from the 1st of that month
bajas_this_year ≤ 3  → effect from the actual cese day
bajas_this_year > 3  → effect at the end of that month
cuota for a partial month = monthly cuota × days_in_alta / 30   (days-based; RD 2064 art. 46.2 r.5ª d for regularisation)
```

- Alta can be filed up to 60 days in advance and no later than the start day.
- Baja can be filed up to 60 days in advance or within 6 days after (Import@ss guide) [V].
- After a baja effective on a day other than the end of the month, there are 90 days of "situación asimilada al alta" [S].

---

## 5. Basque / Bizkaia / Bilbao aid for autónomos (2026)

**Headline:** Euskadi has **no "cuota cero"** (a regional top-up of the tarifa plana) [S: autonomosyemprendedor.es, 08/10/2026]. The schemes below are one-off grants.

| Scheme | Who / conditions | Amount | 2026 window | Source |
|---|---|---|---|---|
| **Lanbide — ayudas a la consolidación de una actividad empresarial 2026** | Unemployed and registered as a job seeker the day before the IAE alta. IAE + RETA alta between **1 Nov 2025** and the application date. Fiscal, social domicile and workplace in the CAPV. Not a previous recipient of this line. Age 18+ | **€2,500**; +15% if aged 18–30; +15% if a woman (whether these stack on the base or compound isn't specified). CB/SC cap €6,000. Paid 50% on award, 50% against receipts. Eligible costs over 10 months: **RETA cuotas** (if not already funded by another administration), advisory/gestoría, web, communication, training, premises rent | **1–30 Oct 2026, closed** (Resolución 21/09/2026; €1.9M budget) | [euskadi.eus apec-2026](https://www.euskadi.eus/ayuda_subvencion/2026/apec-2026/web01-tramite/es/) [V] |
| Lanbide — puesta en marcha / idea development (2026 package) | Entrepreneurs; full rules in BOPV | €2,000 base; +10% aged 18–30, +15% women (press release) | Opened on BOPV publication (Sept 2026) | [euskadi.eus news 22/09/2026](https://www.euskadi.eus/noticia/2026/lanbide-destina-mas-de-43-millones-para-impulsar-la-contratacion-el-emprendimiento-la-inclusion-sociolaboral-y-el-relevo-generacional/web01-ejeduki/es/) [V press release; bases not read] |
| Lanbide — cuotas for capitalised unemployment (pago único) | People taking unemployment benefit as a lump sum | 50% of the minimum autónomo cuota or 100% of the worker's share (2024 call) | 2024 page; 2026 call [?] | [lanbide 2024](https://www.lanbide.euskadi.eus/ayuda_subvencion/2024/cuots-2024/weblan00-content/es/) [S] |
| **DFB — Fomento de Iniciativas Emprendedoras 2026, Área 2 (puesta en marcha)** — DF 137/2025 (BOB 09/01/2026); 2nd call Orden Foral 4248/2026 (9 Jul) | Alta in economic activity at Hacienda Foral de Bizkaia **between 31/07/2025 and 30/07/2026**. A promoter was unemployed (or <40% contract, ERTE/ERE, or non-labour internship) before alta. RETA alta. Advisory with an Área 1 entity + Escuela de Emprendimiento training + business plan. Domicile and workplace in Bizkaia. Reportedly 3 months' empadronamiento. "Negocios digitales" reportedly excluded. No grant in the last 5 years | **€5,000** + €2,000 per extra promoter (max €15,000). Reduced pro rata if RETA alta comes after the IAE alta | 1st call 16/03–08/04/2026; 2nd ≈ 15–30/07/2026; both closed | [leartibaifundazioa.eus](https://leartibaifundazioa.eus/es/ekintzailetza_dirulaguntzak/fomento-de-iniciativas-emprendedoras-ayudas-a-la-puesta-en-marcha-y-creacion-de-empresas/), [dirulaguntzak.eus](https://dirulaguntzak.eus/es/xehetasuna/481005eb-86fd-4a05-9364-feafb1cd0201/) [S — bases in BOB not read] |
| DFB/BEAZ — Creación de Empresas Innovadoras | Innovative companies (mostly sociedades) | varies | 2nd call closed 11/09/2026 | [gazteak.bizkaia.eus](https://gazteak.bizkaia.eus/es/-/creaci%C3%B3n-de-empresas-innovadoras) [S] |
| **SPRI — Ekintzaile 2026** (Basque Govt) | Innovative or industrial projects tutored by a BIC (e.g. BIC Bizkaia/BEAZ) | up to **€30,000** non-repayable | 17/03 – **11/12/2026** (open) | [spri.eus](https://www.spri.eus/es/ayudas/ekintzaile/) [S] |
| Bilbao Ekintza | No 2026 city-level start-up grant found. It runs the vacant-premises (lonjas) and façade programmes (≤ €6,000) and acts as the local entity for Lanbide lines | — | — | [S] |

### How grants are taxed (foral IRPF)

- Grants linked to the activity are **activity income**. NF 13/2013 art. 25 applies the IS rules, with current grants recognised when accrued [inference from NF 13/2013 art. 25.1–3 + IS rules; V that they are **not** in the art. 9 exemption list].
- Under simplificada, they sit inside ingresos, so the 20/15/10% applies. They also raise SS computable income (§2).
- **Exempt:** unemployment benefit taken as a lump sum (pago único) used for the activity, if the activity is kept for 5 years (NF 13/2013 art. 9.13) [V]. Birth and childcare benefits (art. 9.12.b) [V].
- **Taxable as employment income:** cese de actividad benefit (art. 16.b) [V].
- **IT benefits for autónomos:** computed as activity income (art. 18.1 2nd paragraph) [V].

---

## 6. Coverage: IT and cese de actividad

### Incapacidad temporal (IT)

Sources:
- Base reguladora: LGSS art. 318.h (added by RDL 31/2026, BOE 21/10/2026) [V]
- Percentages: [seg-social IT cuantía page](https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/PrestacionesPensionesTrabajadores/10952/28362/28365/cuantia) [V]
- Waiting days and qualifying period: LGSS 172–173; Import@ss guide [V]

```
BR_diaria = base_cotización(month M−2 relative to the baja month) / 30
  # alta in the same month as the baja → that month's base; alta in month M−1 → M−1's base  (318.h)
  # during tarifa plana: base = base_min_tramo1_general (950.98) → BR = 31.70 €/day   (38 ter.5)
common illness / non-work accident (needs 180 days contributed in the last 5 years):
  days 1–3: 0
  days 4–20: 60% × BR      (paid by the mutua; no "employer days" for autónomos — 318.h last para)
  day 21+:   75% × BR
work accident / occupational disease (no qualifying period): 75% × BR from the day after the baja
after 60 days of IT: the mutua/SEPE pays the autónomo's cuotas (LGSS 309.2)
```

**Examples:**
- Tarifa plana: €19.02/day (days 4–20), €23.77/day (day 21+).
- Tramo 12 minimum base €1,928.10: €38.56/day, then €48.20/day.

**Since 2019 IT, CP and cese are mandatory for most autónomos** (RDL 28/2018) [S; consistent with the 2026 Orden only charging the 0.10% surcharge to those without CP].

### Cese de actividad ("paro de autónomos")

Source: LGSS arts. 330, 331, 338, 339 [V].

```
eligible if: in alta + up to date with cuotas (30-day grace to pay) + ≥12 months of CESE contributions
             (within the last 48, ≥12 of them in the last 24) + situación legal de cese
             + activity agreement with the employment service (Lanbide)
BR = average of the bases of the 12 continuous months before the cese
amount = 70% × BR   (50% for 331.1.a 4º/5º and partial force majeure)
IPREM_m = 600 × 7/6 = 700 (2026; IPREM frozen at €600 since 2023 [S])
max: 175% IPREM_m = 1,225 (no children) | 200% = 1,400 (1 child) | 225% = 1,575 (2+ children)
min: 80% IPREM_m = 560 (no children) | 107% = 749 (children)
duration by months contributed (within 48): 12–17→4 | 18–23→6 | 24–29→8 | 30–35→10 | 36–42→12 | 43–47→16 | 48+→24
cuota during the benefit: paid at the BR (≥ the minimum base) (Orden 2026 art. 37.3)
re-application: ≥18 months after the last recognition (338.3)
```

**Legal cese situations** (art. 331) include:
- Losses >10% of income over a full year (excluding the first year).
- Enforcement actions ≥30% of the prior year's income.
- Insolvency (concurso).
- Force majeure.
- Loss of a required licence.
- Gender violence.
- Divorce, for familiares.
- For TRADEs, termination of the contract with the main client (art. 333).

**Not covered:** voluntary cese (331.2.a).

**Tarifa plana months don't count**, because no cese is contributed (38 ter.1).

---

## Unverified / open

1. **[High] Which foral figure feeds SS.** Bizkaia says it sends "rendimiento neto previo atribuido", and its own usage puts "rendimiento neto previo" *before* the 20/15/10% minoración. Still to confirm:
   - the Renta 2025 form field layout (is "previo atribuido" before the minoración?);
   - whether the TGSS adds back the RETA cuotas for foral data, as LGSS 308.1.c requires.
   - Ways to settle it: a regularisation resolution for a Bizkaia taxpayer, a CASIA query to the TGSS, or a Bizkaia Hacienda FAQ. The calculator should expose both readings as a toggle.
2. **2027 RETA table:** not published. Default to the 2026 bases + MEI 1.0% and label it as a projection. Watch for a new RDL or Orden in Dec 2026 – Mar 2027.
3. **Legal basis for the 2026 €80 tarifa plana:** RDL 13/2022 DT 5ª defers 2026+ amounts to the LPGE. I found no 2026 provision; the €80 rests on TGSS practice. Also unclear whether the €160 for the special groups continues.
4. **RDL 31/2026** (IT rules for autónomos, art. 318.h; art. 309 from 2027): convalidation not shown in BOE as of today. The deadline is about 30 working days from 21/10/2026.
5. **Default provisional base after the tarifa plana ends**, and how a 1st-period tarifa plana year's income is spread (whole-year income ÷ non-tarifa-plana days, literal RD 2064 art. 46.2) vs practice.
6. **SMI 2026** taken from legal publishers (RD 126/2026); BOE text not opened. **IPREM 2026 = €600** from secondary sources (the LPGE 2023 extension).
7. **Basque aid:**
   - DFB 2026 bases (BOB) not read directly; empadronamiento, the "negocios digitales" exclusion and the 2nd-call dates come from secondary sources.
   - 2027 DFB/Lanbide calls not yet published.
   - No Bilbao Ekintza 2026 start-up grant found.
   - BEAZ programmes not researched in depth.
8. **Alta/baja effects:** RD 84/1996 art. 46 quoted via a secondary site (the BOE consolidated page didn't render the article). The 90-day "asimilada al alta" rule is secondary only.
9. **2025 regularisation timing** (expected early 2027) is not announced.
