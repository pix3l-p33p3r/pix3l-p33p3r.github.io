# AGENTS.md

## Cursor Cloud specific instructions

This is a single Next.js 14 (App Router) static portfolio/blog site. Package manager is `pnpm` (see `pnpm-lock.yaml`). Node 20+ works; the CI in `.github/workflows/pages.yml` uses Node 20 + pnpm 10.

Standard commands are defined in `package.json` scripts:
- Dev server: `pnpm dev` (serves at http://localhost:3000).
- Build: `pnpm build`.
- Start built output: `pnpm start`.

Non-obvious notes:
- `pnpm lint` is NOT usable non-interactively: ESLint is not configured in the repo, so `next lint` drops into an interactive setup prompt. Linting is also disabled in builds (`eslint.ignoreDuringBuilds: true` in `next.config.mjs`), and type errors are ignored too (`typescript.ignoreBuildErrors: true`). Don't rely on lint/typecheck as a gate here.
- Blog content is file-based MDX under `content/blog/*.mdx` (parsed via `gray-matter`, rendered through `next-mdx-remote`). Adding/removing an `.mdx` file there adds/removes a route under `/blog/[slug]`; new posts also appear on the `/blog` listing. Projects are similarly driven by `lib/projects.ts` -> `/projects/[slug]`.
- The `pnpm install` warning about the ignored `core-js` build script is harmless (it only prints a postinstall banner); no approval is needed.
