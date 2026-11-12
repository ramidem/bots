# Agent fleet records

Public, generic records of one OpenBot agent fleet. Each file says what that bot does, what it must not do, and how it is woken. The user is the person the bots serve. No personal data lives here.

| Bot | One job | Status |
| --- | --- | --- |
| [Grook](fleet/grook.md) | Routes each ask to its owner, checks the work, and gives one stream. | Active |
| [Mail Man](fleet/mail-man.md) | Reads the mail copies and flags what needs action, to Grook only. | Active |
| [Dr Egghead](fleet/dr-egghead.md) | Designs and reviews bots. | Active |
| [Schedule](fleet/schedule.md) | Keeps the calendar and coaches planned time against actual time. | Active |
| [Career](fleet/career.md) | Handles applications, documents, and upskilling. | Active |
| [Sales](fleet/sales.md) | Takes independent business from a lead to paid work. | Active, outreach on hold |
| [Agency](fleet/agency.md) | Keeps one daily task in the agency folder and builds audit pages from its template. | Active, on Grok 4.7 |
| [Parenting](fleet/parenting.md) | Handles household logistics and reminders. | Active |
| [Persona](fleet/persona.md) | Retired on 2026-11-11. The user deleted this bot. | Retired |
| [Engineering Lead](fleet/engineering-lead.md) | Writes plans and checks repos, and does not write or review code. | Active |
| [Site Audit](fleet/site-audit.md) | Retired on 2026-11-10. Merged into Sales. | Retired |
| [Cable](fleet/cable.md) | Watches finance from mail and does not track expenses. | Active |

## What is here

- `fleet/` holds one file per bot.
- `skills/` holds generic copies of the skills the fleet uses.
- `scripts/` holds the leak check.
- `test/` holds the leak-check tests.
- `docs/` holds the standing rules, the design method, the leak check, and the fleet overview.

See [the standing rules](docs/standing-rules.md), [design and review](docs/design-and-review.md), [the leak check](docs/leak-check.md), [the fleet overview](docs/fleet-overview.md), [CONTRIBUTING.md](CONTRIBUTING.md), [CHANGELOG.md](CHANGELOG.md), and [LICENSE](LICENSE).
