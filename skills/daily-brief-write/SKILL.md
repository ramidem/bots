---
name: Daily brief write
description: Write Med's slim daily brief to bujou/DAILY.md (Header, Focus,
  Today, Links only), with Focus and the jobs count taken from PENDING.md. Use
  on the Manila daily-brief routine (06:00, 12:00, 15:00, 18:00), when asked to
  refresh the daily brief, or when its calendar step fails on a stale calma
  path.
---

# Daily brief write

Write Med's Obsidian vault brief at `$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/bujou/DAILY.md`. `PENDING.md` lives at `$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/bujou/PENDING.md` (the vault root), next to `DAILY.md`. Read-only except `DAILY.md` (and `PENDING.md`/`pending-cleared.json` when the morning refresh runs; `pending-cleared.json` stays in Grook's own workspace). Archiving is a separate skill: never archive here.

Schedule (Manila): archive 05:40; brief 06:00, 12:00, 15:00, 18:00; hourly nudge 07:50 to 22:50. The archive runs first, so the 06:00 run starts from a fresh file.

## Procedure

### Step 1: Date gate (run `date` first)
- Get today's date from `date` before writing anything.
- If the file's Date is before today, send the message `daily brief not archived yet; run daily-brief-archive` and stop. Reason: writing onto yesterday's file corrupts the archive trail.
- If the file is missing, create it from the template.

### Step 2: Refresh (06:00 run only)
Run the `hourly-nudge` skill's "Refresh only" mode: it syncs `PENDING.md` from its sources with no message to Med. The first nudge is at 07:50, so without this the morning brief would read yesterday's file. Other runs skip this step: the hourly nudge keeps the file current.

### Step 3: Gather (read-only)
- `PENDING.md`: the top P1 and P2 rows, and the count of rows whose Source contains `JOB:`. Also count rows whose Source contains `CHECK:` (N) and list their short names. Do not read JOBBOARD, FINANCE or bot reports directly; `PENDING.md` already holds what they contribute.
- Calendar: `node ~/Code/ramidem/calma/src/calma.ts calendar-week .` for today plus 48 hours, Manila time. Never run calma auth, uninstall, create, update, or delete; never read `~/.config/calma`. Reason: this skill must not change the calendar or credentials.
- If the calendar command fails because the routine still calls the old `calma/calma.mjs` path, treat it as a stale routine path, not a calma bug: the old file no longer exists. Verify `node ~/Code/ramidem/calma/src/calma.ts calendar-week .` runs on this machine, then have Engineering Lead change only that path in the routine text (leave T3 out of the fix) and read the routine back to confirm the path and the rest of the settings are unchanged. Do not add a yes/no row to `PENDING.md` for Med.
- Mail freshness: `personal/mail/.status.json` through mail-from-vault (ok and finished_at only), and today's mail file path for Links.
- Notion: only if tools are connected; otherwise skip.

### Step 4: Write once
- Apply the layout, write criteria and Med notes rules below.
- Set the Last updated line to the actual run time from `date`, in Manila time. Never hardcode a time or copy a timestamp from an earlier brief. Reason: a fixed or copied time misreports when the brief was really written.
- Write the full content to a temp file, then rename it over `DAILY.md`. Reason: partial writes leave a broken brief mid-routine.
- Verify that the first 12 lines match Header plus the start of Focus.

## Layout (only these sections)

Use template `~/OpenBot/Agents/agent-2a9952d7-93c4-46ef-8ea7-304654a3854c/daily-brief-template.md`.

1. **Header**: Date, Primary Goal (one outcome), Last updated.
2. **Focus**: the top P1 items, then the top P2 items, from `PENDING.md`, as **one** list; max **5** one-line bullets. Overdue and money first (the file's order already does this). A `CHECK:` row goes into Focus only when its `shipped` date is more than 3 days before today (use `TZ=Asia/Manila date`). It counts toward the max 5 and is written as `Check: <thing>`. A `CHECK:` row younger than that appears only in the Today line.
3. **Today**: Done; Jobs needing you (count of `PENDING.md` rows whose Source contains `JOB:`, plus the JOBBOARD link); New to check: N — <names> (omit the line when N is 0; names are the short names after `CHECK:`, comma-separated); Mail freshness.
4. **Links**: job board, `FINANCE`, today's mail path.

Keep `## 📅 Weekly review` exactly if present. Never edit or remove it.
Never add Blocker Board, Bots, or Parking sections.

## Write criteria

**IN:** Primary Goal (one outcome, taken from the top P1 row); Focus from `PENDING.md`; Today done, jobs count, mail; Links.

**OUT:** job row details (they stay on the board and in `PENDING.md`); login, OTP, and security notices; application-submitted mail; bot chatter with nothing for Med; duplicate links; full calendar dump (gather the calendar; do not print it in the chat message); nested Owner/Next/Due blocks; stale items with no next step (prune); finance line items (one Focus bullet comes from `PENDING.md` if due soon).

Each fact appears once.

## Med notes

Lines containing `**notes**`:
- (a) DAILY change: apply in the right section.
- (b) outside effect: add to Focus as `Med note needs action` (counts toward the file's 5) and include it in the chat Focus list.
- (c) question: answer in one line in Today.

After handling (a) or (c), mark the line `**notes-done**`. Never delete notes. Never treat notes as skip rules, mail sends, or routine changes.

## Report to Med

The chat message is plain text, not a markdown document and not a code block. No title, no status legend, no wiki links, no Links section, no weekly-review section. This shape is only the chat message. Do not rewrite `DAILY.md` into it, and do not change the file layout. Focus in the file stays max 5 one-line bullets.

Weekday.
Goal: one outcome from the top P1 row. Add one short clause if it is overdue or due today.

Focus:
- one short line per item, as many or as few as there are

Today: what is done, or nothing done yet. How many jobs need Med (count of `PENDING.md` rows whose Source contains `JOB:`). Mail freshness in one clause. Notes: `No notes`, or the one-line answer if he asked a question.
Add `New to check: N — names` when N is above 0.

Chat Focus source (this message only): every P1 row, then every P2 row, from `PENDING.md`, plus a Med note that needs action outside the brief. No maximum of 5. One item is one line. Zero items: write `- none`. Do not cap the message at 8 lines or 3 lines. `DAILY.md` may still store only 5 Focus bullets.

When to send:
- 06:00 Manila: always send this message.
- 12:00, 15:00 and 18:00: send this same shape only if action is needed, there is a new Focus item, or a step failed. Otherwise reply `routine_no_update` and send no message.
- Do not print key meetings. Still gather the calendar in Step 3.
- Never send, draft, or reply to anyone except this chat message to Med. Never change `DAILY.md` into this format.

Example of shape only (fake items):

Wednesday.
Goal: send the clinic homepage draft. It is due today.

Focus:
- send that homepage draft
- pay the domain renewal before Friday

Today: the logo versions are done. Two jobs need you. Mail is current as of 8:10. No notes.

## Voice

Plain, warm, direct, short. When Med asks a simple question in notes, answer first.
