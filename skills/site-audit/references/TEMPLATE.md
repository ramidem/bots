# Website audit: {{LEAD_NAME}}

- **URL:** {{AUDITED_URL}}
- **Audit date:** {{YYYY-MM-DD}} (Asia/Manila)
- **Auditor:** Site Audit
- **Checklist:** Offers Tracker > Audit checklist, 14 checks, read {{CHECKLIST_READ_DATE}}
- **Lead context:** {{1–3 sentences: industry, category, size if known, hypothesis}}
- **Status:** `draft` | `final`
- **Crawl scope:** {{pages list or "N pages via method"}}
- **Template home:** notes vault `site-audit/TEMPLATE.md` (agent `site-audit/` is a symlink)

## Rules (do not delete)

- Cite only measurements from tools you actually ran (`tool` + `run_at`). Never invent Lighthouse/PageSpeed numbers.
- Every `fail` needs priority + evidence (https URL and/or path under this audit folder).
- `unknown` without a confirmed fail → priority **P2** max (never P0).
- `pass` / `na` → no priority.
- Stop at findings and `suggested_offer_ids`. No pitch, prices, or offer ranking.
- Re-audit → new dated folder; never overwrite a prior report.
- Do not contact the lead, submit forms, or edit sheets unless asked.

## How to use this file

| Who | Read / fill order |
|---|---|
| **Sales skim** (finished report) | Summary → Top findings → Area scores → Findings 14 → Measurements → Not measured → Qualification flags |
| **Auditor fill** | Metadata → Sample pages → Probes (appendix) → Area scores → Findings 14 → Extra findings → Measurements → Close sections |

Probe checklists stay in **Auditor appendix** so a finished report is not a wall of unchecked boxes. Copy this template into `audits/<lead>/audit.md`, then fill.

---

# Sales skim

## Summary (one paragraph)

{{Plain-language diagnosis for Sales / Grook. Facts only.}}

## Top findings → offer IDs

Cap **3–5** items. Stop here for Sales; they rank offers and write the pitch.

