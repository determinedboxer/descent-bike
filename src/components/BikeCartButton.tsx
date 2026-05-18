import { useRef, useState } from 'react'
import { gsap } from 'gsap'

interface Props {
  children: React.ReactNode
  style?: React.CSSProperties
  onOrderClick?: () => void
}

export default function BikeCartButton({ children, style, onOrderClick }: Props) {
  const btnRef  = useRef<HTMLButtonElement>(null)
  const bikeRef = useRef<HTMLSpanElement>(null)
  const cartRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(false)

  const handleClick = () => {
    if (active) return
    setActive(true)

    const tl = gsap.timeline({
      onComplete: () => {
        setActive(false)
        onOrderClick?.()
      },
    })

    // 1. Fade out text
    tl.to(textRef.current, {
      opacity: 0,
      y: -8,
      duration: 0.2,
      ease: 'power2.in',
    })

    // 2. Bike appears from below button center
    tl.set(bikeRef.current, { display: 'flex', opacity: 0, y: 20, x: '-50%' })
    tl.to(bikeRef.current, {
      opacity: 1,
      y: -32,
      duration: 0.35,
      ease: 'power2.out',
    })

    // 3. Bike slides right toward cart
    tl.to(bikeRef.current, {
      x: '30%',
      duration: 0.3,
      ease: 'power1.in',
    })

    // 4. Cart appears, bike disappears
    tl.set(cartRef.current, { display: 'flex', opacity: 0, x: '60%' })
    tl.to(bikeRef.current, { opacity: 0, scale: 0.5, duration: 0.15 }, '<')
    tl.to(cartRef.current, { opacity: 1, duration: 0.2 }, '<0.1')

    // 5. Cart bounces then rides off right
    tl.to(cartRef.current, { y: -4, duration: 0.1, ease: 'power1.out' })
    tl.to(cartRef.current, { y: 0, duration: 0.1, ease: 'bounce.out' })
    tl.to(cartRef.current, { x: '200%', opacity: 0, duration: 0.4, ease: 'power2.in' })

    // 6. Show success text
    tl.set(textRef.current, { y: 8 })
    tl.call(() => {
      if (textRef.current) textRef.current.textContent = 'ORDER PLACED ✓'
    })
    tl.to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    })

    // 7. After 1.2s — reset to original text
    tl.to(textRef.current, { opacity: 0, duration: 0.2, delay: 1.2 })
    tl.call(() => {
      if (textRef.current) textRef.current.textContent = String(children)
    })
    tl.to(textRef.current, { opacity: 1, duration: 0.2 })

    // Cleanup hidden elements
    tl.set([bikeRef.current, cartRef.current], { display: 'none' })
  }

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      style={{
        position: 'relative',
        overflow: 'visible',
        padding: '16px 40px',
        background: active ? '#aa0000' : '#CC0000',
        border: 'none',
        color: '#ffffff',
        fontFamily: 'Arial Black, sans-serif',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        cursor: active ? 'default' : 'pointer',
        borderRadius: 100,
        transition: 'background 0.3s ease, transform 0.15s ease',
        transform: active ? 'scale(0.97)' : 'scale(1)',
        minWidth: 200,
        ...style,
      }}
    >
      {/* Main text */}
      <span ref={textRef} style={{ display: 'block', position: 'relative', zIndex: 1 }}>
        {children}
      </span>

      {/* Bike icon — hidden initially, appears during animation */}
      <span
        ref={bikeRef}
        style={{
          display: 'none',
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <svg
          viewBox="0 0 48 30"
          width="36"
          height="22"
          fill="none"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        >
          <circle cx="9.5" cy="19" r="9" />
          <circle cx="38.5" cy="19" r="9" />
          <circle cx="9.5" cy="19" r="3" />
          <circle cx="38.5" cy="19" r="3" />
          <polyline points="14 3,18 3" />
          <polyline points="16 3,24 19,9.5 19,18 8,34 7,24 19" />
          <path d="m30,2h6s1,0,1,1-1,1-1,1" />
          <polyline points="32.5 2,38.5 19" />
          <circle cx="24" cy="19" r="3" />
          <line x1="22" y1="18" x2="26" y2="20" />
        </svg>
      </span>

      {/* Cart icon — hidden initially, appears during animation */}
      <span
        ref={cartRef}
        style={{
          display: 'none',
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <svg
          viewBox="0 0 36 26"
          width="32"
          height="22"
          fill="none"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        >
          <path d="M1 2.5H6L10 18.5H25.5L28.5 7.5L7.5 7.5" />
          <circle cx="11.5" cy="23" r="2" />
          <circle cx="24" cy="23" r="2" />
          <path d="M14.5 13.5L16.5 15.5L21.5 10.5" stroke="#ffffff" strokeWidth="1.5" />
        </svg>
      </span>
    </button>
  )
}
