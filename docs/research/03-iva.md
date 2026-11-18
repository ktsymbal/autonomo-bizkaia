# 03 — IVA (VAT) for autónomos in Bizkaia: spec research

Researched 2026-11-18. Scope: rules a calculator/compliance app needs for an autónomo with **domicilio fiscal in Bizkaia**. Official texts were downloaded and read in full where cited (not snippets).

## Sources (short keys used below)

| Key | Source | Version read |
| --- | --- | --- |
| **CE** | Concierto Económico, Ley 12/2002, consolidated — https://www.boe.es/eli/es/l/2002/05/23/12/con | consolidated, online 2026-11 |
| **L3/25** | Ley 3/2025, de 29 de abril, modifica el Concierto — https://www.boe.es/boe/dias/2025/04/30/pdfs/BOE-A-2025-8568.pdf | BOE 30/04/2025 |
| **NFIVA** | Norma Foral 7/1994 del IVA (Bizkaia), consolidated — https://www.bizkaia.eus/documents/880307/15187815/ca_7_1994.pdf/610d9a71-b900-5c10-4887-fd9bd332ef99 | "Última modificación normativa: 01/01/2026" |
| **RIVA** | RD 1624/1992 (state IVA Reglamento). Bizkaia lists it as the *desarrollo* of NFIVA — https://www.bizkaia.eus/es/normativa-tributaria/normativa-vigente/iva | — |
| **DF4/13** | Decreto Foral 4/2013, Reglamento de facturación (Bizkaia) — https://www.bizkaia.eus/documents/880307/15187815/ca_4_2013.pdf/b9f611c5-50ac-9a3c-ad9b-b6d488af14c7 | "Última modificación normativa: 01/01/2024" |
| **I303** | Bizkaia Modelo 303 instructions — https://www.bizkaia.eus/fitxategiak/05/ogasuna/ereduak/Argitaratu/303CasInstrucciones.pdf | current, downloaded 2026-11-18 |
| **I390** | Bizkaia Modelo 390 instructions — https://www.bizkaia.eus/fitxategiak/05/ogasuna/ereduak/Argitaratu/390CasInst.PDF | current |
| **I349** | Bizkaia Modelo 349 instructions — https://www.bizkaia.eus/fitxategiak/05/ogasuna/ereduak/Argitaratu/349CasInst.pdf | current |
| **I369** | Bizkaia Modelo 369 (OSS) instructions — https://www.bizkaia.eus/fitxategiak/05/ogasuna/ereduak/Argitaratu/369CasInst.pdf | current |
| **B303** | BATUZ "Reglas de cálculo del borrador del modelo 303" v1.0.4 — https://www.batuz.eus/fitxategiak/batuz/lroe/reglas%20_borrador_303_cas_v1.0.4.pdf | Feb 2026 |
| **B390** | BATUZ "Reglas de cálculo del borrador del modelo 390" v1.0.3 — https://www.batuz.eus/fitxategiak/batuz/lroe/reglas_borrador_390_cas_v1.0.3.pdf | — |
| **OF124/09** | Orden Foral 124/2009, Registro de devolución mensual (RDM) — https://www.bizkaia.eus/documents/880307/15187815/ca_124_2009.pdf/fde08b67-675a-6086-2b09-e4b15a3a0acc | last mod. 29/10/2009 |
| **OF7/26** | Orden Foral 7/2026, índices y módulos régimen simplificado IVA 2026 — https://www.bizkaia.eus/documents/880307/15187815/ca_7_2026.pdf/aa7c4733-cc2f-aaa1-2928-62ec0476b50b | BOB 21/01/2026 |
| **LIVA** | Ley 37/1992 (state) — https://www.boe.es/buscar/act.php?id=BOE-A-1992-28740 | for comparison only |

Key structural fact: IVA is a *tributo concertado de normativa común*: Bizkaia must apply the **same substantive rules as the State** (CE art. 26), so NFIVA mirrors LIVA almost article-for-article (same numbering: art. 20, 69, 84, 91, 95…). What is foral: **who you file with, forms, box numbering, deadlines, refund procedure, invoicing/BATUZ, and the General Tax Norm (NF 2/2005) for penalties/surcharges/interest.** Cite NFIVA articles on Bizkaia invoices; the Ley 37/1992 article numbers are identical, so existing legends citing "art. 69.Uno.1º Ley 37/1992" are not wrong, just not foral.

---

## Summary (what the app must encode)

