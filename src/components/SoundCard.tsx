import { useRef, useEffect, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import type { CardData } from '../types'
import { toRoman } from '../lib/roman'
import { CARDS_DATA } from '../data/cardsData'
import type { CardEntry } from '../data/cardsData'
import { CARD_MOCK_MAP } from '../data/cardMockMap'
import mockResultsRaw from '../data/mockResults.json'
import { CosmicBackground } from './CosmicBackground'
import JoinArcane from './JoinArcane'

// Ensure mockResults is properly accessible as an object
const mockResults: Record<string, any> = (mockResultsRaw as any)?.default ?? mockResultsRaw ?? {}

// Check for prefers-reduced-motion at module level
const PREFERS_REDUCED_MOTION = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ── Utilities ─────────────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, y: number,
  maxWidth: number, lineHeight: number,
): number {
  const words = text.split(' ')
  let line   = ''
  let currentY = y
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY)
      line     = words[n] + ' '
      currentY += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line.trim(), x, currentY)
  return currentY + lineHeight
}

// Old atmospheric components have been replaced by CosmicBackground

// ── Particle burst effect (reveal animation) ──────────────────────────────────
function ParticleBurst({ accent }: { accent: string }) {
  const particleCount = 12
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2
    const distance = 180
    return {
      id: i,
      angle,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      delay: i * 0.02,
      duration: 0.8 + Math.random() * 0.3,
    }
  })

  return (
    <>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            scale: 0,
          }}
          transition={{
            delay: p.delay,
            duration: p.duration,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: accent,
            pointerEvents: 'none',
            boxShadow: `0 0 12px ${accent}`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </>
  )
}


