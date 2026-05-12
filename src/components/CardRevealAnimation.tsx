import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface CardRevealAnimationProps {
  backImage: string
  frontImage: string
  onRevealComplete?: () => void
  shouldReveal?: boolean
  accent: string
}


/**
 * COSMIC TAROT REVEAL — Mystical summoning of the card
 *
 * Timeline:
 * T+0→400ms — THE SUMMONING
 *   Card appears at scale 0.85, centered
 *   Background pulses from 0 → full intensity
 *   God rays fade in (0 opacity → visible)
 *   Summoning ring expands (card width → 150% then fades)
 *
 * T+400→800ms — THE FLIP
 *   Card rotates Y-axis (600ms, cubic-bezier for ceremonial feel)
 *   At rotateY(90deg): accent-colored flash (40% opacity), expands from center
 *   3 concentric rings expand from card center, different speeds
 *
 * T+800→1200ms — THE MATERIALIZATION
 *   Front face rotates in, scales 0.95 → 1.02 → 1.0 (overshoot)
 *   Holographic shimmer sweeps top-left to bottom-right
 *   Border glow: 0 → 3x intensity → settles
 *   12 rune particles emerge from edges, float up, fade
 *   8-10 stars intensify then settle
 *
 * T+1200ms+ — RESTING STATE
 *   Breathing: scale 1.0 → 1.006 → 1.0 on 5s loop
 *   Border glow pulses in sync with breathing
 *   God rays continue slow rotation
 *   Stars continue twinkle
 *   Ring expands from behind card every 8s (heartbeat)
 */
