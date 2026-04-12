"use client"

import { useRef, useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const testimonials = [
  {
    name: "Prof. Jithin Jacob",
    role: "Dean of CSE Dept, UKFCET",
    quote: "Even with low attendance, Akash proudly represents his college — an entrepreneurial mindset, technically brilliant student with true passion for impact.",
    rating: 5,
  },
  {
    name: "Dr. Biju K",
    role: "KTU Asst. Director & Mentor",
    quote: "At first I doubted him, but Akash amazed me with his ability to explain complex robotics to non‑technical audiences during pitches. A natural founder, with a brilliant way of solving tough problems.",
    rating: 5,
  },
  {
    name: "Asst. Prof Athira",
    role: "IEDC Coordinator",
    quote: "I've seen Akash's dedication in IEDC — he earned more recognitions than most students and truly deserves to always be on Execom.",
    rating: 5,
  },
  {
    name: "Dr. Reshmi Deepak",
    role: "IEEE Regional Chair",
    quote: "His event management skills and technical depth make him an invaluable member of the IEEE Execom. A true leader.",
    rating: 4.5,
  },
  {
    name: "Gopakumar",
    role: "Startup Advisor - Wadhwani Foundation", // ✅ Fixed: missing comma was here
    quote: "I mentored Akash on shaping his company, and his dedication to making it scalable and market‑ready is clear — he quickly jumps into everything with full commitment.",
    rating: 4,
  },
  {
    name: "Mithun",
    role: "Prototype Mentor",
    quote: "Akash has a strong curiosity for acquiring knowledge beyond the syllabus and demonstrates an excellent ability to apply that knowledge to real-life problem-solving situations.",
    rating: 4.5,
  },
  {
    name: "Asst Prof. Ansha",
    role: "Class Advisor",
    quote: "Akash has demonstrated the ability to effectively apply his academic knowledge in a practical way. His effort reflects dedication and a positive contribution to the college’s academic environment.",
    rating: 5,
  },
  {
    name: "Krishnashree",
    role: "KSUM Technical Lead",
    quote: "Impressive thing about him is he has ultimate patience whenever something goes wrong and finds alternative solutions immediately and works towards it",
    rating: 5,
  },
  {
    name: "Justin",
    role: "YIP Program Manager",
    quote: "Among 1,400+ ideas, Akash's presentation stood out for its clarity, depth, and genuine problem-solving approach.",
    rating: 5,
  },
  {
    name: "Asst. Prof Vishnu",
    role: "IEDC Nodal Officer, UKFCET",
    quote: "He's one of best at coordinating program of IEDC, from his achievements it boosted IEDC reputation in college.",
    rating: 5,
  },
]

// Duplicate for seamless loop
const row1 = [...testimonials, ...testimonials]
const row2 = [
  ...testimonials.slice(4),
  ...testimonials.slice(0, 4),
  ...testimonials.slice(4),
  ...testimonials.slice(0, 4),
]

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

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
      id="testimonials"
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-32 bg-[#0a0a0a] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/10 via-transparent to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 mb-8 sm:mb-12">
        {/* Section Eyebrow */}
        <div
          className={cn(
            "flex justify-start mb-8 sm:mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs sm:text-sm text-white/60"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Testimonials
          </span>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl">
          <h2
            className={cn(
              "text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ fontFamily: 'var(--font-garet), system-ui, sans-serif' }}
          >
            {"Words from those who've seen it firsthand."}
          </h2>
        </div>
      </div>

      {/* Scrolling testimonials */}
      <div
        className={cn(
          "relative transition-all duration-1000 delay-200",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 lg:w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 lg:w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        {/* Row 1 - Moving left */}
        <div className="mb-3 sm:mb-4 lg:mb-6 overflow-hidden">
          <div
            className={cn(
              "flex gap-2 sm:gap-4 lg:gap-6",
              isPaused ? "[animation-play-state:paused]" : ""
            )}
            style={{
              animation: 'scroll-left 60s linear infinite',
              width: 'max-content',
            }}
          >
            {row1.map((testimonial, index) => (
              <TestimonialCard key={`row1-${index}`} testimonial={testimonial} />
            ))}
          </div>
        </div>

        {/* Row 2 - Moving right */}
        <div className="overflow-hidden">
          <div
            className={cn(
              "flex gap-2 sm:gap-4 lg:gap-6",
              isPaused ? "[animation-play-state:paused]" : ""
            )}
            style={{
              animation: 'scroll-right 60s linear infinite',
              width: 'max-content',
            }}
          >
            {row2.map((testimonial, index) => (
              <TestimonialCard key={`row2-${index}`} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}

// ✅ Fixed: Renders full, half, and empty stars correctly for non-integer ratings like 4.5
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)

  return (
    <div className="flex gap-0.5 mb-2 sm:mb-3 lg:mb-4">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 fill-amber-400 text-amber-400" />
      ))}
      {hasHalf && (
        <span className="relative inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4">
          {/* Empty star base */}
          <Star className="absolute inset-0 w-full h-full text-amber-400" />
          {/* Half-filled overlay using clip */}
          <span className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-full h-full fill-amber-400 text-amber-400" />
          </span>
        </span>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-amber-400" />
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="group flex-shrink-0 w-[200px] sm:w-[260px] lg:w-[300px] p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl lg:rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-300">
      {/* Avatar and Info */}
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 lg:mb-4">
        <div className="w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/[0.1] flex items-center justify-center">
          <span
            className="text-[10px] sm:text-xs lg:text-sm font-semibold text-white/80"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {testimonial.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h4
            className="text-xs sm:text-sm lg:text-base text-white font-medium truncate"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {testimonial.name}
          </h4>
          <p
            className="text-[9px] sm:text-xs lg:text-sm text-white/40 truncate"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {testimonial.role}
          </p>
        </div>
      </div>

      {/* Stars - now handles 4.5 correctly */}
      <StarRating rating={testimonial.rating} />

      {/* Quote */}
      <p
        className="text-[10px] sm:text-xs lg:text-sm text-white/60 leading-relaxed line-clamp-3 sm:line-clamp-4"
        style={{ fontFamily: 'var(--font-poppins)' }}
      >
        {`"${testimonial.quote}"`}
      </p>
    </div>
  )
}