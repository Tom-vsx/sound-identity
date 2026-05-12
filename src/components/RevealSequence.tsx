import { useEffect, useRef, useState } from 'react'
import type { UserSelections, CardData } from '../types'
import { CardRevealAnimation } from './CardRevealAnimation'
import { CosmicBackground } from './CosmicBackground'

interface Props {
  selections: UserSelections
  cardData: CardData | null
  error: string | null
  onRevealDone: () => void
}

const WORD_ANCHORS = [
  { top: 20, left: 15 }, { top: 28, left: 58 }, { top: 16, left: 68 },
  { top: 36, left: 25 }, { top: 44, left: 68 }, { top: 24, left: 42 },
  { top: 48, left: 16 }, { top: 32, left: 50 }, { top: 20, left: 32 },
  { top: 42, left: 48 }, { top: 26, left: 20 }, { top: 38, left: 76 },
  { top: 30, left: 8  }, { top: 46, left: 36 },
]

function buildWordPool(selections: UserSelections): string[] {
  const out: string[] = []
  for (const g of selections.genres) out.push(g.toLowerCase())
  for (const a of selections.artists.filter(Boolean).slice(0, 3)) {
    const parts = a.trim().split(/\s+/)
    out.push(parts[parts.length - 1].toLowerCase())
  }

  const listenFlavor: Record<string, string[]> = {
    'alone-night':     ['after-hours', 'private rituals', 'cabin pressure', 'tape grain'],
    'loud-car':        ['asphalt energy', 'open windows', 'wide stereo', 'highway repeat'],
    'background-work': ['soft focus', 'background hum', 'quiet engines', 'patient loops'],
    'at-party':        ['raw energy', 'sweat & strobes', 'shared rooms', 'uptempo'],
    'on-the-move':     ['forward motion', 'step tempo', 'transit pulse', 'hurried tender'],
    'ritual-listen':   ['warm rooms', 'low-end bath', 'domestic dub', 'ceremony'],
    'shared-moment':   ['two-way mirror', 'we-tone', 'soft bridge', 'signal shared'],
  }
  const seekFlavor: Record<string, string[]> = {
    'clear-head':      ['clean signal', 'negative space', 'uncluttered', 'still water'],
    'feel-deeply':     ['heart-first', 'open chord', 'tender weight', 'unguarded'],
    'get-energy':      ['raw energy', 'ignition', 'forward thrust', 'uplift'],
    'travel-mentally': ['mental cartography', 'elsewhere', 'distant rooms', 'drift'],
    'disappear':       ['contained stillness', 'vanishing', 'quiet bath', 'muted ego'],
    'remember':        ['time machine', 'archive', 'before', 'echo'],
    'not-alone':       ['shared frequency', 'understood', 'heard', 'witness'],
  }
  const eraFlavor: Record<string, string[]> = {
    '60s':      ['tape hiss', 'tube warmth', 'ribbon mics', 'studio choirs'],
    '70s':      ['analog warmth', 'long takes', 'gold light', 'velour'],
    '80s':      ['chrome', 'drum machines', 'neon residue', 'wide reverb'],
    '90s':      ['distortion', 'samplers', 'mid-budget', 'irony'],
    '00s':      ['compressed gloss', 'saturated', 'millennial sheen', 'loud masters'],
    '2010s':    ['streaming blur', 'in-between', 'post-genre', 'screen-lit'],
    'now':      ['this week', 'fresh ink', 'current pulse', 'right now'],
    'timeless': ['decade-agnostic', 'outside time', 'any room any year', 'evergreen'],
  }

  out.push(...(listenFlavor[selections.listening] ?? []))
  out.push(...(seekFlavor[selections.seek] ?? []))
  out.push(...(eraFlavor[selections.era] ?? []))

  const chaos = ['signal', 'static', 'resonance', 'waveform', 'archive', 'threshold',
    'membrane', 'echo', 'distortion', 'frequency', 'ghost', 'trace', 'channel', 'carrier']
  for (let i = 0; i < 4; i++) out.push(chaos[Math.floor(Math.random() * chaos.length)])

  const seen = new Set<string>()
  const unique: string[] = []
  for (const w of out) {
    const k = w.toLowerCase()
    if (seen.has(k)) continue
    seen.add(k)
    unique.push(w)
  }
  for (let i = unique.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[unique[i], unique[j]] = [unique[j], unique[i]]
  }
  return unique.slice(0, 14)
}

