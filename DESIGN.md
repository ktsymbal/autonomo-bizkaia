---
name: Autónomo Bizkaia
description: A light, neutral working tool for Bizkaia autónomos. White input cards on a warm-grey ground, glass only where content scrolls under it, one light-peach gradient for the result.
colors:
  ground: "#f6f5f4"
  surface: "#ffffff"
  surface-sunk: "#efedeb"
  glass: "rgba(255, 255, 255, 0.36)"
  glass-line: "rgba(255, 255, 255, 0.85)"
  ink: "#1d1b1a"
  ink-muted: "#5d5753"
  line: "rgba(29, 27, 26, 0.1)"
  line-strong: "rgba(29, 27, 26, 0.18)"
  accent: "#c2502a"
  accent-ink: "#a5421f"
  accent-soft: "rgba(224, 102, 62, 0.12)"
  peach-light: "#ffeadc"
  peach: "#ffd3bc"
  peach-deep: "#ffb998"
  wash-peach: "#ffd6bf"
  hero-ink: "#3b2016"
  hero-ink-muted: "#5a3829"
  split-irpf: "#e0663e"
  split-reta: "#b9897a"
  split-expenses: "rgba(59, 32, 22, 0.22)"
  ok: "#157a4c"
  ok-soft: "rgba(21, 122, 76, 0.1)"
  warn: "#8a5a00"
  warn-soft: "rgba(214, 150, 20, 0.14)"
  bad: "#b3261e"
typography:
  display:
    fontFamily: "Fixel Text (headings and big figures: Fixel Display), by MacPaw, SIL OFL, Fixel, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "3.25rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.035em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Fixel Text (headings and big figures: Fixel Display), by MacPaw, SIL OFL, Fixel, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.6rem, 1.2rem + 1.4vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  headline-section:
    fontFamily: "Fixel Text (headings and big figures: Fixel Display), by MacPaw, SIL OFL, Fixel, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Fixel Text (headings and big figures: Fixel Display), by MacPaw, SIL OFL, Fixel, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    letterSpacing: "-0.015em"
  value:
    fontFamily: "Fixel Text (headings and big figures: Fixel Display), by MacPaw, SIL OFL, Fixel, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 650
    fontFeature: "tnum"
  body:
    fontFamily: "Fixel Text (headings and big figures: Fixel Display), by MacPaw, SIL OFL, Fixel, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  label:
    fontFamily: "Fixel Text (headings and big figures: Fixel Display), by MacPaw, SIL OFL, Fixel, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
  micro:
    fontFamily: "Fixel Text (headings and big figures: Fixel Display), by MacPaw, SIL OFL, Fixel, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
rounded:
  xs: "8px"
  sm: "10px"
  md: "12px"
  lg: "18px"
  xl: "22px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  section: "48px"
components:
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "22px 24px"
  result-card:
    backgroundColor: "{colors.peach}"
    textColor: "{colors.hero-ink}"
    rounded: "{rounded.xl}"
    padding: "24px"
  result-panel:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "14px 18px"
  control:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "46px"
  button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "11px 16px"
  segmented:
    backgroundColor: "{colors.surface-sunk}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
    padding: "3px"
  segmented-option-selected:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "7px 14px"
  chip:
    backgroundColor: "{colors.surface-sunk}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  nav-link:
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  nav-link-active:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  notices:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
---

# Design System: Autónomo Bizkaia

## Overview

**Creative North Star: "The Quiet Ledger"**

A light, neutral working tool that people open right after an invoice is paid. Everything is warm-grey and white, set in one sans (Fixel) with tabular figures, so the numbers read like a receipt. Colour is rationed: one light-peach gradient carries the answer (the monthly take-home), and a single burnt-coral accent appears only as a small signal (where you are, what is next, what is clickable, where your cursor is). The rest is ink, greys and hairlines.

Depth is quiet. Input cards are solid white with a soft neutral shadow; glass (backdrop blur with an inner top highlight) is used only where page content actually scrolls underneath: the sticky header pill, the sticky result panel and the mobile dock. There is one faint peach wash in the top-left corner of the page and nothing else decorative. The product has no logo: the name is set in type.

The layout is the familiar calculator shape: inputs on the left, a sticky result column on the right; on mobile the result comes first. The calculator opens empty and says what will appear once income is entered. It never shows invented example figures.

