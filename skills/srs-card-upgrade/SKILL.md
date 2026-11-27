---
name: srs-card-upgrade
description: Upgrade 10 low-quality flashcards a run in Med's bujou vault, in place, using each card's source note. Use on the card-upgrade routine or when Med says "upgrade cards".
---

# srs-card-upgrade

Vault: `$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/bujou` (VAULT). Upgrades 10 terse ml-stack cards per run, in place, so Anki keeps their schedule.

## Scope (Med's explicit decision, 26 Nov)

Only cards under headings `## [[ml-stack-*]]` in these 10 deck files, in this order: `srs/srs-nodejs.md`, `srs-typescript.md`, `srs-frontend.md`, `srs-cloud-devops.md`, `srs-system-design.md`, `srs-sql.md`, `srs-design-principles.md`, `srs-git.md`, `srs-openai-api.md`, `srs-algorithms.md` (244 cards when filed; 48 of them were later moved from system-design into sql and design-principles with new anchors). This is the one exception to `bujou-srs-sync`'s rule "never rewrite an existing card". Every other card stays untouched. Never touch `^q-` anchors or the `flashcards:` map. Never delete a card line, note or file; never touch `.obsidian/`; never send mail.

## State: `VAULT/srs/upgrade-state.json`

`{"version":1,"approved":false,"paused":false,"total":244,"upgraded":[],"skipped":[],"docs_checked":[],"priority_deck":"","last_run":""}`

A card is identified by its `^q-xxxx` anchor. If the file is missing, create it with `approved` false and `total` = the anchor count under the scoped headings. At the start of every run, recompute `total` as the number of `^q-` anchors under `## [[ml-stack-*]]` headings in the 10 files; a stored `total` can be out of date after cards move between decks. `skipped` holds cards whose note was too vague; they are not retried. `docs_checked` holds cards that went through the docs-link step (4b), with or without a link; if the key is missing, add it as `[]`. `priority_deck` is empty for file order; when Grook relays which deck Med wants first (for example `srs-sql.md`), set it, and pick new cards from that deck first, then the file order.

## First run is a preview

While `approved` is false the run writes no card. It picks the next 10 cards (step 3), writes their before/after pairs to `VAULT/work/plan/CARD-UPGRADE-PREVIEW.md`, and sends them to Grook with `openbot.send_message` (`expectsReply` false) so Grook can show Med. If the preview file already exists and `approved` is still false, end with `routine_no_update`; do not message again. Only Med's yes, relayed by Grook, sets `"approved": true`; after that, apply batch 1 as a normal run.

## Run

1. Read `VAULT/srs/wiki.md` and `VAULT/.claude/skills/bujou-srs/SKILL.md` for syntax (one blank line between cards). For a code card use an inline `question::answer` card with inline code. Use a fenced `flashcard` block only after one has been verified to sync in this vault (no example exists yet).
2. Stop and log one line in `srs/log.md` if `paused` is true, if `python3 -I VAULT/.claude/skills/bujou-srs-health/check.py --json` shows any error, or if an iCloud conflict file exists in `srs/` or `notes/`.
   Then check the push preconditions from step 5 of `bujou-srs-sync` (the `obsidian` CLI answers, Obsidian is running, AnkiConnect answers at `127.0.0.1:8765`). If one fails, end with `routine_no_update` and no message; the next hour retries. Check this before editing any card.
3. Pick up to 10 cards. First, cards in `upgraded` but not in `docs_checked` (docs-only pass, step 4b, edit nothing else), in file order. Then, to fill the 10, cards not in `upgraded` or `skipped`: the `priority_deck` first if set, else the file order listed in Scope (deck file, then position).
4. For each card, read its whole source note (the `[[ml-stack-*]]` heading names it), then rewrite the card text only. Rewrite to one of:
   - scenario ("a subscriber acks then crashes mid-work, what happens and why?");
   - code (a 3-line snippet: what prints or what is wrong);
   - compare (X vs Y, when to pick which);
   - answer + one-line why + one common trap.
   Add a one-line context to the question when it would not make sense alone in Anki. Use cloze only for a small term. Every fact must be in the source note. If the note is vague, skip the card, add it to `skipped`, and never invent. Med's voice: lowercase, short, bujou or remittance examples. One retrieval target per card, no answer leaked in the question, at most 4 lines. Keep the same question intent so Anki keeps the schedule. To merge two cards that test the same fact, edit one card's text and leave the other for a later run; never delete a card line.
4b. Docs link, for every rewritten card and every docs-only card. Open the source note and read its `- sources` bullet under `## links`. If it lists urls, pick the one that matches the card and append one last line to the card back: `docs: <url>`. Use only a url from that list; a link marked "did not open" may be used. If the note has several sources (ml-stack-javascript-node has 3), pick the one for the card's topic; if none clearly fits, add no link. If the list is missing or empty, add no link and never invent one. Do not duplicate an existing `docs:` line. Keep the 4-line limit by dropping the weakest other line, never the link. A docs-only card keeps its text unchanged; only the `docs:` line is added. Add the anchor to `docs_checked`.
5. Run the health check again; no new errors (rephrase a duplicate-question error).
6. Push to Anki with step 5 of `bujou-srs-sync` (its preconditions, one deck file at a time, `sync.log` check, then the AnkiConnect `sync` call). Success means `syncNote ok` with `failedOps` 0 and `okUpdates` equal to the changed cards of that file. 
7. Whether the push succeeded or failed, append the changed anchors to `upgraded` (and any to `skipped`), and every card handled in step 4b to `docs_checked`, set `last_run`, and add one line to `srs/log.md`: `- card upgrade: 10 ([[deck]] ...), docs-only m, total n/<total>`.
8. On failure (`failedOps` above 0, or Anki unavailable twice in a row) set `paused` true, report once to Grook, and stop. Never loop.
9. When `upgraded` plus `skipped` equals `total` and every `upgraded` card is in `docs_checked`, set `paused` true and send Grook one line: "ml-stack cards upgraded". Otherwise end with `routine_no_update`.

## Last step

Run `routine-status-report`: `type=sync count=<cards upgraded this run> next=<upgraded+skipped>/<total> status=progress`.
