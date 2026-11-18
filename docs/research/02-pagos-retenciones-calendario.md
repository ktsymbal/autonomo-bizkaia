# Bizkaia autónomo: prepayments, withholdings, invoicing, census and calendar

Research for the spec of a calculator and compliance app for autónomos who are tax-resident in Bizkaia. The person is a persona física in estimación directa simplificada with quarterly IVA. Researched on 2026-11-18. **Foral rules only**; where a rule could only be found as common-Spain (AEAT) law, it is marked as such.

## Primary sources used (downloaded and read, not from snippets)

| Short name | What | URL | Version |
|---|---|---|---|
| NFIRPF | NF 13/2013, IRPF Bizkaia | a local copy of the consolidated text | consolidated text as of 01/01/2026 |
| RIRPF | DF 47/2014, Reglamento IRPF Bizkaia | https://www.bizkaia.eus/documents/880307/15187815/ca_47_2014.pdf/c17e2f7e-e4dd-789c-235e-21add02afe5e | "Última modificación normativa: 23/03/2026" |
| ROF | DF 205/2008, Reglamento de obligaciones tributarias formales (census, LROE, 347) | https://www.bizkaia.eus/documents/880307/15187815/ca_205_2008.pdf/fe79f7a4-2e43-cfb8-d239-34820fbc20e1 | "Última modificación normativa: 10/10/2026" |
| NFGT | NF 2/2005, General Tributaria Bizkaia | https://www.bizkaia.eus/documents/880307/15187815/ca_2_2005.pdf/42a726d5-08dd-a356-9ed4-70b5bad5a854 | 01/01/2026 |
| RGest | DF 112/2009, Reglamento de gestión | https://www.bizkaia.eus/documents/880307/15187815/ca_112_2009.pdf/e50c8365-4b7a-2782-1dd9-fbbe256614cc | 01/01/2026 |
| RFact | DF 4/2013, Reglamento de facturación Bizkaia | https://www.bizkaia.eus/documents/880307/15187815/ca_4_2013.pdf/b9f611c5-50ac-9a3c-ad9b-b6d488af14c7 | 01/01/2024 |
| RIVA | RD 1624/1992, Reglamento IVA as published by Bizkaia | https://www.bizkaia.eus/documents/880307/15187815/ca_1624_1992.pdf/6b806874-e25f-038d-9922-c1d8ef200520 | 28/01/2026 |
| OF 362/2023 | Orden Foral approving modelo 303 (BOB 22/09/2023) | https://www.bizkaia.eus/fitxategiak/05/Ogasuna/guregida/dokumentuak/artxiboak/BOB%20del%2022%20de%20septiembre%20de%202023.%20Modelo%20303.pdf | as published |
| IAE | DFN 2/1992, Texto refundido NF 6/1989 IAE | https://www.bizkaia.eus/documents/880307/15187815/ca_2_1992.pdf/cf5f485d-cf6b-8dce-5708-7184765fa3ac | 01/01/2026 |
| Cal2026 | Official Bizkaia fiscal calendar 2026 (non-binding) | https://www.bizkaia.eus/documents/d/guest/calendario-fiscal-2026 | 2026 |
| Cal2025 | Official Bizkaia fiscal calendar 2025 (non-binding) | https://www.bizkaia.eus/documents/842933/10810772/CALENDARIO+FISCAL+2025.pdf | 2025 |
| FAQ | Hacienda Foral FAQ, `https://www.bizkaia.eus/ogasuna/faq/faq_detalle.asp?idregistro=<ID>&Idioma=CA` | IDs cited inline | non-binding |
| BATUZ FAQ | https://www.batuz.eus/es/preguntas-frecuentes | FAQ numbers cited inline | non-binding |

---

## Summary

- **Modelo 130 has two Bizkaia formulas, and neither is cumulative**, unlike AEAT's year-to-date method.
  - *Start year and the year after:* each quarter on its own, `20% × (ingresos − gastos of that quarter) − retenciones of that quarter`.
  - *From the third year:* a fixed `5% × rendimiento neto of the penúltimo año − 25% × retenciones of that year`, paid each quarter. It doesn't depend on current income.
  
  Source: RIRPF art. 110.
- **The 130 is waived for professionals** when at least 70% of the activity's income bore retención (the share of the penúltimo año, or of the quarter itself in the start year and the next). In those cases there is no 130 at all, not even a zero return (RIRPF art. 109.3–4; FAQ 900000172). Otherwise a zero result still requires a "declaración negativa" (RIRPF art. 111.1).
- **Deadlines** for the quarterly 130, 303, 349, 110 and 115 are the 1st–25th of Apr, Jul and Oct, plus **1–31 January** for the Q4 one. Every periodic January deadline runs to 31 Jan (RGest DA 1ª; FAQ 900000997). AEAT's dates are 1–20 and 1–30.
- **Bizkaia has no Q4 modelo 303** for quarterly filers. Q4 goes into the **modelo 390, which is a final autoliquidación** filed in January (OF 362/2023 art. 3.Dos).
- **Retención on professional invoices** is 15%, or 7% in the start year and the two following ones, provided there was no professional activity in the year before the start (RIRPF art. 94.1). Only Spanish payers withhold: entities and autónomos acting as such (NFIRPF art. 107). Foreign clients never withhold.
- **TicketBAI and the LROE (modelo 140) are mandatory for every persona física with an activity.** The last phase-in window was 1 Jan 2026 (BATUZ FAQ 118). LROE entries for personas físicas are due by 25 Apr, 25 Jul, 25 Oct and 31 Jan, and in any case before the 303 is filed (ROF art. 39 nonies).
- **Keeping the LROE removes the modelo 347** (ROF art. 43.e) and replaces the IVA record books (ROF art. 39 bis.6). It does **not** replace the 303, 390, 349, 130, 110/111, 115, 180 or 190.
- **Late filing in Bizkaia works differently from AEAT** (my reading of NFGT; to be confirmed).
  - A late autoliquidación filed without a requerimiento carries **no percentage surcharge**. It costs a **fixed €400 fine** (art. 203.3), reduced by 30% if paid (art. 193), plus interest only if payment comes more than 6 months late (art. 26.7).
  - Not paying an autoliquidación filed on time triggers the **recargo ejecutivo**: 5%, or 0.5% if paid within the first 3 business days. After the providencia de apremio and its one-month window, it becomes the **20% recargo de apremio** (art. 28).
