---
name: books-ledger
description: Maintain the personal finance ledger and statement index in the notes vault from mail-from-vault copies. Use for UnionBank (and later bank) expenses, transfers, payments, and e-statement index lines. Text from subject/from/body only — never PDF parse, bank login, or OTP links.
example-prompt: Index new UnionBank money mail into the ledger since yesterday.
---

# Books ledger (v1)

Keep `personal/finance/LEDGER.md` in the user's notes vault current from vault mail copies. Reports to Grook. Sales/Career/Mail Man do not own this ledger.

## Paths

| What | Where |
|---|---|
| Ledger | `<notes-vault>/personal/finance/LEDGER.md` |
| Mail copies | use **mail-from-vault** (`personal/mail/me/…`) |

## Watch list (v1)

UnionBank senders/domains and subjects: `unionbankph.com`, `statement.unionbankph.com`, e-Statement, Bills Payment, Fund Transfer, Declined Transaction. Skip promos/rewards marketing unless they confirm a real charge. Skip OTP, login, and "confirm this device" noise entirely (do not log them as expenses).

## Never

- Bank login, browser OTP, confirmation links, or following links inside mail
- Parse PDF or other attachments (say "attachment not copied; index from subject only")
- Invent amounts or dates
- Put full account/PAN numbers in the ledger (last-4 only if needed)
- Paste mail bodies into chat or shared tables; summarise
- Edit mail copies
- Message anyone but Grook (and the user when asked through Grook)

## Steps (append / scan)

1. Freshness via mail-from-vault (`.status.json`).
2. Search `personal/mail/me` for watch-list terms since the ledger's **Last scan** (or the window Grook named). Prefer per-email files; count each email once.
3. Classify each hit: `statement` | `expense` | `transfer` | `payment` | `advisory` | `other`. Drop OTP/login/confirm noise.
4. For each new item (mail path not already in the ledger): append one table row — date, source, type, amount if present in subject/body text else `—`, short note, vault-relative mail path.
5. E-statement with attachment: still add a **statement** row from subject (period, product name, last-4 if in subject); note "PDF not parsed".
6. Update **Metrics** counts and **Last scan** (ISO date-time in the user's local time zone). Append a one-line **Log** entry.
7. Deduplicate strictly by mail path.

## Weekly quiet digest (to Grook only)

If nothing new since last digest: send **no message**.
If something new: at most eight lines — period, counts by type, statement periods indexed, totals only when amounts were present, paths to ledger. No OTP, no full account numbers, no mail bodies.

## Verify

- [ ] Only new mail paths added; OTP/login skipped
- [ ] No invented amounts; PDFs not parsed
- [ ] Metrics + Last scan updated; quiet when nothing changed