1. **Jurisdiction:** volumen de operaciones of the previous year **≤ €12M** (from periods starting 1 Jan 2026; was €10M) ⇒ 100 % of IVA to the Hacienda Foral of the **domicilio fiscal** territory. For a Bizkaia-resident autónomo that is always Bizkaia in practice.
2. **Rates:** 21 / 10 / 4 / 0 %, plus 5 % box (temporary, energy) and recargo de equivalencia 5.2 / 1.4 / 0.5 / 1.75 %. Most autónomo services = 21 %. Art. 20 exempt activities (health, education, tutoring, authors…) ⇒ no output IVA **and** no input deduction ⇒ prorrata if mixed.
3. **Place of supply (services):** B2B ⇒ where the client is (art. 69.Uno.1º): EU business ⇒ no Spanish IVA, client reverse-charges, **303 box 105**, **349 key S**; non-EU business ⇒ no Spanish IVA, **303 box 106**, no 349. B2C ⇒ Spain (21 %) by default, except listed services to non-EU consumers (art. 69.Dos) and TBE (digital/telecom/broadcast) services to EU consumers above €10,000 (OSS, Modelo 369).
4. **Input deduction:** only with a compliant factura completa; only for goods/services **exclusively** used in the activity (art. 95), except investment goods (proportional; cars presumed 50 %); hard exclusions in art. 96 (food, drink, gifts, leisure, travel/hotel unless IRPF-deductible). 4-year window.
5. **Filing (Bizkaia ≠ AEAT):** quarterly 303 for Q1–Q3 (1–25 Apr/Jul/Oct). **There is no Q4 303 in Bizkaia** for quarterly filers: Q4 goes in the **Modelo 390 "autoliquidación final", due 1–31 January**. Refunds can be requested **only in the 390** (unless enrolled in the RDM, which forces monthly filing). Negative results in Q1–Q3 can only be carried forward.
6. **Special regimes:** recargo de equivalencia and **régimen simplificado still exist in Bizkaia** (OF 7/2026; not for professional/IT activities); criterio de caja (≤ €2M); REBU; REAGP. **No SME VAT franchise** (Directive 2020/285) in Spain or Bizkaia as of the latest verified sources.
7. **Corrections:** rectificativa within 4 years; bad debts: reduce base after 6 months/1 year + judicial/notarial claim, within the following 6 months; not possible if the client isn't established in Spain. Intra-EU services bought (e.g. Irish SaaS): self-assess (boxes 17/18 + 26, net zero if fully deductible) and report in 349 key I.


---

## 1. Which administration: Concierto Económico

### Plain explanation
IVA is collected by whichever administration the Concierto points to. Small and medium businesses (volume ≤ €12M last year) pay **everything** to the administration of their tax domicile, wherever they operate. Above €12M, it is split by where operations happen. For an individual, tax domicile = habitual residence (mainly days spent; Bizkaia vs other Basque territories decided by days there).

### Decision logic
```
input: prev_year_VO (EUR, excl. IVA and RE), domicilio_fiscal, operates_in = {Bizkaia, Araba, Gipuzkoa, común, Navarra}
if first_year_of_activity:
    VO_test = VO_of_first_calendar_year annualised if activity started mid-year   # CE 27.Dos, NFIVA 2 bis.Dos
else:
    VO_test = prev_year_VO
THRESHOLD = 12_000_000 if period_start >= 2026-01-01 else 10_000_000            # L3/25 DT 1ª
if VO_test <= THRESHOLD:
    admin = admin_of(domicilio_fiscal)                     # Bizkaia => Hacienda Foral de Bizkaia, 100 %
    pct_bizkaia = 100                                       # 303 box 32 = 100 for quarterly filers (B303)
elif operates only in Bizkaia: admin = Bizkaia 100 %
else:
    split by VO located in each territory (CE 28; services: where rendered from) # 390 boxes 81–92
    file identical returns in every administration (I303 Nota 1)

domicilio_fiscal(person):                                 # CE 43; NFIVA 2 ter
    1. more days in País Vasco in the IRPF period AND more days in Bizkaia than each other Basque territory
       (vivienda habitual in Bizkaia => presumed present)
    2. else main centre of interests (largest share of IRPF base, excl. capital mobiliario)
    3. else last declared IRPF residence
    (resident in Spain <183 days anywhere: where the core/base of business activity is — CE 43.Dos / NFIVA 2 ter.2)
```

### Parameters
| Parameter | Value | Citation |
| --- | --- | --- |
| VO threshold | **€12,000,000** for periods starting ≥ 1 Jan 2026 (was €10M; €7M before 2018) | CE art. 27.Uno.Tercera as amended by L3/25 art. único.Catorce; L3/25 DT 1ª ("se inicien a partir del 1 de enero de 2026"); NFIVA art. 2 bis.Uno.1 and art. 167.Tres.1º |
| VO definition | consideration excl. IVA and recargo de equivalencia from supplies of goods and services in the activity | CE 27.Dos; NFIVA 2 bis.Dos |
| Start year | use VO of the first calendar year, annualised | CE 27.Dos; NFIVA 2 bis.Dos |
| Service connecting point (only matters > threshold) | "se entenderán realizadas en territorio vasco cuando se efectúen desde dicho territorio" | CE 28.Uno.B |
| Domicile tests | days → centre of interests → last declared residence | CE 43.Uno; NFIVA 2 ter |

### Edge cases
- For the 390 territorial allocation, VO **excludes** non-sujetas and exempt-without-deduction operations (I390, boxes 81–92). An autónomo whose sales are all *no sujetas* (foreign B2B) still files with Bizkaia via the ≤ €12M rule. Box 32/88 = 100.
- Moving domicile mid-year (e.g. Bizkaia → Gipuzkoa or → common territory): CE 43 has anti-abuse and change-of-domicile rules. **Not modelled; open item.**
- The euskadi.eus IVA explainer still says €10M. It is outdated; the BOE text governs.

---

## 2. Rates and exemptions

