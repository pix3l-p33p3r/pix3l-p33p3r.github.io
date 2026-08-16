"use client"

import { useEffect } from "react"
import { detectGpu } from "@/lib/gpu"
import { trackGpuCapabilities } from "@/lib/analytics"

export default function Telemetry() {
  useEffect(() => {
    const gpu = detectGpu()
    trackGpuCapabilities({
      backend: gpu.backend,
      webgpu: gpu.webgpu,
      webgl2: gpu.webgl2,
      webgl: gpu.webgl,
    })
  }, [])

  return null
}
