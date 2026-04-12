"use client"

import type React from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import type * as THREE from "three"
import { useRef, useState, useEffect, useCallback } from "react"
import { gsap } from "gsap"
import * as THREE_IMPL from "three"

interface BallGroupProps {
  position: [number, number, number]
  holeDepth: number
  initialState: "in" | "out"
  id: number
  onBallUpdate: (id: number, state: "in" | "out") => void
  isActive: boolean
}

const BallGroup: React.FC<BallGroupProps> = ({ position, holeDepth, initialState, id, onBallUpdate, isActive }) => {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const [currentState, setCurrentState] = useState<"in" | "out" | "jumping">(initialState)
  const animationRef = useRef<gsap.core.Timeline>(null)

  // Inactive material - always glows softly
  const inactiveMaterial = new THREE_IMPL.MeshPhongMaterial({
    color: 0x3a6e58,
    emissive: 0x82f3b8,
    emissiveIntensity: 0.4,
    shininess: 100,
    transparent: true,
    opacity: 0.95,
  })

  // Active material - glows brighter when jumping
  const activeMaterial = new THREE_IMPL.MeshPhongMaterial({
    color: 0x82f3b8,
    emissive: 0x82f3b8,
    emissiveIntensity: 1.8,
    shininess: 100,
    transparent: true,
    opacity: 1.0,
  })

  const jumpToHole = useCallback(() => {
    if (!groupRef.current || currentState === "jumping") return

    setCurrentState("jumping")

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentState("in")
        onBallUpdate(id, "in")
      },
    })

    tl.set(groupRef.current.position, { y: 0 })
      .set(lightRef.current, { intensity: 0 })
      .call(() => {
        if (meshRef.current) meshRef.current.material = inactiveMaterial
      })
      .to(groupRef.current.position, {
        duration: 0.4,
        y: 0.5,
        ease: "power2.out",
      })
      .call(() => {
        if (meshRef.current) meshRef.current.material = activeMaterial
      })
      .to(
        lightRef.current,
        {
          duration: 0.3,
          intensity: 15,
          ease: "power2.out",
        },
        "<",
      )
      .to(groupRef.current.position, {
        duration: 2.0,
        y: 8,
        ease: "slow(0.7, 0.7, false)",
      })
      .to(
        lightRef.current,
        {
          duration: 1.0,
          intensity: 25,
          distance: 30,
          ease: "power1.out",
        },
        "<",
      )
      .to(groupRef.current.position, {
        duration: 0.3,
        y: 8.2,
        ease: "power1.inOut",
      })
      .to(groupRef.current.position, {
        duration: 1.5,
        y: -holeDepth,
        ease: "power2.in",
      })
      .to(
        lightRef.current,
        {
          duration: 1.2,
          intensity: 5,
          distance: 15,
          ease: "power2.in",
        },
        "<",
      )
      .to(lightRef.current, {
        duration: 0.5,
        intensity: 0,
        ease: "power2.out",
      })

    animationRef.current = tl
  }, [currentState, holeDepth, id, onBallUpdate, inactiveMaterial, activeMaterial])

  const jumpOutOfHole = useCallback(() => {
    if (!groupRef.current || currentState === "jumping") return

    setCurrentState("jumping")

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentState("out")
        onBallUpdate(id, "out")
      },
    })

    tl.to(groupRef.current.position, {
      duration: 1.2,
      y: 6,
      ease: "power2.out",
    })
      .to(
        lightRef.current,
        {
          duration: 0.8,
          intensity: 20,
          ease: "power2.out",
        },
        "<",
      )
      .to(groupRef.current.position, {
        duration: 1.0,
        y: 0,
        ease: "bounce.out",
      })
      .to(
        lightRef.current,
        {
          duration: 0.8,
          intensity: 0,
          ease: "power2.in",
        },
        "<",
      )

    animationRef.current = tl
  }, [currentState, id, onBallUpdate])

  useEffect(() => {
    if (isActive && currentState === "out") {
      jumpToHole()
    } else if (!isActive && currentState === "in") {
      jumpOutOfHole()
    }
  }, [isActive, currentState, jumpToHole, jumpOutOfHole])

  useFrame(() => {
    if (groupRef.current && lightRef.current && meshRef.current) {
      const y = groupRef.current.position.y
      const isJumping = y > 0.5
      const normalizedY = Math.max(0, y / 8)

      lightRef.current.decay = 2

      const material = meshRef.current.material as THREE.MeshPhongMaterial
      if (material.emissive) {
        // Always glow - base glow of 0.4, increases when jumping
        material.emissiveIntensity = isJumping ? normalizedY * 1.5 + 0.8 : 0.4
      }
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <primitive object={inactiveMaterial} />
      </mesh>
      <pointLight
        ref={lightRef}
        args={["#82f3b8", 5, 25, 2]}
        castShadow
        shadow-mapSize-width={256}
        shadow-mapSize-height={256}
      />
    </group>
  )
}

const GroundWithHoles: React.FC<{
  holePositions: [number, number, number][]
  holeDepth: number
}> = ({ holePositions, holeDepth }) => {
  const tubeMaterial = new THREE_IMPL.MeshPhysicalMaterial({
    color: 0x2a2a2a,
    roughness: 0.3,
    metalness: 0.7,
    envMapIntensity: 1.0,
    clearcoat: 0.3,
    clearcoatRoughness: 0.1,
  })

  const glowMaterial = new THREE_IMPL.MeshPhysicalMaterial({
    color: 0x193d36,
    emissive: 0x82f3b8,
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.8,
    transparent: true,
    opacity: 0.9,
  })

  const createHollowTube = () => {
    const outerRadius = 1.2
    const innerRadius = 0.8
    const height = holeDepth + 1

    const shape = new THREE_IMPL.Shape()
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false)

    const hole = new THREE_IMPL.Path()
    hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true)
    shape.holes.push(hole)

    const extrudeSettings = {
      depth: height,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3,
    }

    return new THREE_IMPL.ExtrudeGeometry(shape, extrudeSettings)
  }

  const tubeGeometry = createHollowTube()

  return (
    <group>
      {holePositions.map((pos, index) => (
        <group key={index} position={pos}>
          <mesh
            geometry={tubeGeometry}
            material={tubeMaterial}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -holeDepth / 2, 0]}
            castShadow
            receiveShadow
          />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <ringGeometry args={[0.8, 1.0, 16]} />
            <primitive object={glowMaterial} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

const CameraController: React.FC = () => {
  const { camera } = useThree()
  const [gyroSupported, setGyroSupported] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
    setIsMobile(checkMobile())

    if (typeof DeviceOrientationEvent !== "undefined") {
      if ("requestPermission" in DeviceOrientationEvent) {
        ; (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> })
          .requestPermission()
          .then((response: string) => {
            if (response === "granted") {
              setGyroSupported(true)
            }
          })
          .catch(() => setGyroSupported(false))
      } else {
        setGyroSupported(true)
      }
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma !== null && event.beta !== null) {
        mouseRef.current.x = Math.max(-1, Math.min(1, event.gamma / 30))
        mouseRef.current.y = Math.max(-1, Math.min(1, (event.beta - 45) / 30))
      }
    }

    if (isMobile && gyroSupported) {
      window.addEventListener("deviceorientation", handleOrientation)
    } else {
      window.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("deviceorientation", handleOrientation)
    }
  }, [gyroSupported, isMobile])

  useFrame(() => {
    const targetX = mouseRef.current.x * 8
    const targetY = 12 + mouseRef.current.y * 4
    const targetZ = 15 + mouseRef.current.y * 3

    camera.position.lerp(new THREE_IMPL.Vector3(targetX, targetY, targetZ), 0.05)
    camera.lookAt(0, 2, 0)
  })

  return null
}

