import {
  CUSTOM_EVENT_NAMES,
  emptyEventTotals,
  emptySnapshot,
  isCustomEventName,
  type AnalyticsSnapshot,
  type EventTotals,
  type NamedCount,
} from "@/lib/analytics-kpis"
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

async function queryEventsAggregate(
  config: VercelQueryConfig,
  params: Record<string, string | number | undefined>,
) {
  return vercelGetJson(config, "/v1/query/web-analytics/events/aggregate", params)
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
        "Vercel API credentials are not set. KPI cards stay empty until a server-only token and project id are present. No visit or click counts are invented.",
      missingEnv,
    })
  }

  const range = { since, until, limit: 50 }

  const [
    lifetimeVisits,
    windowVisits,
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
    queryVisitsCount(config),
    queryVisitsCount(config, { since, until }),
    queryVisitsAggregate(config, { ...range, by: "day" }),
    queryVisitsAggregate(config, { ...range, by: "requestPath" }),
    queryVisitsAggregate(config, { ...range, by: "referrerHostname" }),
    queryEventsAggregate(config, { ...range, by: "eventName" }),
    queryEventsAggregate(config, {
      ...range,
      by: "eventData/host",
      filter: "eventName eq 'outbound_click'",
    }),
    queryEventsAggregate(config, {
      ...range,
      by: "eventData/platform",
      filter: "eventName eq 'contact_click'",
    }),
    queryEventsAggregate(config, {
      ...range,
      by: "eventData/section",
      filter: "eventName eq 'navigation'",
    }),
    queryEventsAggregate(config, {
      ...range,
      by: "eventData/project",
      filter: "eventName eq 'project_view'",
    }),
    queryEventsAggregate(config, {
      ...range,
      by: "eventData/slug",
      filter: "eventName eq 'blog_post_view'",
    }),
    queryEventsAggregate(config, {
      ...range,
      by: "eventData/path",
      filter: "eventName eq 'page_not_found'",
    }),
  ])

  const queryResults = [
    lifetimeVisits,
    windowVisits,
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
  ]
  const anySuccess = queryResults.some((result) => result.ok)
  const apiError = firstApiError(queryResults)

  if (!anySuccess) {
    return emptySnapshot({
      source: "error",
      windowDays: WINDOW_DAYS,
      since,
      until,
      message: `Vercel Web Analytics did not return data (${apiError ?? "unknown error"}). Cards stay empty — counts are never guessed.`,
      missingEnv,
    })
  }

  const totals = emptyEventTotals()
  if (eventTotals.ok) {
    applyEventTotals(totals, readRows(eventTotals.data))
  }

  const lifetime = lifetimeVisits.ok ? readCountPair(lifetimeVisits.data) : null
  const window = windowVisits.ok ? readCountPair(windowVisits.data) : null

  return {
    source: "vercel",
    windowDays: WINDOW_DAYS,
    since,
    until,
    message: apiError
      ? `Some Vercel queries failed (${apiError}). Successful slices are shown; the rest stay empty.`
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
      totals,
      outboundHosts: outboundHosts.ok
        ? namedCounts(readRows(outboundHosts.data), ["eventData", "host"])
        : [],
      contactPlatforms: contactPlatforms.ok
        ? namedCounts(readRows(contactPlatforms.data), ["eventData", "platform"])
        : [],
      navigationSections: navigationSections.ok
        ? namedCounts(readRows(navigationSections.data), ["eventData", "section"])
        : [],
      projects: projects.ok ? namedCounts(readRows(projects.data), ["eventData", "project"]) : [],
      blogPosts: blogPosts.ok ? namedCounts(readRows(blogPosts.data), ["eventData", "slug"]) : [],
      notFoundPaths: notFoundPaths.ok
        ? namedCounts(readRows(notFoundPaths.data), ["eventData", "path"])
        : [],
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

function applyEventTotals(totals: EventTotals, rows: Record<string, unknown>[]): void {
  for (const row of rows) {
    const name = rowLabel(row, ["eventName", "event"])
    if (!isCustomEventName(name)) continue
    const counts = rowCounts(row)
    totals[name] = { count: counts.count, visitors: counts.visitors }
  }

  for (const name of CUSTOM_EVENT_NAMES) {
    if (totals[name].count === null) {
      totals[name] = { count: 0, visitors: 0 }
    }
  }
}
