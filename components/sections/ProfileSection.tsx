"use client"

import { useRef, useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// 3D Gyroscope Parallax Hook
function use3DParallax(containerRef: React.RefObject<HTMLElement | null>) {
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    // Calculate rotation (max 15 degrees)
    const rotateY = (mouseX / (rect.width / 2)) * 15
    const rotateX = -(mouseY / (rect.height / 2)) * 15
    
    setTransform({ rotateX, rotateY })
  }, [containerRef])

  const handleMouseEnter = useCallback(() => setIsHovering(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    setTransform({ rotateX: 0, rotateY: 0 })
  }, [])

  // Gyroscope support for mobile
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (isHovering) return // Mouse takes priority
      const beta = e.beta ?? 0 // -180 to 180 (front/back tilt)
      const gamma = e.gamma ?? 0 // -90 to 90 (left/right tilt)
      
      // Normalize and clamp to max 12 degrees
      const rotateX = Math.max(-12, Math.min(12, (beta - 45) * 0.3))
      const rotateY = Math.max(-12, Math.min(12, gamma * 0.4))
      
      setTransform({ rotateX, rotateY })
    }

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation)
      }
    }
  }, [isHovering])

  return { transform, handleMouseMove, handleMouseEnter, handleMouseLeave, isHovering }
}

const pillTags = [
  'B.Tech · UKF College',
  'Startup Founder',
  'Freelancer',
  'IEDC IPR & Research Lead',
  'IEEE Execom',
  'Embedded AI Developer',
  'UI/UX & Graphic Designer',
  'Patent Strategist',
]

