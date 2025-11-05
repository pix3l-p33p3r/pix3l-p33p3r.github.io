// Vercel Analytics tracking functions

export const trackResumeDownload = () => {
  if (typeof window !== "undefined") {
    window.va?.("event", {
      name: "resume_download",
      data: {
        type: "PDF Download",
      },
    })
  }
  console.log("Analytics: Resume download tracked")
}

export const trackContactClick = (platform: string) => {
  if (typeof window !== "undefined") {
    window.va?.("event", {
      name: "contact_click",
      data: {
        platform: platform,
      },
    })
  }
  console.log(`Analytics: ${platform} contact click tracked`)
}

export const trackNavigation = (section: string) => {
  if (typeof window !== "undefined") {
    window.va?.("event", {
      name: "navigation",
      data: {
        section: section,
      },
    })
  }
  console.log(`Analytics: Navigation to ${section} tracked`)
}

export const trackProjectView = (projectName: string) => {
  if (typeof window !== "undefined") {
    window.va?.("event", {
      name: "project_view",
      data: {
        project: projectName,
      },
    })
  }
  console.log(`Analytics: ${projectName} project view tracked`)
}
