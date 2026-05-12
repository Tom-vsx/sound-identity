import { useState, useEffect, useRef } from 'react'
import SplashScreen from './components/SplashScreen'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import RevealSequence from './components/RevealSequence'
import SoundCard from './components/SoundCard'
import ArcaneCtaScreen from './components/ArcaneCtaScreen'
import { generateSoundCard } from './lib/api'
import { generateLocalCard } from './lib/textGenerator'
import DebugPage from './pages/debug'
import type { AppPhase, UserSelections, CardData } from './types'

export default function App() {
  // Check if debug mode is enabled via query parameter
  const isDebugMode = new URLSearchParams(window.location.search).has('debug')

  const [phase, setPhase] = useState<AppPhase>('splash')
  const [selections, setSelections] = useState<UserSelections | null>(null)
  const [cardData, setCardData] = useState<CardData | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const fetchedRef = useRef(false)

  function handleSplashDone() {
    setPhase('onboarding')
  }

  function handleOnboardingComplete(s: UserSelections) {
    setSelections(s)
    setPhase('reveal')
  }

  useEffect(() => {
    if (phase !== 'reveal' || !selections || fetchedRef.current) return
    fetchedRef.current = true

    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (!apiKey) {
      setTimeout(() => setCardData(generateLocalCard(selections)), 1500)
      return
    }

    generateSoundCard(selections)
      .then(data => setCardData(data))
      .catch(err => {
        console.error('API error:', err)
        setApiError(err.message)
        setCardData(generateLocalCard(selections))
      })
  }, [phase, selections])

  function handleRevealDone() {
    setPhase('card')
  }

  function handleCardNext() {
    setPhase('cta')
  }

  function handleRestart() {
    fetchedRef.current = false
    setSelections(null)
    setCardData(null)
    setApiError(null)
    setPhase('splash')
  }

  if (isDebugMode) {
    return <DebugPage />
  }

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0a0a0f' }}>
      {phase === 'splash' && (
        <div style={{ animation: 'phaseIn 0.3s ease both' }}>
          <SplashScreen onEnter={handleSplashDone} />
        </div>
      )}

      {phase === 'onboarding' && (
        <div style={{ animation: 'phaseIn 0.4s ease both' }}>
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        </div>
      )}

      {phase === 'reveal' && selections && (
        <div style={{ animation: 'phaseIn 0.3s ease both' }}>
          <RevealSequence
            selections={selections}
            cardData={cardData}
            error={apiError}
            onRevealDone={handleRevealDone}
          />
        </div>
      )}

      {phase === 'card' && cardData && (
        <div style={{ animation: 'phaseIn 0.6s cubic-bezier(0.32,0.72,0,1) both' }}>
          <SoundCard data={cardData} onNext={handleCardNext} onRestart={handleRestart} />
        </div>
      )}

      {phase === 'cta' && (
        <div style={{ animation: 'phaseIn 0.3s ease both' }}>
          <ArcaneCtaScreen onRestart={handleRestart} />
        </div>
      )}

      <style>{`
        @keyframes phaseIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
