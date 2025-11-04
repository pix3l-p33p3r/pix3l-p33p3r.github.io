import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypePrettyCode from "rehype-pretty-code"
import dynamic from "next/dynamic"
const Mermaid = dynamic(() => import("@/components/mermaid"), { ssr: false })
const Graphviz = dynamic(() => import("@/components/graphviz"), { ssr: false })
import { getAllPosts, getPostSource } from "@/lib/blog"

type PageProps = { params: { slug: string } }

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getAllPosts().find((p) => p.slug === params.slug)
  if (!post) return {}
  const title = `${post.title} — pix3l_p33p3r`
  const base = "https://www.pixel-peeper.me"
  const url = `${base}/blog/${post.slug}`
  const image = post.ogImage ?? "/placeholder.jpg"
  return {
    title,
    description: post.summary ?? undefined,
    alternates: { canonical: url },
    openGraph: { title, description: post.summary ?? undefined, url, images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description: post.summary ?? undefined, images: [image] },
  }
}

export default async function BlogPost({ params }: PageProps) {
  const { source, meta } = getPostSource(params.slug)

  const { content } = await compileMDX({
    source,
    components: { Mermaid, Graphviz },
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          rehypeKatex,
          [rehypePrettyCode, { theme: "one-dark-pro" }],
        ],
      },
    },
  })

  if (!content) notFound()

  return (
    <main className="p-4 md:p-6">
      <article className="w-full max-w-full md:max-w-3xl mx-auto bg-black/60 border border-[#333] p-4 md:p-5 blog-content">
        <h1 className="text-3xl md:text-4xl text-[#ff4800] tracking-wider mb-2">{meta.title}</h1>
        {meta.date ? <p className="text-white/50 text-sm">{new Date(meta.date).toDateString()}</p> : null}
        <div className="mt-4">
          {content}
        </div>
      </article>
    </main>
  )
}