### Plain explanation
The default is 21 %. The reduced rates (10 %, 4 %) cover mostly goods (food, medicines, books, housing) and a short list of services (passenger transport, hospitality/restaurants, some building renovation, cultural entry). Almost every typical autónomo service (IT, consulting, design, marketing, translation, coaching) is **21 %**. Some services are **exempt** (art. 20): exempt means no IVA charged and **no right to deduct** the IVA you pay on costs. If you mix exempt and taxed work, you apply the prorrata (section 4).

### Parameters: rates
| Rate | Typical autónomo cases | Citation |
| --- | --- | --- |
| 21 % | default: software, IT, consulting, design, marketing, legal, accounting, coaching not in art. 20, digital services | NFIVA 90.Uno |
| 10 % | passenger transport; hospitality, restaurants; renovation/repair of homes (conditions); entry to museums/libraries; amateur sports shows; trade fairs; **services of interpreters, artists, directors and technicians (natural persons) to film producers and theatre/music organisers** | NFIVA 91.Uno.2 (items 1, 2, 6, 8, 9, 10, 13) |
| 4 % | bread, milk, eggs, fruit/veg, etc.; books/newspapers incl. e-books (not mainly ads/video/music); human medicines; prostheses; VPO housing; teleasistencia/home help/day centres under public contracts; repairs of vehicles for reduced-mobility persons | NFIVA 91.Dos |
| 5 % | box 110/111 still on the 303 (temporary energy/food measures; check validity per period) | I303, B303 |
| 0 % | donated goods to non-profits | NFIVA 91.Cuatro |
| RE | 5.2 % (21 %), 1.4 % (10 %), 0.5 % (4 %), 1.75 % (tobacco) | NFIVA 161; I303 boxes 09–16 |

The rate is the one in force at **devengo** (NFIVA 90.Dos). Devengo for services is when they are performed; for continuous services, when each instalment is due; advance payments are taxed on receipt (NFIVA 75.Uno.2º, 75.Uno.7º, 75.Dos).

### Parameters: exemptions relevant to autónomos (NFIVA art. 20.Uno)
| No. | Activity | Note |
| --- | --- | --- |
| 3º | medical/health care to individuals by health professionals, **incl. psychologists, speech therapists, opticians** with official qualifications | diagnosis, prevention, treatment only (cosmetic/expert reports are not) |
| 9º | school, university, postgraduate, **language teaching and professional training/retraining** by public bodies or **authorised private entities** | "autorizadas" requirement: see open items |
| 10º | **private lessons by individuals** on subjects in official curricula | not if the activity requires alta in business/artistic IAE tariffs |
| 13º | sports services to individuals by non-profits | — |
| 16º / 18º | insurance; financial services | relevant for agents/brokers |
| 23º | residential lettings (vivienda), with exceptions | — |
| 26º | **professional services of visual artists, writers, literary/graphic/photo contributors to newspapers and magazines, composers, playwrights, screenwriters, translators and adapters**, incl. those paid as author's rights | translators: watch the scope |

### Logic
```
classify(service):
    if exempt_under_art20(service): rate = EXEMPT; deduct_right = False; 303 box: none for output IVA
        # exempt sales still count in the prorrata denominator; LROE causa exención E1
    elif reduced_10(service): rate = 0.10
    elif reduced_4(service): rate = 0.04
    else: rate = 0.21
output_iva = round(base * rate, 2)   # per invoice line; rate must appear on the invoice (DF4/13 6.1.g)
```

### Edge cases
- Exempt-only taxpayers: under state RIVA 71.4 they are not required to file periodic returns. Whether Bizkaia applies the same exoneration (and how BATUZ treats it) is **not verified**.
- Under art. 20.Dos/Tres, waiving exemptions is only possible for real estate; there is no opt-out for services.
- Courses and training sold online may be education (exempt if authorised) **or** e-services (21 %, and TBE rules if B2C cross-border). Classification is a fact question; the app should ask the user, not decide.

---

## 3. Place of supply for services, invoice legends, boxes

### Plain explanation
Who the client is decides where the service is taxed. For a **business** client the rule is where the **client** is established. For a **private** client it is where **you** are (Spain), with exceptions: digital/telecom/broadcast services to EU consumers are taxed in the consumer's country (once EU-wide B2C sales of these exceed €10,000, or by option), and a list of "intellectual" services (consulting, IT data processing, advertising, translation, licences…) to **non-EU** consumers is outside Spanish IVA. Special rules (real estate, events, restaurants, passenger transport) override all of this.

