import { useEffect, useRef } from 'react'

interface SmokeParticle {
  x: number; y: number; radius: number; opacity: number
  speedX: number; speedY: number; life: number; maxLife: number
}

export default function SmokeOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let animId: number
    let particles: SmokeParticle[] = []

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const spawn = (): SmokeParticle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 40,
      radius: 120 + Math.random() * 200,
      opacity: 0, speedX: (Math.random() - 0.5) * 0.5,
      speedY: -(0.4 + Math.random() * 0.7),
      life: 0, maxLife: 200 + Math.random() * 150,
    })

    for (let i = 0; i < 30; i++) {
      const p = spawn(); p.life = Math.random() * p.maxLife
      p.y = canvas.height - Math.random() * 400; particles.push(p)
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (particles.length < 40) particles.push(spawn())
      particles = particles.filter(p => p.life < p.maxLife)

      for (const p of particles) {
        p.life++; p.x += p.speedX; p.y += p.speedY
        const pr = p.life / p.maxLife
        if (pr < 0.2) p.opacity = (pr / 0.2) * 0.45
        else if (pr > 0.65) p.opacity = ((1 - pr) / 0.35) * 0.45
        else p.opacity = 0.45

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)
        g.addColorStop(0, `rgba(180,0,0,${p.opacity})`)
        g.addColorStop(0.3, `rgba(120,0,0,${p.opacity * 0.75})`)
        g.addColorStop(0.6, `rgba(60,0,0,${p.opacity * 0.35})`)
        g.addColorStop(1, `rgba(0,0,0,0)`)
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = g; ctx.fill()
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', mixBlendMode: 'screen' }} />
}