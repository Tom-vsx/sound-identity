import { useEffect, useRef } from 'react'
import { ERA_OPTIONS } from '../../data/onboardingData'

interface Props {
  selected: string
  onChange: (id: string) => void
}

// ── Era animated visuals ──────────────────────────────────────────────────────

function Era60s({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 60 60" width="100%" height="100%" style={{ display: 'block' }}>
      <style>{`
        @keyframes petal-rotate { from { transform: rotate(0deg); transform-origin: 30px 30px; } to { transform: rotate(360deg); transform-origin: 30px 30px; } }
        @keyframes petal-pulse { 0%,100% { opacity: 0.7 } 50% { opacity: 1 } }
      `}</style>
      <g style={{ animation: active ? 'petal-rotate 8s linear infinite' : 'none' }}>
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2
          const cx = 30 + Math.cos(a) * 10
          const cy = 30 + Math.sin(a) * 10
          return <ellipse key={i} cx={cx} cy={cy} rx="7" ry="4" fill="#c9a96e" opacity="0.75"
            transform={`rotate(${(i / 6) * 360} ${cx} ${cy})`} />
        })}
      </g>
      <circle cx="30" cy="30" r="5" fill="#c9a96e" opacity="0.9" style={{ animation: active ? 'petal-pulse 2s ease-in-out infinite' : 'none' }} />
    </svg>
  )
}

function Era70s({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 60 60" width="100%" height="100%" style={{ display: 'block' }}>
      <style>{`
        @keyframes sun70-rise { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }
      `}</style>
      <defs>
        <linearGradient id="sunset70" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8854a" />
          <stop offset="100%" stopColor="#c9a96e" />
        </linearGradient>
      </defs>
      <g style={{ animation: active ? 'sun70-rise 4s ease-in-out infinite' : 'none' }}>
        <circle cx="30" cy="34" r="13" fill="url(#sunset70)" opacity="0.9" />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2
          return (
            <line key={i}
              x1={(30 + Math.cos(a) * 15).toFixed(1)} y1={(34 + Math.sin(a) * 15).toFixed(1)}
              x2={(30 + Math.cos(a) * 20).toFixed(1)} y2={(34 + Math.sin(a) * 20).toFixed(1)}
              stroke="#c9a96e" strokeWidth="1.2" opacity="0.5" />
          )
        })}
      </g>
      <rect x="0" y="42" width="60" height="2" fill="#c9a96e" opacity="0.25" />
    </svg>
  )
}

function Era80s({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 60 60" width="100%" height="100%" style={{ display: 'block' }}>
      <style>{`
        @keyframes neon-pulse80 { 0%,100% { opacity: 0.6 } 50% { opacity: 1 } }
        @keyframes grid-scan { 0% { transform: translateY(0) } 100% { transform: translateY(10px) } }
      `}</style>
      <g style={{ animation: active ? 'grid-scan 2s linear infinite' : 'none' }}>
        {Array.from({ length: 5 }, (_, i) => (
          <line key={`h${i}`} x1="5" y1={10 + i * 10} x2="55" y2={10 + i * 10}
            stroke="#c9a96e" strokeWidth="0.6" opacity="0.35" />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`v${i}`} x1={5 + i * 8} y1="10" x2={5 + i * 8} y2="50"
            stroke="#c9a96e" strokeWidth="0.6" opacity="0.35" />
        ))}
      </g>
      <text x="30" y="34" textAnchor="middle" fontSize="10" fontFamily="monospace"
        fill="#c9a96e" opacity="0.9" style={{ animation: active ? 'neon-pulse80 1.5s ease-in-out infinite' : 'none' }}>
        80s
      </text>
    </svg>
  )
}

