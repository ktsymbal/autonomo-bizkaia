# Disputed rules: resolution (2026-11-19)

This note covers every rule the calculator treated as uncertain: parameters in `src/params/2026.json` with a status other than V, the user settings R2/S1/S2, and the open items in §9 of the design spec. It builds on `01-irpf.md`, `04-reta-ayudas.md` and `07-modelo-130-casillas.md` and does not repeat what those already settled.

Foral rules (NF 13/2013 IRPF, DF 47/2014 RIRPF) apply to IRPF and modelo 130. State law (LGSS, LETA, RD 2064/1995) applies to RETA.

## Summary

| Rule | Result | Engine now |
|---|---|---|
| R2 Which income Social Security uses | **Resolved**: after the 20/15/10 % (reading B), before the start-up reduction | `reta.ssIncomeReading = 'B'` [V]; setting ignored |
| S1 Simplificada % in modelo 130 | **Resolved**: not applied | `p130.simplificadaInside = false` [V]; setting ignored |
| S2 % on a negative difference | **Resolved**: not applied (positive difference only) | always off; setting ignored |
| First-year tier | **Resolved**: 20 %; a part-year prior year is not annualised | `irpf.firstYearTier` [V] |
| S3 Annualising the start year for the year-3 130 | **Still open** (months by analogy) | unchanged (months) |
| Tarifa plana €80 in 2026 | **Still open** on its legal basis; €80 is what the TGSS charges | `reta.tarifaPlana` [P] |
| SMI 2026 | **Resolved**: €17,094 | `smi` [V] |
| Art. 83 ter (women returning to work) | **Resolved**: €1,500 per year away | `irpf.womenReturn` [V] |
| Art. 83 quater (men pausing for childcare) | **Resolved**: up to €200 per year | `irpf.menChildcare` [V] |
| Tax treatment of the RETA pluriactividad refund | **Open** (likely activity income in the year received) | not computed (info only, as before) |
| 2027 parameters, 2027 salary withholding table | **Not published** | still [P], 2026 carried over |

---

## R2: which income figure Social Security uses

**Question.** For a Bizkaia autónomo in estimación directa simplificada, does the TGSS base the RETA tramo and the regularisation on ingresos − gastos *before* the art. 28 NF 20/15/10 % minoración (reading A, the old default) or *after* it (reading B)?

**Answer.** After it (reading B). The minoración counts only on a positive difference. The art. 25.5 start-up reduction is not applied. The engine still adds the person's own RETA cuotas back, as LGSS 308.1.c requires.

