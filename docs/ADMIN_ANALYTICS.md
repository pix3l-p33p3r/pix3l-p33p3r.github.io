# Private admin analytics

Password-gated KPI console at `/admin/analytics`. It is **not** in the public header, sitemap, or robots allow-list. Unauthenticated visitors get a login form (HTML) or `401` (non-HTML). Metrics are never shown without a valid session.

This is website analytics (visits, clicks, optional Web Vitals) — not a trading book.

Tracking uses **[Umami](https://umami.is)** (MIT, open source). The site still deploys on **Vercel**. There is no Google Analytics pixel and no `@vercel/analytics` custom-event billing.

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

### Required — client pageviews + custom events

| Name | Notes |
|------|--------|
| `NEXT_PUBLIC_UMAMI_URL` | Tracker origin. Cloud: `https://cloud.umami.is`. Self-host: `https://umami.example.com` (no trailing slash). Must be present at **build** time so CSP can allow the host. |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Website UUID from the Umami website settings. |

Without these, the public site still works; the tracker script is not injected.

### Optional — live numbers in `/admin/analytics`

Without a token, login still works and the console shows empty SETUP cards (`—`). It does **not** invent visit or click counts.

| Name | Notes |
|------|--------|
| `UMAMI_API_TOKEN` | Server-only API key. Cloud: **Settings → API keys**. Self-host: API key (preferred) or a login Bearer token. Treat it like a password. |

Cloud API calls go to `https://api.umami.is/v1`. Self-host calls go to `{NEXT_PUBLIC_UMAMI_URL}/api`.

## Free Umami Cloud

1. Sign up at [https://cloud.umami.is/signup](https://cloud.umami.is/signup) (Hobby / free starter; self-host remains fully free).
2. Add a website for `www.pixel-peeper.tech`.
3. Copy the **Website ID** and set `NEXT_PUBLIC_UMAMI_URL=https://cloud.umami.is` plus `NEXT_PUBLIC_UMAMI_WEBSITE_ID`.
4. Create an API key (**Settings → API keys**) and set `UMAMI_API_TOKEN` on Vercel (Production + Preview). Do not put the key in GitHub or the PR.
5. Redeploy so Next.js rebuilds CSP with the Cloud hosts (`cloud.umami.is`, `api.umami.is`).

Tracker script: `https://cloud.umami.is/script.js`.

## Free self-host

Umami is MIT-licensed. Run your own instance (Docker, a VPS, or a free Postgres + Node host). Point `NEXT_PUBLIC_UMAMI_URL` at that origin and add the same website id + API token env vars.

The Next.js CSP allow-list includes `https://*.umami.is` plus whatever origin is in `NEXT_PUBLIC_UMAMI_URL` at build time. After changing the URL, redeploy.

## After merge (Herald / Pixel)

1. Squash-merge this PR into `main` when CI is green (coordinator merge unless auto-merge is already policy).
2. On Vercel project `portfolio`, set `ADMIN_DASHBOARD_PASSWORD` (Production + Preview). Pick a long random password; do not put it in GitHub, the PR, or chat logs.
3. Set `NEXT_PUBLIC_UMAMI_URL` and `NEXT_PUBLIC_UMAMI_WEBSITE_ID`. Optionally set `UMAMI_API_TOKEN` so the dashboard can pull live Umami stats.
4. Redeploy production (a merge to `main` is enough if the env vars were already present; otherwise trigger a redeploy) and open `https://www.pixel-peeper.tech/admin/analytics`.
5. Confirm a logged-out browser sees the login gate, not KPI numbers.

Local check:

```bash
ADMIN_DASHBOARD_PASSWORD='dev-only-local' pnpm dev
# http://localhost:3000/admin/analytics → login, then empty/setup cards

# With a local or Cloud Umami instance:
NEXT_PUBLIC_UMAMI_URL='https://cloud.umami.is' \
NEXT_PUBLIC_UMAMI_WEBSITE_ID='00000000-0000-0000-0000-000000000000' \
ADMIN_DASHBOARD_PASSWORD='dev-only-local' \
pnpm dev
```

Do not commit real ids or tokens. A dummy website id is enough to confirm the script tag and CSP; admin cards stay empty without `UMAMI_API_TOKEN`.

## What the dashboard shows

When `UMAMI_API_TOKEN` plus the public Umami env vars are present, server loaders call Umami only:

- Stats: `GET /websites/{id}/stats`
- Time series: `GET /websites/{id}/pageviews`
- Paths / referrers / event names: `GET /websites/{id}/metrics`
- Event property breakdowns: `GET /websites/{id}/event-data/values`

KPIs:

- Visitors / page views (30-day window + lifetime from 2015-01-01)
- Top paths and referrers
- Custom events already tracked on the site: `page_view`, `outbound_click`, `resume_download`, `contact_click`, `navigation`, `project_view`, `blog_post_view`, `time_on_page`, `blog_engagement`, `shell_command`, `skill_inspect`, `interest_tune`, `gpu_capabilities`, `page_not_found`
- Breakdowns for outbound hosts, contact platforms (GitHub / X / Email), projects, blog slugs, nav sections, 404 paths
- Web Vitals p75 (LCP, INP, CLS, FCP, TTFB) when optional Vercel Speed Insights credentials are still set — otherwise those cards stay `—`

No Google Analytics. No third-party ad pixels. Admin routes are dropped from Umami pageviews (`data-before-send`) and from custom `page_view` so the gate does not pollute traffic KPIs.
