import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos     = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const frame   = useRef<number>()

  useEffect(() => {
    const onMove = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove)

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 3}px, ${pos.current.y - 3}px)`
      }
      if (ringRef.current) {
        ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12)
        ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12)
        ringRef.current.style.transform = `translate(${ringPos.current.x - 14}px, ${ringPos.current.y - 14}px)`
      }
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)

    // Scale up ring over interactive elements
    const grow = () => {
      if (!ringRef.current) return
      ringRef.current.style.width  = '44px'
      ringRef.current.style.height = '44px'
      ringRef.current.style.borderColor = 'rgba(204,0,0,0.9)'
    }
    const shrink = () => {
      if (!ringRef.current) return
      ringRef.current.style.width  = '28px'
      ringRef.current.style.height = '28px'
      ringRef.current.style.borderColor = 'rgba(204,0,0,0.5)'
    }

    // Re-attach on DOM changes (sections mount after loading)
    const attach = () => {
      document.querySelectorAll<Element>('button, a, [role="button"]').forEach((el) => {
        el.removeEventListener('mouseenter', grow)
        el.removeEventListener('mouseleave', shrink)
        el.addEventListener('mouseenter', grow)
        el.addEventListener('mouseleave', shrink)
      })
    }
    attach()
    const observer = new MutationObserver(attach)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (frame.current) cancelAnimationFrame(frame.current)
      observer.disconnect()
    }
  }, [])

  return null
}
