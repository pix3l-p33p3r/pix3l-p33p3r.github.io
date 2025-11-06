import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypePrettyCode from "rehype-pretty-code"
import BlogContentClient, { Mermaid, Graphviz } from "./blog-content-client"
import { BlogPostAnalytics } from "./blog-post-analytics"
import { getAllPosts, getPostSource } from "@/lib/blog"

type PageProps = { params: { slug: string } }

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { meta } = await getPostSource(params.slug)
    if (!meta) return {}
    const title = `${meta.title} — pix3l_p33p3r`
    const base = "https://www.pixel-peeper.me"
    const url = `${base}/blog/${meta.slug}`
    const image = meta.ogImage ?? "/placeholder.jpg"
    return {
      title,
      description: meta.summary ?? undefined,
      alternates: { canonical: url },
      openGraph: {
        title,
        description: meta.summary ?? undefined,
        url,
        images: [{ url: image, width: 1200, height: 630 }],
      },
      twitter: { card: "summary_large_image", title, description: meta.summary ?? undefined, images: [image] },
    }
  } catch {
    return {}
  }
}

export default async function BlogPost({ params }: PageProps) {
  try {
    const { source, meta } = await getPostSource(params.slug)

    const { content } = await compileMDX({
      source,
      components: { Mermaid, Graphviz },
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [rehypeKatex, [rehypePrettyCode, { theme: "one-dark-pro" }]],
        },
      },
    })

    if (!content) notFound()

    return (
      <main className="p-4 md:p-6">
        <BlogPostAnalytics slug={params.slug} title={meta.title} />

        <article className="w-full max-w-full md:max-w-3xl mx-auto bg-black/60 border border-[#333] p-4 md:p-5 blog-content">
          <h1 className="text-3xl md:text-4xl text-[#ff4800] tracking-wider mb-2">{meta.title}</h1>
          {meta.date ? <p className="text-white/50 text-sm">{new Date(meta.date).toDateString()}</p> : null}
          <BlogContentClient content={content} />
        </article>
      </main>
    )
  } catch {
    notFound()
  }
}
