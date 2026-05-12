import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import HowItWorks from './HowItWorks'

interface Props {
  onEnter: () => void
}

// ── Fan geometry ──────────────────────────────────────────────────────────────
const FAN = [
  { x: -220, y: 42, rotate: -22, scale: 0.73, z: 4 },
  { x: -141, y: 20, rotate: -15, scale: 0.82, z: 5 },
  { x:  -69, y:  6, rotate:  -7, scale: 0.91, z: 6 },
  { x:    0, y:  0, rotate:   0, scale: 1.00, z: 7 },
  { x:   69, y:  6, rotate:   7, scale: 0.91, z: 6 },
  { x:  141, y: 20, rotate:  15, scale: 0.82, z: 5 },
  { x:  220, y: 42, rotate:  22, scale: 0.73, z: 4 },
]

const CARD_W       = 138
const CARD_H       = 211
const ENTER_ORDER  = [3, 2, 4, 1, 5, 0, 6]

// ── Scatter vectors — computed once on mount ──────────────────────────────────
function makeScatterVectors() {
  return FAN.map((_, i) => {
    const arc    = (i / 7) * Math.PI * 2 - Math.PI / 2
    const jitter = (Math.random() - 0.5) * 1.0
    const angle  = arc + jitter
    const dist   = 860 + Math.random() * 360
    return {
      x:      Math.cos(angle) * dist,
      y:      Math.sin(angle) * dist - 120,
      rotate: (Math.random() - 0.5) * 680,
    }
  })
}

