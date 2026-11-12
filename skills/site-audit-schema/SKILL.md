---
name: site-audit-schema
description: Run schema and social probes (template section G) for a lead audit; set the Schema area score and material extra findings. Use alone for a schema-only pass or inside a full site-audit.
example-prompt: Schema probe for lead acme-co https://example.com/.
---

# Schema & social probes (G)

Fill Auditor appendix — Technical probe bank section **G. Schema & social** from `site-audit/TEMPLATE.md`.

## Inputs

Lead slug + URL. If `audits/<lead>/audit.md` is missing, copy the template and fill metadata first.

## Never

Invent metrics or fake “AI scores”. Contact lead; submit forms; audit `<app-repo>`. Soft-pass unknown → P2 max.

## Steps

1. Check JSON-LD where expected (Organization / LocalBusiness / Service / FAQ / Product / Article / BreadcrumbList as relevant) and that markup matches visible content.
2. Check Open Graph basics on home / share targets.
3. Optional observation only: AI crawlers in robots / `llms.txt` — no fake AI score.
4. Set **Schema** area score 0–10 (or null) with one evidence-backed reason.
5. Material extras → `area: schema`. Patch `audit.json`.

## Verify

- [ ] Schema score or null; extras evidenced; no invented rich-result claims
