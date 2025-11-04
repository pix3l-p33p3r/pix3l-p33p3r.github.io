import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

export type PostMeta = {
  slug: string
  title: string
  date?: string | null
  summary?: string
  tags?: string[]
  ogImage?: string | null
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
  return files
    .map((filename) => {
      const slug = filename.replace(/\.(md|mdx)$/, "")
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8")
      const { data } = matter(raw)
      return {
        slug,
        title: (data as any).title ?? slug,
        date: (data as any).date ?? null,
        summary: (data as any).summary ?? "",
        tags: (data as any).tags ?? [],
        ogImage: (data as any).ogImage ?? null,
      } satisfies PostMeta
    })
    .sort((a, b) => (a.date && b.date ? +new Date(b.date) - +new Date(a.date) : 0))
}

export function getPostSource(slug: string): { source: string; meta: PostMeta } {
  const mdFile = path.join(BLOG_DIR, `${slug}.md`)
  const mdxFile = path.join(BLOG_DIR, `${slug}.mdx`)
  const file = fs.existsSync(mdxFile) ? mdxFile : mdFile
  const raw = fs.readFileSync(file, "utf8")
  const { content, data } = matter(raw)
  return {
    source: content,
    meta: {
      slug,
      title: (data as any).title ?? slug,
      date: (data as any).date ?? null,
      summary: (data as any).summary ?? "",
      tags: (data as any).tags ?? [],
      ogImage: (data as any).ogImage ?? null,
    },
  }
}
