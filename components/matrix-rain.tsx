"use client"

import { useEffect, useRef } from "react"

export default function MatrixRain({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let frame = 0
    let columns = 0
    let drops: number[] = []
    const glyphs = "01PEEP42ΛЖ$#*+"

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      columns = Math.floor(canvas.width / 14)
      drops = Array.from({ length: columns }, () => Math.random() * canvas.height)
    }

    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      frame = requestAnimationFrame(draw)
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#00ffff"
      ctx.font = "13px Share Tech Mono, monospace"
      drops.forEach((y, i) => {
        const ch = glyphs[Math.floor(Math.random() * glyphs.length)]
        ctx.fillText(ch, i * 14, y)
        drops[i] = y > canvas.height && Math.random() > 0.975 ? 0 : y + 14
      })
    }

    draw()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[45] pointer-events-none opacity-40"
      aria-hidden="true"
    />
  )
}
