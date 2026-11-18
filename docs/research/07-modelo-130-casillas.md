# Bizkaia modelo 130, box by box

Research for the calculator's "how to fill in modelo 130 for quarter Q" view, the Bizkaia counterpart of avtonomo.com's AEAT version. Researched on 2026-11-18. **Foral form only.** The Hacienda Foral de Bizkaia 130 is a different form from the AEAT 130: different boxes, no year-to-date accumulation, no art. 110.3 deductions.

The calculation rules (RIRPF arts. 109–111) are in `02-pagos-retenciones-calendario.md` §1 and are not repeated here. This file covers the **form**: what each box holds, how it is derived, and what the official texts say and don't say.

Evidence marks: **[V]** read in the official text, **[S]** secondary source, **[?]** unconfirmed or inferred.

## Sources read

| Short name | What | URL |
|---|---|---|
| OF 636/2014 | Orden Foral 636/2014, de 17 de marzo, del diputado foral de Hacienda y Finanzas, approving modelo 130. BOB nº 57, 24-03-2014, pp. 7128–7132 (PDF pages 40–44). It contains the order itself, the annexed form and the 2014 bilingual instructions. In force from 25-03-2014, applies to periods starting 01-01-2014, repeals OF 184/2012. | https://www.bizkaia.eus/lehendakaritza/Bao_bob/2014/03/20140324a057.pdf#page=40 |
| Form-2018 | The current fillable PDF of modelo 130 ("Impreso (Rellenable)"), footer edition "2018". Downloaded from the official models page. | Listing: https://www.bizkaia.eus/ogasuna/ereduak/modelos.asp?textomodelo=130&idioma=CA&aceptar=Buscar&Tem_Codigo=2093&dpto_biz=5 |
| Inst-current | The current instructions, "130CasInst.pdf", 2 pages. | https://www.bizkaia.eus/fitxategiak/05/ogasuna/ereduak/Argitaratu/130CasInst.pdf |
| RIRPF | DF 47/2014, arts. 109–112 (consolidated, last change 23/03/2026) | https://www.bizkaia.eus/documents/880307/15187815/ca_47_2014.pdf/c17e2f7e-e4dd-789c-235e-21add02afe5e |
| NFIRPF | NF 13/2013, arts. 25, 28 and DT 30ª (consolidated 01/01/2026) | a local copy of the consolidated text |
| NFGT | NF 2/2005, art. 119 (complementarias) | https://www.bizkaia.eus/documents/880307/15187815/ca_2_2005.pdf/42a726d5-08dd-a356-9ed4-70b5bad5a854 |
| FAQs | Hacienda Foral FAQs 900000995, 900000998, 900001000, 900001002, 900001004, 900001005, 900001008, 900004384 (non-binding) | `https://www.bizkaia.eus/ogasuna/faq/faq_detalle.asp?idregistro=<id>&Idioma=CA` |
| Pago | bizkaia.eus "Gestión del pago" page | https://www.bizkaia.eus/es/tramites-tributarios/gestion-pago-impuestos |

No later Orden Foral that amends the 130 boxes was found. The official models page still links OF 636/2014 as "the" order, and the 2018 PDF has exactly the 2014 box layout. [V for the link and layout; ?: an amending order may exist and simply not be indexed]

## Key findings

- **There is one form with four sections**, not separate forms per regime. The filer fills in only the section that applies and leaves the rest blank. Box 28 adds up every section's result. [V Form-2018]
- **The start regime (S, S+1) is the "Inicio actividad" section, boxes 09–12.** The general 5% regime is boxes 01–04. The "rendimiento neto negativo" regime is boxes 15–18 (general) and 19–20 (mayoristas). Agricultural activities use boxes 05–08. [V]
- **Box numbers are not contiguous.** 13, 14 and 21–27 do not exist, and 28 is the total. [V]
- **There is no box for the simplificada % (20/15/10%).** Box 09's label is "Rendimiento neto del trimestre (Ingresos computables − Gastos deducibles)". The instructions only repeat RIRPF 110.1.a: "el 20% de la diferencia entre los ingresos computables y los gastos deducibles devengados en cada trimestre natural". Neither text says whether "gastos deducibles" includes the art. 28 reduction. AEAT's instructions say this explicitly for its own casilla 02; Bizkaia's are silent. **Not resolved.** See the section on the simplificada %.
- **There is no box for earlier quarters' payments or negative results**, unlike AEAT casillas 05/06. **There is no housing or art. 110.3 deduction box** either. The form confirms the non-cumulative design: each quarter stands alone. [V]
- **A negative or zero result must still be filed** ("declaración negativa"). The form has no "negativa" or "sin actividad" tick-box: the result is simply 0 or negative in box 28. [V instructions + RIRPF 111.1; ? how a negative figure is entered]
- **Complementaria:** the current instructions define it as a tick ("Se marcará con una X…"), but the 2018 paper PDF has no such box. It presumably exists only in the electronic filing. [V instructions; ? e-form layout]
- **Withholdings:** the start regime subtracts 100% of the quarter's retenciones (box 11). The general and negative regimes subtract 25% of the penúltimo año's retenciones (boxes 03 and 17). The mayoristas line (20) has **no** withholding box. [V]