// ── Story modal — 9:16 with canvas download ───────────────────────────────────
function StoryModal({
  data, accent, onClose,
}: { data: CardData; accent: string; onClose: () => void }) {
  const [downloading, setDownloading] = useState(false)
  const cream = '#f0ebe0'

  async function handleDownload() {
    setDownloading(true)
    const W = 1080
    const H = 1920
    const canvas = document.createElement('canvas')
    canvas.width  = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    if (!ctx) { setDownloading(false); return }

    try {
      // ── Background ──
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, W, H)

      // ── Halo ──
      const haloY = H * 0.38
      const haloGrad = ctx.createRadialGradient(W / 2, haloY, 0, W / 2, haloY, 600)
      haloGrad.addColorStop(0,   hexToRgba(accent, 0.24))
      haloGrad.addColorStop(0.4, hexToRgba(accent, 0.10))
      haloGrad.addColorStop(1,   'transparent')
      ctx.fillStyle = haloGrad
      ctx.fillRect(0, 0, W, H)

      // ── Rays ──
      ctx.save()
      ctx.translate(W / 2, haloY)
      for (let i = 0; i < 16; i++) {
        const angle     = (i / 16) * Math.PI * 2
        const isPrimary = i % 4 === 0
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(Math.cos(angle) * 900, Math.sin(angle) * 900)
        ctx.strokeStyle = accent
        ctx.lineWidth   = isPrimary ? 2 : 0.7
        ctx.globalAlpha = isPrimary ? 0.11 : 0.05
        ctx.stroke()
      }
      ctx.restore()
      ctx.globalAlpha = 1

      // ── Card image ──
      const img = new Image()
      img.crossOrigin = 'anonymous'
      await new Promise<void>((resolve, reject) => {
        img.onload  = () => resolve()
        img.onerror = reject
        img.src     = `/cards/${data.card_file}`
      })

      const imgW = 640
      const imgH = Math.round(imgW * 1.15)
      const imgX = (W - imgW) / 2
      const imgY = 190

      ctx.save()
      roundedRect(ctx, imgX, imgY, imgW, imgH, 28)
      ctx.clip()
      ctx.drawImage(img, imgX, imgY, imgW, imgH)
      ctx.restore()

      // Card border
      ctx.save()
      roundedRect(ctx, imgX, imgY, imgW, imgH, 28)
      ctx.strokeStyle = hexToRgba(accent, 0.28)
      ctx.lineWidth   = 2
      ctx.stroke()
      ctx.restore()

      // Frequency tag on image
      ctx.textAlign   = 'center'
      ctx.fillStyle   = hexToRgba(cream, 0.38)
      ctx.font        = '400 22px "Courier New", monospace'
      ctx.fillText(`#${data.frequency}`, W / 2, imgY + 44)

      // ── Name ──
      const nameY = imgY + imgH + 108
      ctx.fillStyle = cream
      ctx.font      = '300 100px Georgia, "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.fillText(data.name, W / 2, nameY)

      // ── Genre ──
      const genreY = nameY + 68
      ctx.fillStyle   = hexToRgba(accent, 0.76)
      ctx.font        = '500 25px "Courier New", monospace'
      ctx.letterSpacing = '0.22em'
      ctx.fillText(data.genre.toUpperCase(), W / 2, genreY)
      ctx.letterSpacing = '0'

      // ── Thin divider ──
      const divY = genreY + 58
      ctx.save()
      const divGrad = ctx.createLinearGradient(W / 2 - 120, 0, W / 2 + 120, 0)
      divGrad.addColorStop(0,   'transparent')
      divGrad.addColorStop(0.5, hexToRgba(accent, 0.32))
      divGrad.addColorStop(1,   'transparent')
      ctx.beginPath()
      ctx.moveTo(W / 2 - 120, divY)
      ctx.lineTo(W / 2 + 120, divY)
      ctx.strokeStyle = divGrad
      ctx.lineWidth   = 1
      ctx.stroke()
      ctx.restore()

      // ── Quote ──
      ctx.fillStyle = hexToRgba(cream, 0.60)
      ctx.font      = 'italic 300 34px Georgia, "Times New Roman", serif'
      ctx.textAlign = 'center'
      wrapText(ctx, data.quote, W / 2, divY + 70, W - 240, 52)

      // ── Branding ──
      ctx.fillStyle = hexToRgba(cream, 0.16)
      ctx.font      = '400 22px "Courier New", monospace'
      ctx.textAlign = 'center'
      ctx.fillText('SOUNDIDENTITY.FM', W / 2, H - 96)

      canvas.toBlob(blob => {
        if (!blob) { setDownloading(false); return }
        const url = URL.createObjectURL(blob)
        const a   = document.createElement('a')
        a.href     = url
        a.download = `sound-identity-${data.name.toLowerCase().replace(/\s+/g, '-')}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setDownloading(false)
      }, 'image/png')

    } catch (err) {
      console.error('Canvas download failed:', err)
      setDownloading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Story format preview"
      onClick={onClose}
      style={{
        position:        'fixed',
        inset:           0,
        backgroundColor: 'rgba(0,0,0,0.94)',
        zIndex:          50,
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        justifyContent:  'center',
        padding:         '24px',
        gap:             20,
      }}
    >
      {/* ── 9:16 preview card ── */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width:           'min(85vw, 300px)',
          aspectRatio:     '9 / 16',
          backgroundColor: '#0a0a0f',
          borderRadius:    16,
          overflow:        'hidden',
          position:        'relative',
          border:          `1px solid ${accent}2e`,
          boxShadow:       `0 24px 80px rgba(0,0,0,0.88), 0 0 48px ${accent}18`,
          flexShrink:      0,
        }}
      >
        {/* Atmosphere */}
        <div style={{
          position:      'absolute',
          inset:         0,
          background:    `radial-gradient(ellipse at 50% 40%, ${accent}2a 0%, ${accent}0c 48%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex:        1,
        }} />

        {/* Frequency badge */}
        <div style={{
          position:      'absolute',
          top:           14,
          left:          0,
          right:         0,
          textAlign:     'center',
          fontFamily:    'var(--font-mono)',
          fontSize:      8,
          letterSpacing: '0.20em',
          color:         accent,
          opacity:       0.68,
          textTransform: 'uppercase',
          zIndex:        3,
          pointerEvents: 'none',
        }}>
          ✦ ARCANE · #{data.frequency}
        </div>

        {/* Card image */}
        <div style={{
          position:     'absolute',
          top:          '10%',
          left:         '50%',
          transform:    'translateX(-50%)',
          width:        '68%',
          aspectRatio:  '1 / 1.15',
          borderRadius: 10,
          overflow:     'hidden',
          boxShadow:    `0 10px 36px rgba(0,0,0,0.65), 0 0 0 1px ${accent}22`,
          zIndex:       2,
        }}>
          <img
            src={`/cards/${data.card_file}`}
            alt={data.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Bottom info */}
        <div style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          right:      0,
          padding:    '0 18px 22px',
          background: `linear-gradient(to top, #0a0a0f 64%, transparent)`,
          zIndex:     3,
        }}>
          {/* Name */}
          <div style={{
            fontFamily:    'var(--font-display)',
            fontSize:      26,
            fontWeight:    400,
            color:         cream,
            lineHeight:    1.0,
            letterSpacing: '-0.02em',
            textAlign:     'center',
            marginBottom:  5,
          }}>
            {data.name}
          </div>

          {/* Genre */}
          <div style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      8,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color:         accent,
            opacity:       0.76,
            textAlign:     'center',
            marginBottom:  10,
          }}>
            {data.genre}
          </div>

          {/* Divider */}
          <div style={{
            height:       1,
            background:   `linear-gradient(to right, transparent, ${accent}30, transparent)`,
            marginBottom: 10,
          }} />

          {/* Quote */}
          <div style={{
            fontFamily:          'var(--font-display)',
            fontSize:            10,
            fontStyle:           'italic',
            color:               'rgba(240,235,224,0.55)',
            lineHeight:          1.5,
            textAlign:           'center',
            marginBottom:        12,
            overflow:            'hidden',
            display:             '-webkit-box',
            WebkitLineClamp:     2,
            WebkitBoxOrient:     'vertical',
          } as React.CSSProperties}>
            {data.quote}
          </div>

          {/* Branding */}
          <div style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      7,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color:         'rgba(240,235,224,0.15)',
            textAlign:     'center',
          }}>
            ✦ ARCANE · arcane.fm
          </div>
        </div>
      </div>

      {/* ── Download button ── */}
      <button
        onClick={e => { e.stopPropagation(); handleDownload() }}
        disabled={downloading}
        aria-label={downloading ? 'Generating story image' : 'Download story as PNG image'}
        aria-busy={downloading}
        style={{
          background:    downloading ? 'rgba(201,169,110,0.10)' : 'rgba(201,169,110,0.08)',
          border:        `1px solid rgba(201,169,110,${downloading ? '0.20' : '0.36'})`,
          borderRadius:  6,
          padding:       '12px 28px',
          fontFamily:    'var(--font-mono)',
          fontSize:      11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color:         `rgba(201,169,110,${downloading ? '0.40' : '0.80'})`,
          cursor:        downloading ? 'default' : 'pointer',
          transition:    'all 0.2s',
          minHeight:     44,
          display:       'flex',
          alignItems:    'center',
          gap:           8,
        }}
        onMouseEnter={e => {
          if (!downloading) {
            e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.14)'
            e.currentTarget.style.borderColor      = 'rgba(201,169,110,0.55)'
            e.currentTarget.style.color            = 'rgba(201,169,110,0.95)'
          }
        }}
        onMouseLeave={e => {
          if (!downloading) {
            e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.08)'
            e.currentTarget.style.borderColor      = 'rgba(201,169,110,0.36)'
            e.currentTarget.style.color            = 'rgba(201,169,110,0.80)'
          }
        }}
      >
        <span style={{ fontSize: 13, lineHeight: 1 }}>↓</span>
        {downloading ? 'Generating…' : 'Download PNG'}
      </button>

      {/* ── Close ── */}
      <button
        onClick={onClose}
        aria-label="Close preview"
        style={{
          position:       'fixed',
          top:            20,
          right:          20,
          background:     'none',
          border:         'none',
          color:          'rgba(240,235,224,0.32)',
          fontFamily:     'var(--font-mono)',
          fontSize:       16,
          cursor:         'pointer',
          padding:        '10px',
          lineHeight:     1,
          minWidth:       44,
          minHeight:      44,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
        }}
      >
        ✕
      </button>
    </div>
  )
}

