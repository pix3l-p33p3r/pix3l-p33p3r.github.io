"use client"

import { useEffect } from "react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { flushAnalyticsQueue, isPrivateAdminUrl, stripTrackingUrl } from "@/lib/analytics"
import { type UmamiPublicConfig, umamiScriptSrc } from "@/lib/umami-config"

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

export function VercelObservability({ umami }: { umami: UmamiPublicConfig | null }) {
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
    <SpeedInsights
      beforeSend={(event) => {
        if (isPrivateAdminUrl(event.url)) return null
        return { ...event, url: stripTrackingUrl(event.url) }
      }}
      {...prodOnly}
    />
  )
}
