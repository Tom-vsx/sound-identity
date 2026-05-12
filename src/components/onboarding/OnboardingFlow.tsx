import { useState } from 'react'
import ProgressBar from './ProgressBar'
import StepGenres from './StepGenres'
import StepArtists from './StepArtists'
import StepListening from './StepListening'
import StepSeek from './StepSeek'
import StepTime from './StepTime'
import StepEra from './StepEra'
import type { UserSelections } from '../../types'

interface Props {
  onComplete: (selections: UserSelections) => void
}

const STEP_TITLES = [
  { title: 'Your musical universe', sub: 'Pick the genres that live in you. 2 to 5.' },
  { title: 'The artists who shaped you', sub: 'Up to 5 names. They can be anyone.' },
  { title: 'How do you listen?', sub: 'Not what you play — where you are when you need it most.' },
  { title: 'What do you seek?', sub: 'The feeling behind the listening.' },
  { title: 'When does music find you?', sub: 'The hour changes everything.' },
  { title: 'Which era speaks to you?', sub: 'The time that carries your frequency.' },
]

export default function OnboardingFlow({ onComplete }: Props) {
  const [step, setStep] = useState(1)
  const [genres, setGenres] = useState<string[]>([])
  const [artists, setArtists] = useState<string[]>([])
  const [listening, setListening] = useState('')
  const [seek, setSeek] = useState('')
  const [time, setTime] = useState('')
  const [era, setEra] = useState('')

  const ok = step === 1 ? genres.length >= 2
           : step === 2 ? artists.length >= 1
           : step === 3 ? !!listening
           : step === 4 ? !!seek
           : step === 5 ? !!time
           : !!era

  function next() {
    if (!ok) return
    if (step === 6) { onComplete({ genres, artists, listening, seek, time, era }); return }
    setStep(s => s + 1)
  }

  function prev() {
    if (step > 1) setStep(s => s - 1)
  }

  const info = STEP_TITLES[step - 1]

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: '#0a0a0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '0 24px',
      }}
      role="main"
      aria-label="Sound Identity Onboarding"
    >
      <div style={{ width: '100%', maxWidth: 'clamp(300px, 85vw, 640px)' }}>
        <ProgressBar step={step} total={6} />

        {/* Header */}
        <div style={{ paddingTop: 36, paddingBottom: 24 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(201,169,110,0.75)',
              marginBottom: 14,
            }}
          >
            ✦ ARCANE
          </div>
          <div key={`hdr-${step}`} style={{ animation: 'stepFadeIn 0.4s cubic-bezier(0.32,0.72,0,1) both' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 34,
                fontWeight: 300,
                color: 'rgba(240,235,224,0.95)',
                margin: 0,
                marginBottom: 10,
                letterSpacing: '-0.01em',
                lineHeight: 1.15,
              }}
            >
              {(() => {
                const [firstWord, ...rest] = info.title.split(' ')
                return (
                  <>
                    <span style={{ color: 'var(--arcane-gold)' }}>{firstWord}</span>
                    {rest.length > 0 && <> {rest.join(' ')}</>}
                  </>
                )
              })()}
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 15,
                fontStyle: 'italic',
                color: 'rgba(240,235,224,0.55)',
                margin: 0,
                lineHeight: 1.55,
              }}
            >
              {info.sub}
            </p>
          </div>
        </div>

        {/* Content */}
        <div key={`content-${step}`} style={{ animation: 'stepFadeIn 0.4s cubic-bezier(0.32,0.72,0,1) both' }}>
          {step === 1 && <StepGenres selected={genres} onChange={setGenres} />}
          {step === 2 && <StepArtists selected={artists} onChange={setArtists} />}
          {step === 3 && <StepListening selected={listening} onChange={setListening} />}
          {step === 4 && <StepSeek selected={seek} onChange={setSeek} />}
          {step === 5 && <StepTime selected={time} onChange={setTime} />}
          {step === 6 && <StepEra selected={era} onChange={setEra} />}
        </div>

        {/* Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 36,
            paddingBottom: 52,
          }}
        >
          <button
            onClick={prev}
            aria-label="Go back"
            style={{
              background: 'none',
              border: 'none',
              cursor: step === 1 ? 'default' : 'pointer',
              opacity: step === 1 ? 0 : 1,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(201,169,110,0.60)',
              padding: '12px 0',
              transition: 'opacity 0.3s, color 0.2s',
              pointerEvents: step === 1 ? 'none' : 'auto',
              minWidth: 44,
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseEnter={e => {
              if (step > 1) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(201,169,110,0.9)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(201,169,110,0.60)'
            }}
          >
            ← Back
          </button>

          <button
            onClick={next}
            disabled={!ok}
            aria-disabled={!ok}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: ok ? '16px 48px' : '16px 48px',
              backgroundColor: ok ? 'var(--arcane-gold)' : 'transparent',
              border: `1px solid ${ok ? 'var(--arcane-gold)' : 'rgba(201,169,110,0.14)'}`,
              borderRadius: 999,
              color: ok ? '#0a0a0f' : 'rgba(201,169,110,0.28)',
              cursor: ok ? 'pointer' : 'default',
              transition: 'all 0.35s cubic-bezier(0.32,0.72,0,1)',
              minHeight: 52,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: ok ? 600 : 400,
            }}
            onMouseEnter={e => {
              if (!ok) return
              const b = e.currentTarget as HTMLButtonElement
              b.style.opacity = '0.85'
            }}
            onMouseLeave={e => {
              if (!ok) return
              const b = e.currentTarget as HTMLButtonElement
              b.style.opacity = '1'
            }}
            onMouseDown={e => {
              if (!ok) return
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)'
            }}
            onMouseUp={e => {
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
            }}
          >
            {step === 6 ? 'Read my card →' : 'Continue →'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes stepFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
