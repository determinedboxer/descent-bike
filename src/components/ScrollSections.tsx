import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useInView } from 'framer-motion'
import { animateCameraTo, scrollState, type SectionKey } from '../lib/cameraController'
import HeroContent     from './HeroContent'
import SpecsContent    from './SpecsContent'
import FeaturesContent from './FeaturesContent'
import CTAContent      from './CTAContent'

gsap.registerPlugin(ScrollTrigger)

const SECTIONS: { id: string; key: SectionKey }[] = [
  { id: 'section-hero',     key: 'hero'     },
  { id: 'section-specs',    key: 'specs'    },
  { id: 'section-features', key: 'features' },
  { id: 'section-cta',      key: 'cta'      },
]

const sectionStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: '100vh',
}

function SectionDivider() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} style={{ overflow: 'hidden', height: 3, background: 'rgba(204,0,0,0.15)' }}>
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, #CC0000, rgba(204,0,0,0.3))',
          boxShadow: '0 0 12px rgba(204,0,0,0.6)',
        }}
      />
    </div>
  )
}

interface ScrollSectionsProps {
  onOrderClick: () => void
  onToast: (msg: string) => void
}

export default function ScrollSections({ onOrderClick, onToast }: ScrollSectionsProps) {
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollState.progress = max > 0 ? window.scrollY / max : 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const triggers = SECTIONS.map(({ id, key }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top center',
        end: 'bottom center',
        onEnter:     () => animateCameraTo(key),
        onEnterBack: () => animateCameraTo(key),
      })
    )

    setTimeout(() => ScrollTrigger.refresh(), 200)

    return () => {
      window.removeEventListener('scroll', onScroll)
      triggers.forEach((t) => t.kill())
    }
  }, [])

  return (
    <div style={{ position: 'relative', zIndex: 10 }}>
      <section id="section-hero"     style={sectionStyle}><HeroContent /></section>
      <SectionDivider />
      <section id="section-specs"    style={sectionStyle}><SpecsContent /></section>
      <SectionDivider />
      <section id="section-features" style={sectionStyle}><FeaturesContent /></section>
      <SectionDivider />
      <section id="section-cta"      style={sectionStyle}><CTAContent onOrderClick={onOrderClick} onToast={onToast} /></section>
    </div>
  )
}
