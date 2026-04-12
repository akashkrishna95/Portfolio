"use client"

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Linkedin, Github, Instagram, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as THREE from 'three'

// Constellation network - interconnected nodes
function ConstellationNetwork() {
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const count = 50

  const [positions, connections] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const connectionPositions: number[] = []

    // Create random node positions
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5
    }

    // Create connections between nearby nodes
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3]
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (distance < 5) {
          connectionPositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          )
        }
      }
    }

    return [positions, new Float32Array(connectionPositions)]
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.02
      linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
    }
  })

  return (
    <group>
      {/* Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#10b981"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[connections, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#10b981" transparent opacity={0.15} />
      </lineSegments>
    </group>
  )
}

// Floating geometric shapes
function FloatingGeometrics() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x += 0.003 + i * 0.001
        child.rotation.y += 0.002 + i * 0.0005
        child.position.y += Math.sin(state.clock.elapsedTime + i) * 0.003
      })
    }
  })

  return (
    <group ref={groupRef}>
      {/* Octahedron */}
      <mesh position={[-6, 3, -4]}>
        <octahedronGeometry args={[0.5]} />
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.4} />
      </mesh>
      {/* Icosahedron */}
      <mesh position={[7, -2, -3]}>
        <icosahedronGeometry args={[0.4]} />
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.4} />
      </mesh>
      {/* Torus */}
      <mesh position={[4, 4, -5]}>
        <torusGeometry args={[0.4, 0.15, 8, 16]} />
        <meshBasicMaterial color="#22c55e" wireframe transparent opacity={0.3} />
      </mesh>
      {/* Ring */}
      <mesh position={[-5, -3, -2]} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[0.3, 0.5, 16]} />
        <meshBasicMaterial color="#f59e0b" wireframe transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// Particle wave
function ParticleWave() {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 150

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5
    }
    return positions
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      const positionsAttr = particlesRef.current.geometry.attributes.position
      const posArray = positionsAttr.array as Float32Array

      for (let i = 0; i < count; i++) {
        const x = posArray[i * 3]
        posArray[i * 3 + 1] += Math.sin(state.clock.elapsedTime + x * 0.1) * 0.005
      }

      positionsAttr.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#6366f1"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  )
}

// Pulsing orbs
function PulsingOrbs() {
  const orbsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (orbsRef.current) {
      orbsRef.current.children.forEach((child, i) => {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.2
        child.scale.setScalar(scale)
      })
    }
  })

  return (
    <group ref={orbsRef}>
      {[
        { pos: [-8, 2, -6], color: '#10b981' },
        { pos: [9, -1, -4], color: '#8b5cf6' },
        { pos: [0, 5, -7], color: '#06b6d4' },
        { pos: [-4, -4, -5], color: '#f59e0b' },
        { pos: [6, 3, -8], color: '#ec4899' },
      ].map((orb, i) => (
        <mesh key={i} position={orb.pos as [number, number, number]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial color={orb.color} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function NetworkScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <ConstellationNetwork />
      <FloatingGeometrics />
      <ParticleWave />
      <PulsingOrbs />
      <fog attach="fog" args={['#0a0a0a', 10, 35]} />
    </>
  )
}

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/akashkrishnau/',
    icon: Linkedin,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/akashkrishna95',
    icon: Github,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/akash.krishna.u',
    icon: Instagram,
  },
  {
    name: 'Email Me',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=akofficial5000@gmail.com',
    icon: Mail,
  },
]

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen bg-[#0a0a0a] overflow-hidden"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 0, 12], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ 
            antialias: false, 
            powerPreference: "high-performance",
            alpha: true 
          }}
        >
          <NetworkScene />
        </Canvas>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]/90" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/20 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-24">
          {/* Section Eyebrow - Left aligned */}
          <div
            className={cn(
              "flex justify-start mb-6 sm:mb-8 lg:mb-12 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs sm:text-sm text-white/60"
              style={{ fontFamily: 'var(--font-inter)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {"Let's Connect"}
            </span>
          </div>

          <div className="max-w-3xl">
            {/* Section Heading - Same size on mobile as PC */}
            <h2
              className={cn(
                "text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ fontFamily: 'var(--font-garet), system-ui, sans-serif' }}
            >
              <span className="block sm:inline">Have an idea?</span>{' '}
              <span className="block sm:inline bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {"Let's make it real."}
              </span>
            </h2>

            {/* Description - Better mobile text */}
            <p
              className={cn(
                "text-sm sm:text-base lg:text-lg text-white/60 leading-relaxed mb-8 sm:mb-10 lg:mb-12 max-w-2xl transition-all duration-700 delay-100",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {"Whether you're building something bold, looking to collaborate, or just want to talk robotics — I'm open. Let's connect and create something worth building."}
            </p>

            {/* CTA Buttons - Icons only on mobile (left aligned), full buttons on desktop */}
            <div
              className={cn(
                "flex flex-row flex-wrap justify-start gap-3 sm:gap-4 transition-all duration-700 delay-200",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              {socialLinks.map((link, index) => {
                const Icon = link.icon
                
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group flex items-center justify-center transition-all duration-300",
                      "bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]",
                      "hover:bg-white/[0.08] hover:border-white/[0.2] hover:scale-105",
                      "hover:shadow-[0_0_30px_rgba(130,243,184,0.15)]",
                      // Mobile: icon only circle
                      "w-12 h-12 rounded-full",
                      // Desktop: full button with text
                      "sm:w-auto sm:h-auto sm:px-6 sm:py-3.5 sm:gap-3"
                    )}
                    style={{
                      transitionDelay: `${300 + index * 80}ms`,
                    }}
                  >
                    <Icon className="w-5 h-5 text-white/60 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                    {/* Text hidden on mobile, visible on desktop */}
                    <span
                      className="text-sm sm:text-base text-white/80 group-hover:text-white transition-all duration-300 hidden sm:inline whitespace-nowrap"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {link.name}
                    </span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Same layout on mobile and desktop */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 py-4 sm:py-6 lg:py-8 border-t border-white/[0.05] bg-[#0a0a0a]/95 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Brand Left */}
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src="/images/akash-logo.png"
                alt="Akash Krishna U"
                className="w-7 h-7 sm:w-10 sm:h-10 object-contain"
              />
              <div>
                <p className="text-xs sm:text-sm text-white/70 font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
                  Akash Krishna U
                </p>
                <p className="text-[10px] sm:text-xs text-white/40" style={{ fontFamily: 'var(--font-inter)' }}>
                  Founder · Builder · Innovator
                </p>
              </div>
            </div>

            {/* Right side - Copyright */}
            <p className="text-[10px] sm:text-xs lg:text-sm text-white/40" style={{ fontFamily: 'var(--font-inter)' }}>
              © 2025 Akash Krishna U
            </p>
          </div>
        </div>
      </footer>
    </section>
  )
}
