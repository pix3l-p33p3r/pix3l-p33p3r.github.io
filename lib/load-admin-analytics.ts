import { loadAnalyticsSnapshot } from "@/lib/umami-analytics"
import { loadSpeedInsights } from "@/lib/vercel-speed-insights"
import type { AnalyticsSnapshot } from "@/lib/analytics-kpis"

export async function loadAdminAnalytics(): Promise<AnalyticsSnapshot> {
  const snapshot = await loadAnalyticsSnapshot()
  const vitals = await loadSpeedInsights(snapshot.since, snapshot.until)
  return { ...snapshot, vitals }
}