## The form, box by box

Header [V Form-2018]:

| Field | Content |
|---|---|
| Ejercicio | Year of the quarter (4 digits) |
| Período | "Trimestral", "N.º Trimestre": 1T / 2T / 3T / 4T |
| Declarante | NIF; Apellidos y nombre |
| N.º liquidación | Pre-printed/assigned (barcode) |
| Declaración complementaria | Only in the instructions (tick X); not on the 2018 PDF [V Inst-current; ?] |
| Fecha y firma declarante | — |
| Justificante de ingreso / Carta de pago | Bank stamp, clave entidad, fecha, importe (paper route) |

### A. Start regime: "Inicio actividad" (years S and S+1). RIRPF 110.1.a last paragraph, 110.2 second paragraph

| Box | Label (form) | How it is computed | Mark |
|---|---|---|---|
| 09 | Rendimiento neto del trimestre (Ingresos computables − Gastos deducibles) | Income **accrued** (devengados) in the calendar quarter, excluding IVA, minus deductible expenses accrued in the same quarter. **Only this quarter**, not year-to-date. Whether it is reduced by the art. 28 % is open (see below). | [V] label; [?] % |
| 10 | Importe pago fraccionado (20% 09) | 20% × box 09 | [V] |
| 11 | Retenciones e ingresos a cuenta del trimestre | Withholdings borne on this quarter's activity income (100%) | [V] |
| 12 | Cuota a ingresar (10 − 11) | 10 − 11 | [V] |

Before box 09, the 70% test applies: in S and S+1, if at least 70% of **this quarter's** professional income bore withholding, **no 130 is filed at all** for that quarter (RIRPF 109.3–4; Inst-current). [V]

### B. General regime (from year S+2). RIRPF 110.1.a first paragraph, 110.2 first paragraph

| Box | Label (form) | How it is computed | Mark |
|---|---|---|---|
| "Año" field | Year of the penúltimo año | Q's year minus 2 | [V] field exists |
| 01 | Total rendimiento neto anual del penúltimo año anterior | Net activity income of year Y−2 (the Renta figure, which for simplificada is already after the art. 28 %). If Y−2 was the start year, **annualise** it ("se elevará al año"). | [V] text; [?] exact annualisation method (days or months) |
| 02 | Importe pago fraccionado (5% 01) | 5% × 01, **each quarter** | [V] |
| 03 | Retenciones e ingresos a cuenta del penúltimo año (25%) | 25% × total retenciones of Y−2 on the activity | [V] |
| 04 | Cuota a ingresar (02 − 03) | 02 − 03 | [V] |

The rule's trigger: this section applies only if box 01 would be **positive**. If Y−2's net income was ≤ 0, use section D instead. [V RIRPF 110.1.a; Inst-current]

### C. Agricultural, livestock, forestry and fishing activities (any year). RIRPF 110.1.b. Not relevant to our persona.

| Box | Label | Computation | Mark |
|---|---|---|---|
| 05 | Volumen de ventas o ingresos del trimestre | Quarter's sales, excluding capital subsidies and indemnities | [V] |
| 06 | Importe pago fraccionado (2% 05) | 2% × 05 | [V] |
| 07 | Retenciones e ingresos a cuenta del trimestre | 100% of the quarter's | [V] |
| 08 | Cuota a ingresar (06 − 07) | 06 − 07 | [V] |

### D. "Rendimiento neto negativo" (from S+2, when Y−2's net income was not positive). RIRPF 110.1.a second paragraph

| Box | Label | Computation | Mark |
|---|---|---|---|
| 15 | Volumen de ventas o ingresos del penúltimo año anterior | Y−2 turnover | [V] |
| 16 | Importe pago fraccionado (0,5% 15) | 0.5% × 15, each quarter | [V] |
| 17 | Retenciones e ingresos a cuenta del penúltimo año (25%) | 25% × Y−2 retenciones | [V] |
| 18 | Cuota a ingresar (16 − 17) | 16 − 17 | [V] |
| 19 | Mayoristas: Volumen de ventas o ingresos del penúltimo año anterior | Y−2 turnover (wholesalers only) | [V] |
| 20 | Mayoristas: Importe pago fraccionado (0,25% 19) | 0.25% × 19. No withholding line and no "cuota" line. | [V] |

### Total

