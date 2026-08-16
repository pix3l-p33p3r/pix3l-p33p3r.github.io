# AGENTS.md

## Cursor Cloud specific instructions

This is a single Next.js 14 (App Router) portfolio/blog site. Package manager is `pnpm` (see `pnpm-lock.yaml` and `packageManager` in `package.json`). Use **Node 22.x** (CI and `engines` agree).

Standard commands:

- Dev server: `pnpm dev` → http://localhost:3000
- Build: `pnpm build`
- Start built output: `pnpm start`

Non-obvious notes:

- `pnpm lint` is **not** usable non-interactively: ESLint is not configured, so `next lint` opens an interactive setup prompt. Builds also ignore lint/type errors (`eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` in `next.config.mjs`). Do not treat lint/typecheck as a gate until those are fixed (see `docs/TECH_DEBT.md`).
- Blog content is file-based MDX under `content/blog/*.mdx` (gray-matter + `next-mdx-remote`). Add/remove an `.mdx` file → route under `/blog/[slug]` and listing on `/blog`. Projects live in `lib/projects.ts` → `/projects/[slug]`.
- Canonical public URL is `SITE_URL` in `lib/site.ts` (`https://www.pixel-peeper.tech`). Prefer editing that constant over hardcoding domains.
- Deploy target is **Vercel**. `public/CNAME` is a leftover GitHub Pages artifact — do not assume Pages is the primary host.
- The `pnpm install` warning about the ignored `core-js` build script is harmless.
- Prefer short-lived branches from `main` and delete them after merge. Stale agent branches should not accumulate on the remote.
