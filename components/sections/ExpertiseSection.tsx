"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, Palette, Users, FileText, Rocket, GraduationCap, 
  Presentation, Wrench, Brain, ScrollText, Focus
} from 'lucide-react'
import { cn } from '@/lib/utils'

const expertiseData = [
  {
    id: 1,
    title: 'IEDC Robotics Lead',
    description: (
      <>
        Served as <span className="text-emerald-400 font-semibold">Robotics Lead</span> on the IEDC Execom — designing and delivering{' '}
        <span className="text-emerald-400 font-semibold">hands-on training programs</span> in robotics, CAD, PCB design, and embedded systems. Drove the{' '}
        <span className="text-emerald-400 font-semibold">prototyping pipeline from concept to market-ready build</span>,
        mentoring peers through real engineering challenges while sharpening {' '}
        <span className="text-emerald-400 font-semibold">leadership and cross-team communication</span> at scale.
      </>
    ),
    details: ['Robotics Systems', 'CAD Design', 'PCB Design', 'Embedded Systems', 'Prototyping', 'Team Mentoring'],
    icon: Bot,
    color: 'emerald',
    year: 'Jan 2025 – Feb 2026',
  },
  {
    id: 2,
    title: 'UI/UX Designer Lead',
    description: (
      <>
        Served as <span className="text-pink-400 font-semibold">UI/UX Designer Lead</span> on the IEEE ComSoc Execom — owning the{' '}
        <span className="text-pink-400 font-semibold">visual and digital identity</span> of a 500+ member student chapter.
        Designed event collateral, motion assets, and digital campaigns. Built a{' '}
        <span className="text-pink-400 font-semibold">design-first culture</span> across the execom and elevated chapter branding to a professional standard.
      </>
    ),
    details: ['UI/UX Design', 'Figma', 'Motion Design', 'Brand Identity', 'IEEE Execom'],
    icon: Palette,
    color: 'pink',
    year: 'Jan 2025 – Feb 2026',
  },
  {
    id: 3,
    title: 'AKIASSC Execom Member',
    description: (
      <>
        Core execom member of <span className="text-indigo-400 font-semibold">AKIASSC</span>. Spearheaded{' '}
        <span className="text-indigo-400 font-semibold">end-to-end event planning and live execution</span> for a large-scale inter-college gathering,
        managing <span className="text-indigo-400 font-semibold">crowd logistics, participant coordination, and industry visit pipelines</span>.
      </>
    ),
    details: ['Event Management', 'Crowd Management', 'Logistics', 'Leadership', 'Delegate Coordination'],
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
        Building a structured research culture for <span className="text-rose-400 font-semibold">real-world commercialization</span>.
      </>
    ),
    details: ['Patent Drafting', 'Prior Art Search', 'IP Strategy', 'Research Publications', 'Tech Commercialization'],
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
        <span className="text-amber-400 font-semibold">agriculture, forestry, and field operations</span>, then engineering autonomous robotic systems.
        Advanced through <span className="text-amber-400 font-semibold">KSUM pre-incubation</span>.
      </>
    ),
    details: ['Startup Founding', 'Autonomous Robotics', 'KSUM Pre-incubated', 'Product Strategy', 'Hardware Startup'],
    icon: Rocket,
    color: 'amber',
    year: 'Jun 2025 – Present',
  },
  {
    id: 6,
    title: 'YIP Volunteer & Intern',
    description: (
      <>
        Active volunteer and intern at <span className="text-teal-400 font-semibold">YIP</span> — the Young Innovators Programme,{' '}
        <span className="text-teal-400 font-semibold">Kerala Government's flagship initiative</span>.
        Operating inside Kerala's most competitive student innovation ecosystems, with direct exposure to{' '}
        <span className="text-teal-400 font-semibold">government-backed startup infrastructure</span>.
      </>
    ),
    details: ['YIP', 'Kerala Government', 'KSUM', 'Event Volunteering', 'Student Entrepreneurship'],
    icon: GraduationCap,
    color: 'teal',
    year: 'Nov 2025 – Present',
  },
  {
    id: 7,
    title: 'Idea Evaluation & Pitching',
    color: 'violet',
    description: (
      <>
        Continuously validating and pitching early-stage ideas across{' '}
        <span className="text-violet-400 font-semibold">state-level and national competitions</span>. Built a repeatable process for
        ideation, market sizing, and live pitch delivery — earning placements like{' '}
        <span className="text-violet-400 font-semibold">YIP 8.0 State Winner</span>.
      </>
    ),
    details: ['Idea Validation', 'Pitch Decks', 'Business Modelling', 'Startup Strategy', 'YIP 8.0 Winner'],
    icon: Presentation,
    year: 'Dec 2025 – Present',
  },
  {
    id: 8,
    title: 'Prototype Iteration',
    description: (
      <>
        Running an intensive <span className="text-blue-400 font-semibold">build-test-iterate loop</span> to develop a
        field-deployable autonomous robotics product. Over{' '}
        <span className="text-blue-400 font-semibold">20 documented test cycles</span> across hardware configurations
        and sensor integrations.
      </>
    ),
    details: ['Rapid Prototyping', 'Hardware Iteration', 'Product Development', 'Field Deployment', 'Reliability Engineering'],
    icon: Wrench,
    color: 'blue',
    year: 'Jan 2026 – Present',
  },
  {
    id: 9,
    title: 'Agentic AI Systems',
    description: (
      <>
        Architecting <span className="text-yellow-400 font-semibold">Edge Native Agentic AI Cognitive systems</span> that operate beyond prompt-and-response.
        Designing autonomous decision engines using{' '}
        <span className="text-yellow-400 font-semibold">LLM orchestration, tool-use frameworks, and real-time sensor data</span>.
      </>
    ),
    details: ['Agentic AI', 'LLM Orchestration', 'Autonomous Pipelines', 'Multi-agent Systems', 'Edge AI'],
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
        <span className="text-sky-400 font-semibold">agentic AI and autonomous mapping systems</span>.
        Conducted structured <span className="text-sky-400 font-semibold">prior art searches</span>, drafted formal claim sets, and coordinated the IP pipeline.
      </>
    ),
    details: ['Patent Filing', 'Agentic AI Patent', 'Autonomous Mapping IP', 'Prior Art Search', 'Claim Writing'],
    icon: ScrollText,
    color: 'sky',
    year: 'Apr 2026 – Present',
  },
]

