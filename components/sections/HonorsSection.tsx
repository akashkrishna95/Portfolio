"use client"

import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, X, Trophy, Rocket, Award, Medal, Lightbulb, Star, Crown, Zap } from 'lucide-react'
import CardSwap, { CardSwapHandle } from '@/components/CardSwap'

const awards = [
  {
    title: "YIP 8.0 — State Level Winner",
    organizer: "Kerala Government",
    year: "2026",
    description: "The Young Innovators Programme is one of Kerala's most competitive innovation challenges. Being selected among 31 from over 1,400 ideas is a validation of the depth and originality of the Agni Robotics concept.",
    highlight: "31 selected out of 1,400+ ideas",
    color: 'amber',
    Icon: Trophy,
    photos: ['https://res.cloudinary.com/dqrpav05c/image/upload/v1776014662/s7ujvzgqlbmzf6zdomna.svg','https://res.cloudinary.com/dqrpav05c/image/upload/v1775994961/nrtaevwy3g2rtl4xnpbh.svg', 'https://res.cloudinary.com/dqrpav05c/image/upload/v1775994367/rgxbbxusuh3rwsxlcju6.svg', 'https://res.cloudinary.com/dqrpav05c/image/upload/v1775995344/zfapvgwcydyowpkm2vsv.svg', 'https://res.cloudinary.com/dqrpav05c/image/upload/v1775994711/cbx64riep7auoah3k0ap.svg', 'https://res.cloudinary.com/dqrpav05c/image/upload/v1775994711/transozjuo4iv7nuqarp.svg', 'https://res.cloudinary.com/dqrpav05c/image/upload/v1775994712/g7fryastfrk3ypqchenj.svg'],
  },
  {
    title: "Pre-Incubated · Kerala Startup Mission",
    organizer: "KSUM Ideabox",
    year: "2025",
    description: "Officially recognised and pre-incubated by the Kerala Startup Mission — a milestone that opened access to mentorship, funding pathways, and the Kerala startup ecosystem.",
    highlight: "Certificate of Recognition",
    color: 'violet',
    Icon: Rocket,
    photos: ['https://res.cloudinary.com/dqrpav05c/image/upload/v1775996951/rrail6grcuv6qte5kqja.svg', 'https://res.cloudinary.com/dqrpav05c/image/upload/v1775996951/jxudzbj1wi2bzjyv6lka.svg'],
  },
  {
    title: "1st Place — Exovate'25 Idea Pitching",
    organizer: "BMCE",
    year: "February 2025",
    description: "Pitched live to a technical jury at BMCE and secured first place — a test of clarity, conviction, and commercial viability.",
    highlight: "Live technical pitch",
    color: 'emerald',
    Icon: Award,
    photos: ['https://res.cloudinary.com/dqrpav05c/image/upload/v1775996065/xlg9minjunshqxudjrpl.svg', 'https://res.cloudinary.com/dqrpav05c/image/upload/v1775996062/zmww8pgyynwatd26jybg.svg', 'https://res.cloudinary.com/dqrpav05c/image/upload/v1775996059/qmdoljzrstfjrba1gn2x.svg'],
  },
  {
    title: "2nd Place — Advaya'25 Startup Summit",
    organizer: "MTCE",
    year: "March 2025",
    description: "Competed at a cross-college startup summit and placed second — recognition from peers and industry mentors across disciplines.",
    highlight: "Cross-college competition",
    color: 'blue',
    Icon: Medal,
    photos: ['https://res.cloudinary.com/dqrpav05c/image/upload/v1775997344/t0ayl2ad7eiqnicuwqxl.svg', 'https://res.cloudinary.com/dqrpav05c/image/upload/v1775997348/nwcxynuaz8frouggzzxr.svg'],
  },
  {
    title: "3rd Place — UKFCET Ideathon'25",
    organizer: "UKF College",
    year: "February 2025",
    description: "Home ground ideathon — placed third while competing against a strong field of engineering peers.",
    highlight: "Engineering ideathon",
    color: 'cyan',
    Icon: Lightbulb,
    photos: ['https://res.cloudinary.com/dqrpav05c/image/upload/v1775998065/nbyowxhm3rxb8xvrkp7t.svg'],
  },
  {
    title: "3rd Place — Samrambhak Mithra Program",
    organizer: "State Level Entrepreneurship",
    year: "2024",
    description: "Recognised at a state-level entrepreneurship programme as a promising founder with a market-ready vision.",
    highlight: "State-level recognition",
    color: 'pink',
    Icon: Star,
    photos: ['https://res.cloudinary.com/dqrpav05c/image/upload/v1776014169/xjb5yqwgs9weh3qdljvz.svg','https://res.cloudinary.com/dqrpav05c/image/upload/v1775998975/jtjn0yqponxrwn2fufvj.svg'],
  },
  {
    title: "1st Prize Best Panel Performer — Talent Hunt '25",
    organizer: "Dale View College",
    year: "August 2025",
    description: "Awarded Best Performer — recognition for overall excellence spanning technical depth, communication, and leadership.",
    highlight: "Best overall performer",
    color: 'orange',
    Icon: Crown,
    photos: ['https://res.cloudinary.com/dqrpav05c/image/upload/v1775999907/wvzvdjkinylwqqv5umsj.svg', 'https://res.cloudinary.com/dqrpav05c/image/upload/v1776000500/y5ofhbzq1ycvh1c9qcta.svg', 'https://res.cloudinary.com/dqrpav05c/image/upload/v1776000507/vv6feru6h7gtrlig06n0.svg'],
  },
  {
    title: "2nd Place Pitching — Talent Hunt Youth '25",
    organizer: "Dale View College",
    year: "August 2025",
    description: "Competed in the youth category and secured second place — consistent performance across multiple formats at the same event.",
    highlight: "Youth category",
    color: 'indigo',
    Icon: Zap,
    photos: ['https://res.cloudinary.com/dqrpav05c/image/upload/v1775999920/h6xq94rundx65zelx6nf.svg', 'https://res.cloudinary.com/dqrpav05c/image/upload/v1775999917/c0xmksccsuofrihkxo9z.svg', 'https://res.cloudinary.com/dqrpav05c/image/upload/v1775999914/xhymmxcjvzuwdptu0n7i.svg'],
  },
]

