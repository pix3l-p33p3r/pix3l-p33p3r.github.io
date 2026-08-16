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

See **[CONTRIBUTING.md](./CONTRIBUTING.md)**. Short version:

- **`main`** is the only long-lived branch (production).
- Work on short-lived `feature/…`, `fix/…`, or `chore/…` branches.
- Open a PR into `main`; delete the branch after merge.
- Do not push directly to `main` once collaborators join.

## Docs

- [CONTRIBUTING.md](./CONTRIBUTING.md) — workflow for teammates
- [AGENTS.md](./AGENTS.md) — notes for Cursor / cloud agents
- [docs/TECH_DEBT.md](./docs/TECH_DEBT.md) — honest health rating and backlog

## Known caveats (today)

- `pnpm lint` is not useful yet (ESLint not configured); builds also ignore ESLint/TS errors via `next.config.mjs`. Tracked in `docs/TECH_DEBT.md`.
- Contact UI is link buttons (email / GitHub / X), not a backend form.
- Many UI packages in `package.json` are leftover scaffold deps — prune before relying on bundle size.
