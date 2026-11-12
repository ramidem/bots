---
name: gmail-draft-only
description: Create a Gmail draft in the owner's own account through the OpenBot browser, never sending it. Use when a bot must prepare an outgoing email for the owner to review and send.
---

# Gmail draft only (browser)

Creates a draft. The owner sends it. This skill never presses Send.

## Steps

1. Read the request: recipient, subject, body. Do not add content the owner did not ask for. Put no links in the body; point to sources by email subject and sender.
2. Open a Gmail compose URL in your own browser tab, with the owner's account selected. Use `authuser=<owner account>` and pass `to` and `su` (subject) in the URL.
3. Wait until the page is quiet. Check the page title and the "From" account: it must be the owner's account. If it is not, stop and report.
4. Set the body: replace the whole body with the draft text, so no old signature or links remain.
5. Wait for "Draft saved". If it does not appear, report it. Do not retry more than once.
6. Report back: draft saved, recipient, subject, and any gaps you marked in the text. Do not paste the body into chat unless asked.

## Rules

- Never click Send, and never use the keyboard shortcut for send.
- Never type credentials. If a sign-in or verification screen appears, use the browser takeover request and wait.
- Only use the owner's own account. Never open or draft in another person's account.
- Mark any missing information in the body as `[GAP: ...]` so the owner fills it in before sending.
- Keep the draft in the owner's drafts folder. Do not delete drafts unless the owner asks.
