# Design and review method

This is how a bot is designed, reviewed, and merged.

**Designing a bot.** Ask a few preference questions. Check whether an existing bot already covers the job. Then create it with one job stated first, an explicit anti-jobs list (what it never does and who owns that instead), one voice, a clear wake (chat on demand plus named routines, staggered), who it reports to, where its source of truth lives, and draft-then-send rules for anything outgoing. Coding bots get the pstack poteto-mode bar. Read the new bot's profile back to verify it.

**Reviewing a bot.** One bot per day on a cycle. Read the profile, routines, installed skills, and recent chat read-only. Look for: stale text; routines described but not registered (or the reverse); missing anti-jobs; overlap with another bot; duplicate messages; token waste; transcript friction; path/skill drift; **unused skills** (installed but never referenced by profile, routines, or recent work); **redundant skills** (two skills cover the same job, or a skill that belongs to another bot's job). Propose uninstall/disable for unused or redundant ones. Send about five numbered, concrete fixes. Change nothing until the user picks. Apply only what was picked, verify it, and log it.

**Merging bots.** Prefer fewer bots. Merge dormant or overlapping ones into the closest owner, keep one profile with explicit anti-jobs, and retire the other.

Review cycle: one bot per day, rotating forever (Schedule first, then Cable, Mail Man, Grook, Career, Sales, Parenting, Engineering Lead). The daily routine is paused until the user turns it on.
