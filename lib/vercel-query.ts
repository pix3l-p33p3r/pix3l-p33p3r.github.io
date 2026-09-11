export type VercelQueryConfig = {
  token: string
  projectId: string
  teamId: string | null
}

export function readVercelQueryConfig(): { config: VercelQueryConfig | null; missingEnv: string[] } {
  const token =
    process.env.VERCEL_API_TOKEN?.trim() ||
    process.env.VERCEL_TOKEN?.trim() ||
    process.env.VERCEL_ACCESS_TOKEN?.trim() ||
    ""
  const projectId =
    process.env.VERCEL_PROJECT_ID?.trim() ||
    process.env.VERCEL_WEB_ANALYTICS_PROJECT_ID?.trim() ||
    ""
  const teamId = process.env.VERCEL_TEAM_ID?.trim() || process.env.VERCEL_ORG_ID?.trim() || ""

  const missingEnv: string[] = []
  if (!token) missingEnv.push("VERCEL_API_TOKEN")
  if (!projectId) missingEnv.push("VERCEL_PROJECT_ID")

  if (missingEnv.length > 0) {
    return { config: null, missingEnv }
  }

  return {
    config: {
      token,
      projectId,
      teamId: teamId || null,
    },
    missingEnv: [],
  }
}

export function analyticsWindow(days = 30): { since: string; until: string; sinceMs: number; untilMs: number } {
  const untilMs = Date.now()
  const sinceMs = untilMs - days * 24 * 60 * 60 * 1000
  return {
    since: new Date(sinceMs).toISOString(),
    until: new Date(untilMs).toISOString(),
    sinceMs,
    untilMs,
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

export function asFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

export function readDataPayload(payload: unknown): unknown {
  const record = asRecord(payload)
  if (!record) return payload
  if ("data" in record) return record.data
  return payload
}

export function readRows(payload: unknown): Record<string, unknown>[] {
  const data = readDataPayload(payload)
  if (!Array.isArray(data)) return []
  return data.map(asRecord).filter((row): row is Record<string, unknown> => row !== null)
}

export function readCountPair(payload: unknown): { count: number | null; visitors: number | null; pageviews: number | null } {
  const data = readDataPayload(payload)
  const record = asRecord(data) ?? asRecord(payload)
  if (!record) {
    return { count: null, visitors: null, pageviews: null }
  }
  return {
    count: asFiniteNumber(record.count ?? record.events),
    visitors: asFiniteNumber(record.visitors),
    pageviews: asFiniteNumber(record.pageviews),
  }
}

export function rowLabel(row: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === "string" && value.trim()) return value
    if (typeof value === "number" && Number.isFinite(value)) return String(value)
  }
  return "unknown"
}

export function rowCounts(row: Record<string, unknown>): { count: number | null; visitors: number | null } {
  return {
    count: asFiniteNumber(row.count ?? row.pageviews ?? row.events ?? row.value),
    visitors: asFiniteNumber(row.visitors),
  }
}

export async function vercelGetJson(
  config: VercelQueryConfig,
  path: string,
  params: Record<string, string | number | undefined>,
): Promise<{ ok: true; data: unknown } | { ok: false; status: number; error: string }> {
  const url = new URL(`https://api.vercel.com${path}`)
  url.searchParams.set("projectId", config.projectId)
  if (config.teamId) url.searchParams.set("teamId", config.teamId)

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue
    url.searchParams.set(key, String(value))
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    })
    const text = await response.text()
    let data: unknown = null
    if (text) {
      try {
        data = JSON.parse(text) as unknown
      } catch {
        data = { message: text.slice(0, 200) }
      }
    }
    if (!response.ok) {
      const record = asRecord(data)
      const message =
        (typeof record?.error === "string" && record.error) ||
        (typeof record?.message === "string" && record.message) ||
        `Vercel API ${response.status}`
      return { ok: false, status: response.status, error: message }
    }
    return { ok: true, data }
  } catch {
    return { ok: false, status: 0, error: "Vercel API request failed" }
  }
}

export async function vercelPostJson(
  config: VercelQueryConfig,
  path: string,
  body: Record<string, unknown>,
): Promise<{ ok: true; data: unknown } | { ok: false; status: number; error: string }> {
  const url = new URL(`https://api.vercel.com${path}`)
  if (config.teamId) url.searchParams.set("teamId", config.teamId)
  url.searchParams.set("projectId", config.projectId)

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(body),
    })
    const text = await response.text()
    let data: unknown = null
    if (text) {
      try {
        data = JSON.parse(text) as unknown
      } catch {
        data = { message: text.slice(0, 200) }
      }
    }
    if (!response.ok) {
      const record = asRecord(data)
      const nestedError = asRecord(record?.error)
      const message =
        (typeof record?.message === "string" && record.message) ||
        (typeof nestedError?.message === "string" && nestedError.message) ||
        `Vercel API ${response.status}`
      return { ok: false, status: response.status, error: message }
    }
    return { ok: true, data }
  } catch {
    return { ok: false, status: 0, error: "Vercel API request failed" }
  }
}
