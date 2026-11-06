# Agent fleet records

Generic records of a small OpenBot agent fleet: what each bot does, what it must not do, how it wakes, and what changed. No personal data lives here. The person the bots serve is "the user". Details about the user and their household stay with the two bots that need them and are never committed.

Maintained by Dr Egghead, the bot designer and reviewer. One file per bot is linked in the table below.

## Rules for this repo

- Write "the user", never a name, email, address, hostname, account id, price, or spreadsheet or document id.
- No keys, tokens or passwords, and no env var names for them.
- Name tools by kind (calendar, mail, browser, repo host) and not by account.
- Times are in the user's local time zone.
- Dr Egghead is the only writer. Other bots report changes to it. A daily sync runs a leak check before it commits.

## Fleet

All bots report to Grook, the user's single front door.

| Bot | One job | Registered routines | Status |
|---|---|---|---|
| [Grook](fleet/grook.md) | Routes each ask to its owner, checks work, gives one stream | weekday brief 08:00, Sunday cleanup 10:00, weekend review 20:30 | Active |
| [Dr Egghead](fleet/dr-egghead.md) | Designs and reviews bots | daily bot review 10:45, weekly routine check Mon 09:05 | Active |
| [Schedule](fleet/schedule.md) | Calendar upkeep and planned-vs-actual coaching | actuals 09:30 and retry 12:40, check 21:15, screens-off 22:45 | Active |
| [Career](fleet/career.md) | Applications, documents, upskilling | email scan weekdays 07:00 and 17:00, metrics Sunday 16:00 | Active |
| [Sales](fleet/sales.md) | Independent business, lead to paid work | lead scan Monday 06:20, lesson Saturday 09:00 | Active, outreach on hold |
| [Parenting](fleet/parenting.md) | Household logistics and reminders | five, see its file | Active |
| [Persona](fleet/persona.md) | The user's writing voice and humanizing drafts | weekly shipped-edits check, Fri 15:00 | Active, quiet |
| [Engineering Lead](fleet/engineering-lead.md) | Engineering loop: specs, CI, reviews, follow-up | none | Active |
| [Site Audit](fleet/site-audit.md) | Website audits for leads | none | Dormant |
| [Code Auditor](fleet/code-auditor.md) | Code audits and live-deploy pass/fail checks | none | Dormant |

"Registered routines" means routines that exist in the platform. All routines are staggered at least 15 minutes apart.

## Standing rules (every bot)

1. Anything outgoing is a draft first. Never send, post, pay, apply or contact anyone without the user's yes.
2. Never change another bot's profile or routines without the user's explicit yes. Propose the wording first.
3. Anything about bots (create, merge, split, review, who owns a job) goes to Dr Egghead, through Grook.
4. One message per result. No "on it" pre-messages, no repeat confirmations, and no same update from two bots.
5. Routine start times stay at least 15 minutes apart across the fleet, and Grook is told before one is added or moved.
6. Routines stay quiet when nothing changed.
7. Resolve a short request that fits two targets (repos, files, recipients) from recent context, or ask one question before acting. Name the target in the first line of the reply.
8. Engineering work: write specs, reviews and TODOs by default. Small, cheap code changes are fine. Anything bigger, and any cloud agent run, needs the user's OK. Never merge, deploy, force-push or change secrets without an explicit yes.
9. Use a connector, API or CLI before a browser.
10. Reuse an existing bot before creating one. New bots only after the user says yes.

## Design and review method

**Designing a bot.** Ask a few preference questions. Check whether an existing bot already covers the job. Then create it with one job stated first, an explicit anti-jobs list (what it never does and who owns that instead), one voice, a clear wake (chat on demand plus named routines, staggered), who it reports to, where its source of truth lives, and draft-then-send rules for anything outgoing. Coding bots get the pstack poteto-mode bar. Read the new bot's profile back to verify it.

**Reviewing a bot.** One bot per day. Read the profile and recent chat read-only. Look for stale text, routines described but not registered, missing anti-jobs, overlap with another bot, duplicate messages, token waste, and friction in transcripts. Send about five numbered, concrete fixes. Change nothing until the user picks. Apply only what was picked, verify it, and log it.

**Merging bots.** Prefer fewer bots. Merge dormant or overlapping ones into the closest owner, keep one profile with explicit anti-jobs, and retire the other.

Review queue: Grook, Schedule, Career, Sales, Engineering Lead, Parenting, Persona and Site Audit are reviewed. Code Auditor is next.

## Leak check

`scripts/leak-check.mjs` scans the repo's text files for terms from a private list and for common secret and personal-data shapes. It prints only the path, line number and rule id of each match (never the matched text or the list), and exits 1 if anything matches (0 if clean, 2 on a usage or IO error).

```
node scripts/leak-check.mjs <blocklist-file> [dir]
```

The list is one case-insensitive regular expression per line (blank lines and `#` comments are allowed; rule ids are line numbers). It stays outside the repo, and the script refuses a list that lives inside the scanned directory. Run it from the repo root before publishing.

## Changelog

- 2026-11-06: Reminders app retired for to-dos and reminders. Parenting tracks household to-dos in its own private file and surfaces them in its digests. Its profile and four routine prompts were updated the same day with the user's yes (the monthly note never mentioned the app).
- 2026-11-06: Routines recreated in the platform for Grook, Career, Schedule and Sales (they were described in profiles but not registered); Parenting's five routines refreshed (old "paused until connectors exist" text removed). Skills trimmed: removed the ones that belong to another bot's job. Stale text fixed (retired bots named in two profiles). A target-check line added to six profiles.
- 2026-11-06: Moved these records into their own public repo with fresh history, rewritten generically. Daily sync added.
- 2026-11-06: Site Audit review applied: stays separate and dormant; stop line (findings only, no pitch, no prices, no offer picks; unknown findings default to P2; a re-audit is a new dated file); reports saved to its own workspace with a short summary shared for Sales; six unrelated skills removed.
- 2026-11-06: Persona review applied: weekly check routine recreated; outreach rules added to its profile; split with Sales stated; reporting line corrected.
- 2026-11-06: Standing write authority over the user's calendar given to Schedule, Parenting and Grook (create, update, delete; dry run first). No guest invites, no changes to other people's events, no access to dependents' accounts. This replaces the per-operation delete rule.
- 2026-11-05: Career and Schedule given read-only access to the user's mail and calendar through a local read-only tool.
- 2026-11-05: Engineering Lead may push docs, specs and mocks of its current project straight to main. App code stays on a branch the user merges. Code changes now go through T3 Code agents; Engineering Lead reviews, tests, pushes and opens the PR.
- 2026-11-05: Merged QA into Audit Engineer and renamed it Code Auditor. A second designer bot was merged into Dr Egghead and removed.
- 2026-11-05: Grook's profile gained a routing section: owner first, delegate once, one consolidated answer.
- 2026-11-05: Fleet moved onto the current platform with one profile per bot.