export default function ProfileSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const photoContainerRef = useRef<HTMLDivElement>(null)
  const mobilePhotoContainerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  
  const { 
    transform: desktopTransform, 
    handleMouseMove: desktopMouseMove, 
    handleMouseEnter: desktopMouseEnter, 
    handleMouseLeave: desktopMouseLeave,
    isHovering: desktopHovering
  } = use3DParallax(photoContainerRef)
  
  const { 
    transform: mobileTransform, 
    handleMouseMove: mobileMouseMove, 
    handleMouseEnter: mobileMouseEnter, 
    handleMouseLeave: mobileMouseLeave 
  } = use3DParallax(mobilePhotoContainerRef)

  // Attach mouse events to desktop photo container
  useEffect(() => {
    const container = photoContainerRef.current
    if (!container) return
    
    container.addEventListener('mousemove', desktopMouseMove)
    container.addEventListener('mouseenter', desktopMouseEnter)
    container.addEventListener('mouseleave', desktopMouseLeave)
    
    return () => {
      container.removeEventListener('mousemove', desktopMouseMove)
      container.removeEventListener('mouseenter', desktopMouseEnter)
      container.removeEventListener('mouseleave', desktopMouseLeave)
    }
  }, [desktopMouseMove, desktopMouseEnter, desktopMouseLeave])

  // Attach mouse events to mobile photo container
  useEffect(() => {
    const container = mobilePhotoContainerRef.current
    if (!container) return
    
    container.addEventListener('mousemove', mobileMouseMove)
    container.addEventListener('mouseenter', mobileMouseEnter)
    container.addEventListener('mouseleave', mobileMouseLeave)
    
    return () => {
      container.removeEventListener('mousemove', mobileMouseMove)
      container.removeEventListener('mouseenter', mobileMouseEnter)
      container.removeEventListener('mouseleave', mobileMouseLeave)
    }
  }, [mobileMouseMove, mobileMouseEnter, mobileMouseLeave])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="profile"
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-32 bg-[#0a0a0a] overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/5 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Eyebrow - Left aligned */}
        <div
          className={cn(
            "flex justify-start mb-8 sm:mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs sm:text-sm text-white/60"
            style={{ fontFamily: 'var(--font-inter)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Profile
          </span>
        </div>

        {/* Mobile: Photo below title */}
        <div className="lg:hidden mb-8">
          {/* Section Heading for Mobile */}
          <h2
            className={cn(
              "text-4xl sm:text-3xl font-bold text-white leading-tight mb-8 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ fontFamily: 'var(--font-garet), system-ui, sans-serif' }}
          >
            Akash Krishna U
          </h2>

          {/* Mobile Portrait - 3D Gyroscope Parallax */}
          <div
            ref={mobilePhotoContainerRef}
            className={cn(
              "flex justify-center transition-all duration-1000 delay-200",
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
            style={{ perspective: '1200px' }}
          >
            <div 
              className="relative w-72 h-96 sm:w-80 sm:h-[440px] transition-transform duration-300 ease-out"
              style={{
                transform: `rotateX(${mobileTransform.rotateX}deg) rotateY(${mobileTransform.rotateY}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Gradient border frame - stays at base */}
              <div 
                className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-br from-emerald-500/40 via-transparent to-blue-500/40"
                style={{ transform: 'translateZ(-15px)' }}
              >
                <div className="w-full h-full rounded-2xl bg-[#0a0a0a]" />
              </div>

              {/* Photo that pops out */}
              <div 
                className="absolute inset-[2px] rounded-[14px] overflow-hidden"
                style={{
                  transform: 'translateZ(40px)',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(16,185,129,0.1)',
                }}
              >
                <Image
                  src="https://res.cloudinary.com/dqrpav05c/image/upload/v1775975309/t8qqrzci9sietlzsnlxp.png"
                  alt="Akash Krishna U"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 256px, 288px"
                  priority
                />
                {/* Glass liquid overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent" />
                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
              </div>

              {/* Floating card at bottom - pops out even more */}
              <div 
                className="absolute inset-x-3 bottom-3 p-3 rounded-xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.12]"
                style={{
                  transform: 'translateZ(70px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(255,255,255,0.03)',
                }}
              >
                <p className="text-xs text-white/80 text-center font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
                  Akash Krishna U
                </p>
                <p className="text-[10px] text-white/50 text-center" style={{ fontFamily: 'var(--font-inter)' }}>
                  Founder · Builder · Innovator
                </p>
              </div>

              {/* Glow behind */}
              <div 
                className="absolute -inset-6 bg-emerald-500/10 blur-2xl rounded-full opacity-50"
                style={{ transform: 'translateZ(-30px)' }}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* Left Column - Text Content */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Section Heading - Desktop only */}
            <h2
              className={cn(
                "hidden lg:block text-6xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ fontFamily: 'var(--font-garet), system-ui, sans-serif' }}
            >
              Akash Krishna U
            </h2>

            {/* Primary Bio - Liquid Glass Card with Spotlight Effect */}
            <div
              className={cn(
                "transition-all duration-700 delay-100 group relative",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              {/* Spotlight effect - follows cursor position */}
              <div
                className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-radial from-white/[0.08] via-transparent to-transparent blur-xl" />
              </div>

              <div
                className={cn(
                  "relative p-4 sm:p-6 rounded-xl sm:rounded-2xl cursor-pointer",
                  "bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08]",
                  "group-hover:bg-white/[0.06] group-hover:-translate-y-3 transition-all duration-500 ease-out",
                  "group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_80px_rgba(255,255,255,0.05)]",
                  "group-hover:border-white/[0.15]"
                )}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 50%, rgba(255,255,255,0.03) 100%)',
                }}
              >
                {/* Liquid glass shine effect - multiple layers */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden pointer-events-none">
                  {/* Top shine */}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent" />
                  {/* Diagonal shine */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
                  {/* Spotlight glow on hover */}
                  <div className="absolute inset-0 bg-gradient-radial from-white/[0.06] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                {/* Inner glow on hover */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 40px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)',
                  }}
                />
                <p
                  className="relative text-sm sm:text-base lg:text-lg text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  {"Hi, I’m Akash Krishna U — founder of AgniRobotics, B.Tech student, and embedded‑AI engineer designing edge‑native autonomous system solving real challenges from farmlands to defense in robotics. With strong leadership and communication skills, I lead IPR and robotics at IEDC, serve on IEEE Execom, and turn innovations into market‑ready solutions"}
                </p>
              </div>
            </div>

            {/* Pill Tags */}
            <div
              className={cn(
                "flex flex-wrap gap-2 sm:gap-3 transition-all duration-700 delay-400",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              {pillTags.map((tag, index) => (
                <span
                  key={tag}
                  className={cn(
                    "px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-white/70 glass transition-all duration-500",
                    "hover:text-white hover:bg-white/10 hover:scale-105",
                    isVisible && "animate-fade-in"
                  )}
                  style={{
                    fontFamily: 'var(--font-inter)',
                    animationDelay: `${500 + index * 80}ms`,
                    animationFillMode: 'both',
                    opacity: 0
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column - Portrait (Desktop only) - 3D Gyroscope Parallax */}
          <div
            ref={photoContainerRef}
            className={cn(
              "hidden lg:flex relative justify-center lg:justify-end transition-all duration-1000 delay-300",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            )}
            style={{ perspective: '1500px' }}
          >
            <div 
              className="relative transition-transform duration-300 ease-out"
              style={{
                transform: `rotateX(${desktopTransform.rotateX}deg) rotateY(${desktopTransform.rotateY}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Glass overlays - move on different Z layers */}
              <div 
                className="absolute -top-4 -left-4 w-32 h-32 rounded-2xl glass rotate-12 transition-transform duration-300 ease-out"
                style={{
                  transform: `translateZ(${desktopHovering ? -30 : 0}px) rotate(12deg)`,
                }}
              />
              <div 
                className="absolute -bottom-4 -right-4 w-40 h-24 rounded-2xl glass transition-transform duration-300 ease-out"
                style={{
                  transform: `translateZ(${desktopHovering ? -40 : 0}px) rotate(-6deg)`,
                }}
              />
              <div 
                className="absolute top-1/2 -right-8 w-24 h-40 rounded-2xl glass transition-transform duration-300 ease-out"
                style={{
                  transform: `translateZ(${desktopHovering ? -25 : 0}px) rotate(3deg)`,
                }}
              />

              {/* Main photo container - Frame that stays back */}
              <div 
                className="relative w-80 h-[440px] sm:w-96 sm:h-[520px] lg:w-[420px] lg:h-[560px] rounded-3xl"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Gradient border frame - stays at base Z */}
                <div 
                  className="absolute inset-0 rounded-3xl p-[3px] bg-gradient-to-br from-emerald-500/40 via-transparent to-blue-500/40 transition-transform duration-300 ease-out"
                  style={{
                    transform: `translateZ(${desktopHovering ? -20 : 0}px)`,
                  }}
                >
                  <div className="w-full h-full rounded-3xl bg-[#0a0a0a]" />
                </div>

                {/* Photo that pops OUT of the frame */}
                <div 
                  className="absolute inset-[3px] rounded-[21px] overflow-hidden transition-transform duration-300 ease-out"
                  style={{
                    transform: `translateZ(${desktopHovering ? 60 : 0}px) scale(${desktopHovering ? 1.02 : 1})`,
                    boxShadow: desktopHovering 
                      ? '0 40px 80px rgba(0,0,0,0.6), 0 20px 40px rgba(0,0,0,0.4), 0 0 60px rgba(16,185,129,0.15)' 
                      : 'none',
                  }}
                >
                  <Image
                    src="https://res.cloudinary.com/dqrpav05c/image/upload/v1775975309/t8qqrzci9sietlzsnlxp.png"
                    alt="Akash Krishna U"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 320px, (max-width: 1024px) 384px, 420px"
                    priority
                  />
                  {/* Glass liquid overlay across photo */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-white/[0.01]" />
                  {/* Bottom gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
                </div>

                {/* Floating card that pops out even MORE */}
                <div 
                  className="absolute inset-x-4 bottom-4 p-4 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] transition-all duration-300 ease-out"
                  style={{
                    transform: `translateZ(${desktopHovering ? 100 : 20}px)`,
                    boxShadow: desktopHovering 
                      ? '0 30px 60px rgba(0,0,0,0.5), 0 15px 30px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.05)' 
                      : '0 10px 30px rgba(0,0,0,0.3)',
                  }}
                >
                  <p className="text-sm text-white/90 font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
                    Akash Krishna U
                  </p>
                  <p className="text-xs text-white/60" style={{ fontFamily: 'var(--font-inter)' }}>
                    Founder · Builder · Innovator
                  </p>
                </div>

                {/* Glow effect - stays behind everything */}
                <div 
                  className="absolute -inset-8 bg-emerald-500/15 blur-3xl rounded-full opacity-60 transition-all duration-300 ease-out"
                  style={{
                    transform: `translateZ(-50px) rotateX(${desktopTransform.rotateX * 0.3}deg) rotateY(${desktopTransform.rotateY * 0.3}deg)`,
                    opacity: desktopHovering ? 0.8 : 0.5,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