- **The census return is the Bizkaia modelo 036**, filed through BILA or the sede. The deadline is **one month after the actual start** (ROF art. 17.4), whereas AEAT requires it before the start. **IAE exemption:** volumen de operaciones below **€2,000,000**, plus the first two years of a new activity (DFN 2/1992 art. 5.1.g–h). Common Spain uses €1M plus a blanket exemption for personas físicas.

---

## 1. Modelo 130: pagos fraccionados (IRPF)

### Plain explanation

The 130 is a quarterly IRPF prepayment that every person with an economic activity must make (NFIRPF art. 110.1; RIRPF art. 109.1). Bizkaia has **no modelo 131**: estimación objetiva was abolished by NF 13/2013 (RIRPF preamble), and bizkaia.eus lists only the 130 under "Renta" for pagos fraccionados.

There are two calculation regimes:

1. **Start-of-activity regime**, in the start year (S) and the year after (S+1). Each calendar quarter stands alone: 20% of that quarter's income minus expenses, less the retenciones borne *in that quarter*.
2. **General regime**, from year S+2. Each quarter you pay the same amount: 5% of the rendimiento neto of the year two years earlier (the "penúltimo año"), less 25% of the retenciones borne in that year. The current year's real income doesn't matter.

Edge case: in year S+2 the penúltimo año is the start year S. Its net income is then **annualised** ("se elevará al año").

### Formula (pseudocode)

```
# inputs: year Y, quarter q, start year S (year of alta), activity type
# returns: (must_file: bool, amount: €)

def modelo_130(Y, q):
    if is_professional_activity and exempt_70pct(Y, q):
        return (False, 0)            # no 130 at all for that quarter (RIRPF 109.3-4)

    if Y in (S, S+1):                                   # RIRPF 110.1.a, last paragraph
        base   = ingresos_computables[Y][q] - gastos_deducibles[Y][q]   # devengados en el trimestre
        amount = 0.20 * base - retenciones_e_ingresos_a_cuenta[Y][q]    # RIRPF 110.2, 2nd para.
    else:
        P  = Y - 2                                       # "penúltimo año"
        RN = rendimiento_neto_actividad[P]               # any method; see annualisation
        if P == S:
            RN = annualise(RN, days_active_in_S)         # "se elevará al año"
        if RN > 0:
            amount = 0.05 * RN
        else:
            amount = 0.005 * volumen_ventas_ingresos[P]  # 0.0025 if comerciante mayorista
        amount -= 0.25 * retenciones_e_ingresos_a_cuenta[P]             # RIRPF 110.2, 1st para.

    amount = max(amount, 0)          # no negative 130; file "declaración negativa" (RIRPF 111.1)
    amount = max(amount, user_chosen_higher_pct_amount)                 # RIRPF 110.3: optional
    return (True, round2(amount))

def exempt_70pct(Y, q):              # professional activities only (and agri/forestry)
    if Y in (S, S+1):
        return ingresos_con_retencion[Y][q] / ingresos[Y][q] >= 0.70    # per quarter (109.4)
    return ingresos_con_retencion[Y-2] / ingresos[Y-2] >= 0.70          # penúltimo año (109.3)
```


### Parameters

