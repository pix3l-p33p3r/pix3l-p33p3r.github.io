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

export const trackBlogView = (slug: string, title: string) => {
  if (typeof window !== "undefined") {
    window.va?.("event", {
      name: "blog_post_view",
      data: {
        slug: slug,
        title: title,
      },
    })
  }
  console.log(`Analytics: Blog post "${title}" viewed`)
}

export const trackBlogListView = () => {
  if (typeof window !== "undefined") {
    window.va?.("event", {
      name: "blog_list_view",
      data: {
        page: "blog_index",
      },
    })
  }
  console.log("Analytics: Blog list page viewed")
}

export const trackTimeOnPage = (slug: string, timeSpent: number) => {
  if (typeof window !== "undefined") {
    window.va?.("event", {
      name: "time_on_page",
      data: {
        page: slug,
        duration_seconds: Math.round(timeSpent / 1000),
      },
    })
  }
  console.log(`Analytics: Time on page tracked - ${Math.round(timeSpent / 1000)}s`)
}

export const trackBlogEngagement = (slug: string, action: "scroll" | "like" | "share") => {
  if (typeof window !== "undefined") {
    window.va?.("event", {
      name: "blog_engagement",
      data: {
        slug: slug,
        action: action,
      },
    })
  }
  console.log(`Analytics: Blog engagement tracked - ${action}`)
}
