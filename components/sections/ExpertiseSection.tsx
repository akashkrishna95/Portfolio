"use client"

import { useRef, useEffect, useState, useCallback } from 'react'
import { Bot, Palette, Users, FileText, Rocket, GraduationCap, Presentation, Wrench, Brain, ScrollText, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const expertiseData = [
  {
    id: 1,
    title: 'IEDC Robotics Lead',
    description: (
      <>
        Served as <span className="text-emerald-400 font-semibold">Robotics Lead</span> on the IEDC Execom — designing and delivering{' '}
        <span className="text-emerald-400 font-semibold">hands-on training programs</span> in robotics, CAD, PCB design, and embedded systems for a college-wide cohort. Drove the{' '}
        <span className="text-emerald-400 font-semibold">prototyping pipeline from concept to market-ready build</span>,
        mentoring peers through real engineering challenges while sharpening {' '}
        <span className="text-emerald-400 font-semibold">leadership and cross-team communication</span>  at scale.
      </>
    ),
    details: ['Robotics Systems', 'CAD Design', 'PCB Design', 'Embedded Systems', 'Prototyping', 'Team Mentoring', 'Autonomous Systems', 'IEDC Execom', 'Communication', 'Workshop Design'],
    icon: Bot,
    color: 'emerald',
    year: 'Jan 2025 – Feb 2026',
  },
  {
    id: 2,
    title: ' IEEE UI/UX Designer Lead',
    description: (
      <>
        Served as <span className="text-pink-400 font-semibold">UI/UX Designer Lead</span> on the IEEE ComSoc Execom — owning the{' '}
        <span className="text-pink-400 font-semibold">visual and digital identity</span> of a 500+ member student chapter.
        Designed event collateral, motion assets, and digital campaigns end-to-end using{' '}
        <span className="text-pink-400 font-semibold">Capcut, Photoshop, Canva, etc</span>. Hosted inter-college design and photography bootcamps,
        bridging technical rigor with creative craft. Built a{' '}
        <span className="text-pink-400 font-semibold">design-first culture</span> across the execom and elevated chapter branding to a professional standard.
      </>
    ),
    details: ['UI/UX Design', 'Figma', 'Adobe Photoshop', 'Canva', 'Photography', 'Video Editing', 'Motion Design', 'Brand Identity', 'IEEE Execom', 'Bootcamp Hosting', 'Inter-college Events', 'Visual Communication'],
    icon: Palette,
    color: 'pink',
    year: 'Jan 2025 – Feb 2026',
  },
  {
    id: 3,
    title: 'AKIASSC Execom Member · IEEE Kerala Section',
    description: (
      <>
        Core execom member of <span className="text-indigo-400 font-semibold">AKIASSC</span> — the All Kerala IEEE Annual Students' Summit and Congress,
        hosted at UKFCET Parippally. Spearheaded{' '}
        <span className="text-indigo-400 font-semibold">end-to-end event planning and live execution</span> for a large-scale inter-college gathering,
        managing <span className="text-indigo-400 font-semibold">crowd logistics, participant coordination, and industry visit pipelines</span>.
        Delivered a seamless on-ground experience for delegates across Kerala under the IEEE umbrella.
      </>
    ),
    details: ['Event Management', 'Crowd Management', 'Industrial Visits', 'IEEE Kerala', 'Delegate Coordination', 'Logistics', 'Inter-college Program', 'On-ground Execution', 'AKIASSC', 'Leadership'],
    icon: Users,
    color: 'indigo',
    year: 'Jun 2025 – Aug 2025',
  },
  {
    id: 4,
    title: 'IEDC IPR & Research Lead',
    description: (
      <>
        Leading <span className="text-rose-400 font-semibold">intellectual property documentation and research strategy</span> for the college's IEDC chapter —
        guiding student innovators through{' '}
        <span className="text-rose-400 font-semibold">patent drafting, prior art search, and formal IP filing</span> processes.
        Building a structured research culture that protects original engineering work and positions student inventions for{' '}
        <span className="text-rose-400 font-semibold">real-world commercialization</span>. Active pipeline of patents under review.
      </>
    ),
    details: ['Patent Drafting', 'Prior Art Search', 'IP Documentation', 'IP Strategy', 'Research Publications', 'IEDC IPR Lead', 'Innovation Protection', 'Tech Commercialization', 'Research Mentoring'],
    icon: FileText,
    color: 'rose',
    year: 'Mar 2026 – Present',
  },
  {
    id: 5,
    title: 'Agni Robotics — Founder & CEO',
    description: (
      <>
        Founded <span className="text-amber-400 font-semibold">Agni Robotics</span> from a ground-level ideation sprint — identifying real unsolved problems in{' '}
        <span className="text-amber-400 font-semibold">agriculture, forestry, and field operations</span>, then engineering autonomous robotic systems designed to scale.
        Refined the concept through rigorous market validation, built and led a founding team, and advanced through{' '}
        <span className="text-amber-400 font-semibold">KSUM pre-incubation</span>. Learning what it truly means to be a founder: shipping, failing fast, iterating,
        and building something that outlasts the idea.
      </>
    ),
    details: ['Agni Robotics', 'Startup Founding', 'Autonomous Robotics', 'Team Building', 'KSUM Pre-incubated', 'Product Strategy', 'Market Validation', 'AgriTech', 'Founder Leadership', 'Go-to-market', 'Hardware Startup'],
    icon: Rocket,
    color: 'amber',
    year: 'Jun 2025 – Present',
  },
  {
    id: 6,
    title: 'YIP Volunteer & Program Intern',
    description: (
      <>
        Active volunteer and intern at <span className="text-teal-400 font-semibold">YIP</span> — the Young Innovators Programme,{' '}
        <span className="text-teal-400 font-semibold">Kerala Government's flagship initiative</span> for student entrepreneurs.
        Supporting end-to-end event execution, participant intake, and program logistics across statewide editions.
        Operating inside one of Kerala's most competitive student innovation ecosystems, with direct exposure to{' '}
        <span className="text-teal-400 font-semibold">government-backed startup infrastructure, grant processes, and early-stage founder mentorship</span>.
      </>
    ),
    details: ['YIP', 'Kerala Government', 'KSUM', 'Event Volunteering', 'Program Execution', 'Student Entrepreneurship', 'Startup Ecosystem', 'Grant Programs', 'Stakeholder Coordination'],
    icon: GraduationCap,
    color: 'teal',
    year: 'Nov 2025 – Present',
  },
  {
    id: 7,
    title: 'Idea Evaluation & Startup Pitching',
    color: 'violet',
    description: (
      <>
        Continuously validating, stress-testing, and pitching early-stage ideas across{' '}
        <span className="text-violet-400 font-semibold">state-level and national competitions</span>. Built a repeatable process for
        ideation, market sizing, business modelling, and live pitch delivery — earning multiple top placements including{' '}
        <span className="text-violet-400 font-semibold">YIP 8.0 State Winner</span>,{' '}
        <span className="text-violet-400 font-semibold">Exovate'25 1st Place</span>, and Advaya'25 2nd Place.
        Backed by <span className="text-violet-400 font-semibold">Kerala Startup Mission</span> with a growing track record of turning raw ideas into winning narratives.
      </>
    ), // 2. Changed span classes from text-yellow-400 to text-violet-400
    details: ['Idea Validation', 'Pitch Decks', 'Business Modelling', 'Market Sizing', 'Investor Presentations', 'Startup Strategy', 'YIP 8.0 Winner', 'KSUM Backed', 'Go-to-market', 'Competitive Pitching', 'Storytelling'],
    icon: Presentation,
    year: 'Dec 2025 – Present',
  },
  {
    id: 8,
    title: 'Prototype Development & Iteration',
    description: (
      <>
        Running an intensive <span className="text-blue-400 font-semibold">build-test-iterate loop</span> to develop a
        field-deployable autonomous robotics product with a{' '}
        <span className="text-blue-400 font-semibold">Q4 2026 launch target</span>. Over{' '}
        <span className="text-blue-400 font-semibold">20 documented test cycles</span> across hardware configurations,
        sensor integrations, and software stacks — each iteration tightening reliability, efficiency, and scalability.
        Engineering for the real world: dusty, wet, uneven, and unforgiving.
      </>
    ),
    details: ['Rapid Prototyping', 'Hardware Iteration', '20+ Test Cycles', 'Product Development', 'Sensor Integration', 'System Testing', 'Q4 2026 Launch', 'Field Deployment', 'Scalable Design', 'MVP Development', 'Reliability Engineering'],
    icon: Wrench,
    color: 'blue',
    year: 'Jan 2026 – Present',
  },
  {
    id: 9,
    title: 'Agentic AI & Autonomous Platform Development',
    description: (
      <>
        Architecting <span className="text-yellow-400 font-semibold">Edge Native Agentic AI Cognitive systems that operate beyond prompt-and-response</span> — building full agentic pipelines that
        plan, execute multi-step tasks, and self-correct in dynamic environments. Designing{' '}
        <span className="text-yellow-400 font-semibold">autonomous decision engines</span> for field robotics and enterprise workflows using{' '}
        <span className="text-yellow-400 font-semibold">LLM orchestration, tool-use frameworks, and real-time sensor data</span>.
        The goal: intelligence that operates without a human in the loop.
      </>
    ),
    details: ['Agentic AI', 'LLM Orchestration', 'Autonomous Pipelines', 'Multi-agent Systems', 'Tool-use Frameworks', 'Workflow Automation', 'AI Product Design', 'Real-time Inference', 'Edge AI', 'Enterprise AI'],
    icon: Brain,
    color: 'yellow',
    year: 'Mar 2026 – Present',
  },
  {
    id: 10,
    title: 'Patent Filing & IP Strategy',
    description: (
      <>
        Filed patent applications for proprietary innovations in{' '}
        <span className="text-sky-400 font-semibold">agentic AI and autonomous mapping systems</span> — covering novel architecture decisions,
        system-level claims, and method patents. Conducted structured{' '}
        <span className="text-sky-400 font-semibold">prior art searches</span>, drafted formal claim sets, and coordinated the full IP documentation pipeline.
        A deliberate move to lock in{' '}
        <span className="text-sky-400 font-semibold">first-mover IP advantage</span> before product launch.
      </>
    ),
    details: ['Patent Filing', 'Agentic AI Patent', 'Autonomous Mapping IP', 'Prior Art Search', 'Patent Drafting', 'Claim Writing', 'IP Strategy', 'IEDC IPR Lead', 'Innovation Protection', 'Research Documentation'],
    icon: ScrollText,
    color: 'sky',
    year: 'Apr 2026 – Present',
  },
]

const colorClasses: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', glow: 'shadow-violet-500/20' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
  pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', glow: 'shadow-pink-500/20' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', glow: 'shadow-rose-500/20' },
  teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-400', glow: 'shadow-teal-500/20' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
  sky: { bg: 'bg-sky-500/10', border: 'border-sky-500/30', text: 'text-sky-400', glow: 'shadow-sky-500/20' },
}

