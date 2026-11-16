"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

const DPR_CAP = 2

function motionHalted(): boolean {
  if (document.documentElement.dataset.motion === "halt") return true
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function reportSphereFailure(error: unknown) {
  const failure = error instanceof Error ? error : new Error(String(error))
  console.error(failure)
  window.dispatchEvent(new CustomEvent("pixel-sphere-failed", { detail: failure }))
}

export default function SphereVisualization() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let disposed = false
    let frameId = 0
    let loopOn = false
    let announced = false
    let onScreen = true
    let tabVisible = document.visibilityState === "visible"
    let renderer: THREE.WebGLRenderer | null = null
    let geometry: THREE.SphereGeometry | null = null
    let wireframe: THREE.WireframeGeometry | null = null
    let lineMaterial: THREE.LineBasicMaterial | null = null
    let innerMaterial: THREE.MeshPhongMaterial | null = null
    let particleGeometry: THREE.BufferGeometry | null = null
    let particleMaterial: THREE.PointsMaterial | null = null
    let resizeObserver: ResizeObserver | null = null
    let intersection: IntersectionObserver | null = null
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const stopLoop = () => {
      loopOn = false
      cancelAnimationFrame(frameId)
    }

    const onContextLost = (event: Event) => {
      event.preventDefault()
      stopLoop()
      reportSphereFailure(new Error("webglcontextlost"))
    }

    const cleanup = () => {
      if (disposed) return
      disposed = true
      stopLoop()
      resizeObserver?.disconnect()
      intersection?.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("pixel-motion", onMotion)
      reducedQuery.removeEventListener("change", onReduced)
      const canvas = renderer?.domElement
      canvas?.removeEventListener("webglcontextlost", onContextLost)
      if (canvas?.parentNode === container) container.removeChild(canvas)
      geometry?.dispose()
      wireframe?.dispose()
      lineMaterial?.dispose()
      innerMaterial?.dispose()
      particleGeometry?.dispose()
      particleMaterial?.dispose()
      if (renderer) {
        try {
          renderer.forceContextLoss()
          renderer.dispose()
        } catch {
          // The context is already gone. Unmount must stay silent.
        }
        renderer = null
      }
    }

    const resize = () => {
      if (disposed || !renderer) return
      const width = container.clientWidth
      const height = container.clientHeight
      if (!width || !height) return
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP))
      renderer.setSize(width, height, false)
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 7

    const draw = (advance: boolean) => {
      if (disposed || !renderer || !sphere || !lineMaterial) return
      if (advance) {
        sphereGroup.rotation.x += 0.002
        sphereGroup.rotation.y += 0.004
        const pulse = 0.95 + 0.03 * Math.sin(Date.now() * 0.001)
        sphere.scale.set(pulse, pulse, pulse)
        if (Math.random() > 0.98 && lineMaterial) lineMaterial.opacity = 0.55 + Math.random() * 0.4
      }
      renderer.render(scene, camera)
      if (!announced) {
        announced = true
        window.dispatchEvent(new Event("pixel-sphere-frame"))
      }
    }

    let sphere: THREE.Mesh | null = null
    const sphereGroup = new THREE.Group()

    const shouldSpin = () => tabVisible && onScreen && !motionHalted()

    const startLoop = () => {
      if (disposed || loopOn) return
      loopOn = true
      const tick = () => {
        if (!loopOn || disposed) return
        frameId = requestAnimationFrame(tick)
        try {
          if (!tabVisible || !onScreen) return
          draw(shouldSpin())
        } catch (error) {
          stopLoop()
          reportSphereFailure(error)
        }
      }
      tick()
    }

    const syncLoop = () => {
      if (disposed) return
      try {
        resize()
        if (!tabVisible || !onScreen) {
          stopLoop()
          return
        }
        if (motionHalted()) {
          stopLoop()
          draw(false)
          return
        }
        startLoop()
      } catch (error) {
        stopLoop()
        reportSphereFailure(error)
      }
    }

    function onVisibility() {
      tabVisible = document.visibilityState === "visible"
      syncLoop()
    }
    function onMotion() {
      syncLoop()
    }
    function onReduced() {
      syncLoop()
    }

    try {
      const mobile = window.innerWidth < 768
      renderer = new THREE.WebGLRenderer({
        antialias: !mobile,
        alpha: true,
        powerPreference: mobile ? "low-power" : "high-performance",
      })
      if (!renderer.getContext()) throw new Error("WebGL context unavailable")
      renderer.setClearColor(0x000000, 0)
      renderer.domElement.style.width = "100%"
      renderer.domElement.style.height = "100%"
      renderer.domElement.style.display = "block"
      renderer.domElement.addEventListener("webglcontextlost", onContextLost)
      if (!container.isConnected) throw new Error("Sphere container unmounted before WebGL setup")
      container.appendChild(renderer.domElement)

      scene.add(new THREE.AmbientLight(0x222222))
      const directionalLight = new THREE.DirectionalLight(0xff4800, 1)
      directionalLight.position.set(1, 1, 1)
      scene.add(directionalLight)
      const blueLight = new THREE.PointLight(0x00ffff, 0.9)
      blueLight.position.set(-2, 1, 3)
      scene.add(blueLight)

      const detail = mobile ? 20 : 32
      geometry = new THREE.SphereGeometry(2, detail, detail)
      wireframe = new THREE.WireframeGeometry(geometry)
      lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.9 })
      const wireframeMesh = new THREE.LineSegments(wireframe, lineMaterial)
      innerMaterial = new THREE.MeshPhongMaterial({
        color: 0x00aaaa,
        emissive: 0x003333,
        transparent: true,
        opacity: 0.38,
        shininess: 80,
      })
      sphere = new THREE.Mesh(geometry, innerMaterial)
      sphere.scale.set(0.95, 0.95, 0.95)
      sphereGroup.add(wireframeMesh)
      sphereGroup.add(sphere)

      const particleCount = mobile ? 48 : 100
      const positions = new Float32Array(particleCount * 3)
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] = (Math.random() - 0.5) * 5
        positions[i + 1] = (Math.random() - 0.5) * 5
        positions[i + 2] = (Math.random() - 0.5) * 5
      }
      particleGeometry = new THREE.BufferGeometry()
      particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      particleMaterial = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.05, transparent: true })
      sphereGroup.add(new THREE.Points(particleGeometry, particleMaterial))
      scene.add(sphereGroup)

      resizeObserver = new ResizeObserver(() => {
        if (disposed) return
        try {
          resize()
        } catch (error) {
          reportSphereFailure(error)
          cleanup()
        }
      })
      resizeObserver.observe(container)

      if (typeof IntersectionObserver !== "undefined") {
        intersection = new IntersectionObserver(
          (entries) => {
            if (disposed) return
            onScreen = entries.some((entry) => entry.isIntersecting)
            syncLoop()
          },
          { threshold: 0.05 },
        )
        intersection.observe(container)
      }

      document.addEventListener("visibilitychange", onVisibility)
      window.addEventListener("pixel-motion", onMotion)
      reducedQuery.addEventListener("change", onReduced)
      syncLoop()
    } catch (error) {
      reportSphereFailure(error)
      cleanup()
    }

    return cleanup
  }, [])

  return <div ref={containerRef} className="absolute inset-0" aria-hidden="true" />
}
