"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function SphereVisualization() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let frameId = 0
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.display = "block"
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    container.appendChild(renderer.domElement)

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

    const sphereGroup = new THREE.Group()
    sphereGroup.add(wireframeMesh)
    sphereGroup.add(sphere)

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
    sphereGroup.add(particles)
    scene.add(sphereGroup)

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const sizeToContainer = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      if (width < 1 || height < 1) return
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
      camera.position.z = window.innerWidth < 768 ? 7 : 5
    }

    const tick = () => {
      sphereGroup.rotation.x += 0.002
      sphereGroup.rotation.y += 0.004
      const pulseScale = 0.95 + 0.03 * Math.sin(Date.now() * 0.001)
      sphere.scale.set(pulseScale, pulseScale, pulseScale)
      if (Math.random() > 0.98) {
        lineMaterial.opacity = 0.1 + Math.random() * 0.5
      }
      renderer.render(scene, camera)
    }

    const animate = () => {
      if (motionQuery.matches) {
        renderer.render(scene, camera)
        return
      }
      frameId = requestAnimationFrame(animate)
      tick()
    }

    const onMotion = () => {
      cancelAnimationFrame(frameId)
      if (motionQuery.matches) {
        renderer.render(scene, camera)
        return
      }
      animate()
    }

    sizeToContainer()
    const observer = new ResizeObserver(sizeToContainer)
    observer.observe(container)
    window.addEventListener("resize", sizeToContainer)
    motionQuery.addEventListener("change", onMotion)
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
      window.removeEventListener("resize", sizeToContainer)
      motionQuery.removeEventListener("change", onMotion)
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
      geometry.dispose()
      wireframe.dispose()
      lineMaterial.dispose()
      innerMaterial.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return <div id="sphere-container" ref={containerRef} className="absolute inset-0 w-full h-full" aria-hidden="true"></div>
}
