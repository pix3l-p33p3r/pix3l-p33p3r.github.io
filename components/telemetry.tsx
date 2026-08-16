"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { detectGpu } from "@/lib/gpu"
import { trackGpuCapabilities, trackOutboundClick, trackPageView } from "@/lib/analytics"

export default function Telemetry() {
  const pathname = usePathname()

  useEffect(() => {
    trackPageView()
  }, [pathname])

  useEffect(() => {
    let cancelled = false
    void detectGpu().then((gpu) => {
      if (cancelled) return
      trackGpuCapabilities({
        backend: gpu.backend,
        webgpu: gpu.webgpu,
        webgl2: gpu.webgl2,
        webgl: gpu.webgl,
      })
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest("a")
      if (!anchor) return
      const href = anchor.getAttribute("href")
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) return
      try {
        const url = new URL(href, window.location.href)
        if (url.origin === window.location.origin) return
        const host = url.protocol === "mailto:" ? "mailto" : url.hostname
        if (!host) return
        trackOutboundClick(host)
      } catch {
        // Ignore unparseable hrefs.
      }
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  return null
}
