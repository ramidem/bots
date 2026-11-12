---
name: site-audit-a11y
description: Run accessibility probes (template section E) for a lead audit; set the Accessibility area score and material extra findings. Use alone for an a11y-only pass or inside a full site-audit. Deeper WCAG walkthroughs can also use the separate Accessibility Audit skill.
example-prompt: Accessibility probe for lead acme-co https://example.com/.
---

# Accessibility probes (E)

Fill Auditor appendix — Technical probe bank section **E. Accessibility** from `site-audit/TEMPLATE.md` (WCAG 2.2 AA signals).

## Inputs

Lead slug + URL. If `audits/<lead>/audit.md` is missing, copy the template and fill metadata first.

## Never

Invent metrics; contact lead; submit forms; audit `<app-repo>`. Soft-pass unknown → P2 max. This is not a legal conformance statement.

## Steps

1. Check alt text, form labels, contrast on primary text/CTAs, keyboard focus visibility, and Lighthouse a11y score when run.
2. Record any real tool score in Measurements (with `tool` + `run_at`).
3. Set **Accessibility** area score 0–10 (or null) with one evidence-backed reason.
4. Material extras → `area: accessibility`. Patch `audit.json`.
5. For a deep keyboard/WCAG pass, also follow the installed Accessibility Audit skill, then fold blockers into Extra findings here.

## Verify

- [ ] Accessibility score or null; extras evidenced; no invented scores
