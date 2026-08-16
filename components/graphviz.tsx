"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { graphviz } from "d3-graphviz"
import "@hpcc-js/wasm"
import { diagramSource } from "@/lib/diagram-source"

type GraphvizProps = {
  dot?: string
  children?: ReactNode
}

export default function Graphviz({ dot, children }: GraphvizProps) {
  const ref = useRef<HTMLDivElement>(null)
  const source = diagramSource(dot, children)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    if (!source) {
      root.replaceChildren()
      const pre = document.createElement("pre")
      pre.style.whiteSpace = "pre-wrap"
      pre.style.color = "#f00"
      pre.textContent = "Graphviz render error.\nNo DOT source (dot prop and children were empty)."
      root.appendChild(pre)
      return
    }

    root.replaceChildren()
    const g = graphviz(root)
    g.renderDot(source).on("end", () => {
      const svgEl = ref.current?.querySelector("svg")
      if (!svgEl) return
      svgEl.setAttribute("width", "100%")
      svgEl.setAttribute("height", "auto")
      svgEl.style.maxWidth = "100%"
      svgEl.style.display = "block"
    })
  }, [source])

  return <div ref={ref} className="overflow-x-auto my-4 border border-[#333] bg-black/40 p-3 min-h-[8rem]" />
}
