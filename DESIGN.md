---
name: Autónomo Bizkaia
description: A light working tool for Bizkaia autónomos. Solid input cards on a pale washed ground, glass only where content scrolls under it, one gradient for the result.
colors:
  accent: "#c2502a"

> **Light only.** On 2026-11-18 the owner chose a light-only site: there is no dark theme. Any dark tokens described below are historical and are no longer shipped.
  accent-ink: "#a5421f"
  accent-soft: "rgba(53, 82, 232, 0.1)"
  button-fill: "#c2502a"
  on-accent: "#ffffff"
  gradient-peach-light: "#fff0e4"
  gradient-peach: "#ffd2b8"
  gradient-peach-deep: "#ff9478"
  hero-ink: "#3b2016"
  on-gradient-irpf: "#ffc9b3"
  on-gradient-reta: "#c8c2ff"
  wash-blue: "#ffd6bf"
  wash-lilac: "#f6d3df"
  wash-peach: "#ffd6bf"
  ground: "#f6f5f4"
  surface: "#ffffff"
  surface-sunk: "#f0f2f8"
  glass: "rgba(255, 255, 255, 0.36)"
  glass-line: "rgba(255, 255, 255, 0.85)"
  ink: "#141a2e"
  ink-muted: "#4d5572"
  line: "rgba(20, 26, 46, 0.1)"
  line-strong: "rgba(20, 26, 46, 0.18)"
  ok: "#157a4c"
  ok-soft: "rgba(21, 122, 76, 0.1)"
  warn: "#8a5a00"
  warn-soft: "rgba(214, 150, 20, 0.14)"
  bad: "#b3261e"
  bad-soft: "rgba(179, 38, 30, 0.09)"
  dark-ground: "#0f1220"
  dark-surface: "#181c2d"
  dark-surface-sunk: "#20253a"
  dark-glass: "rgba(24, 28, 45, 0.55)"
  dark-glass-line: "rgba(255, 255, 255, 0.08)"
  dark-ink: "#eef0f8"
  dark-ink-muted: "#a8afc8"
  dark-accent: "#8ea2ff"
  dark-accent-ink: "#b3c0ff"
  dark-button-fill: "#4b62f0"
  dark-wash-blue: "#1d3a7a"
  dark-wash-lilac: "#3b2a76"
  dark-wash-plum: "#3a2a5e"
  dark-ok: "#5fd39c"
  dark-warn: "#f2c25c"
  dark-bad: "#ff8b80"
typography:
  display:
    fontFamily: "Onest Variable, Onest, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "3.25rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.035em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Onest Variable, Onest, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.6rem, 1.2rem + 1.4vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  headline-section:
    fontFamily: "Onest Variable, Onest, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Onest Variable, Onest, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  value:
    fontFamily: "Onest Variable, Onest, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 650
    lineHeight: 1.5
    fontFeature: "tnum"
  body:
    fontFamily: "Onest Variable, Onest, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  label:
    fontFamily: "Onest Variable, Onest, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.45
    fontFeature: "tnum"
rounded:
  pill: "999px"
  hero: "22px"
  card: "18px"
  track: "14px"
  control: "12px"
  inner: "10px"
  mark: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  section: "48px"
components:
  button-primary:
    backgroundColor: "{colors.button-fill}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "11px 16px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "11px 16px"
  button-secondary-hover:
    textColor: "{colors.accent-ink}"
  button-link:
    textColor: "{colors.accent-ink}"
    padding: "6px 4px"
  input-control:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.value}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "46px"
  segmented-track:
    backgroundColor: "{colors.surface-sunk}"
    rounded: "{rounded.control}"
    padding: "3px"
  segmented-option:
    textColor: "{colors.ink-muted}"
    rounded: "9px"
    padding: "7px 14px"
  segmented-option-selected:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  chip:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  chip-neutral:
    backgroundColor: "{colors.surface-sunk}"
    textColor: "{colors.ink-muted}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "22px 24px"
  glass-panel:
    backgroundColor: "{colors.glass}"
    rounded: "{rounded.card}"
    padding: "14px 18px"
  result-hero:
    textColor: "{colors.on-accent}"
    rounded: "{rounded.hero}"
    padding: "24px"
  nav-link:
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  nav-link-current:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-ink}"
  notice:
    backgroundColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  notice-warn:
    backgroundColor: "{colors.warn-soft}"
  notice-good:
    backgroundColor: "{colors.ok-soft}"
