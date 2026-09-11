import {
  CUSTOM_EVENT_NAMES,
  emptyEventTotals,
  emptySnapshot,
  isCustomEventName,
  type AnalyticsSnapshot,
  type EventTotals,
  type NamedCount,
} from "@/lib/analytics-kpis"
import { analyticsWindow } from "@/lib/vercel-query"
import {
  asFiniteNumber,
  namedMetricRows,
  readUmamiPayload,
  readUmamiRows,
  readUmamiQueryConfig,
  readUmamiStatValue,
  umamiGetJson,
  type UmamiQueryConfig,
} from "@/lib/umami-query"

const WINDOW_DAYS = 30
const LIFETIME_START_MS = Date.UTC(2015, 0, 1)

function firstApiError(
  results: Array<{ ok: false; error: string } | { ok: true }>,
): string | null {
  for (const result of results) {
    if (!result.ok) return result.error
  }
  return null
}

function websitePath(config: UmamiQueryConfig, suffix: string): string {
  return `/websites/${config.websiteId}${suffix}`
}

async function queryStats(config: UmamiQueryConfig, startAt: number, endAt: number) {
  return umamiGetJson(config, websitePath(config, "/stats"), { startAt, endAt })
}

async function queryPageviews(config: UmamiQueryConfig, startAt: number, endAt: number) {
  return umamiGetJson(config, websitePath(config, "/pageviews"), {
    startAt,
    endAt,
    unit: "day",
    timezone: "UTC",
  })
}

async function queryMetrics(
  config: UmamiQueryConfig,
  startAt: number,
  endAt: number,
  type: "url" | "referrer" | "event",
) {
  return umamiGetJson(config, websitePath(config, "/metrics"), {
    startAt,
    endAt,
    type,
    limit: 50,
  })
}

async function queryEventValues(
  config: UmamiQueryConfig,
  startAt: number,
  endAt: number,
  eventName: string,
  propertyName: string,
) {
  return umamiGetJson(config, websitePath(config, "/event-data/values"), {
    startAt,
    endAt,
    eventName,
    propertyName,
  })
}

function namedCounts(payload: unknown): NamedCount[] {
  return namedMetricRows(payload)
}

function applyEventTotals(totals: EventTotals, rows: NamedCount[]): void {
  for (const row of rows) {
    if (!isCustomEventName(row.label)) continue
    totals[row.label] = { count: row.count, visitors: row.visitors }
  }

  for (const name of CUSTOM_EVENT_NAMES) {
    if (totals[name].count === null) {
      totals[name] = { count: 0, visitors: 0 }
    }
  }
}

function pageviewSeries(payload: unknown): AnalyticsSnapshot["traffic"]["byDay"] {
  const data = readUmamiPayload(payload)
  const record = data !== null && typeof data === "object" && !Array.isArray(data)
    ? (data as Record<string, unknown>)
    : null
  const pageviews = record ? readUmamiRows(record.pageviews) : readUmamiRows(payload)
  const sessions = record ? readUmamiRows(record.sessions ?? record.visitors) : []
  const visitorsByDay = new Map<string, number | null>()
  for (const row of sessions) {
    const timestamp = typeof row.x === "string" ? row.x : ""
    if (!timestamp) continue
    visitorsByDay.set(timestamp, asFiniteNumber(row.y ?? row.visitors ?? row.count))
  }

  return pageviews
    .map((row) => {
      const timestamp = typeof row.x === "string" ? row.x : ""
      return {
        timestamp,
        pageviews: asFiniteNumber(row.y ?? row.pageviews ?? row.count),
        visitors: visitorsByDay.get(timestamp) ?? asFiniteNumber(row.visitors),
      }
    })
    .filter((row) => row.timestamp !== "")
}

