"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const SphereVisualization = dynamic(() => import("@/components/sphere-visualization"), {
  ssr: false,
})

type IdleWindow = Window & {
  scheduler?: {
    postTask: (callback: () => void, options?: { priority?: string; signal?: AbortSignal }) => Promise<unknown>
  }
}

function scheduleIdle(callback: () => void): () => void {
  const scheduler = (window as IdleWindow).scheduler
  if (scheduler && typeof scheduler.postTask === "function") {
    const controller = new AbortController()
    void scheduler.postTask(callback, { priority: "background", signal: controller.signal }).catch(() => {})
    return () => controller.abort()
  }
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: 1500 })
    return () => window.cancelIdleCallback(id)
  }
  const timer = globalThis.setTimeout(callback, 200)
  return () => globalThis.clearTimeout(timer)
}

function SphereFallback() {
  return (
    <svg className="sphere-fallback" viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="72" fill="none" stroke="#00ffff" strokeOpacity="0.85" strokeWidth="1.25" />
      <ellipse cx="100" cy="100" rx="72" ry="28" fill="none" stroke="#00ffff" strokeOpacity="0.55" />
      <ellipse cx="100" cy="100" rx="28" ry="72" fill="none" stroke="#00ffff" strokeOpacity="0.55" />
      <ellipse cx="100" cy="100" rx="72" ry="10" fill="none" stroke="#ff4800" strokeOpacity="0.7" />
      <circle cx="100" cy="100" r="3.5" fill="#ff4800" />
    </svg>
  )
}

export default function SphereGate() {
  const [live, setLive] = useState(false)
  const [halted, setHalted] = useState(false)

  useEffect(() => {
    const host = document.getElementById("sphere-container")
    if (!host) return
    let cancelIdle = () => {}
    let armed = false
    const arm = () => {
      if (armed) return
      armed = true
      cancelIdle = scheduleIdle(() => setLive(true))
    }
    if (typeof IntersectionObserver === "undefined") {
      arm()
      return () => cancelIdle()
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect()
        arm()
      }
    })
    observer.observe(host)
    return () => {
      observer.disconnect()
      cancelIdle()
    }
  }, [])

  const toggleHalt = () => {
    const root = document.documentElement
    const next = root.dataset.motion === "halt" ? "" : "halt"
    if (next) root.dataset.motion = next
    else delete root.dataset.motion
    setHalted(Boolean(next))
    window.dispatchEvent(new Event("pixel-motion"))
  }

  return (
    <>
      <div id="sphere-container" className="absolute inset-0">
        {live ? <SphereVisualization /> : <SphereFallback />}
      </div>
      <button
        type="button"
        className="sphere-halt"
        aria-label={halted ? "Play sphere" : "Pause sphere"}
        onClick={toggleHalt}
      >
        {halted ? ">" : "||"}
      </button>
    </>
  )
}
