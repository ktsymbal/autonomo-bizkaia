# 05 — Foreign currency, payment platforms (Deel / Wise / Payoneer) and TicketBAI

Scope: a Bizkaia-resident autónomo invoicing foreign B2B clients in USD (or other non-EUR) and getting paid through Deel, Wise or Payoneer. Researched 2026-11-18. Foral sources are used first. A state DGT ruling is cited only where the foral rule sends us to the same accounting rules.

## Summary

- **Invoices can be in USD, but TicketBAI cannot.** The invoice given to the client may be in any currency (DF 4/2013 art. 12.1). The TicketBAI XML sent to Hacienda Foral must carry **euro** amounts (Batuz FAQ). Any IVA charged must be shown in EUR.
- **IVA rate rule:** convert at the "tipo de cambio vendedor, fijado por el Banco de España, que esté vigente en el momento del devengo" (NF 7/1994 IVA art. 79.Once). For services to a non-EU business the operation is *no sujeta*, but the EUR base still goes into TicketBAI, the LROE and the 303.
- **IRPF base:** under the devengo criterion, income = USD amount × spot rate on the transaction date. The accounting rule (PGC NRV 11ª) also allows a monthly average rate. The difference when the money is actually collected or converted is an **exchange gain or loss inside activity income**, not a separate capital gain (DGT V0933-17, via NF 13/2013 arts. 25/28 → NF IS). In Bizkaia, currency differences are taxed **only when collected or paid**, never on unrealised year-end balances (NF 13/2013 art. 57.2.e; Bizkaia FAQ 900001522).
- **Platform fees** (Wise, Payoneer, Deel withdrawal and FX fees) are deductible activity expenses if they relate to business receipts. Payment-transfer and currency-exchange services are **IVA-exempt** (NF 7/1994 art. 20.Uno.18º h and j), so there is no reverse charge. In the LROE they go to account 626 (servicios bancarios) or 66 (gastos financieros), usually as *gastos sin factura*. A hidden FX spread is not a separate fee: it shows up as a lower EUR amount received, i.e. an exchange loss.
- **Deel invoice vs TicketBAI:** the legally valid invoice is the one issued through TicketBAI software. A Deel-generated invoice is a platform document. Mirror it (same amount, currency, period and date) or replace it with the TicketBAI PDF. If Deel were treated as issuing in your name (DF 4/2013 art. 5, third-party invoicing), the invoice would still have to go through TicketBAI under your NIF, with flag "T" and its own series. Deel does not do that.

---

## 1. Exchange rate for IVA and TicketBAI

**Plain explanation.** The invoice PDF may show USD. Hacienda only sees euros. The rate fixed by law for IVA is the Banco de España rate in force at *devengo* (when the tax accrues). For an ongoing monthly service, devengo is normally when the payment falls due. For a one-off service, it is when the service is performed. Banco de España publishes the ECB euro reference rates daily, and in practice that is the rate used (see Open items).

```
# per invoice line in currency C != EUR
rate      = bde_ecb_reference_rate(C, date = devengo_date)   # last published rate if no fixing that day
base_eur  = round(amount_C / rate, 2)                         # rate quoted as C per 1 EUR
iva_eur   = base_eur * iva_rate                               # 0 for no-sujeta (art. 69.Uno.1º / localisation rules)
ticketbai.importes = base_eur, iva_eur, total_eur             # XML always EUR
invoice_pdf may show amount_C, but must state iva in EUR if any
store: currency, amount_C, rate, rate_date, base_eur           # audit trail
```

| Parameter | Value | Source |
|---|---|---|
| Invoice currency | Any; any IVA charged must be shown in EUR at the art. 79.Once rate | DF 4/2013 (Reglamento de facturación Bizkaia) art. 12.1 |
| IVA conversion rate | "tipo de cambio vendedor, fijado por el Banco de España, que esté vigente en el momento del devengo" | NF 7/1994 IVA (Bizkaia, consolidated 01/01/2026) art. 79.Once |
| TicketBAI XML | Base, cuota and total must be in EUR; no foreign currency allowed | Batuz FAQ, https://www.batuz.eus/es/preguntas-frecuentes ("¿Puede registrarse la base imponible… en divisas?", revised 02/12/2024) |
| Invoice language | Any; Hacienda may ask for a translation | DF 4/2013 art. 12.2 |

**Edge cases**
- If the client's contract is in EUR (e.g. a contract with a fixed monthly EUR fee), there is no conversion at all. Only the payout leg (Deel → bank) can involve FX.
- Weekend or holiday devengo: no fixing that day. Use the last published rate. This is the common practice; no foral text says so.
- A corrective invoice (rectificativa) should use the original invoice's rate, so that it cancels exactly.

## 2. IRPF: income in EUR and exchange gains or losses

