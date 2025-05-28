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

  return null
}