**Key Characteristics:**
- Light only. No dark theme exists or is planned.
- Neutral ink and greys: warm-neutral, never navy, never cream.
- One gradient (the result card, light peach), one wash, one accent.
- Coral is a signal, not a fill: buttons, chips and info icons stay neutral.
- Glass only over scrolling content; solid cards everywhere else.
- Tabular numerals everywhere; Cyrillic and Latin both set in Fixel.

## Colors

A warm-neutral greyscale with one light-peach gradient for the result and a single burnt-coral signal colour.

### Primary
- **Burnt Coral** (accent): the only accent. Active nav pill (on Coral Tint), the modelo 130 timeline rail and next-payment dot, input focus ring and border, text caret, checkbox tick, and the 1px focus outline. Never a button fill, never a large area.
- **Deep Coral Ink** (accent-ink): coral as text: links, the active nav label, text-style actions.
- **Coral Tint** (accent-soft): the pale wash behind the active nav item, the focus halo around controls, text selection.

### Secondary
- **Result Peach** (peach-light → peach → peach-deep): the stops of the single gradient, `linear-gradient(150deg, peach-light 0%, peach 55%, peach-deep 100%)`, on the result card only. It reads clearly as a gradient, not as a flat tint.
- **Peach Wash** (wash-peach): one blurred ellipse (46vw × 40vw, blur 90px, opacity 0.4) fixed off the top-left corner of the page.
- **Hero Ink / Hero Ink Muted** (hero-ink, hero-ink-muted): dark warm brown text on the peach card: the number in Hero Ink, the label, unit and notes in Hero Ink Muted. White text never sits on the gradient.
- **Split colours** (hero-ink for take-home, split-irpf, split-reta, split-expenses): the segmented bar and legend dots on the result card, read in that order.

### Neutral
- **Warm Grey Ground** (ground): the page background and `theme-color`.
- **Paper White** (surface): input cards, controls, tab panel, selected segments, notices container.
- **Sunk Grey** (surface-sunk): segmented-control and tab tracks, chips, stepper buttons, month cells, table tags.
- **Ink** (ink): all primary text. Neutral near-black with a hint of warmth.
- **Muted Ink** (ink-muted): labels, hints, units, secondary table cells, unselected options.
- **Hairline / Strong Hairline** (line, line-strong): card and table borders; control borders and table total rules.
- **Glass / Glass Line** (glass, glass-line): the frosted fill and edge of the header pill, result panel and mobile dock.

### Status
- **Ledger Green** (ok, ok-soft): refunds and good-news notices.
- **Ochre** (warn, warn-soft): warning notices.
- **Brick** (bad): amounts to pay at Renta, invalid controls, the delete-icon hover.

### Named Rules
**The No Blue Rule.** No blue, indigo or violet hue appears anywhere: not in accents, data, washes, shadows or focus states. Neutrals are warm-grey, not slate or navy.

**The Signal-Only Coral Rule.** Burnt Coral marks location, sequence and interaction (active nav, timeline, links, focus, caret) at small sizes. Buttons, chips and info icons are neutral (ink, Muted Ink, Sunk Grey).

**The One Gradient Rule.** The light-peach gradient belongs to the result card alone. No other surface gets a gradient, and the card has no coloured glow.

**The One Wash Rule.** A single faint peach wash sits behind the page. No extra blobs, orbs or decorative shapes.

## Typography

**Display Font:** Fixel Text (headings and big figures: Fixel Display), by MacPaw, SIL OFL (self-hosted via @fontsource-variable/onest, with Fixel, system-ui, -apple-system, Segoe UI, sans-serif)
**Body Font:** the same family
**Label/Mono Font:** the same family; numbers use tabular figures, not a mono face

**Character:** One humanist grotesque for everything, with weight and size doing the hierarchy. It handles Cyrillic and Latin equally well, and tabular numerals on `body` keep columns of euros aligned.

