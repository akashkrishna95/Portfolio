"use client"

import { useState, useRef } from 'react'

interface LoaderProps {
  onComplete: () => void
}

export default function Loader({ onComplete }: LoaderProps) {
  const [opacity, setOpacity] = useState(1)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleVideoEnd = () => {
    setOpacity(0)
    setTimeout(() => {
      onComplete()
    }, 1000)
  }

  const preventDownload = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    return false
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
        {/* Transparent overlay to block right-click and long-press on the video */}
        <div
          style={{
            position: 'absolute',
            maxWidth: 'min(80vw, 640px)',
            maxHeight: 'min(70vh, 480px)',
            width: '100%',
            height: '100%',
            zIndex: 10,
            WebkitTouchCallout: 'none',
            userSelect: 'none',
          }}
          onContextMenu={preventDownload}
          onTouchStart={preventDownload}
          onTouchEnd={preventDownload}
          onMouseDown={preventDownload}
        />

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          onEnded={handleVideoEnd}
          onContextMenu={preventDownload}
          src="https://res.cloudinary.com/dqrpav05c/video/upload/v1779206838/l4dura5riwetsyxixpb3.mp4"
          style={{
            maxWidth: 'min(80vw, 640px)',
            maxHeight: 'min(70vh, 480px)',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: '4px',
            WebkitTouchCallout: 'none',
            userSelect: 'none',
            pointerEvents: 'none',
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