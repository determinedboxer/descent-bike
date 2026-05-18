import { useEffect, useState, useRef } from 'react'
import { useProgress } from '@react-three/drei'

interface Props {
  onComplete: () => void
}

const WORD = 'DESCENT.'

export default function LoadingScreen({ onComplete }: Props) {
  const { progress } = useProgress()
  const [letterCount, setLetterCount] = useState(0)
  const [visible, setVisible] = useState(true)
  const [slideUp, setSlideUp] = useState(false)
  const [lineWidth, setLineWidth] = useState(0)
  const completedRef = useRef(false)

  // Animate line width on mount
  useEffect(() => {
    const timer = setTimeout(() => setLineWidth(200), 100)
    return () => clearTimeout(timer)
  }, [])

  // Letter by letter reveal after line appears
  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0
      const id = setInterval(() => {
        i++
        setLetterCount(i)
        if (i >= WORD.length) clearInterval(id)
      }, 60)
      return () => clearInterval(id)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  // When progress hits 100 — slide up and reveal site
  useEffect(() => {
    if (progress >= 100 && !completedRef.current) {
      completedRef.current = true
      setTimeout(() => {
        setSlideUp(true)
        setTimeout(() => {
          setVisible(false)
          onComplete()
        }, 700)
      }, 400)
    }
  }, [progress, onComplete])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      background: '#080808',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 0,
      transform: slideUp ? 'translateY(-100%)' : 'translateY(0)',
      transition: 'transform 0.7s cubic-bezier(0.76, 0, 0.24, 1)',
    }}>

      {/* SVG Animated Bicycle */}
      <svg
        viewBox="0 0 48 30"
        style={{
          width: 120,
          height: 'auto',
          marginBottom: 40,
          color: '#CC0000',
        }}
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
        >
          {/* Rear wheel */}
          <g transform="translate(9.5,19)">
            <circle
              r="9"
              strokeDasharray="56.549 56.549"
              style={{ animation: 'bikeTire 3s ease-in-out infinite' }}
            />
            <g
              strokeDasharray="31.416 31.416"
              strokeDashoffset="-23.562"
              style={{ animation: 'bikeSpokesSpin 3s linear infinite' }}
            >
              <circle r="5" style={{ animation: 'bikeSpokes 3s ease-in-out infinite' }} />
              <circle r="5" transform="rotate(180,0,0)" style={{ animation: 'bikeSpokes 3s ease-in-out infinite' }} />
            </g>
          </g>

          {/* Pedals */}
          <g transform="translate(24,19)">
            <g
              strokeDasharray="25.133 25.133"
              strokeDashoffset="-21.991"
              transform="rotate(67.5,0,0)"
              style={{ animation: 'bikePedalsSpin 3s linear infinite' }}
            >
              <circle r="4" style={{ animation: 'bikePedals 3s ease-in-out infinite' }} />
              <circle r="4" transform="rotate(180,0,0)" style={{ animation: 'bikePedals 3s ease-in-out infinite' }} />
            </g>
          </g>

          {/* Front wheel */}
          <g transform="translate(38.5,19)">
            <circle
              r="9"
              strokeDasharray="56.549 56.549"
              style={{ animation: 'bikeTire 3s ease-in-out infinite' }}
            />
            <g
              strokeDasharray="31.416 31.416"
              strokeDashoffset="-23.562"
              style={{ animation: 'bikeSpokesSpin 3s linear infinite' }}
            >
              <circle r="5" style={{ animation: 'bikeSpokes 3s ease-in-out infinite' }} />
              <circle r="5" transform="rotate(180,0,0)" style={{ animation: 'bikeSpokes 3s ease-in-out infinite' }} />
            </g>
          </g>

          {/* Frame parts */}
          <polyline
            points="14 3,18 3"
            strokeDasharray="5 5"
            style={{ animation: 'bikeSeat 3s ease-in-out infinite' }}
          />
          <polyline
            points="16 3,24 19,9.5 19,18 8,34 7,24 19"
            strokeDasharray="79 79"
            style={{ animation: 'bikeBody 3s ease-in-out infinite', stroke: '#CC0000' }}
          />
          <path
            d="m30,2h6s1,0,1,1-1,1-1,1"
            strokeDasharray="10 10"
            style={{ animation: 'bikeHandlebars 3s ease-in-out infinite', stroke: '#CC0000' }}
          />
          <polyline
            points="32.5 2,38.5 19"
            strokeDasharray="19 19"
            style={{ animation: 'bikeFront 3s ease-in-out infinite', stroke: '#CC0000' }}
          />
        </g>
      </svg>

      {/* Animated red line */}
      <div style={{
        width: lineWidth,
        height: 1,
        background: '#CC0000',
        marginBottom: 16,
        transition: 'width 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
      }} />

      {/* DESCENT. letter by letter */}
      <div style={{
        fontFamily: 'Arial Black, sans-serif',
        fontSize: 28,
        letterSpacing: '0.12em',
        color: '#ffffff',
        display: 'flex',
        marginBottom: 24,
        height: 36,
      }}>
        {WORD.split('').map((char, idx) => (
          <span
            key={idx}
            style={{
              display: 'inline-block',
              opacity: idx < letterCount ? 1 : 0,
              transform: idx < letterCount ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
              color: char === '.' ? '#CC0000' : '#ffffff',
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{
        width: 200,
        height: 1,
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 1,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: '#CC0000',
          borderRadius: 1,
          transition: 'width 0.3s ease',
          boxShadow: '0 0 8px rgba(204,0,0,0.6)',
        }} />
      </div>

      {/* Progress percentage */}
      <div style={{
        marginTop: 12,
        fontFamily: 'Arial Black, sans-serif',
        fontSize: 10,
        letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.25)',
        textTransform: 'uppercase',
      }}>
        {Math.round(progress)}%
      </div>

    </div>
  )
}
