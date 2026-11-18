---
version: 1
slug: "src-components-calculator-tsx"
primary_target: "src/components/Calculator.tsx"
related_targets: ["src/pages/[lang]/index.astro"]
---

Scope: the calculator page (/uk/, /en/) and its methodology page. Mode: Operate.
Audience and task: Ukrainian autónomos in Bizkaia check take-home, set-aside and upcoming payments; compare with their gestoría.

## Direction contract
THESIS: a light working tool on avtonomo's proven layout (inputs left, sticky result right; result first on mobile), refusing a dark, heavy fintech dashboard.
OWN-WORLD: pale cool ground #f4f6fb with three blurred washes (blue, lilac, peach); solid white input cards; glass (backdrop-filter, inner top highlight) only where content scrolls under it: sticky header pill, result panel, mobile dock; exactly one gradient (blue→violet→rose) on the result card; Onest variable, self-hosted; tabular numerals; lucide icons.
STORY: enter income, client type, status and rent; immediately see monthly take-home, what to set aside, the next payment, the Renta result; drill into overview, by month, modelo 130 boxes, IVA, what-if.
FIRST VIEWPORT: h1 + lede, persona control, simple/detailed toggle, Income card on the left; right: gradient result card, glass panel (next payment with 130 timeline, set-aside, Renta), share button; notices flow below.
FORM: owner-approved sketch .impeccable/mocks/light-glass.html after rejecting four rolled directions; seed key 1295b003 (roll not used). Signature move: the headline settles when inputs change; the 130 timeline shows the year's payments.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