const accentColors: Record<string, { text: string; border: string; dot: string; bg: string }> = {
  amber: { text: 'text-amber-400', border: 'border-amber-500/40', dot: 'bg-amber-400', bg: 'bg-amber-500/10' },
  emerald: { text: 'text-emerald-400', border: 'border-emerald-500/40', dot: 'bg-emerald-400', bg: 'bg-emerald-500/10' },
  violet: { text: 'text-violet-400', border: 'border-violet-500/40', dot: 'bg-violet-400', bg: 'bg-violet-500/10' },
  blue: { text: 'text-blue-400', border: 'border-blue-500/40', dot: 'bg-blue-400', bg: 'bg-blue-500/10' },
  cyan: { text: 'text-cyan-400', border: 'border-cyan-500/40', dot: 'bg-cyan-400', bg: 'bg-cyan-500/10' },
  pink: { text: 'text-pink-400', border: 'border-pink-500/40', dot: 'bg-pink-400', bg: 'bg-pink-500/10' },
  orange: { text: 'text-orange-400', border: 'border-orange-500/40', dot: 'bg-orange-400', bg: 'bg-orange-500/10' },
  indigo: { text: 'text-indigo-400', border: 'border-indigo-500/40', dot: 'bg-indigo-400', bg: 'bg-indigo-500/10' },
}

const AwardCard = ({ award }: { award: typeof awards[0] }) => {
  const c = accentColors[award.color]
  const IconComponent = award.Icon
  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-xl overflow-hidden">
      <div className={cn('flex items-center gap-2 px-4 py-3 border-b border-white/10', c.bg)}>
        <span className={cn('w-2 h-2 rounded-full flex-shrink-0', c.dot)} />
        <span className={cn('text-xs font-medium tracking-wide truncate', c.text)} style={{ fontFamily: 'var(--font-inter)' }}>
          {award.organizer} · {award.year}
        </span>
      </div>
      <div className="flex-1 flex flex-col justify-between p-6">
        <div>
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', c.bg)}>
            <IconComponent className={cn('w-5 h-5', c.text)} />
          </div>
          <h3
            className="text-base font-bold text-white mb-2 leading-snug"
            style={{ fontFamily: 'var(--font-garet), system-ui, sans-serif' }}
          >
            {award.title}
          </h3>
          <p
            className="text-xs text-white/55 leading-relaxed line-clamp-4"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            {award.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span
            className={cn('px-3 py-1 rounded-full text-xs font-medium border', c.text, c.border, c.bg)}
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {award.highlight}
          </span>
          <span
            className="text-[10px] text-white/30 hidden sm:block"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Tap to view
          </span>
        </div>
      </div>
    </div>
  )
}

