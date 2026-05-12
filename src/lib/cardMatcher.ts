import { CARDS_MATCHING_DATA } from '../data/cardsMatchingData'

// Use cardsMatchingData.ts for matching (contains music_tags, bpm_range, exclude_for)
const cards: Card[] = CARDS_MATCHING_DATA.map(entry => ({
  file: entry.file,
  visual: entry.visual,
  energy: entry.energy,
  music_tags: entry.music_tags,
  bpm_range: entry.bpm_range,
  exclude_for: entry.exclude_for,
}))

// Debug: log cards on load
if (typeof window !== 'undefined') {
  console.log('🎵 cardMatcher loaded:', cards.length, 'cards')
  if (cards.length === 0) {
    console.error('❌ CRITICAL: CARDS_DATA did not load!')
  }
}

export interface Card {
  file: string
  visual: string
  energy: string
  music_tags: string[]
  bpm_range: [number, number]
  exclude_for: string[]
  // Note: palette and accent are stored in CARDS_DATA but not needed for matching
}

export interface CardMatch {
  card: Card
  score: number
  matchingTags: string[]
  matchCount: number
}

/**
 * Normalize genre names for consistent matching
 * Converts to lowercase and handles minor variations
 */
function normalizeGenre(genre: string): string {
  return genre
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
}

/**
 * Calculate matching score between selected genres and a card's music tags
 * Returns 0 if the card should be excluded for any of the selected genres
 */
function calculateGenreMatchScore(selectedGenres: string[], card: Card): number {
  const normalizedSelected = selectedGenres.map(normalizeGenre)
  const normalizedTags = card.music_tags.map(normalizeGenre)

  // Check exclude_for first - if any selected genre is excluded, return 0
  const normalizedExclude = card.exclude_for.map(normalizeGenre)
  for (const genre of normalizedSelected) {
    if (normalizedExclude.includes(genre)) {
      return 0 // Card is explicitly excluded for this genre
    }
  }

  // Count exact matches and partial matches
  let exactMatches = 0
  let partialMatches = 0

  for (const selected of normalizedSelected) {
    // Exact match
    if (normalizedTags.includes(selected)) {
      exactMatches++
      continue
    }

    // Partial match: check if selected is substring of any tag or vice versa
    for (const tag of normalizedTags) {
      if (
        tag.includes(selected) ||
        selected.includes(tag)
      ) {
        partialMatches++
        break // Count once per selected genre
      }
    }
  }

  // Score: exact matches weighted more heavily than partial matches
  // Plus a small bonus for total tag count (cards with more tags are more versatile)
  const baseScore = exactMatches * 10 + partialMatches * 3
  const versatilityBonus = Math.min(normalizedTags.length * 0.5, 5)

  return baseScore + versatilityBonus
}

/**
 * Find all matching cards for selected genres, sorted by match quality
 */
function findMatchingCards_Internal(
  selectedGenres: string[],
  limit: number = 10
): CardMatch[] {
  if (!selectedGenres || selectedGenres.length === 0) {
    return []
  }

  const matches: CardMatch[] = []

  for (const card of cards as Card[]) {
    const score = calculateGenreMatchScore(selectedGenres, card)

    if (score > 0) {
      // Calculate which tags matched
      const normalizedSelected = selectedGenres.map(normalizeGenre)
      const normalizedTags = card.music_tags.map(normalizeGenre)
      const matchingTags = normalizedTags.filter(tag =>
        normalizedSelected.some(
          selected =>
            tag === selected || tag.includes(selected) || selected.includes(tag)
        )
      )

      matches.push({
        card,
        score,
        matchingTags,
        matchCount: matchingTags.length,
      })
    }
  }

  // Sort by score (descending), then by match count
  matches.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score
    }
    return b.matchCount - a.matchCount
  })

  return matches.slice(0, limit)
}

/**
 * Find the single best matching card for selected genres
 */
export function findMatchingCard(selectedGenres: string[]): Card | null {
  console.log('📊 findMatchingCard called with:', selectedGenres)
  const matches = findMatchingCards_Internal(selectedGenres, 1)
  console.log('📊 Top match:', matches.length > 0 ? `${matches[0].card.file} (score: ${matches[0].score})` : 'null')
  return matches.length > 0 ? matches[0].card : null
}

/**
 * Get top N matching cards
 */
export function findMatchingCards(
  selectedGenres: string[],
  limit: number = 10
): Card[] {
  return findMatchingCards_Internal(selectedGenres, limit).map(m => m.card)
}

/**
 * Analyze and debug the matching for a set of genres
 * Returns detailed information about score calculation
 */
export function analyzeCardMatch(
  selectedGenres: string[],
  card: Card
): {
  score: number
  excluded: boolean
  matchingTags: string[]
  analysis: string
} {
  const score = calculateGenreMatchScore(selectedGenres, card)

  // Check if excluded
  const normalizedSelected = selectedGenres.map(normalizeGenre)
  const normalizedExclude = card.exclude_for.map(normalizeGenre)
  const excluded = normalizedSelected.some(g => normalizedExclude.includes(g))

  // Get matching tags
  const normalizedTags = card.music_tags.map(normalizeGenre)
  const matchingTags = normalizedTags.filter(tag =>
    normalizedSelected.some(
      selected =>
        tag === selected || tag.includes(selected) || selected.includes(tag)
    )
  )

  const analysis =
    excluded
      ? `Card excluded due to: ${card.exclude_for.filter(e =>
          normalizedSelected.includes(normalizeGenre(e))
        ).join(', ')}`
      : `Matched ${matchingTags.length} of ${card.music_tags.length} card tags. Score: ${score.toFixed(1)}`

  return {
    score,
    excluded,
    matchingTags,
    analysis,
  }
}

// ─── Matching System ─────────────────────────────────────────────────────────
// The card matcher has been refactored to use a transparent music_tags-based
// system instead of the previous Vec4 emotional vectors. Each card now has:
// - music_tags: array of genre strings that match this card
// - exclude_for: array of genres that are explicitly excluded
// - bpm_range: tempo range for this card
//
// The new system is:
// 1. Deterministic: same genres → same card (except for tie-breaking)
// 2. Transparent: you can see exactly which genres match each card
// 3. Maintainable: add/edit genres without modifying code vectors
// 4. Scalable: cards.json can grow without performance impact
//
// Old Vec4 emotional profile system removed:
// - ARTIST_DB (emotional profiles for 700+ artists)
// - GENRE_DB (fallback emotional vectors for genres)
// - CARD_VECTORS (emotional signatures for each card)
// - buildProfile, findBestCard, getArchetype (all emotional matching)
// - generateContent, POOLS (archetype-based content generation)
// - LISTENING_MOD, SEEK_MOD (context modifiers)

// Export cards for easy access in other files
export { cards }
