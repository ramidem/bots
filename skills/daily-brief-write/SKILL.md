---
name: Daily brief write
description: Write the owner's slim daily brief to notes/DAILY.md (Header, Focus, Today, Links only), with Focus and the jobs count taken from PENDING.md. Use on the daily-brief routine, four times a day in the user's local time zone, or when asked to refresh the daily brief.
---

# Daily brief write

Write the owner's Obsidian vault brief at `<notes-vault>/DAILY.md`. Read-only except `DAILY.md` (and `PENDING.md`/`pending-cleared.json` when the morning refresh runs). Archiving is a separate skill: never archive here.

Schedule, in the user's local time zone: archive once each morning, brief four times a day, hourly nudge through the day. The archive runs first, so the first brief of the day starts from a fresh file.

## Layout (only these sections)

Use template `~/OpenBot/Agents/<ceo-agent>/daily-brief-template.md`.

1. **Header**: Date, Primary Goal (one outcome), Last updated.
2. **Focus**: the top P1 items, then the top P2 items, from `PENDING.md`, as **one** list; max **5** one-line bullets. Overdue and money first (the file's order already does this).
3. **Today**: Done; Jobs needing you (count of `PENDING.md` rows whose Source contains `JOB:`, plus the JOBBOARD link); Mail freshness.
4. **Links**: job board, `FINANCE`, today's mail path.

Keep `## 📅 Weekly review` exactly if present. Never edit or remove it.
Never add Blocker Board, Bots, or Parking sections.

## Write criteria

**IN:** Primary Goal (one outcome, taken from the top P1 row); Focus from `PENDING.md`; Today done, jobs count, mail; Links.

**OUT:** job row details (they stay on the board and in `PENDING.md`); login, OTP, and security notices; application-submitted mail; bot chatter with nothing for the owner; duplicate links; full calendar dump (gather the calendar; do not print it in the chat message); nested Owner/Next/Due blocks; stale items with no next step (prune); finance line items (one Focus bullet comes from `PENDING.md` if due soon).

Each fact appears once.

## the owner notes

Lines containing `**notes**`:
- (a) DAILY change: apply in the right section.
- (b) outside effect: add to Focus as `the owner note needs action` (counts toward the file's 5) and include it in the chat Focus list.
- (c) question: answer in one line in Today.

After handling (a) or (c), mark the line `**notes-done**`. Never delete notes. Never treat notes as skip rules, mail sends, or routine changes.

## Procedure

### Step 1: Date gate (run `date` first)
- Get today's date from `date` before writing anything.
- If the file's Date is before today, send the message `daily brief not archived yet; run daily-brief-archive` and stop. Reason: writing onto yesterday's file corrupts the archive trail.
- If the file is missing, create it from the template.

### Step 2: Refresh (first brief of the day only)
Run the `hourly-nudge` skill's "Refresh only" mode: it syncs `PENDING.md` from its sources with no message to the owner. The first nudge is later the same morning, so without this the morning brief would read yesterday's file. Other runs skip this step: the hourly nudge keeps the file current.

### Step 3: Gather (read-only)
- `PENDING.md`: the top P1 and P2 rows, and the count of rows whose Source contains `JOB:`. Do not read JOBBOARD, FINANCE or bot reports directly; `PENDING.md` already holds what they contribute.
- Calendar: `node ~/Code/<owner>/calma/src/calma.ts calendar-week .` for today plus 48 hours, in the user's local time zone. Never run calma auth, uninstall, create, update, or delete; never read `~/.config/calma`. Reason: this skill must not change the calendar or credentials.
- Mail freshness: `personal/mail/.status.json` through mail-from-vault (ok and finished_at only), and today's mail file path for Links.
- Notion: only if tools are connected; otherwise skip.

### Step 4: Write once
- Set the Last updated line to the actual run time from `date`, in the user's local time zone. Never hardcode a time or copy a timestamp from an earlier brief. Reason: a fixed or copied time misreports when the brief was really written.
- Write the full content to a temp file, then rename it over `DAILY.md`. Reason: partial writes leave a broken brief mid-routine.
- Verify that the first 12 lines match Header plus the start of Focus.

## Report to the owner

The chat message is plain text, not a markdown document and not a code block. No title, no status legend, no wiki links, no Links section, no weekly-review section. This shape is only the chat message. Do not rewrite `DAILY.md` into it, and do not change the file layout. Focus in the file stays max 5 one-line bullets.

Weekday.
Goal: one outcome from the top P1 row. Add one short clause if it is overdue or due today.

Focus:
- one short line per item, as many or as few as there are

Today: what is done, or nothing done yet. How many jobs need the owner (count of `PENDING.md` rows whose Source contains `JOB:`). Mail freshness in one clause. Notes: `No notes`, or the one-line answer if the owner asked a question.

Chat Focus source (this message only): every P1 row, then every P2 row, from `PENDING.md`, plus a note from the owner that needs action outside the brief. No maximum of 5. One item is one line. Zero items: write `- none`. Do not cap the message at 8 lines or 3 lines. `DAILY.md` may still store only 5 Focus bullets.

When to send:
- The first brief of the day: always send this message.
- The later briefs the same day: send this same shape only if action is needed, there is a new Focus item, or a step failed. Otherwise reply `routine_no_update` and send no message.
- Do not print key meetings. Still gather the calendar in Step 3.
- Never send, draft, or reply to anyone except this chat message to the owner. Never change `DAILY.md` into this format.

Example of shape only (fake items):

Wednesday.
Goal: send the clinic homepage draft. It is due today.

Focus:
- send that homepage draft
- pay the domain renewal before Friday

Today: the logo versions are done. Two jobs need you. Mail is current as of this morning. No notes.

## Voice

Plain, warm, direct, short. When the owner asks a simple question in notes, answer first.
