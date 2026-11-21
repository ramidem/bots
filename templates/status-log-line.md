bots: all
---
# Status-log line

Last step of every routine run: append one line to the shared `status-log.md`. Append only; never edit or delete old lines.

## Format

```
[YYYY-MM-DD HH:MM] [bot] type=<type> count=<n> next=<item> status=<status>
```

- `[bot]`: your slug (or the routine name when one bot runs several).
- `type`: `jobs`, `events`, `finance`, `leads`, `task`, `sync`, `review`, `audit`, `brief`.
- `count`: a whole number (new items, issues, actions). `0` is fine.
- `next`: one token, no spaces (a deadline, an item id, `ok`, or an error word).
- `status`: `progress`, `clear`, `actionable`, `blocked`, `updated`.

## Examples (made-up data)

```
[2026-01-05 08:40] [career] type=jobs count=3 next=fri-interview status=actionable
[2026-01-05 06:20] [parenting] type=events count=2 next=thu-form-due status=clear
[2026-01-05 16:20] [cable] type=finance count=1 next=due-thu status=actionable
[2026-01-05 13:00] [mail-man] type=sync count=14 next=ok status=progress
[2026-01-05 10:45] [dr-egghead] type=review count=5 next=sales status=progress
```

## Rules

- One line per run, even when nothing changed.
- No personal data: no mail text, names of private people, amounts tied to a person, credentials.
- Write the line, then message Grook only if the run is urgent. Otherwise end quietly.
