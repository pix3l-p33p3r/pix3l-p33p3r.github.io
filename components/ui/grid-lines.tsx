"use client"

import { useEffect, useRef } from "react"

export default function GridLines() {
  const gridLinesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridLinesRef.current) return

    const gridLines = gridLinesRef.current

    for (let i = 1; i < 10; i++) {
      const hLine = document.createElement("div")
      hLine.className = "absolute h-px w-full bg-[rgba(50,50,50,0.5)]"
      hLine.style.top = `${i * 10}%`
      gridLines.appendChild(hLine)

      const vLine = document.createElement("div")
      vLine.className = "absolute w-px h-full bg-[rgba(50,50,50,0.5)]"
      vLine.style.left = `${i * 10}%`
      gridLines.appendChild(vLine)
    }

    return () => {
      while (gridLines.firstChild) {
        gridLines.removeChild(gridLines.firstChild)
      }
    }
  }, [])

  return <div ref={gridLinesRef} className="absolute inset-0 pointer-events-none z-[1]" aria-hidden="true"></div>
}
