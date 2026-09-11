import { CUSTOM_EVENT_DEFS } from "@/lib/analytics-kpis"
import type { AnalyticsSnapshot, NamedCount, VitalKpis } from "@/lib/analytics-kpis"

function formatCount(value: number | null): string {
  if (value === null) return "—"
  return value.toLocaleString("en-US")
}

function formatMs(value: number | null): string {
  if (value === null) return "—"
  if (value >= 1000) return `${(value / 1000).toFixed(2)}s`
  return `${Math.round(value)}ms`
}

function formatCls(value: number | null): string {
  if (value === null) return "—"
  return value.toFixed(3)
}

function vitalTone(kind: "lcp" | "inp" | "cls" | "fcp" | "ttfb", value: number | null): string {
  if (value === null) return "text-white/50"
  const good =
    (kind === "lcp" && value <= 2500) ||
    (kind === "inp" && value <= 200) ||
    (kind === "cls" && value <= 0.1) ||
    (kind === "fcp" && value <= 1800) ||
    (kind === "ttfb" && value <= 800)
  const ok =
    (kind === "lcp" && value <= 4000) ||
    (kind === "inp" && value <= 500) ||
    (kind === "cls" && value <= 0.25) ||
    (kind === "fcp" && value <= 3000) ||
    (kind === "ttfb" && value <= 1800)
  if (good) return "text-[#00ff00]"
  if (ok) return "text-[#ffcc00]"
  return "text-[#ff4800]"
}

function sourceLabel(source: AnalyticsSnapshot["source"]): string {
  switch (source) {
    case "dual":
      return "VERCEL_LIVE + UMAMI_LIVE"
    case "umami":
      return "UMAMI_LIVE"
    case "vercel":
      return "VERCEL_LIVE"
    case "unconfigured":
      return "SETUP"
    case "error":
      return "API_ERROR"
    default: {
      const _exhaustive: never = source
      return _exhaustive
    }
  }
}

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <article className="border border-[#333] bg-black/50 p-4 min-h-[96px] flex flex-col justify-between">
      <p className="font-mono text-[11px] tracking-widest text-[#00ffff]/70">{label}</p>
      <p className="text-3xl text-white mt-2 tabular-nums">{value}</p>
      {hint ? <p className="text-white/40 text-xs mt-2">{hint}</p> : null}
    </article>
  )
}

