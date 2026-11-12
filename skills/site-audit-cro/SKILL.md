---
name: site-audit-cro
description: Run conversion/CRO probes (template section F) for a lead audit; set the Conversion area score and material extras. Use alone for a CRO-only pass or inside a full site-audit; feeds Offers Tracker checks 1–8 and 12.
example-prompt: CRO probe for lead acme-co https://example.com/.
---

# Conversion / CRO probes (F)

Fill Auditor appendix — Technical probe bank section **F. Conversion / CRO** from `site-audit/TEMPLATE.md`.

## Inputs

Lead slug + URL. If `audits/<lead>/audit.md` is missing, copy the template and fill metadata first.

## Never

Submit forms unless the user asks. Invent metrics; contact lead; audit `<app-repo>`. Soft-pass unknown → P2 max.

## Steps

1. Check primary CTA above the fold on mobile, inquiry path clarity, reply promise / hours, booking vs phone-only vs third-party intake, trust near CTA.
2. Observe success/error honesty without submitting.
3. Set **Conversion/CRO** area score 0–10 (or null) with one evidence-backed reason.
4. Material extras → `area: conversion`. Note evidence that `site-audit-14` can reuse for checks 1–8 and 12.
5. Patch `audit.json`.

## Verify

- [ ] Conversion score or null; no form submits; extras evidenced
