"use client"

import { useEffect, useId, useRef, type ReactNode } from "react"
import mermaid from "mermaid"
import { diagramSource } from "@/lib/diagram-source"

let mermaidInitialized = false

type MermaidProps = {
  chart?: string
  children?: ReactNode
}

export default function Mermaid({ chart, children }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, "")
  const uniqueId = `mermaid${reactId || "0"}`
  const source = diagramSource(chart, children)

  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "strict",
        themeVariables: {
          primaryColor: "#1a0a00",
          primaryTextColor: "#00ffff",
          primaryBorderColor: "#ff4800",
          lineColor: "#00ffff",
          secondaryColor: "#111",
          tertiaryColor: "#000",
          background: "#000",
        },
      })
      mermaidInitialized = true
    }

    const root = containerRef.current
    if (!root) return

    if (!source) {
      root.replaceChildren()
      const pre = document.createElement("pre")
      pre.style.whiteSpace = "pre-wrap"
      pre.style.color = "#f00"
      pre.textContent = "Mermaid render error.\nNo diagram source (chart prop and children were empty)."
      root.appendChild(pre)
      return
    }

    let isCancelled = false
    ;(async () => {
      try {
        const { svg } = await mermaid.render(uniqueId, source)
        if (isCancelled || !containerRef.current) return
        containerRef.current.replaceChildren()
        const wrapper = document.createElement("div")
        wrapper.innerHTML = svg
        const svgEl = wrapper.querySelector("svg")
        if (svgEl) {
          svgEl.setAttribute("width", "100%")
          svgEl.setAttribute("height", "auto")
          svgEl.style.maxWidth = "100%"
          svgEl.style.display = "block"
          containerRef.current.appendChild(svgEl)
        }
      } catch (error) {
        if (!containerRef.current) return
        containerRef.current.replaceChildren()
        const pre = document.createElement("pre")
        pre.style.whiteSpace = "pre-wrap"
        pre.style.color = "#f00"
        pre.textContent = `Mermaid render error.\n${String(error)}`
        containerRef.current.appendChild(pre)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [source, uniqueId])

  return <div ref={containerRef} className="overflow-x-auto my-4 border border-[#333] bg-black/40 p-3" />
}
