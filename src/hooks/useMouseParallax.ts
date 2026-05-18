import { useEffect, useState } from 'react'

export function useMouseParallax(strength = 1) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let current = { x: 0, y: 0 }
    let target = { x: 0, y: 0 }
    let animId: number

    const onMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * strength * 30
      target.y = (e.clientY / window.innerHeight - 0.5) * strength * 20
    }

    const animate = () => {
      current.x += (target.x - current.x) * 0.06
      current.y += (target.y - current.y) * 0.06
      setOffset({ x: current.x, y: current.y })
      animId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animId)
    }
  }, [strength])

  return offset
}