### Hierarchy
- **Display** (700, 3.25rem, 1.05, -0.035em): the monthly take-home figure on the result card only. Settles in (260ms blur-to-sharp) when the value changes.
- **Headline** (700, clamp 1.6–2.25rem, 1.15, -0.015em): the page h1.
- **Headline Section** (700, 1.75rem): the "Where these numbers come from" section heading.
- **Title** (700, 1.25rem): card headings (Income, About you, Expenses).
- **Value** (650, 1.0625rem): the result-panel figures; also the input text size.
- **Body** (400, 0.9375rem, 1.5): default text; ledes cap at 70ch, tab-panel prose and lists at 75ch.
- **Label** (500, 0.8125rem): field labels, hints, notes, chips, table headers (600), notices, footer. Sentence case, never uppercase.
- **Micro** (0.75rem): timeline dates and table tags.

### Named Rules
**The Tabular Figures Rule.** `font-variant-numeric: tabular-nums` is set on the body and inherited everywhere. People compare these numbers with payment receipts.

**The Name-in-Type Rule.** The product name is set in Fixel (Title-ish 1.0625rem bold) with a Label-size subtitle. No logo mark, monogram or glyph sits beside it.

## Layout

The shell is centred at max 1320px with 16px side gutters (40px from 900px), and both respect safe-area insets. From 1000px wide the layout is two columns, `minmax(0, 1fr) 400px`, with a 24px gap. The result column (result card + panel) sticks at `top: 88px` under the header pill. Below 1000px the result column moves above the inputs, and a glass dock slides up from the bottom once the result card scrolls away.

Inputs stack in 16px gaps; paired cards split into two columns from 640px. Inside cards, fields sit on a 16px gap with a 6px gap between label, control and hint. The details section starts 48px below the calculator and the footer 56px below that, above a hairline. The page head has 36px above it and 24px below. Below 720px the header nav and brand subtitle are hidden. Below 640px the persona switch becomes a 2×2 grid and the detail tabs a 3-column grid.

## Elevation & Depth

This is a hybrid: solid surfaces with soft neutral shadows, plus glass only where content passes underneath. All shadows use the ink hue (29, 27, 26) at low alpha. None are coloured or glowing.

### Shadow Vocabulary
- **Rest** (`0 1px 2px rgba(29,27,26,.05), 0 8px 24px rgba(29,27,26,.06)`): input cards, tab panel, header, panel, dock, the empty result card.
- **Lift** (`0 2px 4px rgba(29,27,26,.06), 0 12px 28px rgba(29,27,26,.1)`): the filled result card only.
- **Glass highlight** (`inset 0 1px 0 rgba(255,255,255,.75)` stacked on Rest): header pill, result panel, mobile dock, with `backdrop-filter: blur(20px) saturate(160–170%)`.
- **Selected segment** (`0 1px 3px rgba(29,27,26,.12)`): the white chip of a selected segment, tab or language.

### Named Rules
**The Glass-Over-Motion Rule.** Glass is reserved for elements that content scrolls under (header, sticky result panel, dock). Static cards are solid white.

## Shapes

Soft rounded rectangles throughout, with pills for navigation. Cards use 18px corners and the result card 22px. Controls, buttons, notices, box rows and the segmented track use 12px; the options inside segments and tabs use 10px; small inner pieces such as month inputs and box numbers use 8px. The header pill, nav links, language switch, year switch, chips, tags and the split bar are fully round (999px). Borders are 1px hairlines; the only heavier strokes are the 2px rule above table totals and the 3px timeline dot rings. The add-row button uses a dashed hairline.

## Components

### Buttons
Neutral and quiet; the interface has no filled accent button.
- **Shape:** gently rounded (12px).
- **Default:** Paper White fill, Strong Hairline border, ink label at 600, 11px 16px padding, lucide icon at 16px with an 8px gap (Share, Apply).
- **Icon button:** 40px square, 10px radius, hairline border, Muted Ink icon; the remove action turns Brick on hover.
- **Text action:** a borderless 600-weight label (Start over, toggles inside cards).
- **Stepper:** a joined pair of Sunk Grey 40×42 buttons around a 600-weight value.

### Chips
- **Style:** Sunk Grey pill, Muted Ink Label text, 4px 10px. Informational only (IVA / withholding facts, source status). Never coral.

### Cards / Containers
- **Corner Style:** 18px.
- **Background:** Paper White.
- **Shadow Strategy:** Rest.
- **Border:** 1px Hairline.
- **Internal Padding:** 22px 24px (tab panel 20px 22px); 16px internal gap.

