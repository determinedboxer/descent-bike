import { useEffect, useState, useRef } from 'react'
import { useProgress } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onComplete: () => void
}

const WORD = 'DESCENT.'

function getPhrase(p: number): string {
  if (p >= 100) return 'READY.'
  if (p >= 85)  return 'ALMOST READY...'
  if (p >= 60)  return 'PREPARING FOR DESCENT...'
  if (p >= 40)  return 'CALIBRATING SUSPENSION...'
  if (p >= 20)  return 'LOADING CARBON FIBER...'
  return 'INITIALIZING SYSTEMS...'
}

export default function LoadingScreen({ onComplete }: Props) {
  const { progress } = useProgress()
  const [letterCount, setLetterCount] = useState(0)
  const [visible, setVisible]         = useState(true)
  const [fadeOut, setFadeOut]         = useState(false)
  const [lineWidth, setLineWidth]     = useState(0)
  const completedRef = useRef(false)

  const phrase = getPhrase(progress)

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

  // When progress hits 100 — wait 600ms then fade out over 800ms
  useEffect(() => {
    if (progress >= 100 && !completedRef.current) {
      completedRef.current = true
      setTimeout(() => {
        setFadeOut(true)
        setTimeout(() => {
          setVisible(false)
          onComplete()
        }, 800)
      }, 600)
    }
  }, [progress, onComplete])

  if (!visible) return null

  return (
    <>
      <style>{`
        @keyframes scanlinesDrift {
          from { background-position-y: 0px; }
          to   { background-position-y: 4px; }
        }
      `}</style>
      <motion.div
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: '#080808',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >

        {/* Scanlines — CRT drift effect */}
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.03) 4px)',
          animation: 'scanlinesDrift 2s linear infinite',
        }} />

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

        {/* Cinematic phrase — fades between stages */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phrase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              marginTop: 16,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              fontFamily: "'Montserrat', 'Arial Black', sans-serif",
              fontSize: 11,
              letterSpacing: '0.3em',
              color: '#CC0000',
              textTransform: 'uppercase',
            }}
          >
            {phrase}
          </motion.div>
        </AnimatePresence>

        {/* Progress percentage */}
        <div style={{
          marginTop: 8,
          fontFamily: 'Arial Black, sans-serif',
          fontSize: 10,
          letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.25)',
          textTransform: 'uppercase',
        }}>
          {Math.round(progress)}%
        </div>

      </motion.div>
    </>
  )
}
