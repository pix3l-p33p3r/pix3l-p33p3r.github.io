import { emptyEventTotals, emptySnapshot, type AnalyticsSnapshot, type NamedCount } from "@/lib/analytics-kpis"
import {
  analyticsWindow,
  asFiniteNumber,
  readCountPair,
  readRows,
  readVercelQueryConfig,
  rowCounts,
  rowLabel,
  vercelGetJson,
  type VercelQueryConfig,
} from "@/lib/vercel-query"

const WINDOW_DAYS = 30

function namedCounts(rows: Record<string, unknown>[], labelKeys: string[]): NamedCount[] {
  return rows
    .map((row) => {
      const counts = rowCounts(row)
      return {
        label: rowLabel(row, labelKeys),
        count: counts.count,
        visitors: counts.visitors,
      }
    })
    .filter((row) => row.label !== "Others")
}

async function queryVisitsCount(
  config: VercelQueryConfig,
  params: Record<string, string | number | undefined> = {},
) {
  return vercelGetJson(config, "/v1/query/web-analytics/visits/count", params)
}

async function queryVisitsAggregate(
  config: VercelQueryConfig,
  params: Record<string, string | number | undefined>,
) {
  return vercelGetJson(config, "/v1/query/web-analytics/visits/aggregate", params)
}

function firstApiError(
  results: Array<{ ok: false; error: string } | { ok: true }>,
): string | null {
  for (const result of results) {
    if (!result.ok) return result.error
  }
  return null
}

export async function loadAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  const { since, until } = analyticsWindow(WINDOW_DAYS)
  const { config, missingEnv } = readVercelQueryConfig()

  if (!config) {
    return emptySnapshot({
      source: "unconfigured",
      windowDays: WINDOW_DAYS,
      since,
      until,
      message:
        "Vercel visit KPIs stay empty until a server-only token and project id are present. Counts are never invented.",
      missingEnv,
    })
  }

  const range = { since, until, limit: 50 }

  const [lifetimeVisits, windowVisits, byDay, topPaths, topReferrers] = await Promise.all([
    queryVisitsCount(config),
    queryVisitsCount(config, { since, until }),
    queryVisitsAggregate(config, { ...range, by: "day" }),
    queryVisitsAggregate(config, { ...range, by: "requestPath" }),
    queryVisitsAggregate(config, { ...range, by: "referrerHostname" }),
  ])

  const queryResults = [lifetimeVisits, windowVisits, byDay, topPaths, topReferrers]
  const anySuccess = queryResults.some((result) => result.ok)
  const apiError = firstApiError(queryResults)

  if (!anySuccess) {
    return emptySnapshot({
      source: "error",
      windowDays: WINDOW_DAYS,
      since,
      until,
      message: `Vercel Web Analytics did not return visit data (${apiError ?? "unknown error"}). Cards stay empty — counts are never guessed.`,
      missingEnv,
    })
  }

  const lifetime = lifetimeVisits.ok ? readCountPair(lifetimeVisits.data) : null
  const window = windowVisits.ok ? readCountPair(windowVisits.data) : null

  return {
    source: "vercel",
    trafficSource: "vercel",
    eventsSource: "unconfigured",
    windowDays: WINDOW_DAYS,
    since,
    until,
    message: apiError
      ? `Some Vercel visit queries failed (${apiError}). Successful slices are shown; the rest stay empty.`
      : null,
    missingEnv,
    traffic: {
      pageviews: window?.pageviews ?? null,
      visitors: window?.visitors ?? null,
      lifetimePageviews: lifetime?.pageviews ?? null,
      lifetimeVisitors: lifetime?.visitors ?? null,
      byDay: byDay.ok
        ? readRows(byDay.data).map((row) => ({
            timestamp: rowLabel(row, ["timestamp", "day", "date"]),
            pageviews: asFiniteNumber(row.pageviews),
            visitors: asFiniteNumber(row.visitors),
          }))
        : [],
      topPaths: topPaths.ok ? namedCounts(readRows(topPaths.data), ["requestPath", "route"]) : [],
      topReferrers: topReferrers.ok
        ? namedCounts(readRows(topReferrers.data), ["referrerHostname", "referrerUrl"])
        : [],
    },
    events: {
      totals: emptyEventTotals(),
      outboundHosts: [],
      contactPlatforms: [],
      navigationSections: [],
      projects: [],
      blogPosts: [],
      notFoundPaths: [],
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
