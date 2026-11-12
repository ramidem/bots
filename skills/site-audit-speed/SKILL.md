---
name: site-audit-speed
description: Run speed and mobile probes (template section D), record real Lighthouse/PageSpeed measurements, and set the Speed area score for a lead audit. Use alone for a speed-only pass or inside a full site-audit; feeds check 14.
example-prompt: Speed and mobile probe for lead acme-co https://example.com/.
---

# Speed & mobile probes (D)

Fill Auditor appendix — Technical probe bank section **D. Speed & mobile** from `site-audit/TEMPLATE.md`. Required input for check 14.

## Inputs

Lead slug + URL. If `audits/<lead>/audit.md` is missing, copy the template and fill metadata first.

## Never

Invent Lighthouse/PageSpeed numbers. Every measurement needs `tool`, `metric`, `value`, `run_at` (and version when known). Contact lead / submit forms / audit `<app-repo>` forbidden.

## Steps

1. Run Lighthouse and/or PageSpeed Insights on **mobile** at least for a key template.
2. Record LCP, INP (or FID), CLS, weight, performance score in the Measurements table with **Method** `lab` / `field` / `spot`. Put the same runs in `audit.json` → `measurements[]` without a Method field until the schema adds one.
3. Note lab vs field if both exist; image/viewport/tap issues as observations. Optional evidence pack: `lighthouse-*.json`, `shots/`, `html/` under `audits/<lead>/`.
4. Cite good bands only if measured: LCP ≤ 2.5s · INP ≤ 200ms · CLS ≤ 0.1.
5. If a tool fails, list it under Not measured and try another real tool when you can.
6. Set **Speed** area score 0–10 (or null) with one evidence-backed reason.
7. Material extras → `area: speed`. Patch `audit.json`.

## Verify

- [ ] At least one real measurement row or an explicit Not measured reason
- [ ] Speed score or null; no invented numbers
