---
name: mail-cleanup
description: Clean the user's mail copies in the notes vault so only the last 3 days are kept (plan, backup, approved delete, backup purge). Use only when Grook asks for a mail cleanup and relays the user's approval. Never as a routine.
example-prompt: Run the mail cleanup dry run.
---

# Clean old mail copies

The script is `mail-cleanup.py` in `~/Code/<owner>/mail-to-vault` (main). It keeps files whose date in the file name is the Manila date three days back or newer, in each Gmail mailbox folder under `personal/mail/`, and deletes older ones after a backup. It skips the family members' folders, `.copied.json`, `.status.json`, temp files, subfolders and everything that is not a mail file.

Run it with `/usr/bin/python3`. The config is `~/.config/mail-to-vault/config.json`.

## Rules (all of them, every time)

1. Never run this on a schedule or on your own. Start only when Grook asks for a cleanup step.
2. Never read, open, print or quote any mail file or file name. You only run the script and read its one-line counts. File names carry subjects, so they stay in the plan file.
3. Dry run first. Nothing is deleted until the user has approved, through Grook, the exact plan: the per-day counts AND the plan hash. If Grook's message does not contain the user's approval and the plan hash, do not run `apply`.
4. Run `apply` only with a plan made today and a backup made for that same plan. If anything differs (counts, hash, date), stop and tell Grook.
5. Do not edit the plan file, the backup, the script or the config. Do not run any other command on the mail folders.

## Steps

1. **Plan** (deletes nothing): `/usr/bin/python3 ~/Code/<owner>/mail-to-vault/mail-cleanup.py plan --config ~/.config/mail-to-vault/config.json`. Read the one JSON line: keep line, candidates per day, total, kept, `plan_hash`, the plan file path. Send Grook only: the keep line, the per-day counts, the total, the kept count and the plan hash. Then stop and wait for approval.
2. **Backup**, after Grook asks for it (this copies the files to be deleted, so it makes a second copy of full mail text outside the vault): `... mail-cleanup.py backup --plan <plan file> --dest ~/OpenBot/Agents/<mail-agent>/backups/mail-cleanup-<YYYYMMDD-HHMM>`. Check the JSON says ok and the file count equals the plan's total. Tell Grook.
3. **Apply**, only after Grook relays the user's approval of the plan hash: `... mail-cleanup.py apply --config ~/.config/mail-to-vault/config.json --plan <plan file> --backup <backup folder> --approved-hash <plan_hash>`. Report the counts line to Grook (deleted, already gone, skipped, failed). If it refuses, report the refusal code and stop; do not retry with changed arguments.
4. **After apply**, check `personal/mail/.status.json` still says ok at the next hourly copy and tell Grook once. Do not touch it.
5. **Purge the backup** only when Grook says it is time (14 days after the backup) and relays the user's yes: first `... mail-cleanup.py purge-backup --dest ~/OpenBot/Agents/<mail-agent>/backups --older-than 14` (a dry run), tell Grook the counts, and add `--apply` only after the yes.

## If something goes wrong

Stop, do not retry, and report the exact refusal code or the failed count to Grook. The backup folder holds the deleted files; restoring a file means copying it back, which only the user or Engineering Lead may ask for.