1. Check {{n}} — {{short fail}} → {{O##, O##}}
2. …
3. …

## Area scores (0–10; omit or null = not measured)

| Area | Score | Reason (one line, evidence-backed) |
|---|---|---|
| SEO | {{0–10}} | |
| Content | {{0–10}} | |
| Speed | {{0–10}} | |
| Accessibility | {{0–10}} | |
| Conversion/CRO | {{0–10}} | |
| Schema | {{0–10}} | |

No overall score.

### Score anchors (use these bands)

| Score | Meaning (any area) |
|---|---|
| **9–10** | Money paths clean for this area; only polish left |
| **7–8** | Solid; 1–2 clear non-blocking gaps |
| **5–6** | Fixable blockers or repeated gaps on sampled money pages |
| **3–4** | Area unreliable for buyers (broken path, weak proof, or poor CWV) |
| **0–2** | Critical failure (e.g. not indexable, no usable inquiry path, measured CWV collapse) |

Area-specific cues (still evidence-backed; null if not measured):

| Area | High (8–10) when… | Low (0–4) when… |
|---|---|---|
| SEO | Crawl/index clean; titles/H1/canonicals sensible on money pages | Money pages blocked, soft-404, or noindex |
| Content | Proof + freshness (or honest static brochure) on key pages | Thin/duplicate money copy; no buyer proof where expected |
| Speed | Mobile CWV in “good” band on key template (real run) | Measured LCP/INP/CLS or weight clearly poor |
| Accessibility | Alt, labels, contrast, focus OK on primary flows (WCAG 2.2 AA signals) | Forms unlabeled; primary CTA unreadable/unusable by keyboard |
| Conversion/CRO | Clear CTA + honest inquiry/booking path | Phone-only / broken / third-party-only intake with no after-hours path |
| Schema | Relevant JSON-LD matches visible content; basic OG on share targets | Missing or mismatched markup on money/home |

## Findings — Offers Tracker 14

| # | Check | Result | Priority | Observation | Evidence | Suggested offers |
|---|---|---|---|---|---|---|
| 1 | Online booking | pass/fail/na/unknown | | | | |
| 2 | Inquiry / lead form | | | | | |
| 3 | Response promise | | | | | |
| 4 | Phone-only contact | | | | | |
| 5 | Ordering path | | | | | |
| 6 | Order / job status | | | | | |
| 7 | Client portal | | | | | |
| 8 | Third-party stopgaps | | | | | |
| 9 | Multiple branches | | | | | |
| 10 | Hiring process | | | | | |
| 11 | Content freshness | | | | | |
| 12 | Past-customer follow-up | | | | | |
| 13 | B2B call path | | | | | |
| 14 | Speed and mobile | | | | | |

**Result values:** `pass` | `fail` | `na` | `unknown`  
**Priority (fails only):** `P0` blocking revenue/data loss or index block on money pages · `P1` clear conversion or CWV failure · `P2` polish / unconfirmed  
**Offers:** `O##` codes only when the checklist maps a fail; leave blank if none.

Counts: P0 {{n}}, P1 {{n}}, P2 {{n}}.

## Extra findings (outside the 14)

Use when a technical probe fails hard enough to report. Leave `check_number` empty in `audit.json`.

| Title | Area | Result | Priority | Observation | Evidence |
|---|---|---|---|---|---|
| | seo/content/speed/accessibility/conversion/schema | | | | |

## Measurements (real runs only)

| Tool | Version | URL | Strategy | Method | Metric | Value | Unit | Run at (ISO) | Report |
|---|---|---|---|---|---|---|---|---|---|
| lighthouse / psi / … | | | mobile/desktop | lab/field/spot | LCP | | s | | path or https |

**Method:** `lab` = Lighthouse/PSI lab · `field` = CrUX/field when available · `spot` = manual observation (not a CWV claim).  
Copy each row into `audit.json` → `measurements[]` (`method` is report-only until the schema adds it; still store tool/metric/value/run_at).

## Not measured / unknown

- {{tool skipped + why}}
- {{form delivery not test-submitted}}
- {{off-site social / hiring not checked}}

## Qualification flags (unverified unless proven)

| Flag | Note | Verified | Evidence |
|---|---|---|---|
| size_under_10 / … | | true/false | |

---

# Auditor fill

## Sample pages

Record what was actually opened. Prefer home + primary money/contact templates; whole site only if tiny.

| URL | Template type | In scope | Notes |
|---|---|---|---|
| https://… | home / money / contact / blog / other | yes/no | |
| | | | |

Feeds `crawl_scope` in `audit.json` (`pages[]` or `count` + `method`).

## Auditor appendix — Technical probe bank

Work **top to bottom**. Report only material fails (into Findings 14, Extra findings, and area scores). Leave unchecked items that were skipped in **Not measured**.

### A. Crawl & index (→ SEO)

- [ ] HTTPS site-wide; HTTP → HTTPS; no mixed content
- [ ] `robots.txt` live; not blocking critical HTML/CSS/JS or money paths
- [ ] XML sitemap present / linked; only canonical indexable URLs (note if GSC not available)
- [ ] No accidental `noindex` on money pages
- [ ] Canonical present and sensible on sampled pages
- [ ] No redirect chains > 2 hops / no loops on sampled URLs
- [ ] Soft-404s return real 404 status (spot check)

### B. On-page SEO (→ SEO)

- [ ] Unique title (~50–60 chars display) on sampled pages
- [ ] Meta description present and unique where needed
- [ ] Single relevant H1; logical H2/H3 hierarchy
- [ ] Descriptive URLs (lowercase, hyphens) where controllable
- [ ] Internal links use descriptive anchors; money pages ≤ 3 clicks from home
- [ ] Orphan money pages flagged

### C. Content (→ Content)

- [ ] Thin / duplicate / cannibalizing pages noted
- [ ] Proof for buyers: reviews, cases, client names, credentials (as relevant)
- [ ] Freshness signals (blog/news/dates) or explicit unknown
- [ ] Contact / NAP consistency on key pages

### D. Speed & mobile (→ Speed; feeds check 14)

- [ ] Run Lighthouse and/or PageSpeed Insights (**mobile** required)
- [ ] Record LCP, INP (or FID legacy), CLS, weight, performance score with tool version + timestamp
- [ ] Note lab vs field if both exist
- [ ] Images: oversized / next-gen / lazy-load of LCP image
- [ ] Viewport / horizontal scroll / tap targets (spot check)

**Good thresholds (cite only if measured):** LCP ≤ 2.5s · INP ≤ 200ms · CLS ≤ 0.1

### E. Accessibility (→ Accessibility; WCAG 2.2 AA signals)

- [ ] Meaningful images have alt; decorative `alt=""`
- [ ] Form inputs have associated labels
- [ ] Contrast issues on primary text/CTAs (tool or spot)
- [ ] Keyboard focus visible on interactive controls (spot)
- [ ] Lighthouse accessibility score recorded when run

### F. Conversion / CRO (→ Conversion; feeds checks 1–8, 12)

- [ ] Primary CTA above the fold on mobile
- [ ] Inquiry path clear; success/error states honest (do **not** submit without ask)
- [ ] Reply promise / hours / after-hours path
- [ ] Booking vs phone-only vs third-party forms (Typeform, Google Forms, mailto)
- [ ] Trust near CTA (proof, privacy link)

### G. Schema & social (→ Schema)

- [ ] JSON-LD present where expected (Organization / LocalBusiness / Service / FAQ / Product / Article / BreadcrumbList as relevant)
- [ ] Markup matches visible content
- [ ] Open Graph basics (`og:title`, `og:description`, `og:image`) on home / share targets
- [ ] Optional 2026 note: AI crawlers in robots / `llms.txt` — observation only, no fake “AI score”

### H. Security light (→ SEO / notes)

- [ ] TLS cert valid; not expiring within ~30 days if checked
- [ ] Basic headers observed if checked (HSTS, X-Content-Type-Options, X-Frame-Options) — note gaps as P2 unless exploitable evidence exists

---

## Companion `audit.json` (same folder)

Fill to match `<app-repo>/src/lib/domain/audit-schema.ts` (also `GET /schemas/audit-upsert` when the API is up).

```json
{
  "audited_url": "https://example.com/",
  "status": "draft",
  "area_scores": {
    "seo": null,
    "content": null,
    "speed": null,
    "accessibility": null,
    "conversion": null,
    "schema": null
  },
  "crawl_scope": { "pages": ["https://example.com/"] },
  "measurements": [],
  "summary": "",
  "not_measured": [],
  "qualification_flags": [],
  "report_path": "audits/{{lead}}/audit.md",
  "findings": [
    {
      "check_number": 1,
      "area": "conversion",
      "result": "fail",
      "priority": "p1",
      "title": "",
      "observation": "",
      "evidence_urls": [],
      "evidence_files": [],
      "suggested_offer_ids": []
    }
  ]
}
```

### Field rules (schema)

| Field | Rule |
|---|---|
| `area` | Required on every finding: `seo` \| `content` \| `speed` \| `accessibility` \| `conversion` \| `schema` |
| `result` | `fail` \| `pass` \| `na` \| `unknown` |
| `priority` | Required on `fail` (`p0`\|`p1`\|`p2`); null on pass/na; unknown → not `p0` |
| `evidence_files` | Relative to audit folder; no leading `/`; no `..` |
| `suggested_offer_ids` | `O##` only |
| `measurements` | Must include `tool`, `metric`, `value`, `run_at` |

## Save paths & evidence pack

| File / folder | Where |
|---|---|
| Working template | notes vault: `<notes-vault>/the-agency/site-audit/` (`TEMPLATE.md` + `docs/`) |
| Full report | Agent workspace: `audits/{{lead}}/audit.md` + `audit.json` (and/or <app-repo> when write key exists) |
| Sales summary | `<shared>/Data/audits/{{lead}}.md` (short) |

**Evidence pack** (same `audits/{{lead}}/` folder; relative paths only in `evidence_files`):

```
audits/{{lead}}/
  audit.md
  audit.json
  lighthouse-*.json    # optional raw runs
  shots/               # screenshots
  html/                # saved HTML snippets / notes
```

## Check how-to (short)

| # | Pass when | Fail when |
|---|---|---|
| 1 | Visitor can book a visit/slot online | Phone/SMS/email only; no booking UI |
| 2 | Inquiry form exists and success/error is honest | Missing form, broken UX, or success shown without checking result |
| 3 | Site states reply time or auto-ack | No promise while ads/traffic expected |
| 4 | Non-phone channel usable after hours or clearly covered | Phone-only with no after-hours path |
| 5 | Product order path clear (ecom) | Broken checkout — or `na` for pure services |
| 6 | Customer can see order/job/visit status | Status only by calling |
| 7 | Login/portal for ongoing clients when relevant | Needed but absent |
| 8 | Intake on first-party stack | Google Forms / mailto / consumer inbox as primary intake |
| 9 | Multi-location handled cleanly | Conflicting NAP / missing branch pages — or `na` if single site |
| 10 | Hiring path on or linked | Careers opaque — or `unknown` if off-site not checked |
| 11 | Recent content or explicit static brochure | Stale critical pages — or `unknown` if social unchecked |
| 12 | Return/PM/nurture path for recurring work | One-and-done with no follow-up hook |
| 13 | B2B proof + call/book path | Claims with no proof for business buyers |
| 14 | Mobile CWV in “good” band on key template | Measured LCP/INP/CLS or weight clearly poor |
