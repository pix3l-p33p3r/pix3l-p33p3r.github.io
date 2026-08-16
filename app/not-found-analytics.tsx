"use client"

import { useEffect } from "react"
import { trackPageNotFound } from "@/lib/analytics"

export function NotFoundAnalytics() {
  useEffect(() => {
    trackPageNotFound(window.location.pathname)
  }, [])
  return null
}
