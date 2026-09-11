import { missingUmamiPublicEnv, readUmamiPublicConfig, umamiApiBaseUrl } from "@/lib/umami-config"

export type UmamiQueryConfig = {
  apiBase: string
  websiteId: string
  token: string
}

export function readUmamiQueryConfig(): {
  config: UmamiQueryConfig | null
  missingEnv: string[]
} {
  const publicConfig = readUmamiPublicConfig()
  const token = process.env.UMAMI_API_TOKEN?.trim() ?? ""
  const missingEnv = missingUmamiPublicEnv()
  if (!token) missingEnv.push("UMAMI_API_TOKEN")

  if (!publicConfig || !token) {
    return { config: null, missingEnv }
  }

  return {
    config: {
      apiBase: umamiApiBaseUrl(publicConfig.url),
      websiteId: publicConfig.websiteId,
      token,
    },
    missingEnv: [],
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

export function readUmamiPayload(payload: unknown): unknown {
  const record = asRecord(payload)
  if (!record) return payload
  if ("data" in record) return record.data
  return payload
}

export function readUmamiRows(payload: unknown): Record<string, unknown>[] {
  const data = readUmamiPayload(payload)
  if (!Array.isArray(data)) return []
  return data.map(asRecord).filter((row): row is Record<string, unknown> => row !== null)
}

export function readUmamiStatValue(payload: unknown, key: string): number | null {
  const data = asRecord(readUmamiPayload(payload)) ?? asRecord(payload)
  if (!data) return null
  const value = data[key]
  if (typeof value === "number" || typeof value === "string") return asFiniteNumber(value)
  const nested = asRecord(value)
  if (!nested) return null
  return asFiniteNumber(nested.value ?? nested.count ?? nested.total)
}

export function namedMetricRows(
  payload: unknown,
  labelKeys: string[] = ["x", "value", "name", "label"],
): Array<{ label: string; count: number | null; visitors: number | null }> {
  return readUmamiRows(payload)
    .map((row) => {
      const label = labelKeys
        .map((key) => row[key])
        .find((value) => typeof value === "string" && value.trim())
      const count = asFiniteNumber(row.y ?? row.count ?? row.total ?? row.pageviews ?? row.events)
      // Umami `{x,y}` rows use `y` as the event/pageview count, not unique visitors.
      const visitors = asFiniteNumber(row.visitors)
      return {
        label: typeof label === "string" ? label : "unknown",
        count,
        visitors,
      }
    })
    .filter((row) => row.label !== "Others")
}

export async function umamiGetJson(
  config: UmamiQueryConfig,
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<{ ok: true; data: unknown } | { ok: false; status: number; error: string }> {
  const url = new URL(`${trimSlash(config.apiBase)}${path.startsWith("/") ? path : `/${path}`}`)
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
      const nestedError = asRecord(record?.error)
      const message =
        (typeof record?.message === "string" && record.message) ||
        (typeof nestedError?.message === "string" && nestedError.message) ||
        (typeof record?.error === "string" && record.error) ||
        `Umami API ${response.status}`
      return { ok: false, status: response.status, error: message }
    }
    return { ok: true, data }
  } catch {
    return { ok: false, status: 0, error: "Umami API request failed" }
  }
}

function trimSlash(value: string): string {
  return value.replace(/\/+$/, "")
}
