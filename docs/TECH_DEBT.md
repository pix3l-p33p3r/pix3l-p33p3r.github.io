# Repo health — good / bad / ugly

Honest snapshot for teammates. Rating reflects **team-readiness and maintainability**.

**Overall after this cleanup pass: ~7 / 10** (was ~4.5). Still a portfolio, not a product platform — but quality gates and dependency surface are now sane.

---

## Done in the cleanup pass

- Enabled TypeScript + ESLint in builds; CI runs `typecheck`, `lint`, and `build`
- Pruned unused Radix/shadcn/form/chart deps; pinned versions (no `"latest"`)
- Removed dead code (theme provider, unused utils, noop `DataOverlay`, CSRF stubs, Pages `CNAME`)
- Fixed Three.js RAF cancel + WebGL dispose; About typing no longer uses `innerHTML`
- Mermaid uses `securityLevel: "strict"`; CSP no longer allows `unsafe-eval`
- Project repo links are optional / accurate when public; branded `/og/default.svg`
- Docs for onboarding (`README`, `CONTRIBUTING`, `AGENTS`)

## Still worth doing later

1. Real project screenshots instead of the shared OG SVG
2. Further CSP tightening (move KaTeX CSS off jsDelivr / drop `unsafe-inline` where possible)
3. Optional real contact form (Resend/Formspree) if link buttons are not enough
4. Enable GitHub branch protection on `main` (PRs only) — needs owner settings UI
5. Content model: move projects to MDX/JSON if the catalog grows

## Branch hygiene

`main` is the only long-lived branch. Architecture: `docs/BRANCHING.md`.

Protect `main` before collaborators land (`./scripts/enable-branch-protection.sh` as owner).
