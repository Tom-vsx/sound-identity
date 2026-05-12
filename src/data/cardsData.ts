export interface CardEntry {
  file: string
  energy: string
  mood: string
  palette: [string, string, string]
  accent: string
}

// Palettes are hand-picked to match the dominant visual colors of each card image.
// They are the source of truth — both the API and local generator use these values
// so the palette on the card always matches the illustration.
export const CARDS_DATA: CardEntry[] = [
  { file: 'card_01.png', energy: 'solar feminine, lotus power, meditation, warmth, inner light',   mood: 'serene, radiant, grounded',         palette: ['#D4956A', '#F0C98E', '#1E1410'], accent: '#D4956A' },
  { file: 'card_02.png', energy: 'dark cathedral, sacred geometry, spiritual authority, ritual',    mood: 'intense, structured, ceremonial',   palette: ['#1A1228', '#3D2B4E', '#A8A4B8'], accent: '#3D2B4E' },
  { file: 'card_03.png', energy: 'red sun, cosmic fire, bold energy, primal force',                mood: 'powerful, raw, elemental',          palette: ['#8B1A1A', '#C94B2E', '#140A08'], accent: '#C94B2E' },
  { file: 'card_04.png', energy: 'dark sovereign, crowned figure, commanding presence, throne',     mood: 'authoritative, heavy, regal',       palette: ['#0E0C14', '#2A2030', '#9E8B6A'], accent: '#9E8B6A' },
  { file: 'card_05.png', energy: 'wandering monk, solitary journey, quiet dignity, muted tones',   mood: 'introverted, austere, searching',   palette: ['#4A3D2E', '#8A7B68', '#C4B8A8'], accent: '#8A7B68' },
  { file: 'card_06.png', energy: 'wind dancer, flowing freedom, orange warmth, liberation',         mood: 'free, expressive, kinetic',         palette: ['#C96B35', '#E8A050', '#1A0E08'], accent: '#C96B35' },
  { file: 'card_07.png', energy: 'dark feminine rising, dual nature, contrast, tension',            mood: 'conflicted, magnetic, dramatic',    palette: ['#1E1228', '#5A3060', '#C8A8B8'], accent: '#5A3060' },
  { file: 'card_08.png', energy: 'moonlit ritual, night ceremony, sacred feminine, purple dusk',    mood: 'mystical, nocturnal, introspective',palette: ['#1C1030', '#4A2880', '#B89ED0'], accent: '#4A2880' },
  { file: 'card_09.png', energy: 'serpentine path, winding river, flow state, surrender',           mood: 'fluid, dreamy, dissolving',         palette: ['#1A2E2A', '#4A7A6A', '#C0D4C8'], accent: '#4A7A6A' },
  { file: 'card_10.png', energy: 'dark silhouette, planetary orbit, cosmic solitude, space',        mood: 'isolated, contemplative, vast',     palette: ['#080C14', '#1E2A40', '#6A7A9A'], accent: '#1E2A40' },
  { file: 'card_11.png', energy: 'golden halo, moonrise, gentle power, soft illumination',          mood: 'ethereal, calm, luminous',          palette: ['#C49A3A', '#E8D08A', '#2A1E10'], accent: '#C49A3A' },
  { file: 'card_12.png', energy: 'mountain figures, collective presence, grey landscape, stillness',mood: 'collective, quiet, monumental',     palette: ['#2A2830', '#6A6878', '#C8C4D0'], accent: '#6A6878' },
  { file: 'card_13.png', energy: 'triple feminine, open arms, cosmic reception, invitation',        mood: 'open, welcoming, spiritual',        palette: ['#2C1A40', '#7A4A90', '#E8D0E0'], accent: '#7A4A90' },
  { file: 'card_14.png', energy: 'solar plexus, warm earth tones, grounded energy, stability',     mood: 'stable, warm, centered',            palette: ['#8B4A1A', '#C4804A', '#F0D0A8'], accent: '#C4804A' },
  { file: 'card_15.png', energy: 'dark silhouette alone, minimal, stark contrast, isolation',       mood: 'solitary, stark, meditative',       palette: ['#0E0C0A', '#3A3428', '#C8C0B0'], accent: '#8A8070' },
  { file: 'card_16.png', energy: 'radiant sun burst, headphones, music devotion, joy',             mood: 'joyful, devoted, electric',         palette: ['#C48820', '#E8C040', '#5A3C08'], accent: '#E8C040' },
  { file: 'card_17.png', energy: 'sacred heart, rose center, love ritual, vulnerability',          mood: 'tender, exposed, devotional',       palette: ['#8B3050', '#C87090', '#EDD4D8'], accent: '#C87090' },
  { file: 'card_18.png', energy: 'cosmic chakras, vertical alignment, energy flow, purple depth',  mood: 'deep, vibrational, transcendent',   palette: ['#1A0830', '#4A1880', '#9A60D0'], accent: '#4A1880' },
  { file: 'card_19.png', energy: 'floating orbs, minimalist cosmos, quiet universe, balance',      mood: 'balanced, minimal, floating',       palette: ['#1A1E28', '#4A5070', '#C8D0E8'], accent: '#4A5070' },
  { file: 'card_20.png', energy: 'dancer in motion, fluid body, orange warmth, movement',          mood: 'expressive, kinetic, free',         palette: ['#8B3A10', '#D07030', '#F0C080'], accent: '#D07030' },
  { file: 'card_21.png', energy: 'third eye open, all-seeing, golden mask, surveillance',          mood: 'aware, watchful, unsettling',       palette: ['#1A1410', '#8B6820', '#D4A840'], accent: '#D4A840' },
  { file: 'card_22.png', energy: 'dark arch, cathedral gate, threshold, passage',                  mood: 'liminal, transitional, heavy',      palette: ['#1A1A1A', '#3A3A40', '#A8A4B0'], accent: '#6A6878' },
  { file: 'card_23.png', energy: 'fire within, inner flame, burning core, transformation',         mood: 'transformative, burning, intense',  palette: ['#1A0808', '#8B2010', '#D05020'], accent: '#D05020' },
  { file: 'card_24.png', energy: 'dark horned figure, sword bearer, gothic power, confrontation',  mood: 'confrontational, dark, powerful',   palette: ['#080808', '#2A1020', '#8A6080'], accent: '#8A6080' },
  { file: 'card_25.png', energy: 'serpent wisdom, coiled knowledge, ancient signal, warning',      mood: 'wise, ancient, coiled energy',      palette: ['#0A1A10', '#2A5030', '#8AB080'], accent: '#2A5030' },
  { file: 'card_26.png', energy: 'dancer silhouette, green earth, nature rhythm, lightness',       mood: 'light, natural, rhythmic',          palette: ['#1A2A10', '#5A8040', '#C0D4A8'], accent: '#5A8040' },
  { file: 'card_27.png', energy: 'flowing chakra, rainbow spine, energy cascade, healing',         mood: 'healing, colorful, flowing',        palette: ['#1A1840', '#2A6878', '#80B8C8'], accent: '#2A6878' },
  { file: 'card_28.png', energy: 'still figure, moonlit arch, waiting, patience, night',           mood: 'patient, lunar, waiting',           palette: ['#0E1020', '#2A3058', '#8A9AC8'], accent: '#8A9AC8' },
  { file: 'card_29.png', energy: 'tower figure, gothic height, dramatic isolation, vertical',      mood: 'dramatic, tall, isolated',          palette: ['#141214', '#2C2830', '#8A8490'], accent: '#6A6478' },
  { file: 'card_30.png', energy: 'hooded wanderer, orange warmth, mystery, concealment',           mood: 'mysterious, warm, hidden',          palette: ['#2A1408', '#8B4A18', '#D08038'], accent: '#D08038' },
  { file: 'card_31.png', energy: 'garden sanctuary, emerald abundance, quiet prosperity, growth',  mood: 'abundant, peaceful, nurturing',     palette: ['#1A2A1A', '#4A7A4A', '#A8D4A8'], accent: '#4A7A4A' },
  { file: 'card_32.png', energy: 'water reflection, depths flowing, mirror consciousness, mystery',mood: 'introspective, fluid, mysterious',  palette: ['#0E1E2A', '#3A6A8A', '#8AC4D8'], accent: '#3A6A8A' },
  { file: 'card_33.png', energy: 'cosmic wheel, circular mandala, eternal return, cycles',         mood: 'cyclical, complete, eternal',       palette: ['#1A1428', '#4A4A70', '#B8A8D8'], accent: '#6A5A90' },
  { file: 'card_34.png', energy: 'crown ascending, gold reaching, triumph, elevation',              mood: 'triumphant, elevated, powerful',    palette: ['#1E1410', '#8B6820', '#E8C860'], accent: '#E8C860' },
  { file: 'card_35.png', energy: 'dark void, infinite silence, unknowable, void consciousness',    mood: 'vast, empty, transcendent',         palette: ['#0A0A0A', '#2A2A2A', '#7A7A7A'], accent: '#3A3A3A' },
  { file: 'card_36.png', energy: 'temple entrance, sacred threshold, initiation, passage rite',    mood: 'sacred, initiatory, solemn',        palette: ['#1A1214', '#4A3A50', '#B8A8C8'], accent: '#6A5A78' },
  { file: 'card_37.png', energy: 'phoenix rising, orange flame rebirth, transformation, renewal',  mood: 'transformative, vital, reborn',     palette: ['#1A0808', '#8B3010', '#E87030'], accent: '#E87030' },
  { file: 'card_38.png', energy: 'silver mirror, reflection truth, clarity, revelation',           mood: 'clear, truthful, honest',           palette: ['#0E1418', '#3A5068', '#B8D8E8'], accent: '#6A9AC8' },
  { file: 'card_39.png', energy: 'twilight blending, dusk sky, transition hour, soft mystery',     mood: 'dreamy, transitional, soft',        palette: ['#2A2440', '#6A5070', '#D0A8C8'], accent: '#8A6890' },
  { file: 'card_40.png', energy: 'stone sentinel, earth anchor, grounding presence, stability',    mood: 'grounded, sturdy, protective',      palette: ['#1A1614', '#5A5048', '#C8B8A8'], accent: '#8A7A68' },
  { file: 'card_41.png', energy: 'spiral descent, inward journey, deep self, shadow exploration',  mood: 'introspective, deep, searching',    palette: ['#0A0A0A', '#2A2020', '#6A5A50'], accent: '#4A3A2A' },
  { file: 'card_42.png', energy: 'luminous gateway, light passage, doorway consciousness, reveal', mood: 'illuminating, revelatory, opening',palette: ['#1A1820', '#4A6A90', '#C8D8E8'], accent: '#6A8AC0' },
  { file: 'card_43.png', energy: 'sacred dance, ecstatic movement, joy celebration, liberation',   mood: 'joyful, ecstatic, free',            palette: ['#1A1408', '#8B5020', '#E8A840'], accent: '#E8A840' },
  { file: 'card_44.png', energy: 'deep forest, green darkness, primal nature, untamed',            mood: 'wild, ancient, mysterious',         palette: ['#0A1810', '#2A5038', '#7AB080'], accent: '#4A7858' },
  { file: 'card_45.png', energy: 'cosmic interface, technology sacred, digital spirit realm',       mood: 'transcendent, technological, surreal',palette: ['#080C18', '#1A3A58', '#5A8AC8'], accent: '#2A5A98' },
  { file: 'card_46.png', energy: 'shadow self, dark mirror, integration difficult wisdom',         mood: 'confrontational, integrative, honest',palette: ['#0A0A0A', '#3A2A30', '#8A6A78'], accent: '#5A3A48' },
  { file: 'card_47.png', energy: 'starlight guidance, celestial navigation, cosmic direction',     mood: 'hopeful, guided, expansive',        palette: ['#0A0E1A', '#1A3A60', '#5A8AC8'], accent: '#2A5AA0' },
  { file: 'card_48.png', energy: 'heart sanctuary, safe haven, shelter warmth, belonging',         mood: 'safe, warm, welcoming',             palette: ['#1A0E0A', '#8B4A30', '#D4907A'], accent: '#C87060' },
  { file: 'card_49.png', energy: 'void touch, emptiness wisdom, dissolution acceptance, letting go',mood: 'accepting, peaceful, empty',        palette: ['#0A0A0A', '#2A2A28', '#6A6A68'], accent: '#3A3A38' },
  { file: 'card_50.png', energy: 'dawn breaking, light returning, hope emergence, new beginning',  mood: 'hopeful, bright, fresh',            palette: ['#1A1410', '#8B6820', '#E8C860'], accent: '#D4A840' },
  { file: 'card_51.png', energy: 'twin flames, sacred union, divine meeting, cosmic connection',   mood: 'united, divine, harmonious',        palette: ['#1A0A14', '#6A3A70', '#D8A0D8'], accent: '#8A4A98' },
  { file: 'card_52.png', energy: 'root anchored, earth connection, stability foundation, grounded',mood: 'stable, grounded, secure',          palette: ['#0A1410', '#2A5038', '#8AB080'], accent: '#4A7858' },
  { file: 'card_53.png', energy: 'infinity loop, eternal presence, timeless being, always now',    mood: 'eternal, present, infinite',        palette: ['#080810', '#2A2A40', '#7A7AA8'], accent: '#4A4A70' },
  { file: 'card_54.png', energy: 'cosmic return, spiral completion, full circle, wholeness achieved',mood: 'complete, whole, fulfilled',       palette: ['#1A1410', '#6A5A48', '#D4C4A8'], accent: '#A89878' },
]

export const CARDS_JSON_STRING = JSON.stringify(CARDS_DATA)
