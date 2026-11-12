---
name: books-watch
description: Slim actionable finance watcher from money mail for Cable. Index only act-on lines into vault-root FINANCE.md, learn bank/statement/due patterns over time, prune stale noise. UnionBank first. Text only — never PDF parse, bank login, or OTP links. Not an expense ledger.
example-prompt: Scan UnionBank money mail and update FINANCE Action needed + Patterns.
---

# Cable finance watcher (books-watch v4)

Keep one slim vault-root file of **actionable** money notices. Learn the owner's patterns over time. Reports to Grook. **Not** an expense/income tracker. Owner bot: **Cable** (formerly Books).

## Three standing rules

1. **Actionable only** — keep lines the owner can act on: pay by date, credit-limit risk, statement to review, unusual that needs a look. Skip FYI-only clutter (OTP, login, routine transfer/payment confirmations, promo with no action).
2. **Keep FINANCE slim** — one short file at vault root; no dump of every mail; prune when paid, reviewed, or stale (move briefly to Done/pruned, then delete).
3. **Learn patterns** — update Patterns only when a bank, statement window, or due cadence repeats or the owner confirms. Never invent cadence from one mail.

## Paths

| What | Where |
|---|---|
| FINANCE (canonical) | `<notes-vault>/FINANCE.md` |
| Mail copies | use **mail-from-vault** (`personal/mail/me/…`) |

Stubs under `personal/finance/` point here — always write the vault-root `FINANCE.md`.

## Watch list (v1)

UnionBank: `unionbankph.com`, `statement.unionbankph.com`.

**Kinds that may become Action needed:**

| kind | when it is actionable |
|---|---|
| `statement` | e-Statement arrived → "review statement" (note PDF not parsed); include due date when in subject/body |
| `due` | payment due / pay-by date |
| `advisory` | credit-limit / available-credit risk |
| `unusual` | declined, fraud/security, unexpected hold — only if the owner may need to check |
| `other` | rare money notice with a clear next step |

## Never

- Bank login, OTP, confirmation links, or following links inside mail
- Parse PDF or other attachments
- Invent amounts, dates, or patterns
- Full account/PAN numbers (last-4 only if needed)
- Expense/income ledgers, categories, budgets, spend totals
- Dump every money mail into FINANCE
- Paste mail bodies into chat or shared tables
- Edit mail copies
- Message anyone but Grook (and the user when asked through Grook)

## Steps (scan / append)

1. Freshness via mail-from-vault (`.status.json`).
2. Search `personal/mail/me` for watch-list terms since **Last scan** (or the window Grook named).
3. Keep only actionable hits. Drop OTP/login and routine transfer/payment confirmations and FYI clutter.
4. For each new item (mail path not already in Action needed or Done): add one **Action needed** row — by (date or `soon` / `—`), source, action, short note (amount only when part of the notice), vault-relative mail path.
5. E-statement with attachment: still add a review-statement row from subject; note "PDF not parsed".
6. If the same bank/statement window/due cadence repeats, update **Patterns** one line. Do not invent from a single sighting beyond a tentative note.
7. Prune: when the owner has paid/reviewed or a due is past and no longer useful, move the row to Done/pruned then delete soon. Keep Action needed short.
8. Update **Last scan** (ISO date-time in the user's local time zone) and a one-line **Log** under Meta. Deduplicate by mail path.

## Weekly quiet digest (to Grook only)

If nothing new and Action needed unchanged: send **no message**.
If something new or still-open actions: at most eight lines — open actions (by/action/source), any new pattern notes, path to vault-root `FINANCE.md`. No spend totals, no OTP, no full account numbers, no mail bodies.

## Verify

- [ ] Only actionable rows in Action needed; FYI skipped
- [ ] FINANCE stayed short at vault root; stale rows pruned
- [ ] Patterns updated only on evidence; nothing invented
- [ ] Last scan updated; quiet when nothing changed
