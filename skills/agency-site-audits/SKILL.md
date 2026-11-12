---
name: Agency site audits
description: Runs or reviews one agency site audit for a named lead by filling
  the hand-written site-audit TEMPLATE.md with six area scores, saved per lead.
  Use when asked to audit an agency lead's website or to produce a site audit.
---

## Procedure

1. Locate the template first. Search the notes vault and the the-agency repo for `site-audit` and `TEMPLATE`. Expect `site-audit/TEMPLATE.md` in the notes vault, and after the move, `the-agency/site-audit/TEMPLATE.md`. Do not assume the path; check it before any other step.
   - Why: the template is the required audit format, and an agent that skips it produces a non-compliant audit.
2. Read the template in full (`sed -n 1,80p` or longer if needed) before scoring. Note the six area names, the 0-10 scale, and the offer-ID evidence format.
   - Why: scores must follow the template's areas, not a made-up set.
3. Choose one named lead per run. Never run the whole list in one pass.
   - Why: the team has asked for one audit at a time, and batch runs overwrite shared output.
4. Use the quick script only to decide which leads to audit. Do not use its output as the audit.
   - Why: the script's single 0-100 score conflicts with the template, which has no overall score.
5. Gather evidence with CLI and API checks before the browser (for example PageSpeed data, HTTP headers, meta tags, image sizes). Record the command or source for each finding.
   - Why: reproducible evidence is required for each score.
6. Fill the six area scores from 0 to 10, each tied to offer IDs and evidence. Write the result to `audits/<lead>/audit.md`.
   - Why: one folder per lead keeps audits separate and traceable.
7. Do not add an overall score, a total, or a percentage.
   - Why: the template explicitly forbids an overall score.
8. If a check cannot be verified, mark it INCOMPLETE and say what is missing.
   - Why: a soft pass hides gaps.

## Output and checks

- The audit file has exactly the six area scores, each 0-10, with evidence per finding.
- No overall score appears anywhere in the file, including headings and summaries.
- Every finding names its offer ID and its evidence source.
- Before reporting, confirm the file path, that it was written for one lead only, and list any INCOMPLETE items.
- Report the result in one message: verdict first (PASS, FAIL with failing area and proof, or INCOMPLETE with what could not be verified).
- Do not overwrite an existing audit from a different run without the owner's approval.
