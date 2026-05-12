import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function HowItWorks({ isOpen, onClose }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.72)',
              zIndex: 40,
              backdropFilter: 'blur(2px)',
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: '-50%', y: 'calc(-50% + 20px)' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.94, x: '-50%', y: 'calc(-50% + 20px)' }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              zIndex: 50,
              width: 'calc(100% - 48px)',
              maxWidth: 520,
              maxHeight: 'calc(100vh - 48px)',
              overflowY: 'auto',
              backgroundColor: '#0a0a0f',
              border: '1px solid rgba(201,169,110,0.25)',
              borderRadius: 12,
              padding: 'clamp(24px, 8vw, 48px) clamp(24px, 6vw, 40px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(201,169,110,0.08)',
            }}
          >
            {/* Close button (top right) */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'none',
                border: 'none',
                color: 'rgba(201,169,110,0.5)',
                fontSize: 20,
                cursor: 'pointer',
                padding: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgba(201,169,110,0.8)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(201,169,110,0.5)'
              }}
              aria-label="Close"
            >
              ✕
            </button>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 5vw, 32px)',
                fontWeight: 300,
                color: 'rgba(240,235,224,0.95)',
                margin: '0 0 8px',
                letterSpacing: '-0.01em',
              }}
            >
              How ARCANE reads you
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(201,169,110,0.55)',
                margin: '0 0 36px',
                fontWeight: 400,
              }}
            >
              The technology behind your card
            </motion.p>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {[
                {
                  num: 1,
                  title: 'You share your universe',
                  desc: 'Genres, artists, how and when you listen. 6 questions that tell us more than 6 months of streams.',
                },
                {
                  num: 2,
                  title: 'AI analyzes the pattern',
                  desc: 'Our model cross-references your inputs against 54 archetypes — finding the emotional and sonic thread that connects your choices.',
                },
                {
                  num: 3,
                  title: 'Your card is revealed',
                  desc: 'Not an average. Not an algorithm. A mirror — the archetype that reflects how you actually experience music.',
                },
              ].map((step, idx) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.08, duration: 0.4 }}
                  style={{
                    display: 'flex',
                    gap: 16,
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      flexShrink: 0,
                      fontSize: 18,
                      color: 'rgba(201,169,110,0.7)',
                      lineHeight: 1.4,
                    }}
                  >
                    ✦
                  </div>

                  {/* Content */}
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 15,
                        fontWeight: 400,
                        color: 'rgba(240,235,224,0.92)',
                        margin: '0 0 6px',
                        letterSpacing: '-0.005em',
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: 'rgba(240,235,224,0.65)',
                        margin: 0,
                      }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 12,
                fontStyle: 'italic',
                fontWeight: 300,
                lineHeight: 1.6,
                color: 'rgba(201,169,110,0.48)',
                margin: '40px 0 0',
                paddingTop: 24,
                borderTop: '1px solid rgba(201,169,110,0.12)',
                textAlign: 'center',
              }}
            >
              Sound Identity is ARCANE's onboarding experience — helping new listeners discover who they really are before their first play.
            </motion.p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
