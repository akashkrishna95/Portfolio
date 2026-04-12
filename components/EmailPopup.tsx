"use client"

import { useState, useRef, useCallback } from 'react'
import { X, Send, Paperclip, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmailPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function EmailPopup({ isOpen, onClose }: EmailPopupProps) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    subject: '',
    description: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])
  const popupRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const rippleIdRef = useRef(0)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!popupRef.current) return
    const rect = popupRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    popupRef.current.style.setProperty('--mouse-x', `${x}%`)
    popupRef.current.style.setProperty('--mouse-y', `${y}%`)
  }, [])

  const addRipple = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!popupRef.current) return
    const rect = popupRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = ++rippleIdRef.current
    setRipples(prev => [...prev, { x, y, id }])
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id))
    }, 1000)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    // Create mailto link with form data
    const mailtoSubject = encodeURIComponent(formData.subject || 'Contact from Portfolio')
    const mailtoBody = encodeURIComponent(
      `Name: ${formData.name}\nRole: ${formData.role}\n\n${formData.description}${file ? '\n\n[Attachment: ' + file.name + ']' : ''}`
    )
    const mailtoLink = `mailto:akofficial5000@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`

    // Simulate sending delay for UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    window.location.href = mailtoLink
    setIsSending(false)
    
    // Reset form
    setFormData({ name: '', role: '', subject: '', description: '' })
    setFile(null)
    onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Popup Container */}
      <div
        ref={popupRef}
        onMouseMove={handleMouseMove}
        onClick={addRipple}
        className={cn(
          "relative w-full max-w-lg rounded-3xl overflow-hidden",
          "transform transition-all duration-500 ease-out",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* Liquid effect overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16, 185, 129, 0.15), transparent 40%)`,
          }}
        />

        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />

        {/* Ripple effects */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-emerald-400/20 animate-ripple pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 10,
              height: 10,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 
                className="text-xl sm:text-2xl font-bold text-white"
                style={{ fontFamily: 'var(--font-garet), system-ui, sans-serif' }}
              >
                Send me a message
              </h3>
              <p className="text-sm text-white/50 mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
                {"I'll get back to you soon"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider" style={{ fontFamily: 'var(--font-inter)' }}>
                Your Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all"
                placeholder="John Doe"
                style={{ fontFamily: 'var(--font-inter)' }}
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider" style={{ fontFamily: 'var(--font-inter)' }}>
                Your Role *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all"
                placeholder="Startup Founder, Recruiter, Developer..."
                style={{ fontFamily: 'var(--font-inter)' }}
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider" style={{ fontFamily: 'var(--font-inter)' }}>
                Subject *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all"
                placeholder="Project Collaboration, Job Opportunity..."
                style={{ fontFamily: 'var(--font-inter)' }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider" style={{ fontFamily: 'var(--font-inter)' }}>
                Message *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all resize-none"
                placeholder="Tell me about your project or idea..."
                style={{ fontFamily: 'var(--font-inter)' }}
              />
            </div>

            {/* File Upload (Optional) */}
            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider" style={{ fontFamily: 'var(--font-inter)' }}>
                Attachment <span className="text-white/20">(Optional)</span>
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "w-full px-4 py-3 rounded-xl border border-dashed transition-all flex items-center justify-center gap-2",
                  file 
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" 
                    : "border-white/10 bg-white/[0.02] text-white/40 hover:border-white/20 hover:bg-white/[0.04]"
                )}
              >
                <Paperclip className="w-4 h-4" />
                <span style={{ fontFamily: 'var(--font-inter)' }}>
                  {file ? file.name : 'Click to attach a file'}
                </span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSending}
              className={cn(
                "w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all",
                "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white",
                "hover:from-emerald-400 hover:to-cyan-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Opening Mail App...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(50);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 1s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