**Citations.**
- LGSS art. 308.1.c regla 1ª (https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724): "Para las actividades económicas que determinen el rendimiento neto por el método de estimación directa, el rendimiento computable será el rendimiento neto, incrementado en el importe de las cuotas de la Seguridad Social…". There is no separate rule for simplificada.
- RD 2064/1995 art. 46.1 (https://www.boe.es/buscar/act.php?id=BOE-A-1996-1579) says the figure follows "las normas de los impuestos sobre la renta de las personas físicas existentes en el ámbito de cada Administración tributaria". In Bizkaia the rendimiento neto in simplificada is defined in art. 28 NF, and the minoración is part of that definition.
- Hacienda Foral de Bizkaia, *Nuevo sistema de cotización* (https://www.bizkaia.eus/es/nuevo-sistema-cotizacion-seguridad-social-autonomos). Bizkaia reports to the TGSS "la información que consta en el campo rendimiento neto previo atribuido de la declaración".
- Hacienda Foral de Bizkaia, Gure Gida 2025, table Id 4014 "Estimación directa simplificada: cálculo del rendimiento" (https://www.bizkaia.eus/Ogasuna/GureGida/test_descarga/servir_documento.asp?hash=0C7C51735C554654674653&idioma=CA). I read it in the browser on 2026-11-19. The order is: Diferencia 1 → % compensación Batuz → Diferencia 2 → "(-) COEFICIENTE DE GASTOS (20, 15 o 10 por ciento de la diferencia positiva anterior)" → "= RENDIMIENTO PREVIO" → gains and losses on business assets → "(-) REDUCCIÓN POR INICIO DE ACTIVIDAD" → "= RENDIMIENTO NETO".
- Gipuzkoa's 2025 SS guide is a neighbouring foral territory, so it is supporting evidence only (https://www.gipuzkoa.eus/documents/2456431/79230691/SS+RETA+web+dokumentua+ESP+2025.pdf). It gives the SS figure for simplificada as ingresos − gastos − minoración porcentual.

**Confidence.** Medium-high. Two official Bizkaia texts match term for term: Bizkaia sends the "rendimiento neto previo", and its own table defines that as the amount after the coeficiente. The state rule points the same way. Two things weigh against it:
- Instrucción 900004921 (https://www.bizkaia.eus/ogasuna/guregida/noticia.asp?Idioma=ca&idregistro=900004921) uses "rendimiento neto previo" loosely for the amount *before* the deduction. That wording is what the old reading A rested on.
- Neither the TGSS nor the Diputación has published the field mapping. I found no convenio covering data sent from the Diputación to the TGSS.

**Changed.**
- `src/params/2026.json`: `reta.ssIncomeReading` set to "B" [V].
- `src/engine/reta.ts`: reads the param, not `settings.r2`.
- Tests: `tests/reta.test.ts` (reading B and setting ignored; start-up reduction does not lower SS income; tramo and regularisation figures updated) and `tests/golden.test.ts` (golden year 2 and 3 figures).

**Golden case impact** (€5,000/month, €840/yr expenses), year 2:
- SS income goes from €4,585/month (tramo up to €6,000, base €1,732.03) to €3,967.53/month (tramo up to €4,050, base €1,601.31).
- RETA €6,547 → €6,052.92. IRPF €7,802 → €7,949. Kept €3,734 → €3,763/month. Year-3 Renta −€1,493 → −€1,346.

**Still open.**
1. Whether the TGSS adds the cuotas back to the foral figure. In Bizkaia the cuotas are booked inside gastos (FAQ 900006751), and no published text says the TGSS adds them back. The engine follows LGSS 308.1.c and adds them back. Without the add-back the income figure would be about 7 % of the cuotas lower.
2. The "% compensación Batuz" line is not modelled. It lowers the figure for people who joined Batuz voluntarily.

## S1: the simplificada % inside modelo 130

**Question.** In the start regime (years S and S+1), is box 09 equal to ingresos − gastos, or is it reduced by the art. 28 %? Gestorías apply 15 %.

**Answer.** It is not reduced. Box 09 is the quarter's ingresos computables − gastos deducibles, and box 10 is 20 % of that.

**Citations.**
- RIRPF Bizkaia (DF 47/2014) art. 110.1.a (https://www.bizkaia.eus/documents/880307/27501802/ca_47_2014.pdf/83418d81-7802-a344-9a9c-d6a9dd95b550): "el 20 por 100 de la diferencia entre los ingresos computables y los gastos deducibles, devengados en cada trimestre natural".
- Modelo 130 instructions (https://www.bizkaia.eus/fitxategiak/05/ogasuna/ereduak/Argitaratu/130CasInst.pdf), casilla 10. The wording is the same, with no reference to art. 28 or to gastos de difícil justificación. By contrast, the AEAT instructions do mention gastos de difícil justificación. Bizkaia's do not.
- Hacienda Foral FAQs 900001004 and 900001005: "el 20% de los ingresos computables menos los gastos deducibles del trimestre considerado". FAQs 900004384 and 900004435 say the same.
- RIRPF 110.3 and FAQ 900001008 allow a *higher* percentage. No text allows a lower base.
- Why gestorías use 15 %: before 2025 art. 28 had one flat simplificada %. It was 10 % historically and 15 % for 2022–2024 (FAQs 900001752 and 900004348: "Para los periodos impositivos 2022, 2023 y 2024, era el 15%"; Instrucción 900004921). The 15 % is a carry-over from those years, not a rule for the 130.

**Confidence.** High. Every official text says the same thing, and none mentions the minoración.

**Changed.**
- `src/params/2026.json`: `p130.simplificadaInside` = false [V].
- `src/engine/m130.ts`: reads the param. `s1` is removed from `M130Args`.
- `src/engine/compute.ts`: no longer passes `settings.s1`.
- `tests/m130.test.ts`: box 09 = 14,100 whatever the tier. Spec golden test #2 becomes 20 % × 11,600 = €2,320.00.

**Still open.** I did not check the ebizkaia/BizkaiBai e-form helper. There is no Hacienda Foral consulta on this point.

## S2: the % reduction when the difference is negative

**Question.** If ingresos − gastos < 0, does the 20/15/10 % still apply, which would shrink the loss?

**Answer.** No. The coeficiente applies to a positive difference only.

**Citations.**
- Gure Gida 2025 Id 4014 (URL above): "COEFICIENTE DE GASTOS (20, 15 o 10 por ciento de la diferencia positiva anterior)".
- NF 13/2013 art. 28.1.b ("la cantidad resultante se minorará") says nothing about the sign. The Manual de Renta 2025 (https://www.bizkaia.eus/documents/d/departamento-hacienda-y-finanzas/dfb-renta-2025, PDF p. 236) does not address it either.

**Confidence.** Medium-high. The answer comes from the Hacienda Foral's official guide, not from the Norma itself.

**Changed.**
- `src/engine/irpf.ts` (`activityRN`): `settings.s2` is no longer read.
- `tests/irpf.test.ts`: −5,000 stays −5,000 even with the old setting on.

**Still open.** I did not confirm the modelo 100 behaviour.

## First-year simplificada tier

**Question.** In the start year there is no previous year. Which % applies? And when the previous year was a part year, is its difference annualised for the tier?

**Answer.**
- With no previous year, 20 %. Art. 28.1.b gives 20 % when the prior year's difference "no haya superado" €35,000, and with no prior activity that difference is nil.
- A part-year previous year is **not** annualised.

**Citations.**
- NF 13/2013 art. 28.1.b, consolidated text (https://www.bizkaia.eus/documents/880307/27501802/ca_13_2013.pdf).
- Instrucción 900004921 (URL above): "A falta de desarrollo reglamentario el rendimiento neto previo del ejercicio anterior no se eleva al año en los supuestos de inicio de actividad."
- The Manual de Renta 2025 (PDF pp. 236–237 and 243–244) works only an example with a known prior year.

**Confidence.**
- No annualisation: high.
- 20 % with no prior year: medium-high. It follows from the literal wording, and no official text says otherwise.

**Changed.**
- `src/params/2026.json`: `irpf.firstYearTier` [V].
- The engine already used 20 % and did not annualise.
- Tests: `tests/irpf.test.ts` (first year 20 %, now verified) and `tests/golden.test.ts` (an alta in October 2026 at €5,000/month gives a 2027 tier of 20 %, not the 15 % that annualising would give).

**Still open.** No FAQ covers the no-prior-year case word for word.

## S3: annualising the start year for the year-3 modelo 130

**Question.** RIRPF 110.1.a says the start year's rendimiento neto "se elevará al año". Is that done by days, months or quarters?

**Answer.** No text specifies the method. RIRPF 110.1.a, the 130 instructions (casilla 02) and FAQs 900001000, 900004384 and 900004435 all repeat "se elevará al año" without saying how. FAQ 900001000's "por cada trimestre completo de actividad" is about when each 5 % instalment is due, not about the annualisation.

The only official worked example of "elevar al año" is for a different rule, the €600k volumen de operaciones test under RIRPF art. 28.2. It annualises by months: 260,000 × 12/4 = 780,000 (Manual de Renta 2025, PDF p. 195).

**Confidence.** Low to medium for months, by analogy.

**Changed.** Nothing. The engine already annualises by active months (`compute.ts`), and alta is assumed on the 1st of the month, so days and months give almost the same result. Note that spec §3.4 says "by days"; the code uses months.

**Still open.** Yes. This needs a written question to the Hacienda Foral.

## Tarifa plana: €80 in 2026

**Question.** RDL 13/2022 DT 5ª set €80 for 2023–2025 and left 2026 onwards to the LPGE. What is the legal basis for 2026?

**Answer.** No 2026 norm sets or extends the amount.
- RDL 13/2022 DT 5ª (https://www.boe.es/buscar/act.php?id=BOE-A-2022-12482): "A partir del año 2026, el importe de dichas cuotas será fijado por la Ley de Presupuestos Generales del Estado".
- There is no 2026 LPGE.
- RDL 3/2026 art. 3.4 (BOE-A-2026-2548) carries over only the DT 1ª tables. Orden PJC/297/2026 (BOE-A-2026-7296) says nothing about the cuota reducida.
- The TGSS applies €80 in practice. Its Import@ss guide says "una cuota de 80 € al mes".

**Confidence.** High that no legal text exists. High that the TGSS charges €80, which matches real receipts at €88.56 with MEI.

**Changed.** `reta.tarifaPlana` moved from ? to P (provisional, administrative practice). The value is unchanged.

**Still open.** The legal basis. The figure for 2027.

## SMI 2026

**Answer.** €1,221/month, €17,094/year. RD 126/2026, de 18 de febrero, BOE núm. 44, 19/02/2026 (https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-3815):
- art. 1: "1 221 euros/mes";
- art. 3: "sin que en ningún caso pueda considerarse una cuantía anual inferior a 17 094 euros".

**Confidence.** High.

**Changed.** `smi` [V]. `tests/params.test.ts` has a new SMI test and its used/unverified tracking test now uses `reta.tarifaPlana`.

## Art. 83 ter: deduction for women returning to work

**Answer.**
- €1,500 per year away from work, counted from the end of paid birth/childcare leave until the return.
- +50 % for multiple births or adoptions.
- A part year is prorated by days.
- Split in halves when two parents live with the child.
- Prorated for reduced hours (at most 67 % while away, return at 85 % or more).
- Conditions: at least 9 of the 18 months before the birth on Social Security; no paid work for at least 12 months after the leave; return by 12 months after the child turns 3 (registering with Lanbide counts as returning).
- Unused amounts carry forward 5 years.

**Citations.** NF 13/2013 art. 83 ter, consolidated text 01/01/2026 (URL above); Manual de Renta 2025, PDF pp. 406–409.

**Confidence.** High.

**Changed.** `irpf.womenReturn` [V]. The engine (years × €1,500) is unchanged. It does not model the multiple-birth uplift, the halving, the day proration or the carry-forward.

## Art. 83 quater: deduction for men pausing work for childcare

**Answer.**
- Up to €200 per year of pause, for a child under 4. Reduced hours of at most 67 % also qualify, prorated.
- +50 % for multiple births.
- Prorated by days.
- Split equally between two eligible men.
- Requires 9 of the 18 months before the birth on Social Security.
- Not compatible with art. 83 bis for the same child over the same days.
- No carry-forward.

**Citations.** NF 13/2013 art. 83 quater (URL above); Manual de Renta 2025, PDF pp. 406–409.

**Confidence.** High.

**Changed.** `irpf.menChildcare` [V]. The engine gives €200 for a full year whenever the box is ticked.

## Tax treatment of the RETA pluriactividad refund (LGSS art. 313)

**Answer.** Not settled for this specific refund. By analogy, it is activity income in the year it is received. Bizkaia's guidance on the RETA *regularisation* refund says:
- Instrucción 900011645 (https://www.bizkaia.eus/ogasuna/guregida/noticia.asp?Idioma=CA&IdNoticia=900011645&Tem_Codigo=7884): "debe tratarse como un mayor gasto deducible … o como un ingreso (en caso de devoluciones) correspondiente a ese ejercicio posterior".
- FAQ 900011531: it is recorded as a negative amount under concept 64201.
- The common-Spain DGT V2653-18 reaches the same result. That is contrast only, seen in secondary sources.

**Confidence.** Medium, by analogy.

**Changed.** Nothing. The engine reports the refund for information only and does not tax it in year +2.

**Still open.** A Bizkaia text on the art. 313 reintegro itself.

## 2027 parameters and the 2027 salary withholding table

None of these was published as of 2026-11-19:
- The Bizkaia NF de Presupuestos 2027 is only a bill. The three Haciendas announced a 3 % IRPF deflation (press only).
- DF retenciones 2027: not published.
- Orden de cotización 2027 and LPGE 2027: not published.
- SMI 2027: still being negotiated.

The only fixed 2027 change is MEI 1.0 % (LGSS DT 43ª), which is already in `src/params/index.ts`. All other 2027 values stay [P], with the 2026 values carried over.

---

## Files changed

- `src/params/2026.json`: `irpf.firstYearTier`, `p130.simplificadaInside`, `reta.ssIncomeReading` (now "B"), `smi`, `irpf.womenReturn` and `irpf.menChildcare` set to V; `reta.tarifaPlana` moved from ? to P.
- `src/engine/m130.ts`, `src/engine/compute.ts`, `src/engine/reta.ts`, `src/engine/irpf.ts`: the rules come from params or the law, not from `settings`.
- `src/engine/types.ts`: `settings` is kept and documented as deprecated (old share links still parse).
- Tests: `tests/m130.test.ts`, `tests/irpf.test.ts`, `tests/reta.test.ts`, `tests/golden.test.ts`, `tests/params.test.ts`.

## UI and copy changes needed (not made: components, i18n and pages are out of scope here)

1. Remove the "Unsettled rules" settings block (`settings.title`, `settings.lede`, `settings.r2*`, `settings.s1*`, `settings.s2`) from `Inputs.tsx` and `how-we-calculate.astro`. Move "Your own RETA base" (`settings.retaBase*`) somewhere else.
2. In "How we calculate", replace the settings list with the resolved rules:
   - SS income is after the 20/15/10 % (on profit only) and before the start-up reduction;
   - the 130 uses 20 % of income − expenses, with no reduction;
   - no reduction on a loss;
   - the first year uses 20 %, and a part-year start is not annualised.
3. Update the `paramText.ts` label for `reta.ssIncomeReading` if it should read as a fact rather than a choice. Value 'B' currently renders "after the reduction".
4. `Results.tsx` line 37 hard-codes the keys that are unverified for reasons other than 2027. Now only `reta.tarifaPlana` is non-V in 2026. Remove the other keys from that list, otherwise in 2027 they show their own "pk.*" label instead of the 2027 label.
5. Replace the tarifa plana copy ("€80 basis unknown") with: "€80 is what the TGSS charges; no 2026 law sets the amount."
6. Spec §3.4, §8 and §9 are stale. §8.1 years 2–3 and §8.2 should match the updated tests.
