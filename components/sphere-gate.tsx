"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { SphereBoundary } from "@/components/sphere-boundary"

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

function SphereStill({ live }: { live: boolean }) {
  return (
    <svg className={live ? "sphere-still is-live" : "sphere-still"} viewBox="0 0 384 384" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g fill="none" stroke="#ff4800">
        <circle cx="192" cy="192" r="150" strokeOpacity="0.45" strokeWidth="3" />
        <circle cx="192" cy="192" r="120" strokeOpacity="0.35" strokeWidth="2" />
        <circle cx="192" cy="192" r="90" strokeOpacity="0.25" />
        <path d="M42 192h300M192 42v300" strokeOpacity="0.7" strokeWidth="2" />
      </g>
      <g fill="none" stroke="#00ffff" strokeOpacity="0.9">
        <ellipse cx="192" cy="192" rx="72" ry="72" />
        <ellipse cx="192" cy="192" rx="72" ry="24" />
        <ellipse cx="192" cy="192" rx="72" ry="48" />
        <ellipse cx="192" cy="192" rx="24" ry="72" />
        <ellipse cx="192" cy="192" rx="48" ry="72" />
        <ellipse cx="192" cy="192" rx="72" ry="12" transform="rotate(-24 192 192)" />
        <ellipse cx="192" cy="192" rx="72" ry="36" transform="rotate(32 192 192)" />
        <ellipse cx="192" cy="192" rx="36" ry="72" transform="rotate(58 192 192)" />
      </g>
      <g fill="#ff4800">
        <circle cx="292" cy="122" r="7" />
        <circle cx="278" cy="236" r="7" />
      </g>
    </svg>
  )
}

export default function SphereGate() {
  const [live, setLive] = useState(false)
  const [painted, setPainted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [halted, setHalted] = useState(false)
  const mountId = useRef(0)

  useEffect(() => {
    const onFrame = () => setPainted(true)
    const onFailed = () => {
      setFailed(true)
      setPainted(false)
    }
    window.addEventListener("pixel-sphere-frame", onFrame)
    window.addEventListener("pixel-sphere-failed", onFailed)
    return () => {
      window.removeEventListener("pixel-sphere-frame", onFrame)
      window.removeEventListener("pixel-sphere-failed", onFailed)
    }
  }, [])

  useEffect(() => {
    const host = document.getElementById("sphere-container")
    if (!host) return
    const id = ++mountId.current
    let cancelIdle = () => {}
    let alive = true
    let armed = false
    const arm = () => {
      if (!alive || armed || id !== mountId.current) return
      armed = true
      cancelIdle = scheduleIdle(() => {
        if (!alive || id !== mountId.current) return
        setLive(true)
      })
    }
    if (typeof IntersectionObserver === "undefined") {
      arm()
      return () => {
        alive = false
        cancelIdle()
      }
    }
    const observer = new IntersectionObserver((entries) => {
      if (!alive) return
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect()
        arm()
      }
    })
    observer.observe(host)
    return () => {
      alive = false
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
        <SphereStill live={painted && !failed} />
        <SphereBoundary
          onError={() => {
            setFailed(true)
            setPainted(false)
          }}
        >
          {live && !failed ? <SphereVisualization /> : null}
        </SphereBoundary>
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
