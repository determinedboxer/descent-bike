import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const SPECS = [
  { value: 200,  suffix: 'mm',  label: 'REAR TRAVEL',  decimals: 0, duration: 1.8 },
  { value: 29,   suffix: 'lbs', label: 'FRAME WEIGHT', decimals: 0, duration: 1.8 },
  { value: 27.5, suffix: '"',   label: 'WHEEL SIZE',   decimals: 1, duration: 2.2 },
]

const TAGS = ['WORLD CUP PROVEN', 'HAND-BUILT', 'RACE GEOMETRY']

function useCountUp(target: number, inView: boolean, duration = 1.5) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const increment = target / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(parseFloat(start.toFixed(1)))
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [inView, target, duration])
  return count
}

function SpecCounter({ target, decimals, inView, duration }: { target: number; decimals: number; inView: boolean; duration: number }) {
  const count = useCountUp(target, inView, duration)
  return <>{decimals > 0 ? count.toFixed(decimals) : Math.round(count)}</>
}

export default function SpecsContent() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div
      ref={ref}
      style={{
        width: '50%',
        paddingLeft: 80,
        paddingTop: 100,
        paddingBottom: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      {/* Eyebrow — clip reveal */}
      <div style={{ overflow: 'hidden', marginBottom: 40 }}>
        <motion.p
          initial={{ clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 }}
          animate={inView ? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          style={{ fontSize: 10, color: '#CC0000', textTransform: 'uppercase', letterSpacing: '0.25em' }}
        >
          Mastered for mountain dominance
        </motion.p>
      </div>

      {/* Counters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, marginBottom: 48 }}>
        {SPECS.map((spec, i) => (
          <motion.div
            key={spec.label}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: i * 0.15, ease: [0.25, 1, 0.5, 1] }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{
                fontFamily: 'Arial Black, Arial, sans-serif',
                fontSize: 'clamp(64px, 6.5vw, 88px)',
                color: '#FFFFFF',
                lineHeight: 1,
                fontWeight: 900,
              }}>
                <SpecCounter target={spec.value} decimals={spec.decimals} inView={inView} duration={spec.duration} />
              </span>
              <span style={{ fontFamily: 'Arial Black, Arial, sans-serif', fontSize: 28, color: '#CC0000', fontWeight: 900 }}>
                {spec.suffix}
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 4 }}>
              {spec.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Paragraph — fade up */}
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
        style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 420, marginBottom: 32 }}
      >
        The Santa Cruz V10 was built for one purpose: to dominate the mountain. With 200mm of rear travel, aggressive geometry, and a frame engineered for the extreme — this is the bike for those who refuse to compromise.
      </motion.p>

      {/* Tags */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
        style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
      >
        {TAGS.map((tag) => (
          <span key={tag} style={{
            border: '1px solid rgba(255,255,255,0.15)',
            padding: '6px 14px',
            fontSize: 10,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>
            {tag}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
