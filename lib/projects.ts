export type Project = {
  slug: string
  title: string
  summary: string
  tags: string[]
  repoUrl: string
  ogImage?: string
}

export const projects: Project[] = [
  {
    slug: "virtualization",
    title: "Virtualization",
    summary:
      "Containerization and VM management tools with focus on performance optimization and security hardening.",
    tags: ["Docker", "KVM", "Linux", "Shell"],
    repoUrl: "https://github.com/pix3l-p33p3r?tab=repositories",
    ogImage: "/placeholder.jpg",
  },
  {
    slug: "hardware",
    title: "Hardware",
    summary: "Custom hardware projects and firmware",
    tags: ["Arduino", "ESP32"],
    repoUrl: "https://github.com/pix3l-p33p3r?tab=repositories",
    ogImage: "/placeholder.jpg",
  },
  {
    slug: "low-level-oop",
    title: "Low-Level/OOP",
    summary: "Systems programming and object-oriented design",
    tags: ["C/C++", "Assembly"],
    repoUrl: "https://github.com/pix3l-p33p3r?tab=repositories",
    ogImage: "/placeholder.jpg",
  },
  {
    slug: "graphics-in-c",
    title: "Graphics in C",
    summary: "Low-level graphics programming",
    tags: ["C", "RayTracing"],
    repoUrl: "https://github.com/pix3l-p33p3r?tab=repositories",
    ogImage: "/placeholder.jpg",
  },
  {
    slug: "devsecops-pipeline",
    title: "DevSecOps Pipeline",
    summary: "Secure CI/CD implementation",
    tags: ["Jenkins", "GitLab CI"],
    repoUrl: "https://github.com/pix3l-p33p3r?tab=repositories",
    ogImage: "/placeholder.jpg",
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