| Parameter | Value | Source |
|---|---|---|
| Quarterly rate, years S and S+1 | 20% of (ingresos − gastos) of the quarter | RIRPF art. 110.1.a (4th para.); FAQ 900001004, 900001005 |
| Retenciones deducted, years S and S+1 | 100% of the retenciones and ingresos a cuenta of that quarter for the activity | RIRPF art. 110.2 (2nd para.) |
| Quarterly rate, from S+2 | 5% of the rendimiento neto of the penúltimo año, whatever the method | RIRPF art. 110.1.a; FAQ 900001000 |
| Retenciones deducted, from S+2 | 25% of the penúltimo año's total retenciones and ingresos a cuenta | RIRPF art. 110.2 (1st para.) |
| Penúltimo año RN ≤ 0 | 0.5% of the penúltimo año's ventas or ingresos (0.25% for mayoristas) | RIRPF art. 110.1.a (2nd para.); FAQ 900001002 |
| Penúltimo año = start year | Annualise the RN | RIRPF art. 110.1.a (3rd para.) |
| Agricultural, livestock, forestry and fishing | 2% of the quarter's ventas or ingresos | RIRPF art. 110.1.b |
| Exemption (professionals) | ≥ 70% of activity income with retención: penúltimo año, or the quarter itself in years S and S+1 | RIRPF art. 109.3–4; FAQ 900000995, 900000172 |
| Voluntary higher % | Allowed | RIRPF art. 110.3; FAQ 900001008 |
| Revision of the base | On request to the Servicio de Tributos Directos in exceptional circumstances | RIRPF art. 110.4 |
| Zero result | Must still file (declaración negativa) | RIRPF art. 111.1; FAQ 900000998, 900000999 |
| Deadlines | Q1 1–25 Apr · Q2 1–25 Jul · Q3 1–25 Oct · Q4 **1–31 Jan** | RIRPF art. 111.1 (1–25); RGest DA 1ª (January → 31); FAQ 900000997; Cal2026 |
| Weekend or holiday | Deadline moves to the next business day | Cal2026 note; FAQ 900002176 (Saturday → next business day; Art. 18 DF 125/2019) |
| Simplificada % (annual IRPF, for reference) | 20% if the prior year's (ingresos − gastos) ≤ €35k; 15% for €35k–85k; 10% above €85k | NFIRPF art. 28.1.b |

### Edge cases

- **(a) Not cumulative.** AEAT's 130 is year-to-date and subtracts earlier quarters' payments. Bizkaia's is not. A loss in one quarter is **not** offset against a later quarter's profit: each quarter is floored at 0. This follows from "devengados en cada trimestre natural"; no rule for carrying a loss forward exists in the text. Flag it in the UI: overpayments only come back in the annual Renta.
- **(b) Large step change in year S+2.** The amount is fixed from the penúltimo año. Someone whose income jumps in S+2 pays little; someone whose income falls pays too much, and can apply under art. 110.4 or simply wait for the Renta refund. The app should show both the "legal minimum" and a "realistic provision".
- **(c) Annualisation method.** "Se elevará al año" gives no formula (days or months). See the open list.
- **(d) 70% test in years S and S+1.** It is applied quarter by quarter, so the same autónomo can owe a 130 in one quarter and none in the next.
- **(e) Do "gastos deducibles" include the simplificada %?** RIRPF 110.1.a says "diferencia entre los ingresos computables y los gastos deducibles". Some gestoría software applies a 15% reduction "por normativa de confección". The year-1 rate under art. 28 would be 20%. No official text for the casilla instructions was found. See the open list.
- **(f) Alta mid-quarter.** The quarter includes only income and expenses accrued from the alta date. Pre-alta invoices are excluded (as in brief.md).
- **(g) Rendimiento neto in the general regime.** It is "rendimientos netos de la actividad", so it is the net after the simplificada %. It is not the base liquidable and has no start-up reduction applied. It is unclear whether the art. 25.5 start-up reduction is excluded; I read "rendimiento neto de la actividad" as before the reductions in art. 25.5. To be confirmed.

### Payment and domiciliación

- The 303 order requires that, for domiciliación, the IBAN is known to the Hacienda Foral and is **owned by the filer**, and that the domiciliación is irrevocable (OF 362/2023 art. 4.Uno). I assume the same conditions for the 130 (by analogy; the 130 order was not found).
- If the direct debit is returned, the debt stays unpaid. The periodo ejecutivo starts the day after the voluntary period ends (NFGT art. 60.2). See §1b.

### 1b. Late filing and late payment (NFGT 2/2005, consolidated 01/01/2026)