export async function loadAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  const { since, until, sinceMs, untilMs } = analyticsWindow(WINDOW_DAYS)
  const { config, missingEnv } = readUmamiQueryConfig()

  if (!config) {
    return emptySnapshot({
      source: "unconfigured",
      windowDays: WINDOW_DAYS,
      since,
      until,
      message:
        "Umami is not fully configured. Set the public tracker URL and website id for pageviews/events, plus UMAMI_API_TOKEN for this console. KPI cards stay empty — counts are never invented.",
      missingEnv,
    })
  }

  const [
    windowStats,
    lifetimeStats,
    byDay,
    topPaths,
    topReferrers,
    eventTotals,
    outboundHosts,
    contactPlatforms,
    navigationSections,
    projects,
    blogPosts,
    notFoundPaths,
  ] = await Promise.all([
    queryStats(config, sinceMs, untilMs),
    queryStats(config, LIFETIME_START_MS, untilMs),
    queryPageviews(config, sinceMs, untilMs),
    queryMetrics(config, sinceMs, untilMs, "url"),
    queryMetrics(config, sinceMs, untilMs, "referrer"),
    queryMetrics(config, sinceMs, untilMs, "event"),
    queryEventValues(config, sinceMs, untilMs, "outbound_click", "host"),
    queryEventValues(config, sinceMs, untilMs, "contact_click", "platform"),
    queryEventValues(config, sinceMs, untilMs, "navigation", "section"),
    queryEventValues(config, sinceMs, untilMs, "project_view", "project"),
    queryEventValues(config, sinceMs, untilMs, "blog_post_view", "slug"),
    queryEventValues(config, sinceMs, untilMs, "page_not_found", "path"),
  ])

  const requiredResults = [windowStats, lifetimeStats, byDay, topPaths, topReferrers, eventTotals]
  const anySuccess = requiredResults.some((result) => result.ok)
  const apiError = firstApiError(requiredResults)

  if (!anySuccess) {
    return emptySnapshot({
      source: "error",
      windowDays: WINDOW_DAYS,
      since,
      until,
      message: `Umami API did not return data (${apiError ?? "unknown error"}). Cards stay empty — counts are never guessed.`,
      missingEnv,
    })
  }

  const totals = emptyEventTotals()
  if (eventTotals.ok) {
    applyEventTotals(totals, namedCounts(eventTotals.data))
  }

  return {
    source: "umami",
    windowDays: WINDOW_DAYS,
    since,
    until,
    message: apiError
      ? `Some Umami queries failed (${apiError}). Successful slices are shown; the rest stay empty.`
      : null,
    missingEnv,
    traffic: {
      pageviews: windowStats.ok ? readUmamiStatValue(windowStats.data, "pageviews") : null,
      visitors: windowStats.ok ? readUmamiStatValue(windowStats.data, "visitors") : null,
      lifetimePageviews: lifetimeStats.ok ? readUmamiStatValue(lifetimeStats.data, "pageviews") : null,
      lifetimeVisitors: lifetimeStats.ok ? readUmamiStatValue(lifetimeStats.data, "visitors") : null,
      byDay: byDay.ok ? pageviewSeries(byDay.data) : [],
      topPaths: topPaths.ok ? namedCounts(topPaths.data) : [],
      topReferrers: topReferrers.ok ? namedCounts(topReferrers.data) : [],
    },
    events: {
      totals,
      outboundHosts: outboundHosts.ok ? namedCounts(outboundHosts.data) : [],
      contactPlatforms: contactPlatforms.ok ? namedCounts(contactPlatforms.data) : [],
      navigationSections: navigationSections.ok ? namedCounts(navigationSections.data) : [],
      projects: projects.ok ? namedCounts(projects.data) : [],
      blogPosts: blogPosts.ok ? namedCounts(blogPosts.data) : [],
      notFoundPaths: notFoundPaths.ok ? namedCounts(notFoundPaths.data) : [],
    },
    vitals: {
      source: "unconfigured",
      message: null,
      lcpMs: null,
      inpMs: null,
      cls: null,
      fcpMs: null,
      ttfbMs: null,
      samples: null,
    },
  }
}
