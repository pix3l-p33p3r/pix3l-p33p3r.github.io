"use client"
import { useEffect, useMemo, useRef } from "react"
import mermaid from "mermaid"

let mermaidInitialized = false

export default function Mermaid({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const uniqueId = useMemo(() => `mermaid-${Math.random().toString(36).slice(2)}`, [])

  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({ startOnLoad: false, theme: "dark", securityLevel: "strict" })
      mermaidInitialized = true
    }

    let isCancelled = false
    ;(async () => {
      try {
        const { svg } = await mermaid.render(uniqueId, chart)
        if (isCancelled || !containerRef.current) return
        containerRef.current.replaceChildren()
        const wrapper = document.createElement("div")
        wrapper.innerHTML = svg
        const svgEl = wrapper.querySelector("svg")
        if (svgEl) {
          svgEl.setAttribute("width", "100%")
          svgEl.removeAttribute("height")
          svgEl.style.maxWidth = "100%"
          svgEl.style.height = "auto"
          svgEl.style.display = "block"
          containerRef.current.appendChild(svgEl)
        }
      } catch (e) {
        if (!containerRef.current) return
        containerRef.current.replaceChildren()
        const pre = document.createElement("pre")
        pre.style.whiteSpace = "pre-wrap"
        pre.style.color = "#f00"
        pre.textContent = `Mermaid render error.\n${String(e)}`
        containerRef.current.appendChild(pre)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [chart, uniqueId])

  return <div ref={containerRef} className="overflow-x-auto" />
}
