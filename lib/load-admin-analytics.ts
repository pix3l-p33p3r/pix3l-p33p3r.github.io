import type { AnalyticsSnapshot, DataSource } from "@/lib/analytics-kpis"
import { loadAnalyticsSnapshot as loadUmamiSnapshot } from "@/lib/umami-analytics"
import { loadAnalyticsSnapshot as loadVercelSnapshot } from "@/lib/vercel-web-analytics"
import { loadSpeedInsights } from "@/lib/vercel-speed-insights"

function uniqueEnv(values: string[]): string[] {
  return [...new Set(values)]
}

function combineSource(traffic: DataSource, events: DataSource): DataSource {
  const live = (value: DataSource) => value === "vercel" || value === "umami" || value === "dual"
  const trafficLive = live(traffic)
  const eventsLive = live(events)
  if (trafficLive && eventsLive) return "dual"
  if (trafficLive) return traffic === "dual" ? "vercel" : traffic
  if (eventsLive) return events === "dual" ? "umami" : events
  if (traffic === "error" || events === "error") return "error"
  return "unconfigured"
}

function joinMessages(parts: Array<string | null>): string | null {
  const text = parts.filter((part): part is string => Boolean(part)).join(" ")
  return text.length > 0 ? text : null
}

export async function loadAdminAnalytics(): Promise<AnalyticsSnapshot> {
  const [vercel, umami] = await Promise.all([loadVercelSnapshot(), loadUmamiSnapshot()])
  const since = vercel.since || umami.since
  const until = vercel.until || umami.until
  const vitals = await loadSpeedInsights(since, until)
  const trafficSource = vercel.source
  const eventsSource = umami.source

  return {
    source: combineSource(trafficSource, eventsSource),
    trafficSource,
    eventsSource,
    windowDays: vercel.windowDays || umami.windowDays,
    since,
    until,
    message: joinMessages([vercel.message, umami.message]),
    missingEnv: uniqueEnv([...vercel.missingEnv, ...umami.missingEnv]),
    traffic: vercel.traffic,
    events: umami.events,
    vitals,
  }
}
