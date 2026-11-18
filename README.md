# Autónomo Bizkaia

A free calculator for autónomos in **Bizkaia** (Basque Country, Spain): how much you keep each month, what to set aside, and what is due when. It uses **Bizkaia foral tax rules** (Norma Foral 13/2013), not the common-Spain rules other calculators use. Interface in Ukrainian and English.

Everything runs in the browser. Inputs are kept only in the URL fragment (`#calc=…`), which is never sent to a server. There are no cookies and no accounts.

> This is an estimate, not tax advice. Check the numbers with your gestoría.

## What it calculates

- **IRPF (Bizkaia):** 23–49 % scale, the 20/15/10 % simplificada reduction, the start-up reduction, the €1,615 minoración, children and rent deductions, EPSV.
- **Modelo 130 (Bizkaia):** 20 % per quarter in the first two years, then 5 % of net income from two years earlier; box-by-box view.
- **RETA:** tarifa plana, 15 income bands, extension, regularisation.
- **IVA:** quarterly 303 and the annual 390 (Bizkaia has no Q4 303).
- **Salary + autónomo (pluriactividad):** contributions, the work allowance, the Bizkaia withholding table, the refund of excess contributions.
- **Grants:** Lanbide, Diputación de Bizkaia and SPRI programmes, shown as information only.

## Development

```sh
npm install
npm test        # engine tests, including the golden cases from the spec
npm run dev     # http://localhost:4321/autonomo-bizkaia/
npm run build
```

- `src/engine/`: pure TypeScript calculation engine, with no I/O.
- `src/params/2026.json`: every rate and threshold, with `source`, `status` (V verified · S secondary · P provisional · ? unsettled) and `checked` date. 2027 values are derived in `src/params/index.ts` and marked provisional.
- `src/components/`: Preact UI. `src/i18n/{uk,en}.json` holds all interface text.
- `docs/`: research with official citations (`docs/research`), the design spec and the implementation plan.

## Unsettled legal points

These are exposed as settings rather than hidden. The defaults are the most literal reading of the law.

- **R2:** which income Social Security takes from Bizkaia (before or after the 20/15/10 %).
- **S1:** whether the simplificada % reduces modelo 130 box 09.
- **S2:** whether the % applies to a loss.
- **First-year tier:** 20 % in the first year (common practice, no explicit text).

## Updating for a new year

Add the new year's values to `src/params/` with sources and check dates, run `npm test`, and update the golden tests where the law changed.

Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.
