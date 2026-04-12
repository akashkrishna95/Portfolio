"use client"

import { useRef, useEffect, useState, useCallback, useMemo, memo } from 'react'
import { ExternalLink, Cpu, Palette, FileText, Users, Wrench, Rocket, Bot, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'

const portfolioItems = [
  {
    category: 'Startup · Agritech · Robotics',
    title: 'Agni Robotics',
    description: "Founded by Akash Krishna U, an Edge Native Agentic AI Autonomous UGV Robotics solutions from Farmlands to Defence, built to scale.",
    link: 'https://agnirobotics.com',
    tags: ['agnirobotics.com'],
    featured: true,
    size: 'large',
    icon: Rocket,
    gradient: 'from-emerald-500/20 to-green-500/20',
  },
  {
    category: 'Agentic AI · SaaS',
    title: 'Autonomous Solutions Platform',
    description: 'Company platform delivering edge native autonomous workflow solutions powered by agentic AI — end-to-end intelligent automation for enterprise use cases.',
    link: 'https://agnirobotics.com',
    tags: ['agnirobotics.com'],
    size: 'medium',
    icon: Bot,
    gradient: 'from-violet-500/20 to-purple-500/20',
  },
  {
    category: 'Embedded Systems',
    title: 'Native AI Edge Dev',
    description: 'On-device AI inference systems with zero cloud dependency — built for field-deployed robotics.',
    tags: ['Embedded', 'Edge AI'],
    size: 'small',
    icon: Cpu,
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    category: 'UI/UX Design',
    title: 'Product & Brand Design',
    description: 'End-to-end visual systems for startups — from design systems to launch-ready interfaces.',
    tags: ['Canva', 'Photoshop', 'Brand Identity'],
    size: 'small',
    icon: Palette,
    gradient: 'from-pink-500/20 to-rose-500/20',
  },
  {
    category: 'IP & Research',
    title: 'Patent Filing & Research',
    description: 'IPR strategy and documentation for engineering innovations — led as IEDC IPR & Research Lead.',
    tags: ['Patents', 'IEDC'],
    size: 'medium',
    icon: FileText,
    gradient: 'from-amber-500/20 to-orange-500/20',
  },
  {
    category: 'Freelancing',
    title: 'Client Projects',
    description: 'UI/UX Design, development, Event Management and strategy work delivered for clients across industries.',
    tags: ['Available for hire'],
    size: 'small',
    icon: Briefcase,
    gradient: 'from-teal-500/20 to-emerald-500/20',
  },
  {
    category: 'Hardware Prototyping',
    title: 'Rapid Fabrication & Systems Design',
    description: 'End-to-end product development—from custom PCB design and CAD modeling to 3D-printed robotic prototypes.',
    tags: ['CAD', 'PCB Design', 'Fabrication'],
    size: 'medium',
    icon: Wrench,
    gradient: 'from-slate-500/20 to-zinc-500/20',
  },
  {
    category: 'Leadership',
    title: 'Volunteer Executive Leadership',
    description: 'Driving strategy and hands-on execution across diverse roles—leading teams, events, and resources to scale community impact.',
    tags: ['Team Leadership', 'Project Management'],
    size: 'medium',
    icon: Users,
    gradient: 'from-indigo-500/20 to-blue-500/20',
  },
]

export default function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setActiveCard(index)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setActiveCard(null)
  }, [])

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-32 bg-[#0a0a0a] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/10 via-transparent to-transparent" />

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
            Portfolio
          </span>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-16">
          <h2
            className={cn(
              "text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ fontFamily: 'var(--font-garet), system-ui, sans-serif' }}
          >
            Where ideas become real systems.
          </h2>
          <p
            className={cn(
              "text-sm sm:text-base lg:text-lg text-white/60 leading-relaxed transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            A curated selection spanning autonomous robotics, agentic AI, embedded development, and design — each one built with intent and a bias for impact.
          </p>
        </div>

        {/* Bento Grid - Full coverage with reduced height */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4" style={{ gridAutoRows: 'minmax(100px, auto)' }}>
          {portfolioItems.map((item, index) => {
            const isLarge = item.size === 'large'
            const isMedium = item.size === 'medium'
            const Icon = item.icon

            return (
              <div
                key={item.title}
                className={cn(
                  "group relative rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden transition-all duration-500",
                  "bg-white/[0.02] border border-white/[0.06]",
                  "hover:border-white/[0.15] hover:-translate-y-1",
                  // Desktop sizing - Agni Robotics largest
                  isLarge && "lg:col-span-2 lg:row-span-2",
                  isMedium && "lg:col-span-2",
                  // Mobile: Agni Robotics full width, Leadership card spans 2 cols on mobile
                  index === 0 && "col-span-2 row-span-2",
                  // Leadership card (index 7) spans full width on mobile
                  index === 7 && "col-span-2",
                  // Small items on mobile still look like bento - reduced height
                  !isLarge && index !== 0 && "min-h-[90px] sm:min-h-[100px] lg:min-h-[120px]",
                  activeCard === index && "card-active",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
                  item.link && "cursor-pointer"
                )}
                style={{
                  transitionDelay: `${150 + index * 80}ms`,
                }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                  if (item.link) {
                    window.open(item.link, '_blank', 'noopener,noreferrer')
                  } else {
                    setActiveCard(activeCard === index ? null : index)
                  }
                }}
              >
                {/* Radial spotlight on hover */}
                {activeCard === index && (
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300 hidden sm:block"
                    style={{
                      background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(130, 243, 184, 0.08), transparent 40%)`,
                    }}
                  />
                )}

                {/* Gradient background */}
                <div className={cn(
                  "absolute inset-0 opacity-40 transition-opacity duration-300",
                  `bg-gradient-to-br ${item.gradient}`,
                  activeCard === index && "opacity-60"
                )} />

                <div className={cn(
                  "relative p-3 sm:p-4 lg:p-5 h-full flex flex-col",
                  isLarge && "lg:p-6",
                  index === 0 && "p-4 sm:p-5"
                )}>
                  {/* Icon */}
                  <div className={cn(
                    "w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center mb-2 transition-colors",
                    "bg-white/[0.05]",
                    activeCard === index && "bg-white/[0.1]",
                    index === 0 && "w-10 h-10 sm:w-12 sm:h-12"
                  )}>
                    <Icon className={cn(
                      "w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white/50",
                      activeCard === index && "text-emerald-400",
                      index === 0 && "w-5 h-5 sm:w-6 sm:h-6"
                    )} />
                  </div>

                  {/* Category pill */}
                  <span
                    className={cn(
                      "inline-block px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] lg:text-xs text-white/50 bg-white/[0.05] mb-1.5 sm:mb-2 w-fit",
                      index === 0 && "text-[10px] sm:text-xs"
                    )}
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {item.category}
                  </span>

                  {/* Title */}
                  <h3
                    className={cn(
                      "font-bold text-white mb-1 transition-colors duration-300 card-title",
                      isLarge || index === 0 ? "text-sm sm:text-base lg:text-xl" : "text-xs sm:text-sm lg:text-base",
                      activeCard === index && "text-emerald-400"
                    )}
                    style={{ fontFamily: 'var(--font-garet), system-ui, sans-serif' }}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={cn(
                      "text-white/50 leading-relaxed mb-2 flex-grow",
                      isLarge || index === 0 ? "text-[10px] sm:text-xs lg:text-sm" : "text-[9px] sm:text-[10px] lg:text-xs"
                    )}
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {item.description}
                  </p>

                  {/* Tags and Link */}
                  <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-auto">
                    {item.tags.slice(0, index === 0 ? 1 : 1).map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          "px-1.5 sm:px-2 py-0.5 rounded-full text-white/40 bg-white/[0.03] border border-white/[0.06]",
                          index === 0 ? "text-[9px] sm:text-[10px]" : "text-[8px] sm:text-[9px]"
                        )}
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        {tag}
                      </span>
                    ))}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white/60 hover:text-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Bottom border glow on active */}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-emerald-400 to-blue-500 transition-opacity duration-300",
                    activeCard === index ? "opacity-100" : "opacity-0"
                  )}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
