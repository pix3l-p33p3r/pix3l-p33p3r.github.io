# Private admin analytics

Password-gated KPI console at `/admin/analytics`. It is **not** in the public header, sitemap, or robots allow-list. Unauthenticated visitors get a login form (HTML) or `401` (non-HTML). Metrics are never shown without a valid session.

This is website analytics (visits, clicks, Web Vitals) — not a trading book.

## Env vars (Vercel project `portfolio`)

Set these in the Vercel dashboard for project **`portfolio`**:

**Project → Settings → Environment Variables**

Apply each variable to **Production** and **Preview** (and Development if you use `vercel env pull`).

### Required — gate

| Name | Notes |
|------|--------|
| `ADMIN_DASHBOARD_PASSWORD` | Dashboard password. Server-only. Never commit it. Alias: `ANALYTICS_DASHBOARD_PASSWORD`. |

Optional extra signing secret (otherwise the session HMAC is derived from the password):

| Name | Notes |
|------|--------|
| `ADMIN_SESSION_SECRET` | Random string. Rotating the password (or this secret) signs everyone out. |

### Optional — live Vercel numbers

Without these, the UI still loads after login and shows empty KPI cards (`—`). It does **not** invent visit or click counts.

| Name | Notes |
|------|--------|
| `VERCEL_API_TOKEN` | Personal / team access token with access to Web Analytics (and Speed Insights if you want vitals). Aliases: `VERCEL_TOKEN`, `VERCEL_ACCESS_TOKEN`. |
| `VERCEL_PROJECT_ID` | Project id (`prj_…`) for `portfolio`. Alias: `VERCEL_WEB_ANALYTICS_PROJECT_ID`. |
| `VERCEL_TEAM_ID` | Required for team-owned projects (`team_…`). Alias: `VERCEL_ORG_ID`. |

Create the token under Vercel **Account / Team → Settings → Tokens**. Scope it as narrowly as Vercel allows. Treat it like a password.

## After merge (Herald / Pixel)

1. Squash-merge this PR into `main` when CI is green (coordinator merge unless auto-merge is already policy).
2. On Vercel project `portfolio`, set `ADMIN_DASHBOARD_PASSWORD` (Production + Preview). Pick a long random password; do not put it in GitHub, the PR, or chat logs.
3. Optionally set `VERCEL_API_TOKEN`, `VERCEL_PROJECT_ID`, and `VERCEL_TEAM_ID` so the dashboard can pull live Web Analytics + Speed Insights.
4. Redeploy production (a merge to `main` is enough) and open `https://www.pixel-peeper.tech/admin/analytics`.
5. Confirm a logged-out browser sees the login gate, not KPI numbers.

Local check:

```bash
ADMIN_DASHBOARD_PASSWORD='dev-only-local' pnpm dev
# http://localhost:3000/admin/analytics → login, then empty/setup cards
```

## What the dashboard shows

When the Vercel token + project id are present, server loaders call first-party APIs only:

- Web Analytics: `GET /v1/query/web-analytics/visits/{count,aggregate}` and `events/aggregate`
- Speed Insights: `POST /v2/observability/query` for `vercel.speed_insights.{lcp_ms,inp_ms,cls,fcp_ms,ttfb_ms}` (p75)

KPIs:

- Visitors / page views (30-day window + lifetime counts when the count endpoint returns them)
- Top paths and referrers
- Custom events already tracked on the site: `page_view`, `outbound_click`, `resume_download`, `contact_click`, `navigation`, `project_view`, `blog_post_view`, `time_on_page`, `blog_engagement`, `shell_command`, `skill_inspect`, `interest_tune`, `gpu_capabilities`, `page_not_found`
- Breakdowns for outbound hosts, contact platforms (GitHub / X / Email), projects, blog slugs, nav sections, 404 paths
- Web Vitals p75 (LCP, INP, CLS, FCP, TTFB) when Speed Insights answers

No Google Analytics. No third-party pixels. Admin routes are dropped from client Analytics / Speed Insights / custom `page_view` so the gate does not pollute traffic KPIs.
