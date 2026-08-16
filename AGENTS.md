# AGENTS.md

## Cursor Cloud specific instructions

This is a single Next.js 14 (App Router) portfolio/blog site. Package manager is `pnpm` (see `pnpm-lock.yaml` and `packageManager` in `package.json`). Use **Node 22.x** (CI and `engines` agree).

Standard commands:

- Dev server: `pnpm dev` → http://localhost:3000
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint`
- Build: `pnpm build`
- Start built output: `pnpm start`

Non-obvious notes:

- Blog content is file-based MDX under `content/blog/*.mdx` (gray-matter + `next-mdx-remote`). Add/remove an `.mdx` file → route under `/blog/[slug]` and listing on `/blog`. Mermaid/Graphviz components are injected via `compileMDX` in `app/blog/[slug]/page.tsx` — do not re-import them inside MDX files.
- Projects live in `lib/projects.ts` → `/projects/[slug]`. `repoUrl` is optional when there is no public repo.
- Canonical public URL is `SITE_URL` in `lib/site.ts` (`https://www.pixel-peeper.tech`). Prefer editing that constant over hardcoding domains.
- Deploy target is **Vercel** only.
- The `pnpm install` warning about ignored build scripts is usually harmless; approve only if a package actually needs a postinstall.
- Prefer short-lived branches from `main` and delete them after merge.
