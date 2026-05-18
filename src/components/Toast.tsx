import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  message: string
  visible: boolean
  onHide: () => void
}

export default function Toast({ message, visible, onHide }: Props) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onHide, 2500)
      return () => clearTimeout(timer)
    }
  }, [visible, onHide])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 8000,
            background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 100,
            padding: '12px 24px',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
