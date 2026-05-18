import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useMouseParallax } from '../hooks/useMouseParallax'

const WORD = 'DOMINANCE.'

const STATS = [
  { value: '29',  unit: 'lbs', label: 'FRAME WEIGHT' },
  { value: '200', unit: 'mm',  label: 'REAR TRAVEL'  },
  { value: 'V10', unit: '',    label: 'PLATFORM'      },
]

const clipReveal = {
  initial:  { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
  animate:  { clipPath: 'inset(0% 0% 0% 0%)',   opacity: 1 },
}

export default function HeroContent() {
  const [letterCount, setLetterCount] = useState(0)
  const parallax = useMouseParallax(1)

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i++
      setLetterCount(i)
      if (i >= WORD.length) clearInterval(id)
    }, 60)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', alignItems: 'center' }}>

      {/* ── Left half — headline ──────────────────────── */}
      <div style={{
        width: '50%',
        paddingLeft: 80,
        transform: `translate(${parallax.x * 0.4}px, ${parallax.y * 0.3}px)`,
        transition: 'transform 0.1s linear',
      }}>
        {/* Eyebrow — clip reveal */}
        <div style={{ overflow: 'hidden', marginBottom: 16 }}>
          <motion.p
            {...clipReveal}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em' }}
          >
            Where design meets
          </motion.p>
        </div>

        {/* DOMINANCE — signature letter-by-letter reveal */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(72px, 10vw, 130px)',
          color: '#FFFFFF',
          letterSpacing: '-0.03em',
          lineHeight: 0.95,
          display: 'flex',
          flexWrap: 'wrap',
        }}>
          {WORD.split('').map((char, idx) => (
            <span
              key={idx}
              style={{
                display: 'inline-block',
                opacity: idx < letterCount ? 1 : 0,
                transform: idx < letterCount ? 'translateY(0)' : 'translateY(18px)',
                transition: 'opacity 0.25s ease, transform 0.25s ease',
                color: char === '.' ? '#CC0000' : '#FFFFFF',
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* ── Bottom-right — stats ──────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        right: 48,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        alignItems: 'flex-end',
        transform: `translate(${-parallax.x * 0.2}px, ${-parallax.y * 0.15}px)`,
        transition: 'transform 0.1s linear',
      }}>
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 + i * 0.2, ease: 'easeOut' }}
            style={{ textAlign: 'right' }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 5 }}>
              <span style={{
                fontFamily: 'Arial Black, Arial, sans-serif',
                fontSize: 32,
                color: '#FFFFFF',
                fontWeight: 900,
                lineHeight: 1,
              }}>
                {stat.value}
              </span>
              {stat.unit && (
                <span style={{ fontSize: 18, color: '#CC0000', fontWeight: 700 }}>
                  {stat.unit}
                </span>
              )}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 2 }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Bottom-center — scroll indicator ─────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          Scroll to explore
        </span>
        <div className="bounce-arrow" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
            <path d="M7 0v15M1 9l6 7 6-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </motion.div>
    </div>
  )
}
