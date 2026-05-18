import { useEffect, useRef } from 'react'

export default function WatermarkV10() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return
      const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      ref.current.style.transform = `translateX(-50%) translateY(${progress * 80}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        bottom: '8vh',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        pointerEvents: 'none',
        userSelect: 'none',
        fontFamily: 'Arial Black, Arial, sans-serif',
        fontSize: 'clamp(180px, 22vw, 320px)',
        fontWeight: 900,
        letterSpacing: '-0.05em',
        color: 'transparent',
        WebkitTextStroke: '1px rgba(204, 0, 0, 0.12)',
        whiteSpace: 'nowrap',
        lineHeight: 1,
      }}
    >
      V10
    </div>
  )
}