function RankedList({ title, rows, empty }: { title: string; rows: NamedCount[]; empty: string }) {
  return (
    <section className="border border-[#333] bg-black/40 p-4">
      <h3 className="text-[#ff4800] tracking-wider text-sm mb-3">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-white/40 text-sm">{empty}</p>
      ) : (
        <ol className="space-y-2">
          {rows.slice(0, 8).map((row) => (
            <li key={`${title}-${row.label}`} className="flex justify-between gap-4 text-sm font-mono">
              <span className="text-white/80 truncate">{row.label}</span>
              <span className="text-[#00ffff] tabular-nums">{formatCount(row.count)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

function VitalsRow({ vitals }: { vitals: VitalKpis }) {
  const items = [
    { kind: "lcp" as const, label: "LCP p75", value: formatMs(vitals.lcpMs), raw: vitals.lcpMs },
    { kind: "inp" as const, label: "INP p75", value: formatMs(vitals.inpMs), raw: vitals.inpMs },
    { kind: "cls" as const, label: "CLS p75", value: formatCls(vitals.cls), raw: vitals.cls },
    { kind: "fcp" as const, label: "FCP p75", value: formatMs(vitals.fcpMs), raw: vitals.fcpMs },
    { kind: "ttfb" as const, label: "TTFB p75", value: formatMs(vitals.ttfbMs), raw: vitals.ttfbMs },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {items.map((item) => (
        <article key={item.label} className="border border-[#333] bg-black/50 p-4">
          <p className="font-mono text-[11px] tracking-widest text-[#00ffff]/70">{item.label}</p>
          <p className={`text-2xl mt-2 tabular-nums ${vitalTone(item.kind, item.raw)}`}>{item.value}</p>
        </article>
      ))}
    </div>
  )
}

export default function AdminAnalyticsDashboard({ snapshot }: { snapshot: AnalyticsSnapshot }) {
  const resume = snapshot.events.totals.resume_download
  const outbound = snapshot.events.totals.outbound_click
  const contact = snapshot.events.totals.contact_click

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-widest text-[#00ffff]/70">KPI_CONSOLE</p>
          <h1 className="text-3xl text-[#ff4800] tracking-wider mt-1">Site analytics</h1>
          <p className="text-white/60 text-sm mt-2">
            Last {snapshot.windowDays} days · Vercel {sourceLabel(snapshot.trafficSource)} · Umami{" "}
            {sourceLabel(snapshot.eventsSource)} · visits from Vercel, custom events from Umami
          </p>
        </div>
        <form action="/admin/logout" method="post">
          <button
            type="submit"
            className="min-h-11 px-4 border border-[#333] text-white/80 hover:border-[#00ffff] hover:text-[#00ffff]"
          >
            Logout
          </button>
        </form>
      </div>

      {snapshot.message || snapshot.missingEnv.length > 0 || snapshot.vitals.message ? (
        <section className="border border-[#ff4800]/50 bg-black/50 p-4 text-sm text-white/80 space-y-2">
          {snapshot.missingEnv.length > 0 ? (
            <p>
              Missing server env:{" "}
              <code className="text-[#00ffff]">{snapshot.missingEnv.join(", ")}</code>. Set these on
              Vercel project <code className="text-[#00ffff]">portfolio</code> (Production + Preview).
            </p>
          ) : null}
          {snapshot.message ? <p>{snapshot.message}</p> : null}
          {snapshot.vitals.message ? <p>{snapshot.vitals.message}</p> : null}
        </section>
      ) : null}

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="VISITORS_30D" value={formatCount(snapshot.traffic.visitors)} hint="Vercel Web Analytics" />
        <KpiCard label="PAGEVIEWS_30D" value={formatCount(snapshot.traffic.pageviews)} hint="Vercel page views" />
        <KpiCard label="RESUME_DL" value={formatCount(resume.count)} hint="Umami resume_download" />
        <KpiCard
          label="OUTBOUND"
          value={formatCount(outbound.count)}
          hint={`contact_click ${formatCount(contact.count)}`}
        />
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="VISITORS_LIFE"
          value={formatCount(snapshot.traffic.lifetimeVisitors)}
          hint="Since Vercel Analytics was enabled"
        />
        <KpiCard
          label="PAGEVIEWS_LIFE"
          value={formatCount(snapshot.traffic.lifetimePageviews)}
          hint="Vercel production count"
        />
        <KpiCard label="CUSTOM_PAGE_VIEW" value={formatCount(snapshot.events.totals.page_view.count)} />
        <KpiCard label="404S" value={formatCount(snapshot.events.totals.page_not_found.count)} />
      </section>

      <section>
        <h2 className="text-[#ff4800] tracking-wider text-xl mb-3">Custom events (Umami)</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {CUSTOM_EVENT_DEFS.map((def) => {
            const totals = snapshot.events.totals[def.name]
            return (
              <KpiCard
                key={def.name}
                label={def.name.toUpperCase()}
                value={formatCount(totals.count)}
                hint={`${def.hint}${totals.visitors !== null ? ` · ${formatCount(totals.visitors)} visitors` : ""}`}
              />
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="text-[#ff4800] tracking-wider text-xl mb-3">Web Vitals</h2>
        <p className="text-white/50 text-xs mb-3">
          Speed Insights p75 · {sourceLabel(snapshot.vitals.source)}
          {snapshot.vitals.samples !== null ? ` · ${formatCount(snapshot.vitals.samples)} samples` : ""}
        </p>
        <VitalsRow vitals={snapshot.vitals} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <RankedList
          title="Top paths (Vercel)"
          rows={snapshot.traffic.topPaths}
          empty="No Vercel path breakdown yet (empty or VERCEL_API_TOKEN not set)."
        />
        <RankedList
          title="Top referrers (Vercel)"
          rows={snapshot.traffic.topReferrers}
          empty="No Vercel referrer breakdown yet (empty or VERCEL_API_TOKEN not set)."
        />
        <RankedList
          title="Outbound hosts (Umami)"
          rows={snapshot.events.outboundHosts}
          empty="No Umami outbound_click hosts yet."
        />
        <RankedList
          title="Contact platforms (Umami)"
          rows={snapshot.events.contactPlatforms}
          empty="No Umami contact_click platforms yet."
        />
        <RankedList
          title="Projects viewed (Umami)"
          rows={snapshot.events.projects}
          empty="No Umami project_view breakdown yet."
        />
        <RankedList title="Blog posts (Umami)" rows={snapshot.events.blogPosts} empty="No Umami blog_post_view breakdown yet." />
        <RankedList
          title="Navigation (Umami)"
          rows={snapshot.events.navigationSections}
          empty="No Umami navigation sections yet."
        />
        <RankedList title="404 paths (Umami)" rows={snapshot.events.notFoundPaths} empty="No Umami page_not_found paths yet." />
      </section>
    </div>
  )
}
