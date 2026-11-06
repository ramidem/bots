---
name: de-claude
description: Remove Claude from a git repo's history, pull requests and settings. Covers a Claude or Anthropic author or committer, Co-Authored-By trailers naming Claude, Claude-Session lines, the "Generated with Claude Code" footer in pull request descriptions, and the per-repo attribution setting. Use when GitHub lists Claude as a contributor or when commits should show only the owner's identity.
---

# de-claude

Goal: after this runs, nothing in the repo's commits, authors, committers, pull request
descriptions or Claude Code settings names Claude, and GitHub lists only the owner as a contributor.

This rewrites history, so it is destructive. Get the owner's explicit yes for each repo first. Never
run it on a working copy that has uncommitted work. Work in a fresh clone.

## 0. Know the target identity

The commits should carry the owner's identity. Read it from git config and never hard-code it:

    OWNER_NAME="$(git config user.name)"
    OWNER_EMAIL="$(git config user.email)"

Stop if either is empty or is itself a Claude or Anthropic address.

## 1. Scan (read only)

Run this in the repo, for every remote branch:

    git fetch --prune
    git log --remotes --format='%H %an <%ae> | %cn <%ce>' | grep -iE 'claude|anthropic'
    git log --remotes --format=%B | grep -iE 'co-authored-by:.*claude|claude-session|claude\.ai/code|generated with.*claude'

Any hit means the repo needs the rewrite. If the author shows a different Claude address than the
expected one, add its pattern to the env filter in step 3.

Pull request descriptions: list them through the GitHub tools or the API (`/repos/OWNER/REPO/pulls?state=all`)
and look for the footer or any Claude name.

Settings: check `~/.claude/settings.json` and the repo's `.claude/settings.json` for
`attribution.commit` and `attribution.pr`.

## 2. Back up

Keep a bundle outside the repo:

    git bundle create "../REPO-$(date +%Y%m%d-%H%M).bundle" --all
    git bundle verify "../REPO-$(date +%Y%m%d-%H%M).bundle"

## 3. Rewrite in a fresh clone

Use bash, not zsh: the `$var:` form is read differently by zsh.

    git clone -q REMOTE_URL /tmp/REPO-rw && cd /tmp/REPO-rw && git checkout -q --detach
    git for-each-ref --format='%(refname)' refs/remotes/origin | grep -v '/HEAD$' | while read ref; do
      b=${ref#refs/remotes/origin/}; git branch -f -q "$b" "$ref"
    done
    git checkout -q --detach
    git for-each-ref --format='%(refname:short) %(objectname)' refs/heads > /tmp/REPO-before.txt

    OWNER_NAME="..." OWNER_EMAIL="..." FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f \
      --env-filter '
        case "$GIT_AUTHOR_EMAIL" in *anthropic.com) export GIT_AUTHOR_NAME="$OWNER_NAME" GIT_AUTHOR_EMAIL="$OWNER_EMAIL";; esac
        case "$GIT_COMMITTER_EMAIL" in *anthropic.com) export GIT_COMMITTER_NAME="$OWNER_NAME" GIT_COMMITTER_EMAIL="$OWNER_EMAIL";; esac' \
      --msg-filter 'python3 /PATH/TO/.claude/skills/de-claude/strip_message.py' \
      -- --branches

    rm -rf .git/refs/original && git reflog expire --expire=now --all && git gc -q --prune=now

Use the path to `strip_message.py` in the repo you are rewriting. Do not put the owner's real
name or address in the repo itself; pass them through the environment, as above.

## 4. Verify before pushing

For each branch, the tree must be unchanged and the commit count must match:

    git -C REPO_CLONE rev-parse "origin/$b^{tree}"  vs  git -C /tmp/REPO-rw rev-parse "$b^{tree}"

Re-run the scan from step 1 against `/tmp/REPO-rw`. It must find nothing.

## 5. Push with leases

Force-push only with a lease on the SHA you just fetched, so a push that landed in the meantime is refused:

    while read b; do
      new=$(git rev-parse "$b"); old=$(git -C REPO_CLONE rev-parse -q --verify "origin/$b") || continue
      [ "$old" = "$new" ] && continue
      git push -q --force-with-lease="refs/heads/${b}:${old}" origin "${new}:refs/heads/${b}"
    done < <(git for-each-ref --format='%(refname:short)' refs/heads)

## 6. Settings, so it does not come back

Add a project settings file to the repo and commit it with the owner's identity, with no trailer:

    {
      "attribution": { "commit": "", "pr": "" }
    }

Save it as `.claude/settings.json`. Push it to `main` as a fast-forward, after the rewrite.

## 7. Pull request descriptions

Edit each affected description: remove the footer lines and rename any model name to a neutral
phrase. Make this edit through the GitHub tools or the web UI. Do not rewrite a description with a
token in a script.

## 8. Tell the collaborators

Anyone with a clone must re-sync. Tell them to fetch and rebase onto `origin/main`, or to commit or
stash their work first. Never reset hard over uncommitted work.

## 9. Confirm the result

- The scan in step 1 finds nothing on the remote refs.
- For public repos: the contributors list (`/repos/OWNER/REPO/contributors`) shows only the owner.
  Private repos cannot be read anonymously; check the commits directly.
- The repo's `.claude/settings.json` is on `main`.

## Keeping it out

- The `.claude/settings.json` file above, in every repo.
- Agents and scripts that commit must not add a Co-Authored-By line that names Claude. Put that
  rule in each agent's instructions.
- A commit-message hook can refuse it at the source. It is a repo change, so get the owner's yes first.
