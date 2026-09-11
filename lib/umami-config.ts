/** Public Umami tracker config. Safe for client bundles (NEXT_PUBLIC_* only). */

export type UmamiPublicConfig = {
  url: string
  websiteId: string
}

function trimSlash(value: string): string {
  return value.replace(/\/+$/, "")
}

export function readUmamiPublicConfig(): UmamiPublicConfig | null {
  const rawUrl = process.env.NEXT_PUBLIC_UMAMI_URL?.trim() ?? ""
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim() ?? ""
  if (!rawUrl || !websiteId) return null

  try {
    const parsed = new URL(rawUrl)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null
    const path = trimSlash(parsed.pathname)
    return {
      url: path ? `${parsed.origin}${path}` : parsed.origin,
      websiteId,
    }
  } catch {
    return null
  }
}

export function umamiScriptSrc(url: string): string {
  const trimmed = trimSlash(url)
  if (/\.js$/i.test(trimmed)) return trimmed
  return `${trimmed}/script.js`
}

export function umamiApiBaseUrl(publicUrl: string): string {
  const parsed = new URL(publicUrl)
  const host = parsed.hostname.toLowerCase()

  if (host === "cloud.umami.is" || host === "umami.is") {
    return "https://api.umami.is/v1"
  }

  if (host === "api.umami.is") {
    const base = trimSlash(`${parsed.origin}${parsed.pathname}`)
    return base.endsWith("/v1") ? base : `${base}/v1`
  }

  return `${parsed.origin}/api`
}

export function missingUmamiPublicEnv(): string[] {
  const missing: string[] = []
  if (!process.env.NEXT_PUBLIC_UMAMI_URL?.trim()) missing.push("NEXT_PUBLIC_UMAMI_URL")
  if (!process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim()) missing.push("NEXT_PUBLIC_UMAMI_WEBSITE_ID")
  return missing
}
