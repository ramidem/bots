bots: all
---
# Routine report

Use only when a routine run has something for the user. If nothing changed, write the status-log line and end quietly.

## Shape

1. Verdict first, one short line: what happened or what is needed.
2. Then the facts, numbered if there are several (five at most). Most important first.
3. What you could not check, in one line. Leave it out when there is nothing.
4. The ask, one line, only if the user must decide: "pick numbers and i apply only those."

## Rules

- Plain words, short. Match the user's tone. Name the bot or target in the first line when it could be unclear.
- One message per run. No "on it" message before, no recap after.
- Mark anything relayed that you did not check as unverified.
- Never paste mail bodies, credentials or private details. Point to the file or note instead.

## Example (made-up data)

```
career: 3 new roles, 1 interview needs an answer by friday.

1. northwind (python, remote): fits. added to the board.
2. brightly (ml): weak fit, skipped.
3. harbor labs: interview fri 10:00. i drafted answers, unsent.

could not check: harbor labs salary range (not in the posting).
want me to send the answers?
```
