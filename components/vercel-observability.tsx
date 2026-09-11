"use client"

import { useEffect, type ComponentType } from "react"
import type { AnalyticsProps } from "@vercel/analytics/react"
import { analyticsBeforeSend, flushAnalyticsQueue, isPrivateAdminUrl, stripTrackingUrl } from "@/lib/analytics"
import { type UmamiPublicConfig, umamiScriptSrc } from "@/lib/umami-config"

type SpeedInsightsEvent = { type: "vital"; url: string; route?: string }

type SpeedInsightsProps = {
  beforeSend?: (event: SpeedInsightsEvent) => SpeedInsightsEvent | null | undefined | false
  debug?: boolean
}

const isProd = process.env.NODE_ENV === "production"
const prodOnly = isProd ? { debug: false as const } : {}

function injectUmamiScript(config: UmamiPublicConfig): void {
  const src = umamiScriptSrc(config.url)
  if (document.querySelector(`script[data-pixel-umami="1"][src="${src}"]`)) return

  const el = document.createElement("script")
  el.src = src
  el.defer = true
  el.dataset.websiteId = config.websiteId
  el.dataset.excludeSearch = "true"
  el.dataset.excludeHash = "true"
  el.dataset.beforeSend = "pixelUmamiBeforeSend"
  el.dataset.pixelUmami = "1"
  el.onload = () => flushAnalyticsQueue()
  document.body.appendChild(el)
}

export function VercelObservability({
  Analytics,
  SpeedInsights,
  umami,
}: {
  Analytics: ComponentType<AnalyticsProps>
  SpeedInsights: ComponentType<SpeedInsightsProps>
  umami: UmamiPublicConfig | null
}) {
  useEffect(() => {
    if (!umami) return
    injectUmamiScript(umami)
    const started = Date.now()
    const id = window.setInterval(() => {
      flushAnalyticsQueue()
      if (typeof window.umami?.track === "function" || Date.now() - started > 15000) {
        window.clearInterval(id)
      }
    }, 300)
    return () => window.clearInterval(id)
  }, [umami])

  return (
    <>
      <Analytics
        beforeSend={analyticsBeforeSend}
        {...(isProd ? { mode: "production" as const, debug: false } : {})}
      />
      <SpeedInsights
        beforeSend={(event) => {
          if (isPrivateAdminUrl(event.url)) return null
          return { ...event, url: stripTrackingUrl(event.url) }
        }}
        {...prodOnly}
      />
    </>
  )
}
