'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import Loader from '@/components/Loader'

// Lazy load all sections below the fold for faster initial load
const ProfileSection = dynamic(() => import('@/components/sections/ProfileSection'), {
  ssr: false,
  loading: () => <div className="min-h-[50vh] bg-[#0a0a0a]" />,
})

const PortfolioSection = dynamic(() => import('@/components/sections/PortfolioSection'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#0a0a0a]" />,
})

const ExpertiseSection = dynamic(() => import('@/components/sections/ExpertiseSection'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#0a0a0a]" />,
})

const HonorsSection = dynamic(() => import('@/components/sections/HonorsSection'), {
  ssr: false,
  loading: () => <div className="min-h-[50vh] bg-[#0a0a0a]" />,
})

const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'), {
  ssr: false,
  loading: () => <div className="min-h-[50vh] bg-[#0a0a0a]" />,
})

const ContactSection = dynamic(() => import('@/components/sections/ContactSection'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#0a0a0a]" />,
})

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <>
      {isLoading && <Loader onComplete={handleLoadComplete} />}
      <main className={`bg-[#0a0a0a] min-h-screen ${isLoading ? 'overflow-hidden max-h-screen' : ''}`}>
        <Navbar />
        <HeroSection />
        <ProfileSection />
        <PortfolioSection />
        <ExpertiseSection />
        <HonorsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
    </>
  )
}
