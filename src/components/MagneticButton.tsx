import { useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

export default function MagneticButton({ children, style, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * 0.35
    const dy = (e.clientY - cy) * 0.35
    setPos({ x: dx, y: dy })
  }

  const handleLeave = () => {
    setPos({ x: 0, y: 0 })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        display: 'inline-block',
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: pos.x === 0 && pos.y === 0
          ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
          : 'transform 0.15s linear',
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  )
}
