# Repo health — good / bad / ugly

Honest snapshot for teammates planning work. Rating reflects **team-readiness and maintainability**, not “does the site look cool.”

**Overall: ~4.5 / 10** — strong identity and a working portfolio, but still carrying v0/scaffold debt and disabled quality gates.

---

## The good

- Distinct cyberpunk / CRT visual identity (not a generic AI template).
- Real App Router structure: home, blog, project detail, sitemap, robots, OG metadata.
- Canonical URL centralized in `lib/site.ts`.
- MDX blog pipeline exists (GFM, KaTeX, pretty-code; Mermaid/Graphviz client components).
- Security-minded headers in `next.config.mjs` (HSTS, frame deny, nosniff, Permissions-Policy).
- pnpm lockfile + `engines` + CI build on push/PR.
- No secrets in the repo (public contact info only).

## The bad

- README used to be a profile-badge dump (fixed in the onboarding cleanup PR). Keep project docs accurate.
- No ESLint config; CI does not run lint or `tsc`.
- `next.config.mjs` sets `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true` — green CI ≠ type-safe.
- Large unused dependency surface (many `@radix-ui/*`, form/chart/carousel packages with no app imports).
- ~15 dependencies pinned to `"latest"` — surprise breaks for teammates.
- Projects hardcoded in `lib/projects.ts`; some `repoUrl`s point at the profile, not a repo.
- Placeholder OG / project images still in use.
- Analytics helpers + scattered `console.log` tracking; some helpers unused.
- Domain noise: `public/CNAME` is apex `pixel-peeper.tech` while `SITE_URL` uses `www`.

## The ugly

1. **Quality gates disabled** in Next config — highest priority to reverse for any team workflow.
2. **CSP claims XSS protection** while allowing `'unsafe-inline'` and `'unsafe-eval'`; Mermaid uses `securityLevel: "loose"` + `innerHTML`.
3. **`lib/blog.ts` starts with `"use server"`** — FS readers become Server Actions unnecessarily.
4. **Three.js sphere** — animation / resize / dispose lifecycle is fragile (RAF + WebGL cleanup).
5. **Dead / wasteful UI** — e.g. overlays that tick forever and render nothing; unused theme/security stubs.
6. **Tailwind config** mixes incomplete custom palette with leftover shadcn tokens (`border` redefined twice).
7. **Contact “interface”** is mailto/social buttons only; `lib/security.tsx` CSRF helpers are theater until a real form exists.

---

## Suggested work order

1. Enable TypeScript + ESLint in builds; add `pnpm lint` / `tsc --noEmit` to CI.
2. Prune unused deps; pin `"latest"` versions to concrete ranges.
3. Delete dead code (`styles/globals.css` if unused, unused providers, noop overlays, unused security stubs — or implement a real contact path).
4. Fix Three.js lifecycle (cancel RAF, dispose renderer).
5. Normalize content (projects MDX/JSON, real images, accurate repo links).
6. Clean MDX component registration (one path: `compileMDX` map *or* in-file imports).
7. Align apex vs `www` and document Vercel as the only deploy path (or restore dual-deploy deliberately).
8. Tighten CSP after measuring what Mermaid/KaTeX actually need.

---

## Branch hygiene (done / convention)

Long-lived clutter that confused “what do I branch from?”:

| Branch | Disposition |
|--------|-------------|
| `main` | Keep — source of truth |
| `latest-version`, `v0/pix3l-peeper-019d0d9e`, `cursor/domain-…`, `cursor/resume-content-…` | Merged into `main` — delete |
| `test` | Divergent old Next migration — superseded — delete |
| `cursor/resume-and-github-pages-…` | Closed PR #1, superseded — delete |
| `cursor/setup-dev-environment-…` | AGENTS.md folded into mainline docs — close PR #3, delete |

Going forward: short-lived feature branches only; delete after merge. See `CONTRIBUTING.md`.
