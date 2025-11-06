"use client"

import { useEffect, useRef } from "react"
import { trackBlogView, trackTimeOnPage, trackBlogEngagement } from "@/lib/analytics"

interface BlogPostAnalyticsProps {
  slug: string
  title: string
}

export function BlogPostAnalytics({ slug, title }: BlogPostAnalyticsProps) {
  const pageStartTimeRef = useRef<number>(Date.now())
  const lastScrollRef = useRef<number>(0)

  useEffect(() => {
    // Track blog post view
    trackBlogView(slug, title)

    // Track time spent on page
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - pageStartTimeRef.current
      trackTimeOnPage(slug, timeSpent)
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    // Track scroll engagement - fire once when user scrolls
    const handleScroll = () => {
      const now = Date.now()
      if (now - lastScrollRef.current > 5000) {
        trackBlogEngagement(slug, "scroll")
        lastScrollRef.current = now
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [slug, title])

  return null
}
