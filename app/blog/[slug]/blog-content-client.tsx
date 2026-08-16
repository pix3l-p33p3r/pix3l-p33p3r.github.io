"use client"

import type { ReactNode } from "react"
import Mermaid from "@/components/mermaid"
import Graphviz from "@/components/graphviz"

interface BlogContentClientProps {
  content: ReactNode
}

export default function BlogContentClient({ content }: BlogContentClientProps) {
  return <div className="mt-4">{content}</div>
}

export { Mermaid, Graphviz }
