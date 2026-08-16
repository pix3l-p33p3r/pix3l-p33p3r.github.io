"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { useMobile } from "@/hooks/use-mobile"
import { requestWebGpuAdapter, withTimeout } from "@/lib/gpu"

type RenderBackend = {
  setSize: (width: number, height: number) => void
  render: (scene: THREE.Scene, camera: THREE.Camera) => void
  dispose: () => void
  domElement: HTMLCanvasElement
}

const WEBGPU_INIT_MS = 2000

function createWebGLRenderer(): RenderBackend {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    failIfMajorPerformanceCaveat: false,
  })
  renderer.setClearColor(0x000000, 0)
  return renderer
}

async function createWebGPURenderer(): Promise<RenderBackend> {
  const { WebGPURenderer } = await import("three/webgpu")
  const renderer = new WebGPURenderer({ antialias: true, alpha: true })
  await withTimeout(Promise.resolve(renderer.init()), WEBGPU_INIT_MS)
  renderer.setClearColor(0x000000, 0)
  return renderer
}

async function createRenderer(): Promise<RenderBackend> {
  try {
    return createWebGLRenderer()
  } catch {
    const hasAdapter = await requestWebGpuAdapter()
    if (!hasAdapter) {
      throw new Error("WebGL failed and no WebGPU adapter")
    }
    return createWebGPURenderer()
  }
}

export default function SphereVisualization() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false
    let frameId = 0
    let renderer: RenderBackend | null = null
    let handleResize: (() => void) | null = null
    let handleMotion: (() => void) | null = null
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const disposables: Array<{ dispose: () => void }> = []

    const start = async () => {
      let nextRenderer: RenderBackend
      try {
        nextRenderer = await createRenderer()
      } catch {
        return
      }
      if (cancelled) {
        nextRenderer.dispose()
        return
      }
      renderer = nextRenderer
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.domElement.style.position = "absolute"
      renderer.domElement.style.inset = "0"
      container.appendChild(renderer.domElement)
      setReady(true)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
      camera.position.z = isMobile ? 7 : 5

      const ambientLight = new THREE.AmbientLight(0x222222)
      scene.add(ambientLight)
      const directionalLight = new THREE.DirectionalLight(0xff4800, 0.8)
      directionalLight.position.set(1, 1, 1)
      scene.add(directionalLight)
      const blueLight = new THREE.PointLight(0x00ffff, 0.5)
      blueLight.position.set(-2, 1, 3)
      scene.add(blueLight)

      const geometry = new THREE.SphereGeometry(2, 32, 32)
      const wireframe = new THREE.WireframeGeometry(geometry)
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.4 })
      const wireframeMesh = new THREE.LineSegments(wireframe, lineMaterial)
      const innerMaterial = new THREE.MeshPhongMaterial({
        color: 0x0077ff,
        emissive: 0x001133,
        transparent: true,
        opacity: 0.2,
        shininess: 100,
      })
      const sphere = new THREE.Mesh(geometry, innerMaterial)
      sphere.scale.set(0.95, 0.95, 0.95)

      const particleGeometry = new THREE.BufferGeometry()
      const particleCount = 100
      const positions = new Float32Array(particleCount * 3)
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 5
        positions[i + 1] = (Math.random() - 0.5) * 5
        positions[i + 2] = (Math.random() - 0.5) * 5
      }
      particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      const particleMaterial = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.05, transparent: true })
      const particles = new THREE.Points(particleGeometry, particleMaterial)

      const sphereGroup = new THREE.Group()
      sphereGroup.add(wireframeMesh)
      sphereGroup.add(sphere)
      sphereGroup.add(particles)
      scene.add(sphereGroup)

      disposables.push(geometry, wireframe, lineMaterial, innerMaterial, particleGeometry, particleMaterial)

      const tick = () => {
        sphereGroup.rotation.x += 0.002
        sphereGroup.rotation.y += 0.004
        const pulseScale = 0.95 + 0.03 * Math.sin(Date.now() * 0.001)
        sphere.scale.set(pulseScale, pulseScale, pulseScale)
        if (Math.random() > 0.98) {
          lineMaterial.opacity = 0.1 + Math.random() * 0.5
        }
        renderer?.render(scene, camera)
      }

      const animate = () => {
        if (motionQuery.matches) {
          renderer?.render(scene, camera)
          return
        }
        frameId = requestAnimationFrame(animate)
        tick()
      }

      handleMotion = () => {
        cancelAnimationFrame(frameId)
        if (motionQuery.matches) {
          renderer?.render(scene, camera)
          return
        }
        animate()
      }
      motionQuery.addEventListener("change", handleMotion)
      animate()

      handleResize = () => {
        const newWidth = container.clientWidth
        const newHeight = container.clientHeight
        camera.aspect = newWidth / newHeight
        camera.updateProjectionMatrix()
        renderer?.setSize(newWidth, newHeight)
        camera.position.z = window.innerWidth < 768 ? 7 : 5
      }
      window.addEventListener("resize", handleResize)
    }

    void start()

    return () => {
      cancelled = true
      cancelAnimationFrame(frameId)
      if (handleResize) window.removeEventListener("resize", handleResize)
      if (handleMotion) motionQuery.removeEventListener("change", handleMotion)
      if (renderer?.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
      disposables.forEach((item) => item.dispose())
      renderer?.dispose()
    }
  }, [isMobile])

  return (
    <div id="sphere-container" ref={containerRef} className="absolute inset-0 w-full h-full" aria-hidden="true">
      {ready ? null : (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-[min(58%,20rem)] w-[min(58%,20rem)]">
            <div className="absolute inset-0 rounded-full border border-[#00ffff]/40" />
            <div className="absolute inset-[12%] rounded-full border border-[#00ffff]/25" />
            <div className="absolute inset-[24%] rounded-full border border-[#00ffff]/15" />
          </div>
        </div>
      )}
    </div>
  )
}
