"use client"

import dynamic from "next/dynamic"

const KatexCss = dynamic(() => import("@/components/katex-css"), { ssr: false })

export default function MathStyles() {
  return <KatexCss />
}
