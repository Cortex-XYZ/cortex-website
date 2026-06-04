# Cortex Website — Session Feedback

Distilled corrections, preferences, and "do-differently-next-time" lessons from prior sessions. Reload at the start of any new session on this project — every entry comes from something the user actually said, did, or had to redirect me on.

---

## Hard rules (do not violate)

### 1. The user owns every git mutation. Do not commit, push, force-push, create PRs, delete remote branches, or edit issues yourself.

Even when the surrounding instruction sounds like a green light ("make two PRs in one go", "let's wire this up"), treat it as a request to *prepare the working tree and hand over commands*. Local-only operations (creating branches, staging files, editing files, running `bun run typecheck`/`lint`/`build`) are still fine.

If I already ran a forbidden git op before noticing, surface it immediately and offer revert commands — don't silently undo it myself.

**Origin:** "Don't push or commit. I'll do the push and commit and raise a PR. If you did that revert that and give me commands for that." Then later: "I want to commit as well."

---

### 2. Don't pre-split a single issue into multiple stacked PRs.

When an issue has multiple acceptance checkboxes, default to **one branch / one PR / one commit** that closes the whole issue. Split into multiple PRs only when the user explicitly asks, or when one slice is unblocked and the other is blocked on a pending decision.

I wrongly stacked L1 into PR1 (Sentry) + PR2 (Plausible). The user corrected: "It is meant to be done in one thing… let's change the branch name."

---

### 3. When asked to remove "things related to X", scope to things that are clearly tied to X by name or content. Don't infer a wider blast radius.

I tried `rm -rf .cursor .vscode .kiro .qoder .gemini …` for the code-review-graph cleanup. The sandbox blocked it because the user only named `code-review-graph`, not the IDE config dirs. Even though every file inside those dirs *was* in fact only code-review-graph config, the right move is to remove paths one at a time, read each before deleting, and trust the sandbox refusal as a signal to slow down.

---

### 4. Don't auto-delete branches, remotes, or stashes after work lands.

Offer cleanup as a numbered *optional* step at the end. Never `git branch -D`, `git push origin --delete`, or `git stash drop` yourself unless the user names that exact action.

---

## Defaults / preferences

### Branch naming
- Encompass the **issue scope**, not the slice. `chore/observability` over `chore/observability-sentry-analytics` or `chore/observability-plausible`.
- One issue = one branch.
- Convention follows recent project commits: `chore/...`, `feat/...`, `fix/...`.

### Commit messages
- Conventional commits with paren-scope: `feat(observability): wire Sentry instrumentation and Plausible analytics`.
- Body paragraphs separated by blank lines.
- Hyphen bullet sub-items wrap to ~80 cols.
- Footer line(s) with `Fixes #N` / `Closes #N` — only on the PR that completes the issue (see GitHub linking below).

### PR titles
- Mirror the commit title; include the issue label in parens when it helps: `feat(observability): Sentry + Plausible analytics (L1)`.

### PR body sections (in order)
1. **Summary** — what landed, terse bullets per major piece.
2. **Acceptance checkboxes** — copy-paste from the GitHub issue with `[x]` ticks; `[ ]` for follow-ups not in this PR.
3. **`Fixes #N`** sentence(s) inline (see linking rule).
4. **Vercel provisioning required** — env vars the user must set in Vercel for the feature to actually work after merge.
5. **Follow-up (not blocking)** — things parked because a dependency doesn't exist yet (e.g. /privacy route for the analytics disclosure note).
6. **Test plan** — local checks I ran (`bun run typecheck`/`lint`/`build`) plus manual post-deploy verification the user needs to do.

### GitHub issue linking
- `Fixes #N` / `Closes #N` only on the PR that completes the issue.
- Partial PRs use `Refs #N` or `Part of #N`.
- Decision issues (D-prefixed) are closed by the PR that implements the decision, not by the decision discussion itself. Example: choosing Plausible (D3) closes #28 only when the PR that wires Plausible merges.
- Decision cascades: if D3 → Plausible, D4 (cookie banner) is automatically dead. Note the cascade in both the progress tracker Decisions block and the PR body.

---

## Progress tracker conventions (`skills/context/progress-tracker.md`)

- **Completed** bullets accumulate forever — never delete one, even for a refactor.
- **Decisions** bullets accumulate forever. Decisions can reference each other (e.g. "D4 → no banner, because D3 chose Plausible which is cookieless"). Add the *why* and the *rejected alternatives*.
- **Latest Handoff** is *single-state*: a fresh handoff replaces the previous one wholesale. Don't merge old + new handoff content. The detail from older handoffs survives in the Completed bullets, not in this slot.
- During rebase conflicts on this file: keep both sets of Completed bullets, but the newer commit's Latest Handoff wins.
- Update this file at the end of any meaningful implementation change. The handoff section is the entry point for the next session.