// ── Gallery card with flip & archetype name ───────────────────────────────────
function GalleryCard({
  card, isCurrent, accent, archetypeName,
}: { card: CardEntry; isCurrent: boolean; accent: string; archetypeName?: string }) {
  const [flipped, setFlipped] = useState(false)
  const [hovered, setHovered] = useState(false)
  const num = parseInt(card.file.replace('card_', '').replace('.png', ''), 10)
  const displayName = archetypeName || card.mood

  return (
    <div
      onClick={() => setFlipped(f => !f)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setFlipped(f => !f)}
      role="button"
      tabIndex={0}
      aria-label={`Card ${num}: ${displayName}${isCurrent ? ' — your card' : ''}`}
      style={{
        perspective: '800px',
        cursor:      'pointer',
        aspectRatio: '3 / 4',
        outline:     'none',
      }}
    >
      {/* Flip wrapper */}
      <div style={{
        position:        'relative',
        width:           '100%',
        height:          '100%',
        transformStyle:  'preserve-3d',
        transform:       flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transition:      'transform 0.55s cubic-bezier(0.32, 0.72, 0, 1)',
        borderRadius:    8,
      }}>

        {/* Front face — card illustration */}
        <div style={{
          position:                'absolute',
          inset:                   0,
          backfaceVisibility:      'hidden',
          WebkitBackfaceVisibility: 'hidden' as 'hidden',
          borderRadius:            8,
          overflow:                'hidden',
          boxShadow:               isCurrent
            ? `0 0 0 2px ${accent}, 0 0 22px ${accent}44, 0 8px 24px rgba(0,0,0,0.60)`
            : '0 3px 12px rgba(0,0,0,0.55)',
          transform:               isCurrent ? 'scale(1.04)' : 'scale(1)',
          transition:              'box-shadow 0.2s, transform 0.2s',
        }}>
          <img
            src={`/cards/${card.file}`}
            alt={displayName}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Hover: card number overlay */}
          {hovered && !flipped && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position:       'absolute',
                inset:          0,
                background:     'rgba(0,0,0,0.50)',
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            8,
                pointerEvents:  'none',
              }}>
              <div style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      14,
                fontWeight:    600,
                letterSpacing: '0.24em',
                color:         'rgba(240,235,224,0.90)',
                textTransform: 'uppercase',
              }}>
                #{String(num).padStart(2, '0')}
              </div>
              <div style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      8,
                letterSpacing: '0.12em',
                color:         'rgba(240,235,224,0.60)',
                textTransform: 'uppercase',
              }}>
                Tap to reveal
              </div>
            </motion.div>
          )}
        </div>

        {/* Back face — archetype info ────────────────────────────────────────── */}
        <div style={{
          position:                'absolute',
          inset:                   0,
          backfaceVisibility:      'hidden',
          WebkitBackfaceVisibility: 'hidden' as 'hidden',
          transform:               'rotateY(180deg)',
          borderRadius:            8,
          overflow:                'hidden',
          backgroundColor:         '#0e0c14',
          background:              `linear-gradient(135deg, ${card.accent}08 0%, transparent 100%)`,
          border:                  `1px solid ${card.accent}5a`,
          display:                 'flex',
          flexDirection:           'column',
          alignItems:              'center',
          justifyContent:          'center',
          padding:                 '12px 10px',
          gap:                     10,
          boxShadow:               `0 0 0 1px ${card.accent}28, 0 3px 12px rgba(0,0,0,0.55)`,
        }}>
          {/* Card number */}
          <div style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      9,
            fontWeight:    600,
            letterSpacing: '0.20em',
            color:         card.accent,
            opacity:       0.70,
            textTransform: 'uppercase',
            flexShrink:    0,
          }}>
            Arcane #{String(num).padStart(2, '0')}
          </div>

          {/* Accent line */}
          <div style={{
            width:           24,
            height:          1.5,
            backgroundColor: card.accent,
            opacity:         0.60,
            borderRadius:    1,
            flexShrink:      0,
          }} />

          {/* Archetype name — the real treasure */}
          <div style={{
            fontFamily:    'var(--font-display)',
            fontSize:      'clamp(11px, 3vw, 13px)',
            fontWeight:    400,
            color:         'rgba(240,235,224,0.95)',
            textAlign:     'center',
            lineHeight:    1.3,
            letterSpacing: '-0.01em',
            flex:          1,
            display:       'flex',
            alignItems:    'center',
            justifyContent: 'center',
          }}>
            {displayName}
          </div>

          {/* Subtle mood descriptor */}
          <div style={{
            fontFamily:      'var(--font-mono)',
            fontSize:        7,
            color:           'rgba(240,235,224,0.40)',
            textAlign:       'center',
            lineHeight:      1.3,
            letterSpacing:   '0.04em',
            textTransform:   'uppercase',
            overflow:        'hidden',
            display:         '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            maxWidth:        '100%',
          } as React.CSSProperties}>
            {card.mood}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Gallery modal — The Arcanes ───────────────────────────────────────────────
