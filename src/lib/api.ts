import type { UserSelections, CardData } from '../types'
import { generateLocalCard } from './textGenerator'

/**
 * Generate sound card locally
 * Smart card selection based on genres (top 10) + artists + context
 * No API calls - everything is computed locally
 */
export async function generateSoundCard(selections: UserSelections): Promise<CardData> {
  return generateLocalCard(selections)
}
