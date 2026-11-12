---
name: site-audit-seo
description: Run crawl/index, on-page SEO, and light security probes (template sections A, B, H) for a lead audit; set the SEO area score and material extra findings. Use alone for an SEO-only pass or inside a full site-audit.
example-prompt: SEO probe only for lead acme-co https://example.com/.
---

# SEO probes (A + B + H)

Fill Auditor appendix — Technical probe bank sections **A. Crawl & index**, **B. On-page SEO**, and **H. Security light** from `site-audit/TEMPLATE.md`.

## Inputs

Lead slug + URL. If `audits/<lead>/audit.md` is missing, copy the template and fill metadata first.

## Never

Invent metrics; contact lead; submit forms; audit `<app-repo>`. Extra findings only when material. Soft-pass unknown → P2 max.

## Steps

1. Work top to bottom through A, then B, then H on the crawl sample.
2. Tick or note each probe item in the audit.md bank (or a short working checklist).
3. Set **SEO** area score 0–10 (or null) with one evidence-backed reason line.
4. Add **Extra findings** rows only for material fails (`area: seo`; leave `check_number` empty in JSON). Security gaps are P2 unless exploitable evidence exists.
5. Patch `audit.json` `area_scores.seo` and any extra `findings[]`.

## Verify

- [ ] A/B/H considered; SEO score or explicit null + reason
- [ ] Extra findings have evidence; no invented GSC data