**Plain explanation.** Activity income follows the Corporate Tax / accounting rules (NF 13/2013 art. 25 and art. 28.1.a for simplificada; imputation art. 57.1.b → NF 11/2013 IS). Accounting rule NRV 11ª converts at the spot rate on the transaction date, optionally a monthly average. When the money arrives, the difference between the EUR received and the EUR recorded is an exchange difference. It is an income or expense **of the activity** (DGT V0933-17, a state ruling on the identical LIRPF art. 28 / LIS art. 10 chain). Bizkaia adds a timing rule: differences on currency balances are imputed **when collected or paid** (art. 57.2.e). Bizkaia's FAQ refuses year-end revaluation of an unpaid USD balance.

```
# devengo criterion (default)
income_eur(invoice)  = amount_C / rate(invoice_date or monthly_avg)     # PGC NRV 11ª 1.1
on_collection:
    fx_diff = eur_actually_credited - income_eur(invoice)                # include FX spread effect
    if fx_diff > 0: LROE ingresos sin factura (ingreso financiero)
    if fx_diff < 0: LROE gasto, cuenta 66 (gastos financieros)
    imputation_year = year of collection                                  # NF 13/2013 art. 57.2.e
no year-end revaluation of open receivables / USD balances                # FAQ 900001522

# cobros-y-pagos criterion (only simplificada; option in art. 57.2.c, kept ≥3 years)
income_eur = eur value at collection date  -> no separate fx_diff for that invoice
```

Both criteria feed the same EUR figures into the quarterly modelo 130 (cumulative ingresos − gastos) and the annual return.