export default function ExpertiseSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedExpertise, setSelectedExpertise] = useState(expertiseData[0])

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

  const handleViewMore = useCallback((expertise: typeof expertiseData[0]) => {
    setSelectedExpertise(expertise)
    setModalOpen(true)
  }, [])

  return (
    <section
      id="expertise"
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-32 bg-[#0a0a0a] overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-950/20 via-transparent to-transparent" />

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
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            Expertise
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
            A mind built across disciplines.
          </h2>
          <p
            className={cn(
              "text-sm sm:text-base lg:text-lg text-white/60 leading-relaxed transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            From embedded firmware to brand identity — my expertise spans the full arc of building a product, from circuit to screen to launch.
          </p>
        </div>

        {/* Medieval Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 sm:left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-violet-500/20 to-transparent lg:-translate-x-1/2" />

          {/* Timeline Items */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-12">
            {expertiseData.map((expertise, index) => {
              const Icon = expertise.icon
              const colors = colorClasses[expertise.color]
              const isEven = index % 2 === 0

              return (
                <div
                  key={expertise.id}
                  className={cn(
                    "relative transition-all duration-700",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                  )}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  {/* Timeline Dot */}
                  <div className={cn(
                    "absolute left-4 sm:left-8 lg:left-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full -translate-x-1/2 z-10",
                    colors.bg,
                    colors.border,
                    "border-2"
                  )}>
                    <div className={cn("absolute inset-0 rounded-full animate-ping opacity-20", colors.bg)} />
                  </div>

                  {/* Content Card */}
                  <div className={cn(
                    "ml-10 sm:ml-16 lg:ml-0 lg:w-[calc(50%-40px)]",
                    isEven ? "lg:mr-auto lg:pr-8" : "lg:ml-auto lg:pl-8"
                  )}>
                    <div
                      className={cn(
                        "group relative p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-500",
                        "bg-white/[0.02] border border-white/[0.06]",
                        "hover:bg-white/[0.04] hover:border-white/[0.12]",
                        "hover:-translate-y-1 hover:shadow-lg",
                        colors.glow
                      )}
                      onClick={() => handleViewMore(expertise)}
                    >
                      {/* Year Badge */}
                      <span
                        className={cn(
                          "absolute -top-2 sm:-top-3 right-3 sm:right-4 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs",
                          colors.bg, colors.text
                        )}
                        style={{ fontFamily: 'var(--font-inter)' }}
                      >
                        {expertise.year}
                      </span>

                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Icon */}
                        <div className={cn(
                          "flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                          colors.bg,
                          "group-hover:scale-110"
                        )}>
                          <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", colors.text)} />
                        </div>

                        <div className="flex-grow min-w-0">
                          {/* Number */}
                          <span className={cn("text-xs sm:text-sm font-bold opacity-50", colors.text)}
                            style={{ fontFamily: 'var(--font-inter)' }}>
                            {String(expertise.id).padStart(2, '0')}
                          </span>

                          {/* Title */}
                          <h3
                            className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2 group-hover:text-white/90 transition-colors"
                            style={{ fontFamily: 'var(--font-garet), system-ui, sans-serif' }}
                          >
                            {expertise.title}
                          </h3>

                          {/* Description */}
                          <p
                            className="text-xs sm:text-sm text-white/50 line-clamp-2 sm:line-clamp-3"
                            style={{ fontFamily: 'var(--font-poppins)' }}
                          >
                            {expertise.description}
                          </p>

                          {/* View More */}
                          <button
                            className={cn(
                              "mt-2 sm:mt-3 text-xs sm:text-sm transition-all duration-300",
                              colors.text,
                              "opacity-60 group-hover:opacity-100"
                            )}
                            style={{ fontFamily: 'var(--font-inter)' }}
                          >
                            View Details →
                          </button>
                        </div>
                      </div>

                      {/* Decorative line */}
                      <div className={cn(
                        "absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity",
                        `bg-gradient-to-r from-transparent via-${expertise.color}-500/50 to-transparent`
                      )} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative max-w-lg w-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl glass-strong animate-slide-up max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center",
                colorClasses[selectedExpertise.color].bg
              )}>
                <selectedExpertise.icon className={cn("w-5 h-5 sm:w-6 sm:h-6", colorClasses[selectedExpertise.color].text)} />
              </div>
              <span
                className={cn("px-3 py-1 rounded-full text-xs", colorClasses[selectedExpertise.color].bg, colorClasses[selectedExpertise.color].text)}
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                0{selectedExpertise.id}
              </span>
            </div>

            <h3
              className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4"
              style={{ fontFamily: 'var(--font-garet), system-ui, sans-serif' }}
            >
              {selectedExpertise.title}
            </h3>

            <p
              className="text-sm sm:text-base text-white/60 mb-4 sm:mb-6 leading-relaxed"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {selectedExpertise.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {selectedExpertise.details.map((detail) => (
                <span
                  key={detail}
                  className="px-3 py-1.5 rounded-full text-xs sm:text-sm text-white/70 bg-white/[0.05] border border-white/[0.1]"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {detail}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
