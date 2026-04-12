"use client"

import { useState, useEffect } from 'react'
import { Menu, X, Linkedin, Github, Instagram, Mail } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '#hero', label: 'Start Here' },
  { href: '#profile', label: 'Profile' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#expertise', label: 'Expertise' },
  { href: '#honors', label: 'Honors' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact', label: "Let's Connect" },
]

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/akashkrishnau/',
    icon: Linkedin,
    color: 'hover:text-blue-400 hover:border-blue-400/30',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/akashkrishna95',
    icon: Github,
    color: 'hover:text-white hover:border-white/30',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/akash.krishna.u',
    icon: Instagram,
    color: 'hover:text-pink-400 hover:border-pink-400/30',
  },
  {
    name: 'Email',
    href: 'mailto:akofficial5000@gmail.com',
    icon: Mail,
    color: 'hover:text-green-400 hover:border-green-400/30',
  },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const sections = navLinks.map(link => link.href.slice(1))
      const scrollPosition = window.scrollY + 200

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Logo - Top Left - Always visible */}
      <a
        href="#hero"
        onClick={(e) => handleNavClick(e, '#hero')}
        className={cn(
          "fixed top-4 left-4 z-50 transition-all duration-500",
          isScrolled ? "top-3" : "top-6"
        )}
      >
        <Image
          src="/images/logo.png"
          alt="Akash Krishna U"
          width={56}
          height={56}
          className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
          priority
          loading="eager"
        />
      </a>

      {/* Desktop Navigation - Centered */}
      <nav
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out hidden lg:block",
          isScrolled ? "top-3" : "top-6"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-2 rounded-full transition-all duration-500",
            "bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]",
            "shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]",
            isScrolled && "bg-white/[0.05] border-white/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
          )}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full",
                "text-white/60 hover:text-white",
                activeSection === link.href.slice(1) && [
                  "text-white",
                  "bg-white/[0.08]",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                ]
              )}
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Desktop Social Icons - Right Side */}
      <div
        className={cn(
          "fixed right-4 z-50 hidden lg:flex items-center gap-1 transition-all duration-500",
          isScrolled ? "top-3" : "top-6"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-2 rounded-full transition-all duration-500",
            "bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]",
            "shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]",
            isScrolled && "bg-white/[0.05] border-white/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
          )}
        >
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "relative px-4 py-2 rounded-full transition-all duration-300 flex items-center justify-center",
                "text-white/60 border border-transparent",
                link.color
              )}
              aria-label={link.name}
            >
              <link.icon className="w-[15px] h-[15px]" />
            </a>
          ))}
        </div>
      </div>

      {/* Mobile Navigation - Hamburger icon only, top right */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={cn(
          "fixed top-4 right-4 z-50 lg:hidden p-3 rounded-full transition-all duration-300",
          "bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]",
          "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          "hover:bg-white/[0.08]"
        )}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5 text-white/80" />
        ) : (
          <Menu className="w-5 h-5 text-white/80" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-500",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={cn(
            "absolute top-20 right-4 left-4 p-4 rounded-3xl transition-all duration-500",
            "bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]",
            "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
            isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}
        >
          {/* Nav Links */}
          <div className="flex flex-col gap-1">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  "px-4 py-3 text-base font-medium transition-all duration-300 rounded-xl",
                  "text-white/60 hover:text-white hover:bg-white/[0.05]",
                  activeSection === link.href.slice(1) && "text-white bg-white/[0.08]"
                )}
                style={{
                  fontFamily: 'var(--font-inter)',
                  animationDelay: `${index * 50}ms`
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Divider + Social Section */}
          <div className="mt-4 rounded-2xl border border-white/[0.18] bg-white/[0.04] p-3">
            <p
              className="mb-3 text-[10px] uppercase tracking-widest text-white/60 text-center"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Connect me on
            </p>
            <div className="flex items-center justify-around">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-300",
                    "text-white/70 hover:text-white"
                  )}
                >
                  <div
                    className={cn(
                      "p-2.5 rounded-xl transition-all duration-300",
                      "bg-white/[0.10] border border-white/[0.20]",
                      "group-hover:scale-110 group-hover:bg-white/[0.18] group-hover:border-white/[0.35]",
                      "group-hover:shadow-[0_0_16px_rgba(255,255,255,0.12)]"
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                  </div>
                  <span
                    className="text-[9px] font-medium tracking-wide text-white/55 group-hover:text-white/80 transition-colors"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {link.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}