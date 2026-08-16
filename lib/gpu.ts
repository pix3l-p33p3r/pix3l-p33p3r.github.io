export type GpuBackend = "webgpu" | "webgl2" | "webgl" | "none"

export type GpuDetection = {
  webgpu: boolean
  webgl2: boolean
  webgl: boolean
  backend: GpuBackend
}

type GpuApi = {
  requestAdapter: () => Promise<unknown>
}

const ADAPTER_TIMEOUT_MS = 1500

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timed out")), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

function navigatorGpu(): GpuApi | null {
  if (typeof navigator === "undefined") return null
  const gpu = (navigator as Navigator & { gpu?: GpuApi }).gpu
  return gpu ?? null
}

export function detectWebgl(): { webgl2: boolean; webgl: boolean } {
  if (typeof document === "undefined") {
    return { webgl2: false, webgl: false }
  }

  const canvas = document.createElement("canvas")
  const webgl2 = Boolean(canvas.getContext("webgl2"))
  const webgl = webgl2 || Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
  canvas.remove()
  return { webgl2, webgl }
}

/** True only when requestAdapter() returns an adapter before the timeout. */
export async function requestWebGpuAdapter(timeoutMs = ADAPTER_TIMEOUT_MS): Promise<boolean> {
  const gpu = navigatorGpu()
  if (!gpu) return false
  try {
    const adapter = await withTimeout(gpu.requestAdapter(), timeoutMs)
    return Boolean(adapter)
  } catch {
    return false
  }
}

export async function detectGpu(): Promise<GpuDetection> {
  if (typeof window === "undefined") {
    return { webgpu: false, webgl2: false, webgl: false, backend: "none" }
  }

  const { webgl2, webgl } = detectWebgl()
  const webgpu = await requestWebGpuAdapter()
  const backend: GpuBackend = webgl2 ? "webgl2" : webgl ? "webgl" : webgpu ? "webgpu" : "none"
  return { webgpu, webgl2, webgl, backend }
}
