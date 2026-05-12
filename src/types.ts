export interface UserSelections {
  genres: string[]
  artists: string[]
  listening: string
  seek: string
  time: string
  era: string
}

export interface CardData {
  card_file: string
  name: string
  genre: string
  bpm: number
  story?: string
  quote: string
  superpower: string
  shadow: string
  place: string
  frequency: number
  palette: [string, string, string]
  accent: string
}

export type AppPhase = 'splash' | 'onboarding' | 'reveal' | 'card' | 'cta'
