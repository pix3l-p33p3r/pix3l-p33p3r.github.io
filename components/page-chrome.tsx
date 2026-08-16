import type { ReactNode } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PageChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col p-2.5 gap-2.5">
      <Header />
      <div className="flex-1 min-h-0">{children}</div>
      <Footer />
    </div>
  )
}
