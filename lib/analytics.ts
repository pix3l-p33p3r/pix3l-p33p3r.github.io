import { track as vercelTrack } from "@vercel/analytics"

type Props = Record<string, string | number | boolean | null>

function track(name: string, data?: Props) {
  if (typeof window === "undefined") return
  vercelTrack(name, data)
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

export const trackGpuCapabilities = (data: {
  backend: string
  webgpu: boolean
  webgl2: boolean
  webgl: boolean
}) => {
  track("gpu_capabilities", data)
}
