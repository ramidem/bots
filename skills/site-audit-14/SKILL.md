---
name: site-audit-14
description: Fill the Offers Tracker 14-check findings table for a lead audit (pass/fail/na/unknown, priority, evidence, suggested O##). Use alone for a checklist-only pass, or as the step after technical probes in a full site-audit.
example-prompt: Run the 14 Offers Tracker checks for lead acme-co at https://example.com/.
---

# Offers Tracker 14 checks

Write the 14 checklist rows into `audits/<lead>/audit.md`. Do not submit forms.

## Inputs

- Lead slug + `https://` URL
- Existing `audits/<lead>/audit.md` preferred. If missing, copy `site-audit/TEMPLATE.md`, fill metadata, then continue.

## Never

- Invent metrics; contact the lead; submit forms; edit sheets unless asked; audit `<app-repo>`.
- Soft-pass: unknown without confirmed fail → P2 max, never P0. Pass/na → no priority.

## Steps

1. Open the site (browser). Sample home + money/contact pages already in crawl scope.
2. For each check 1–14, set Result `pass` | `fail` | `na` | `unknown` using the how-to table in `site-audit/TEMPLATE.md` (sheet wins if Offers Tracker differs — note the read date).
3. On fail: set Priority P0/P1/P2, Observation, Evidence (https and/or file under the audit folder), and `suggested_offer_ids` as `O##` only when the tracker maps that check. Leave offers blank if unclear.
4. Update the counts line: P0 / P1 / P2.
5. Merge the 14 findings into `audit.json` if it exists (create a stub with `audited_url` + `findings` if not). Every finding needs `area` and `check_number` 1–14, no duplicates.

## Check → default area

| # | Area |
|---|---|
| 1–8, 12–13 | conversion |
| 9–11 | content (9 may be seo if NAP/index) |
| 14 | speed |

## Verify

- [ ] All 14 rows filled; fails have priority + evidence
- [ ] No form submits; no invented offer codes
