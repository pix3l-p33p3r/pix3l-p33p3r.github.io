# Branch architecture

Trunk-based workflow for this portfolio. One long-lived branch. Everything else is short-lived and deleted after merge.

## Mental model

```text
  feature/* ──┐
  fix/*     ──┼──► PR ──► squash merge ──► main ──► Vercel production
  chore/*   ──┤                              ▲
  docs/*    ──┤                              │
  cursor/*  ──┘                         always deployable
```

| Ref | Lifetime | Deploys to | Who updates |
|-----|----------|------------|-------------|
| `main` | Forever | Vercel production (`www.pixel-peeper.tech`) | Squash-merged PRs only |
| `feature/<name>` | Hours–days | Vercel preview (PR) | One author / agent |
| `fix/<name>` | Hours–days | Vercel preview (PR) | One author / agent |
| `chore/<name>` | Hours–days | Vercel preview (PR) | One author / agent |
| `docs/<name>` | Hours–days | Vercel preview (PR) | One author / agent |
| `cursor/<name>-…` | Hours–days | Vercel preview (PR) | Cursor / cloud agents |

There is **no** `develop`, `staging`, `latest-version`, `test`, or `v0/*` branch. Those create confusion; do not recreate them.

## Naming rules

```text
<type>/<kebab-case-summary>
```

Examples:

- `feature/blog-rss-feed`
- `fix/sphere-dispose-leak`
- `chore/bump-next`
- `docs/onboarding-screenshots`
- `cursor/add-rss-feed-a1b2` (agents may append a short suffix)

Allowed `type` prefixes (enforced in CI on pull requests):

`feature` · `fix` · `chore` · `docs` · `cursor` · `hotfix`

Branch names must be **lowercase**, use hyphens (not underscores/spaces), and stay under ~50 characters for the summary part.

## Lifecycle (every change)

1. Update local `main`:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Create a branch:
   ```bash
   git checkout -b feature/my-change
   ```
3. Commit small, focused commits. Push the branch.
4. Open a PR **into `main`** (use the PR template).
5. Wait for CI: `typecheck` → `lint` → `build` (job name `build`).
6. Squash-merge. Delete the remote branch (GitHub checkbox or `git push origin --delete <branch>`).
7. Locally:
   ```bash
   git checkout main && git pull origin main
   git branch -d feature/my-change
   ```

## Protection on `main` (required)

`main` must reject direct pushes. Required:

| Rule | Setting |
|------|---------|
| Require a pull request | On |
| Required status checks | `build` + `branch-naming` (strict: branch up to date) |
| Require conversation resolution | On |
| Allow force pushes | Off |
| Allow deletions | Off |
| Dismiss stale reviews | On |

**Enable it (repo owner, once):**

```bash
# From a machine where YOU are logged into GitHub as pix3l-p33p3r
./scripts/enable-branch-protection.sh
```

Or paste the same JSON via the UI:  
Repo → **Settings** → **Branches** → **Add branch protection rule** → Branch name pattern `main` → match the table above.

Cloud / Cursor tokens cannot set this (need `Administration` scope). The script uses your personal `gh` login.

## Environments

| Environment | Branch | URL |
|-------------|--------|-----|
| Production | `main` | https://www.pixel-peeper.tech |
| Preview | PR head | Vercel preview URL on each PR |

No separate staging branch. Preview deployments on PRs are the QA surface.

## Merge policy

- **Squash merge** into `main` (keeps history linear).
- Prefer **0 required approvals** while the team is small; still use PRs for CI + review visibility. Raise the approval count when more reviewers join.
- Never merge with a red `build` check.
- Do not commit secrets, `.env`, or personal tokens.

## Agents (Cursor cloud)

- Branch off latest `main` with prefix `cursor/`.
- Same PR + CI rules as humans.
- Delete the agent branch after merge.
- Do not leave long-lived agent branches on the remote.

## Anti-patterns (do not)

- Pushing commits straight to `main`
- Long-lived `dev` / `test` / `latest` branches
- Merging `main` into a stale feature branch for weeks (rebase or recreate instead)
- Opening PRs that target anything other than `main`
- Re-adding GitHub Pages `CNAME` dual-deploy without an explicit team decision

## Quick reference card

```bash
git checkout main && git pull
git checkout -b feature/short-name
# …work…
git push -u origin HEAD
gh pr create --base main --fill
# after squash-merge:
git checkout main && git pull
git push origin --delete feature/short-name
```
