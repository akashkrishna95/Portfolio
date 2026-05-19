"use client"

import { useState } from 'react'

interface LoaderProps {
  onComplete: () => void
}

export default function Loader({ onComplete }: LoaderProps) {
  const [opacity, setOpacity] = useState(1)

  const handleVideoEnd = () => {
    // Fade the entire loader out slowly
    setOpacity(0)

    // Call onComplete after the fade finishes to unmount the component
    setTimeout(() => {
      onComplete()
    }, 1000) // 1000ms matches the CSS transition duration below
  }

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black"
      style={{
        opacity: opacity,
        transition: 'opacity 1000ms ease-in-out',
        pointerEvents: opacity === 0 ? 'none' : 'auto',
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <video
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          src="https://res.cloudinary.com/dqrpav05c/video/upload/v1779206838/l4dura5riwetsyxixpb3.mp4"
          style={{
            maxWidth: 'min(80vw, 640px)',
            maxHeight: 'min(70vh, 480px)',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: '4px',
          }}
        />

        <p
          className="absolute bottom-8 w-full text-center text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/40 font-light"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          For best experience— use desktop.
        </p>
      </div>
    </div>
  )
}