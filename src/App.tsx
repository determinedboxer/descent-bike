import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BikeScene from './components/BikeScene'
import LoadingScreen from './components/LoadingScreen'
import Navigation from './components/Navigation'
import ScrollSections from './components/ScrollSections'
import CustomCursor from './components/CustomCursor'
import SmokeOverlay from './components/SmokeOverlay'
import WatermarkV10 from './components/WatermarkV10'
import OrderModal from './components/OrderModal'
import Toast from './components/Toast'

function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let animId: number

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255
        data[i] = data[i + 1] = data[i + 2] = v
        data[i + 3] = 18
      }
      ctx.putImageData(imageData, 0, 0)
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        pointerEvents: 'none',
        opacity: 0.35,
        mixBlendMode: 'overlay',
      }}
    />
  )
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      right: 24,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 2,
      height: 120,
      background: 'rgba(255,255,255,0.08)',
      zIndex: 100,
      pointerEvents: 'none',
      borderRadius: 2,
    }}>
      <div style={{
        width: '100%',
        height: `${progress * 100}%`,
        background: '#CC0000',
        borderRadius: 2,
        transition: 'height 0.1s linear',
        boxShadow: '0 0 8px rgba(204,0,0,0.8)',
      }} />
    </div>
  )
}

export default function App() {
  const [loaded,    setLoaded]    = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [toast,     setToast]     = useState({ visible: false, message: '' })

  const showToast = (message: string) => setToast({ visible: true, message })
  const hideToast = () => setToast(t => ({ ...t, visible: false }))

  return (
    <>
      <CustomCursor />
      <BikeScene />
      <SmokeOverlay />
      <WatermarkV10 />
      <ScrollProgress />
      <LoadingScreen onComplete={() => setLoaded(true)} />
      <Navigation onOrderClick={() => setModalOpen(true)} />
      <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}>
        <ScrollSections onOrderClick={() => setModalOpen(true)} onToast={showToast} />
      </div>
      <OrderModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <Toast message={toast.message} visible={toast.visible} onHide={hideToast} />
      <GrainOverlay />
      <AnimatePresence>
        {loaded && (
          <motion.a
            href="https://lemons.studio"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '24px',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              background: 'rgba(8,8,8,0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'border-color 0.3s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#C8FF00')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
          >
            <span style={{
              fontFamily: 'monospace',
              fontSize: '12px',
              fontWeight: '700',
              color: '#ffffff',
              letterSpacing: '0.1em',
            }}>
              LEM<span style={{ color: '#C8FF00' }}>●</span>NS.
            </span>
            <span style={{
              fontFamily: 'sans-serif',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              Portfolio
            </span>
          </motion.a>
        )}
      </AnimatePresence>
    </>
  )
}