| Box | Label | Computation | Mark |
|---|---|---|---|
| 28 | Total pago fraccionado (04 + 08 + 12 + 18 + 20) | Sum of the section results. This amount goes on the carta de pago. | [V Form-2018, Inst-current] |

Note: the 2014 BOB instructions say "Casillas 07, 11, 29" and "28 = 04 + 08 + 12 + 30 + 18 + 20". Boxes 29 and 30 do not exist on the 2014 or 2018 form. The current instructions drop them. Treat this as an erratum in the 2014 text. [V]

## The simplificada % inside the 130 (open question (e) from file 02)

What the texts say:

1. **Form-2018, box 09:** "Rendimiento neto del trimestre (Ingresos computables − Gastos deducibles)". The label calls it "rendimiento neto" but defines it as income minus expenses. There is no line for the % and no reference to art. 28. [V]
2. **RIRPF 110.1.a and Inst-current:** "el 20 por 100 de la diferencia entre los ingresos computables y los gastos deducibles, devengados en cada trimestre natural". FAQs 900001004/900001005 say the same. [V]
3. **NFIRPF art. 28.1:** in simplificada, (a) income and expenses are quantified **excluding** amortisations and impairments. (b) "la diferencia entre los ingresos y los gastos mencionados en la letra anterior … se minorará en los porcentajes… **en concepto de amortizaciones, pérdidas por deterioro y gastos de difícil justificación**". The rate is 20% if the **previous year's** difference was ≤ €35k, 15% for €35k–85k, and 10% above that. So the % is the only way a simplificada filer deducts amortisations. The Norma treats it as a minoración of the difference, not as an item of "gastos". [V]
4. **NFIRPF DT 30ª.2** calls the same thing "el coeficiente de **gastos** en concepto de amortizaciones, pérdidas por deterioro y gastos de difícil justificación". This leans towards treating it as a kind of deductible expense. [V]
5. **AEAT (common Spain, for contrast only):** its 130 instructions state that casilla 02 includes "gastos de difícil justificación" in simplificada. Bizkaia's instructions have no equivalent sentence. [S, quoted via search; not foral]
6. **Gestoría practice** was to apply 15% "por normativa de confección". No official text sets 15% for the 130. Under art. 28.1.b, a start year whose previous year had no activity would give a difference of 0, so 20%, not 15%. [V for the art. 28 tiers; ? for why 15%]

**Status: not resolved.** No official Bizkaia text says whether box 09 is before or after the art. 28 %. Both readings fit the wording. Facts the calculator can show (no conclusion baked in):

- "Literal" reading: box 09 = income − expenses (no %).
- "Simplificada" reading: box 09 = (income − expenses) × (1 − p), with p from art. 28 based on the previous year's difference (20% for a first year).
- Any overpayment or underpayment is reconciled in the annual Renta. RIRPF 110.3 explicitly allows paying **more** than the computed amount. It has no counterpart allowing less. [V]

To close it: a written query to the Hacienda Foral, or a binding consulta (NFGT), or checking what the e-filing screen's helper does for box 09.

## Other items asked

