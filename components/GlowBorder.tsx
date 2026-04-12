"use client"

import { useRef, useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface GlowBorderProps {
  children: React.ReactNode
  className?: string
  edgeSensitivity?: number
  glowColor?: string
  backgroundColor?: string
  borderRadius?: number
  glowRadius?: number
  glowIntensity?: number
  coneSpread?: number
  colors?: string[]
}

function parseHSL(hslStr: string): { h: number; s: number; l: number } {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/)
  if (!match) return { h: 40, s: 80, l: 80 }
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) }
}

function buildBoxShadow(glowColor: string, intensity: number): string {
  const { h, s, l } = parseHSL(glowColor)
  const base = `${h}deg ${s}% ${l}%`
  const layers: [number, number, number, number, number, boolean][] = [
    [0, 0, 0, 1, 100, true],
    [0, 0, 1, 0, 60, true],
    [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true],
    [0, 0, 15, 0, 30, true],
    [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],
    [0, 0, 1, 0, 60, false],
    [0, 0, 3, 0, 50, false],
    [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false],
    [0, 0, 25, 2, 20, false],
    [0, 0, 50, 2, 10, false]
  ]
  return layers
    .map(([x, y, blur, spread, alpha, inset]) => {
      const a = Math.min(alpha * intensity, 100)
      return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`
    })
    .join(', ')
}

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%']
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1]

function buildMeshGradients(colors: string[]): string[] {
  const gradients: string[] = []
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)]
    gradients.push(`radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`)
  }
  gradients.push(`linear-gradient(${colors[0]} 0 100%)`)
  return gradients
}

export default function GlowBorder({
  children,
  className,
  edgeSensitivity = 30,
  glowColor = '150 80 60',
  backgroundColor = 'rgba(255,255,255,0.03)',
  borderRadius = 16,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  colors = ['#10b981', '#06b6d4', '#3b82f6'],
}: GlowBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [cursorAngle, setCursorAngle] = useState(45)
  const [edgeProximity, setEdgeProximity] = useState(0)
  const [isNearEdge, setIsNearEdge] = useState(false)

  const getCenterOfElement = (el: HTMLElement) => {
    const { width, height } = el.getBoundingClientRect()
    return [width / 2, height / 2]
  }

  // Calculate how close cursor is to the border edges (not center-based)
  const getEdgeDistance = (el: HTMLElement, x: number, y: number, threshold: number = 40) => {
    const { width, height } = el.getBoundingClientRect()
    
    // Distance from each edge
    const distLeft = x
    const distRight = width - x
    const distTop = y
    const distBottom = height - y
    
    // Minimum distance to any edge
    const minDist = Math.min(distLeft, distRight, distTop, distBottom)
    
    // Return 1 when at edge, 0 when beyond threshold
    if (minDist >= threshold) return 0
    return 1 - (minDist / threshold)
  }

  const getEdgeProximity = (el: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenterOfElement(el)
    const dx = x - cx
    const dy = y - cy
    let kx = Infinity
    let ky = Infinity
    if (dx !== 0) kx = cx / Math.abs(dx)
    if (dy !== 0) ky = cy / Math.abs(dy)
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1)
  }

  const getCursorAngle = (el: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenterOfElement(el)
    const dx = x - cx
    const dy = y - cy
    if (dx === 0 && dy === 0) return 0
    const radians = Math.atan2(dy, dx)
    let degrees = radians * (180 / Math.PI) + 90
    if (degrees < 0) degrees += 360
    return degrees
  }

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Check if cursor is near the border edges (within 35px threshold)
    const edgeDist = getEdgeDistance(containerRef.current, x, y, 35)
    setIsNearEdge(edgeDist > 0)
    setEdgeProximity(edgeDist > 0 ? getEdgeProximity(containerRef.current, x, y) : 0)
    setCursorAngle(getCursorAngle(containerRef.current, x, y))
  }, [])

  const colorSensitivity = edgeSensitivity + 20
  // Only show glow when hovering AND near the edge
  const isVisible = isHovered && isNearEdge
  const borderOpacity = isVisible
    ? Math.max(0, (edgeProximity * 100 - colorSensitivity) / (100 - colorSensitivity))
    : 0
  const glowOpacity = isVisible
    ? Math.max(0, (edgeProximity * 100 - edgeSensitivity) / (100 - edgeSensitivity))
    : 0

  const meshGradients = buildMeshGradients(colors)
  const borderBg = meshGradients.map(g => `${g} border-box`)
  const angleDeg = `${cursorAngle.toFixed(3)}deg`

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setEdgeProximity(0)
        setIsNearEdge(false)
      }}
      className={cn("relative grid isolate", className)}
      style={{
        borderRadius: borderRadius + 'px',
        transform: 'translate3d(0, 0, 0.01px)',
        background: 'transparent',
      }}
    >
      {/* mesh gradient border */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none -z-[1]"
        style={{
          border: '1px solid transparent',
          background: [
            'linear-gradient(transparent 0 100%) padding-box',
            'linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box',
            ...borderBg
          ].join(', '),
          opacity: borderOpacity,
          maskImage: `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
          WebkitMaskImage: `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
          transition: isVisible ? 'opacity 0.25s ease-out' : 'opacity 0.75s ease-in-out',
          borderRadius: 'inherit',
        }}
      />

      

      {/* outer glow */}
      <span
        className="absolute rounded-[inherit] pointer-events-none z-[1]"
        style={{
          inset: `-${glowRadius}px`,
          maskImage: `conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
          WebkitMaskImage: `conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
          opacity: glowOpacity,
          mixBlendMode: 'plus-lighter',
          transition: isVisible ? 'opacity 0.25s ease-out' : 'opacity 0.75s ease-in-out',
        }}
      >
        <span
          className="absolute rounded-[inherit]"
          style={{
            inset: `${glowRadius}px`,
            boxShadow: buildBoxShadow(glowColor, glowIntensity),
          }}
        />
      </span>

      {/* content */}
      <div className="relative z-[1] flex flex-col overflow-visible">
        {children}
      </div>
    </div>
  )
}
