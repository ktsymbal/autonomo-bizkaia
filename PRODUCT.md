# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Astro (static output) + one Preact island for the calculator; pure TypeScript engine in `src/engine`, parameters as versioned JSON in `src/params`. Chosen by the agent and stated to the owner, who said "let's build".

## Users
Ukrainian digital nomads and freelancers who live in Bilbao / Bizkaia (or plan to move there) and work, or will work, as autónomo/autónoma. Most invoice foreign clients (EU / non-EU companies) in EUR or USD. Some also have a Spanish job alongside (pluriactividad). Their job: understand how much of what they earn is really theirs, how much to set aside, and what is due when. They have a gestoría, or are about to choose one, and they don't speak tax Spanish fluently.

## Product Purpose
A free calculator that does for Bizkaia what avtonomo.com does for common-regime Spain, which explicitly excludes the Basque Country. It shows the monthly take-home, the % to set aside from every payment, a year calendar of payments (RETA, modelo 130, 303/390, Renta), the modelo 130 box by box, comparisons (with and without the tarifa plana, the equivalent salary as an employee) and what changes next year. Success means a user trusts the numbers enough to plan with them and checks them with their gestor.

## Positioning
It is the only calculator built on Bizkaia foral rules (NF 13/2013): the 20/15/10% simplificada reduction, the start-up reduction, the €1,615 minoración, the non-cumulative 130 that switches in year 3, no Q4 303, and the rent deduction for under-36s. Every number links to its official source and the date it was checked, and open legal points are visible settings rather than hidden guesses.

## Operating Context
Used on a phone or laptop, usually right after an invoice is paid, before a quarterly deadline (25 Apr / Jul / Oct, 31 Jan), or while deciding whether to move or register. Users compare the result with their gestoría's numbers and payment receipts. The calculation runs in the browser, and the state lives in the URL fragment so a link can be shared with a partner or a gestor.

## Capabilities and Constraints
- Interface languages: **Ukrainian and English only**. Spanish terms sit next to concepts (modelo 130, tarifa plana, RETA).
- No accounts, no cookies, no backend, and no bookkeeping, invoicing or filing (filing requires TicketBAI software and carries liability).
- Not advice: it shows numbers and rules only.
- Scope v1 is in the spec: `docs/superpowers/specs/2026-11-18-bizkaia-calculator-design.md`.
- Open legal points are exposed as settings: R2, S1, S2, S3.
- Must not copy avtonomo.com's text, name or branding. It copies function only.

## Brand Commitments
- Name **Autónomo Bizkaia**, with the subtitle "калькулятор податків" / "tax calculator". The owner confirmed it: descriptive, "just a simple utility", not a brand-building exercise.
- Never use Russian or Russian-shared words in names or copy.
- Must not look like an official / government service (no Foru, Hacienda or coat-of-arms cues).

## Evidence on Hand
- Research with official citations: `docs/research/01`–`07`.
- Golden test cases: spec §8.
- No testimonials, users, press or partner logos exist. Do not invent any.

## Product Principles
1. Facts with sources, not advice: every number can show the rule behind it.
2. Bizkaia-first: never fall back to common-Spain defaults.
3. Honest uncertainty: forecast months, provisional 2027 values and open legal readings are shown, not hidden.
4. Plain language in the user's language, with the Spanish term they will see on official forms.
5. Private by construction: the numbers never leave the browser.

## Accessibility & Inclusion
Mobile-first. Cyrillic and Latin must both render well. Numbers must be readable for people comparing them against payment receipts (tabular figures, € formatting per locale). Target WCAG 2.2 AA.
