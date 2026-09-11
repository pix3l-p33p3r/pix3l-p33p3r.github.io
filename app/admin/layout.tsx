import type { ReactNode } from "react"
import Link from "next/link"
import BrandMark from "@/components/brand-mark"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  title: "Admin analytics",
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col p-2.5 gap-2.5">
      <header className="flex items-center justify-between border border-[#333] p-2.5 px-5 bg-[rgba(20,20,20,0.7)]">
        <div className="flex items-center gap-2.5 text-[#ff4800] font-bold text-lg">
          <BrandMark className="w-8 h-8 shrink-0 border border-[#333]" />
          <span>pix3l_p33p3r</span>
          <span className="text-[#00ffff]/70 font-normal text-sm tracking-widest">/ admin</span>
        </div>
        <Link href="/" className="text-[#00ffff] text-sm hover:underline">
          Public site
        </Link>
      </header>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  )
}
