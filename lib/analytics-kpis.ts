export const CUSTOM_EVENT_NAMES = [
  "page_view",
  "outbound_click",
  "resume_download",
  "contact_click",
  "navigation",
  "project_view",
  "blog_post_view",
  "time_on_page",
  "blog_engagement",
  "shell_command",
  "skill_inspect",
  "interest_tune",
  "gpu_capabilities",
  "page_not_found",
] as const

export type CustomEventName = (typeof CUSTOM_EVENT_NAMES)[number]

export type CustomEventDef = {
  name: CustomEventName
  label: string
  hint: string
}

export const CUSTOM_EVENT_DEFS: readonly CustomEventDef[] = [
  { name: "page_view", label: "Page views", hint: "Custom route-change event" },
  { name: "outbound_click", label: "Outbound clicks", hint: "External / mailto links" },
  { name: "resume_download", label: "Resume downloads", hint: "PDF from the resume panel" },
  { name: "contact_click", label: "Contact clicks", hint: "Email, GitHub, X" },
  { name: "navigation", label: "Navigation", hint: "Header / section jumps" },
  { name: "project_view", label: "Project views", hint: "Project cards and pages" },
  { name: "blog_post_view", label: "Blog post views", hint: "Individual MDX posts" },
  { name: "time_on_page", label: "Time on page", hint: "Dwell samples" },
  { name: "blog_engagement", label: "Blog engagement", hint: "Scroll / like / share" },
  { name: "shell_command", label: "Shell commands", hint: "About-panel vsh" },
  { name: "skill_inspect", label: "Skill inspects", hint: "Skills chip opens" },
  { name: "interest_tune", label: "Interest tunes", hint: "Interests chip opens" },
  { name: "gpu_capabilities", label: "GPU probes", hint: "WebGL / WebGPU detect" },
  { name: "page_not_found", label: "404s", hint: "Unknown routes" },
]

export function isCustomEventName(value: string): value is CustomEventName {
  return (CUSTOM_EVENT_NAMES as readonly string[]).includes(value)
}

export type NamedCount = {
  label: string
  count: number | null
  visitors: number | null
}

export type EventTotals = Record<CustomEventName, { count: number | null; visitors: number | null }>

export type DataSource = "vercel" | "unconfigured" | "error"

export type TrafficKpis = {
  pageviews: number | null
  visitors: number | null
  lifetimePageviews: number | null
  lifetimeVisitors: number | null
  byDay: Array<{ timestamp: string; pageviews: number | null; visitors: number | null }>
  topPaths: NamedCount[]
  topReferrers: NamedCount[]
}

export type EventKpis = {
  totals: EventTotals
  outboundHosts: NamedCount[]
  contactPlatforms: NamedCount[]
  navigationSections: NamedCount[]
  projects: NamedCount[]
  blogPosts: NamedCount[]
  notFoundPaths: NamedCount[]
}

export type VitalKpis = {
  source: DataSource
  message: string | null
  lcpMs: number | null
  inpMs: number | null
  cls: number | null
  fcpMs: number | null
  ttfbMs: number | null
  samples: number | null
}

export type AnalyticsSnapshot = {
  source: DataSource
  windowDays: number
  since: string
  until: string
  message: string | null
  missingEnv: string[]
  traffic: TrafficKpis
  events: EventKpis
  vitals: VitalKpis
}

export function emptyEventTotals(): EventTotals {
  return {
    page_view: { count: null, visitors: null },
    outbound_click: { count: null, visitors: null },
    resume_download: { count: null, visitors: null },
    contact_click: { count: null, visitors: null },
    navigation: { count: null, visitors: null },
    project_view: { count: null, visitors: null },
    blog_post_view: { count: null, visitors: null },
    time_on_page: { count: null, visitors: null },
    blog_engagement: { count: null, visitors: null },
    shell_command: { count: null, visitors: null },
    skill_inspect: { count: null, visitors: null },
    interest_tune: { count: null, visitors: null },
    gpu_capabilities: { count: null, visitors: null },
    page_not_found: { count: null, visitors: null },
  }
}

export function emptySnapshot(partial: {
  source: DataSource
  windowDays: number
  since: string
  until: string
  message: string | null
  missingEnv: string[]
  vitals?: Partial<VitalKpis>
}): AnalyticsSnapshot {
  return {
    source: partial.source,
    windowDays: partial.windowDays,
    since: partial.since,
    until: partial.until,
    message: partial.message,
    missingEnv: partial.missingEnv,
    traffic: {
      pageviews: null,
      visitors: null,
      lifetimePageviews: null,
      lifetimeVisitors: null,
      byDay: [],
      topPaths: [],
      topReferrers: [],
    },
    events: {
      totals: emptyEventTotals(),
      outboundHosts: [],
      contactPlatforms: [],
      navigationSections: [],
      projects: [],
      blogPosts: [],
      notFoundPaths: [],
    },
    vitals: {
      source: partial.vitals?.source ?? partial.source,
      message: partial.vitals?.message ?? null,
      lcpMs: null,
      inpMs: null,
      cls: null,
      fcpMs: null,
      ttfbMs: null,
      samples: null,
    },
  }
}