function Era90s({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 60 60" width="100%" height="100%" style={{ display: 'block' }}>
      <style>{`
        @keyframes cassette-spin { from { transform: rotate(0deg); transform-origin: 50% 50%; } to { transform: rotate(360deg); transform-origin: 50% 50%; } }
      `}</style>
      {/* Cassette body */}
      <rect x="10" y="18" width="40" height="26" rx="3" fill="none" stroke="#c9a96e" strokeWidth="0.8" opacity="0.7" />
      <rect x="18" y="22" width="24" height="18" rx="2" fill="none" stroke="#c9a96e" strokeWidth="0.5" opacity="0.4" />
      {/* Left reel */}
      <g transform="translate(23,31)" style={{ animation: active ? 'cassette-spin 2s linear infinite' : 'none' }}>
        <circle cx="0" cy="0" r="5" fill="none" stroke="#c9a96e" strokeWidth="0.7" opacity="0.7" />
        <circle cx="0" cy="0" r="2" fill="#c9a96e" opacity="0.6" />
        <line x1="0" y1="-3" x2="0" y2="-5" stroke="#c9a96e" strokeWidth="0.8" opacity="0.5" />
        <line x1="2.6" y1="1.5" x2="4.3" y2="2.5" stroke="#c9a96e" strokeWidth="0.8" opacity="0.5" />
        <line x1="-2.6" y1="1.5" x2="-4.3" y2="2.5" stroke="#c9a96e" strokeWidth="0.8" opacity="0.5" />
      </g>
      {/* Right reel */}
      <g transform="translate(37,31)" style={{ animation: active ? 'cassette-spin 2s linear infinite' : 'none' }}>
        <circle cx="0" cy="0" r="5" fill="none" stroke="#c9a96e" strokeWidth="0.7" opacity="0.7" />
        <circle cx="0" cy="0" r="2" fill="#c9a96e" opacity="0.6" />
        <line x1="0" y1="-3" x2="0" y2="-5" stroke="#c9a96e" strokeWidth="0.8" opacity="0.5" />
        <line x1="2.6" y1="1.5" x2="4.3" y2="2.5" stroke="#c9a96e" strokeWidth="0.8" opacity="0.5" />
        <line x1="-2.6" y1="1.5" x2="-4.3" y2="2.5" stroke="#c9a96e" strokeWidth="0.8" opacity="0.5" />
      </g>
      {/* Tape window */}
      <path d="M22 29 Q30 33 38 29" fill="none" stroke="#c9a96e" strokeWidth="0.5" opacity="0.3" />
    </svg>
  )
}

function Era00s({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 60 60" width="100%" height="100%" style={{ display: 'block' }}>
      <style>{`
        @keyframes cd-spin { from { transform: rotate(0deg); transform-origin: 30px 30px; } to { transform: rotate(360deg); transform-origin: 30px 30px; } }
      `}</style>
      <g style={{ animation: active ? 'cd-spin 3s linear infinite' : 'none' }}>
        <circle cx="30" cy="30" r="18" fill="none" stroke="#c9a96e" strokeWidth="0.7" opacity="0.6" />
        <circle cx="30" cy="30" r="14" fill="none" stroke="#c9a96e" strokeWidth="0.4" opacity="0.3" />
        <circle cx="30" cy="30" r="10" fill="none" stroke="#c9a96e" strokeWidth="0.4" opacity="0.3" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2
          return (
            <line key={i}
              x1={(30 + Math.cos(a) * 6).toFixed(1)} y1={(30 + Math.sin(a) * 6).toFixed(1)}
              x2={(30 + Math.cos(a) * 18).toFixed(1)} y2={(30 + Math.sin(a) * 18).toFixed(1)}
              stroke="#c9a96e" strokeWidth="0.4" opacity="0.2" />
          )
        })}
      </g>
      <circle cx="30" cy="30" r="4" fill="#0a0a0f" stroke="#c9a96e" strokeWidth="0.7" opacity="0.8" />
      <circle cx="30" cy="30" r="1.5" fill="#c9a96e" opacity="0.9" />
    </svg>
  )
}

function Era2010s({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 60 60" width="100%" height="100%" style={{ display: 'block' }}>
      <style>{`
        @keyframes bar1 { 0%,100% { height: 10px; y: 35px } 50% { height: 24px; y: 21px } }
        @keyframes bar2 { 0%,100% { height: 18px; y: 27px } 33% { height: 28px; y: 17px } 66% { height: 8px; y: 37px } }
        @keyframes bar3 { 0%,100% { height: 22px; y: 23px } 25% { height: 12px; y: 33px } 75% { height: 30px; y: 15px } }
        @keyframes bar4 { 0%,100% { height: 14px; y: 31px } 40% { height: 26px; y: 19px } 80% { height: 6px; y: 39px } }
        @keyframes bar5 { 0%,100% { height: 20px; y: 25px } 60% { height: 32px; y: 13px } }
      `}</style>
      {[
        { x: 9, anim: 'bar1' },
        { x: 18, anim: 'bar2' },
        { x: 27, anim: 'bar3' },
        { x: 36, anim: 'bar4' },
        { x: 45, anim: 'bar5' },
      ].map(({ x, anim }) => (
        <rect key={x} x={x} y="35" width="6" height="10" rx="1" fill="#c9a96e" opacity="0.75"
          style={{ animation: active ? `${anim} 1.4s ease-in-out infinite` : 'none' }} />
      ))}
    </svg>
  )
}

