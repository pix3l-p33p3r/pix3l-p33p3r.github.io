"use client"

import { useState, useEffect } from "react"

export default function DataOverlay() {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString()
      setCurrentTime(`Current Time: ${timeString}`)
    }

    updateTime() // Initial call
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      id="current-time"
      className="absolute bottom-2.5 left-2.5 text-[#00ffff] text-xl z-10 animate-glitch-text bg-black/50 py-1.5 px-2.5 rounded border-l-2 border-[#00ffff]"
      aria-live="polite"
    >
      {currentTime}
    </div>
  )
}
