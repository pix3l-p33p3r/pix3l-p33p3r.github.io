import Link from "next/link"
import PageChrome from "@/components/page-chrome"
import { getAllPosts } from "@/lib/blog"

export const metadata = {
  title: "Blog | pix3l_p33p3r",
  description: "Technical articles and insights",
}

export default async function BlogIndex() {
  const posts = await getAllPosts()

  return (
    <PageChrome>
      <main id="main-content" tabIndex={-1} className="border border-[#333] bg-[rgba(20,20,20,0.7)] p-4 md:p-6 overflow-auto">
        <h1 className="text-3xl text-[#ff4800] mb-4 tracking-wider">Blog</h1>
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.slug} className="border border-[#333] p-4 bg-black/60">
              <Link href={`/blog/${p.slug}`} className="text-[#00ffff] text-xl underline">
                {p.title}
              </Link>
              {p.summary ? <p className="text-white/80 mt-1">{p.summary}</p> : null}
              {p.date ? <p className="text-white/50 text-sm mt-1">{new Date(p.date).toDateString()}</p> : null}
            </li>
          ))}
        </ul>
      </main>
    </PageChrome>
  )
}
