"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LoaderProps {
  onComplete: () => void
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isMovingLogo, setIsMovingLogo] = useState(false)
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0, scale: 1 })
  const logoRef = useRef<HTMLDivElement>(null)

  // Simulate loading progress
  useEffect(() => {
    const duration = 2500 // Total loading time in ms
    const interval = 30 // Update interval
    const steps = duration / interval
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      // Eased progress for more natural feel
      const linear = currentStep / steps
      const eased = 1 - Math.pow(1 - linear, 3) // Ease out cubic
      setProgress(Math.min(Math.round(eased * 100), 100))

      if (currentStep >= steps) {
        clearInterval(timer)
        setIsComplete(true)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  // Handle logo animation to navbar position
  useEffect(() => {
    if (isComplete && logoRef.current) {
      // Get current logo position (center of screen)
      const logoRect = logoRef.current.getBoundingClientRect()
      const logoCenterX = logoRect.left + logoRect.width / 2
      const logoCenterY = logoRect.top + logoRect.height / 2
      
      // Target position (top-left navbar logo position)
      // Navbar logo: top-4 left-4 (16px), size 48x48 on desktop
      const targetX = 16 + 24 // left-4 + half of logo width
      const targetY = 24 + 24 // top-6 (initial) + half of logo height
      
      // Calculate translation needed
      const translateX = targetX - logoCenterX
      const translateY = targetY - logoCenterY
      
      // Target scale (from ~160px to ~48px)
      const currentSize = logoRect.width
      const targetSize = 48
      const scale = targetSize / currentSize
      
      // Start the animation
      setTimeout(() => {
        setIsMovingLogo(true)
        setLogoPosition({ x: translateX, y: translateY, scale })
      }, 200)
      
      // Call onComplete after animation finishes
      const completeTimeout = setTimeout(() => {
        onComplete()
      }, 1000)

      return () => {
        clearTimeout(completeTimeout)
      }
    }
  }, [isComplete, onComplete])

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center transition-opacity duration-300",
        isMovingLogo && "bg-transparent pointer-events-none"
      )}
      style={{
        opacity: isMovingLogo ? 0 : 1,
        transitionDelay: isMovingLogo ? '400ms' : '0ms',
      }}
    >
      {/* Logo */}
      <div
        ref={logoRef}
        className={cn(
          "relative w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52",
          isMovingLogo && "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
        )}
        style={{
          transform: isMovingLogo 
            ? `translate(${logoPosition.x}px, ${logoPosition.y}px) scale(${logoPosition.scale})` 
            : 'translate(0, 0) scale(1)',
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
        
        {/* Glow effect behind logo */}
        {!isMovingLogo && (
          <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-to-br from-emerald-500 via-cyan-500 to-purple-500 animate-pulse" />
        )}
      </div>

      {/* Rubik's Cube Loader - positioned below logo */}
      <div
        className={cn(
          "mt-8 sm:mt-10 flex flex-col items-center gap-4 transition-all duration-300",
          (isComplete || isMovingLogo) && "opacity-0 translate-y-4"
        )}
      >
        {/* Rubik's cube animation - contained within fixed bounds, smaller size */}
        <div className="relative w-[70px] h-[70px] flex items-center justify-center scale-75">
          <div className="rubiks-loader">
            <div className="loader-square" />
            <div className="loader-square" />
            <div className="loader-square" />
            <div className="loader-square" />
            <div className="loader-square" />
            <div className="loader-square" />
            <div className="loader-square" />
          </div>
        </div>

        {/* Percentage */}
        <div className="flex items-baseline gap-0.5">
          <span 
            className="text-base sm:text-lg font-light text-white tabular-nums tracking-tight"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {progress}
          </span>
          <span 
            className="text-xs sm:text-sm text-white/60"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            %
          </span>
        </div>
      </div>

      {/* BOTTOM TEXT */}
      <div 
        className={cn(
          "absolute bottom-8 w-full text-center transition-all duration-300",
          (isComplete || isMovingLogo) && "opacity-0"
        )}
      >
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/40 font-light">
          For the best experience— use desktop.
        </p>
      </div>

      {/* Animated background elements */}
      {!isMovingLogo && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      )}

      <style jsx>{`
        @keyframes square-animation {
          0% { left: 0; top: 0; }
          10.5% { left: 0; top: 0; }
          12.5% { left: 26px; top: 0; }
          23% { left: 26px; top: 0; }
          25% { left: 52px; top: 0; }
          35.5% { left: 52px; top: 0; }
          37.5% { left: 52px; top: 26px; }
          48% { left: 52px; top: 26px; }
          50% { left: 26px; top: 26px; }
          60.5% { left: 26px; top: 26px; }
          62.5% { left: 26px; top: 52px; }
          73% { left: 26px; top: 52px; }
          75% { left: 0; top: 52px; }
          85.5% { left: 0; top: 52px; }
          87.5% { left: 0; top: 26px; }
          98% { left: 0; top: 26px; }
          100% { left: 0; top: 0; }
        }

        .rubiks-loader {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 78px;
          height: 78px;
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .loader-square {
          position: absolute;
          top: 0;
          left: 0;
          width: 22px;
          height: 22px;
          margin: 2px;
          border-radius: 2px;
          background: linear-gradient(135deg, #a855f7 0%, #8b5cf6 25%, #7c3aed 50%, #38bdf8 75%, #06b6d4 100%);
          animation: square-animation 8s ease-in-out infinite both;
        }

        .loader-square:nth-of-type(1) { animation-delay: -1.1428571429s; }
        .loader-square:nth-of-type(2) { animation-delay: -2.2857142857s; }
        .loader-square:nth-of-type(3) { animation-delay: -3.4285714286s; }
        .loader-square:nth-of-type(4) { animation-delay: -4.5714285714s; }
        .loader-square:nth-of-type(5) { animation-delay: -5.7142857143s; }
        .loader-square:nth-of-type(6) { animation-delay: -6.8571428571s; }
        .loader-square:nth-of-type(7) { animation-delay: -8s; }
      `}</style>
    </div>
  )
}