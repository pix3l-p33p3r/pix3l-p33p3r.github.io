"use client"

import dynamic from "next/dynamic"
import type { ReactNode } from "react"

const Mermaid = dynamic(() => import("@/components/mermaid"), { ssr: false })
const Graphviz = dynamic(() => import("@/components/graphviz"), { ssr: false })

interface BlogContentClientProps {
  content: ReactNode
}

export default function BlogContentClient({ content }: BlogContentClientProps) {
  return <div className="mt-4">{content}</div>
}

export { Mermaid, Graphviz }
