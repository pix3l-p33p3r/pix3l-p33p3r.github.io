// Google Analytics tracking functions
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "G-VWZHNJNSBZ"

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Track custom events
export const event = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Specific tracking functions
export const trackResumeDownload = () => {
  event("download", "Resume", "PDF Download", 1)
  console.log("📊 Analytics: Resume download tracked")
}

export const trackContactClick = (platform: string) => {
  event("click", "Contact", platform, 1)
  console.log(`📊 Analytics: ${platform} contact click tracked`)
}

export const trackNavigation = (section: string) => {
  event("navigate", "Navigation", section, 1)
  console.log(`📊 Analytics: Navigation to ${section} tracked`)
}

export const trackProjectView = (projectName: string) => {
  event("view", "Project", projectName, 1)
  console.log(`📊 Analytics: ${projectName} project view tracked`)
}
