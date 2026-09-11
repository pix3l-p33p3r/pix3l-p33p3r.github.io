# Private admin analytics

Password-gated KPI console at `/admin/analytics`. It is **not** in the public header, sitemap, or robots allow-list. Unauthenticated visitors get a login form (HTML) or `401` (non-HTML). Metrics are never shown without a valid session.

This is website analytics (visits, clicks, optional Web Vitals) — not a trading book.

Tracking is a **dual stack**:

1. **Vercel Analytics** + Speed Insights — pageviews, visitors, Web Vitals. Custom `track()` events still emit to Vercel (harmless on Hobby if the custom-event API returns 402; useful after an upgrade).
2. **[Umami](https://umami.is)** (MIT, open source) — free custom events (`resume_download`, `contact_click`, `outbound_click`, and the rest of `lib/analytics.ts`).

There is no Google Analytics pixel. The site still deploys on **Vercel**.

## Env vars (Vercel project `portfolio`)

Set these in the Vercel dashboard for project **`portfolio`**:

**Project → Settings → Environment Variables**

Apply each variable to **Production** and **Preview** (and Development if you use `vercel env pull`).

Never commit tokens, passwords, or `.env` files.

### Required — gate

| Name | Notes |
|------|--------|
| `ADMIN_DASHBOARD_PASSWORD` | Dashboard password. Server-only. Never commit it. Alias: `ANALYTICS_DASHBOARD_PASSWORD`. |

Optional extra signing secret (otherwise the session HMAC is derived from the password):

| Name | Notes |
|------|--------|
| `ADMIN_SESSION_SECRET` | Random string. Rotating the password (or this secret) signs everyone out. |

### Optional — Vercel visits / vitals in `/admin/analytics`

Without these, login still works. Visit / path / vital cards stay empty SETUP (`—`). Counts are never invented.

| Name | Notes |
|------|--------|
| `VERCEL_API_TOKEN` | Personal / team access token with access to Web Analytics (and Speed Insights if you want vitals). Aliases: `VERCEL_TOKEN`, `VERCEL_ACCESS_TOKEN`. |
| `VERCEL_PROJECT_ID` | Project id (`prj_…`) for `portfolio`. Alias: `VERCEL_WEB_ANALYTICS_PROJECT_ID`. |
| `VERCEL_TEAM_ID` | Required for team-owned projects (`team_…`). Alias: `VERCEL_ORG_ID`. |

Create the token under Vercel **Account / Team → Settings → Tokens**. Scope it as narrowly as Vercel allows. Treat it like a password. Hobby still exposes visit metrics via the Vercel API / MCP.

### Optional — Umami client + event KPIs

Without the public vars, the public site still works; the Umami script is not injected. Without the API token, event cards stay empty SETUP (`—`).

| Name | Notes |
|------|--------|
| `NEXT_PUBLIC_UMAMI_URL` | Tracker origin. Cloud: `https://cloud.umami.is`. Self-host: `https://umami.example.com` (no trailing slash). Must be present at **build** time so CSP can allow the host. |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Website UUID from the Umami website settings. |
| `UMAMI_API_TOKEN` | Server-only API key for the admin console. Cloud: **Settings → API keys**. Self-host: API key (preferred) or a login Bearer token. |

Cloud API calls go to `https://api.umami.is/v1`. Self-host calls go to `{NEXT_PUBLIC_UMAMI_URL}/api`.

## Free Umami Cloud

1. Sign up at [https://cloud.umami.is/signup](https://cloud.umami.is/signup) (Hobby / free starter; self-host remains fully free).
2. Add a website for `www.pixel-peeper.tech`.
3. Copy the **Website ID** and set `NEXT_PUBLIC_UMAMI_URL=https://cloud.umami.is` plus `NEXT_PUBLIC_UMAMI_WEBSITE_ID`.
4. Create an API key (**Settings → API keys**) and set `UMAMI_API_TOKEN` on Vercel (Production + Preview). Do not put the key in GitHub or the PR.
5. Redeploy so Next.js rebuilds CSP with the Cloud hosts (`cloud.umami.is`, `api.umami.is`) **and** keeps the existing Vercel script hosts.

Tracker script: `https://cloud.umami.is/script.js`.

## Free self-host

Umami is MIT-licensed. Run your own instance (Docker, a VPS, or a free Postgres + Node host). Point `NEXT_PUBLIC_UMAMI_URL` at that origin and add the same website id + API token env vars.

The Next.js CSP allow-list includes `https://va.vercel-scripts.com`, `https://vitals.vercel-insights.com`, `https://*.umami.is`, plus whatever origin is in `NEXT_PUBLIC_UMAMI_URL` at build time. After changing the URL, redeploy.

## After merge (Herald / Pixel)

1. Squash-merge this PR into `main` when CI is green (coordinator merge unless auto-merge is already policy).
2. On Vercel project `portfolio`, set `ADMIN_DASHBOARD_PASSWORD` (Production + Preview). Pick a long random password; do not put it in GitHub, the PR, or chat logs.
3. Keep existing Vercel Analytics / Speed Insights. Optionally set `VERCEL_API_TOKEN`, `VERCEL_PROJECT_ID`, and `VERCEL_TEAM_ID` so the dashboard can pull live visit KPIs.
4. Set `NEXT_PUBLIC_UMAMI_URL` and `NEXT_PUBLIC_UMAMI_WEBSITE_ID`. Optionally set `UMAMI_API_TOKEN` so the dashboard can pull live Umami event breakdowns.
5. Redeploy production (a merge to `main` is enough if the env vars were already present; otherwise trigger a redeploy) and open `https://www.pixel-peeper.tech/admin/analytics`.
6. Confirm a logged-out browser sees the login gate, not KPI numbers.

Local check:

```bash
ADMIN_DASHBOARD_PASSWORD='dev-only-local' pnpm dev
# http://localhost:3000/admin/analytics → login, then empty/setup cards per missing source

# With a local or Cloud Umami instance (Vercel visit cards stay empty without Vercel API env):
NEXT_PUBLIC_UMAMI_URL='https://cloud.umami.is' \
NEXT_PUBLIC_UMAMI_WEBSITE_ID='00000000-0000-0000-0000-000000000000' \
ADMIN_DASHBOARD_PASSWORD='dev-only-local' \
pnpm dev
```

Do not commit real ids or tokens. A dummy website id is enough to confirm the Umami script tag and CSP; admin event cards stay empty without `UMAMI_API_TOKEN`.

## What the dashboard shows

Each source is independent. Missing env for one source empties that source’s cards only.

**Vercel** (when `VERCEL_API_TOKEN` + `VERCEL_PROJECT_ID` are present):

- Web Analytics: `GET /v1/query/web-analytics/visits/{count,aggregate}`
- Speed Insights: `POST /v2/observability/query` for `vercel.speed_insights.{lcp_ms,inp_ms,cls,fcp_ms,ttfb_ms}` (p75)
- Visitors / page views (30-day window + lifetime)
- Top paths and referrers

**Umami** (when public tracker env + `UMAMI_API_TOKEN` are present):

- Event names: `GET /websites/{id}/metrics` (`type=path` first, `type=url` only on HTTP 400)
- Event property breakdowns: `GET /websites/{id}/event-data/values`
- Custom events already tracked on the site: `page_view`, `outbound_click`, `resume_download`, `contact_click`, `navigation`, `project_view`, `blog_post_view`, `time_on_page`, `blog_engagement`, `shell_command`, `skill_inspect`, `interest_tune`, `gpu_capabilities`, `page_not_found`
- Breakdowns for outbound hosts, contact platforms (GitHub / X / Email), projects, blog slugs, nav sections, 404 paths

No Google Analytics. No third-party ad pixels. Admin routes are dropped from Vercel Analytics / Speed Insights, Umami pageviews (`data-before-send`), and custom `page_view` so the gate does not pollute traffic KPIs.