type FloatingWord = { id: string; text: string; top: number; left: number; size: number }

function ParticleCanvas({ accent, playing }: { accent: string; playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!playing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = 440
    canvas.height = 560

    type P = { x: number; y: number; vx: number; vy: number; life: number; size: number; type: 'star' | 'spark' | 'ring' }
    const particles: P[] = []
    const gold = accent || '#c9a96e'

    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 0.8 + Math.random() * 5
      particles.push({
        x: 220 + (Math.random() - 0.5) * 180,
        y: 280 + (Math.random() - 0.5) * 240,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        life: 1,
        size: 1 + Math.random() * 4,
        type: i < 20 ? 'ring' : Math.random() > 0.5 ? 'star' : 'spark',
      })
    }

    let rafId: number
    let elapsed = 0

    function draw() {
      ctx!.clearRect(0, 0, 440, 560)
      elapsed += 0.016
      if (elapsed > 3) return

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.04
        p.life -= 0.01
        if (p.life <= 0) continue

        ctx!.globalAlpha = Math.max(0, p.life) * 0.9

        if (p.type === 'ring') {
          ctx!.strokeStyle = gold
          ctx!.lineWidth = 0.5
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
          ctx!.stroke()
        } else if (p.type === 'star') {
          ctx!.fillStyle = gold
          ctx!.beginPath()
          for (let k = 0; k < 8; k++) {
            const a = (k / 8) * Math.PI * 2
            const r = k % 2 === 0 ? p.size : p.size * 0.35
            if (k === 0) ctx!.moveTo(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r)
            else ctx!.lineTo(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r)
          }
          ctx!.closePath()
          ctx!.fill()
        } else {
          ctx!.strokeStyle = gold
          ctx!.lineWidth = 1
          ctx!.beginPath()
          ctx!.moveTo(p.x, p.y)
          ctx!.lineTo(p.x - p.vx * 5, p.y - p.vy * 5)
          ctx!.stroke()
        }
      }
      ctx!.globalAlpha = 1
      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafId)
  }, [playing, accent])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 30,
        opacity: playing ? 1 : 0,
        transition: 'opacity 0.5s',
      }}
      width={440}
      height={560}
    />
  )
}