| Item | Finding | Mark |
|---|---|---|
| Withholdings | Box 11 (start regime: 100% of the quarter's). Boxes 03 and 17 (25% of Y−2's). Box 07 (agricultural, quarter's). None for mayoristas. | [V] |
| Earlier quarters / negative results carried forward | No box. Each quarter is computed in isolation, and no rule carries a negative quarter forward. | [V form; V RIRPF 110 wording] |
| Earlier 130 payments subtracted | No box (unlike AEAT's year-to-date casillas). | [V] |
| Housing or other deductions (AEAT art. 110.3 style: €100 minoración, 2% vivienda) | No box and no rule in RIRPF 109–112. Bizkaia has no equivalent. | [V] |
| Voluntary higher % | Allowed ("Ingreso voluntario", RIRPF 110.3). No dedicated box: just enter higher amounts. | [V] |
| Revision of the base for exceptional circumstances | RIRPF 110.4: on request, the Servicio de Tributos Directos may set the base. No box. | [V] |
| Complementaria | Tick "X" when adding data that was completely omitted from an earlier return for the same period (Inst-current). NFGT art. 119.2: only if the result is a **higher** payment. A lower one goes through rectification (art. 118.2). | [V] |
| Zero / negative ("declaración negativa") | Must be filed even when the result is negative (Inst-current: "No eximirá de la obligación de declarar … resulte negativo"; RIRPF 111.1: "deberán presentar una declaración negativa"; FAQ 900000998). There is no tick-box. Nothing is refunded or carried forward. | [V]; [?] whether the e-form accepts a negative box 12/28 or floors it at 0 |
| "Sin actividad" | No separate concept or box on the form. An autónomo with no income in the quarter files a negativa (unless exempt under the 70% rule, which cannot apply with zero income). | [V form; ? edge case] |
| Exempt (≥70% withheld) | No 130 at all, not even a negativa (RIRPF 109.2–4). | [V] |
| Deadline | 1–25 April, July and October. January runs 1–31 (DF 153/2022 amending DF 112/2009; FAQ 900000997). The 2014/2018 texts still say 1–25 January: they are superseded. | [V] |
| Partial first quarter | FAQ 900001000 says "por cada trimestre completo de actividad" for the 5% rule. Nothing on prorating the start-regime quarter, which is naturally prorated because it uses actual quarter figures. | [V]; [?] 5% rule in a partial quarter |

## How the result is presented and paid

- **Result:** box 28 "Total pago fraccionado". A positive figure is "cuota a ingresar". Zero or negative means a "declaración negativa", with nothing to pay and nothing refunded. There is no "a devolver" or "a compensar" outcome on the 130. [V form + RIRPF 111.1]
- **Paper route (2014/2018 texts):** a 2-copy form ("Ejemplar para el interesado" and "Ejemplar para la Entidad Colaboradora/Administración"), with a "Justificante de ingreso / Carta de pago / Talón de cargo" block stamped by the bank. Per the 2014 instructions it was filed at the Hacienda Foral office or at "Entidades colaboradoras". [V]
- **Electronic route:** filed through BizkaiBai / ebizkaia (procedure 1773 on the official list). Telematic filing of the 130 was first regulated by OF 2.153/2001 (BOB nº 123, 27-06-2001). The PDF is a scan and was not read. [V that it exists; ? its content]
- **Payment methods (generic page, not 130-specific):** [V "Gestión del pago"]
  - **Domiciliación bancaria.** The account must be known to the Hacienda Foral and its holder identified. For "a ingresar" it must be at an **entidad financiera colaboradora**.
  - **Carta de pago,** paid at a bank, an ATM, or the **pasarela de pagos de las Administraciones Vascas** (card, Bizum, TPV, MiPago wallet; max **€6,000**).
  - The "Gestión del pago" procedure also allows aplazamiento, fraccionamiento and compensación.
- **Domiciliación details for the 130 specifically:** the deadline for domiciliación, irrevocability and own-account rules are only known for the 303 (OF 362/2023 art. 4). They are assumed to be analogous. [?]

## Worked example: start regime, Q1, income €15,000, expenses €900, no withholdings

Assumptions: the quarter is 1T of year S or S+1. The professional activity has 0% withholding, so the 70% exemption does not apply and the 130 must be filed. Amounts exclude IVA and are on an accrual basis. Filing window: 1–25 April.

| Box | Literal reading (no %) | With art. 28 % = 20% (first-year tier) | Gestoría practice (15%) |
|---|---|---|---|
| 09 | 15,000 − 900 = **14,100.00** | 14,100 × 0.80 = **11,280.00** | 14,100 × 0.85 = **11,985.00** |
| 10 (20% × 09) | **2,820.00** | **2,256.00** | **2,397.00** |
| 11 | 0.00 | 0.00 | 0.00 |
| 12 (10 − 11) | **2,820.00** | **2,256.00** | **2,397.00** |
| 01–08, 15–20 | blank | blank | blank |
| 28 | **2,820.00** | **2,256.00** | **2,397.00** |

The three columns differ by up to €564 on this quarter. The difference is not lost: the annual Renta (where art. 28 applies for certain) settles it. A quarter with expenses above income would put a negative number in box 09/12, giving a declaración negativa with €0 to pay. That loss is not carried into Q2.

## Unverified / open

1. **Simplificada % in box 09:** no official text resolves it (see the section above). It needs a Hacienda Foral answer or the e-filing helper's behaviour.
2. **Why 15%:** what rule the gestoría's software ("normativa de confección") applies. It does not match the art. 28 tier for a start year (20%).
3. **Electronic form layout:** whether the ebizkaia 130 has a complementaria tick plus a "previous justificante" field, a negativa flag, or computes box 09 itself. Only the 2018 paper PDF and the instructions were read.
4. **Negative values:** whether boxes 12/28 may hold a negative number or are floored at 0 on submission.
5. **Amending orders:** no Orden Foral after OF 636/2014 that changes the 130 boxes was found. The 2018 PDF edition suggests a design refresh, not a legal change. Not confirmed against a BOB index.
6. **Payment conditions for the 130:** domiciliación deadline (e.g. days before the 25th), own-account and irrevocability rules. Only the 303's order (OF 362/2023) and the generic payment page were read. OF 2.153/2001 is a scanned PDF and was not read.
7. **Annualisation in box 01** when Y−2 was the start year: whether by days or by months. Only "se elevará al año" is stated.
8. **5% rule in a partial quarter** (FAQ 900001000 "por cada trimestre completo"): whether a quarter in which the activity started or ended mid-quarter pays a prorated 5%.
