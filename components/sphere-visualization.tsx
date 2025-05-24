"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useMobile } from "@/hooks/use-mobile"

export default function SphereVisualization() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize 3D sphere
    const container = containerRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.z = isMobile ? 7 : 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x222222)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xff4800, 0.8)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)
    const blueLight = new THREE.PointLight(0x00ffff, 0.5)
    blueLight.position.set(-2, 1, 3)
    scene.add(blueLight)

    // Create sphere with wireframe and inner glow
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

    // Add particles
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

    // Animation function
    function animate() {
      requestAnimationFrame(animate)
      sphereGroup.rotation.x += 0.002
      sphereGroup.rotation.y += 0.004
      const pulseScale = 0.95 + 0.03 * Math.sin(Date.now() * 0.001)
      sphere.scale.set(pulseScale, pulseScale, pulseScale)
      if (Math.random() > 0.98) {
        lineMaterial.opacity = 0.1 + Math.random() * 0.5
      }
      renderer.render(scene, camera)
    }
    animate()

    // Resize Handler
    const handleResize = () => {
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)

      // Adjust camera position based on screen size
      camera.position.z = window.innerWidth < 768 ? 7 : 5
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      container.removeChild(renderer.domElement)
      geometry.dispose()
      wireframe.dispose()
      lineMaterial.dispose()
      innerMaterial.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
    }
  }, [])

  return <div id="sphere-container" ref={containerRef} className="w-full h-full" aria-hidden="true"></div>
}
