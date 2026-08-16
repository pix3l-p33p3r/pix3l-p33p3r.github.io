import type { ReactNode } from "react"
import Footer from "@/components/footer"
import Header from "@/components/header"

export default function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen p-2.5 flex flex-col gap-2.5">
      <Header />
      <div className="flex-1 border border-[#333] bg-[rgba(20,20,20,0.7)] shadow-inner shadow-black/50 relative overflow-hidden">
        {children}
      </div>
      <Footer />
    </div>
  )
}
