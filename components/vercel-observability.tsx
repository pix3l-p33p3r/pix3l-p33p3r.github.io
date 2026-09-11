"use client"

import Script from "next/script"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { flushAnalyticsQueue, isPrivateAdminUrl, stripTrackingUrl } from "@/lib/analytics"
import { readUmamiPublicConfig, umamiScriptSrc } from "@/lib/umami-config"

const isProd = process.env.NODE_ENV === "production"
const prodOnly = isProd ? { debug: false as const } : {}

export function VercelObservability() {
  const umami = readUmamiPublicConfig()

  return (
    <>
      {umami ? (
        <Script
          src={umamiScriptSrc(umami.url)}
          strategy="afterInteractive"
          data-website-id={umami.websiteId}
          data-exclude-search="true"
          data-exclude-hash="true"
          data-before-send="pixelUmamiBeforeSend"
          onLoad={flushAnalyticsQueue}
        />
      ) : null}
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