const InteractiveBallGrid: React.FC = () => {
  const [balls, setBalls] = useState<
    Array<{
      id: number
      position: [number, number, number]
      isActive: boolean
    }>
  >([])
  const [activeBallIds, setActiveBallIds] = useState<Set<number>>(new Set())

  const holeDepth = 2.0
  const gridSize = 4
  const spacing = 3.0

  const holePositions: [number, number, number][] = []
  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      holePositions.push([(x - gridSize / 2 + 0.5) * spacing, 0, (z - gridSize / 2 + 0.5) * spacing])
    }
  }

  useEffect(() => {
    const initialBalls = holePositions.slice(0, 8).map((pos, index) => ({
      id: index,
      position: pos,
      isActive: false,
    }))
    setBalls(initialBalls)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const animationCycle = () => {
      const numActiveBalls = Math.floor(Math.random() * 2) + 1
      const availableBalls = balls.filter((ball) => !activeBallIds.has(ball.id))

      if (availableBalls.length > 0) {
        const newActiveBalls = new Set<number>()
        for (let i = 0; i < Math.min(numActiveBalls, availableBalls.length); i++) {
          const randomIndex = Math.floor(Math.random() * availableBalls.length)
          const selectedBall = availableBalls.splice(randomIndex, 1)[0]
          newActiveBalls.add(selectedBall.id)
        }

        setActiveBallIds(newActiveBalls)

        setTimeout(
          () => {
            setActiveBallIds(new Set())
          },
          Math.random() * 2000 + 3000,
        )
      }
    }

    const interval = setInterval(animationCycle, Math.random() * 1500 + 2000)
    return () => clearInterval(interval)
  }, [balls, activeBallIds])

  const handleBallUpdate = useCallback(() => {
    // Handle ball state updates if needed
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: '#000000' }}>
      <Canvas
        camera={{ position: [0, 12, 15], fov: 60 }}
        shadows={{ type: THREE_IMPL.BasicShadowMap }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE_IMPL.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 1.5]}
        frameloop="demand"
        className="w-full h-full"
        style={{ background: 'transparent' }}
        onCreated={({ gl, invalidate }) => {
          gl.setClearColor(0x000000, 0)
          // Continuously invalidate for animations
          const animate = () => {
            invalidate()
            requestAnimationFrame(animate)
          }
          animate()
        }}
      >
        <ambientLight intensity={0.1} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          shadow-bias={-0.001}
        />

        {/* Removed Environment to prevent white background */}

        <GroundWithHoles holePositions={holePositions} holeDepth={holeDepth} />

        {balls.map((ball) => (
          <BallGroup
            key={ball.id}
            id={ball.id}
            position={ball.position}
            holeDepth={holeDepth}
            initialState="out"
            isActive={activeBallIds.has(ball.id)}
            onBallUpdate={handleBallUpdate}
          />
        ))}

        <CameraController />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  )
}

export default InteractiveBallGrid
