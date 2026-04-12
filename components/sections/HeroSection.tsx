"use client"

import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

const InteractiveBallGrid = dynamic(() => import('@/components/InteractiveBallGrid'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0" style={{ backgroundColor: '#000000' }} />
  )
})

const rotatingWords = [
  { word: 'Agritech', gradient: 'gradient-agritech' },
  { word: 'Defence', gradient: 'gradient-defence' },
  { word: 'Forestry', gradient: 'gradient-forestry' },
  { word: 'Sustainability', gradient: 'gradient-sustainability' },
  { word: 'Border Patrolling', gradient: 'gradient-border' },
  { word: 'Wildlife Protection', gradient: 'gradient-wildlife' },
]

export default function HeroSection() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length)
        setIsAnimating(false)
      }, 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const currentWord = rotatingWords[currentWordIndex]

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Full background layer to ensure consistent color */}
      <div className="absolute inset-0 z-0" style={{ backgroundColor: '#000000' }} />

      {/* 3D Background - Full screen behind all content on desktop, shifted right */}
      <div className="absolute inset-0 z-[1] hidden lg:block" style={{ backgroundColor: '#000000' }}>
        <div className="absolute inset-0 translate-x-[15%]">
          <InteractiveBallGrid />
        </div>
      </div>

      {/* Mobile: Position animation centered between center and bottom of screen */}
      <div className="absolute inset-x-0 top-[35%] bottom-0 z-[1] lg:hidden flex items-center justify-center" style={{ backgroundColor: '#000000' }}>
        <div className="w-full h-full scale-110">
          <InteractiveBallGrid />
        </div>
      </div>

      {/* Content - Vertically centered */}
      <div className="relative z-[2] flex flex-col justify-center min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Text Content - Centered on mobile and desktop */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-4 sm:gap-5 lg:gap-6 max-w-2xl mx-auto lg:mx-0">
              {/* Eyebrow */}
              <div
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full w-fit glass animate-fade-in"
                style={{ animationDelay: '0.2s' }}
              >
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span
                  className="text-xs sm:text-sm text-white/70 tracking-wide"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  Founder · Builder · Innovator
                </span>
              </div>

              {/* Main Headline */}
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight opacity-0 animate-slide-up"
                style={{
                  fontFamily: 'var(--font-garet), system-ui, sans-serif',
                  animationDelay: '0.4s',
                  animationFillMode: 'forwards'
                }}
              >
                <span className="text-white" style={{ fontFamily: '"Montserrat", sans-serif' }}>Building the</span>
                <br />
                <span className="text-white" style={{ fontFamily: '"Montserrat", sans-serif' }}>Next-Gen Robotics</span>
                <br />
                <span className="text-white" style={{ fontFamily: '"Montserrat", sans-serif' }}>for </span>
                <span
                  className={cn(
                    "inline-block transition-all duration-500",
                    currentWord.gradient,
                    isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                  )}
                  style={{
                    fontFamily: '"Montserrat", sans-serif',
                    lineHeight: '1.1em',
                  }}
                >
                  {currentWord.word}
                </span>
              </h1>

              {/* CTAs - Same line on mobile with smaller buttons */}
              <div
                className="flex flex-row gap-2 sm:gap-4 mt-2 sm:mt-4 opacity-0 animate-slide-up"
                style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
              >
                {/* Primary CTA */}
                <a
                  href="#portfolio"
                  onClick={(e) => {
                    e.preventDefault()
                    document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-8 py-2.5 sm:py-4 rounded-full bg-white text-[#000000] text-xs sm:text-base font-semibold transition-all duration-300 hover:bg-white/90 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  <span className="whitespace-nowrap">Explore My Work</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>

                {/* Secondary CTA (Ghost) */}
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-8 py-2.5 sm:py-4 rounded-full border border-white/20 text-white text-xs sm:text-base font-medium transition-all duration-300 hover:bg-white/[0.05] hover:border-white/40"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  <span className="whitespace-nowrap">{"Let's Build Together"}</span>
                </a>
              </div>
            </div>

            {/* Right Column - 3D Animation is behind via absolute positioning */}
            <div className="hidden lg:block" />
          </div>
        </div>

        {/* Scroll indicator - positioned at bottom */}
        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div
            className="flex flex-col items-center gap-2 opacity-0 animate-fade-in"
            style={{ animationDelay: '1s', animationFillMode: 'forwards' }}
          >
            <span className="text-xs text-white/40 tracking-widest uppercase" style={{ fontFamily: 'var(--font-inter)' }}>
              Scroll
            </span>
            <div className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
              <div className="w-1 h-2 rounded-full bg-white/40 animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
