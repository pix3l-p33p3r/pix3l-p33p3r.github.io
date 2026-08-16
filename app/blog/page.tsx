import Link from "next/link"
import SiteFrame from "@/components/site-frame"
import { getAllPosts } from "@/lib/blog"

export const metadata = {
  title: "Blog | pix3l_p33p3r",
  description: "Technical articles and insights",
}

export default async function BlogIndex() {
  const posts = await getAllPosts()

  return (
    <SiteFrame>
      <main id="main-content" className="p-4 md:p-6">
        <p className="m-0 font-mono text-[10px] tracking-[0.28em] text-[#00ffff]/70">/var/log/blog</p>
        <h1 className="text-3xl text-[#ff4800] mb-2 mt-1 tracking-wider">Blog</h1>
        <p className="text-white/50 text-sm mb-6">Notes from the guest tty. Diagrams included.</p>
        <ul className="space-y-3 list-none p-0 m-0">
          {posts.map((p) => (
            <li key={p.slug} className="border border-[#333] p-4 bg-black/60 hover:border-[#00ffff]/40 transition-colors">
              <Link href={`/blog/${p.slug}`} className="text-[#00ffff] text-xl underline">
                {p.title}
              </Link>
              {p.summary ? <p className="text-white/80 mt-1 mb-0">{p.summary}</p> : null}
              {p.date ? <p className="text-white/50 text-sm mt-1 mb-0">{new Date(p.date).toDateString()}</p> : null}
            </li>
          ))}
        </ul>
      </main>
    </SiteFrame>
  )
}
