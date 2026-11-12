---
name: repo-best-practices
description: Review a repo for open-source-style layout, README shape, personal data, license and CI, read-only, and report a verdict with findings.
---

# Repo best practices

Review `<repo>` read-only. Name the repo first. Change no file and no setting.

## Checklist

- The README says what the repo is, who it is for, the current status, how to start, and where the detail lives, and it stays under about 60 lines. A reader should learn that without opening another file.
- The README has no changelog, no rules, and no routine schedules. Those belong in their own files.
- The repo has LICENSE, CONTRIBUTING, SECURITY, CHANGELOG, `.github/` CI, and `docs/` for the long detail. Visitors look for these names.
- Folders are grouped by purpose. A mixed folder hides what to open.
- Where the repo describes bots, each file opens with the bot name and a one-job heading. One job is the contract.
- Scan the files for personal data. Look for names, emails, addresses, hostnames, clock times, places, and ids. Git history still holds the old text.
- CI runs the tests. That job is the public check.
- The repo description and topics are set. The host shows them before the README.
- The default branch and the branch rules are set. They say where a change lands.

## Output

Put the verdict first.

- PASS when every item holds.
- FAIL with the failing item and the proof.
- INCOMPLETE with what could not be checked.

Then list findings as P0, P1, or P2. Each finding has a location, the evidence, and the fix written as a requirement.

Never change files or repo settings during a review. Propose a list for `<owner>` to approve.