| Situation | Consequence | Source |
|---|---|---|
| Autoliquidación **filed late, with payment, without a requerimiento** | No percentage recargo (Bizkaia's art. 27 covers "declaraciones" under the art. 122 procedure, not autoliquidaciones). **Fixed fine of €400** (art. 203.3), reduced by 30% to **€280** if paid in the voluntary period without appeal (art. 193). **Interest** (4.0625% in 2026) only if payment comes more than 6 months after the deadline (art. 26.7). No art. 196 sanction (196.1 and 184.3), provided the late autoliquidación identifies the period and contains only that period's data (184.3, 3rd para.) | NFGT arts. 26.3, 26.7, 27, 184.3, 193, 196.1, 203.3 — **my reading, to confirm** |
| Late **declaración** (not an autoliquidación) without requerimiento | Recargo of 5% of the cuota, or 0.5% if filed within 3 business days of the deadline | NFGT art. 27.2 |
| Filed on time but **not paid**, or direct debit returned | Periodo ejecutivo starts automatically. **Recargo ejecutivo 5%**, or **0.5%** if paid in full within the **first 3 business days** of the ejecutivo period. After notification of the providencia de apremio there is a one-month extraordinary window (still 5%). After that window: **recargo de apremio 20%** | NFGT arts. 28.2–3, 60.2–3; FAQ 900002220 |
| Interest in the ejecutivo period | Interest accrues from the start of the ejecutivo period, **except** on amounts paid within the providencia's one-month extraordinary window | NFGT art. 26.4 |
| Not filed or not paid, then **caught by a requerimiento** | Fine of 100–250% of the unpaid amount (art. 196.3). If there is nothing to pay: €400 (art. 203.1.a) | NFGT arts. 196, 203.1 |
| Regularised later in an autoliquidación that doesn't meet the 184.3 format rules | Fine of 75% of the regularised amount | NFGT art. 196.5 |
| Interest rate 2026 | 4.0625% | NFGT art. 26.3 (NF 7/2025 Presupuestos) |

---

## 2. Retenciones on professionals' invoices

### Plain explanation

When a **Spanish** business or autónomo pays a **professional** (IAE Sección 2ª or 3ª, plus a few named cases), it must withhold IRPF from the invoice and pay it to Hacienda. The professional later deducts it in the 130 and the Renta. **Empresariales** activities (Sección 1ª) do not bear retención. The exception is common-Spain estimación-objetiva activities (1%), which don't exist for Bizkaia residents.

### Formula

```
def retencion_on_invoice(invoice, issuer, payer):
    if not payer.is_spanish_withholder:          # NFIRPF 107.1: entities, autónomos acting as
        return 0                                 # such, non-residents with a PE in Spain.
                                                 # Private individuals and foreign clients don't withhold.
    if not issuer.activity_is_profesional:       # RIRPF 94.2: Sección 2ª/3ª + listed cases
        return 0
    rate = 0.15                                  # RIRPF 94.1
    if issuer.year_of_start in (Y, Y-1, Y-2) and issuer.no_professional_activity_in_year_before_start \
       and issuer.communicated_to_payer:
        rate = 0.07
    if issuer.in_special_7pct_list:              # recaudadores, IAE groups 851-869 (2ª), artists...
        rate = 0.07                              # with prior-year conditions (<€15k and >75%)
    return round2(rate * invoice.base_imponible) # on ingresos íntegros, IVA excluded
```

### Parameters

| Parameter | Value | Source |
|---|---|---|
| General professional rate | 15% of ingresos íntegros | RIRPF art. 94.1 |
| New professional | 7% in the start year and the next two, if there was no professional activity in the year before the start. The professional must tell the payer in writing; the payer keeps the signed communication | RIRPF art. 94.1 (2nd–3rd paras.) |
| Other 7% cases | Recaudadores municipales; mediadores de seguros with external auxiliaries; Loterías delegates; IAE groups 851, 852, 853, 861, 862, 864, 869 (Sección 2ª) and agrupaciones 01, 02, 03, 05 (Sección 3ª), and artists, when the prior-year gross from these is < €15,000 and > 75% of the sum of activity and work income | RIRPF art. 94.1 (4th para.) |
| What counts as "profesional" | Sección 2ª and 3ª IAE; authors and translators (unless self-publishing); pure comisionistas; teachers (not in their own academy); lecturers. Salaried members of a colegio are not included | RIRPF art. 94.2–3; FAQ 900000985 |
| Agricultural, livestock, forestry | 2% (1% for pig fattening and poultry) | RIRPF art. 94.4–5 |
| Who withholds | Entities; autónomos for payments made in their activity; non-residents with a PE | NFIRPF art. 107.1 |
| Rent of premises (payer side) | 19% of the rent excluding IVA | RIRPF art. 99 |

### Interaction with the 130

- **Start-year regime:** subtract the quarter's retenciones in full (RIRPF 110.2). If at least 70% of the quarter's income bore retención, no 130 is due (109.4).
- **General regime:** subtract 25% of the penúltimo año's retenciones (110.2). The 70% test uses the penúltimo año (109.3).
- **In the Renta:** retenciones are deducted from the cuota. If the payer failed to withhold, the perceptor still deducts what *should* have been withheld (NFIRPF art. 109.1).

### Edge cases

- **Foreign client** (EU, non-EU, US platforms): no retención, so the 130 is always due.
- **Mixed client base:** the 70% test is on income, not on the number of invoices.
- **Payer in common Spain (Madrid, etc.).** The rate and the destination of the retención are set by the Concierto Económico (Ley 12/2002, art. 7). By my understanding, a common-territory payer withholds under state rules and pays the AEAT, which also has 15% / 7% for start year + 2 (RD 439/2007 art. 101). The perceptor deducts it in the Bizkaia Renta. **Not verified against the Concierto text.**
- **Invoice in a currency other than euros:** retención is computed on the euro amount. Euro conversion for the LROE is required by ROF art. 39 bis.10.

---

## 3. Modelos the autónomo files as a payer, and what the LROE replaces

| Model (Bizkaia) | What | Periodicity and deadline | Replaced by LROE 140? | Source |
|---|---|---|---|---|
| **110** | Retenciones on employment, activity income (professionals you pay) and prizes | Quarterly: 1–25 Apr / Jul / Oct, **1–31 Jan**. File only if you paid rents subject to retención in the period. A negative return is needed only if you paid such rents but no retención was due because of the amount | **No** | RIRPF art. 106.2; RGest DA 1ª; FAQ 900002639, 900000087; Cal2026 |
| **111** | Same as 110, for "grandes empresas" | Monthly, 1–25 of the following month (July in Aug + 1–25 Sep). Applies when volumen > €6,010,121.04 | No | RIRPF 106.2 (2nd para.) referring to RIVA 71.3; bizkaia.eus model list; FAQ 900002639 |
| **115** | Retenciones on rent of urban premises (19%) | Quarterly, same dates as 110 | **No** | RIRPF arts. 99, 106.2; Cal2026 |
| **190** | Annual summary for 110/111 | **1–31 January** | **No** | RIRPF art. 106.3; FAQ 900002641 (extended to 31 Jan from 2023 by DF 153/2022) |
| **180** | Annual summary for 115 | 1–31 January | **No** | FAQ 900002641; Cal2026 |
| Certificate to the perceptor | The withholder certifies retenciones before the Renta campaign opens. The % applied must be communicated at the time of payment | — | — | RIRPF art. 106.4–5; FAQ 900002640 |
| **347** | Operaciones con terceros > €3,005.06 per counterparty per year (IVA included, FAQ 900000271) | February (1–28/29) | **Yes. LROE keepers are excluded** (ROF art. 43.e). BATUZ FAQ: "La llevanza del LROE sustituye a la presentación de la declaración anual de operaciones con terceras personas (modelo 347)". For a persona física within BATUZ from 1 Jan of the year, no 347 | ROF arts. 42–43; FAQ 900001096, 900009705 |
| **349** | Intra-EU recapitulative return (services: code S) | Quarterly if intra-EU supplies ≤ €50,000 in the current and each of the 4 previous quarters, otherwise monthly. Bizkaia calendar: 1–25, and January 1–31. RIVA text says "veinte primeros días"; see the open list. File only in periods with intra-EU operations (FAQ 900000194) | **No** (the LROE has an intra-EU chapter, but the 349 is still listed and filed) | RIVA art. 81; Cal2025 and Cal2026 (349 at 1–25); FAQ 900000194 |
| **303** | IVA quarterly autoliquidación | Q1–Q3: 1–25 of the following month. **No Q4 303**; Q4 goes into the 390 | No (the LROE feeds a borrador of the 303) | OF 362/2023 art. 3.Dos; BATUZ FAQ 118 |
| **390** | **Final** IVA autoliquidación (includes Q4) | 1–31 January | No | OF 362/2023 art. 3; Cal2026 |
| IVA record books (art. 62 RIVA) | Facturas emitidas, recibidas, bienes de inversión | — | **Yes** | ROF art. 39 bis.6–8 |
| **140 (BILA, annual)** | Old annual informative book for non-BATUZ personas físicas | February (Cal2025) | Superseded: BATUZ filers keep the LROE-140 on the sede instead | BATUZ FAQ 140; Cal2025 |
| **184** | Annual return for entities in atribución de rentas (CB, SC) | February | n/a for a solo autónomo | Cal2026 |

---

## 4. TicketBAI / BATUZ

### Plain explanation

BATUZ has three parts:

1. **TicketBAI.** Every invoice or receipt is issued through registered ("garante") software, or the Diputación's free app. Before the invoice is issued, the software creates an electronically signed file that chains to the previous invoice. The invoice carries a **TBAI identifier code and a QR code**.
2. **LROE (modelo 140 for personas físicas).** A single electronic book of operations kept on the Bizkaia sede, which TicketBAI records feed automatically.
3. **Assistance.** IVA and IRPF borradores are generated from the LROE.

### Obligation and dates

| Item | Rule | Source |
|---|---|---|
| Who | All personas físicas with economic activities (art. 24 NFIRPF), whatever their method, size or turnover | NFIRPF arts. 113 bis.1, 114.1; BATUZ FAQ 139 |
| From when | Phased in by main IAE activity: 1 Jul 2024, 1 Jan 2025, 1 Jul 2025, **1 Jan 2026** (last window). From 2026 every persona física is in BATUZ | NF 8/2023; BATUZ FAQ 118, 251, 259 |
| New alta in 2026 or later | Must comply from the start (all windows have passed) | Inference from NF 8/2023 windows; see the open list |
| Software | The Diputación's free app (with limits), or software on the TicketBAI register | NFIRPF art. 113 bis.2; ROF art. 10 |
| Exemption: small income | Exemption from TicketBAI **and** the LROE if *all four* hold: activity income ≤ €2,000/yr; no deductible expenses; all activity income bears retención; all income not subject to or exempt from IVA. Requires an application (form 1787) and lapses the first year any condition fails | NFIRPF art. 113 bis.4.d; BATUZ FAQ 264 |
| Exemption: imminent cessation | If cessation is expected within 3 years of the mandatory date and compliance needs relevant investment. On application; one time only | NFIRPF art. 113 bis.4.c; BATUZ FAQ |
| Exemption: QR only | B2B or public-administration invoices issued originally in a non-readable electronic format (e.g. structured e-invoice) need no QR. The TicketBAI file is still required | NFIRPF art. 113 bis.5.a |
| Sporadic minor activities | A new TicketBAI exemption (**not** LROE) for "actividades económicas esporádicas de escasa relevancia" is mentioned in a Diputación presentation (Nov 2025). Text not located; see the open list | batuz presentation 24/11/2025 (bizkaia.eus) |

### LROE modelo 140: chapters and deadlines

Chapters (NFIRPF art. 114.4; RIRPF art. 114.3; ROF art. 39 bis.5):

1. Ingresos y facturas emitidas. Subchapters 1.1 with garante software (TicketBAI), 1.2 without, 1.3 income without invoice.
2. Gastos y facturas recibidas. 2.2 is expenses without invoice, e.g. the RETA cuota (code 64201).
3. Bienes afectos y/o de inversión.
4. Determinadas operaciones intracomunitarias.
5. Provisiones de fondos y suplidos.
6. Otra información con trascendencia tributaria: the IRPF method of each activity, rent of business premises, cash > €6,000, and property transfers subject to IVA (ROF art. 39 octies).

| Entry type | Deadline (personas físicas not in the SII) | Source |
|---|---|---|
| Chapters 1–5 (general rule) | From the operation date until **25 Apr / 25 Jul / 25 Oct / 31 Jan** according to the quarter, and **always before** the IVA autoliquidación covering them is filed | ROF art. 39 nonies.1; BATUZ FAQ 233 |
| Operations without an invoice | Within **7 days** of the operation, if that is earlier than the quarterly deadline | ROF art. 39 nonies.2 |
| Intra-EU transfers of own goods (art. 39 sexies.1) | 7 days from the start of transport | ROF art. 39 nonies.3 |
| Chapter 6, "otra información" | Annually, **in January** of the following year, grouped per counterparty | ROF art. 39 nonies.4 |
| Bienes de inversión IVA regularisation | By 31 Jan of the following year | BATUZ FAQ |
| SII-type taxpayers (monthly IVA) | 4 days after issue or booking, and before the 16th of the following month | ROF art. 39 decies (not typical for autónomos) |

- **Periodicity answer:** a persona física with **quarterly IVA** has **quarterly** LROE deadlines. Monthly deadlines (4 days) apply only to the ROF 39 bis.7 group, the SII-equivalent filers: monthly IVA, REDEME, > €6M.
- **Year assignment:** invoices go into the LROE of their issue or receipt year. IRPF imputation follows the "fecha de operación" field. The IRPF borrador uses the LROE as it stands in **early March** of the following year (BATUZ FAQ 238 and the FAQ on the IRPF borrador).
- **Late LROE entries:** fine of 0.5% of the invoice amount, with a minimum of **€600 per quarter** and a maximum of €12,000 (NFGT art. 206.2.g).

### Invoice content (DF 4/2013)

A full invoice (RFact art. 6.1) must show:

- (a) number and series, correlative; **rectificativas need their own series**;
- (b) issue date;
- (c) full names of issuer and recipient;
- (d) issuer's NIF. The recipient's NIF is mandatory for intra-EU exempt supplies, for reverse-charge operations, and for operations located in Spain;
- (e) addresses of both;
- (f) description, unit price excluding tax, and discounts;
- (g) IVA rate;
- (h) IVA quota, shown separately;
- (i) operation date, if it differs from the issue date;
- (j) exemption reference;
- (m) "inversión del sujeto pasivo" where applicable;
- (p) "régimen especial del criterio de caja" where applicable.

TicketBAI adds:

- the **TBAI identifier code and QR** (NFIRPF art. 113 bis.1.b);
- the chained signed file, created before issue (113 bis.1.a).

| Rule | Value | Source |
|---|---|---|
| Issue deadline | At the time of the operation. If the recipient is a business: **before the 16th of the month after IVA accrual** | RFact art. 11.1 |
| Factura simplificada, general | Up to **€400** including IVA, or when a rectificativa is due | RFact art. 4.1 |
| Factura simplificada, listed sectors (retail, hostelería, transport, hairdressing, parking, etc.) | Up to **€3,000** including IVA | RFact art. 4.2 |
| Simplificada not allowed | Intra-EU exempt supplies; certain distance sales; reverse-charge cases issued by the recipient; and others | RFact art. 4.4 |
| Factura rectificativa | Mandatory when the original lacks art. 6/7 requirements, when IVA was wrong, or when the base is modified (art. 80 NFIVA). Issue as soon as known, within **4 years** of accrual. Identify the rectified invoice(s). Amounts can be shown either as the difference or as the corrected figure plus the difference. Own series | RFact arts. 6.1.a.2, 15 |
| Language and currency | Any currency, but the IVA quota must be in euros (art. 12; not quoted here). The LROE is in euros | RFact art. 12; ROF art. 39 bis.10 |

### Sanctions

| Infraction | Sanction | Source |
|---|---|---|
| Not using a TicketBAI system (systematic) | 20% of the prior year's cifra de negocios, minimum **€20,000**. 30% / €30,000 for a repeat within 4 years | NFIRPF art. 118.3.a |
| Not using a TicketBAI system (occasional: ≤ 2% of turnover) | **€2,000 per operation** | NFIRPF art. 118.3.b |
| Destroying or manipulating TicketBAI software or files | 20% of turnover, minimum €40,000 (€60,000 repeat). Also applies to the software developer | NFIRPF art. 118.3.c–d |
| Not issuing an invoice | 2% of the operations; €600 per operation if the amount is unknown or the year is still open | NFGT art. 207.2.b |
| Other invoicing defects | 1% of the operations | NFGT art. 207.2.a |
| Reduction for payment | 30% (art. 193) applies to art. 118 sanctions | NFIRPF art. 118.6; NFGT art. 193 |

### BATUZ deduction

- **30% IRPF/IS deduction** on investment and expenses needed to implement BATUZ. It applies **only to spending in calendar years 2020–2025**. It is applied on the cuota íntegra, isn't limited by the minimum-tax rule, and any unused amount carries forward 30 years (BATUZ FAQ "Deducción Batuz"; NFIRPF DT 29ª; NF 8/2023).
- **For spending from 2026 there is no deduction.** The app needs it only for carry-forwards.

---

## 5. Census (036) and IAE

### Plain explanation

- **Census (036):** before or around starting work, the autónomo registers in the Censo de Empresarios, Profesionales y Retenedores of Bizkaia with the **Bizkaia modelo 036**, filed online through BILA or the sede. Not the AEAT 036/037.
- **IAE:** a municipal tax on activities, administered by the Diputación. Most autónomos are **exempt** in Bizkaia, but the threshold and rules differ from common Spain.

### Rules

| Item | Rule | Source |
|---|---|---|
| Model | Bizkaia **036** (BILA program). Non-exempt IAE payers also file **modelo 840** (IAE matrícula) | FAQ 900003066, 900000754, 900000837 |
| Alta deadline | **Within one month of the actual start of the activity**. Exceptions: **before** the start if communicating pre-activity purchases (to deduct IVA, art. 111 NFIVA); before the first retención obligation; before intra-EU operations (ROI) | ROF art. 17.4 |
| When the activity starts | On the first delivery, service, purchase, collection or payment, or hiring staff, made with the aim of producing or distributing goods or services | ROF art. 17.4 (last para.) |
| Modificación | Within **1 month** of the change (e.g. new epígrafe, domicilio, IVA regime, ROI). The new-epígrafe 036 must state the IVA and IRPF options explicitly | ROF art. 18.4; FAQ 900000837 |
| Baja | Within **1 month** of ceasing the last activity | ROF art. 19.2 |
| "037 Declaración censal de modificación, personas físicas" | Appears in the official calendar with window **1 Jan–25 Apr**. Its purpose is not documented in the sources read | Cal2025, Cal2026; see the open list |
| Sanctions | Late censal return €800, halved to €400 if spontaneous. Incorrect censal return €500 | NFGT arts. 203.1.b, 203.2, 204.b |
| DUE / PAE | A DUE can replace the alta for entities in constitution | ROF art. 23 |

### IAE (Bizkaia)

| Item | Rule | Source |
|---|---|---|
| Exemption by size | Volumen de operaciones **< €2,000,000**. Applies to all sujetos pasivos, including personas físicas: **no blanket exemption for personas físicas as in common Spain**. Volume of the IRPF period whose filing deadline ended in the year before accrual; annualised if the period was shorter | IAE DFN 2/1992 art. 5.1.h |
| Exemption at start | First **2 tax periods** of a new activity. Not if the activity was carried on before under another holder, or within the same IAE group | IAE DFN 2/1992 art. 5.1.g |
| Matrícula | Exempt personas físicas: the 036 replaces the IAE returns. Non-exempt: modelo 840 for alta, baja and variations. Losing or gaining an exemption is declared in **December** of the previous year | ROF art. 22.3; FAQ 900000754 |
| Receipt payment (non-exempt) | 10 Sep–10 Oct | Cal2025, Cal2026 |
| Tariffs | DFN 1/1991 (Bizkaia Tarifas e Instrucción) | bizkaia.eus normativa, actividades económicas |

**Sección 1ª vs 2ª/3ª: what changes for the app**

| Effect | Sección 1ª (empresarial) | Sección 2ª/3ª (profesional) |
|---|---|---|
| Retención on invoices to Spanish businesses | None | 15% / 7% (RIRPF 94) |
| 130 waiver at ≥ 70% retención | Not available (only professional and agricultural) | Available (RIRPF 109.3) |
| Mercantile accounting in estimación directa *normal* | Required if mercantile (NFIRPF 114.5) | Not required (non-mercantile) |
| BATUZ phase-in date | Varied by division (all done by 1 Jan 2026) | Varied (all done) |
| IAE exemption | Same €2M / 2-year rules | Same |

---

## 6. Annual calendar: Bizkaia persona física, estimación directa simplificada, quarterly IVA, BATUZ

Assumptions: no employees, no rented premises (110 and 115 only if those apply), intra-EU services possible (349). Weekend or holiday deadlines move to the next business day (Cal2026 note).

| Window | Form / action | Covers | Applies when | Source |
|---|---|---|---|---|
| **1–31 Jan** | **130** Q4 | Oct–Dec of the previous year | Always, unless exempt at 70% | RIRPF 111; RGest DA 1ª |
| 1–31 Jan | **390** final IVA autoliquidación | Whole previous year, **including Q4** (no Q4 303) | Always (quarterly IVA) | OF 362/2023 art. 3.Dos; Cal2026 |
| 1–31 Jan | **349** Q4 | Oct–Dec | Only if there were intra-EU operations | RIVA 81.3; Cal2026 |
| by **31 Jan** | **LROE 140**: Q4 entries, chapters 1–5 | Oct–Dec | Always | ROF 39 nonies.1 |
| during **January** | **LROE 140**, chapter 6 "otra información" (annual) | Previous year | Always (e.g. the IRPF method) | ROF 39 nonies.4, 39 octies |
| 1–31 Jan | **110** Q4 + **190** annual | Retenciones withheld | Only if you paid professionals or employees with retención | RIRPF 106.2–3; FAQ 900002641 |
| 1–31 Jan | **115** Q4 + **180** annual | Rent retención | Only if you rent premises | Cal2026 |
| 1 Jan–25 Apr | **037** censal modification, personas físicas | ? | Unknown trigger (see the open list) | Cal2026 |
| February | **347** | — | **Not for LROE keepers** | ROF 43.e |
| **1–25 Apr** | **130** Q1, **303** Q1, **349** Q1, **110/115** Q1 | Jan–Mar | As above | RIRPF 111; OF 362/2023; Cal2026 |
| by **25 Apr** | **LROE** Q1 entries (and before the 303 is filed) | Jan–Mar | Always | ROF 39 nonies.1 |
| **~15 Apr–30 Jun** (2026 campaign) | **Renta (IRPF)** for the previous year (autoliquidación or borrador) | Previous year | Always | Cal2026 (dates "15 abril–30 junio" and "4 mayo–30 junio" appear; the second is likely Patrimonio. Cal2025: Renta 10 Apr–30 Jun) |
| **1–25 Jul** | **130** Q2, **303** Q2, **349** Q2, **110/115** Q2 | Apr–Jun | As above | idem |
| by **25 Jul** | **LROE** Q2 | Apr–Jun | Always | ROF 39 nonies.1 |
| 10 Sep–10 Oct | **IAE receipt** | Current year | Only if not exempt (≥ €2M) | Cal2026 |
| **1–25 Oct** | **130** Q3, **303** Q3, **349** Q3, **110/115** Q3 | Jul–Sep | As above | idem |
| by **25 Oct** | **LROE** Q3 | Jul–Sep | Always | ROF 39 nonies.1 |
| Continuous | **TicketBAI** invoice at issue. B2B: before the 16th of the month after accrual | Each operation | Always | NFIRPF 113 bis; RFact 11.1 |
| Continuous | LROE entry within **7 days** for operations without an invoice (if earlier than the quarter deadline) | Each operation | When it happens | ROF 39 nonies.2 |
| Event + 1 month | **036** alta, modificación or baja | Census change | When it happens | ROF 17–19 |
| Event | Rectificativa invoice (own series), within 4 years | Error or base change | When it happens | RFact 15 |
| Monthly 1–25 | 303 / 111 / 349 monthly | — | Only if REDEME, > €6.01M, or intra-EU > €50k per quarter | RIVA 71.3, 81.2; OF 362/2023 art. 3.Uno |

Differences from AEAT that the app must not get wrong:

- 25th, not 20th.
- January deadlines run to the 31st.
- No Q4 303; the 390 is a payable final return.
- The 130 is non-cumulative and uses the penúltimo año from year 3.
- No 347 for BATUZ filers.
- No % recargo for a late autoliquidación filed without a requerimiento: €400 fixed instead.

---

## Unverified / open

1. **Simplificada % inside the 130.** Does "gastos deducibles" in RIRPF 110.1.a include the art. 28 hard-to-justify reduction? If so, at what % in the start-year regime: 15% "por normativa de confección" (gestoría), or the art. 28 tier (20% / 15% / 10%)? The official modelo 130 Orden Foral and its casilla instructions were not found. FAQ 900000995 links "OF 636/2014", which was not fetched.
2. **Annualisation method** for "se elevará al año" (RIRPF 110.1.a): days or months active? No official worked example found.
3. **Loss quarters in the start-year regime:** confirm that there is no carry-forward between quarters. This is inferred from "devengados en cada trimestre natural" and the absence of a compensation rule.
4. **Whether the art. 25.5 start-up reduction (and similar) is excluded** from "rendimiento neto de la actividad" for the 5% general regime.
5. **Late-filing regime.** My reading is: no % recargo for late autoliquidaciones; €400 fixed (art. 203.3) plus a 30% reduction; interest only beyond 6 months. It comes from the NFGT text, but no Bizkaia FAQ or secondary source confirming it was found, and one secondary source (euskadi.eus Zergak article) suggests Bizkaia has a single "recargo". Confirm with Hacienda Foral or a gestoría before shipping the surcharge calculator.
6. **349 deadline:** the Bizkaia RIVA text (art. 81) says "veinte primeros días naturales" (30 for January). The official calendars 2025 and 2026 show 1–25 (and 1–31 January). The Bizkaia 349 Orden Foral that probably sets 25 was not located. Use the calendar (25) and flag it.
7. **Modelo 130 and 390 domiciliación and payment conditions:** only the 303 order (OF 362/2023 art. 4) was read. Assumed analogous.
8. **"037 Declaración censal de modificación, personas físicas" (1 Jan–25 Apr)** in the official calendar: purpose not documented in the sources read. It may be the annual window to change the IRPF method or option, or for IVA options. Needs the Bizkaia 036/037 Orden Foral.
9. **Renta 2026-campaign dates:** the PDF extraction of Cal2026 shows "15 abril–30 junio" and "4 mayo–30 junio" without clear row mapping. Confirm on bizkaia.eus each year; the app should make them configurable.
10. **Concierto Económico for retenciones by common-territory payers** (which rate rules apply, and which Hacienda receives the retención): not read. Ley 12/2002 art. 7 to check.
11. **TicketBAI exemption for "actividades esporádicas de escasa relevancia"** (Nov 2025 Diputación presentation): legal text not located. Likely DF 100/2025 of 13 Nov (on batuz.eus normativa), which was not read.
12. **TicketBAI from day one for new altas after 1 Jan 2026:** inferred because all phase-in windows have passed. No explicit FAQ was read for a 2026+ alta.
13. **349 "code S" and non-EU clients:** out of scope here. A non-EU client means no 349 line, but that is not verified in this file.