function GalleryModal({
  currentCard, accent, onClose,
}: { currentCard: string; accent: string; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="The Arcanes — all identities"
      style={{
        position:        'fixed',
        inset:           0,
        backgroundColor: 'rgba(10,9,16,0.98)',
        zIndex:          50,
        overflowY:       'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Atmosphere: halo at top */}
      <div style={{
        position:      'fixed',
        top:           0,
        left:          0,
        right:         0,
        height:        320,
        background:    `radial-gradient(ellipse at 50% 0%, ${accent}18 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex:        0,
      }} />

      <div style={{ maxWidth: 'clamp(340px, 90vw, 820px)', margin: '0 auto', padding: '0 20px 88px', position: 'relative', zIndex: 1 }}>

        {/* ── Sticky header ── */}
        <div style={{
          position:        'sticky',
          top:             0,
          backgroundColor: 'rgba(10,9,16,0.92)',
          backdropFilter:  'blur(12px)',
          paddingTop:      48,
          paddingBottom:   28,
          display:         'flex',
          justifyContent:  'space-between',
          alignItems:      'flex-end',
          zIndex:          10,
          borderBottom:    '1px solid rgba(240,235,224,0.05)',
          marginBottom:    32,
        }}>
          <div>
            <div style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      9,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color:         accent,
              opacity:       0.60,
              marginBottom:  7,
            }}>
              Sound Identity
            </div>
            <div style={{
              fontFamily:    'var(--font-display)',
              fontSize:      'clamp(26px, 4vw, 34px)',
              fontWeight:    400,
              color:         'rgba(240,235,224,0.90)',
              letterSpacing: '-0.02em',
              lineHeight:    1,
            }}>
              The Arcanes
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close gallery"
            style={{
              background:    'none',
              border:        '1px solid rgba(240,235,224,0.14)',
              borderRadius:  4,
              color:         'rgba(240,235,224,0.45)',
              fontFamily:    'var(--font-mono)',
              fontSize:      10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              cursor:        'pointer',
              padding:       '10px 16px',
              minHeight:     44,
              transition:    'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color       = 'rgba(240,235,224,0.80)'
              e.currentTarget.style.borderColor = 'rgba(240,235,224,0.30)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color       = 'rgba(240,235,224,0.45)'
              e.currentTarget.style.borderColor = 'rgba(240,235,224,0.14)'
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* ── Card grid ── */}
        <div className="gallery-card-grid" style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap:                 10,
        }}>
          {CARDS_DATA.map(card => {
            // Extract card key without .png extension for mockResults lookup
            const cardKeyWithoutExt = card.file.replace('.png', '')
            const mockKey = CARD_MOCK_MAP[cardKeyWithoutExt] || cardKeyWithoutExt
            const archetypeData = mockResults[mockKey]
            const archetypeName = archetypeData?.name

            return (
              <GalleryCard
                key={card.file}
                card={card}
                isCurrent={card.file === currentCard}
                accent={accent}
                archetypeName={archetypeName}
              />
            )
          })}
        </div>

        {/* Footer note */}
        <div style={{
          textAlign:     'center',
          fontFamily:    'var(--font-mono)',
          fontSize:      9,
          letterSpacing: '0.14em',
          color:         'rgba(240,235,224,0.16)',
          marginTop:     40,
        }}>
          Tap any card to reveal its energy
        </div>
      </div>
    </div>
  )
}

// ── ARCANE product connection section ─────────────────────────────────────────
function ArcaneCtaSection({ onNext }: { onNext: () => void }) {
  return <JoinArcane onContinue={onNext} />
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SoundCard({
  data,
  onNext,
  onRestart,
}: { data: CardData; onNext: () => void; onRestart: () => void }) {
  const cardRef     = useRef<HTMLDivElement>(null)
  const holoRef     = useRef<HTMLDivElement>(null)
  const currentRotX = useRef(0)
  const currentRotY = useRef(0)
  const targetRotX  = useRef(0)
  const targetRotY  = useRef(0)
  const rafId       = useRef<number>(0)
  const isHovering  = useRef(false)

  const [storyOpen,   setStoryOpen]   = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)

  const accent     = data.accent  || data.palette[0] || '#c9a96e'
  const cream      = '#f0ebe0'
  const inkDark    = '#0e0c14'
  const freqRoman  = toRoman(data.frequency)

  // ── Holo shimmer with archetype-based color randomization ──────────────────
  const getHoloColors = useCallback(() => {
    // Hash card name to generate deterministic but varied holo color mix per archetype
    const nameHash = data.name.split('').reduce((h, c) => h + c.charCodeAt(0), 0)
    const colorVariant = nameHash % 3

    switch(colorVariant) {
      case 0: // Warm gold shimmer
        return { primary: 'rgba(255,240,180,0.22)', secondary: 'rgba(255,200,100,0.12)' }
      case 1: // Cool silver shimmer
        return { primary: 'rgba(220,240,255,0.18)', secondary: 'rgba(180,220,255,0.10)' }
      case 2: // Iridescent purple-pink
        return { primary: 'rgba(255,200,240,0.20)', secondary: 'rgba(200,150,255,0.12)' }
      default:
        return { primary: 'rgba(255,240,180,0.22)', secondary: 'rgba(201,169,110,0.12)' }
    }
  }, [data.name])

  const updateHolo = useCallback((rx: number, ry: number) => {
    if (!holoRef.current) return
    const nx = (ry / 12 + 1) / 2
    const ny = (rx / 12 + 1) / 2
    const colors = getHoloColors()

    holoRef.current.style.background = `
      radial-gradient(circle at ${nx * 100}% ${ny * 100}%,
        ${colors.primary} 0%,
        ${colors.secondary} 30%,
        transparent 65%
      ),
      linear-gradient(
        ${105 + ry * 3}deg,
        transparent 30%,
        rgba(255,255,255,0.06) 45%,
        transparent 60%
      )
    `
    holoRef.current.style.animation = 'holo-shimmer 3s ease-in-out infinite'
  }, [getHoloColors])

  // ── Tilt RAF loop with enhanced shadow dynamics ──────────────────────────────
  const animateTilt = useCallback(() => {
    const dx = lerp(currentRotX.current, targetRotX.current, 0.08)
    const dy = lerp(currentRotY.current, targetRotY.current, 0.08)
    currentRotX.current = dx
    currentRotY.current = dy

    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(1200px) rotateX(${dx}deg) rotateY(${dy}deg)`
      const shadowX = dy * 2.2
      const shadowY = -dx * 2.2 + 32
      const tiltIntensity = Math.sqrt(dx * dx + dy * dy) / 12
      const accentR = parseInt(accent.slice(1,3), 16)
      const accentG = parseInt(accent.slice(3,5), 16)
      const accentB = parseInt(accent.slice(5,7), 16)

      cardRef.current.style.boxShadow = `
        ${shadowX}px ${shadowY}px 80px rgba(0,0,0,${0.55 + tiltIntensity * 0.2}),
        0 0 ${60 + tiltIntensity * 20}px rgba(${accentR},${accentG},${accentB},${0.3 + tiltIntensity * 0.3}),
        0 0 40px rgba(${accentR},${accentG},${accentB},0.2)
      `
    }
    updateHolo(dx, dy)

    if (isHovering.current || Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
      rafId.current = requestAnimationFrame(animateTilt)
    }
  }, [accent, updateHolo])

  // ── Mouse handlers ───────────────────────────────────────────────────────────
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const cx   = rect.left + rect.width  / 2
    const cy   = rect.top  + rect.height / 2
    targetRotY.current = ((e.clientX - cx) / (rect.width  / 2)) * 20
    targetRotX.current = -((e.clientY - cy) / (rect.height / 2)) * 20
  }

  function handleMouseEnter() {
    isHovering.current = true
    cancelAnimationFrame(rafId.current)
    rafId.current = requestAnimationFrame(animateTilt)
  }

  function handleMouseLeave() {
    isHovering.current = false
    targetRotX.current = 0
    targetRotY.current = 0
    rafId.current = requestAnimationFrame(animateTilt)
  }

  // ── Device orientation ───────────────────────────────────────────────────────
  useEffect(() => {
    function handleOrientation(e: DeviceOrientationEvent) {
      if (e.beta == null || e.gamma == null) return
      targetRotX.current = Math.max(-20, Math.min(20, e.beta  * 0.5))
      targetRotY.current = Math.max(-20, Math.min(20, e.gamma * 0.5))
      if (!isHovering.current) rafId.current = requestAnimationFrame(animateTilt)
    }
    window.addEventListener('deviceorientation', handleOrientation)
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      cancelAnimationFrame(rafId.current)
    }
  }, [animateTilt])

  // ── Touch tilt ───────────────────────────────────────────────────────────────
  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    if (!cardRef.current || !e.touches[0]) return
    const rect = cardRef.current.getBoundingClientRect()
    const cx   = rect.left + rect.width  / 2
    const cy   = rect.top  + rect.height / 2
    targetRotY.current = ((e.touches[0].clientX - cx) / (rect.width  / 2)) * 16
    targetRotX.current = -((e.touches[0].clientY - cy) / (rect.height / 2)) * 16
    if (!isHovering.current) {
      isHovering.current = true
      rafId.current = requestAnimationFrame(animateTilt)
    }
  }

  function handleTouchEnd() {
    isHovering.current = false
    targetRotX.current = 0
    targetRotY.current = 0
    rafId.current = requestAnimationFrame(animateTilt)
  }

  // ── Actions ──────────────────────────────────────────────────────────────────
  function handleSave() {
    const link      = document.createElement('a')
    link.href       = `/cards/${data.card_file}`
    link.download   = `sound-identity-${data.name.toLowerCase().replace(/\s+/g, '-')}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: '#0a0a0f', minHeight: '100dvh' }}>

      {/* ═════════════════════════════════════════════════════════════════════
          SECTION 1 — Card floating in the dark
      ═════════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          minHeight:      '100dvh',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          position:       'relative',
          overflow:       'hidden',
          padding:        'clamp(72px, 10vw, 100px) 24px clamp(56px, 8vw, 80px)',
          backgroundColor: 'transparent',
          zIndex:         1,
        }}
      >
        {/* ── Cosmic Atmosphere — positioned over entire card section ── */}
        <CosmicBackground accent={accent} isRevealing={false} />

        {/* ── Card scene ── */}
        <div style={{ position: 'relative', zIndex: 10 }}>

          {/* Floating animation wrapper */}
          <motion.div
            animate={PREFERS_REDUCED_MOTION ? {} : { y: [0, -12, 0] }}
            transition={PREFERS_REDUCED_MOTION ? {} : {
              duration: 3.2,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
            style={{ position: 'relative' }}
          >

            {/* Card entrance — Framer Motion wrapper with reveal flash & particle burst */}
            <motion.div
              initial={{ opacity: PREFERS_REDUCED_MOTION ? 1 : 0, y: PREFERS_REDUCED_MOTION ? 0 : 28, scale: PREFERS_REDUCED_MOTION ? 1 : 0.6 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              transition={PREFERS_REDUCED_MOTION ? {} : {
                duration: 0.95,
                
                type: 'spring',
                stiffness: 100,
                damping: 20
              }}
              style={{ position: 'relative', zIndex: 1 }}
          >
            {/* Reveal flash overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={PREFERS_REDUCED_MOTION ? {} : { opacity: [1, 0] }}
              transition={PREFERS_REDUCED_MOTION ? {} : { delay: 0, duration: 0.4 }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                pointerEvents: 'none',
                zIndex: 100,
              }}
              aria-hidden="true"
            />

            {/* Gold particle burst — emerges during reveal */}
            <div style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 5,
            }}>
              <ParticleBurst accent={accent} />
            </div>

            {/* Subtle entrance glow overlay */}
            <motion.div
              initial={{ opacity: PREFERS_REDUCED_MOTION ? 0 : 1, scale: 1.6 }}
              animate={{ opacity: 0, scale: 1 }}
              transition={PREFERS_REDUCED_MOTION ? {} : { delay: 0, duration: 0.8, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                inset: -20,
                borderRadius: 32,
                background: `radial-gradient(circle, ${accent}40 0%, transparent 70%)`,
                pointerEvents: 'none',
                zIndex: 0,
                filter: 'blur(20px)',
              }}
              aria-hidden="true"
            />

            {/* Card — receives RAF tilt transform */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                width:           'clamp(300px, 80vw, 360px)',
                borderRadius:    16,
                overflow:        'hidden',
                cursor:          'default',
                position:        'relative',
                willChange:      'transform',
                userSelect:      'none',
                backgroundColor: inkDark,
                background:      `
                  linear-gradient(135deg, ${accent}, rgba(240,235,224,0.6)) padding-box,
                  linear-gradient(135deg, ${accent}, rgba(201,169,110,0.4), ${accent}) border-box
                `,
                border:          '2.5px solid transparent',
                boxShadow:       `
                  0 0 30px rgba(${parseInt(accent.slice(1,3),16)},${parseInt(accent.slice(3,5),16)},${parseInt(accent.slice(5,7),16)},0.6),
                  0 0 60px rgba(${parseInt(accent.slice(1,3),16)},${parseInt(accent.slice(3,5),16)},${parseInt(accent.slice(5,7),16)},0.3),
                  0 40px 100px rgba(0,0,0,0.5),
                  0 0 40px rgba(${parseInt(accent.slice(1,3),16)},${parseInt(accent.slice(3,5),16)},${parseInt(accent.slice(5,7),16)},0.2)
                `,
                animation: 'border-glow 4s ease-in-out infinite',
                zIndex: 1,
              }}
            >
              {/* Illustration */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1.15', overflow: 'hidden' }}>
                <img
                  src={`/cards/${data.card_file}`}
                  alt={data.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* Warm glow */}
                <div style={{
                  position:      'absolute',
                  inset:         0,
                  background:    `radial-gradient(ellipse at 50% 60%, ${accent}1a 0%, transparent 70%)`,
                  pointerEvents: 'none',
                  animation:     'glow-pulse 3s ease-in-out infinite',
                }} />
                {/* Frequency tag */}
                <div style={{
                  position:      'absolute',
                  top:           12,
                  left:          0,
                  right:         0,
                  textAlign:     'center',
                  fontFamily:    'var(--font-mono)',
                  fontSize:      10,
                  letterSpacing: '0.16em',
                  color:         'rgba(240,235,224,0.48)',
                  textTransform: 'uppercase',
                  zIndex:        3,
                  pointerEvents: 'none',
                }}>
                  {`✦ ARCANE · #${data.frequency} · ${freqRoman}`}
                </div>
                {/* Bottom gradient */}
                <div style={{
                  position:      'absolute',
                  bottom:        0,
                  left:          0,
                  right:         0,
                  height:        56,
                  background:    `linear-gradient(to bottom, transparent, ${inkDark})`,
                  pointerEvents: 'none',
                }} />
              </div>

              {/* Compact identity panel */}
              <div style={{
                backgroundColor: inkDark,
                padding:         '18px 22px 22px',
                textAlign:       'center',
              }}>
                <div style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color:         accent,
                  opacity:       0.78,
                  marginBottom:  8,
                }}>
                  {data.genre}
                </div>
                <div style={{
                  fontFamily:    'var(--font-display)',
                  fontSize:      30,
                  fontWeight:    400,
                  color:         cream,
                  lineHeight:    1.05,
                  letterSpacing: '-0.02em',
                  marginBottom:  10,
                }}>
                  {data.name}
                </div>
                <div style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      10,
                  letterSpacing: '0.20em',
                  color:         'rgba(240,235,224,0.30)',
                  marginBottom:  14,
                }}>
                  — {data.bpm} BPM —
                </div>
                <div style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      7,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color:         'rgba(201,169,110,0.35)',
                }}>
                  ✦ ARCANE
                </div>
              </div>

              {/* Holographic shimmer overlay — TCG premium effect */}
              <motion.div
                ref={holoRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                style={{
                  position:      'absolute',
                  inset:         0,
                  borderRadius:  16,
                  pointerEvents: 'none',
                  zIndex:        4,
                  mixBlendMode:  'screen',
                }}
              />
            </div>
          </motion.div>

          </motion.div>
        </div>

        {/* ── Action buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            display:        'flex',
            gap:            10,
            marginTop:      36,
            position:       'relative',
            zIndex:         2,
            flexWrap:       'wrap',
            justifyContent: 'center',
          }}
        >
          {([
            { label: 'Save my arcane',    icon: '↓', action: handleSave                },
            { label: 'Story',        icon: '◻', action: () => setStoryOpen(true)  },
            { label: 'All arcanes',  icon: '✦', action: () => setGalleryOpen(true)},
          ] as const).map(btn => (
            <button
              key={btn.label}
              onClick={btn.action}
              style={{
                background:    'rgba(201,169,110,0.07)',
                border:        '1px solid rgba(201,169,110,0.32)',
                borderRadius:  4,
                padding:       '10px 18px',
                fontFamily:    'var(--font-mono)',
                fontSize:      11,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color:         'rgba(201,169,110,0.80)',
                cursor:        'pointer',
                transition:    'border-color 0.2s, color 0.2s, background 0.2s',
                minHeight:     44,
                display:       'flex',
                alignItems:    'center',
                gap:           7,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor     = 'rgba(201,169,110,0.58)'
                e.currentTarget.style.color           = 'rgba(201,169,110,0.96)'
                e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.12)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor     = 'rgba(201,169,110,0.32)'
                e.currentTarget.style.color           = 'rgba(201,169,110,0.80)'
                e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.07)'
              }}
              onMouseDown={e  => { e.currentTarget.style.transform = 'scale(0.97)' }}
              onMouseUp={e    => { e.currentTarget.style.transform = 'scale(1)'    }}
            >
              <span style={{ fontSize: 12, lineHeight: 1, opacity: 0.90 }}>{btn.icon}</span>
              {btn.label}
            </button>
          ))}
        </motion.div>

        {/* ── Scroll hint ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1.2 }}
          style={{
            position:      'absolute',
            bottom:        28,
            left:          '50%',
            transform:     'translateX(-50%)',
            fontFamily:    'var(--font-mono)',
            fontSize:      10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         'rgba(201,169,110,0.28)',
            animation:     'scroll-fade 2.4s ease-in-out infinite',
            whiteSpace:    'nowrap',
            pointerEvents: 'none',
          }}
        >
          ↓ Read more
        </motion.div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          SECTION 2 — Info frame
      ═════════════════════════════════════════════════════════════════════ */}
      <div style={{ backgroundColor: inkDark, position: 'relative', zIndex: 2 }}>
        <div style={{
          maxWidth: 'clamp(340px, 90vw, 720px)',
          margin:   '0 auto',
          padding:  'clamp(64px, 10vw, 100px) clamp(24px, 8vw, 72px) clamp(64px, 10vw, 100px)',
        }}>

          {/* Genre */}
          <div style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      10,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color:         accent,
            opacity:       0.78,
            marginBottom:  10,
          }}>
            {data.genre}
          </div>

          {/* Archetype name */}
          <div style={{
            fontFamily:    'var(--font-display)',
            fontSize:      'clamp(34px, 6vw, 52px)',
            fontWeight:    400,
            color:         cream,
            lineHeight:    1.0,
            letterSpacing: '-0.02em',
            marginBottom:  14,
          }}>
            {data.name}
          </div>

          {/* BPM */}
          <div style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      11,
            letterSpacing: '0.20em',
            color:         'rgba(240,235,224,0.28)',
            marginBottom:  44,
          }}>
            — {data.bpm} BPM —
          </div>

          {/* Divider */}
          <div style={{
            height:       1,
            background:   `linear-gradient(to right, ${accent}30, ${accent}14 55%, transparent)`,
            marginBottom: 44,
          }} />

          {/* Quote */}
          <div style={{
            fontFamily:   'var(--font-display)',
            fontSize:     'clamp(16px, 2.6vw, 20px)',
            fontStyle:    'italic',
            color:        'rgba(240,235,224,0.84)',
            lineHeight:   1.62,
            marginBottom: 52,
          }}>
            {data.quote}
          </div>

          {/* Meta rows */}
          <div style={{ marginBottom: 52 }}>
            {[
              { label: 'Power',  value: data.superpower },
              { label: 'Shadow', value: data.shadow     },
              { label: 'Place',  value: data.place      },
            ].map((row, i) => (
              <div
                key={row.label}
                style={{
                  display:       'flex',
                  gap:           20,
                  alignItems:    'baseline',
                  paddingBottom: 16,
                  borderBottom:  i < 2 ? '1px solid rgba(240,235,224,0.05)' : 'none',
                  marginBottom:  i < 2 ? 16 : 0,
                }}
              >
                <span style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      10,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color:         accent,
                  opacity:       0.68,
                  flexShrink:    0,
                  width:         54,
                }}>
                  {row.label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize:   14,
                  color:      'rgba(240,235,224,0.58)',
                  lineHeight: 1.55,
                  flex:       1,
                }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* ── Hex tile palette ── */}
          <div style={{
            display:      'flex',
            gap:          10,
            marginBottom: 52,
          }}>
            {data.palette.map((hex, i) => (
              <div
                key={i}
                title={hex}
                aria-label={`Palette colour ${hex}`}
                style={{
                  borderRadius: 6,
                  overflow:     'hidden',
                  boxShadow:    i === 0
                    ? `0 0 0 1.5px ${accent}, 0 2px 8px rgba(0,0,0,0.40)`
                    : '0 0 0 1px rgba(240,235,224,0.10), 0 2px 8px rgba(0,0,0,0.30)',
                  flexShrink:   0,
                }}
              >
                {/* Swatch */}
                <div style={{
                  width:           64,
                  height:          32,
                  backgroundColor: hex,
                }} />
                {/* Hex code */}
                <div style={{
                  padding:       '5px 6px',
                  backgroundColor: '#141218',
                  fontFamily:    'var(--font-mono)',
                  fontSize:      9,
                  letterSpacing: '0.06em',
                  color:         i === 0 ? 'rgba(240,235,224,0.65)' : 'rgba(240,235,224,0.42)',
                  textAlign:     'center',
                  textTransform: 'uppercase',
                }}>
                  {hex.toUpperCase()}
                </div>
              </div>
            ))}
          </div>

          {/* Button container */}
          <div style={{
            display:      'flex',
            gap:          16,
            alignItems:   'center',
            justifyContent: 'center',
            marginBottom: 56,
          }}>
            {/* Primary button: Share my arcane */}
            <button
              onClick={onNext}
              aria-label="Share my arcane card"
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding:       '16px 48px',
                backgroundColor: 'var(--arcane-gold)',
                border:        '1px solid var(--arcane-gold)',
                borderRadius:  999,
                color:         '#0a0a0f',
                cursor:        'pointer',
                transition:    'all 0.35s cubic-bezier(0.32,0.72,0,1)',
                minHeight:     52,
                display:       'flex',
                alignItems:    'center',
                justifyContent: 'center',
                fontWeight:    600,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '0.85'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '1'
              }}
              onMouseDown={e => {
                e.currentTarget.style.transform = 'scale(0.98)'
              }}
              onMouseUp={e => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              Share my arcane
            </button>

            {/* Secondary button: Start over */}
            <button
              onClick={onRestart}
              aria-label="Start over"
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding:       '16px 48px',
                backgroundColor: 'transparent',
                border:        '1px solid rgba(201,169,110,0.55)',
                borderRadius:  999,
                color:         'rgba(201,169,110,0.90)',
                cursor:        'pointer',
                transition:    'all 0.35s cubic-bezier(0.32,0.72,0,1)',
                minHeight:     52,
                display:       'flex',
                alignItems:    'center',
                justifyContent: 'center',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.16)'
                e.currentTarget.style.borderColor = 'rgba(201,169,110,0.75)'
                e.currentTarget.style.color = '#c9a96e'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(201,169,110,0.55)'
                e.currentTarget.style.color = 'rgba(201,169,110,0.90)'
              }}
              onMouseDown={e => {
                e.currentTarget.style.transform = 'scale(0.98)'
              }}
              onMouseUp={e => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              ← Start over
            </button>
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          SECTION 3 — ARCANE product connection
      ═════════════════════════════════════════════════════════════════════ */}
      <ArcaneCtaSection onNext={onNext} />

      {/* ── Modals ── */}
      {storyOpen   && <StoryModal   data={data} accent={accent} onClose={() => setStoryOpen(false)}   />}
      {galleryOpen && <GalleryModal currentCard={data.card_file} accent={accent} onClose={() => setGalleryOpen(false)} />}

      <style>{`
        /* ── Cosmic Atmosphere (no additional keyframes needed — handled by Framer Motion) ── */

        /* ── Card animations ── */
        @keyframes glow-pulse {
          0%,100% { opacity: 0.45; filter: brightness(1); }
          50%      { opacity: 1;   filter: brightness(1.2); }
        }
        @keyframes halo-breathe {
          0%,100% { opacity: 0.65; transform: scale(1);    }
          50%     { opacity: 1;    transform: scale(1.05); }
        }
        @keyframes rays-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes scroll-fade {
          0%,100% { opacity: 0.28; transform: translateX(-50%) translateY(0); }
          50%     { opacity: 0.55; transform: translateX(-50%) translateY(4px); }
        }
        @keyframes border-glow {
          0%, 100% {
            box-shadow:
              0 0 30px rgba(201, 169, 110, 0.45),
              0 0 60px rgba(201, 169, 110, 0.25),
              0 40px 100px rgba(0, 0, 0, 0.5),
              0 0 40px rgba(201, 169, 110, 0.18);
          }
          50% {
            box-shadow:
              0 0 45px rgba(201, 169, 110, 0.65),
              0 0 90px rgba(201, 169, 110, 0.38),
              0 40px 110px rgba(0, 0, 0, 0.6),
              0 0 60px rgba(201, 169, 110, 0.28);
          }
        }
        @keyframes holo-shimmer {
          0%, 100% {
            opacity: 0.45;
          }
          50% {
            opacity: 0.85;
          }
        }

        /* Gallery grid responsive columns */
        .gallery-card-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (min-width: 768px) {
          .gallery-card-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }
      `}</style>
    </div>
  )
}
