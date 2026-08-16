import Link from "next/link"
import PageChrome from "@/components/page-chrome"
import { NotFoundAnalytics } from "./not-found-analytics"

export default function NotFound() {
  return (
    <PageChrome>
      <main id="main-content" tabIndex={-1} className="border border-[#333] bg-[rgba(20,20,20,0.7)] p-4 md:p-6">
        <NotFoundAnalytics />
        <div className="max-w-3xl mx-auto bg-black/60 border border-[#333] p-5">
          <h1 className="text-3xl text-[#ff4800] tracking-wider mb-2">404</h1>
          <p className="text-white/80 mb-1">No such path.</p>
          <p className="text-white/70 text-sm mb-4">psh: cd: no such file or directory</p>
          <Link href="/" className="text-[#00ffff] underline">
            Back Home
          </Link>
        </div>
      </main>
    </PageChrome>
  )
}
