"use client"
import { useEffect, useRef } from "react"
import { graphviz } from "d3-graphviz"
import "@hpcc-js/wasm"

export default function Graphviz({ dot }: { dot: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const g = graphviz(ref.current)
    g.renderDot(dot).on("end", () => {
      const svgEl = ref.current?.querySelector("svg")
      if (!svgEl) return
      svgEl.setAttribute("width", "100%")
      svgEl.setAttribute("height", "auto")
      svgEl.style.maxWidth = "100%"
      svgEl.style.display = "block"
    })
  }, [dot])
  return <div ref={ref} className="overflow-x-auto" />
}
