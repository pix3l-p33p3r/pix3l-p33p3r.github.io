type VaEventPayload = {
  name: string
  data?: Record<string, string | number>
}

declare global {
  interface Window {
    va?: (event: "event", payload: VaEventPayload) => void
  }
}

function track(name: string, data?: Record<string, string | number>) {
  if (typeof window === "undefined") return
  window.va?.("event", { name, data })
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