export default function RevealSequence({ selections, cardData, error, onRevealDone }: Props) {
  // Phases: reading → card-back → flip → done
  const [phase, setPhase] = useState<'reading' | 'card-back' | 'flip' | 'done'>('reading')
  const [visibleWords, setVisibleWords] = useState<FloatingWord[]>([])
  const [particles, setParticles] = useState(false)
  const wordListRef = useRef<string[]>([])
  const readyRef = useRef(false)
  const phaseRef = useRef('reading')

  useEffect(() => {
    wordListRef.current = buildWordPool(selections)
  }, [selections])

  // Word floating phase
  useEffect(() => {
    if (phase !== 'reading') return
    const wordList = wordListRef.current
    const wordLifetime = 1600
    const cadence = 340
    const timers: ReturnType<typeof setTimeout>[] = []

    wordList.forEach((text, i) => {
      const t1 = setTimeout(() => {
        const anchor = WORD_ANCHORS[i % WORD_ANCHORS.length]
        const top = anchor.top + (Math.random() * 5 - 2.5)
        const left = anchor.left + (Math.random() * 5 - 2.5)
        const size = 26 + Math.random() * 26
        const id = `${i}-${text}`
        setVisibleWords(prev => [...prev, { id, text, top, left, size }])
        const t2 = setTimeout(() => {
          setVisibleWords(prev => prev.filter(w => w.id !== id))
        }, wordLifetime)
        timers.push(t2)
      }, i * cadence)
      timers.push(t1)
    })

    // After 3.5s move to card-back — but only if card is ready
    const tCardBack = setTimeout(() => {
      phaseRef.current = 'curtain-pending'
      if (readyRef.current) {
        phaseRef.current = 'card-back'
        setPhase('card-back')
      }
    }, 3500)
    timers.push(tCardBack)

    return () => timers.forEach(clearTimeout)
  }, [phase])

  // When card arrives, check if we should advance
  useEffect(() => {
    if (!cardData && !error) return
    readyRef.current = true
    if (phaseRef.current === 'curtain-pending') {
      phaseRef.current = 'card-back'
      setPhase('card-back')
    }
  }, [cardData, error])

  // card-back → flip
  useEffect(() => {
    if (phase !== 'card-back') return
    const t = setTimeout(() => {
      setPhase('flip')
      setParticles(true)
      setTimeout(() => setParticles(false), 3000)
    }, 900)
    return () => clearTimeout(t)
  }, [phase])

  // flip → done
  useEffect(() => {
    if (phase !== 'flip') return
    const t = setTimeout(() => setPhase('done'), 1200)
    return () => clearTimeout(t)
  }, [phase])

  // done → hand off
  useEffect(() => {
    if (phase !== 'done') return
    const t = setTimeout(() => onRevealDone(), 600)
    return () => clearTimeout(t)
  }, [phase, onRevealDone])

  const accent = cardData?.accent ?? '#c9a96e'

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: '#0a0a0f',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 50, overflow: 'hidden',
      }}
    >
      {/* Cosmic background layer */}
      <CosmicBackground
        accent={accent}
        isRevealing={phase === 'flip' || phase === 'done'}
      />

      {/* Content on top of background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
      {/* Floating words */}
      {(phase === 'reading') && visibleWords.map(w => (
        <span
          key={w.id}
          style={{
            position: 'absolute',
            top: `${w.top}%`, left: `${w.left}%`,
            fontSize: w.size,
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'rgba(240,235,224,0.72)',
            letterSpacing: '0.02em',
            pointerEvents: 'none',
            animation: 'wordIn 0.35s cubic-bezier(0.32,0.72,0,1) both',
            whiteSpace: 'nowrap',
          }}
        >
          {w.text}
        </span>
      ))}

      {/* Reading label */}
      {phase === 'reading' && (
        <div
          style={{
            position: 'absolute', bottom: 44, left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11, letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color: 'var(--arcane-gold)',
            opacity: 0.75,
            animation: 'fadeIn 1.2s ease both',
            whiteSpace: 'nowrap',
            textShadow: `0 0 16px var(--arcane-gold)66`,
          }}
        >
          ✦ ARCANE IS READING YOUR FREQUENCY ✦
          <span style={{ display: 'inline-flex', gap: 2, marginLeft: 4 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ animation: `dotPulse 1.4s ease-in-out ${i * 0.3}s infinite` }}>.</span>
            ))}
          </span>
        </div>
      )}

      {/* Stage lines visible from card-back onward */}
      {(phase === 'card-back' || phase === 'flip' || phase === 'done') && (
        <>
          <div style={{
            position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px',
            background: `linear-gradient(to right, transparent, var(--arcane-gold)44 20%, var(--arcane-gold)44 80%, transparent)`,
            transform: 'translateY(-1px)',
            animation: 'lineOut 0.9s cubic-bezier(0.32,0.72,0,1) both',
            boxShadow: `0 0 20px var(--arcane-gold)88`,
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px',
            background: `linear-gradient(to right, transparent, var(--arcane-gold)44 20%, var(--arcane-gold)44 80%, transparent)`,
            transform: 'translateY(1px)',
            animation: 'lineOut 0.9s cubic-bezier(0.32,0.72,0,1) both',
            boxShadow: `0 0 20px var(--arcane-gold)88`,
          }} />
        </>
      )}

      {/* Card back / flip */}
      {(phase === 'card-back' || phase === 'flip' || phase === 'done') && (
        <div style={{ position: 'relative', perspective: 1200 }}>
          <ParticleCanvas accent={accent} playing={particles} />

          {/* Subtle glow during flip only, intense on final reveal */}
          {phase === 'flip' && (
            <>
              <div style={{
                position: 'absolute', inset: -20,
                borderRadius: 26,
                boxShadow: `0 0 40px 8px ${accent}44, 0 0 80px 16px ${accent}22`,
                animation: 'glowPulse 1.8s ease-in-out infinite',
                pointerEvents: 'none',
                zIndex: 5,
              }} />
              <div style={{
                position: 'absolute', inset: -4,
                borderRadius: 20,
                border: `1px solid ${accent}55`,
                animation: 'borderPulse 1.8s ease-in-out infinite',
                pointerEvents: 'none',
                zIndex: 5,
              }} />
            </>
          )}

          {/* Intense glow on final reveal */}
          {phase === 'done' && (
            <>
              {/* Outermost diffuse glow */}
              <div style={{
                position: 'absolute', inset: -60,
                borderRadius: 30,
                boxShadow: `0 0 140px 40px ${accent}22, 0 0 200px 70px ${accent}11`,
                animation: 'glowPulse 2.2s ease-in-out infinite',
                pointerEvents: 'none',
                zIndex: 3,
              }} />
              {/* Mid glow */}
              <div style={{
                position: 'absolute', inset: -35,
                borderRadius: 28,
                boxShadow: `0 0 80px 24px ${accent}44, 0 0 120px 40px ${accent}33`,
                animation: 'glowPulse 1.8s ease-in-out infinite 0.1s',
                pointerEvents: 'none',
                zIndex: 4,
              }} />
              {/* Inner vibrant glow */}
              <div style={{
                position: 'absolute', inset: -12,
                borderRadius: 22,
                boxShadow: `0 0 50px 12px ${accent}66, 0 0 80px 20px ${accent}55, inset 0 0 30px 2px ${accent}44`,
                animation: 'glowPulse 1.4s ease-in-out infinite 0.2s',
                pointerEvents: 'none',
                zIndex: 5,
              }} />
              {/* Pulse ring */}
              <div style={{
                position: 'absolute', inset: -4,
                borderRadius: 20,
                border: `2px solid ${accent}88`,
                animation: 'borderPulse 1.8s ease-in-out infinite',
                pointerEvents: 'none',
                zIndex: 5,
                boxShadow: `0 0 30px 6px ${accent}55 inset, 0 0 40px 8px ${accent}44`,
              }} />
            </>
          )}

          <div
            style={{
              width: 360, height: 540,
              position: 'relative',
              zIndex: 10,
            }}
          >
            <CardRevealAnimation
              backImage="/cards/card_back.png"
              frontImage={cardData?.card_file ? `/cards/${cardData.card_file}` : '/cards/card_back.png'}
              shouldReveal={phase === 'flip' || phase === 'done'}
              onRevealComplete={() => {
                // Trigger phase transition if needed
                if (phase === 'flip') {
                  // The parent component handles phase transitions
                }
              }}
              accent={accent}
            />
          </div>
        </div>
      )}

      {/* Waiting indicator */}
      {phase === 'card-back' && !cardData && !error && (
        <div style={{
          position: 'absolute', bottom: 44, left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-mono)',
          fontSize: 11, letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: accent,
          opacity: 0.7,
          whiteSpace: 'nowrap',
          textShadow: `0 0 12px ${accent}55`,
        }}>
          Channeling your frequency
          <span style={{ display: 'inline-flex', gap: 2, marginLeft: 4 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ animation: `dotPulse 1.4s ease-in-out ${i * 0.3}s infinite` }}>.</span>
            ))}
          </span>
        </div>
      )}

      <style>{`
        @keyframes wordIn {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dotPulse { 0%,100%{opacity:0.2} 50%{opacity:1} }
        @keyframes lineOut {
          from { clip-path: inset(0 50% 0 50%); opacity: 0; }
          to   { clip-path: inset(0 0% 0 0%); opacity: 1; }
        }
        @keyframes cardEntrance {
          from { opacity: 0; transform: scale(0.86) translateY(22px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes cardFlip {
          0%   { transform: rotateY(0deg); }
          100% { transform: rotateY(180deg); }
        }
        @keyframes shineSweep {
          from { transform: translateX(-120%); }
          to   { transform: translateX(220%); }
        }
        @keyframes glowPulse {
          0%,100% { opacity: 0.5; }
          50%     { opacity: 1; }
        }
        @keyframes borderPulse {
          0%,100% { opacity: 0.5; transform: scale(1); filter: brightness(0.8); }
          50%     { opacity: 1; transform: scale(1.04); filter: brightness(1.3); }
        }
      `}</style>
      </div>
    </div>
  )
}
