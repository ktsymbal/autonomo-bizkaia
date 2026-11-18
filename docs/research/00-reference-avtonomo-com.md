# Reference product: avtonomo.com (checked 2026-11-18)

This is the product we are cloning for Bizkaia. Bizkaia is a separate site with its own name, brand and copy, and its interface is in **Ukrainian and English only**. We copy what the product does, not its text or branding.

## What it is
- A free calculator for autónomos in **common-regime Spain** only. "Страна Басков" and Наварра appear in the region list under "Special tax system", with the notice "not calculated yet, ask a local gestor".
- The interface is in RU, UK and EN, with PL listed as coming soon.
- It calculates in the browser. Inputs are kept in the URL after `#calc=…` (for example `v=s&m=abroad&i=m.eu.3000&x=none&r=valencia&h=alone&k0=0&k1=0&st=notYet`). There are no cookies, and analytics run on Umami.
- Its methodology page (`/ru/about/`) lists every rule with an official source, a status (confirmed / being clarified) and the date it was checked. The current check dates are 16–17 Nov 2026. If a value is unverified, the result shows a warning.
- The site also has guides (registration, tarifa plana, modelo 130, IVA/303), a Beckham Law page, an embeddable widget, feedback, privacy and legal pages, and a Telegram channel.

## Inputs
**Wizard, step 1 (persona):** `abroad` (freelancer with clients abroad), `spain` (clients in Spain), `pluri` (employee plus freelance), `plan` (only planning to move).

**Simple mode:**
- Income per month, before tax and without IVA, in EUR, USD, PLN or GBP. Non-EUR amounts are converted at the ECB rate on a stated date.
- Client type: Spanish company, Canary Islands company, Ceuta/Melilla company, private people in Spain, EU company, or non-EU company.
- Expenses: almost none / about X% / itemized.
- Region.
- Family: no partner or with a partner.
- Status: not yet / since 2023 or later (with the month and year of alta) / registered before 2023.

**Detailed mode adds:**
- Several clients, each with its own amount. An amount can be monthly, an hourly rate × hours × days, or different every month.
- Itemized expenses, each with a flag for "price includes Spanish IVA".
- A salary as an employee (pluriactividad).
- Children under 3 and children aged 3–25.
- Large family (general or special category).
- Income from a former employer: if it is over 50% of income, the newcomer discount is lost.
- Whether the person has lived in Spain in the last 5 years (leads to the Beckham check).
- Regional extras, for example Madrid's under-35 deduction.

**Reverse mode:** enter "I want to keep €X a month" and it shows the invoice amount needed.

## Outputs
- **Headline:** "In {year} you keep €X a month". Then income, how much tax, cuota and expenses take, and whether you get a refund or pay more in spring.
- **Breakdown table** (month or year view): income, expenses, cuota, IRPF, what you keep. It also states the region and the cuota regime: first-year tarifa plana, second-year tarifa plana, tarifa plana then regular, or regular by tramos.
- **Year calendar** (by month, by quarter, or full year): cuota, tax, withheld amounts, and modelo 130 due stamps. After the year it shows the 130, Renta (Apr–Jun) and the Social Security refund.
- **Next payment:** the first payment after alta, and the 130 for quarter Q with its due date.
- **Modelo 130 box by box** for the chosen quarter, citing the AEAT form instructions. It says when no 130 is needed (≥70% of income has withholding).
- **IVA / 303 per quarter:** to pay / file with zeros / carry forward / refunded, as invoice IVA minus expense IVA, plus the annual total. It counts only the general rate.
- **Set aside from every payment:** "{share}% for tax ≈ €X a month, plus €Y of IVA".
- **Comparisons:**
  - tarifa plana vs no tarifa plana;
  - autónomo vs the gross employee salary that gives the same take-home (and its cost to the employer);
  - the Beckham Law ("usually not for autónomos").
- **Next year:** what you keep once the tarifa plana ends; the tarifa plana extension when profit is below the SMI; a note on the cuota regularization.
- **Regional cuota subsidies:** programme, amount, application window and conditions. The amount is not subtracted from the result.
- **Chips and notices:** IVA reverse charge, withholding amounts, the tarifa plana amount not yet confirmed, and "some rules are still being checked".
- **Actions:** share a link, save as PDF, start over, restore the last calculation.

## Engine scope (common regime, from /about/)
- **RETA:** 15 tramos; profit −7%; the minimum base of the tramo; 31.5%; tarifa plana plus MEI, with the extension.
- **IRPF:**
  - simplified direct estimation with 5% hard-to-justify expenses, capped at €2,000;
  - art. 32 reductions;
  - state and regional scales and minimums;
  - children under 3;
  - pluriactividad (employment income, its contributions and reductions, refund of overpaid contributions);
  - Ceuta and Melilla.
- **Model 130 / withholding:** 15% / 7%.
- **IVA:** rates, 303/390 deadlines, carry-forward and refund, deductibility, exempt activities.
- **Not covered:** joint filing, regional deductions (rent and others), the economically dependent autónomo (TRADE), pension plans, SL, País Vasco and Navarra.
