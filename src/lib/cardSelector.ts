import type { UserSelections } from '../types'
import { GENRE_CARD_COMPATIBILITY, SEEK_MAP, LISTEN_MAP, TIME_MAP, ERA_MAP } from '../data/genreCardMap'
import { CARDS_DATA } from '../data/cardsData'

/**
 * Score a card against user selections
 * Weights:
 *   50% — Genres (primary signal)
 *   15% — What they seek
 *   13% — Era
 *   12% — How they listen
 *   10% — Time of day (explicit time field + inferred from context)
 *   Plus bonuses for convergence and penalties for zero matches
 */
export function scoreCard(cardFile: string, selections: UserSelections): number {
  let score = 0

  // 50% — Genres (primary signal)
  const selectedGenres = selections.genres.map(g => g.toLowerCase())
  const genreMatches = selectedGenres.filter(g =>
    GENRE_CARD_COMPATIBILITY[g]?.includes(cardFile)
  ).length

  if (genreMatches > 0) {
    score += (genreMatches / Math.max(selectedGenres.length, 1)) * 50
  }

  // Convergence bonus — 2+ genres agree on same card
  if (genreMatches >= 2) {
    score += 10
  }

  // 15% — What they seek
  const seekGenres = SEEK_MAP[selections.seek] || []
  if (seekGenres.some(g => GENRE_CARD_COMPATIBILITY[g]?.includes(cardFile))) {
    score += 15
  }

  // 13% — Era
  const eraGenres = ERA_MAP[selections.era] || []
  if (eraGenres.length > 0 && eraGenres.some(g => GENRE_CARD_COMPATIBILITY[g]?.includes(cardFile))) {
    score += 13
  }

  // 12% — How they listen
  const listenGenres = LISTEN_MAP[selections.listening] || []
  if (listenGenres.some(g => GENRE_CARD_COMPATIBILITY[g]?.includes(cardFile))) {
    score += 12
  }

  // 10% — Time of day (explicit time field)
  const timeGenres = TIME_MAP[selections.time] || []
  if (timeGenres.length > 0 && timeGenres.some(g => GENRE_CARD_COMPATIBILITY[g]?.includes(cardFile))) {
    score += 10
  } else if (genreMatches > 0) {
    score += 3 // Baseline time bonus if no time-specific match
  }

  // Negative signal — card matches 0 genres on a multi-genre profile
  if (genreMatches === 0 && selectedGenres.length >= 2) {
    score -= 25
  }

  console.log(`  ${cardFile}: score=${score} (genres=${genreMatches})`)

  return score
}

/**
 * Hash function to convert artist names into a deterministic index
 */
function hashArtists(artists: string[]): number {
  if (artists.length === 0) return 0

  const combined = artists.join('|').toLowerCase()
  let hash = 0

  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }

  return Math.abs(hash)
}

/**
 * Select the best card for the user's selections
 * Uses deterministic scoring, with artist-based variation
 */
export function selectCard(selections: UserSelections): { file: string; score: number } {
  console.log('📊 Scoring cards for genres:', selections.genres)
  console.log('   Artists:', selections.artists)
  console.log('   Seek:', selections.seek)
  console.log('   Listen:', selections.listening)
  console.log('   Era:', selections.era)

  const scored = CARDS_DATA.map(card => ({
    file: card.file,
    score: scoreCard(card.file, selections),
  }))
    .sort((a, b) => b.score - a.score)

  console.log('🎯 Top 10 cards:', scored.slice(0, 10).map(c => ({ file: c.file, score: Math.round(c.score * 10) / 10 })))

  // Use artist names to deterministically pick from top candidates
  // This ensures same genres but different artists yield different cards
  let selected = scored[0] || { file: 'card_01', score: 0 }

  if (selections.artists.length > 0 && scored.length > 1) {
    // Get top cards (within 10 points of the best)
    const topScore = scored[0]?.score || 0
    const topCandidates = scored.filter(c => c.score >= topScore - 10)

    if (topCandidates.length > 1) {
      // Hash artists to pick from top candidates
      const artistHash = hashArtists(selections.artists)
      const selectedIndex = artistHash % topCandidates.length
      selected = topCandidates[selectedIndex]

      console.log(`🎨 Artist hash (${selections.artists.join(', ')}): ${artistHash % 10}/10`)
      console.log(`   Picking index ${selectedIndex} from ${topCandidates.length} top candidates`)
    }
  }

  console.log('✅ SELECTED:', selected.file, 'with score:', Math.round(selected.score * 10) / 10)

  return selected
}
