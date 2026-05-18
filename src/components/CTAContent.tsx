import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useMouseParallax } from '../hooks/useMouseParallax'
import BikeCartButton from './BikeCartButton'

function FooterLink({ label, onClick }: { label: string; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        fontSize: 10,
        color: hovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'color 0.2s',
      }}
    >
      {label}
    </span>
  )
}

interface CTAProps {
  onOrderClick: () => void
  onToast: (msg: string) => void
}

export default function CTAContent({ onOrderClick, onToast }: CTAProps) {
  const ref                            = useRef<HTMLDivElement>(null)
  const inView                         = useInView(ref, { once: true, margin: '-80px' })
  const [secondaryHov, setSecondaryHov] = useState(false)
  const parallax                       = useMouseParallax(0.6)

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(204,0,0,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Content wrapper — left half */}
      <div style={{ width: '55%', paddingLeft: 80, textAlign: 'left' }}>

      {/* Eyebrow — clip reveal */}
      <div style={{ overflow: 'hidden', marginBottom: 24 }}>
        <motion.p
          initial={{ clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 }}
          animate={inView ? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          style={{ fontSize: 10, color: '#CC0000', letterSpacing: '0.3em', textTransform: 'uppercase' }}
        >
          Are you ready
        </motion.p>
      </div>

      {/* Headline — clip reveal */}
      <div style={{
        overflow: 'hidden',
        marginBottom: 40,
        transform: `translate(${parallax.x * 0.4}px, ${parallax.y * 0.3}px)`,
        transition: 'transform 0.1s linear',
      }}>
        <motion.h2
          initial={{ clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 }}
          animate={inView ? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(72px, 11vw, 150px)',
            color: '#FFFFFF',
            letterSpacing: '-0.04em',
            lineHeight: 0.9,
          }}
        >
          RIDE THE{' '}
          <span style={{ color: '#CC0000' }}>V10</span>
          <span style={{ color: '#CC0000' }}>.</span>
        </motion.h2>
      </div>

      {/* Subtext — fade up */}
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
        style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', maxWidth: 480, lineHeight: 1.7, marginBottom: 48 }}
      >
        Configure your build, choose your colorway, and join the ranks of the world's fastest downhill racers.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'flex-start', pointerEvents: 'auto' }}
      >
        <BikeCartButton onOrderClick={onOrderClick}>CONFIGURE &amp; ORDER</BikeCartButton>
        <button
          onMouseEnter={() => setSecondaryHov(true)}
          onMouseLeave={() => setSecondaryHov(false)}
          onClick={() => document.getElementById('section-specs')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            background: 'transparent',
            color: secondaryHov ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
            border: `1px solid ${secondaryHov ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)'}`,
            padding: '16px 40px',
            borderRadius: 100,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'color 0.2s, border-color 0.2s',
          }}
        >
          Learn More
        </button>
      </motion.div>

      </div>{/* end content wrapper */}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.65 }}
        style={{
          position: 'absolute',
          bottom: 40,
          left: 48,
          right: 48,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          pointerEvents: 'auto',
        }}
      >
        <span style={{ fontFamily: 'Arial Black, Arial, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
          DESCENT<span style={{ color: 'rgba(204,0,0,0.4)' }}>.</span>
        </span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          © 2025 SANTA CRUZ BICYCLES. ALL RIGHTS RESERVED.
        </span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Contact'].map((item) => (
            <FooterLink
              key={item}
              label={item}
              onClick={() => onToast(
                item === 'Contact'
                  ? 'Contact: hello@descent-bikes.com'
                  : 'This is a portfolio project — page not available'
              )}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
