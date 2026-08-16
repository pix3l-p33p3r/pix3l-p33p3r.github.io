export type GpuBackend = "webgpu" | "webgl2" | "webgl" | "none"

export function detectGpu(): { webgpu: boolean; webgl2: boolean; webgl: boolean; backend: GpuBackend } {
  if (typeof window === "undefined") {
    return { webgpu: false, webgl2: false, webgl: false, backend: "none" }
  }

  const canvas = document.createElement("canvas")
  const webgl2 = Boolean(canvas.getContext("webgl2"))
  const webgl = webgl2 || Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
  canvas.remove()

  const backend: GpuBackend = webgl2 ? "webgl2" : webgl ? "webgl" : "none"
  return { webgpu: false, webgl2, webgl, backend }
}
