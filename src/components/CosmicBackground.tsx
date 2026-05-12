import { motion } from 'framer-motion'
import { useState } from 'react'

interface CosmicBackgroundProps {
  accent: string
  isRevealing?: boolean
}

/**
 * COSMIC BACKGROUND — Layered deep space atmosphere
 * Layer 1: Deep space base (#050508)
 * Layer 2: Primary radial gradient (light source at 50%, 42%)
 * Layer 3: God rays (8 thin rays rotating slowly)
 * Layer 3.5: Nebula clouds (2-3 large drifting blobs, 120-180s cycles)
 * Layer 4: Particle drift (15-20 tiny particles, varying speeds, parallax effect)
 * Layer 5: Star field (70 tiny dots, 6 twinkling)
 * Layer 6: Corner darkening vignette
 */
export function CosmicBackground({ accent, isRevealing = false }: CosmicBackgroundProps) {
  const [stars] = useState(() => generateStars())

  // Check for prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Generate deterministic star positions
  function generateStars() {
    const stars: Array<{ id: number; x: number; y: number; opacity: number; twinkle: boolean }> = []
    let seed = 42

    // Seeded random generator
    function seededRandom() {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    // 70 stars: denser at edges, sparser near center
    for (let i = 0; i < 70; i++) {
      let x = seededRandom()
      let y = seededRandom()

      // Bias stars toward edges: weight distance from center
      const distFromCenter = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2)
      if (distFromCenter < 0.3 && seededRandom() < 0.6) {
        // Skip some center stars to reduce density
        continue
      }

      stars.push({
        id: i,
        x: x * 100,
        y: y * 100,
        opacity: 0.4 + seededRandom() * 0.2, // 40-60% opacity
        twinkle: i < 6, // First 6 stars twinkle
      })
    }

    return stars
  }

  // Convert hex to RGB for gradients
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 200, g: 169, b: 110 } // Fallback to gold
  }

  const rgb = hexToRgb(accent)
  const accentRgb = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`

  // God ray elements (8 rays)
  const godRays = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (360 / 8) * i,
    opacity: isRevealing ? 0.16 : 0.12, // Brighten during reveal
  }))

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#050508',
        overflow: 'hidden',
        zIndex: 0,
        width: '100%',
        height: '100%',
      }}
      aria-hidden="true"
    >
      {/* LAYER 2: Primary radial gradient (light source) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(
            ellipse 75% 80% at 50% 42%,
            rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${isRevealing ? 0.65 : 0.55}) 0%,
            rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${isRevealing ? 0.40 : 0.30}) 20%,
            rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12) 45%,
            rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.03) 70%,
            transparent 100%
          )`,
          transition: 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          zIndex: 1,
        }}
      />

      {/* LAYER 3: God rays (8 rays) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
        }}
      >
        {godRays.map(ray => (
          <motion.div
            key={`ray-${ray.id}`}
            animate={{ rotate: prefersReducedMotion ? 0 : 360 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 80,
              repeat: prefersReducedMotion ? 0 : Infinity,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '200%',
              height: '200%',
              transformOrigin: 'center center',
              pointerEvents: 'none',
            }}
          >
            <svg
              viewBox="0 0 1 1"
              preserveAspectRatio="none"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
              }}
            >
              <defs>
                <linearGradient id={`ray-gradient-${ray.id}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={accentRgb} stopOpacity={ray.opacity} />
                  <stop offset="100%" stopColor={accentRgb} stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect
                x="0.495"
                y="0"
                width="0.01"
                height="1"
                fill={`url(#ray-gradient-${ray.id})`}
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* LAYER 3.5: Nebula clouds (2-3 large drifting blobs) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2.5,
          pointerEvents: 'none',
        }}
      >
        {/* Nebula cloud 1 - Upper left drift */}
        <motion.div
          animate={prefersReducedMotion ? {} : {
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={prefersReducedMotion ? {} : {
            duration: 150,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: '15%',
            left: '-10%',
            width: '500px',
            height: '500px',
            background: `radial-gradient(ellipse 60% 40% at 50% 50%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08) 0%, transparent 70%)`,
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
        />

        {/* Nebula cloud 2 - Right side drift (opposite direction) */}
        <motion.div
          animate={prefersReducedMotion ? {} : {
            x: [0, -35, 0],
            y: [0, 25, 0],
          }}
          transition={prefersReducedMotion ? {} : {
            duration: 180,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: '40%',
            right: '-15%',
            width: '600px',
            height: '600px',
            background: `radial-gradient(ellipse 50% 60% at 50% 50%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.06) 0%, transparent 65%)`,
            filter: 'blur(100px)',
            pointerEvents: 'none',
          }}
        />

        {/* Nebula cloud 3 - Lower center drift (slow) */}
        <motion.div
          animate={prefersReducedMotion ? {} : {
            x: [0, 30, 0],
            y: [0, 35, 0],
          }}
          transition={prefersReducedMotion ? {} : {
            duration: 160,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            bottom: '-20%',
            left: '35%',
            width: '550px',
            height: '550px',
            background: `radial-gradient(ellipse 55% 45% at 50% 50%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05) 0%, transparent 70%)`,
            filter: 'blur(90px)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* LAYER 4: Particle drift (15-20 tiny particles) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2.7,
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: 18 }, (_, i) => {
          // Seeded random for particle positions and properties
          let seed = 42 + i * 117
          function seededRandom() {
            seed = (seed * 9301 + 49297) % 233280
            return seed / 233280
          }

          const startX = seededRandom() * 100
          const startY = seededRandom() * 100
          const duration = 20 + seededRandom() * 30 // 20-50s varying cycles
          const size = 0.5 + seededRandom() * 1.5 // 0.5-2px
          const opacity = 0.3 + seededRandom() * 0.4 // 0.3-0.7 opacity
          const driftX = (seededRandom() - 0.5) * 200 // -100 to +100px
          const driftY = (seededRandom() - 0.5) * 200 // -100 to +100px

          return (
            <motion.div
              key={`particle-${i}`}
              animate={prefersReducedMotion ? {} : {
                x: [0, driftX, 0],
                y: [0, driftY, 0],
              }}
              transition={prefersReducedMotion ? {} : {
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                left: `${startX}%`,
                top: `${startY}%`,
                width: size,
                height: size,
                backgroundColor: 'rgba(255, 255, 255, ' + opacity + ')',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />
          )
        })}
      </div>

      {/* LAYER 6: Star field (70 tiny dots) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3.5,
          pointerEvents: 'none',
        }}
      >
        {stars.map(star => (
          <motion.div
            key={`star-${star.id}`}
            animate={
              star.twinkle && !prefersReducedMotion
                ? {
                    opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
                  }
                : {}
            }
            transition={
              star.twinkle && !prefersReducedMotion
                ? {
                    duration: 3 + star.id * 0.7, // 3-7s staggered
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
                : {}
            }
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: '1px',
              height: '1px',
              backgroundColor: 'white',
              opacity: star.opacity,
              borderRadius: '50%',
            }}
          />
        ))}
      </div>

      {/* LAYER 7: Vignette edge darkening (smooth single gradient) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.25) 100%)
          `,
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
