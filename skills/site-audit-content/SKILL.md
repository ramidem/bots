---
name: site-audit-content
description: Run content probes (template section C) for a lead audit; set the Content area score and material extra findings. Use alone for a content-only pass or inside a full site-audit.
example-prompt: Content probe for lead acme-co https://example.com/.
---

# Content probes (C)

Fill Auditor appendix — Technical probe bank section **C. Content** from `site-audit/TEMPLATE.md`.

## Inputs

Lead slug + URL. If `audits/<lead>/audit.md` is missing, copy the template and fill metadata first.

## Never

Invent metrics; contact lead; submit forms; audit `<app-repo>`. Soft-pass unknown → P2 max.

## Steps

1. Check thin/duplicate/cannibalizing pages, buyer proof, freshness signals, contact/NAP consistency on the crawl sample.
2. Set **Content** area score 0–10 (or null) with one evidence-backed reason.
3. Extra findings only when material (`area: content`). Feeds checks 9–11 when those rows are filled later by `site-audit-14`.
4. Patch `audit.json` `area_scores.content` and extras.

## Verify

- [ ] Content score or explicit null; extras evidenced
