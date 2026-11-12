# Fleet overview

This table lists each bot, its one job, and how often it wakes.

| Bot | One job | Routines | Status |
| --- | --- | --- | --- |
| [Grook](../fleet/grook.md) | Routes each ask to its owner, checks the work, and gives one stream. | daily brief four times a day, daily archive, hourly nudge, Sunday cleanup, Sunday weekend review | Active |
| [Mail Man](../fleet/mail-man.md) | Reads the mail copies and flags what needs action, to Grook only. | hourly mail copy, mail triage three times a day | Active |
| [Dr Egghead](../fleet/dr-egghead.md) | Designs and reviews bots. | daily bot review (paused until the user turns it on), weekly routine check on Mondays, skill health every 3 days, daily records sync | Active |
| [Schedule](../fleet/schedule.md) | Keeps the calendar and coaches planned time against actual time. | daily actuals, a same-day retry, a daily planned-vs-actual check, a daily screens-off nudge | Active |
| [Career](../fleet/career.md) | Handles applications, documents, and upskilling. | weekday job-mail checks, Sunday metrics, daily flashcard sync | Active |
| [Sales](../fleet/sales.md) | Takes independent business from a lead to paid work. | Monday lead scan, Saturday lesson | Active, outreach on hold |
| [Agency](../fleet/agency.md) | Keeps one daily task in the agency folder and builds audit pages from its template. | daily task three times a day | Active, on Grok 4.7 |
| [Parenting](../fleet/parenting.md) | Handles household logistics and reminders. | weekday digest, nightly email, Sunday week-ahead, Friday check-in, monthly note, weekly cleanup | Active |
| [Persona](../fleet/persona.md) | Retired on 2026-11-11. The user deleted this bot. | none | Retired |
| [Engineering Lead](../fleet/engineering-lead.md) | Writes plans and checks repos, and does not write or review code. | none | Active |
| [Site Audit](../fleet/site-audit.md) | Retired on 2026-11-10. Merged into Sales. | none | Retired |
| [Cable](../fleet/cable.md) | Watches finance from mail and does not track expenses. | weekly quiet digest on Sunday | Active |

Registered routines are the ones that exist on the platform. They stay at least 15 minutes apart. The hourly mail copy is exempt.