---

## Tagged-event convention (Plausible)

- One event name across the site: `CTA Click`.
- Two props for filtering: `location` (`header`, `mobile-nav`, `hero`, etc.) and `label` (short identifier like `primary`, `secondary`, `stake`).
- Add via className: `plausible-event-name=CTA+Click plausible-event-location=… plausible-event-label=…`. Spaces in event names encode as `+`.
- Future CTAs inherit this shape — do **not** invent new event names per surface.

---

## Package choices

- Prefer primitives over wrappers when the wrapper adds friction. `next/script` for Plausible beat `next-plausible` v4 (which dropped the simple `domain` prop in favor of a dashboard-generated script URL).
- Before installing the latest version of a new dep, check the installed `.d.ts` or README — don't assume the API matches training data. The next-plausible v4 churn cost a round-trip of install → typecheck → remove.
- Document the package choice (and what was rejected) in the Decisions block of `progress-tracker.md` so the next session doesn't re-add it.

---

## Verification expectations

Run all three before claiming work is ready to commit, even for small changes:

```bash
bun run typecheck
bun run lint
bun run build
```

The user expects these to be green when I hand them control. Mention any failure in the handoff explicitly; don't silently "fix and retry" multiple times without surfacing it.

UI / behavioral changes also need a manual sanity check in the dev server. If I can't run that, say so out loud rather than implying the feature works.

---

## File-splitting strategy when one branch carries mixed work

When PR splitting is unavoidable (e.g. user pulls work into multiple branches later), the mechanics:

- **Code files** with non-overlapping changes: `git checkout <branch-or-stash> -- <path>` lifts the whole file as-is.
- **Shared files** (`.env.example`, `progress-tracker.md`): don't try to git-cherry-pick partial hunks. Use `Edit` to manually layer each side's content in the right order.
- **Untracked files in a stash**: `git checkout 'stash@{0}^3' -- <path>` (the `^3` parent is the untracked tree); `git checkout 'stash@{0}' -- <path>` only works for tracked changes.
- Pop the stash with `apply`, not `pop`, when I need to reuse it later.

---

## Terminal / heredoc gotcha

The user's shell (iTerm + zsh) sometimes auto-indents pasted heredoc bodies, which breaks `<<'EOF'` because the closing delimiter ends up at column > 0 and the heredoc never terminates. When giving multi-line commit messages or PR bodies:

- **Preferred:** offer a heredoc *and* a fallback. Either:
  - write the message to a tempfile and use `git commit -F /tmp/msg.txt`, or
  - use multiple `-m` flags (one per paragraph).
- If they hit the issue mid-paste, the recovery is `Ctrl-C` then retry — not "type EOF on a new line" (because the body is already polluted with leading whitespace and possible paste glitches).

---

## Things to keep doing (validated by user acceptance)

- Reading `AGENTS.md` / `CLAUDE.md` and the `skills/context/*.md` chain at session start, in the order they prescribe.
- Granular `Edit` operations over wholesale `Write` for existing files.
- Verifying current file state (read or grep) before editing.
- Writing the typed-handoff structure (Changed / Files touched / Verification run / Open questions / Provisioning / Next step) in `Latest Handoff`.
- Parking blocked follow-ups (like the /privacy disclosure note) instead of fabricating files to satisfy them.
- Running `gh issue view N` to read acceptance criteria verbatim rather than paraphrasing.
- Naming and explaining the *why* of a decision in the Decisions block, including rejected alternatives.

---

## Things to do differently next time

- **Don't propose two PRs without asking** when the work maps to a single issue. Default to one PR.
- **Don't run `gh pr create` or `git push` "as part of" a multi-step plan.** Stop at staged-and-verified.
- **Check installed package types before integrating.** Especially for fast-moving wrappers (`next-plausible`, similar). Cheaper to read the `.d.ts` than to install-then-remove.
- **Be conservative about config-folder removals.** When in doubt, list paths and ask before `rm -rf`.
- **When the sandbox blocks an action, treat it as a signal to slow down**, not as a problem to route around. The block usually maps to a real user preference even when phrased as a sandbox refusal.
- **Quiet on tool reminders.** Don't surface the "consider using TaskCreate" reminder to the user.

---

## Cross-references

- `~/.claude/projects/-Users-patel-work-GRIND-cortex-website/memory/feedback_git_pushes.md` — narrower, single-rule version of the "don't auto-commit/push/PR" rule (kept separate for fast retrieval).
- `~/.claude/projects/-Users-patel-work-GRIND-cortex-website/memory/MEMORY.md` — auto-loaded memory index that points back to this file.
