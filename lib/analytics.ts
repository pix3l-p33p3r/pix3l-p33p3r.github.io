import { track as vercelTrack, type BeforeSendEvent } from "@vercel/analytics"

type Props = Record<string, string | number | boolean | null>

function track(name: string, data?: Props) {
  if (typeof window === "undefined") return
  vercelTrack(name, data)
}

/** Drop query/hash so intake never sees tokens or form leftovers. */
export function stripTrackingUrl(url: string): string {
  try {
    const parsed = new URL(url)
    parsed.search = ""
    parsed.hash = ""
    return parsed.toString()
  } catch {
    return url
  }
}

export function analyticsBeforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  return { ...event, url: stripTrackingUrl(event.url) }
}

function referrerHost(): string {
  if (!document.referrer) return "direct"
  try {
    return new URL(document.referrer).hostname || "direct"
  } catch {
    return "direct"
  }
}

export const trackPageView = () => {
  track("page_view", {
    path: window.location.pathname,
    referrer_host: referrerHost(),
    language: navigator.language || "unknown",
    viewport_w: window.innerWidth,
    viewport_h: window.innerHeight,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
  })
}

export const trackOutboundClick = (host: string) => {
  track("outbound_click", { host })
}

export const trackPageNotFound = (path: string) => {
  track("page_not_found", {
    path,
    referrer_host: referrerHost(),
  })
}

export const trackResumeDownload = () => {
  track("resume_download", { type: "PDF Download" })
}

export const trackContactClick = (platform: string) => {
  track("contact_click", { platform })
}

export const trackNavigation = (section: string) => {
  track("navigation", { section })
}

export const trackProjectView = (projectName: string) => {
  track("project_view", { project: projectName })
}

export const trackBlogView = (slug: string, title: string) => {
  track("blog_post_view", { slug, title })
}

export const trackTimeOnPage = (slug: string, timeSpent: number) => {
  track("time_on_page", {
    page: slug,
    duration_seconds: Math.round(timeSpent / 1000),
  })
}

export const trackBlogEngagement = (slug: string, action: "scroll" | "like" | "share") => {
  track("blog_engagement", { slug, action })
}

export const trackShellCommand = (command: string) => {
  track("shell_command", { command: command.slice(0, 40) })
}

export const trackSkillInspect = (skill: string, group: string) => {
  track("skill_inspect", { skill, group })
}

export const trackInterestTune = (channel: string) => {
  track("interest_tune", { channel })
}

export const trackGpuCapabilities = (data: {
  backend: string
  webgpu: boolean
  webgl2: boolean
  webgl: boolean
}) => {
  track("gpu_capabilities", data)
}