| Parameter | Value | Source |
|---|---|---|
| Activity income computed under IS rules | Ingresos/gastos quantified "de conformidad con lo dispuesto en la Norma Foral del Impuesto sobre Sociedades" | NF 13/2013 art. 28.1.a (simplificada), art. 27 (normal), art. 57.1.b (imputation) |
| Currency differences timing | "se imputarán en el momento del cobro o del pago respectivo" | NF 13/2013 art. 57.2.e; Bizkaia FAQ 900001522 (https://www.bizkaia.eus/ogasuna/faq/faq_detalle.asp?idregistro=900001522) |
| Initial rate | Spot rate on the transaction date; monthly average allowed unless volatile | PGC (RD 1514/2007) NRV 11ª §1.1, quoted in DGT V0933-17 (12-04-2017), https://www.fiscal-impuestos.com/sites/fiscal-impuestos.com/files/NFC064886.pdf |
| Classification | Exchange differences on activity invoices = income/expense of the activity | DGT V0933-17 (state; same legal chain as foral) |
| Cobros y pagos option | Simplificada only; declared in the LROE; same criterion for all income and expenses; minimum 3 years | NF 13/2013 art. 57.2.c |
| LROE codes | 626 Servicios bancarios y similares; 66 Gastos financieros; "ingresos sin factura… ingresos financieros" | Batuz LROE rules, https://www.batuz.eus/fitxategiak/batuz/lroe/reglas%20_borrador_303_cas_v1.0.4.pdf (concept list); Batuz FAQ (LROE chapters) |

**Edge cases**
- **Money parked in USD** (Wise/Payoneer balance) and converted months later. Under art. 57.2.e the difference is taxed at conversion. Whether that difference is still *activity* income or a private **ganancia patrimonial** (savings base) depends on whether the balance is a business asset. The DGT treats currency gains as ganancias patrimoniales when they are outside an economic activity (V2466-08, cited in V1615-25). Open item; see below.
- **Simplificada percentage:** exchange differences fall inside "ingresos − gastos", so they are also reduced by the 20/15/10% automatic reduction (art. 28.1.b). They are not added afterwards like ganancias of elementos afectos (art. 28.1.c).
- An exchange gain does not count as invoiced turnover. Do not put it into TicketBAI; it belongs in the LROE "ingresos sin factura".

## 3. Platform fees: Wise, Payoneer, Deel

**Plain explanation.** Fees charged to receive, transfer, withdraw or convert business payments are necessary expenses of the activity, hence deductible. These are payment and currency-exchange services, which are IVA-exempt. So there is no IVA to deduct and no reverse-charge self-assessment. Usually there is no proper invoice, only a statement or receipt, so they go in the LROE as *gastos sin factura* backed by that statement. An FX markup built into the rate is not shown as a fee. It is already captured as a smaller EUR amount, i.e. part of the exchange difference in §2. Do not deduct it twice.

```
for fee in platform_statement:
    if fee.relates_to_business_receipt:
        expense_eur = fee.amount_C / rate(fee.date)        # same conversion logic
        lroe.gasto(cuenta = 626 if bank/transfer fee else 66, sin_factura = True,
                   iva = 0, isp = False)                     # exempt NF 7/1994 art. 20.Uno.18º h/j
    else: personal -> not deductible
    if fee.is_non_financial_service (e.g. paid subscription/software) and provider not established in TAI:
        isp = True   # reverse charge, NF 7/1994 art. 84.Uno.2º.a -> 303 self-assessed + deducted (neutral)
implicit_fx_spread -> no separate line; flows through fx_diff
```

| Parameter | Value | Source |
|---|---|---|
| IVA exemption: transfers / payment orders | "operaciones relativas a transferencias, giros… tarjetas de pago o de crédito y otras órdenes de pago" | NF 7/1994 art. 20.Uno.18º.h |
| IVA exemption: currency exchange | "compra, venta o cambio y servicios análogos que tengan por objeto divisas" | NF 7/1994 art. 20.Uno.18º.j |
| Reverse charge (non-exempt services from non-established provider) | Recipient business is the sujeto pasivo | NF 7/1994 art. 84.Uno.2º.a |
| LROE booking | Gastos con o sin factura; 626 / 66 | Batuz FAQ; LROE concept list (above) |

**Edge cases**
- On Deel, the platform fee is normally paid by the **client**. A contractor usually pays only withdrawal and FX costs. Third-party sources put these at roughly $5–25 per SWIFT withdrawal plus a 0.6–2% FX markup, and disagree with each other (vaultleap.com, grey.co). They are not authoritative; read the actual Deel or Wise statement.
- Wise/Payoneer account plans or card fees for a mixed personal and business account are deductible only for the business share. A dedicated account makes this clean.

## 4. Deel-generated invoice vs the TicketBAI invoice

**Plain explanation.** Since 2026 every Bizkaia autónomo issues invoices through TicketBAI-certified software (covered in other notes). Deel auto-generates an invoice per pay cycle from the contract (fixed-rate contracts are invoiced automatically; deel.com/contractor). That document has no TBAI ID or QR code and is never reported to Hacienda Foral, so for Bizkaia it is **not** your invoice. The DF 4/2013 art. 5 route lets a third party or the client draw up the invoice. Even then the issuer remains you: the invoice must go through TicketBAI under your NIF, with field "Factura emitida por tercero o destinatario" = T/D, and in a dedicated series per third party (Batuz FAQ). Deel does not report to TicketBAI, so that route doesn't apply.

```
for each Deel pay cycle:
    tbai = issue_ticketbai_invoice(
        client      = end client (e.g. the foreign company named in the contract),   # not Deel: Deel is payment agent
        period      = deel_cycle.period,
        amount/curr = deel_cycle.amount, deel_cycle.currency,
        date        = deel_cycle.invoice_date)            # keep dates aligned
    if deel allows custom invoice upload: upload tbai.pdf
    else: keep deel_invoice as a supporting document; reconcile deel_invoice.id <-> tbai.number
    assert tbai.amount == deel_invoice.amount and same currency
    reconcile payout: deel_invoice.amount -> withdrawal fee + fx -> eur_credited  (§2, §3)
```

| Parameter | Value | Source |
|---|---|---|
| Third-party/recipient-made invoices | Allowed, but the supplier stays the issuer; TicketBAI header has the supplier's data; flag T/D; specific series per third party; prior written agreement + acceptance procedure for recipient-issued invoices | DF 4/2013 art. 5; Batuz FAQ ("¿Qué valores tiene el campo 'Factura emitida por terceros o destinatario'…?") |
| Identifying a foreign client in TicketBAI | Country code + IDType 02–06 (e.g. 04 official ID / 06 other document) | Batuz FAQ (destinatario extranjero) |
| Foreign client → breakdown by type of operation (servicio) | Mandatory for complete invoices | Batuz FAQ |

**Edge cases**
- **Who is the recipient?** It is the end client named in the contract, not Deel. Deel is the payment agent (the contract names the end client). Putting Deel on the invoice changes the place-of-supply evidence (Deel Inc. is US) and the client identity.
- **Prorated first cycle or adjustments:** issue the TicketBAI invoice for exactly the amount Deel shows. If Deel later adjusts, issue a rectificativa rather than editing anything.
- **Invoice date vs payment date:** Deel pays on the last day of the cycle. Issue the TicketBAI invoice the same day so devengo, invoice date and rate date coincide. This minimises FX differences when the invoice is in USD.

## Unverified / open

1. **"Tipo vendedor del Banco de España"** in NF 7/1994 art. 79.Once is legacy wording. Banco de España now publishes the ECB euro reference rates. I didn't fetch a bde.es page or a foral FAQ confirming that the ECB rate is what Hacienda Foral accepts. Common practice, unconfirmed.
2. **USD balances held on Wise/Payoneer:** I found no foral ruling on whether a gain on later conversion is activity income or a private ganancia patrimonial. It depends on whether the balance is a business asset (art. 26 NF 13/2013). Possible consulta.
3. **Year-end revaluation conflict:** DGT V0933-17 (state, accounting-based) puts unrealised year-end differences into the year's income. Bizkaia's art. 57.2.e and FAQ 900001522 defer them to cobro/pago. Bizkaia's rule governs; the app should follow it. Unverified: how this interacts with normal-mode taxpayers keeping full accounting.
4. **Devengo date for monthly fixed services** (art. 75 NF 7/1994, tracto sucesivo = when payment is due) was taken from general IVA rules and not re-read in the foral text for this note.
5. **Deel custom-invoice upload** for contractors is reported by third parties only (a contractor handbook, and Remote's equivalent feature). Not confirmed in Deel's help centre.
6. Platform fee levels are from non-official comparison sites, illustrative only.
7. LROE concept for an exchange **gain** (ingresos sin factura, "ingresos financieros"): the exact sub-code was not confirmed.
