import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypePrettyCode from "rehype-pretty-code"
import MathStyles from "@/components/math-styles"
import Mermaid from "@/components/mermaid"
import PageChrome from "@/components/page-chrome"
import { BlogPostAnalytics } from "./blog-post-analytics"
import { getAllPosts, getPostSource } from "@/lib/blog"
import { resolveOgImage, SITE_NAME, SITE_URL } from "@/lib/site"

type HastNode = {
  type?: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

function rehypeLazyImages() {
  return (tree: HastNode) => {
    const walk = (node: HastNode) => {
      if (node.type === "element" && node.tagName === "img") {
        node.properties = node.properties ?? {}
        if (!node.properties.loading) node.properties.loading = "lazy"
        if (!node.properties.decoding) node.properties.decoding = "async"
      }
      node.children?.forEach(walk)
    }
    walk(tree)
  }
}

function postUsesMath(source: string, tags: string[] | undefined): boolean {
  if (tags?.some((tag) => tag.toLowerCase() === "math")) return true
  return /\$\$[\s\S]+?\$\$|\$[^$\n]+\$/.test(source)
}

type PageProps = { params: { slug: string } }

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { meta } = await getPostSource(params.slug)
    if (!meta) return {}
    const title = `${meta.title} — ${SITE_NAME}`
    const url = `${SITE_URL}/blog/${meta.slug}`
    const image = resolveOgImage(meta.ogImage)
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
      components: { Mermaid, h1: () => null },
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [rehypeKatex, rehypeLazyImages, [rehypePrettyCode, { theme: "one-dark-pro" }]],
        },
      },
    })

    if (!content) notFound()

    return (
      <PageChrome>
        <main id="main-content" tabIndex={-1} className="border border-[#333] bg-[rgba(20,20,20,0.7)] p-4 md:p-6 overflow-auto">
          {postUsesMath(source, meta.tags) ? <MathStyles /> : null}
          <BlogPostAnalytics slug={params.slug} title={meta.title} />

          <article className="w-full max-w-full md:max-w-3xl mx-auto bg-black/60 border border-[#333] p-4 md:p-5 blog-content">
            <h1 className="text-3xl md:text-4xl text-[#ff4800] tracking-wider mb-2">{meta.title}</h1>
            {meta.date ? <p className="text-white/50 text-sm">{new Date(meta.date).toDateString()}</p> : null}
            <div className="mt-4 [&_h1:first-of-type]:hidden">{content}</div>
          </article>
        </main>
      </PageChrome>
    )
  } catch {
    notFound()
  }
}
