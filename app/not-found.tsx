import Link from "next/link"
import { NotFoundAnalytics } from "./not-found-analytics"

export default function NotFound() {
  return (
    <main className="p-4 md:p-6">
      <NotFoundAnalytics />
      <div className="max-w-3xl mx-auto bg-black/60 border border-[#333] p-5">
        <h1 className="text-3xl text-[#ff4800] tracking-wider mb-2">404</h1>
        <p className="text-white/80 mb-4">No such path.</p>
        <Link href="/" className="text-[#00ffff] underline">
          Back Home
        </Link>
      </div>
    </main>
  )
}