export default function SplashScreen({ onEnter }: Props) {
  const canvasRef      = useRef<HTMLCanvasElement>(null)
  const rafRef         = useRef<number>(0)
  const scatterRef     = useRef(makeScatterVectors())

  // Particle convergence toward the CTA button
  const ctaButtonRef   = useRef<HTMLButtonElement>(null)
  const ctaHoveredRef  = useRef(false)
  const convergenceRef = useRef(0)
  const ctaBoundsRef   = useRef<{ x: number; y: number } | null>(null)

  const [breathing, setBreathing]   = useState(false)
  const [scattering, setScattering] = useState(false)
  const [ctaEnabled, setCtaEnabled] = useState(false)
  const [ctaHovered, setCtaHovered] = useState(false)
  const [showHowItWorks, setShowHowItWorks] = useState(false)

  // Check for prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // ── Gold particle canvas + concentric circles ────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    type Particle = {
      x: number; y: number; vx: number; vy: number
      r: number; alpha: number; alphaDir: number; alphaDelta: number
    }

    const particles: Particle[] = Array.from({ length: 32 }, () => ({
      x:          Math.random() * window.innerWidth,
      y:          Math.random() * window.innerHeight,
      vx:         (Math.random() - 0.5) * 0.22,
      vy:         -(Math.random() * 0.32 + 0.07),
      r:          Math.random() * 1.4 + 0.4,
      alpha:      Math.random() * 0.22 + 0.06,
      alphaDir:   Math.random() > 0.5 ? 1 : -1,
      alphaDelta: Math.random() * 0.0022 + 0.0008,
    }))

    // Concentric circles state
    let circlePhase = 0

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2.3

      // ── Draw concentric circles (sound waves) ──
      circlePhase += 0.3
      const baseRadius = 40
      const circleCount = 8

      for (let i = 0; i < circleCount; i++) {
        const radius = baseRadius + (i * 35) + (circlePhase % 360) * 0.8
        const age = (circlePhase - i * 45) % 400
        const fadeOut = Math.max(0, 1 - age / 200)
        const opacity = fadeOut * 0.04

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(201,169,110,${opacity.toFixed(4)})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Lerp convergence strength — smooth on/off
      const targetConv = ctaHoveredRef.current ? 1 : 0
      convergenceRef.current += (targetConv - convergenceRef.current) * 0.038
      const conv   = convergenceRef.current
      const target = ctaBoundsRef.current

      // ── Draw particles ──
      for (const p of particles) {
        // Gentle attraction toward CTA center when hovering the button
        if (conv > 0.004 && target) {
          const dx   = target.x - p.x
          const dy   = target.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const pull = conv * 0.014
          p.vx += (dx / dist) * pull
          p.vy += (dy / dist) * pull
        }

        // Soft speed cap — particles drift, not launch
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > 1.6) {
          p.vx = (p.vx / spd) * 1.6
          p.vy = (p.vy / spd) * 1.6
        }

        p.x     += p.vx
        p.y     += p.vy
        p.alpha += p.alphaDir * p.alphaDelta
        if (p.alpha > 0.30 || p.alpha < 0.04) p.alphaDir *= -1
        if (p.y < -4)               p.y = canvas.height + 4
        if (p.x < -4)               p.x = canvas.width  + 4
        if (p.x > canvas.width + 4) p.x = -4

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,169,110,${p.alpha.toFixed(3)})`
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // ── Timers ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Instant reveal for users with prefers-reduced-motion
    const delay1 = prefersReducedMotion ? 0 : 1600
    const delay2 = prefersReducedMotion ? 0 : 3100
    const t1 = setTimeout(() => setBreathing(true), delay1)
    const t2 = setTimeout(() => setCtaEnabled(true), delay2)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [prefersReducedMotion])

  // ── CTA click ───────────────────────────────────────────────────────────────
  function handleReveal() {
    if (scattering || !ctaEnabled) return
    setScattering(true)
    setTimeout(onEnter, 720)
  }

  // ── CTA hover — update convergence target ───────────────────────────────────
  function handleCtaEnter(e: React.MouseEvent<HTMLButtonElement>) {
    ctaHoveredRef.current = true
    setCtaHovered(true)
    const rect = e.currentTarget.getBoundingClientRect()
    ctaBoundsRef.current  = {
      x: rect.left + rect.width  / 2,
      y: rect.top  + rect.height / 2,
    }
    e.currentTarget.style.borderColor = 'rgba(201,169,110,0.62)'
    e.currentTarget.style.color       = 'rgba(201,169,110,0.96)'
  }

  function handleCtaLeave(e: React.MouseEvent<HTMLButtonElement>) {
    ctaHoveredRef.current = false
    setCtaHovered(false)
    e.currentTarget.style.borderColor = 'rgba(201,169,110,0.30)'
    e.currentTarget.style.color       = 'rgba(201,169,110,0.76)'
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="splash-root"
      style={{
        minHeight:       '100dvh',
        backgroundColor: '#0a0a0f',
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        justifyContent:  'center',
        overflow:        'hidden',
        position:        'relative',
        padding:         '48px 24px 64px',
      }}
    >
      {/* ── Particles ── */}
      <canvas
        ref={canvasRef}
        style={{
          position:      'fixed',
          inset:         0,
          pointerEvents: 'none',
          zIndex:        0,
        }}
        aria-label="Decorative particle background animation"
      />

      {/* ── Vignette — dark edges, open center ── */}
      <div
        style={{
          position:      'fixed',
          inset:         0,
          background:    'radial-gradient(ellipse at 50% 44%, transparent 22%, rgba(10,10,15,0.46) 58%, rgba(10,10,15,0.82) 100%)',
          pointerEvents: 'none',
          zIndex:        1,
        }}
      />

      {/* ── ARCANE logo (top left) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{
          position:     'absolute',
          top:          24,
          left:         24,
          zIndex:       3,
          display:      'flex',
          alignItems:   'baseline',
          gap:          4,
          fontFamily:   'var(--font-mono)',
          fontSize:     10,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color:        'rgba(240,235,224,0.88)',
          borderBottom: '1px solid transparent',
          paddingBottom: 2,
          transition:   'border-color 0.3s ease',
          cursor:       'pointer',
          fontWeight:   300,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(200,169,110,0.40)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'transparent'
        }}
      >
        <span style={{ fontSize: 13, color: 'var(--arcane-gold)', fontWeight: 300 }}>✦</span>
        <span>ARCANE</span>
      </motion.div>

      {/* ── How it works button (integrated below tagline) ── */}

      {/* ── Content column ── */}
      <div
        style={{
          position:       'relative',
          zIndex:         2,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
        }}
      >
        {/* ── Headline ── */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 1.5 }}
          style={{
            fontFamily:    'var(--font-display)',
            fontSize:      'clamp(24px, 4.8vw, 44px)',
            fontWeight:    300,
            fontStyle:     'italic',
            color:         'rgba(240,235,224,0.92)',
            letterSpacing: '-0.01em',
            lineHeight:    1.2,
            margin:        '0 0 12px',
            textAlign:     'center',
            maxWidth:      'clamp(300px, 85vw, 580px)',
          }}
        >
          Every listener has a frequency.
        </motion.h1>

        {/* ── Subtitle with breathing letter-spacing ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            letterSpacing: breathing ? ['0.26em', '0.34em', '0.26em'] : '0.26em',
          }}
          transition={breathing ? { delay: 2.15, duration: 1.1, letterSpacing: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' } } : { delay: 2.15, duration: 1.1 }}
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      11,
            textTransform: 'uppercase',
            color:         'rgba(201,169,110,0.88)',
            margin:        '0 0 12px',
          }}
        >
          Discover yours.
        </motion.p>

        {/* ── Brand separator ── */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 2.4, duration: 0.6 }}
          style={{
            width: 40,
            height: 1,
            background: 'rgba(200,169,110,0.40)',
            margin: '16px 0 32px',
            transformOrigin: 'center',
          }}
        />

        {/* ── Animated equalizer bars ── */}
        {breathing && (
          <div
            style={{
              display:       'flex',
              alignItems:    'flex-end',
              justifyContent: 'center',
              gap:           '6px',
              height:        '32px',
              marginBottom:  '32px',
              opacity:       0.7,
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                animate={prefersReducedMotion ? {} : {
                  height: ['6px', '20px', '12px', '24px', '10px'],
                }}
                transition={prefersReducedMotion ? {} : {
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.12,
                }}
                style={{
                  width:       '2px',
                  background:  'rgba(201,169,110,0.88)',
                  borderRadius: '1px',
                }}
              />
            ))}
          </div>
        )}

        {/* ── Card fan ── */}
        {/* Outer wrapper handles responsive scale without fighting Framer Motion */}
        <div className="splash-fan-outer">
          <motion.div
            animate={breathing && !prefersReducedMotion ? { y: [0, -11, 0], scale: [1, 1.015, 1] } : {}}
            transition={breathing && !prefersReducedMotion ? { duration: 4.4, repeat: Infinity, ease: 'easeInOut' } : {}}
            style={{
              position:   'relative',
              width:      CARD_W + 220 * 2 + CARD_W,  // ≈ 716px
              height:     CARD_H + 64,
              marginBottom: 64,
              flexShrink: 0,
            }}
          >
            {/* Warm ambient glow behind fan center */}
            <div
              style={{
                position:      'absolute',
                top:           '38%',
                left:          '50%',
                transform:     'translate(-50%, -50%)',
                width:         360,
                height:        270,
                background:    'radial-gradient(ellipse, rgba(201,169,110,0.13) 0%, rgba(201,169,110,0.04) 50%, transparent 70%)',
                pointerEvents: 'none',
                zIndex:        0,
              }}
            />

            {/* ── Cards ── */}
            {FAN.map((card, i) => {
              const enterOrder = ENTER_ORDER.indexOf(i)
              const enterDelay = 0.12 + enterOrder * 0.08
              const scatterVec = scatterRef.current[i]

              return (
                <motion.div
                  key={i}
                  style={{
                    position:   'absolute',
                    top:        '50%',
                    left:       '50%',
                    marginTop:  -(CARD_H / 2),
                    marginLeft: -(CARD_W / 2),
                    width:      CARD_W,
                    zIndex:     card.z,
                    cursor:     scattering ? 'default' : 'pointer',
                    willChange: 'transform',
                  }}
                  initial={{
                    x:       card.x,
                    y:       320,
                    rotate:  card.rotate * 0.15,
                    scale:   0.5,
                    opacity: 0,
                  }}
                  animate={
                    scattering
                      ? {
                          x:       scatterVec.x,
                          y:       scatterVec.y,
                          rotate:  scatterVec.rotate,
                          scale:   0.18,
                          opacity: 0,
                        }
                      : {
                          x:       card.x,
                          y:       card.y,
                          rotate:  card.rotate,
                          scale:   card.scale,
                          opacity: 1,
                        }
                  }
                  transition={
                    scattering
                      ? { duration: 0.52, delay: i * 0.033 }
                      : { delay: enterDelay, duration: 0.78 }
                  }
                  whileHover={
                    !scattering
                      ? {
                          y:      card.y - 22,
                          scale:  card.scale * 1.07,
                          filter: 'drop-shadow(0 0 16px rgba(201,169,110,0.40)) drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
                          transition: { duration: 0.21, ease: 'easeOut' },
                        }
                      : {}
                  }
                >
                  <img
                    src="/cards/card_back.png"
                    alt=""
                    draggable={false}
                    style={{
                      width:            '100%',
                      height:           'auto',
                      borderRadius:     10,
                      display:          'block',
                      boxShadow:        '0 14px 40px rgba(0,0,0,0.65), 0 2px 8px rgba(0,0,0,0.4)',
                      userSelect:       'none',
                      WebkitUserSelect: 'none',
                    }}
                  />
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* ── CTA wrapper — flows on desktop, fixed at bottom on mobile ── */}
        <div className="splash-cta-wrap">
          <motion.button
            ref={ctaButtonRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: scattering ? 0 : 1,
              y:       scattering ? 10 : 0,
            }}
            transition={
              scattering
                ? { duration: 0.18 }
                : { delay: prefersReducedMotion ? 0 : 2.6, duration: prefersReducedMotion ? 0 : 1.0 }
            }
            whileHover={!scattering ? { scale: 1.03 } : {}}
            whileTap={!scattering ? { scale: 0.97 } : {}}
            onClick={handleReveal}
            onMouseEnter={handleCtaEnter}
            onMouseLeave={handleCtaLeave}
            aria-label="Read my arcane"
            aria-disabled={!ctaEnabled || scattering}
            style={{
              background:    ctaEnabled && !scattering ? 'var(--arcane-gold)' : 'transparent',
              border:        `1px solid ${ctaEnabled && !scattering ? 'var(--arcane-gold)' : 'rgba(201,169,110,0.30)'}`,
              borderRadius:  999,
              padding:       '16px 48px',
              fontFamily:    'var(--font-mono)',
              fontSize:      11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight:    ctaEnabled && !scattering ? 600 : 400,
              color:         ctaEnabled && !scattering ? '#0a0a0f' : 'rgba(201,169,110,0.76)',
              cursor:        ctaEnabled && !scattering ? 'pointer' : 'default',
              minHeight:     52,
              display:       'flex',
              alignItems:    'center',
              justifyContent: 'center',
              pointerEvents: ctaEnabled && !scattering ? 'auto' : 'none',
              transition:    'all 0.35s cubic-bezier(0.32,0.72,0,1)',
              outline:       '0',
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = '2px solid rgba(201,169,110,0.60)'
              e.currentTarget.style.outlineOffset = '2px'
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = '0'
            }}
          >
            Read my arcane
          </motion.button>
        </div>

        {/* ── How it works button ── */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 0.8 }}
          onClick={() => setShowHowItWorks(true)}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(201,169,110,0.5)',
            cursor: 'pointer',
            padding: '6px 8px',
            margin: 0,
            marginTop: 28,
            transition: 'all 0.25s ease',
            fontWeight: 400,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'rgba(201,169,110,0.85)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(201,169,110,0.5)'
          }}
          aria-label="How it works"
          title="How ARCANE reads you"
        >
          How it works ?
        </motion.button>
      </div>

      {/* ── How It Works Modal ── */}
      <HowItWorks isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />

      {/*
        Responsive fan scale + CTA pinning.
        CSS scaling the outer wrapper doesn't interfere with Framer Motion's
        internal transform calculations on its children.
        CTA wrapper becomes position:fixed on mobile — removed from flow,
        placed at the bottom with a gradient floor.
      */}
      <style>{`
        @keyframes pulse-border {
          0%, 100% {
            border-color: rgba(201,169,110,0.30);
            box-shadow: 0 0 4px rgba(201,169,110,0.08);
          }
          50% {
            border-color: rgba(201,169,110,0.42);
            box-shadow: 0 0 10px rgba(201,169,110,0.16);
          }
        }

        .splash-fan-outer {
          display: flex;
          justify-content: center;
          margin-bottom: 0;
        }
        .splash-cta-wrap {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        /* ≤ 420px ─ compact phones */
        @media (max-width: 420px) {
          .splash-root {
            padding-bottom: 0;
          }
          .splash-fan-outer {
            transform: scale(0.48);
            transform-origin: center top;
            margin-bottom: -124px;
          }
          .splash-cta-wrap {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: auto;
            padding: 0 24px 48px;
            background: linear-gradient(to bottom, transparent, rgba(10,10,15,0.96) 36%);
            z-index: 10;
          }
        }

        /* 421–600px ─ large phones */
        @media (min-width: 421px) and (max-width: 600px) {
          .splash-root {
            padding-bottom: 0;
          }
          .splash-fan-outer {
            transform: scale(0.62);
            transform-origin: center top;
            margin-bottom: -80px;
          }
          .splash-cta-wrap {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: auto;
            padding: 0 24px 56px;
            background: linear-gradient(to bottom, transparent, rgba(10,10,15,0.96) 36%);
            z-index: 10;
          }
        }

        /* 601–780px ─ small tablets / landscape phones */
        @media (min-width: 601px) and (max-width: 780px) {
          .splash-fan-outer {
            transform: scale(0.82);
            transform-origin: center top;
            margin-bottom: -44px;
          }
        }
      `}</style>
    </div>
  )
}
