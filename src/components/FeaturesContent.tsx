import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const FEATURES = [
  {
    number: '01',
    title: 'VIRTUAL PIVOT POINT',
    body: 'The patented VPP suspension delivers 200mm of ultra-supple rear travel that stays active under braking.',
  },
  {
    number: '02',
    title: 'CARBON FIBER LAYUP',
    body: 'Hand-laid carbon fiber — stiff enough to sprint, forgiving enough for a full day of World Cup runs.',
  },
  {
    number: '03',
    title: 'AGGRESSIVE GEOMETRY',
    body: '64° head angle, low BB, long reach. Planted and controlled on the most technical lines.',
  },
  {
    number: '04',
    title: 'RACE-PROVEN HERITAGE',
    body: '14 World Championship wins. More than any other bike in downhill history.',
  },
]

function FeatureItem({
  feature, index, inView, hovered, onHover,
}: {
  feature: typeof FEATURES[0]
  index: number
  inView: boolean
  hovered: number | null
  onHover: (idx: number | null) => void
}) {
  const isHovered = hovered === index

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.12, ease: 'easeOut' }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      style={{
        padding: '24px 0',
        paddingLeft: isHovered ? 16 : 0,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        borderLeft: `2px solid ${isHovered ? '#CC0000' : 'transparent'}`,
        cursor: 'default',
        transition: 'padding-left 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
        <span style={{
          fontSize: 13,
          color: isHovered ? '#CC0000' : 'rgba(204,0,0,0.5)',
          transition: 'color 0.25s ease',
          letterSpacing: '0.1em',
        }}>
          {feature.number}
        </span>
        <span style={{
          color: isHovered ? '#CC0000' : '#ffffff',
          transition: 'color 0.25s ease',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          display: 'inline-block',
          transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
        }}>
          {feature.title}
        </span>
      </div>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, paddingLeft: 30 }}>
        {feature.body}
      </p>
    </motion.div>
  )
}

export default function FeaturesContent() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [hovered, setHovered] = useState<number | null>(null)

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
      <div style={{ overflow: 'hidden', marginBottom: 16 }}>
        <motion.p
          initial={{ clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 }}
          animate={inView ? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          style={{ fontSize: 10, color: '#CC0000', letterSpacing: '0.2em', textTransform: 'uppercase' }}
        >
          Engineering excellence
        </motion.p>
      </div>

      {/* Heading — clip reveal */}
      <div style={{ overflow: 'hidden', marginBottom: 44 }}>
        <motion.h2
          initial={{ clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 }}
          animate={inView ? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(64px, 9vw, 120px)',
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          BUILT TO WIN<span style={{ color: '#CC0000' }}>.</span>
        </motion.h2>
      </div>

      {/* Feature list */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {FEATURES.map((feature, i) => (
          <FeatureItem
            key={feature.number}
            feature={feature}
            index={i}
            inView={inView}
            hovered={hovered}
            onHover={setHovered}
          />
        ))}
      </div>
    </div>
  )
}
