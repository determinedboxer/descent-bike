import { useState, useRef, useEffect } from 'react'
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
    </>
  )
}