const themeColors: Record<string, string> = {
  emerald: '#10b981', blue: '#3b82f6', violet: '#8b5cf6',
  amber: '#f59e0b', pink: '#ec4899', orange: '#f97316',
  cyan: '#06b6d4', indigo: '#6366f1', rose: '#f43f5e',
  teal: '#14b8a6', yellow: '#eab308', sky: '#0ea5e9',
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

const wheelPhysics = { type: "spring", stiffness: 90, damping: 20, mass: 1.2 };

export default function CommandArc() {
  const [activeIndex, setActiveIndex] = useState(0); 
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setActiveIndex(prev => prev + 1);
      if (e.key === 'ArrowLeft') setActiveIndex(prev => prev - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const normalizedIndex = ((activeIndex % 10) + 10) % 10;
  const activeItem = expertiseData[normalizedIndex];
  const activeColor = themeColors[activeItem.color];

  const anglePerNode = 36; 
  const targetAngle = -90; 
  const dialRotation = targetAngle - (activeIndex * anglePerNode);

  if (!isClient) return null; 

  return (
    <section id="expertise" className="relative h-[100dvh] w-full bg-[#020202] overflow-hidden flex flex-col selection:bg-white/20 font-sans">
      
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        animate={{ background: `radial-gradient(circle at 50% 100%, ${activeColor}20 0%, #020202 70%)` }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      <motion.div 
        className="relative w-full flex-1 flex flex-col items-center pt-[22vh] md:pt-24 px-4 sm:px-8 z-10 pb-[250px] cursor-grab active:cursor-grabbing overflow-y-auto custom-scrollbar"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, { offset, velocity }) => {
          const swipe = swipePower(offset.x, velocity.x);
          if (swipe < -swipeConfidenceThreshold) setActiveIndex(prev => prev + 1);
          else if (swipe > swipeConfidenceThreshold) setActiveIndex(prev => prev - 1);
        }}
      >
        <div className="w-full max-w-3xl flex flex-col items-center text-center pointer-events-none">
          
          <div className="-mt-10 md:-mt-16 mb-14 md:mb-20">
            <h2 
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight"
              style={{ fontFamily: 'var(--font-garet), system-ui, sans-serif' }}
            >
              Journey of My Expertise
            </h2>
            <p 
              className="text-white/40 text-sm md:text-base leading-relaxed max-w-xl mx-auto"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {isMobile ? "Swipe to rotate the command arc and inspect the cognitive layers." : "Use arrow keys or click the command arc to navigate between layers."}
            </p>
          </div>

          <div className="relative w-full flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex} 
                initial={{ opacity: 0, y: 20, filter: "blur(8px)", scale: 0.95 }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)", scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center w-full"
              >
                
                <span 
                  className="text-xs md:text-sm text-white/50 mb-3 md:mb-4 uppercase tracking-widest font-medium"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {activeItem.year}
                </span>

                <h3 
                  className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight drop-shadow-md px-2"
                  style={{ fontFamily: 'var(--font-garet), system-ui, sans-serif' }}
                >
                  {activeItem.title}
                </h3>

                <p 
                  className="text-sm md:text-base lg:text-lg text-white/70 leading-relaxed mb-6 lg:mb-8 max-w-2xl px-2"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  {activeItem.description}
                </p>

                <div className="flex flex-wrap justify-center gap-2 px-2">
                  {activeItem.details.map((detail, i) => (
                    <motion.span
                      key={detail}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + (i * 0.05) }}
                      className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] md:text-xs bg-white/5 text-white/60 border border-white/5 shadow-sm whitespace-nowrap"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {detail}
                    </motion.span>
                  ))}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </motion.div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-end justify-center">
        
        <motion.div 
          className={cn(
            "relative rounded-full border border-white/10 pointer-events-auto flex items-center justify-center",
            "w-[500px] h-[500px] md:w-[1200px] md:h-[1200px]", 
            "translate-y-[75%] md:translate-y-[78%]" 
          )}
          animate={{ rotate: dialRotation }}
          transition={wheelPhysics}
        >
          
          <div className="absolute inset-4 rounded-full border border-white/[0.03]" />
          <div className="absolute inset-12 rounded-full border border-white/[0.02]" />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xl rounded-full -z-10" />

          <div className="absolute w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white/20" />
          </div>

          {expertiseData.map((item, i) => {
            const offsetFromActive = (i - normalizedIndex);
            let shortestOffset = offsetFromActive;
            if (shortestOffset > 5) shortestOffset -= 10;
            if (shortestOffset < -5) shortestOffset += 10;
            
            const targetIndex = activeIndex + shortestOffset;
            const isActive = targetIndex === activeIndex;

            const hexColor = themeColors[item.color];
            const baseAngle = i * anglePerNode;
            
            const iconRotation = -(dialRotation + baseAngle);

            return (
              <div
                key={item.id}
                className="absolute top-1/2 left-1/2 w-full h-0 flex items-center justify-end pointer-events-none"
                style={{ transform: `translate(-50%, -50%) rotate(${baseAngle}deg)` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 flex items-center justify-center pointer-events-auto">
                  <motion.div
                    onClick={() => setActiveIndex(targetIndex)}
                    animate={{ 
                      rotate: iconRotation, 
                      scale: isActive ? (isMobile ? 1.3 : 1.5) : 1,
                    }}
                    transition={wheelPhysics}
                    className={cn(
                      "relative flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-colors duration-300 backdrop-blur-xl border",
                      isActive 
                        ? "bg-[#0a0a0a] shadow-2xl z-50 border-white/30" 
                        : "bg-white/5 border-white/10 hover:bg-white/10 z-10",
                      "w-12 h-12 md:w-16 md:h-16" 
                    )}
                    style={{
                      boxShadow: isActive ? `0 0 50px -10px ${hexColor}80` : 'none',
                      color: isActive ? hexColor : '#ffffff80'
                    }}
                  >
                    <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                    
                    <span className={cn(
                      "absolute -bottom-6 text-[9px] font-mono transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-0"
                    )} style={{ color: hexColor }}>
                      {item.id < 10 ? `0${item.id}` : item.id}
                    </span>
                  </motion.div>
                </div>
              </div>
            )
          })}
        </motion.div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[65%] pointer-events-none hidden md:flex flex-col items-center">
          <motion.div 
            className="w-px h-16 mb-4 rounded-full"
            animate={{ background: `linear-gradient(to top, ${activeColor}00, ${activeColor}80, ${activeColor}00)` }}
            transition={{ duration: 0.5 }}
          />
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/30" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/30" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/30" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/30" />
            
            <motion.div animate={{ color: activeColor }} transition={{ duration: 0.5 }} className="opacity-50">
              <Focus className="w-6 h-6" />
            </motion.div>
          </div>
        </div>

      </div>
      
    </section>
  )
}
