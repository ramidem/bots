---
name: site-audit-report
description: Finalize a lead audit report — area score table, top findings to offer IDs, companion audit.json, Shared Sales summary, and one handoff message. Use after section probes and the 14 checks, or alone to close a draft that is already filled.
example-prompt: Finalize audit report for lead acme-co.
---

# Audit report close-out

Turn a filled (or mostly filled) `audits/<lead>/audit.md` into a consistent twin `audit.json`, Shared summary, and handoff. Stop at findings. Sales ranks offers.

## Inputs

- Lead slug. `audits/<lead>/audit.md` must exist (run `site-audit` setup or a section skill first if not).
- Prefer that the 14 rows and area probes are already written.

## Never

Pitch, prices, offer ranking, or overall site score out of 100. Invent metrics. Contact lead; submit forms; edit sheets unless asked; audit `<app-repo>`. Soft-pass unknown → not P0.

## Steps

1. **Area scores.** Ensure all six rows (seo, content, speed, accessibility, conversion, schema) have 0–10 or null/omit plus one evidence-backed reason each. Use the template **Score anchors** bands.
2. **Priorities.** Fail → required p0/p1/p2. Pass/na → none. Unknown → not p0.
3. **Top findings → offer IDs.** Cap **3–5** items. `O##` only when the tracker maps them; leave blank if unclear. Stop here for Sales.
4. **Summary paragraph.** Facts only for Sales / Grook.
5. **Measurements.** Keep Method (`lab` / `field` / `spot`) in `audit.md`. Do not invent a JSON Method field until `audit-schema.ts` adds it.
   - **Speed with repeated runs:** report the full range across runs plus how many runs missed the bar (e.g. "3.7 s to 46 s across 11 runs; all 11 missed 2.5 s"), never one run's figure. A single lab number hides the spread.
   - **Lead the speed finding with the largest checkable asset** (e.g. the biggest image, with its byte size and URL), so the lead can verify it themselves. State the lab condition (e.g. simulated slow mobile) next to any lab time.
   - Re-measure the asset size on the live site before the report is final; say who measured each number.
6. **Evidence pack.** Prefer relative paths under `audits/<lead>/` (`lighthouse-*.json`, `shots/`, `html/`) when files exist.
7. **Write `audit.json`.** Same folder. Match `audit-schema.ts`: required `audited_url`, `area_scores`, `crawl_scope`, `summary`, `findings[].area` and `findings[].result`; measurements only with real `tool`/`metric`/`value`/`run_at`. Priorities lowercase (`p0`…). `report_path` = `audits/<lead>/audit.md`.
8. **Sales summary.** Short fact-only file at `<shared>/Data/audits/<lead>.md` (lead, URL, date, P0/P1/P2 counts, top fails, path to full report).
9. **Hand off once.** Message Grook (or the asker): lead, URL, status, counts, summary line, paths. Stop.

## Verify

- [ ] `audit.md` + `audit.json` consistent; every fail has priority + evidence
- [ ] Top findings capped at 3–5; score anchors used
- [ ] All 14 checklist findings present when a full audit was requested
- [ ] Shared summary exists; no pitch/prices; status set (`draft` or `final` as asked)
- [ ] Any speed finding shows the run range and miss count, and leads with a checkable asset
