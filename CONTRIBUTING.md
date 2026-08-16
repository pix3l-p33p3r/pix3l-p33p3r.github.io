# Contributing

This repo is a small Next.js portfolio. Keep the process light, but consistent so onboarding stays smooth.

**Branch architecture (read this first):** [docs/BRANCHING.md](./docs/BRANCHING.md)

## Prerequisites

- **Node.js 22.x**
- **pnpm 10** (lockfile + `packageManager` field — do not switch to npm/yarn without a team decision)

```bash
pnpm install
pnpm dev
pnpm typecheck && pnpm lint && pnpm build
```

## Branch model (summary)

Trunk-based: **`main` only** as the long-lived branch. Production = `main` → Vercel.

| Prefix | Use |
|--------|-----|
| `feature/<name>` | New work |
| `fix/<name>` | Bugfixes |
| `chore/<name>` | Tooling, deps, cleanup |
| `docs/<name>` | Documentation |
| `cursor/<name>` | Cursor / cloud agents |
| `hotfix/<name>` | Urgent production fix |

Rules:

1. Branch off the latest `main`.
2. Open a PR **into `main`** (CI enforces naming + base).
3. Squash-merge; remote branch auto-deletes once protection/settings are on.
4. No `develop` / `test` / `latest-version` / `v0/*` branches.

```bash
git checkout main && git pull
git checkout -b feature/short-name
git push -u origin HEAD
gh pr create --base main --fill
```

## Pull requests

- Title: imperative and specific (`fix: dispose Three.js renderer on unmount`).
- Body: use the template — what / why / how to verify.
- Required checks: **`build`** and **`branch-naming`**.
- Do not merge with a red check.

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

## Owner: protect `main` before teammates land

Cloud agents cannot flip GitHub admin settings. As repo owner, run **one** of:

```bash
./scripts/enable-branch-protection.sh
```

or add secret `BRANCH_PROTECTION_TOKEN` (classic PAT, `repo` scope) and run workflow **Enable branch protection** from the Actions tab.

Details: [docs/BRANCHING.md](./docs/BRANCHING.md#protection-on-main-required).
