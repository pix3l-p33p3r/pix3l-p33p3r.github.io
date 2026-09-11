# Public weekday book

Route: `/dashboard`. Typed loaders live in `lib/dashboard.ts`.

Herald overwrites these files on each ship (then squash-merge to `main` so Vercel rebuilds):

| File | Contents |
|------|----------|
| `data/dashboard/book.json` | mode, `generated_at`, balances, positions, open/pending orders, weekday inception points |
| `data/dashboard/trades.json` | weekday fills + thesis / reasoning |

Rules:

- Timezone is `Africa/Casablanca`. Set `generated_at` to an ISO-8601 instant; the page formats it in that zone.
- Keep `mode: "paper"` until a live desk exists. The UI labels PAPER vs LIVE from this field.
- Null money fields mean unpublished. The page shows "—". Do not invent brokerage numbers or fake P&L.
- `inception.points` are weekdays only (`YYYY-MM-DD`). No Saturday/Sunday rows and no extra day-dots. Prior sessions use `kind: "close"`. If today's weekday is present, the loader treats it as the live mark.
- Public copy is Pixel Peeper only (no legal name, no phone). Telemetry stays Vercel first-party.