---

# Design System: Autónomo Bizkaia

## Overview

**Creative North Star: "The Bright Workbench"**

A light working tool, not a dashboard. The page is a pale cool ground (`ground`) tinted by three large blurred colour washes (blue top-left, lilac right, peach bottom), with an extra lilac pool behind the result column. On that ground sit solid white input cards that behave like paper: opaque, softly shadowed, never translucent. Glass appears only on surfaces that stay put while content scrolls beneath them: the sticky header pill, the sticky result panel, and the mobile dock. The single gradient (light peach only — owner decision; dark warm ink #3b2016 on it, no white text) belongs to the result card, which is the one loud object on the page.

Density is moderate and form-led: labelled fields, segmented controls, and tables of figures. Every number is set in tabular figures because users compare these amounts against payment receipts. Motion is small and functional: state changes ease over 160ms, the result headline "settles" (a 260ms blur-to-sharp) whenever the inputs change, and the mobile dock slides up once the result card has scrolled away.

Light is the default. Dark is a faithful mirror of the same world (deep navy ground, dimmed washes, translucent navy glass), selected by `prefers-color-scheme` or `[data-theme='dark']`. The direction refused a dark, heavy fintech dashboard; dark mode exists for comfort, not as the identity. Per PRODUCT.md, the surface must never borrow official or government cues (no Foru, Hacienda, or coat-of-arms imagery).

**Key Characteristics:**
- Pale cool ground with three blurred colour washes behind everything.
- Solid white cards for input; glass only where content moves underneath.
- Exactly one gradient: the result card.
- Onest variable, self-hosted, tabular figures everywhere.
- Selected state is "raised": a white chip lifted out of a sunken track.
- Lucide line icons at 16px, always paired with text.

## Colors

A cool, mostly neutral palette with one confident blue accent and a warm-cool gradient reserved for the result.

### Primary
- **Working Blue** (`accent`): focus rings, links, caret, the brand mark, timeline dots, checkbox fill, the active modelo 130 box. In text roles it is replaced by **Deep Working Blue** (`accent-ink`) for contrast. **Blue Tint** (`accent-soft`) backs current nav links, chips, focus halos, and the "due" tag.
- **Button Blue** (`button-fill`): the filled primary button only. In light it equals the accent; in dark it stays saturated (`dark-button-fill`) with a white label, because the pale dark-mode accent cannot carry white text.

### Secondary
- **Result Gradient** (`gradient-violet` to `gradient-orchid` at 50% to `gradient-peach`, 140deg): the result hero card, nothing else. White text sits on it at 88-100% opacity; the legend rows sit on a frosted strip (rgba(28,24,70,0.22), 6px blur) so they stay readable over the peach end.
- **On-gradient data colours** (`on-gradient-irpf` peach, `on-gradient-reta` lilac, plus white and 45% white): the split bar and legend dots inside the hero card. They exist only on the gradient.

### Tertiary
- **Washes** (`wash-blue`, `wash-lilac`, `wash-peach`; dark: `dark-wash-blue`, `dark-wash-lilac`, `dark-wash-plum`): huge blurred ellipses (blur 90px, opacity 0.55-0.7) fixed behind the page. They tint the glass; they are never used as fills on components.

### Neutral
- **Cool Paper** (`ground`): page background, also the browser `theme-color`.
- **White Card** (`surface`): input cards, tab panels, controls, selected segments.
- **Sunken Track** (`surface-sunk`): segmented-control tracks, tab rails, stepper buttons, month cells, neutral chips.
- **Night Ink** (`ink`): primary text. **Slate Ink** (`ink-muted`): labels, hints, units, secondary figures.
- **Hairline** (`line`) and **Firm Hairline** (`line-strong`): card borders and table rules; control borders and sum-row rules.
- **Status** (`ok`, `warn`, `bad` with their `-soft` tints): refund value and good notices; warn notices; amounts to pay, invalid fields, and delete hover.

### Named Rules
**The One Gradient Rule.** The violet-orchid-peach gradient appears once, on the result card. No buttons, headers, or badges borrow it.

**The Two Blues Rule.** `accent` marks and focuses; `button-fill` fills. Never put a white label on the dark-mode accent.

## Typography

**Display Font:** Onest Variable (self-hosted via @fontsource; fallback system-ui, -apple-system, Segoe UI, sans-serif)
**Body Font:** Onest Variable, same stack
**Label/Mono Font:** none; labels use Onest at the small step.

**Character:** One geometric-humanist sans that renders Cyrillic and Latin with equal care. Hierarchy comes from size and weight (400 / 500 / 600 / 650 / 700) and tight negative tracking on large sizes, never from a second family.

### Hierarchy
The ramp runs on fixed steps: 0.8125 / 0.9375 / 1.0625 / 1.25 / 1.75 / 3.25rem.
- **Display** (700, 3.25rem, 1.05, -0.035em): the monthly take-home figure in the result card only.
- **Headline** (700, fluid 1.6-2.25rem, 1.15): the page h1.
- **Section headline** (700, 1.75rem): the "where the numbers come from" section heading.
- **Title** (700, 1.25rem): card headings; also the mobile dock figure.
- **Value** (650, 1.0625rem): figures in the result panel; input text size.
- **Body** (400, 0.9375rem, 1.5): default text, buttons, tabs, legend. Prose capped at 70-75ch.
- **Label** (500, 0.8125rem): field labels, hints, notes, notices, table headers, chips, footer. Sentence case, no tracking.

### Named Rules
**The Receipt Figures Rule.** `font-variant-numeric: tabular-nums` is set on body and inherited everywhere. Amounts are never set in proportional figures.

**The Sentence Case Rule.** No uppercase or letterspaced label styles; the only all-caps text is the two-letter language codes.

## Layout

A centered shell (max 1320px) with 16px side padding, 40px from 900px, safe-area aware. The calculator is a two-column grid from 1000px: fluid inputs left, a fixed 400px result column right, 24px gap, with the hero card and glass panel pinned (sticky, top 88px). Below 1000px the result column moves above the inputs (result first on mobile) and the glass dock appears at the bottom once the hero scrolls away.

Input cards stack at 16px gaps; paired cards sit in two columns from 640px. Inside cards, fields sit at 16px gaps and a label-to-control gap of 6px. The page head opens with 36px above and 24px below. Sections are separated by 48px (details), the footer by 56px, and the shell ends with 64px. Below 640px the persona control becomes a 2x2 grid and the tab rail wraps to a 3-over-2 grid; below 720px the header nav and brand subtitle hide.

## Elevation & Depth

A hybrid: soft ambient shadows on solid surfaces, plus real translucency on the few surfaces that float. Depth reads as paper on a lit, tinted table, with glass panes above it.

### Shadow Vocabulary
- **Rest** (`0 1px 2px rgba(20,26,46,0.05), 0 8px 24px rgba(40,50,110,0.06)`): cards, tab panel, glass surfaces. Dark: `0 1px 2px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.25)`.
- **Lift** (`0 2px 4px rgba(40,50,110,0.08), 0 18px 40px rgba(53,70,200,0.22)`): the result hero only, a blue-tinted glow under the gradient. Dark: `0 18px 40px rgba(0,0,0,0.45)`.
- **Raised chip** (`0 1px 3px rgba(20,26,46,0.12)`): the selected option in segmented controls, tabs, and the language switch.
- **Lit edge** (`inset 0 1px 0 rgba(255,255,255,0.75)`, dark 0.08): an inner top highlight stacked with Rest on every glass surface.

### Named Rules
**The Glass Where It Moves Rule.** `backdrop-filter: blur(20px) saturate(160-170%)` is reserved for surfaces content scrolls beneath: the header pill, the pinned result panel, and the mobile dock. Input cards stay solid.

**The Lit Edge Rule.** Every glass surface carries the inset top highlight and a `glass-line` border.

## Shapes

Soft, generous rounding that steps down as elements nest: hero 22px, cards and glass panel 18px, tab rail and comparison tiles 14px, controls, buttons, and notices 12px, inner items (tab buttons, icon buttons, add button, month cells) 10px, segment options 9px, small inline inputs and the brand mark 8px. Pills (999px) are for the header, nav links, language switch, chips, tags, and the year toggle. Borders are 1px hairlines; the add-client button uses a dashed firm hairline; skipped timeline dots are dashed rings. The brand mark is a plain rounded accent square, with no glyph.

## Components

### Buttons
Quiet and solid; one filled button per view.
- **Shape:** gently rounded (12px), 11px 16px, weight 600, 16px lucide icon with 8px gap.
- **Primary:** `button-fill` with a white label ("share this calculation"). Hover brightens (`filter: brightness(1.08)`).
- **Secondary:** white surface, firm hairline; hover turns the border to accent and the label to `accent-ink`.
- **Link button:** text-only `accent-ink`, weight 600, underline on hover ("start over").
- **Icon button:** 40px square, 10px radius, hairline; hover turns red (`bad`) for delete.
- **Add button:** dashed firm hairline, accent-ink label; hover fills with `accent-soft`.

### Segmented controls
The system's main choice control (persona, simple/detailed, client type, yes/no, expenses mode).
- **Track:** `surface-sunk`, hairline, 3px padding, 12px radius (pill variant for the year toggle, wide variant stretches options).
- **Option:** muted ink, weight 500, 7px 14px; hover darkens text.
- **Selected:** white surface, full ink, Raised chip shadow. Transitions 160ms ease-out. Focus shows the 2px accent outline on the option.

### Chips
- **Style:** pill, label size, `accent-soft` with `accent-ink`; neutral variant uses `surface-sunk` with muted ink. Used for derived facts ("no Spanish IVA") and source status.

### Cards / Containers
- **Corner Style:** 18px.
- **Background:** `surface`, solid.
- **Shadow Strategy:** Rest.
- **Border:** 1px `line`.
- **Internal Padding:** 22px 24px (tab panel 20px 22px), 16px internal gap; title-size h2.

### Inputs / Fields
- **Style:** 46px min height, white, 1px `line-strong`, 12px radius, value-size text, trailing unit in muted ink; selects carry a 16px chevron.
- **Hover:** border darkens to `ink-muted`.
- **Focus:** border turns accent with a 3px `accent-soft` halo (160ms).
- **Error:** border turns `bad`. Checkboxes use the native control tinted with accent at 18px.
- **Stepper:** bordered 12px group, 40x42px sunken buttons, centered weight-600 count.

### Navigation
- **Header:** sticky glass pill (999px), brand mark plus name and subtitle, nav links as pills in muted ink (weight 500), current page in `accent-soft` / `accent-ink`. Language switch is a pill track with a raised current code.
- **Tabs (details):** sunken rail (14px), equal-width buttons (weight 600, 10px radius); selected is raised white. Wraps to a grid on mobile.

### Result Hero (signature)
The gradient card with the Lift shadow: a body-size lead-in sentence, the Display figure plus a "per month" suffix, a label-size note, a 10px rounded split bar on a 22% white track, and a legend of figures. The figure settles on every change (260ms, opacity 0.55 and 3px blur to sharp, `cubic-bezier(0.16,1,0.3,1)`); split segments animate width over 220ms.

### Glass Result Panel (signature)
Stacked rows (14px 18px) divided by hairlines: label, value (650), and meta. The next-payment row holds the modelo 130 timeline: four dots on a 35% accent line, done dots grey, the next one filled, skipped ones dashed.

### Notices
12px rounded, label size, 16px lucide icon. Info is white with a hairline and accent icon; warn and good drop the border onto their soft tints.

### Mobile Dock
Fixed bottom glass bar with the headline sentence and the title-size figure; slides in (220ms) only after the hero leaves the viewport; hidden from 1000px.

## Do's and Don'ts

### Do:
- **Do** keep input surfaces solid white (`surface`) with the Rest shadow and a 1px hairline.
- **Do** reserve backdrop-filter glass, with the lit inner top edge, for surfaces content scrolls beneath.
- **Do** keep tabular figures on every amount.
- **Do** show choice as a raised white option in a sunken track (Raised chip shadow).
- **Do** use `accent-ink` for blue text and `button-fill` for filled buttons, in both themes.
- **Do** step corner radii down as surfaces nest (22 / 18 / 14 / 12 / 10px).

### Don't:
- **Don't** add a second gradient; the blue-violet-rose gradient belongs to the result card.
- **Don't** make input cards translucent or blurred.
- **Don't** turn the light working tool into a dark, heavy dashboard; dark mode mirrors the light world.
- **Don't** use Foru, Hacienda, coat-of-arms, or other official-service cues.
- **Don't** add uppercase, letterspaced labels above headings; headings and labels stay in sentence case.
- **Don't** set amounts in proportional figures.
