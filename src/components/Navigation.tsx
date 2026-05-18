import { motion } from 'framer-motion'
import BikeCartButton from './BikeCartButton'

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

interface NavProps {
  onOrderClick: () => void
}

export default function Navigation({ onOrderClick }: NavProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 48px',
        background: 'linear-gradient(to bottom, rgba(8,8,8,0.85), transparent)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontFamily: 'Arial Black, Arial, sans-serif',
          fontSize: 18,
          color: '#FFFFFF',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          pointerEvents: 'auto',
        }}
        onClick={() => scrollTo('section-hero')}
      >
        DESCENT<span style={{ color: '#CC0000' }}>.</span>
      </div>

      {/* Order button with bike animation */}
      <BikeCartButton style={{ padding: '10px 24px', fontSize: 11, minWidth: 'auto' }} onOrderClick={onOrderClick}>
        ORDER NOW
      </BikeCartButton>
    </motion.nav>
  )
}