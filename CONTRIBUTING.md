# Contributing

This repo is a small Next.js portfolio. Keep the process light, but consistent so onboarding stays smooth.

## Prerequisites

- **Node.js 22.x**
- **pnpm 10** (lockfile + `packageManager` field — do not switch to npm/yarn without a team decision)

```bash
pnpm install
pnpm dev
pnpm build
```

## Branch model

| Branch | Role |
|--------|------|
| `main` | Production. Always deployable. Protected once the team grows. |
| `feature/<short-name>` | New work |
| `fix/<short-name>` | Bugfixes |
| `chore/<short-name>` | Docs, deps, CI, cleanup |
| `cursor/<short-name>-…` | Cursor / cloud agent branches (same rules as features) |

Rules:

1. Branch off the latest `main`.
2. Prefer small PRs with one clear purpose.
3. Squash-merge (or merge + delete) — **delete the remote branch after merge**.
4. No long-lived side branches (`test`, `latest-version`, `v0/…`). If you need an experiment, use a short-lived branch or a fork.

### After merge

```bash
git checkout main
git pull origin main
git push origin --delete <your-branch>   # if GitHub did not auto-delete
```

## Pull requests

- Title: imperative and specific (`fix: dispose Three.js renderer on unmount`).
- Body: what / why; how to verify (`pnpm build`, pages touched).
- CI must pass (`.github/workflows/ci.yml` runs `pnpm install --frozen-lockfile` + `pnpm build`).
- Do not merge with known broken `main` builds.

## Where to change what

| Goal | Place |
|------|--------|
| Home sections | `components/*.tsx`, composed in `app/page.tsx` |
| Site URL / name | `lib/site.ts` |
| Projects | `lib/projects.ts` |
| Blog posts | `content/blog/*.mdx` |
| Global styles | `app/globals.css`, `tailwind.config.ts` |
| Security headers | `next.config.mjs` |

## Code expectations

- Prefer TypeScript correctness over silencing errors. Do not reintroduce `ignoreBuildErrors` / `ignoreDuringBuilds`.
- Avoid adding dependencies “just in case.” Keep the dependency set lean.
- Match existing visual language (Share Tech Mono, cyan `#00ffff`, orange `#ff4800`, dark CRT panels) unless the PR is a deliberate redesign.
- Keep imports at the top of the file (no inline imports).
- CI must pass: `pnpm typecheck`, `pnpm lint`, `pnpm build`.

## Collaborators

Invite teammates as GitHub collaborators on this repository. Until branch protection is enabled, treat `main` as protected by convention: **PRs only**.
