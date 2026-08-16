# Pixel Peeper Portfolio

Personal portfolio / blog for **[pix3l_p33p3r](https://github.com/pix3l-p33p3r)** — cyberpunk terminal UI, project pages, MDX blog, and CV download.

**Live site:** [https://www.pixel-peeper.tech](https://www.pixel-peeper.tech)

## Stack

- **Next.js 14** (App Router) + React 18 + TypeScript
- **Tailwind CSS** + custom CRT / terminal styling
- **MDX** blog (`next-mdx-remote`, gray-matter)
- **pnpm** + Node **22.x**
- Deploy: **Vercel** (`vercel.json`)

## Quick start

```bash
# Node 22 + pnpm 10 (see package.json packageManager / engines)
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm start        # serve build
```

## Repo layout

| Path | Purpose |
|------|---------|
| `app/` | Routes: home, `/blog`, `/blog/[slug]`, `/projects/[slug]`, sitemap, robots |
| `components/` | Page sections + CRT overlays |
| `content/blog/` | MDX posts (file = route) |
| `lib/projects.ts` | Project catalog (typed array → `/projects/[slug]`) |
| `lib/site.ts` | Canonical `SITE_URL` / site name |
| `public/cv/` | Resume PDF |
| `.github/workflows/ci.yml` | CI: install + build on `main` and PRs |

The home About panel is an interactive shell (`help`, `projects`, `matrix`, Konami). Press `` ` `` to focus it.

## Common tasks

### Add a blog post

1. Create `content/blog/my-slug.mdx` with frontmatter:

```mdx
---
title: "My post"
date: "2026-08-16"
summary: "One-line summary"
tags: ["dev"]
---

Your MDX content here.
```

2. It appears on `/blog` and at `/blog/my-slug` after refresh / rebuild.

### Add or edit a project

Edit the array in `lib/projects.ts`. Each entry drives the home list and `/projects/[slug]`.

### Change the public domain

Update `SITE_URL` in `lib/site.ts` (metadata, sitemap, robots, OG all follow it). Keep Vercel domain / redirects in sync with apex vs `www`.

## Branching (team)

**Full architecture:** [docs/BRANCHING.md](./docs/BRANCHING.md)

Short version:

- **`main`** is the only long-lived branch (production → Vercel).
- Work on `feature/…`, `fix/…`, `chore/…`, `docs/…`, or `cursor/…`.
- Open a PR into `main`; squash-merge; branch deletes after merge.
- Never push directly to `main` (enable protection before teammates land — see below).

### Protect `main` (owner, once)

```bash
./scripts/enable-branch-protection.sh
```

Or Actions → **Enable branch protection** after adding secret `BRANCH_PROTECTION_TOKEN`.

## Docs

- [docs/BRANCHING.md](./docs/BRANCHING.md) — branch architecture for the team
- [CONTRIBUTING.md](./CONTRIBUTING.md) — day-to-day workflow
- [AGENTS.md](./AGENTS.md) — notes for Cursor / cloud agents
- [docs/TECH_DEBT.md](./docs/TECH_DEBT.md) — health rating and backlog

## Known caveats (today)

- Contact UI is link buttons (email / GitHub / X), not a backend form.
- Shared OG art at `/og/default.svg` until per-project screenshots exist.
- Canonical host is `www.pixel-peeper.tech` (`lib/site.ts`); keep Vercel redirects for apex aligned.
