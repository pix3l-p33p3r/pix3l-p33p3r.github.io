import type { ReactNode } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PageChrome({ children }: { children: ReactNode }) {
  return (
    <div className="page-shell">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