function EraNow({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 60 60" width="100%" height="100%" style={{ display: 'block' }}>
      <style>{`
        @keyframes orb-pulse { 0%,100% { r: 12; opacity: 0.85 } 50% { r: 16; opacity: 0.6 } }
        @keyframes orb-ring { 0%,100% { r: 20; opacity: 0.3 } 50% { r: 24; opacity: 0.1 } }
      `}</style>
      <circle cx="30" cy="30" r="24" fill="none" stroke="#a8e832" strokeWidth="0.5"
        style={{ animation: active ? 'orb-ring 2s ease-in-out infinite' : 'none' }} />
      <circle cx="30" cy="30" r="12" fill="#a8e832" opacity="0.85"
        style={{ animation: active ? 'orb-pulse 2s ease-in-out infinite' : 'none' }} />
      <circle cx="30" cy="30" r="5" fill="#0a0a0f" opacity="0.6" />
    </svg>
  )
}

function EraTimeless({ active }: { active: boolean }) {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!active || !pathRef.current) return
    let t = 0
    let rafId: number
    const animate = () => {
      t += 0.02
      if (pathRef.current) {
        const opacity = 0.5 + 0.5 * Math.sin(t)
        pathRef.current.style.opacity = String(opacity)
      }
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [active])

  return (
    <svg viewBox="0 0 60 60" width="100%" height="100%" style={{ display: 'block' }}>
      <style>{`
        @keyframes inf-trace { 0% { stroke-dashoffset: 200 } 100% { stroke-dashoffset: 0 } }
      `}</style>
      {/* Infinity symbol via two overlapping circles */}
      <path
        ref={pathRef}
        d="M 20 30 C 20 20, 10 15, 10 30 C 10 45, 20 40, 30 30 C 40 20, 50 15, 50 30 C 50 45, 40 40, 30 30 C 20 20, 10 15, 10 30"
        fill="none"
        stroke="#c9a96e"
        strokeWidth="1.5"
        strokeDasharray="200"
        style={{
          animation: active ? 'inf-trace 3s linear infinite' : 'none',
        }}
        opacity="0.7"
      />
    </svg>
  )
}

const ERA_VISUALS: Record<string, React.ComponentType<{ active: boolean }>> = {
  '60s': Era60s,
  '70s': Era70s,
  '80s': Era80s,
  '90s': Era90s,
  '00s': Era00s,
  '2010s': Era2010s,
  'now': EraNow,
  'timeless': EraTimeless,
}

export default function StepEra({ selected, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Which era speaks to you"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: 8,
      }}
    >
      {ERA_OPTIONS.map(opt => {
        const Visual = ERA_VISUALS[opt.id]
        const isSelected = selected === opt.id
        return (
          <button
            key={opt.id}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.id)}
            style={{
              background: isSelected
                ? 'rgba(201,169,110,0.09)'
                : 'rgba(255,255,255,0.025)',
              border: `1px solid ${isSelected
                ? 'rgba(201,169,110,0.55)'
                : 'rgba(201,169,110,0.14)'}`,
              borderRadius: 10,
              padding: '14px 8px 12px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseEnter={e => {
              if (isSelected) return
              const b = e.currentTarget as HTMLButtonElement
              b.style.borderColor = 'rgba(201,169,110,0.32)'
              b.style.background = 'rgba(255,255,255,0.04)'
            }}
            onMouseLeave={e => {
              if (isSelected) return
              const b = e.currentTarget as HTMLButtonElement
              b.style.borderColor = 'rgba(201,169,110,0.14)'
              b.style.background = 'rgba(255,255,255,0.025)'
            }}
          >
            <div style={{ width: 48, height: 48 }} aria-hidden="true">
              {Visual && <Visual active={isSelected} />}
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: isSelected
                  ? 'rgba(201,169,110,0.90)'
                  : 'rgba(240,235,224,0.65)',
                transition: 'color 0.25s',
              }}
            >
              {opt.label}
            </div>

            <div
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 11,
                fontStyle: 'italic',
                color: isSelected
                  ? 'rgba(201,169,110,0.70)'
                  : 'rgba(240,235,224,0.44)',
                lineHeight: 1.4,
                textAlign: 'center',
                transition: 'color 0.25s',
              }}
            >
              {opt.sub}
            </div>
          </button>
        )
      })}
    </div>
  )
}
