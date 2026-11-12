# Skills

Generic copies of the skills the fleet uses, so any model (Claude, Grok, others) can read them.

- Top-level folders: the fleet's own skills. Local paths are placeholders (`<shared>`, `<notes-vault>`, `<app-repo>`, `<owner>`, `<agent-id>`, `<mail-agent>`, `<ceo-agent>`); fill them in before use. Family and client names are removed.
- `waiting-on-owner` is the fleet's `waiting-on-<owner>` skill; the owner's first name is blocked by the leak check, so the folder has a neutral name.
- Not included: pstack by Lauren Tan (MIT, https://github.com/cursor/plugins/tree/main/pstack); install it from upstream, since the repo leak check rejects its long skill names and it should stay unchanged. Also not included: OpenBot's own bundled skills (agent-designer, agent-chat-healthcheck, working-with-teammate-agents, routine-healthcheck, openbot-*) carry a commercial-license notice, and the Claude plugin skills (claude-mem, design, engineering, anthropic-skills) are other people's work. Install those from their sources.
