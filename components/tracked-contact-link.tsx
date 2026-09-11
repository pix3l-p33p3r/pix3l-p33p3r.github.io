"use client"

import type { ReactNode } from "react"
import { trackContactClick } from "@/lib/analytics"
import { isValidUrl } from "@/lib/security"

export default function TrackedContactLink({
  platform,
  href,
  className,
  children,
  external = false,
}: {
  platform: string
  href: string
  className?: string
  children: ReactNode
  external?: boolean
}) {
  return (
    <a
      href={href}
      className={className}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={() => {
        if (!isValidUrl(href)) return
        trackContactClick(platform)
      }}
    >
      {children}
    </a>
  )
}
