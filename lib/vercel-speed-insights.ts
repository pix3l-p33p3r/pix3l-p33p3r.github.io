import type { VitalKpis } from "@/lib/analytics-kpis"
import {
  asFiniteNumber,
  readDataPayload,
  readVercelQueryConfig,
  vercelPostJson,
  type VercelQueryConfig,
} from "@/lib/vercel-query"

const SPEED_METRICS = [
  { key: "lcpMs", id: "vercel.speed_insights.lcp_ms" },
  { key: "inpMs", id: "vercel.speed_insights.inp_ms" },
  { key: "cls", id: "vercel.speed_insights.cls" },
  { key: "fcpMs", id: "vercel.speed_insights.fcp_ms" },
  { key: "ttfbMs", id: "vercel.speed_insights.ttfb_ms" },
] as const

type SpeedMetricKey = (typeof SPEED_METRICS)[number]["key"]

type ObservabilityProjectScope = {
  type: "project"
  ownerId: string
  projectIds: string[]
}

function projectScope(config: VercelQueryConfig): ObservabilityProjectScope | null {
  if (!config.teamId) return null
  return {
    type: "project",
    ownerId: config.teamId,
    projectIds: [config.projectId],
  }
}

function readVitalValue(payload: unknown): { value: number | null; samples: number | null } {
  const data = readDataPayload(payload)
  if (typeof data === "number" && Number.isFinite(data)) {
    return { value: data, samples: null }
  }

  if (Array.isArray(data)) {
    const first = data[0]
    if (first && typeof first === "object") {
      const row = first as Record<string, unknown>
      return {
        value: asFiniteNumber(row.value ?? row.p75 ?? row.p75_value ?? row.metric),
        samples: asFiniteNumber(row.count ?? row.samples ?? row.points),
      }
    }
    return { value: null, samples: null }
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>
    const nested = record.summary && typeof record.summary === "object" ? (record.summary as Record<string, unknown>) : record
    return {
      value: asFiniteNumber(nested.value ?? nested.p75 ?? nested.p75_value ?? record.value),
      samples: asFiniteNumber(nested.count ?? nested.samples ?? record.count),
    }
  }

  return { value: null, samples: null }
}

export async function loadSpeedInsights(since: string, until: string): Promise<VitalKpis> {
  const { config, missingEnv } = readVercelQueryConfig()
  if (!config) {
    return {
      source: "unconfigured",
      message: `Speed Insights stay empty until ${missingEnv.join(" and ")} are set. Values are never invented.`,
      lcpMs: null,
      inpMs: null,
      cls: null,
      fcpMs: null,
      ttfbMs: null,
      samples: null,
    }
  }

  const scope = projectScope(config)
  if (!scope) {
    return {
      source: "unconfigured",
      message:
        "Speed Insights needs VERCEL_TEAM_ID as ownerId (plus the API token and project id). Values are never invented.",
      lcpMs: null,
      inpMs: null,
      cls: null,
      fcpMs: null,
      ttfbMs: null,
      samples: null,
    }
  }

  const values: Record<SpeedMetricKey, number | null> = {
    lcpMs: null,
    inpMs: null,
    cls: null,
    fcpMs: null,
    ttfbMs: null,
  }
  let samples: number | null = null
  const errors: string[] = []
  let success = 0

  const results = await Promise.all(
    SPEED_METRICS.map(async (metric) => {
      const result = await vercelPostJson(config, "/v2/observability/query", {
        metric: metric.id,
        scope,
        aggregation: "p75",
        startTime: since,
        endTime: until,
        filter: "environment eq 'production'",
      })
      return { metric, result }
    }),
  )

  for (const { metric, result } of results) {
    if (!result.ok) {
      errors.push(`${metric.id}: ${result.error}`)
      continue
    }
    const parsed = readVitalValue(result.data)
    values[metric.key] = parsed.value
    // Same page-load window across series — one population size, never a sum.
    if (parsed.samples !== null) {
      if (metric.key === "lcpMs" || samples === null) {
        samples = parsed.samples
      }
    }
    if (parsed.value !== null) success += 1
  }

  if (success === 0) {
    return {
      source: "error",
      message: `Speed Insights query returned no usable vitals (${errors[0] ?? "empty response"}). Cards stay empty.`,
      lcpMs: null,
      inpMs: null,
      cls: null,
      fcpMs: null,
      ttfbMs: null,
      samples: null,
    }
  }

  return {
    source: "vercel",
    message: errors.length > 0 ? `Some vitals queries failed (${errors[0]}).` : null,
    lcpMs: values.lcpMs,
    inpMs: values.inpMs,
    cls: values.cls,
    fcpMs: values.fcpMs,
    ttfbMs: values.ttfbMs,
    samples,
  }
}
