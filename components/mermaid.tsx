"use client"
import { useEffect, useMemo, useRef } from "react"
import mermaid from "mermaid"

let mermaidInitialized = false

export default function Mermaid({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const uniqueId = useMemo(() => `mermaid-${Math.random().toString(36).slice(2)}`,[ ])

  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({ startOnLoad: false, theme: "dark", securityLevel: "loose" as any })
      mermaidInitialized = true
    }

    let isCancelled = false
    ;(async () => {
      try {
        const { svg } = await mermaid.render(uniqueId, chart)
        if (isCancelled) return
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
          const svgEl = containerRef.current.querySelector('svg') as SVGElement | null
          if (svgEl) {
            svgEl.setAttribute('width', '100%')
            svgEl.setAttribute('height', 'auto')
            svgEl.style.maxWidth = '100%'
            svgEl.style.display = 'block'
          }
        }
      } catch (e) {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<pre style="white-space:pre-wrap;color:#f00;">Mermaid render error.\n${String(e)}</pre>`
        }
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [chart, uniqueId])

  return <div ref={containerRef} className="overflow-x-auto" />
}