### Inputs / Fields
- **Style:** 46px-min control, Paper White, 1px Strong Hairline, 12px radius, Value-size text, Muted Ink unit suffix (EUR, €, %). Selects carry a 16px chevron.
- **Hover:** border goes to Muted Ink.
- **Focus:** border goes to Burnt Coral with a 3px Coral Tint halo; caret is coral.
- **Error:** border goes to Brick (`aria-invalid`).
- **Empty:** fields start blank or with a muted `0` placeholder; there are no sample amounts.

### Segmented Controls
- **Style:** Sunk Grey track with a 3px inset and a hairline border; options in Muted Ink 500; the selected option is a Paper White chip with ink text and the selected-segment shadow. A pill variant is used for the year switch and language switch.
- **Focus:** 2px coral outline on the option.

### Navigation
- **Header:** a sticky glass pill (8px padding, 20px gap) with the name in type on the left, two nav links, and the language switch pushed right.
- **Links:** Muted Ink 500 pills (8px 14px). The active page uses a Coral Tint fill with Deep Coral Ink text. That is the only coral fill in the interface.
- **Mobile:** nav links hidden below 720px; the language switch stays.

### Result Card (signature)
The answer to the page. It uses the light-peach gradient at 22px radius and 24px padding, all text in dark warm Hero Ink with no white type, and the Lift shadow with no glow. From top: a sentence label (Body, Hero Ink Muted), the Display figure with a Value-size "per month" unit, a Label-size note, a 10px split bar (take-home / income tax / social security / expenses on a 10% hero-ink track), then a legend above a faint hero-ink hairline. **Empty state:** the same gradient with the Rest shadow, a label and one Value-size instruction sentence (max 34ch). No placeholder figures.

### Result Panel and Timeline
A glass panel of rows divided by hairlines: next payment, set-aside, and Renta outcome (Ledger Green for a refund, Brick for an amount to pay). The next-payment row holds the modelo 130 timeline: four dates on a 35%-opacity coral rail, with past dots in Strong Hairline, the next dot filled coral, and skipped quarters dashed.

### Notices
One Paper White container (12px radius, hairline border, overflow hidden) holds every notice, divided by hairlines. Each row has a 16px lucide icon and Label text. Info rows are neutral with a Muted Ink icon; warnings get a Warn Tint row with an Ochre icon; good news gets an OK Tint row with a Green icon.

### Detail Tabs and Tables
A Sunk Grey tab track (14px radius) above one solid panel. Tables use hairline row rules, Muted Ink 600 Label headers, right-aligned tabular amounts, Muted Ink for subtracted lines, and bold totals above a 2px strong rule.

## Do's and Don'ts

### Do:
- **Do** keep the site light only: `color-scheme: light`, ground `#f6f5f4`, no dark-mode tokens or media queries.
- **Do** limit Burnt Coral to small signals: active nav, timeline, links, focus ring and border, caret, checkbox.
- **Do** keep buttons, chips and info icons neutral: Paper White or Sunk Grey with ink or Muted Ink.
- **Do** give the result card the visible light-peach gradient with dark warm Hero Ink text and the neutral Lift shadow.
- **Do** put all notices in one container with hairline dividers, tinting only the warn and good rows.
- **Do** open the calculator empty, with the result card explaining what will appear once income is entered.
- **Do** set the product name in type, with a Label-size subtitle.
- **Do** use tabular numerals and Fixel for every script.
- **Do** write UI copy only in Ukrainian or English, with Spanish form terms (modelo 130, RETA, tarifa plana) alongside.

### Don't:
- **Don't** use blue, indigo or violet anywhere, including washes, data colours and focus states.
- **Don't** add a dark theme.
- **Don't** fill buttons with coral or tint chips and info icons coral.
- **Don't** use navy or slate inks, or cream or beige grounds; neutrals stay warm-grey.
- **Don't** add a second gradient, a coloured glow on the result card, or white text on the peach.
- **Don't** add decorative blobs, orbs or extra washes beyond the single peach wash.
- **Don't** add a logo, monogram or icon mark beside the name.
- **Don't** pre-fill the calculator with invented example amounts.
- **Don't** render notices as separate floating cards.
- **Don't** use Russian or words shared with Russian in names or copy.
- **Don't** use glass on static cards; it belongs only to elements that content scrolls under.
- **Don't** imitate an official or government service (no Foru, Hacienda or coat-of-arms cues).
