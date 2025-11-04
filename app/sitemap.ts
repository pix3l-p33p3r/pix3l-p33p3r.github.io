import type { MetadataRoute } from "next"
import { projects } from "@/lib/projects"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pix3l-p33p3r.github.io"

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ]

  for (const p of projects) {
    entries.push({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  }

  return entries
}


