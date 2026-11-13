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

**OUT:** job row details (they stay on the board and in `PENDING.md`); login, OTP, and security notices; application-submitted mail; bot chatter with nothing for the owner; duplicate links; full calendar dump (key meetings go only in the morning report); nested Owner/Next/Due blocks; stale items with no next step (prune); finance line items (one Focus bullet comes from `PENDING.md` if due soon).

Each fact appears once.

## the owner notes

Lines containing `**notes**`:
- (a) DAILY change: apply in the right section.
- (b) outside effect: add to Focus as `the owner note needs action` (counts toward the 5) and include in the morning report.
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

- Morning run (the first brief of the day): up to 8 lines covering Focus, key meetings, and notes needing action.
- Other runs: up to 3 lines only if action is needed, there is a new Focus item, or a step failed. Otherwise reply `routine_no_update`.
- Never send, draft, or reply outside updating `DAILY.md`.

## Voice

Plain, warm, direct, short. When the owner asks a simple question in notes, answer first.
