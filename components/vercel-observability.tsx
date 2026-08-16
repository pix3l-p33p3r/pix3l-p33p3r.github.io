"use client"

import type { ComponentType } from "react"
import type { AnalyticsProps } from "@vercel/analytics/react"
import { analyticsBeforeSend, stripTrackingUrl } from "@/lib/analytics"

type SpeedInsightsEvent = { type: "vital"; url: string; route?: string }

type SpeedInsightsProps = {
  beforeSend?: (event: SpeedInsightsEvent) => SpeedInsightsEvent | null | undefined | false
  debug?: boolean
}

const isProd = process.env.NODE_ENV === "production"
const prodOnly = isProd ? { debug: false as const } : {}

export function VercelObservability({
  Analytics,
  SpeedInsights,
}: {
  Analytics: ComponentType<AnalyticsProps>
  SpeedInsights: ComponentType<SpeedInsightsProps>
}) {
  return (
    <>
      <Analytics
        beforeSend={analyticsBeforeSend}
        {...(isProd ? { mode: "production" as const, debug: false } : {})}
      />
      <SpeedInsights
        beforeSend={(event) => ({ ...event, url: stripTrackingUrl(event.url) })}
        {...prodOnly}
      />
    </>
  )
}