export function CardRevealAnimation({
  backImage,
  frontImage,
  onRevealComplete,
  shouldReveal = true,
  accent,
}: CardRevealAnimationProps) {
  const [isRevealing, setIsRevealing] = useState(false)
  const [showFront, setShowFront] = useState(false)
  const [showRunes, setShowRunes] = useState(false)

  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Rune symbols for cosmic particles
  const RUNES = ['✦', '✧', '◈', '⬡', '◇', '✧', '✦', '⬡', '◈', '✧', '◇', '✦']

  // Start reveal animation if shouldReveal is true
  useEffect(() => {
    if (shouldReveal && !isRevealing) {
      const startTimeout = setTimeout(() => {
        setIsRevealing(true)
      }, 100)
      return () => clearTimeout(startTimeout)
    }
  }, [shouldReveal, isRevealing])

  // Switch to front face at T+400ms (0.4s into reveal)
  // Instant reveal if prefers-reduced-motion
  useEffect(() => {
    if (isRevealing && !showFront) {
      const delay = prefersReducedMotion ? 0 : 400
      const switchTimeout = setTimeout(() => {
        setShowFront(true)
      }, delay)
      return () => clearTimeout(switchTimeout)
    }
  }, [isRevealing, showFront, prefersReducedMotion])

  // Show rune particles at T+800ms (when materialization begins)
  useEffect(() => {
    if (isRevealing && showFront && !showRunes) {
      const runeTimeout = setTimeout(() => {
        setShowRunes(true)
      }, 400) // 400ms after flip starts (T+400ms) + 400ms flip duration
      return () => clearTimeout(runeTimeout)
    }
  }, [isRevealing, showFront, showRunes])

  // Trigger completion callback at T+1200ms
  useEffect(() => {
    if (isRevealing && showFront) {
      const completeTimeout = setTimeout(() => {
        onRevealComplete?.()
      }, 1100) // 400ms (summoning) + 400ms (flip) + 300ms (buffer)
      return () => clearTimeout(completeTimeout)
    }
  }, [isRevealing, showFront, onRevealComplete])

  // ── SUMMONING PHASE: T+0→400ms ──
  const summoningVariants = {
    initial: {
      scale: 0.85,
      opacity: 0,
    },
    summoning: {
      scale: 0.85,
      opacity: 1,
    },
    materialized: {
      scale: 0.85,
      opacity: 1,
    },
  }

  // ── FLIP PHASE: T+400→800ms ──
  const flipVariants = {
    summoning: {
      rotateY: 0,
    },
    flipping: {
      rotateY: 180,
    },
    materialized: {
      rotateY: 180,
    },
  }

  // ── MATERIALIZATION PHASE: T+800→1200ms ──
  const materializationVariants = {
    materialized: {
      scale: [0.95, 1.02, 1.0],
    },
  }

  // ── RESTING STATE: T+1200ms+ ──
  const breathingVariants = {
    resting: {
      scale: [1.0, 1.006, 1.0],
    },
  }

  return (
    <motion.div
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SUMMONING RING — Expands from card at T+0→400ms */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isRevealing && !showFront && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: prefersReducedMotion ? 0 : 1.5, opacity: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.4,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            width: 360,
            height: 360,
            borderRadius: '50%',
            border: `2px solid ${accent}`,
            pointerEvents: 'none',
            zIndex: 1,
            filter: 'drop-shadow(0 0 20px ' + accent + '40)',
          }}
          aria-hidden="true"
        />
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MAIN CARD CONTAINER */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <motion.div
        initial="initial"
        animate={
          !isRevealing ? 'initial' :
          !showFront ? 'summoning' :
          'materialized'
        }
        variants={summoningVariants}
        transition={{
          duration: isRevealing && !showFront ? 0.4 : 0,
          ease: 'easeOut',
        }}
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* ─────────────────────────────────────────────────────── */}
        {/* FLIP CONTAINER */}
        {/* ─────────────────────────────────────────────────────── */}
        <motion.div
          initial="summoning"
          animate={
            !showFront ? 'summoning' :
            'flipping'
          }
          variants={flipVariants}
          transition={
            !showFront ? {
              duration: 0,
            } : {
              duration: 0.6,
              delay: 0,
               // Ceremonial easing
            }
          }
          style={{
            width: 'clamp(300px, 80vw, 360px)',
            aspectRatio: '2 / 3',
            transformStyle: 'preserve-3d',
            position: 'relative',
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
          }}
        >
          {/* ─────────────────────────────────────────────────────── */}
          {/* MATERIALIZATION SCALE ANIMATION */}
          {/* ─────────────────────────────────────────────────────── */}
          <motion.div
            initial="flipping"
            animate={showFront ? 'materialized' : 'flipping'}
            variants={materializationVariants}
            transition={
              showFront ? {
                duration: 0.4,
                delay: 0,
                times: [0, 0.5, 1],
              } : { duration: 0 }
            }
            style={{
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              position: 'relative',
            }}
          >
            {/* ─────────────────────────────────────────────────────── */}
            {/* BREATHING ANIMATION (resting state) */}
            {/* ─────────────────────────────────────────────────────── */}
            <motion.div
              initial="resting"
              animate={showFront ? 'resting' : 'materialized'}
              variants={breathingVariants}
              transition={
                showFront ? {
                  duration: 5,
                  repeat: Infinity,
                  delay: 1.2,
                  ease: 'easeInOut',
                } : { duration: 0 }
              }
              style={{
                width: '100%',
                height: '100%',
                transformStyle: 'preserve-3d',
                position: 'relative',
              }}
            >
              {/* ─────────────────────────────────────────────────────── */}
              {/* CARD BACK FACE */}
              {/* ─────────────────────────────────────────────────────── */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
                animate={{
                  opacity: showFront ? 0 : 1,
                }}
                transition={{ duration: 0.2, delay: 0.35 }}
              >
                <img
                  src={backImage}
                  alt="Card back"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                  }}
                />
              </motion.div>

              {/* ─────────────────────────────────────────────────────── */}
              {/* CARD FRONT FACE */}
              {/* ─────────────────────────────────────────────────────── */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  rotateY: 180,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
                animate={{
                  opacity: showFront ? 1 : 0,
                  boxShadow: showFront
                    ? [
                        `0 8px 32px rgba(0, 0, 0, 0.4)`,
                        `0 0 0 3px ${accent}, 0 0 48px ${accent}88`,
                        `0 8px 32px rgba(0, 0, 0, 0.4)`,
                      ]
                    : '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
                transition={
                  showFront ? {
                    opacity: { duration: 0.2, delay: 0.35 },
                    boxShadow: {
                      duration: 0.6,
                      delay: 0.4,
                      times: [0, 0.5, 1],
                      repeat: 0,
                    },
                  } : { duration: 0 }
                }
              >
                <img
                  src={frontImage}
                  alt="Card front"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                  }}
                />

                {/* ─────────────────────────────────────────────────────── */}
                {/* HOLOGRAPHIC SHIMMER — Sweeps diagonally */}
                {/* ─────────────────────────────────────────────────────── */}
                {showFront && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(135deg,
                        transparent,
                        rgba(255,220,150,0.25),
                        rgba(200,180,255,0.3),
                        rgba(150,210,255,0.25),
                        transparent)`,
                      pointerEvents: 'none',
                    }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{
                      duration: 0.4,
                      delay: 0.8,
                      ease: 'easeInOut',
                    }}
                  />
                )}

                {/* ─────────────────────────────────────────────────────── */}
                {/* ACCENT FLASH — At card edge-on (T+400ms) */}
                {/* ─────────────────────────────────────────────────────── */}
                {isRevealing && !showFront && (
                  <motion.div
                    style={{
                      position: 'fixed',
                      inset: 0,
                      background: accent,
                      pointerEvents: 'none',
                      zIndex: 100,
                    }}
                    animate={{
                      opacity: [0, 0.4, 0],
                    }}
                    transition={{
                      duration: 0.2,
                      delay: 0.38,
                      times: [0, 0.5, 1],
                    }}
                  />
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ─────────────────────────────────────────────────────── */}
        {/* CONCENTRIC RINGS — Expand at flip moment (T+400ms) */}
        {/* ─────────────────────────────────────────────────────── */}
        {isRevealing && !showFront && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }} aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`ring-${i}`}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.4 + i * 0.08,
                  ease: 'easeOut',
                }}
                style={{
                  position: 'absolute',
                  inset: '50% auto auto 50%',
                  width: 360,
                  height: 360,
                  marginTop: -180,
                  marginLeft: -180,
                  borderRadius: '50%',
                  border: `1px solid ${accent}`,
                  pointerEvents: 'none',
                }}
              />
            ))}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────── */}
        {/* RUNE PARTICLES — Emerge at T+800ms, float upward */}
        {/* ─────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {showRunes && (
            <div aria-hidden="true">
              {RUNES.map((rune, i) => {
                const angle = (360 / RUNES.length) * i
                const isLeft = angle > 180
                const startX = isLeft ? -180 : 180

                return (
                  <motion.div
                    key={`rune-${i}`}
                    initial={{
                      x: startX,
                      y: 0,
                      opacity: 1,
                      scale: 1,
                    }}
                    animate={{
                      x: 0,
                      y: -140,
                      opacity: 0,
                      scale: 0.5,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1.0,
                      delay: 0,
                      ease: 'easeOut',
                    }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      fontSize: 16,
                      color: accent,
                      pointerEvents: 'none',
                      zIndex: 15,
                      opacity: 0.8,
                    }}
                  >
                    {rune}
                  </motion.div>
                )
              })}
            </div>
          )}
        </AnimatePresence>

        {/* ─────────────────────────────────────────────────────── */}
        {/* HEARTBEAT RING — Expands every 8s in resting state */}
        {/* ─────────────────────────────────────────────────────── */}
        {showFront && (
          <motion.div
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: prefersReducedMotion ? 0 : 1.8, opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 1.2,
              delay: prefersReducedMotion ? 0 : 1.2,
              repeat: prefersReducedMotion ? 0 : Infinity,
              repeatDelay: 6.8,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: `1px solid ${accent}`,
              pointerEvents: 'none',
              zIndex: 0,
            }}
            aria-hidden="true"
          />
        )}
      </motion.div>
    </motion.div>
  )
}
