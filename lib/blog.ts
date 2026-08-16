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

/** gray-matter/js-yaml turns unquoted `date: YYYY-MM-DD` into a Date. Normalize to ISO. */
function toIsoDate(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString()
  }
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString()
  }
  return null
}

export async function getAllPosts(): Promise<PostMeta[]> {
  if (!fs.existsSync(BLOG_DIR)) return []
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
  return files
    .map((filename) => {
      const slug = filename.replace(/\.(md|mdx)$/, "")
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8")
      const { data } = matter(raw)
      const frontmatter = data as Partial<PostMeta>
      return {
        slug,
        title: frontmatter.title ?? slug,
        date: toIsoDate(frontmatter.date),
        summary: frontmatter.summary ?? "",
        tags: frontmatter.tags ?? [],
        ogImage: frontmatter.ogImage ?? null,
      } satisfies PostMeta
    })
    .sort((a, b) => (a.date && b.date ? +new Date(b.date) - +new Date(a.date) : 0))
}

export async function getPostSource(slug: string): Promise<{ source: string; meta: PostMeta }> {
  const mdFile = path.join(BLOG_DIR, `${slug}.md`)
  const mdxFile = path.join(BLOG_DIR, `${slug}.mdx`)
  const filePath = fs.existsSync(mdxFile) ? mdxFile : mdFile
  if (!fs.existsSync(filePath)) {
    throw new Error(`Post not found: ${slug}`)
  }
  const raw = fs.readFileSync(filePath, "utf8")
  const { content, data } = matter(raw)
  const frontmatter = data as Partial<PostMeta>
  return {
    source: content,
    meta: {
      slug,
      title: frontmatter.title ?? slug,
      date: toIsoDate(frontmatter.date),
      summary: frontmatter.summary ?? "",
      tags: frontmatter.tags ?? [],
      ogImage: frontmatter.ogImage ?? null,
    },
  }
}
