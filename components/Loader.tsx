"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface LoaderProps {
  onComplete: () => void
}

export default function Loader({ onComplete }: LoaderProps) {
  const [phase, setPhase] = useState<'video' | 'logo' | 'animating'>('video')
  const [videoOpacity, setVideoOpacity] = useState(1)
  const [logoOpacity, setLogoOpacity] = useState(0)
  const [logoMoving, setLogoMoving] = useState(false)
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0, scale: 1 })
  const logoRef = useRef<HTMLDivElement>(null)

  const handleVideoEnd = () => {
    // Fade video out
    setVideoOpacity(0)

    // Fade logo in shortly after
    setTimeout(() => {
      setPhase('logo')
      setLogoOpacity(1)
    }, 400)

    // Begin the glide to navbar — logo stays fully visible at start, fades mid-journey
    setTimeout(() => {
      if (logoRef.current) {
        const logoRect = logoRef.current.getBoundingClientRect()
        const logoCenterX = logoRect.left + logoRect.width / 2
        const logoCenterY = logoRect.top + logoRect.height / 2

        const targetX = 16 + 24
        const targetY = 24 + 24

        const translateX = targetX - logoCenterX
        const translateY = targetY - logoCenterY
        const scale = 48 / logoRect.width

        setLogoPosition({ x: translateX, y: translateY, scale })
        setPhase('animating')

        // Slight delay before fading so it glides visibly first, then dissolves
        setTimeout(() => {
          setLogoOpacity(0)
        }, 600)
      }
    }, 1800)

    // onComplete fires after glide + fade fully settle
    setTimeout(() => {
      onComplete()
    }, 3400)
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black">

      {/* ── VIDEO PHASE ─────────────────────────────────── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          opacity: videoOpacity,
          transition: 'opacity 700ms ease-in-out',
          pointerEvents: phase !== 'video' ? 'none' : 'auto',
        }}
      >
        <video
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          src="https://res.cloudinary.com/dqrpav05c/video/upload/v1779206838/l4dura5riwetsyxixpb3.mp4"
          style={{
            maxWidth: 'min(80vw, 640px)',
            maxHeight: 'min(70vh, 480px)',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: '4px',
          }}
        />

        <p
          className="absolute bottom-8 w-full text-center text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/40 font-light"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          For best experience— use desktop.
        </p>
      </div>

      {/* ── LOGO PHASE ──────────────────────────────────── */}
      {(phase === 'logo' || phase === 'animating') && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

          <div
            ref={logoRef}
            className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52"
            style={{
              // Opacity and transform transition independently so the fade
              // trails slightly behind the movement — feels like it melts away
              transform: phase === 'animating'
                ? `translate(${logoPosition.x}px, ${logoPosition.y}px) scale(${logoPosition.scale})`
                : 'translate(0, 0) scale(1)',
              opacity: logoOpacity,
              transition: phase === 'animating'
                ? 'transform 1400ms cubic-bezier(0.16, 1, 0.3, 1), opacity 800ms ease-in-out'
                : 'opacity 500ms ease-in-out',
              zIndex: 101,
            }}
          >
            <Image
              src="/images/logo.png"
              alt="Akash Krishna U"
              fill
              className="object-contain"
              priority
              loading="eager"
            />

            {/* Gold premium glow */}
            {phase === 'logo' && (
              <div
                className="absolute inset-0 -z-10 blur-3xl opacity-40 animate-pulse"
                style={{
                  background: 'radial-gradient(ellipse at center, #f59e0b 0%, #FFD700 30%, #FFD700 65%, #FFCC00 100%)',
                }}
              />
            )}
          </div>

          {phase === 'logo' && (
            <p
              className="absolute bottom-8 w-full text-center text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/40 font-light"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              For best experience— use desktop.
            </p>
          )}
        </div>
      )}
    </div>
  )
}