### Decision tree
```
locate(service, client):
    if service is real-estate-related:      taxed where property is                   # NFIVA 70.Uno.1
    elif event_admission and client is B2B: where event takes place                   # 70.Uno.3
    elif restaurant/catering/passenger transport/short-term vehicle hire: special     # 70.Uno.2, 5, 9
    elif client.is_business (acting as such):                                          # 69.Uno.1º
        if client established in Spain (TAI):
            -> DOMESTIC: charge Spanish IVA (21 % unless reduced/exempt); 303 boxes 03–08 (+110/111)
               (exception: ISP cases of 84.Uno.2º: gold, scrap, construction subcontracts... -> box 107)
        elif client in other EU MS with valid VAT number (VIES):
            -> NO SUJETA in Spain; client self-assesses (reverse charge)
               303 box 105; 349 key S (client's VAT no.); LROE: causa no sujeción RL + NIF-IVA
        else (non-EU business, or EU business w/o VAT no. — see edge cases):
            -> NO SUJETA; 303 box 106; no 349
               (no "use and enjoyment" override for B2B: 70.Dos only applies to B2C)
    else client is a consumer:
        if TBE service (electronic/telecom/broadcast) and consumer in another EU MS:          # 70.Uno.4/8, 73
            if prev_year_EU_B2C_TBE_and_distance_sales <= 10_000 and current_year <= 10_000 and not opted:
                -> Spanish IVA 21 % (box 03–08)
            else:
                -> taxed in consumer MS at its rate; via OSS (Modelo 369, quarterly) -> 303 box 108
        elif consumer outside EU (excl. Canarias, Ceuta, Melilla) and service in art. 69.Dos list
             (licences/IP, advertising, consulting/engineering/lawyers/accountants, data processing & information,
              translation, staff provision, movable-goods hire...):
            -> NO SUJETA; 303 box 106
        else:
            -> Spanish IVA 21 % (69.Uno.2º)
```

### Invoice legends (DF4/13 art. 6; Directive 2006/112 art. 226)
| Case | Mandatory content beyond the basics | Suggested legend |
| --- | --- | --- |
| Domestic taxed | rate(s), cuota shown separately (6.1.g–h); client NIF mandatory when the operation is located in Spain and the issuer is established here (6.1.d.3) | — |
| Exempt | reference to Directive/NFIVA provision **or** "operación exenta" (6.1.j) | "Operación exenta de IVA, art. 20.Uno.[n]º NF 7/1994 (art. 132 Directiva 2006/112/CE)" |
| EU B2B (reverse charge) | client **VAT number** (6.1.d.2); "**inversión del sujeto pasivo**" (6.1.m); invoice required even though not Spanish-taxed (DF4/13 2.3.b.b′.a″) | "Inversión del sujeto pasivo – reverse charge (art. 196 Directiva 2006/112/CE). Operación no sujeta al IVA español, art. 69.Uno.1º NF 7/1994 del IVA de Bizkaia." |
| Non-EU B2B | invoice still required (DF4/13 2.3.b.b′.b″) ; no legal legend required by DF4/13 (no exemption, no Spanish ISP) | Recommended for audit trail: "Operación no sujeta al IVA: servicio prestado a empresario establecido fuera de la UE (art. 69.Uno.1º NF 7/1994)". Identify client as a business (registration no.) — that is what evidences B2B. |
| OSS B2C | invoicing rules of Spain apply when Spain is MS of identification (DF4/13 2.3.a) | foreign rate + "IVA [country]" |
| Criterio de caja | "régimen especial del criterio de caja" (6.1.p) | — |
| Invoice deadline | at the time of the operation; B2B: **before the 16th of the following month** (DF4/13 11.1); monthly recap invoices allowed (13) | — |
| BATUZ | invoices must be issued via TicketBAI-certified software (QR + TBAI code) and fed into LROE; outside DF4/13, see BATUZ norms | — |

