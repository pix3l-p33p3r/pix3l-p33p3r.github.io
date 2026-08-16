import type { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/blog"
import { projects } from "@/lib/projects"
import { SITE_URL } from "@/lib/site"

function lastmod(value?: string | null): Date {
  if (value) {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }
  return new Date()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = lastmod()
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  for (const p of projects) {
    entries.push({
      url: `${SITE_URL}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  }

  try {
    const posts = await getAllPosts()
    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: lastmod(post.date),
        changeFrequency: "monthly",
        priority: 0.6,
      })
    }
  } catch {
    // Keep the static routes even if a post file cannot be read.
  }

  return entries
}
