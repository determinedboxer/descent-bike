import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const BUILDS = [
  {
    name: 'BASE',
    price: '$4,999',
    specs: ['SRAM GX Eagle', 'RockShox Lyrik', 'DT Swiss M1900'],
    recommended: false,
  },
  {
    name: 'PRO',
    price: '$7,499',
    specs: ['SRAM X01 Eagle', 'Fox 40 Factory', 'DT Swiss EX511'],
    recommended: true,
  },
  {
    name: 'WORLD CUP',
    price: '$12,999',
    specs: ['SRAM XX1 Eagle AXS', 'Fox 40 Factory', 'Carbon Reserve 29'],
    recommended: false,
  },
]

export default function OrderModal({ isOpen, onClose }: Props) {
  const [selected,  setSelected]  = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setTimeout(() => { setSubmitted(false); setName(''); setEmail('') }, 400)
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleSubmit = () => {
    if (!name || !email) return
    setSubmitted(true)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.target === overlayRef.current && onClose()}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9000,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            style={{
              background: '#0f0f0f',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 4,
              width: '100%',
              maxWidth: 720,
              padding: '56px 48px',
              position: 'relative',
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: 24,
                right: 24,
                background: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.5)',
                width: 32,
                height: 32,
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              ×
            </button>

            {!submitted ? (
              <>
                {/* Header */}
                <div style={{ marginBottom: 40 }}>
                  <p style={{
                    fontSize: 10,
                    letterSpacing: '0.3em',
                    color: '#CC0000',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                  }}>
                    Configure Your Build
                  </p>
                  <h2 style={{
                    fontFamily: 'var(--font-display, Arial Black)',
                    fontSize: 48,
                    color: '#fff',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                  }}>
                    BUILD YOUR V10<span style={{ color: '#CC0000' }}>.</span>
                  </h2>
                </div>

                {/* Build selector */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 12,
                  marginBottom: 36,
                }}>
                  {BUILDS.map((build, i) => (
                    <div
                      key={build.name}
                      onClick={() => setSelected(i)}
                      style={{
                        background: selected === i ? 'rgba(204,0,0,0.15)' : 'rgba(255,255,255,0.03)',
                        border: selected === i ? '1px solid #CC0000' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 4,
                        padding: '20px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        position: 'relative',
                      }}
                    >
                      {build.recommended && (
                        <div style={{
                          position: 'absolute',
                          top: -10,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: '#CC0000',
                          color: '#fff',
                          fontSize: 8,
                          letterSpacing: '0.2em',
                          padding: '3px 10px',
                          borderRadius: 100,
                          whiteSpace: 'nowrap',
                          textTransform: 'uppercase',
                        }}>
                          Most Popular
                        </div>
                      )}
                      <div style={{
                        fontFamily: 'Arial Black',
                        fontSize: 13,
                        color: selected === i ? '#fff' : 'rgba(255,255,255,0.5)',
                        letterSpacing: '0.1em',
                        marginBottom: 8,
                      }}>
                        {build.name}
                      </div>
                      <div style={{
                        fontFamily: 'Arial Black',
                        fontSize: 22,
                        color: selected === i ? '#CC0000' : 'rgba(255,255,255,0.3)',
                        marginBottom: 12,
                      }}>
                        {build.price}
                      </div>
                      {build.specs.map(spec => (
                        <div key={spec} style={{
                          fontSize: 10,
                          color: 'rgba(255,255,255,0.35)',
                          letterSpacing: '0.05em',
                          marginBottom: 4,
                        }}>
                          — {spec}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Form */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 4,
                      padding: '14px 16px',
                      color: '#fff',
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 4,
                      padding: '14px 16px',
                      color: '#fff',
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  style={{
                    width: '100%',
                    background: '#CC0000',
                    border: 'none',
                    borderRadius: 100,
                    padding: '16px 0',
                    color: '#fff',
                    fontFamily: 'Arial Black',
                    fontSize: 12,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  Request My Build
                </button>

                <p style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.2)',
                  letterSpacing: '0.1em',
                  marginTop: 16,
                  textTransform: 'uppercase',
                }}>
                  No payment required — we'll contact you within 48 hours
                </p>
              </>
            ) : (
              /* Success state */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: 'center', padding: '40px 0' }}
              >
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  border: '2px solid #CC0000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 32px',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-display, Arial Black)',
                  fontSize: 40,
                  color: '#fff',
                  marginBottom: 16,
                }}>
                  WE'LL BE IN TOUCH<span style={{ color: '#CC0000' }}>.</span>
                </h2>
                <p style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.4)',
                  lineHeight: 1.7,
                  maxWidth: 360,
                  margin: '0 auto 32px',
                }}>
                  Your {BUILDS[selected].name} build request has been received. A Santa Cruz specialist will contact you within 48 hours.
                </p>
                <button
                  onClick={onClose}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 100,
                    padding: '12px 32px',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: 11,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Close
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
