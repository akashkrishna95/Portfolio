"use client"

import { useRef, useEffect, useCallback, ReactNode, forwardRef, useImperativeHandle, useMemo } from 'react'
import gsap from 'gsap'

export interface CardSwapHandle {
  nextCard: () => void
  prevCard: () => void
  getCurrentOrder: () => number[]
  pauseAnimation: () => void
  resumeAnimation: (options?: { swapCurrentCard?: boolean; resumeDelay?: number; bringCardToFront?: number }) => void
}

export interface CardSwapProps {
  width?: number | string
  height?: number | string
  cardDistance?: number
  verticalDistance?: number
  delay?: number
  pauseOnHover?: boolean
  hoverUplift?: boolean
  skewAmount?: number
  easing?: 'linear' | 'elastic'
  onCardClick?: (index: number) => void
  cards: ReactNode[]
}

interface Slot {
  x: number
  y: number
  z: number
  zIndex: number
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 0.8,
  zIndex: total - i,
})

const placeNow = (el: HTMLElement, slot: Slot, skew: number) => {
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true,
  })
}

const CardSwap = forwardRef<CardSwapHandle, CardSwapProps>(function CardSwap({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  skewAmount = 6,
  easing = 'elastic',
  onCardClick,
  cards,
}, ref) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const orderRef = useRef<number[]>(cards.map((_, i) => i))
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pausedRef = useRef(false)
  const isAnimatingRef = useRef(false)
  const resumeSwapPendingRef = useRef(false)
  const hasInitializedRef = useRef(false)
  
  // FIX: Track initial swap to prevent double-drops on StrictMode mount
  const initialSwapDoneRef = useRef(false)

  // FIX: Memoize config to prevent cascading re-renders
  const config = useMemo(() => 
    easing === 'elastic'
      ? {
        ease: 'elastic.out(0.6,0.9)',
        durDrop: 2,
        durMove: 2,
        durReturn: 2,
        promoteOverlap: 0.9,
        returnDelay: 0.05,
      }
      : {
        ease: 'power1.inOut',
        durDrop: 0.8,
        durMove: 0.8,
        durReturn: 0.8,
        promoteOverlap: 0.45,
        returnDelay: 0.2,
      }
  , [easing])

  const total = cards.length

  const initializeCards = useCallback((useCurrentOrder = false) => {
    if (useCurrentOrder) {
      const order = orderRef.current
      order.forEach((cardIndex, visualPosition) => {
        const el = cardRefs.current[cardIndex]
        if (el) placeNow(el, makeSlot(visualPosition, cardDistance, verticalDistance, total), skewAmount)
      })
    } else {
      cardRefs.current.forEach((el, i) => {
        if (el) placeNow(el, makeSlot(i, cardDistance, verticalDistance, total), skewAmount)
      })
    }
  }, [cardDistance, verticalDistance, skewAmount, total])

  const swap = useCallback((force = false) => {
    if (!force && (pausedRef.current || isAnimatingRef.current || resumeSwapPendingRef.current)) return
    
    const order = orderRef.current
    if (order.length < 2) return

    const [front, ...rest] = order
    const elFront = cardRefs.current[front]
    if (!elFront) return

    orderRef.current = [...rest, front]
    
    isAnimatingRef.current = true

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false
      }
    })
    tlRef.current = tl

    tl.to(elFront, {
      y: '+=500',
      duration: config.durDrop,
      ease: config.ease,
    })

    tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`)
    rest.forEach((idx, i) => {
      const el = cardRefs.current[idx]
      if (!el) return
      const slot = makeSlot(i, cardDistance, verticalDistance, total)
      tl.set(el, { zIndex: slot.zIndex }, 'promote')
      tl.to(
        el,
        { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease },
        `promote+=${i * 0.15}`
      )
    })

    const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total)
    tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`)
    tl.call(() => { gsap.set(elFront, { zIndex: backSlot.zIndex }) }, undefined, 'return')
    tl.set(elFront, { x: backSlot.x, z: backSlot.z }, 'return')
    tl.to(elFront, { y: backSlot.y, duration: config.durReturn, ease: config.ease }, 'return')
  }, [cardDistance, verticalDistance, total, config])

  const stopAnimation = useCallback(() => {
    tlRef.current?.kill()
    tlRef.current = null
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const startAnimation = useCallback(() => {
    stopAnimation()
    pausedRef.current = false
    isAnimatingRef.current = false
    resumeSwapPendingRef.current = false
    
    // FIX: Only trigger immediate force swap exactly once
    if (!initialSwapDoneRef.current) {
      swap(true)
      initialSwapDoneRef.current = true
    }
    
    intervalRef.current = setInterval(() => {
      if (!pausedRef.current && !isAnimatingRef.current && !resumeSwapPendingRef.current) {
        swap()
      }
    }, delay)
  }, [swap, stopAnimation, delay])

  const resumeAnimation = useCallback(() => {
    pausedRef.current = false
    resumeSwapPendingRef.current = false
    
    const order = orderRef.current
    order.forEach((cardIndex, visualPosition) => {
      const el = cardRefs.current[cardIndex]
      if (!el) return
      const slot = makeSlot(visualPosition, cardDistance, verticalDistance, total)
      gsap.set(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        zIndex: slot.zIndex,
      })
    })
    
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (!pausedRef.current && !isAnimatingRef.current && !resumeSwapPendingRef.current) {
          swap()
        }
      }, delay)
    }
  }, [swap, delay, cardDistance, verticalDistance, total])

  const quickSwap = useCallback(() => {
    const order = orderRef.current
    if (order.length < 2) return

    const [front, ...rest] = order
    const elFront = cardRefs.current[front]
    if (!elFront) return

    tlRef.current?.kill()
    isAnimatingRef.current = true
    
    const tl = gsap.timeline({
      onComplete: () => { isAnimatingRef.current = false }
    })
    tlRef.current = tl

    const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total)

    tl.to(elFront, { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: 0.5, ease: 'power2.inOut' }, 0)
    tl.set(elFront, { zIndex: backSlot.zIndex }, 0.1)

    rest.forEach((idx, i) => {
      const el = cardRefs.current[idx]
      if (!el) return
      const slot = makeSlot(i, cardDistance, verticalDistance, total)
      tl.set(el, { zIndex: slot.zIndex }, 0)
      tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: 0.4, ease: 'power2.out' }, 0.05)
    })

    tl.call(() => { orderRef.current = [...rest, front] })
  }, [cardDistance, verticalDistance, total])

  const quickReverseSwap = useCallback(() => {
    const order = orderRef.current
    if (order.length < 2) return

    const back = order[order.length - 1]
    const rest = order.slice(0, -1)
    const elBack = cardRefs.current[back]
    if (!elBack) return

    tlRef.current?.kill()
    isAnimatingRef.current = true

    const tl = gsap.timeline({
      onComplete: () => { isAnimatingRef.current = false }
    })
    tlRef.current = tl

    const frontSlot = makeSlot(0, cardDistance, verticalDistance, total)

    tl.set(elBack, { zIndex: frontSlot.zIndex + 10 }, 0)
    tl.to(elBack, { x: frontSlot.x, y: frontSlot.y, z: frontSlot.z, duration: 0.5, ease: 'power2.inOut' }, 0)

    rest.forEach((idx, i) => {
      const el = cardRefs.current[idx]
      if (!el) return
      const slot = makeSlot(i + 1, cardDistance, verticalDistance, total)
      tl.set(el, { zIndex: slot.zIndex }, 0)
      tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: 0.4, ease: 'power2.out' }, 0.05)
    })

    tl.set(elBack, { zIndex: frontSlot.zIndex }, 0.5)
    tl.call(() => { orderRef.current = [back, ...rest] })
  }, [cardDistance, verticalDistance, total])

  const swapRef = useRef(swap)
  const quickSwapRef = useRef(quickSwap)
  const quickReverseSwapRef = useRef(quickReverseSwap)
  const delayRef = useRef(delay)
  
  useEffect(() => {
    swapRef.current = swap
    quickSwapRef.current = quickSwap
    quickReverseSwapRef.current = quickReverseSwap
    delayRef.current = delay
  }, [swap, quickSwap, quickReverseSwap, delay])

  useImperativeHandle(ref, () => ({
    nextCard: () => {
      // 1. ADD THIS EXACT LINE to prevent double-skips
      if (isAnimatingRef.current) return
      
      // Kill any running animation immediately
      tlRef.current?.kill()
      tlRef.current = null
      isAnimatingRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      const order = orderRef.current
      if (order.length < 2) return
      const [front, ...rest] = order
      const elFront = cardRefs.current[front]
      if (!elFront) return
      
      const newOrder = [...rest, front]
      orderRef.current = newOrder
      
      const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total)
      const tl = gsap.timeline({
        onComplete: () => { 
          isAnimatingRef.current = false
          if (!pausedRef.current && !intervalRef.current) {
            intervalRef.current = setInterval(() => swapRef.current(), delayRef.current)
          }
        }
      })
      tlRef.current = tl
      isAnimatingRef.current = true

      tl.to(elFront, { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: 0.4, ease: 'power2.inOut' }, 0)
      tl.set(elFront, { zIndex: backSlot.zIndex }, 0.1)
      rest.forEach((idx, i) => {
        const el = cardRefs.current[idx]
        if (!el) return
        const slot = makeSlot(i, cardDistance, verticalDistance, total)
        tl.set(el, { zIndex: slot.zIndex }, 0)
        tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: 0.35, ease: 'power2.out' }, 0.05)
      })
    },
    prevCard: () => {
      // 2. ADD THIS EXACT LINE HERE TOO
      if (isAnimatingRef.current) return

      // Kill any running animation immediately
      tlRef.current?.kill()
      tlRef.current = null
      // ... (keep the rest of your prevCard code exactly as is)
      tlRef.current?.kill()
      tlRef.current = null
      isAnimatingRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      const order = orderRef.current
      if (order.length < 2) return
      const back = order[order.length - 1]
      const rest = order.slice(0, -1)
      const elBack = cardRefs.current[back]
      if (!elBack) return

      const newOrder = [back, ...rest]
      orderRef.current = newOrder

      const frontSlot = makeSlot(0, cardDistance, verticalDistance, total)
      const tl = gsap.timeline({
        onComplete: () => { 
          isAnimatingRef.current = false
          gsap.set(elBack, { zIndex: frontSlot.zIndex })
          if (!pausedRef.current && !intervalRef.current) {
            intervalRef.current = setInterval(() => swapRef.current(), delayRef.current)
          }
        }
      })
      tlRef.current = tl
      isAnimatingRef.current = true

      tl.set(elBack, { zIndex: frontSlot.zIndex + 10 }, 0)
      tl.to(elBack, { x: frontSlot.x, y: frontSlot.y, z: frontSlot.z, duration: 0.4, ease: 'power2.inOut' }, 0)
      rest.forEach((idx, i) => {
        const el = cardRefs.current[idx]
        if (!el) return
        const slot = makeSlot(i + 1, cardDistance, verticalDistance, total)
        tl.set(el, { zIndex: slot.zIndex }, 0)
        tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: 0.35, ease: 'power2.out' }, 0.05)
      })
    },
    getCurrentOrder: () => orderRef.current,
    pauseAnimation: () => {
      pausedRef.current = true
      resumeSwapPendingRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (tlRef.current) {
        tlRef.current.kill()
        tlRef.current = null
      }
      isAnimatingRef.current = false
      
      const order = orderRef.current
      order.forEach((cardIndex, visualPosition) => {
        const el = cardRefs.current[cardIndex]
        if (!el) return
        const slot = makeSlot(visualPosition, cardDistance, verticalDistance, total)
        gsap.set(el, { x: slot.x, y: slot.y, z: slot.z, zIndex: slot.zIndex })
      })
    },
    resumeAnimation: (options?: { swapCurrentCard?: boolean; resumeDelay?: number; bringCardToFront?: number }) => {
      const { swapCurrentCard = false, resumeDelay = 0, bringCardToFront } = options || {}
      
      if (resumeSwapPendingRef.current) return
      
      pausedRef.current = false
      
      if (tlRef.current) {
        tlRef.current.kill()
        tlRef.current = null
      }
      isAnimatingRef.current = false
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      
      if (typeof bringCardToFront === 'number' && bringCardToFront >= 0 && bringCardToFront < total) {
        const currentOrder = orderRef.current
        const currentPosition = currentOrder.indexOf(bringCardToFront)
        if (currentPosition > 0) {
          const newOrder = [
            bringCardToFront,
            ...currentOrder.slice(0, currentPosition),
            ...currentOrder.slice(currentPosition + 1)
          ]
          orderRef.current = newOrder
        }
      }
      
      const order = orderRef.current
      order.forEach((cardIndex, visualPosition) => {
        const el = cardRefs.current[cardIndex]
        if (!el) return
        const slot = makeSlot(visualPosition, cardDistance, verticalDistance, total)
        gsap.set(el, { x: slot.x, y: slot.y, z: slot.z, zIndex: slot.zIndex })
      })
      
      resumeSwapPendingRef.current = true
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null
        resumeSwapPendingRef.current = false
        if (pausedRef.current) return
        
        swapRef.current(true)
        if (!intervalRef.current) {
          intervalRef.current = setInterval(() => swapRef.current(), delayRef.current)
        }
      }, resumeDelay)
    },
  }), [cardDistance, verticalDistance, total])

  useEffect(() => {
    if (!hasInitializedRef.current) {
      initializeCards(false)
      hasInitializedRef.current = true
    } else {
      initializeCards(true)
    }
    startAnimation()
    return () => stopAnimation()
  }, [initializeCards, startAnimation, stopAnimation])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !pauseOnHover) return

    const onEnter = () => { pausedRef.current = true; stopAnimation() }
    const onLeave = () => { pausedRef.current = false; resumeAnimation() }

    container.addEventListener('mouseenter', onEnter)
    container.addEventListener('mouseleave', onLeave)
    return () => {
      container.removeEventListener('mouseenter', onEnter)
      container.removeEventListener('mouseleave', onLeave)
    }
  }, [pauseOnHover, stopAnimation, resumeAnimation])

  const w = typeof width === 'number' ? `${width}px` : width
  const h = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 right-0 origin-bottom-right overflow-visible"
      style={{
        width: w,
        height: h,
        perspective: '900px',
        transform: 'translate(5%, 20%)',
      }}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          ref={(el) => { cardRefs.current[index] = el }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            const currentFront = orderRef.current[0]
            if (onCardClick) {
              onCardClick(currentFront)
            }
          }}
          className="absolute top-1/2 left-1/2 rounded-xl border border-white/20 bg-black cursor-pointer select-none"
          style={{
            width: w,
            height: h,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            pointerEvents: 'auto',
          }}
        >
          {card}
        </div>
      ))}
    </div>
  )
})

export default CardSwap