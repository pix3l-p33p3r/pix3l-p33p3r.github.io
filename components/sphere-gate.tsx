"use client"

import dynamic from "next/dynamic"
import { useEffect, useState, useSyncExternalStore } from "react"

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

type MotionMode = "reduced" | "halt" | "run"

function motionMode(): MotionMode {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced"
  if (document.documentElement.dataset.motion === "halt") return "halt"
  return "run"
}

function subscribeMotion(onStoreChange: () => void): () => void {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)")
  query.addEventListener("change", onStoreChange)
  window.addEventListener("pixel-motion", onStoreChange)
  return () => {
    query.removeEventListener("change", onStoreChange)
    window.removeEventListener("pixel-motion", onStoreChange)
  }
}

function serverMotionMode(): MotionMode {
  return "run"
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
  const mode = useSyncExternalStore(subscribeMotion, motionMode, serverMotionMode)

  useEffect(() => {
    const root = document.documentElement
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const applyReduced = () => {
      if (!reducedQuery.matches || root.dataset.motion === "halt") return
      root.dataset.motion = "halt"
      window.dispatchEvent(new Event("pixel-motion"))
    }
    applyReduced()
    reducedQuery.addEventListener("change", applyReduced)
    return () => reducedQuery.removeEventListener("change", applyReduced)
  }, [])

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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (root.dataset.motion !== "halt") {
        root.dataset.motion = "halt"
        window.dispatchEvent(new Event("pixel-motion"))
      }
      return
    }
    if (root.dataset.motion === "halt") delete root.dataset.motion
    else root.dataset.motion = "halt"
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
        aria-label={mode === "run" ? "Pause sphere" : mode === "halt" ? "Play sphere" : "Sphere paused"}
        onClick={toggleHalt}
      >
        {mode === "run" ? "||" : ">"}
      </button>
    </>
  )
}