const popupBackgrounds: Record<string, string> = {
  amber: 'from-amber-950/40 via-amber-900/20 to-[#0d0d0d]',
  emerald: 'from-emerald-950/40 via-emerald-900/20 to-[#0d0d0d]',
  violet: 'from-violet-950/40 via-violet-900/20 to-[#0d0d0d]',
  blue: 'from-blue-950/40 via-blue-900/20 to-[#0d0d0d]',
  cyan: 'from-cyan-950/40 via-cyan-900/20 to-[#0d0d0d]',
  pink: 'from-pink-950/40 via-pink-900/20 to-[#0d0d0d]',
  orange: 'from-orange-950/40 via-orange-900/20 to-[#0d0d0d]',
  indigo: 'from-indigo-950/40 via-indigo-900/20 to-[#0d0d0d]',
}

const popupBorders: Record<string, string> = {
  amber: 'border-amber-500/20',
  emerald: 'border-emerald-500/20',
  violet: 'border-violet-500/20',
  blue: 'border-blue-500/20',
  cyan: 'border-cyan-500/20',
  pink: 'border-pink-500/20',
  orange: 'border-orange-500/20',
  indigo: 'border-indigo-500/20',
}

function AwardPopup({ award, isOpen, onClose }: { award: typeof awards[0] | null, isOpen: boolean, onClose: () => void }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const c = award ? accentColors[award.color] : accentColors.amber
  const bgGradient = award ? popupBackgrounds[award.color] : popupBackgrounds.amber
  const borderColor = award ? popupBorders[award.color] : popupBorders.amber

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX)
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)

  const handleTouchEnd = () => {
    if (!award) return
    const swipeThreshold = 50
    if (touchStart - touchEnd > swipeThreshold && currentPhotoIndex < award.photos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1)
    }
    if (touchEnd - touchStart > swipeThreshold && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1)
    }
  }

  const nextPhoto = () => {
    if (award && currentPhotoIndex < award.photos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1)
    }
  }

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1)
    }
  }

  useEffect(() => {
    setCurrentPhotoIndex(0)
  }, [award])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen || !award) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      <div
        className={cn(
          "relative w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] rounded-2xl",
          "border", borderColor,
          "shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]",
          "animate-in fade-in zoom-in-95 duration-100"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cn("absolute inset-0 rounded-2xl bg-[#0d0d0d]")} />
        <div className={cn("absolute inset-0 rounded-2xl bg-gradient-to-b pointer-events-none", bgGradient)} />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent rounded-t-2xl pointer-events-none z-10" />

        <div className="relative overflow-y-auto max-h-[90vh] sm:max-h-[85vh] rounded-2xl">
          <button
            onClick={onClose}
            className={cn(
              "absolute top-4 right-4 z-10 p-2 rounded-full transition-all",
              "bg-black/30 hover:bg-black/50 border border-white/[0.15] hover:border-white/[0.25]"
            )}
          >
            <X className="w-5 h-5 text-white/80" />
          </button>

          <div className="relative p-4 sm:p-6">
            <div className={cn('flex items-center gap-2 mb-3 sm:mb-4', c.bg, 'px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full w-fit border', c.border)}>
              <span className={cn('w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full flex-shrink-0', c.dot)} />
              <span className={cn('text-[10px] sm:text-xs font-medium tracking-wide', c.text)} style={{ fontFamily: 'var(--font-inter)' }}>
                {award.organizer} · {award.year}
              </span>
            </div>

            <div className={cn('w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-2 sm:mb-3', c.bg)}>
              <award.Icon className={cn('w-5 h-5 sm:w-6 sm:h-6', c.text)} />
            </div>

            <h3
              className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-3"
              style={{ fontFamily: 'var(--font-garet), system-ui, sans-serif' }}
            >
              {award.title}
            </h3>
            <p
              className="text-xs sm:text-sm text-white/65 leading-relaxed mb-3 sm:mb-4"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {award.description}
            </p>

            <span
              className={cn('inline-flex px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium border mb-4 sm:mb-6', c.text, c.border, c.bg)}
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {award.highlight}
            </span>

            <div
              className="relative rounded-lg sm:rounded-xl overflow-hidden bg-black/40 border border-white/[0.08]"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative w-full min-h-[150px] sm:min-h-[200px] max-h-[250px] sm:max-h-[400px] flex items-center justify-center p-1.5 sm:p-2">
                {award.photos[currentPhotoIndex] ? (
                  <Image
                    src={award.photos[currentPhotoIndex]}
                    alt={`${award.title} photo ${currentPhotoIndex + 1}`}
                    width={600}
                    height={400}
                    className="object-contain max-h-[230px] sm:max-h-[380px] w-auto h-auto rounded-md sm:rounded-lg"
                    style={{ maxWidth: '100%' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.parentElement?.querySelector('.placeholder-img')?.classList.remove('hidden')
                    }}
                  />
                ) : null}
                <div className={cn(
                  "placeholder-img flex flex-col items-center justify-center w-full h-[200px] sm:h-[300px] rounded-md sm:rounded-lg",
                  c.bg, c.border, "border",
                  award.photos[currentPhotoIndex] ? "hidden" : ""
                )}>
                  <div className={cn('w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-2 sm:mb-3', c.bg, 'border', c.border)}>
                    <award.Icon className={cn('w-7 h-7 sm:w-8 sm:h-8', c.text)} />
                  </div>
                  <span className={cn("text-xs sm:text-sm font-medium text-center px-4", c.text)} style={{ fontFamily: 'var(--font-inter)' }}>
                    {award.title}
                  </span>
                  <span className="text-[10px] sm:text-xs text-white/40 mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
                    Photo {currentPhotoIndex + 1} of {award.photos.length}
                  </span>
                </div>
              </div>

              {award.photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    disabled={currentPhotoIndex === 0}
                    className={cn(
                      "hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full",
                      "bg-black/60 backdrop-blur-sm border border-white/20 transition-all",
                      currentPhotoIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-black/80 hover:scale-110"
                    )}
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    disabled={currentPhotoIndex === award.photos.length - 1}
                    className={cn(
                      "hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full",
                      "bg-black/60 backdrop-blur-sm border border-white/20 transition-all",
                      currentPhotoIndex === award.photos.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-black/80 hover:scale-110"
                    )}
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </>
              )}

              {award.photos.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {award.photos.map((_, i) => (
                    <button
                      key={`photo-indicator-${i}`}
                      onClick={() => setCurrentPhotoIndex(i)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        i === currentPhotoIndex ? cn("scale-125", c.dot) : "bg-white/40 hover:bg-white/60"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            {award.photos.length > 1 && (
              <div className="flex flex-col items-center gap-3 mt-4">
                <span className="sm:hidden text-xs text-white/40" style={{ fontFamily: 'var(--font-inter)' }}>
                  Swipe to navigate photos
                </span>
                <div className="flex sm:hidden justify-center gap-4">
                  <button
                    onClick={prevPhoto}
                    disabled={currentPhotoIndex === 0}
                    className={cn(
                      "p-3 rounded-full transition-all border",
                      c.bg, c.border,
                      currentPhotoIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:opacity-80"
                    )}
                  >
                    <ChevronLeft className={cn("w-5 h-5", c.text)} />
                  </button>
                  <button
                    onClick={nextPhoto}
                    disabled={currentPhotoIndex === award.photos.length - 1}
                    className={cn(
                      "p-3 rounded-full transition-all border",
                      c.bg, c.border,
                      currentPhotoIndex === award.photos.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:opacity-80"
                    )}
                  >
                    <ChevronRight className={cn("w-5 h-5", c.text)} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HonorsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardSwapRef = useRef<CardSwapHandle>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedAward, setSelectedAward] = useState<typeof awards[0] | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [clickedCardIndex, setClickedCardIndex] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleCardClick = useCallback((index: number) => {
    setSelectedAward(awards[index])
    setClickedCardIndex(index)
    setIsPopupOpen(true)
    cardSwapRef.current?.pauseAnimation()
  }, [])

  const handleClosePopup = useCallback(() => {
    const cardToShowAtFront = clickedCardIndex
    setIsPopupOpen(false)
    setSelectedAward(null)
    setClickedCardIndex(null)
    cardSwapRef.current?.resumeAnimation({
      bringCardToFront: cardToShowAtFront ?? undefined,
      resumeDelay: 1100
    })
  }, [clickedCardIndex])

  const handlePrevCard = useCallback(() => cardSwapRef.current?.prevCard(), [])
  const handleNextCard = useCallback(() => cardSwapRef.current?.nextCard(), [])

  const cardNodes = useMemo(() => awards.map((award, i) => (
    <AwardCard key={`award-card-${i}`} award={award} />
  )), [])

  return (
    <section
      id="honors"
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-32 bg-[#0a0a0a] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-amber-950/10 via-transparent to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">

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
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Honors
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <div
            className={cn(
              "flex flex-col justify-center transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <h2
              className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4 sm:mb-6"
              style={{ fontFamily: 'var(--font-garet), system-ui, sans-serif' }}
            >
              Validated by the stages that matter.
            </h2>
            <p
              className="text-sm sm:text-base lg:text-lg text-white/60 leading-relaxed mb-8"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Competing against hundreds of founders and thousands of ideas — these wins reflect not just what I build, but how I think under pressure.
            </p>

            <div className="flex gap-6 flex-wrap">
              <div>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-garet), system-ui' }}>8+</p>
                <p className="text-xs text-white/40 mt-1" style={{ fontFamily: 'var(--font-inter)' }}>Awards &amp; Honors</p>
              </div>
              <div className="w-px bg-white/10 hidden sm:block" />
              <div>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-garet), system-ui' }}>75K+</p>
                <p className="text-xs text-white/40 mt-1" style={{ fontFamily: 'var(--font-inter)' }}>Grant Secured</p>
              </div>
              <div className="w-px bg-white/10 hidden sm:block" />
              <div>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-garet), system-ui' }}>State</p>
                <p className="text-xs text-white/40 mt-1" style={{ fontFamily: 'var(--font-inter)' }}>Level recognition</p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 flex-wrap">
              <span
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full",
                  "bg-amber-500/10 border border-amber-500/30",
                  "animate-pulse"
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span
                  className="text-xs text-amber-400/90"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  Click the card to view photos!
                </span>
              </span>

              <div className="hidden lg:flex items-center gap-2">
                <button
                  onMouseDown={(e) => { e.preventDefault(); handlePrevCard(); }}
                  className={cn(
                    "p-1.5 rounded-full bg-white/[0.05] backdrop-blur-sm border border-white/[0.1]",
                    "hover:bg-white/[0.1] hover:border-white/[0.2] hover:scale-110 active:scale-95 transition-all"
                  )}
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-white/70" />
                </button>
                <button
                  onMouseDown={(e) => { e.preventDefault(); handleNextCard(); }}
                  className={cn(
                    "p-1.5 rounded-full bg-white/[0.05] backdrop-blur-sm border border-white/[0.1]",
                    "hover:bg-white/[0.1] hover:border-white/[0.2] hover:scale-110 active:scale-95 transition-all"
                  )}
                >
                  <ChevronRight className="w-3.5 h-3.5 text-white/70" />
                </button>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "relative transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            )}
            style={{ height: '440px' }}
          >
            <CardSwap
              ref={cardSwapRef}
              width={340}
              height={320}
              cardDistance={28}
              verticalDistance={30}
              delay={1500}
              skewAmount={6}
              easing="elastic"
              pauseOnHover={true}
              hoverUplift={true}
              cards={cardNodes}
              onCardClick={handleCardClick}
            />

            <div className="flex lg:hidden justify-center gap-4 mt-4 absolute -bottom-16 left-1/2 -translate-x-1/2">
              <button
                onTouchStart={(e) => { e.stopPropagation(); handlePrevCard(); }}
                onMouseDown={(e) => { e.preventDefault(); handlePrevCard(); }}
                className={cn(
                  "p-2.5 rounded-full bg-white/[0.05] backdrop-blur-sm border border-white/[0.1]",
                  "hover:bg-white/[0.1] active:scale-95 transition-all"
                )}
              >
                <ChevronLeft className="w-4 h-4 text-white/70" />
              </button>
              <button
                onTouchStart={(e) => { e.stopPropagation(); handleNextCard(); }}
                onMouseDown={(e) => { e.preventDefault(); handleNextCard(); }}
                className={cn(
                  "p-2.5 rounded-full bg-white/[0.05] backdrop-blur-sm border border-white/[0.1]",
                  "hover:bg-white/[0.1] active:scale-95 transition-all"
                )}
              >
                <ChevronRight className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </div>

        </div>
      </div>

      <AwardPopup
        award={selectedAward}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </section>
  )
}