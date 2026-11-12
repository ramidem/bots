---
name: site-audit
description: Orchestrate a full lead website audit by running the modular section skills (14-checks, seo, content, speed, a11y, cro, schema, report) into audit.md + audit.json. Use when Grook or Sales asks for a full site audit or re-audit. For one section only, invoke that section skill instead.
example-prompt: Full audit https://example.com/ for lead acme-co.
---

# Lead website audit (orchestrator)

Run the full audit by calling the section skills in order. Human report and machine twin must match. Sales owns pitch, prices and offer ranking.

## When

- Grook or Sales names a lead and URL (or next lead from the tracker).
- A re-audit (new dated folder; never overwrite).
- One-command full run: use this skill. One section only: use `site-audit-14`, `site-audit-seo`, `site-audit-content`, `site-audit-speed`, `site-audit-a11y`, `site-audit-cro`, `site-audit-schema`, or `site-audit-report`.

## Never

- Contact the lead, submit forms, RSVP, pay, or edit sheets unless the user explicitly asks.
- Audit the user's own internal app (`<app-repo>` / its live deploy).
- Invent Lighthouse, PageSpeed or other metrics. Every measurement needs `tool` + `run_at` from a run you did.
- Add pitch, prices, redesign quotes or overall site-score-out-of-100.
- Soft-pass: unknown without a confirmed fail is P2 max, never P0.

## Paths

| What | Where |
|---|---|
| Working template (canonical) | user's notes vault `site-audit/TEMPLATE.md` (+ `docs/`); workspace `site-audit/` is a symlink |
| Skill copy of the template | `references/TEMPLATE.md` (this skill; keep in sync with vault) |
| Full report + evidence pack | `audits/<lead>/audit.md`, `audit.json`, optional `lighthouse-*.json`, `shots/`, `html/` |
| Sales short summary | `<shared>/Data/audits/<lead>.md` |
| JSON shape | `<app-repo>/src/lib/domain/audit-schema.ts` |
| Shape example | `<app-repo>/audits/<example-lead>/` |

`<lead>` is a short slug (lowercase, hyphens). Re-audit: `audits/<lead>-YYYY-MM-DD/` (Manila date).

**Layout vs fill order.** Finished Sales skim puts the 14 table above the Auditor appendix. Probe checklists live in the appendix. Auditor fill order is still: sample pages → probes (appendix) → area scores → Findings 14 → extras → measurements → close.

## Module map

| Skill | Fills |
|---|---|
| (this) setup | metadata, sample pages, crawl scope, copy template |
| `site-audit-seo` | appendix A+B+H → SEO score + extra findings |
| `site-audit-content` | appendix C → Content score + extras |
| `site-audit-speed` | appendix D + measurements (Method: lab/field/spot) → Speed; feeds check 14 |
| `site-audit-a11y` | appendix E (WCAG 2.2 AA signals) → Accessibility + extras |
| `site-audit-cro` | appendix F → Conversion; feeds checks 1–8, 12 |
| `site-audit-schema` | appendix G → Schema + extras |
| `site-audit-14` | Offers Tracker 14 rows (Sales skim table) |
| `site-audit-report` | score anchors, top findings 3–5, audit.json, Shared summary, handoff |

## Steps

1. **Scope.** Confirm lead slug, `https://` URL, not the internal app. Note checklist read date from Offers Tracker when openable; else list under Not measured.
2. **Shell.** Copy `site-audit/TEMPLATE.md` to `audits/<lead>/audit.md`. Fill metadata + Sample pages. Status `draft`. Record crawl scope (home + money/contact templates, or whole site if one page).
3. **Probes (in order).** Fill Auditor appendix sections via: `site-audit-seo` → `site-audit-content` → `site-audit-speed` → `site-audit-a11y` → `site-audit-cro` → `site-audit-schema`.
   - **Confirm "missing" in a rendered page.** Before recording a missing element (contact page or section, H1, meta description, links, form) from a raw-HTML fetch or a script's output, load the page in the OpenBot browser, wait for content, and check the DOM. JavaScript apps serve an empty shell (such as `<div id="root">`) that a raw fetch reads as missing everything. If the rendered page has the element, drop the flaw and note it as a script false positive. If it is missing only from the raw HTML, record that as a separate finding: crawlers that skip JavaScript see no content.
   - **Re-run conflicting speed figures.** When a lab metric disagrees with its own score in the same run (for example, a very slow LCP next to a passing performance score), re-run PageSpeed/Lighthouse before you use the number. One lab run can be an outlier. If you cannot re-run, keep the figure out of the top findings and note the conflict.
4. **Fourteen checks.** Run `site-audit-14` using probe evidence already written (writes the Sales skim 14 table).
5. **Close.** Run `site-audit-report` to finalize scores (use score anchors), cap top findings at 3–5, write `audit.json`, Shared summary, and hand off once.

If a section skill is missing or disabled, do that section's steps yourself from `site-audit/TEMPLATE.md` (same rules), then continue.

## Verify before you say done

- [ ] All section skills completed (or equivalent steps done)
- [ ] `audit.md` + `audit.json` present; 14 checklist rows; every fail has priority + evidence
- [ ] No invented metrics; Shared summary exists; no pitch; no form submits; not internal app
- [ ] Re-audit used a new dated folder
- [ ] Every "missing element" finding was confirmed in a rendered browser page; every speed figure that conflicts with its score was re-run or left out of the top findings

## References

- `references/TEMPLATE.md` — report shell and check how-to
- `references/research-2026-11-09.md` — format verdict and area mapping