### 303 boxes (Bizkaia numbering, I303 + B303)
| Box | Content |
| --- | --- |
| 48 / 03 / 110 / 05 / 07 | base at 0 / 4 / 5 / 10 / 21 % |
| 04 / 111 / 06 / 08 | cuota at 4 / 5 / 10 / 21 % |
| 09–16 | recargo de equivalencia bases/cuotas |
| 17 / 18 | **intra-EU acquisitions of goods and services**: base / cuota (self-assessed) |
| 19 / 20 | other reverse-charge (ISP) received, e.g. services from non-EU suppliers: base / cuota |
| 21 / 22; 46 / 47 | modifications of bases/cuotas: general; art. 80.Tres/Cuatro (insolvency/bad debt) |
| 23 | total devengado = 04+06+08+10+12+14+16+18+20+22+47 (+111) |
| 24 / 25 / 26 / 27 | deductible: domestic (incl. ISP domestic-type) / imports / **intra-EU acquisitions** / REAGP |
| 28 / 29 | regularisation of investment goods / final prorrata (29 only December for RDM) |
| 30 | total deductible = 24+…+29 |
| 31 | diferencia = 23 − 30 |
| 45 | art. 80.Cinco.5ª adjustment |
| 32 | % Bizkaia (100 for quarterly filers) |
| 33 | cuota atribuible a Bizkaia = (31 + 45) × 32 % |
| 34 | cuotas a compensar from earlier periods (from box 38 of the previous 303, or box 112 of last year's 390) |
| 35 | annual regularisation result |
| 36 | resultado = 33 − 34 + 35 (instructions also net box 44, fuel deposit payments) |
| 37 | "sin actividad" |
| 38 / 39 / 40 | a compensar / **a devolver (RDM only)** / a ingresar |
| 41–43 | complementary return |
| 104 | exports and other exempt operations with right to deduct |
| **105** | **intra-EU supplies of goods (art. 25) and intra-EU services** (B303: recipient has NIF-IVA and S2 or causa no sujeción RL) |
| **106** | **no sujetas by place-of-supply rules, except 108 and except intra-EU services** (B303: recipient **without** NIF-IVA and RL) |
| 107 | domestic ISP supplies (gold, scrap, construction, etc.) |
| 108 / 109 | OSS no sujetas / OSS sujetas |
| 200–203 | criterio de caja |
| 50–103 | "información adicional": purchases split current goods / expenses / investment goods by rate; prorrata flags and % |

AEAT's 303 numbers boxes differently (e.g. AEAT 59 / 60 / 120 / 122 / 71). **Never reuse AEAT box mappings.**

### 349 (I349)
- Report EU B2B services supplied (**key S**) and EU services received that you self-assess (**key I**), plus goods (E, A, T…).
- Period: monthly by default; **quarterly if neither the current quarter nor any of the previous 4 quarters exceeds €50,000** of reportable supplies (excl. IVA). If exceeded mid-quarter, switch to monthly from that month.
- Deadline: 1–25 of the following month/quarter; **July → August + 1–25 Sept; December/Q4 → 1–31 January**.

### OSS / Modelo 369 (I369)
- Registration via the census form 035 (I369 references "formulario censal de alta (modelo 035)"); Spain = MS of identification, filed with Bizkaia.
- Régimen de la Unión: quarterly, **1–25 of the month after the quarter** (Bizkaia); this is shorter than the EU "end of following month".
- €10,000 EU-wide threshold for TBE services + intra-EU distance sales, previous **and** current year; option to tax at destination binds ≥ 2 years (NFIVA 73).
- Domestic (Spanish) B2C sales never go in 369.

### Edge cases
- **EU business without a valid VAT number / not in VIES**: art. 69.Uno.1º turns on "empresario o profesional actuando como tal", not on VIES. But without a VAT number you can't evidence status, box 105/349 can't be filled, and the BATUZ draft would push it to 106. Practical rule in the app: require VIES validation or a documented business status, otherwise warn and treat as B2C (21 %).
- **Non-EU B2B**: no sujeta, box 106, no 349, no Spanish ISP legend required. IVA on costs remains deductible under NFIVA 94.Uno.2 (operations abroad that would give a right to deduct if done in Spain).
- **Payment agent (Deel, US)**: the place of supply depends on the **recipient of the service** (the contract counterparty, i.e. the end client), not on who pays. Invoice the HK entity.
- **B2C digital services to non-EU consumers**: neither NFIVA 69.Dos nor LIVA 69.Dos lists electronic/telecom services, and 70.Uno.4/8 only cover consumers in Spain/the EU. Directive art. 58 places them where the consumer is. How Bizkaia/DGT resolves the gap is **not verified**; open item.
- **Use-and-enjoyment** (NFIVA 70.Dos): only for 69.Dos services to **non-business** recipients and transport-hire, when not located in the EU but used in Spain. Not relevant for B2B.

---

## 4. Input IVA deduction

### Plain explanation
You can subtract IVA paid on costs from IVA charged, if: (a) you are in the activity, (b) the cost is used **only** for the activity (shared private/business current costs are not deductible under the letter of the law), (c) you hold a full invoice in your name with your NIF, (d) it is not on the blocked list, and (e) you claim it within 4 years. Investment goods (cars, laptops > asset) can be partly deducted by business-use %, cars presumed 50 %.

### Formula / logic
```
deductible(expense):
    require invoice.type == factura_completa with buyer name+NIF+address, cuota stated separately  # NFIVA 97.Uno.1º, Dos, Tres; DF4/13 6.4
    require expense used in operations giving right to deduct (taxed, exports, intra-EU, or abroad-equivalent) # 94
    if expense in BLOCKED (art 96.Uno): jewellery; food/drink/tobacco; leisure/shows; gifts/attention to clients/staff
         (except low-value promo items); travel, hotel, restaurant UNLESS deductible expense for IRPF  -> 0
    if is_investment_good(expense):                 # 95.Tres; 108 (assets > €3,005.06 and >1 yr — see RIVA/NFIVA 108)
        if is passenger car / motorbike:  pct = 50 % presumption (100 % for listed uses: delivery mixed vans,
             taxis, driving schools, sales reps, security...)  -> regularise if actual use differs (95.Tres.3ª)
        else: pct = reasonable expected business-use %  (95.Tres.1ª)
        also applies to fuel, parts, parking, tolls, repairs of those vehicles (95.Cuatro)
        deductible = cuota * pct
    elif used exclusively in activity: deductible = cuota
    else (current good/service with mixed private use): deductible = 0 per letter of 95.Dos.2   # see edge case
    if prorrata applies: deductible *= prorrata_pct
    timing: claim in the period the invoice is received or within 4 years of the right arising (99.Tres, 99.Cuatro)

prorrata (only if the activity mixes exempt-without-deduction sales with deductible sales):       # 102–106
    general_pct = ceil( deductible_sales / total_sales * 100 )   # NFIVA 104.Dos rounds up to next whole unit
        exclude from both: IVA itself, sales of investment goods, occasional real-estate/financial ops,
        art. 7 non-sujetas, autoconsumo 9.1º.d (104.Tres)
        services performed outside Spain: count at contraprestación × (cost borne in Spain / total cost),
        ignoring employee costs (104.Cinco)
    provisional % = last year's final %; start year: estimated % (105.Uno, Tres; 111)
    final % computed in last return of the year (390 in Bizkaia) and regularise (105.Cuatro)
    especial: deduct 100 % of exclusively-taxed-use costs, 0 % of exclusively-exempt-use, general % on shared (106)
        mandatory if general gives ≥ 10 % more deduction than especial (103.Dos.2); optional otherwise,
        opted in last return of the year, minimum 3 years (I303 / I390 box 05)
```

### Parameters
| Parameter | Value | Citation |
| --- | --- | --- |
| Document | original full invoice (or customs doc / self-assessed ISP invoice) | NFIVA 97.Uno |
| Exclusive-use rule | mixed private/business current goods/services **not** "afectos" | NFIVA 95.Uno–Dos |
| Vehicles | 50 % presumption; 100 % listed exceptions; proof by any means (the return itself is not proof) | NFIVA 95.Tres.2ª, 4ª |
| Blocked items | art. 96.Uno list; travel/hotel/restaurant only if IRPF-deductible | NFIVA 96.Uno.6º |
| Deduction window | 4 years from when the right arises | NFIVA 99.Tres, 100 |
| Carry forward of excess | 4 years from the return where it arose | NFIVA 99.Cinco |
| Prorrata rounding | up to next integer | NFIVA 104.Dos (final para.) |
| Special prorrata trigger | general ≥ 110 % of special | NFIVA 103.Dos.2 |

### Edge cases
- **Home office suministros (electricity, internet, gas)**: the NFIVA 95.Dos.2 letter blocks mixed-use current costs. Secondary sources report a Supreme Court judgment (STS 3487/2025, July 2025) and TEAC doctrine allowing a proportional deduction on proven professional use. The foral (Bizkaia) position and the exact citations are **not verified**. The app should show it as an option with a risk flag, not compute it by default. Separately, the user decided not to affect any part of the flat (brief, IRPF reasons). Internet/phone lines used only for work are fully deductible.
- **Invoices from EU suppliers that charged foreign VAT** (no ROI number given): that foreign VAT is **not** deductible in the 303; it is reclaimed via the EU refund procedure (NFIVA 117 bis). App: flag foreign VAT on EU B2B purchases as an error.
- **Pre-activity costs**: deductible if the start of activity was declared (NFIVA 111). Otherwise lost; that matches the excluded July invoice in the brief.
- **Simplified invoices (tickets)**: they do not support a deduction unless they include buyer NIF/address and the cuota stated separately (DF4/13 art. 7 "factura simplificada cualificada"); verify per ticket.
- **Social Security, insurance, bank fees**: no IVA (exempt/outside scope); nothing to deduct.

---

## 5. Modelo 303 / 390 in Bizkaia: periods, deadlines, refunds

### Plain explanation
Most autónomos file **quarterly**. In Bizkaia you file a 303 for Q1, Q2 and Q3 (by the 25th of April, July and October). The fourth quarter is **not** filed on a 303. It goes into the **annual Modelo 390**, which in Bizkaia is the year's *final return* (not just a summary), due 1–31 January. If the result is negative during the year, you carry it forward. A cash refund can only be requested in the 390, unless you join the monthly refund register (RDM), which forces monthly 303s.

### Formula
```
for period in Q1..Q3 (quarterly) or months 1..11 (monthly):
    devengado = sum(output cuotas incl. RE, ISP self-assessed [18, 20], modifications [22, 47])        # box 23
    deducible = sum(deductible inputs after prorrata [24..27]) + regularisations [28, 29]              # box 30
    dif = devengado - deducible                                                                       # box 31
    atrib = (dif + box45) * pct_bizkaia                                                                # box 33
    res = atrib - compensar_prev + regul_anual                                                          # box 36
    if res > 0: pay (box 40) by day 25
    elif in RDM: may request refund (box 39)
    else: carry forward (box 38) -> becomes next period's box 34
Q4 / December (non-RDM): no 303; file Modelo 390 "autoliquidación final" 1–31 Jan:
    390.95 = 48 - 66 (annual devengado - deducible)
    390.96 = (95 + 120) * %Bizkaia(88)
    390.98 = 96 - 97 (compensations pending from previous YEARS)
    390.110 = 98 - 99 (amounts paid in Q1–Q3 303s) + 100 (refunds already obtained) ... -> 112 compensar / 113 devolver / 114 ingresar
refund: Hacienda has 6 months from the filing deadline (i.e. until ~31 July) to issue a provisional assessment;
        after that, late-payment interest runs automatically (NFIVA 115.Tres)
```
(The 390 result formula above is reconstructed from the box descriptions in I390. The exact arithmetic of box 110 is not spelled out in the text read; confirm against B390 before coding.)

### Parameters
| Item | Value | Citation |
| --- | --- | --- |
| Default periodicity | quarterly | I303 ("Plazo de presentación") |
| Monthly mandatory | prior-year VO > €6,010,121.04, or enrolled in RDM, or group of entities | I303 points 2–3; NFIVA 116.Uno |
| 303 deadline (quarterly) | days 1–25 of month after quarter (April, July, October) | I303 |
| 303 deadline (monthly) | days 1–25 of next month; July → August + 1–25 Sept | I303 |
| Q4 / December | **no 303** for quarterly or non-RDM monthly filers; result goes to 390 | I303; I390 point 1 |
| 390 | "autoliquidación final" for régimen general; deadline **1–31 January** | I390 |
| 390 for RDM / groups | informative annual summary; December 303 is the final return (1–31 Jan) | I303; I390 point 2 |
| Refund | only on 31 Dec balance in last return of year | NFIVA 115.Uno; OF124/09 art. 1 |
| Monthly refund | RDM members: each period; mandatory monthly 303; not for simplificado users; apply in January (or during a filing window; effect from following period); stay ≥ 1 year (≥ 2 if joined mid-year/pre-activity) | NFIVA 116; OF124/09 arts. 2, 3, 6 |
| Refund deadline for Hacienda | 6 months from end of filing period, then interest | NFIVA 115.Tres |
| Excess carry-forward | 4 years | NFIVA 99.Cinco |
| Weekend/holiday | moves to next working day | Bizkaia Calendario fiscal 2026 note — https://www.bizkaia.eus/documents/d/guest/calendario-fiscal-2026 |
| Filing channel | electronic only | DF 100/2020 (cited in I303/I390) |
| BATUZ | Hacienda prepares a **draft (borrador)** of 303 and 390 from LROE entries | B303, B390 |

### Edge cases
- **390 removed?** No. For Bizkaia quarterly filers the 390 *is* the Q4 return, so it cannot be dropped. (AEAT's exoneration of the 390 for some taxpayers does not transfer; it is a common-territory rule.) Under BATUZ the 390 is pre-filled (B390), not abolished.
- **Complementary returns**: allowed when they increase the amount payable or reduce the refund/carry-forward (I303). Otherwise use a rectification request (NFIVA 89.Cinco.a; NF 2/2005 art. 118).
- **Late filing surcharges / interest**: governed by NF 2/2005 (foral LGT) arts. 26–27, not the state LGT. Rates not researched here.
- **Concurso**: split returns (I303).
- **First year**: if no activity in a period, still file (box 37 "sin actividad").

---

## 6. Special regimes

| Regime | Exists in Bizkaia? | Who | Key mechanics | Citation |
| --- | --- | --- | --- | --- |
| **Recargo de equivalencia** | Yes, mandatory | individual retailers (comerciante minorista) selling goods to consumers | supplier charges IVA + RE (5.2/1.4/0.5/1.75 %); retailer files no 303 for these sales, cannot deduct; no RE for services | NFIVA 148–163; I303 09–16 |
| **Régimen simplificado (módulos)** | **Yes**, IVA only (Bizkaia abolished estimación objetiva in IRPF but kept IVA simplificado) | listed activities only (livestock, bakeries, retail food, bars, restaurants, hairdressers, taxis, transport, repairs… e.g. IAE 419.1, 642.5, 653.2, 671.5, 673.1/2, 721.1/3, 722, 757, 849.5, 933.1, 971.1, 972.1). **Not IT/professional services.** | excluded if prior-year income > €250,000 (non-agri) or purchases > €250,000; quarterly Modelo **310** + annual **391**; waiver/revocation until 25 April | NFIVA 122–123; OF7/26 arts. 1–2; Calendario fiscal 2026 |
| **Criterio de caja** | Yes, optional | prior-year VO ≤ €2,000,000 | output IVA due on collection, at the latest **31 Dec of the following year**; invoice legend; customers deduct only when they pay; 3-year lock-in after renunciation | NFIVA 163 decies–quaterdecies; DF4/13 6.1.p; I303 200–203 |
| **REBU** (used goods/art/antiques) | Yes | resellers | IVA on margin; legend | NFIVA 135–139; DF4/13 6.1.o |
| **REAGP** (agriculture) | Yes | farmers | flat-rate compensation 12 %/10.5 % paid by buyers | NFIVA 124–134 bis; I303 box 27 |
| **OSS / IOSS** | Yes | B2C cross-border | Modelo 369, 035 | NFIVA 163 noniesdecies+; I369 |
| **SME VAT franchise (Directive 2020/285)** | **No** | — | Spain never adopted a domestic franchise. The *cross-border* part of the Directive (Spanish SMEs using other MSs' franchises; forms 041/350) was **not transposed** as of March 2026: AEAT's 2026 control plan says "una vez se produzca la previsible incorporación al derecho interno de la Directiva (UE) 2020/285" (BOE-A-2026-5843), and the Commission referred Spain to the CJEU (press, March 2026). The Bizkaia NFIVA (consolidated 01/01/2026) contains no franchise regime. | https://www.boe.es/buscar/act.php?id=BOE-A-2026-5843; draft OM 041/350 https://www.hacienda.gob.es/sgt/normativadoctrina/proyectos/12112025-proyecto-om-modelos-041-350.pdf |

---

## 7. Corrections, bad debts, reverse charge on purchases

### 7a. Rectifying invoices
```
must issue rectificativa if: invoice lacks DF4/13 art 6/7 requirement, or cuota wrong, or art. 80 event   # DF4/13 15.1–2
deadline: as soon as known, max 4 years from devengo / art. 80 event                                   # DF4/13 15.3; NFIVA 89.Uno
series: separate series for rectificativas                                                             # DF4/13 6.1.a.2
content: identify rectified invoice(s); show either the difference or the corrected totals + difference # DF4/13 15.4–5
if rectification increases cuota:
    error not due to art. 80 / not "error fundado de derecho": complementary 303 for original period + surcharge + interest (NF 2/2005 arts 26–27)
    else: include in current period
    B2C + not art. 80 + increase: rectification not allowed (except legal rate rise)                    # NFIVA 89.Tres.1
if decreases cuota: either rectification request, or regularise in current return (up to 1 year later), refunding client  # NFIVA 89.Cinco
303 boxes: 21/22 (general modifications), 46/47 (art. 80.Tres/Cuatro)
BATUZ: rectificativa codes R1–R5 (B303 treats all codes the same since v1.0.4)
```

### 7b. Bad debts (modificación de base por impago, NFIVA 80.Cuatro)
```
eligible if all:
    elapsed since devengo (or due date for instalment sales) >= 1 year,
        or >= 6 months if seller's prior-year VO <= €6,010,121.04   (choice of 6 months or 1 year)
    recorded in the IVA books
    client is a business, or B2C base > €50
    claimed in court or by notarial demand (or certificate for public-body debts)
excluded: secured/insured/guaranteed part; related parties; client NOT established in Spain/Canarias/Ceuta/Melilla
          (except EU insolvency under Reg. 2015/848) ; after the client's concurso for earlier debts  # 80.Cinco
action: issue rectificativa within the 6 months after the 6-month/1-year period; communicate to Hacienda
        (state RIVA 24: within 1 month of the rectificativa; Bizkaia channel under BATUZ: verify)
after reduction: no increase if later paid (B2B); B2C: IVA deemed included in what's collected; withdrawing the claim -> rectify upward within 1 month
insolvency route (80.Tres): after auto de concurso, within 2 months of the end of the creditor-claim period
```
For the user's clients (EU, HK) bad-debt IVA relief is irrelevant: no Spanish IVA is charged, and foreign clients are excluded anyway (80.Cinco.2ª).

### 7c. Services bought from EU and non-EU suppliers (e.g. SaaS from Ireland, AI APIs from the US)
```
if supplier established in another EU MS and you gave your ES VAT (ROI) number:
    supplier invoices without VAT ("reverse charge")
    you self-assess: 303 box 17 = base, box 18 = base * 21 %; deduct same in box 26 (if fully deductible) -> net 0
    349 key I with supplier's VAT number
    LROE: clave IVA 09 (adquisiciones intracomunitarias)
elif supplier established outside the EU (B2B service, located in Spain by 69.Uno.1º):
    ISP under 84.Uno.2º.a: box 19 = base, box 20 = cuota; deduct in box 24; no 349
    the foreign invoice/receipt acts as the justifying document (DF4/13 2.4; NFIVA 97.Uno.4º)
devengo: when performed; subscriptions = when each instalment is due (75.Uno.7º); if continuous for > 1 year without payment, 31 Dec (75.Uno.2º)
currency: convert at the rate under art. 79.Once (DF4/13 12.1)
```
Edge case: if you did not give your VAT number and the EU supplier charged its own VAT, there is no self-assessment and the foreign VAT is not deductible in the 303 (use the EU refund portal).

---

## Unverified / open

2. **390 box 110 arithmetic**: reconstructed from box descriptions; check B390 (downloaded but not fully read) before coding.
3. **Home-office suministros IVA**: STS 3487/2025 and the TEAC criterion are known only from secondary sources. No Bizkaia FAQ or TEAF Bizkaia position found.
4. **B2C electronic services to non-EU consumers**: gap in NFIVA/LIVA 69.Dos vs Directive art. 58. DGT/Bizkaia practice not verified.
5. **"Entidades privadas autorizadas" for training exemption (20.Uno.9º)**: not researched (DGT doctrine on private trainers).
6. **Exempt-only autónomos and filing**: whether RIVA 71.4's exoneration applies in Bizkaia, and how BATUZ treats it.
7. **RDM under BATUZ**: OF124/09 references the old DF 205/2008 information-supply duty; current extra obligations for RDM members under BATUZ not checked.
8. **Bad-debt communication channel/deadline** in Bizkaia (RIVA 24 is state; foral DF obligaciones formales not checked).
9. **SME franchise**: status checked up to March 2026 (not transposed). Developments between April and November 2026 (DAC8-law amendment route mentioned in press) not confirmed. Even if transposed, Spain has opted out of the *domestic* franchise, so the app's impact is only the cross-border opt-in (forms 041/350; foral equivalents unknown).
10. **Surcharges, interest and penalties** (NF 2/2005) for late 303/390: not covered here.
11. **5 % rate boxes (110/111)**: which goods are still at 5 % in 2026 not checked; treat as data-driven per period.
12. **Mid-year change of tax domicile** (CE 43 rules, anti-abuse) not modelled.
13. Investment goods: verified in NFIVA. Goods under €3,005.06 are not investment goods (108.Dos.5). Regularise over the 4 calendar years after acquisition (9 for real estate) when the final deduction % differs by more than 10 points (107.Uno). The app does not model this yet.
