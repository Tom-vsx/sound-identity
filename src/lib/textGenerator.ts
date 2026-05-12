import type { UserSelections, CardData } from '../types'
import { CARDS_DATA } from '../data/cardsData'
import { selectCard } from './cardSelector'
import { CARD_MOCK_MAP } from '../data/cardMockMap'
import mockResultsRaw from '../data/mockResults.json'

// Ensure mockResults is properly accessible as an object
// Handle both default export and direct export
const mockResults: Record<string, any> = (mockResultsRaw as any)?.default ?? mockResultsRaw ?? {}

// ─── GENRE ───────────────────────────────────────────────────────────────────

const ERA_PREFIX: Record<string, string[]> = {
  '60s':      ['Psychedelic', 'Tape-Warm', 'Protest-Era'],
  '70s':      ['Cosmic', 'Analogue', 'Gold-Room'],
  '80s':      ['Synthetic', 'Chrome', 'Cold-Wave'],
  '90s':      ['Post-', 'Lo-Fi', 'Mid-Budget'],
  '00s':      ['Digital', 'Compressed', 'Millennial'],
  '2010s':    ['Post-Genre', 'Streaming-Era', 'Screen-Lit'],
  'now':      ['Contemporary', 'Current-Pulse', 'This-Week'],
  'timeless': ['Timeless', 'Decade-Agnostic', 'Outside-Timeline'],
}

const SEEK_SUFFIX: Record<string, string[]> = {
  'feel-deeply':     ['Chamber', 'Intimate', 'Open-Chord'],
  'clear-head':      ['Minimal', 'Still', 'Negative-Space'],
  'get-energy':      ['Electric', 'Kinetic', 'Live-Floor'],
  'travel-mentally': ['Astral', 'Ambient', 'Long-Form'],
  'disappear':       ['Drone', 'Dissolving', 'Bath'],
  'remember':        ['Archive', 'Tape-Hiss', 'Lo-Fi'],
  'not-alone':       ['Collective', 'Shared', 'Two-Way'],
}

const LISTEN_MODIFIER: Record<string, string> = {
  'alone-night':     'After-Hours',
  'loud-car':        'Open-Road',
  'background-work': 'Background',
  'at-party':        'Floor',
  'on-the-move':     'Transit',
  'ritual-listen':   'Ceremonial',
  'shared-moment':   'Shared',
}

function generateGenre(selections: UserSelections, seed: string = ''): string {
  const base = selections.genres[0] || 'Electronic'
  const era = selectByHash(ERA_PREFIX[selections.era] ?? ['Contemporary'], seed + 'era')
  const seek = selectByHash(SEEK_SUFFIX[selections.seek] ?? ['Minimal'], seed + 'seek')
  const listen = LISTEN_MODIFIER[selections.listening] ?? ''

  const patterns = [
    `${listen} ${base} ${seek}`,
    `${era} ${seek} ${base}`,
    `${seek} ${base}`,
    `${era} ${base}`,
    `${listen} ${era} ${base}`,
  ]
  return selectByHash(patterns, seed + 'genre').replace(/\s+/g, ' ').trim()
}

// ─── BPM ─────────────────────────────────────────────────────────────────────

const BPM_RANGE: Record<string, [number, number]> = {
  'feel-deeply':     [64, 88],
  'clear-head':      [72, 96],
  'get-energy':      [108, 138],
  'travel-mentally': [76, 102],
  'disappear':       [58, 82],
  'remember':        [68, 92],
  'not-alone':       [88, 116],
}

function generateBPM(seek: string, seed: string = ''): number {
  const [min, max] = BPM_RANGE[seek] ?? [75, 110]
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash = hash & hash
  }
  return min + (Math.abs(hash) % (max - min + 1))
}

// ─── STORY (seek + era) ──────────────────────────────────────────────────────

const STORIES: Record<string, Record<string, string[]>> = {
  'feel-deeply': {
    '60s': [
      `A psych record that catches you on the cusp of understanding something without quite naming it. The horns arrive like they've been waiting.\n\nBest heard when you need permission to feel exactly what you're feeling.`,
      `Built from a moment of genuine emotional exposure, then layered until it's distant enough to bear. The reverb is intentional vulnerability.\n\nSomeone's heart in a room. Someone listening learned how to hold it.`,
    ],
    '70s': [
      `The warmth in this recording is analogue comfort — it knows what it means to wrap around something fragile. The strings do the explaining.\n\nSounds like a room where staying meant something.`,
      `Orchestral intimacy. Everything supporting one voice. The production choice says: this person's emotion is important enough to get orchestral treatment.\n\nBest when you're ready to be treated with the seriousness of a symphony.`,
    ],
    '80s': [
      `Synthetic vulnerability. The synth pads create a space that feels entirely internal, like being inside someone's thinking process.\n\nThe kind of record that makes digital sound like the only honest way to express something.`,
      `Produced with the precision of someone who needed to control the emotional delivery exactly. Every synthesizer choice a careful word choice.\n\nEmotion through engineering. Feelings exact enough to replicate perfectly.`,
    ],
    '90s': [
      `Something in the arrangement opens a door you didn't know was still closed. Not sad. Not hopeful. Both at once, held in the key change.\n\nBest played when you're ready to be surprised by yourself.`,
      `The kind of record that knows exactly where to press. You find it on the second track, then go back and hear it in the first.\n\nWorks best when the room is quiet enough to let it in.`,
    ],
    '00s': [
      `Compressed intimacy. The digital production doesn't create distance — it creates access. You can hear exactly what was felt because the recording is so precise.\n\nModern vulnerability: the feeling happens inside the algorithm.`,
      `Post-production as emotional amplification. Everything enhanced until the feeling is cleaner than the original moment. Perfectionism as a form of care.\n\nBest heard when you understand that the perfectionism is a form of devotion.`,
    ],
    '2010s': [
      `Lo-fi as honesty. The bedroom recording aesthetic isn't a limitation — it's a choice to keep the moment real. You hear the room, the imperfection, the feeling.\n\nFeels like being in the room when the song was being figured out.`,
      `Sparse and deliberate. Everything stripped down except what matters. The production choice says: this feeling doesn't need decoration.\n\nIntimacy through reduction.`,
    ],
    'now': [
      `Contemporary heartbreak: detailed, specific, impossible to unsee once you've seen it. The production amplifies the precision of the pain.\n\nFeels like being inside someone's mind at 3am.`,
      `Production that serves the moment. No decoration, no apology, just exact emotional temperature capture. The technology disappears into the feeling.\n\nBest when you need to feel less alone in something that's specific to you.`,
    ],
    'timeless': [
      `Harmonic frequencies that locate feeling before language does. The body understands what the mind will take weeks to articulate.\n\nSomeone recorded this at the exact moment they understood something.`,
      `Music that doesn't explain itself. It waits in the arrangement and trusts you to arrive at it.\n\nThe second listen is always the real first listen.`,
    ],
  },
  'clear-head': {
    '60s': [
      `Minimalism before it had a name. The space in this recording is intentional — every silence does something. Folk-sparse, electronically honest.\n\nThe kind of listening that puts the interior in order.`,
      `Negative space in an era of maximalism. What's left out is the revolution. The arrangement trusts emptiness to do real work.\n\nClears the mind by giving it something clean to hold.`,
    ],
    '70s': [
      `Ambient before ambient was named. Ambient was just what happened when someone put a lot of space in a song and decided not to fill it.\n\nThe sound of a room being opened to air.`,
      `Structural honesty from an analogue era. Every element there because it solves something, not because it sounds good. Decisions made in real time.\n\nBest heard when you're trying to think across something large.`,
    ],
    '80s': [
      `Minimalism by necessity. The digital limitations become sonic clarity. Less becomes more becomes obvious.\n\nThe kind of record where you can hear every deliberate choice because nothing gets hidden in the mix.`,
      `Synthetic breathing room. The synth pads are there to create space, not fill it. Emptiness as a production value.\n\nFeels like thinking with headphones on.`,
    ],
    '90s': [
      `Negative space as architecture. What's left out is the point. The arrangement trusts silence to do the heavy work.\n\nPuts the interior down to a signal you can actually read.`,
      `Music that doesn't demand anything. No tension, no release — just a clean field you can think across.\n\nThe kind of listening that feels like clearing the table before you start.`,
    ],
    '00s': [
      `Digital clarity as meditation. The precision of the recording becomes the point — you can focus on anything because nothing is cluttered.\n\nBest used when your brain needs somewhere clean to go.`,
      `Minimal in form, generous in effect. The repetition doesn't loop — it deepens. Each pass through the pattern reveals something the last pass hid.\n\nSomething settles when you let it run.`,
    ],
    '2010s': [
      `Bedroom-quiet production. The intimate scale creates focus. Nothing to hide behind, nothing to distract from the structure underneath.\n\nClarity through constraint.`,
      `Post-genre minimalism: takes the essential element of something and follows it to the end. Everything else burned away.\n\nThe kind of listening that creates actual mental space.`,
    ],
    'now': [
      `Modern negative space: algorithmic clarity meets intentional emptiness. The recording is so clean you can think in it.\n\nBest for when your mind needs a clean room.`,
      `Minimalism as default. The production says: we're confident enough not to fill every space. The listener is smart enough to complete it.\n\nWorks as thinking music the same way water works for thirst.`,
    ],
    'timeless': [
      `Minimal in form, generous in effect. The repetition doesn't loop — it deepens. Each pass through the pattern reveals something the last pass hid.\n\nSomething settles when you let it run.`,
      `Structural honesty. Every element earns its place and knows when to stop. Nothing lingers past its purpose.\n\nThe mind finds order here without being told to.`,
    ],
  },
  'get-energy': {
    '60s': [
      `Live energy captured and compressed. The room in the recording is part of the sound — you can feel the crowd's anticipation frozen in the tape.\n\nBest when you need to feel the moment something started moving.`,
      `Psychedelic momentum. The rhythm section is the heartbeat that won't stop. Build on build on build until the room has no choice but to move.\n\nThe kind of record that creates its own gravity.`,
    ],
    '70s': [
      `Funk as physics: if you understand the math of rhythm, you can make anything move. This is the proof.\n\nProduction that converts human bodies into motion.`,
      `Disco DNA. The energy isn't loud — it's relentless. Four-on-the-floor as inevitability. The bassline as law.\n\nBest when the room needs reminding how bodies work.`,
    ],
    '80s': [
      `Synthetic adrenaline. The synth drums are not trying to sound like real drums — they're trying to trigger something more direct in the nervous system.\n\nEnergy as production value. Everything is designed to move you.`,
      `New wave precision applied to kinetic energy. The dancefloor strategies are calculated. Every drop timed to exactly when resistance breaks.\n\nThe engineering of inevitability.`,
    ],
    '90s': [
      `The kind of record that converts the room into kinetic energy. Not loud for the sake of it — precise where it needs to be.\n\nYou know immediately whether it's working or not.`,
      `Momentum as a production value. The mix is built forward — everything pulling toward the next bar.\n\nSomething in the low end makes decisions you didn't know you were making.`,
    ],
    '00s': [
      `Compressed intensity. Everything pushed into the red, everything urgent, everything now. The digital precision makes the chaos feel intentional.\n\nBest when you need energy that sounds calculated, not chaotic.`,
      `Dancefloor engineering meets bedroom intensity. The energy doesn't come from volume — it comes from architectural precision.\n\nFeels like being inside the moment before something breaks open.`,
    ],
    '2010s': [
      `Trap as momentum. The hi-hats don't breathe — they accumulate. The drops don't happen — they're inevitable.\n\nEnergy as inevitability.`,
      `Post-genre kinetic. Borrows from bass, from rap, from electronic — everything that moves — and synthesizes it into one propulsive thing.\n\nFeels like being in the room when something shifts permanently.`,
    ],
    'now': [
      `Contemporary energy: hyperaware and still unstoppable. The production knows it's being deconstructed and doesn't care. Movement happens anyway.\n\nThe kind of record that moves you despite you understanding exactly how it's moving you.`,
      `Raw signal, no apologies. The arrangement solves the problem of how to build a wall of sound and still leave room to move.\n\nHits hardest the third time it comes around.`,
    ],
    'timeless': [
      `Built for the moment just before something starts. The engineering of anticipation, made into two-channel audio.\n\nTurn it up. That's not optional.`,
      `The kind of record that converts the room into kinetic energy. Not loud for the sake of it — precise where it needs to be.\n\nYou know immediately whether it's working or not.`,
    ],
  },
  'travel-mentally': {
    '60s': [
      `Psychedelia as exploration. The production deliberately distorts to suggest elsewhere. LSD as production decision.\n\nThe kind of listening that takes you somewhere the geography doesn't support.`,
      `Raga influence: long-form trance induction disguised as rock music. The repetition is deliberate — it's a method, not a limitation.\n\nBest traveled when time is negotiable.`,
    ],
    '70s': [
      `Kosmische Musik: space rock as literal instruction for the mind to go somewhere vast and untethered.\n\nThe synths create coordinates you navigate by sound alone.`,
      `Krautrock repetition as transportation. The groove doesn't loop — it accumulates depth. You go further in each time around.\n\nThe kind of journey that rewires the listener.`,
    ],
    '80s': [
      `Synthesizer as worldbuilding. The producer is constructing an environment entirely in sound — you enter that world when the song begins.\n\nTravel without movement. Worlds accessed through cables and oscillators.`,
      `Post-punk atmosphere: darkness as location. The reverb and delay create geography. You navigate by hearing.\n\nBest explored with your eyes closed.`,
    ],
    '90s': [
      `Geography as sound design. Every production choice is a location decision — the reverb is the distance, the delay is the return.\n\nPut the headphones on and choose a direction.`,
      `Records that suggest elsewhere more than they describe it. You fill in the coordinates yourself — the sound just sets the conditions.\n\nBest experienced somewhere you can close your eyes without consequence.`,
    ],
    '00s': [
      `Post-rock orchestration: songs that build worlds in miniature. Every section a new landscape. The composition is the map.\n\nTravel through careful structure.`,
      `Glitch as portal: the digital artifacts aren't errors — they're evidence of other dimensions trying to reach you.\n\nThe kind of listening that makes the physical world feel optional.`,
    ],
    '2010s': [
      `Lo-fi travel: the bedroom becomes infinite. The lo-fi grain is the atmosphere of another era, another place you can return to.\n\nDimensional travel through underproduction.`,
      `Experimental ambient: the listening experience is the destination. Time becomes negotiable. You arrive everywhere simultaneously.\n\nBest when you need to be multiple places at once.`,
    ],
    'now': [
      `Hyperpop as landscape: reality bent until it loops back on itself. The production is the journey. Disorientation becomes the map.\n\nTravel through deliberate confusion.`,
      `Modern spacemusic: vaporwave, ambient, deep electronic — everything that suggests elsewhere. The future as a place you can hear.\n\nThe kind of listening that makes you wonder which world is real.`,
    ],
    'timeless': [
      `Long-form music for the commute that never happens. An entire landscape in forty minutes, none of it named.\n\nThe kind of listening that makes you miss the stop on purpose.`,
      `The world in the headphones is always further than the world outside them. This one takes you somewhere that doesn't appear on maps.\n\nLeave word for when you get back.`,
    ],
  },
  'disappear': {
    '60s': [
      `Drone minimalism: the future of music arriving in 1966, disguised as experimental folk. Repetition as total immersion.\n\nYou dissolve into the sound because the sound is infinite.`,
      `Psychedelic submersion: LSD culture as production philosophy. Make the listener impossible to extract from the moment.\n\nDisappearance into altered consciousness, engineered in the studio.`,
    ],
    '70s': [
      `Ambient as architecture: Brian Eno's fundamental insight — music designed to be ignored, impossible to ignore. Paradox as production principle.\n\nYou vanish into the space the music creates.`,
      `Krautrock drift: hypnotic repetition that erases the listener's sense of time. Hours pass like minutes. Minutes expand into eternities.\n\nDisappearance through repetitive meditation.`,
    ],
    '80s': [
      `Darkwave dissolution: industrial and gothic combined to create a soundworld you can dissolve into. The darkness is welcoming.\n\nYou disappear into the shadow and find it comfortable.`,
      `Ambient electronics: the machine becomes a vehicle for disappearing. The synth pad is the medium of becoming nothing.\n\nDisappearance through synthetic breathing.`,
    ],
    '90s': [
      `Not music that blankets you. Music that dissolves you. The distinction matters.\n\nYou come back to yourself twenty minutes later, slightly rearranged.`,
      `The production is designed for immersion: every frequency occupies a different position in the room. Mono doesn't do this justice.\n\nBest used when you want to stop being exactly the shape you are.`,
    ],
    '00s': [
      `Glitch immersion: the digital dissolution. The artifacts of the technology become the point. You disappear into the errors.\n\nBest when you need to stop existing for a while.`,
      `Laptop ambient: the bedroom becomes infinite through lo-fi production. Disappearance through reduction and repetition.\n\nThe kind of listening that makes the physical world fade.`,
    ],
    '2010s': [
      `Vaporwave immersion: the consumer landscape reflected until you dissolve into it. The shopping mall as meditation chamber.\n\nDisappearance through aesthetic saturation.`,
      `Deep drone: the music goes so low and so deep that normal hearing becomes impossible. You stop existing in normal frequencies.\n\nDissolution through depth.`,
    ],
    'now': [
      `Contemporary immersion: hyperpop and experimental combined into total environmental dissolution. The listener is no longer external.\n\nYou become part of the production. Disappearance through integration.`,
      `Ambient-adjacent immersion: all the recent techniques for dissolving the self into sound, applied to the present moment.\n\nBest when you need to become anonymous to yourself.`,
    ],
    'timeless': [
      `Tone and texture doing the work that melody usually does. Nothing hooks — everything diffuses.\n\nThe longer you stay with it, the further in you get.`,
      `Some music lets you disappear. This one assists with the process.\n\nNo return address. You'll find your way back eventually.`,
    ],
  },
  'remember': {
    '60s': [
      `Nostalgia encoded in real time. Someone recorded this because they knew they'd need to reach back to this moment someday.\n\nThe tape is time travel equipment.`,
      `Folk preservation: the act of recording is the act of remembering. Every note a document. Every song a prayer for continuity.\n\nBest when you're trying to retrieve something that matters.`,
    ],
    '70s': [
      `The warmth in this recording is a document. Not aesthetic choice — historical record. The tape hiss is the marker of when this happened.\n\nBest heard when you need proof that this moment existed.`,
      `Analogue memory: the technology that requires you to slow down and remember. No streaming — just you, the needle, and the year this was made.\n\nRemembering as ritual.`,
    ],
    '80s': [
      `The digital marker of when this was. The synth choices timestamp the moment more reliably than the release date.\n\nYou hear the decade embedded in every timbre.`,
      `Memory through replication. The production is precise enough that you can return to the exact feeling of the original moment.\n\nRemembering through fidelity.`,
    ],
    '90s': [
      `The sound of a year you can't quite locate — familiar, slightly off, like a room you lived in but can't map anymore.\n\nMemory as production technique. It plays with the distance between then and here.`,
      `Signals from a frequency that no longer broadcasts. The lo-fi grain isn't aesthetic choice — it's honest about where this came from.\n\nSome music is made for the past. This one knows it.`,
    ],
    '00s': [
      `Compressed memory: the digital precision makes the past feel more accessible, not less. You can zoom in on the exact moment.\n\nBest for detailed remembering. The clarity serves memory.`,
      `Post-genre retrospection: sampling and referencing embedded in the production. The song is about memory while also being a memorial.\n\nRemembering recursively.`,
    ],
    '2010s': [
      `Lo-fi as memory protocol. The underproduction is the sound of reaching back — slightly distorted by time, slightly unclear, but emotionally precise.\n\nRemembering through controlled degradation.`,
      `The precision of bedroom recording meets the imprecision of human memory. Digital exactitude married to emotional approximation.\n\nMemory preserved at maximum fidelity.`,
    ],
    'now': [
      `Retro-futurism: the memory is from the future of the past, accessed in the present. The temporal layers collapse into a single point of sadness.\n\nRemembering things that never happened but feel completely real.`,
      `The production is from now but sounds like then, but serves both. The temporal trick is the point — memory as a place you visit.\n\nBest when you're nostalgic for something that exists right now.`,
    ],
    'timeless': [
      `The warmth in this recording is a document as much as a sound. Time-stamped, not in the metadata — in the mix.\n\nBest heard when you have somewhere specific to go back to.`,
      `Everything in this record is already a little behind. That's not a flaw — it's where it lives.\n\nYou'll understand it better in ten years.`,
    ],
  },
  'not-alone': {
    '60s': [
      `Communication as production value. The song is constructed so that listener and songwriter meet exactly halfway through the second verse.\n\nShared frequency from a pre-internet era.`,
      `Folk communion: call and response technology built into the song itself. You become part of the conversation by listening.\n\nBelonging through participation.`,
    ],
    '70s': [
      `Soul music as communication protocol: the production leaves room for your response. Your feeling is invited in to complete the circuit.\n\nThe warmth in the recording is the warmth of someone waiting for you.`,
      `Funk as community: the rhythm is infectious because it recognizes everyone. There's space in the groove for every body that wants to move.\n\nBelonging through embodied rhythm.`,
    ],
    '80s': [
      `Synth-pop communion: the synthetic is used to create a space where everyone feels equally artificial, equally welcome. No one is pretending.\n\nBelonging through shared unreality.`,
      `Post-punk intensity: the darkness is a place of congregation. Those who hear this specific frequency will recognize each other.\n\nCommunity through shared sorrow.`,
    ],
    '90s': [
      `Built for more than one pair of ears. The arrangement makes space — there's room in this music for another person.\n\nThe kind of sound that travels between people without losing anything in translation.`,
      `Someone made this because they needed to hear it themselves, then realised they couldn't be the only one.\n\nThe intimacy isn't personal — it's universal. That's what makes it work.`,
    ],
    '00s': [
      `Digital connection: the production is so precise that it creates a direct line between listener and artist. No static. Pure signal.\n\nBelonging through absolute clarity.`,
      `Post-internet intimacy: the recording is mixed to feel like it's happening directly in your ear. Telepathic adjacency.\n\nConnection through technological exactitude.`,
    ],
    '2010s': [
      `Lo-fi communion: the underproduction is an act of trust. You're hearing this at its most vulnerable, in the bedroom where it was born.\n\nBelonging through witnessing the raw moment.`,
      `Streaming-era connection: the song is constructed to be shared. Every moment is shareable. Community through virality of feeling.\n\nBelonging becomes digital currency.`,
    ],
    'now': [
      `Hyperpop community: the chaotic production is a meeting place. Only people who understand this specific frequency can hear you.\n\nBelonging through decoding the chaos together.`,
      `Post-genre communion: every song contains multitudes. There's something in this for everyone, everyone brings their own meaning, community emerges from plurality.\n\nBelonging through radical inclusion.`,
    ],
    'timeless': [
      `Music that knows about the gap between people and decides to bridge it rather than describe it.\n\nBest when shared. Fragile in the best way when played for someone for the first time.`,
      `A frequency that finds other people on the same channel. When you play this for someone and they get it, something is confirmed.\n\nThe right track at the right moment is a form of translation.`,
    ],
  },
}

// ─── QUOTE (listening + seek) ────────────────────────────────────────────────

const QUOTES: Record<string, Record<string, string[]>> = {
  'alone-night': {
    'feel-deeply': [
      `The kind of person who has to sit with a song for a week before they trust it enough to play it for someone else.`,
      `The kind of person who uses headphones as a barrier and a bridge simultaneously.`,
    ],
    'clear-head': [
      `The kind of person who puts an album on at 2am when sleep won't come, looking for the frequency that matches the static in their head.`,
      `The kind of person who treats their solitude like a listening room, not a punishment.`,
    ],
    'get-energy': [
      `The kind of person who needs to feel the energy move through them alone before they can take it into a room with other people.`,
      `The kind of person whose energy comes from somewhere internal, refined in isolation, then released.`,
    ],
    'travel-mentally': [
      `The kind of person who needs the darkness and silence to go somewhere with music, to be fully transported.`,
      `The kind of person who travels furthest at night, when the world outside stops and the world inside is infinite.`,
    ],
    'disappear': [
      `The kind of person who puts headphones on at night not to sleep but to enter something else entirely.`,
      `The kind of person who needs to dissolve before they can rest, and dissolution requires darkness and sound.`,
    ],
    'remember': [
      `The kind of person who listens alone at night to things that happened in different nights, different years, different versions of themselves.`,
      `The kind of person who uses the late hour as permission to feel the full weight of memory.`,
    ],
  },
  'loud-car': {
    'feel-deeply': [
      `The kind of person who cries with the windows up and the music loud, and it's the only place they allow themselves to.`,
      `The kind of person whose deepest feelings get processed through the speaker system while moving at 70mph.`,
    ],
    'clear-head': [
      `The kind of person who uses the car as a mobile thinking room — the right music, the open road, the permission to work through something without interruption.`,
      `The kind of person who clears their head best while moving, while the outside world is passing.`,
    ],
    'get-energy': [
      `The kind of person who gets to a venue energized because they've already moved their body for an hour with the right soundtrack.`,
      `The kind of person whose neighbours have an opinion about their taste that they've never shared, mostly experienced on the highway.`,
    ],
    'travel-mentally': [
      `The kind of person who takes a detour they didn't plan because the song was building and stopping would have been wrong.`,
      `The kind of person for whom the destination is secondary to the journey and the music the journey is made of.`,
    ],
    'disappear': [
      `The kind of person who needs to move to disappear — the motion of the car, the speed, the music as a transport mechanism.`,
      `The kind of person who dissolves into the road and the sound simultaneously, going somewhere both literal and internal.`,
    ],
    'remember': [
      `The kind of person who has a specific soundtrack for driving past specific places, trying to return to who they were then.`,
      `The kind of person who uses the highway as a pilgrimage route, going back to the moments the songs contain.`,
    ],
  },
  'background-work': {
    'feel-deeply': [
      `The kind of person who does their best emotional work when they're ostensibly working on something else, the music processing things underneath.`,
      `The kind of person whose most important feelings get held while their hands are busy with other things.`,
    ],
    'clear-head': [
      `The kind of person who says the playlist is for focus, and mostly means it, and uses focus as cover for processing.`,
      `The kind of person who gets more done in two focused hours with the right record than in an entire unstructured day.`,
    ],
    'get-energy': [
      `The kind of person who turns tedious tasks into movement through the right music, who can find momentum in anything.`,
      `The kind of person whose capacity for sustained effort comes from audio rather than willpower.`,
    ],
    'travel-mentally': [
      `The kind of person who daydreams through their work, the music creating the conditions for their mind to be elsewhere.`,
      `The kind of person who travels furthest while appearing to sit still, the music the ticket, the headphones the vehicle.`,
    ],
    'disappear': [
      `The kind of person who uses work as cover for disappearing — the task is the excuse, the music is the portal.`,
      `The kind of person who can vanish into a playlist for six hours while technically being present at their desk.`,
    ],
    'remember': [
      `The kind of person who associates their work soundtrack with the period of their life where they were creating it, music as temporal marker.`,
      `The kind of person who plays the same albums while working that they played last year, watching themselves change while the songs stay the same.`,
    ],
  },
  'at-party': {
    'feel-deeply': [
      `The kind of person who finds the person at the party who also gets quiet and too feeling, and that becomes your whole conversation.`,
      `The kind of person who says 'this one's important' when they play a track at a gathering, meaning it like a warning.`,
    ],
    'clear-head': [
      `The kind of person who knows the difference between music that fills a room and music that empties it, and always reaches for the second kind.`,
      `The kind of person who curates the party's audio landscape so carefully that it looks like they're not trying.`,
    ],
    'get-energy': [
      `The kind of person who can change the entire atmosphere of a party without visibly trying, who understands audio as architecture.`,
      `The kind of person whose music taste defines the room's velocity, who reads the floor and knows what comes next.`,
    ],
    'travel-mentally': [
      `The kind of person who finds the quiet corner of a loud party to stand in, the music taking them somewhere while the crowd moves around them.`,
      `The kind of person who stays at parties longer than expected because the music built a world inside the noise.`,
    ],
    'disappear': [
      `The kind of person who puts headphones on at parties not to ignore people, but to stay long enough to eventually talk to them.`,
      `The kind of person whose presence at a party becomes the moment they remember to disappear inside something for a moment.`,
    ],
    'remember': [
      `The kind of person who plays old songs at parties specifically to watch how people react to being transported backwards.`,
      `The kind of person who uses a party as a container for collective memory, the music the time machine.`,
    ],
  },
  'on-the-move': {
    'feel-deeply': [
      `The kind of person who feels things most acutely while in transition, while between places, the movement part of the emotional processing.`,
      `The kind of person who carries a soundtrack for movement, for the moments when being still would mean stopping.`,
    ],
    'clear-head': [
      `The kind of person who thinks most clearly while actually moving — not sitting, not still, but in transit between destinations.`,
      `The kind of person who clears their head best while their feet or wheels are already heading somewhere.`,
    ],
    'get-energy': [
      `The kind of person who has a specific playlist for specific roads and won't explain it to passengers.`,
      `The kind of person whose energy peaks exactly in the moment between leaving and arriving.`,
    ],
    'travel-mentally': [
      `The kind of person who takes a detour they didn't plan because the song was building and stopping would have been wrong.`,
      `The kind of person who treats every transition as an opportunity for the internal trip the music suggests.`,
    ],
    'disappear': [
      `The kind of person who needs to move to disappear, who can't dissolve while stationary, for whom motion is the medium of vanishing.`,
      `The kind of person who becomes most anonymous in the crowd of travelers, music as their only constant location.`,
    ],
    'remember': [
      `The kind of person who associates certain songs with specific transit routes, who remembers journeys more than destinations.`,
      `The kind of person who understands travel as pilgrimage, each song a station on the route to somewhere internal.`,
    ],
  },
  'ritual-listen': {
    'feel-deeply': [
      `The kind of person who has set aside sacred time for listening, who treats the act of attention as prayer.`,
      `The kind of person who needs to feel things ceremonially, who requires the formality of listening as ritual to fully surrender.`,
    ],
    'clear-head': [
      `The kind of person who has a specific room and a specific chair for listening, who understands that the space matters as much as the sound.`,
      `The kind of person for whom listening is meditation, structured and repeated until the mind settles.`,
    ],
    'get-energy': [
      `The kind of person who uses certain albums like fuel, returning to them in the same way and at the same volume.`,
      `The kind of person who channels energy through ritual, who needs the form to access the feeling.`,
    ],
    'travel-mentally': [
      `The kind of person who uses listening sessions as scheduled escapes, who builds travel into their calendar with the same care as work.`,
      `The kind of person who treats deep listening as a practice, like meditation or yoga, a discipline of transportation.`,
    ],
    'disappear': [
      `The kind of person who disappears ceremonially, who requires the ritual of sitting down and paying full attention to enter the void.`,
      `The kind of person who treats vanishing as a scheduled practice, something you set aside time for, something you protect.`,
    ],
    'remember': [
      `The kind of person who returns to certain albums on anniversaries of internal events, treating listening as commemoration.`,
      `The kind of person who understands ritual as repetition, and in that repetition, a way to hold and revisit memory.`,
    ],
  },
  'shared-moment': {
    'feel-deeply': [
      `The kind of person who always has a song they're waiting to play for the right person, at the right moment.`,
      `The kind of person who uses music as a shortcut to intimacy, a way of saying what words can't quite reach.`,
    ],
    'clear-head': [
      `The kind of person who knows that clarity shared is clarity doubled, who plays clarifying music for the people they trust.`,
      `The kind of person who uses the right track at the right moment as an offer of understanding, not explanation.`,
    ],
    'get-energy': [
      `The kind of person who believes that energy is contagious, and that the right song at the right moment can shift an entire interaction.`,
      `The kind of person who reads the room and knows exactly which track will move it, who is a translator between music and moment.`,
    ],
    'travel-mentally': [
      `The kind of person who shares journeys instead of destinations, who creates travel companions through the music they choose.`,
      `The kind of person who plays music for someone and in that moment invites them to go somewhere with you, somewhere internal.`,
    ],
    'disappear': [
      `The kind of person who considers a shared disappearance into music an act of profound connection, a kind of dissolution together.`,
      `The kind of person who needs to vanish and needs someone else in the vanishing, music as the medium of mutual escape.`,
    ],
    'remember': [
      `The kind of person who, when they find a song that understands something, immediately thinks of three other people who need to hear it.`,
      `The kind of person who connects people to memory through music, who is a curator of collective nostalgia.`,
    ],
  },
}

// ─── SUPERPOWER (genres + seek) ──────────────────────────────────────────────

const SUPERPOWERS: Record<string, Record<string, string[]>> = {
  'rock': {
    'feel-deeply': [
      `You can hold sorrow and defiance in the same moment without them cancelling each other out.`,
      `You understand that vulnerability and power are not opposites — they're the same instrument played at different volumes.`,
    ],
    'clear-head': [
      `You can strip a complicated situation down to the one thing that actually matters, and you do it with precision.`,
      `You know the difference between noise and signal, and you're ruthless about which is which.`,
    ],
    'get-energy': [
      `You raise the temperature of a room without doing anything visibly different — your presence is enough to make others move.`,
      `You know exactly which moment to shift the energy, and you do it with timing that feels natural, not forced.`,
    ],
    'travel-mentally': [
      `You can be fully present in a conversation while simultaneously somewhere else entirely, living in multiple realities at once.`,
      `You navigate between worlds — the actual and the imagined — with equal ease and conviction.`,
    ],
    'disappear': [
      `You know how to become invisible in plain sight, and it's a choice, not a curse.`,
      `You can step outside the frequency of any situation, observe it objectively, and come back changed but not broken.`,
    ],
    'remember': [
      `You hold the past without being crushed by it — you carry weight with grace.`,
      `You understand that what happened matters, and you refuse to pretend it didn't.`,
    ],
  },
  'electronic': {
    'feel-deeply': [
      `You can translate emotions into architecture, building worlds where feelings can live safely.`,
      `You understand the mathematics of intimacy — how precision and distance can create closeness.`,
    ],
    'clear-head': [
      `You can empty a room of clutter with a gesture, creating space where thought becomes possible.`,
      `You understand that minimalism isn't about having nothing — it's about having exactly what matters.`,
    ],
    'get-energy': [
      `You understand rhythm as the fundamental law of reality, and you can feel when things are out of sync.`,
      `You raise velocity wherever you go, turning stillness into motion through sheer frequency.`,
    ],
    'travel-mentally': [
      `You see patterns others miss because you think in systems, not stories.`,
      `You navigate futures that haven't happened yet by understanding their underlying structure.`,
    ],
    'disappear': [
      `You can dissolve into abstract space and emerge transformed, having shed whatever needed shedding.`,
      `You understand that in systems and networks, individual identity is optional — and freeing.`,
    ],
    'remember': [
      `You store memories like data, perfectly preserved, endlessly retrievable, never degraded.`,
      `You can return to exact moments, in exact conditions, because you've archived them with precision.`,
    ],
  },
  'hip-hop': {
    'feel-deeply': [
      `You can feel the full weight of a moment and articulate it in a way that makes others feel less alone in it.`,
      `You translate pain into power through sheer force of will and wordcraft.`,
    ],
    'clear-head': [
      `You can read a room and know exactly what's true beneath what's being said.`,
      `You cut through bullshit with surgical precision and people respect you for it.`,
    ],
    'get-energy': [
      `You can convince people to start something they were about to talk themselves out of.`,
      `You move through the world with a gravity that makes others orbit closer.`,
    ],
    'travel-mentally': [
      `You navigate streets literal and metaphorical with equal authority.`,
      `You understand where you came from, where you are, and where you're headed — and you move with that knowledge.`,
    ],
    'disappear': [
      `You can blend into any environment while remaining entirely yourself, camouflaged through authenticity.`,
      `You move through crowds unnoticed when you want to, observed when you choose it.`,
    ],
    'remember': [
      `You hold stories that need holding — your memory is a public archive.`,
      `You carry the weight of what happened to you and what happened to people like you, and you refuse to forget.`,
    ],
  },
  'soul-vocal': {
    'feel-deeply': [
      `You can read the emotional weather in a room before anyone has said a word.`,
      `You locate the exact moment in a conversation when someone needs to be heard differently.`,
    ],
    'clear-head': [
      `You know the difference between what someone says and what they mean, and you honor both.`,
      `You understand that clarity sometimes requires gentleness, not harshness.`,
    ],
    'get-energy': [
      `You raise the temperature of a room without doing anything visibly different — your presence moves people.`,
      `You make people feel capable of more than they thought possible.`,
    ],
    'travel-mentally': [
      `You hold space for people to go deeper into themselves while feeling completely safe.`,
      `You understand the human landscape the way cartographers understand geography.`,
    ],
    'disappear': [
      `You make people feel so seen that your absence becomes the thing they notice most.`,
      `You can dissolve your own needs into service of understanding others.`,
    ],
    'remember': [
      `You hold a quality of attention that makes people feel permanently remembered by you.`,
      `You carry people's stories with the care you'd want for your own.`,
    ],
  },
  'ambient-experimental': {
    'feel-deeply': [
      `You can hold contradictions without needing them to resolve — you make peace a permanent state.`,
      `You understand that feeling doesn't need to be loud to matter.`,
    ],
    'clear-head': [
      `You find clarity in emptiness, in what's not there, in the space between things.`,
      `You know that understanding requires sitting with discomfort until it becomes transparent.`,
    ],
    'get-energy': [
      `You move through the world at a frequency nobody else can quite match, always just beyond reach.`,
      `You create motion through subtlety — your presence shifts things in ways people can't articulate.`,
    ],
    'travel-mentally': [
      `You see the map before anyone else has started drawing it — you understand the topography of the invisible.`,
      `You travel to places that exist in sound and probability, returning changed in ways you can't explain.`,
    ],
    'disappear': [
      `You dissolve so completely into whatever you're experiencing that the boundary between self and context vanishes.`,
      `You understand that disappearing isn't absence — it's a form of presence that doesn't require attention.`,
    ],
    'remember': [
      `You reconstruct emotional landscapes from single details — a texture, a frequency, a moment of silence.`,
      `You remember things that happened to the person you're with, holding their history in your presence.`,
    ],
  },
  'folk-acoustic': {
    'feel-deeply': [
      `You know which song will open a door that three hours of talking couldn't.`,
      `You hold space for people without requiring them to explain why they needed it.`,
    ],
    'clear-head': [
      `You understand the difference between complexity and complication, and you always choose the former.`,
      `You build clarity through economy of means — every element purposeful.`,
    ],
    'get-energy': [
      `You make things move that have been sitting still too long, without it feeling like a push.`,
      `You understand momentum as something that builds from authenticity, not force.`,
    ],
    'travel-mentally': [
      `You understand journey as the ultimate form of understanding — you travel to know.`,
      `You see stories in landscapes and hear the history in the way a place sounds.`,
    ],
    'disappear': [
      `You disappear into tradition, into lineage, into something larger than yourself.`,
      `You can dissolve into a story and emerge as part of it, your voice indistinguishable from the voices that came before.`,
    ],
    'remember': [
      `You carry the past as living memory — not documentation, but continuation.`,
      `You remember not just what happened, but why it mattered, and you keep it alive through the act of knowing.`,
    ],
  },
  'jazz-instrumental': {
    'feel-deeply': [
      `You can improvise through emotional complexity without a map, trusting your instrument to find the truth.`,
      `You understand that the most profound communication happens without predetermined words.`,
    ],
    'clear-head': [
      `You can strip a situation down to its essential harmonic structure.`,
      `You know when to play the obvious note and when to play the note that reframes everything.`,
    ],
    'get-energy': [
      `You know exactly which track to put on at the exact moment a room needs to shift.`,
      `You understand group dynamics as collaboration, moving together without a conductor.`,
    ],
    'travel-mentally': [
      `You navigate conversations the way jazz musicians navigate standard changes — familiar, but always surprising.`,
      `You find freedom in constraint, infinite options within finite rules.`,
    ],
    'disappear': [
      `You can dissolve into ensemble, making others sound better by making yourself smaller when necessary.`,
      `You understand that the best solo is the one that serves the music, not the soloist.`,
    ],
    'remember': [
      `You can reconstruct the logic of a moment from a single phrase, understanding how it was built.`,
      `You hold the architecture of what happened, remembering not just the notes but the relationships between them.`,
    ],
  },
}

// ─── SHADOW (era + seek) ─────────────────────────────────────────────────────

const SHADOWS: Record<string, Record<string, string[]>> = {
  '60s': {
    'feel-deeply': [
      `You were born into an era of revolution and you still believe things should move that fast, that dramatically, that completely.`,
      `You expect intensity as the baseline for meaning, which makes ordinary life feel like failure.`,
    ],
    'clear-head': [
      `You trust the 60s myth of clarity more than you trust your own perception of what's actually happening.`,
      `The idealism of the era is still in your bones, making the present world feel perpetually disappointing.`,
    ],
    'get-energy': [
      `You still believe in the possibility of change through music, which is beautiful and naive and exhausting.`,
      `You channel the 60s need for disruption into contexts that don't need it, breaking things that were working fine.`,
    ],
    'travel-mentally': [
      `You still think of consciousness expansion the way the 60s did — as something that can be achieved through sound, through chemistry, through will.`,
      `You're always chasing the mystical experience that the era promised, disappointed that the world isn't one.`,
    ],
    'disappear': [
      `You dissolve into the mythology of an era you didn't live, which makes it impossible to be fully present in one you do.`,
      `The 60s fantasy of total dissolution through psychedelia is still your template for escape.`,
    ],
    'remember': [
      `You carry nostalgia for a time you weren't alive for, which means you remember it better than you remember your own life.`,
      `The past is more real to you than the present, and specifically the imagined past of the 60s.`,
    ],
  },
  '70s': {
    'feel-deeply': [
      `You expect relationships to carry the weight of artistic statements, which means almost everything gets too important too fast.`,
      `The 70s romanticism about feeling everything deeply has left you allergic to smallness, to quiet moments that don't matter.`,
    ],
    'clear-head': [
      `Your relationship to minimalism is inherited from 70s asceticism, which means you sometimes confuse emptiness with purity.`,
      `You trust silence more than you trust speech, which can make you seem unavailable when you're just thinking.`,
    ],
    'get-energy': [
      `The 70s belief that energy should be funky, soulful, and connected to bodies means you distrust anything that doesn't feel physical.`,
      `You're chasing a groove that might not exist anymore, or might have only ever existed on vinyl.`,
    ],
    'travel-mentally': [
      `The 70s opened doors in consciousness that you're still trying to walk through, which means the present world always feels enclosed.`,
      `You measure all experiences against the 70s peak of cosmic awareness, and everything pales in comparison.`,
    ],
    'disappear': [
      `The 70s aesthetic of disappearing into funk, into the moment, is your blueprint for escape, which means you disappear when you should stay.`,
      `You dissolve into vibes, which is wonderful in the moment and devastating in the morning.`,
    ],
    'remember': [
      `You hold the 70s as a golden age that you only know through recordings, which is a beautiful way to ensure it never disappoints.`,
      `The distance of time has made the 70s perfect, which means you compare everything current to a version that never actually existed.`,
    ],
  },
  '80s': {
    'feel-deeply': [
      `The 80s belief that emotion could be synthesized has left you sometimes unsure whether you feel things or are performing feeling.`,
      `You were promised that technology would make connection easier, and you still haven't accepted that it doesn't.`,
    ],
    'clear-head': [
      `You sometimes privilege efficiency over authenticity because the 80s told you those could be the same thing.`,
      `The promise of clean, clear, digital precision has left you intolerant of anything that's messier than you expected.`,
    ],
    'get-energy': [
      `You inherited the 80s belief that more is better, which sometimes leads you to overwhelm a moment that wanted simplicity.`,
      `You're addicted to the rush of the 80s production high, which means real life usually feels boring in comparison.`,
    ],
    'travel-mentally': [
      `The 80s sold you the idea that you could travel anywhere through technology or fashion or drugs, and you're still waiting for that promise to deliver.`,
      `You're looking for the future the 80s promised, which means the actual present always feels like a letdown.`,
    ],
    'disappear': [
      `The 80s taught you that you could synthesize yourself into anything, which has left you sometimes unsure who you actually are underneath the production.`,
      `You disappear into aesthetic, which is glamorous until the moment it stops working and you realize there's no person under there.`,
    ],
    'remember': [
      `The 80s perfectly preserved artifacts make memory easier and longing harder — you can return to the exact moment but not the feeling.`,
      `You remember the 80s as a place you can visit whenever you put on the right album, which means the present never quite holds you.`,
    ],
  },
  '90s': {
    'feel-deeply': [
      `When something is too good, you're already thinking about how it ends — it's a 90s inheritance, the end-times mentality.`,
      `You sometimes mistake intensity for meaning and have to unlearn songs the same way you unlearn people.`,
    ],
    'clear-head': [
      `The space you create in your mind sometimes becomes the space you keep between yourself and other people.`,
      `You occasionally mistake emotional distance for clarity, and it takes a while to notice the difference.`,
    ],
    'get-energy': [
      `When there's nothing to push against, you make something up to push against — it's a 90s reflex, rebellion as identity.`,
      `The stillness required to really listen to something is harder for you than it looks from the outside.`,
    ],
    'travel-mentally': [
      `You're sometimes so far elsewhere that you miss what's happening in the room you're actually in.`,
      `The idea of something can be more satisfying than the thing itself, which makes some things impossible to finish.`,
    ],
    'disappear': [
      `You've become so good at dissolving that some people aren't sure whether you were ever fully there.`,
      `The quiet you build around yourself can look from the outside like unavailability.`,
    ],
    'remember': [
      `You live in enough of the past that the present sometimes arrives late.`,
      `You hold on to the shape of things long after the things themselves have changed, which is both a gift and a problem.`,
    ],
  },
  '00s': {
    'feel-deeply': [
      `You were promised that digital precision would make emotion cleaner, and you still expect people to feel on schedule.`,
      `The 00s taught you that everything is documentation, which means you sometimes experience things through how they'll be remembered rather than how they are.`,
    ],
    'clear-head': [
      `You trust the algorithm more than you trust your own instinct, which sometimes leads you to make decisions that are technically optimal but emotionally wrong.`,
      `The clarity the 00s promised through compression and digitalization sometimes feels more like erasure.`,
    ],
    'get-energy': [
      `You're trapped in the 00s belief that speed equals progress, which makes you restless with anything that moves at a human pace.`,
      `The hyperconnection of the era left you unable to sit alone with your own energy without documenting it.`,
    ],
    'travel-mentally': [
      `The 00s made the world infinitely accessible and somehow made it feel smaller and less interesting.`,
      `You remember the internet of the 00s as a place you could travel to, and you're still nostalgic for when cyberspace felt like elsewhere.`,
    ],
    'disappear': [
      `The 00s taught you that you could hide in plain sight on the internet, and now you sometimes forget how to just be present.`,
      `You disappear into digital spaces, which feels like freedom until you realize you've disappeared from the actual world entirely.`,
    ],
    'remember': [
      `Everything is archived and indexed, which means you can remember things with perfect clarity but also perfect distance.`,
      `The 00s made memory infinite and instant, which somehow made it feel less meaningful.`,
    ],
  },
  '2010s': {
    'feel-deeply': [
      `You were promised that feeling deeply and performing it were compatible, and you're still untangling the difference.`,
      `The 2010s made vulnerability a currency, which means you sometimes feel things in order to own them rather than experiencing them.`,
    ],
    'clear-head': [
      `The 2010s wellness culture has left you analyzing your clarity the way you'd analyze a product — is it optimal? Is it the right kind?`,
      `You expect self-improvement to be linear, which means any setback feels like personal failure rather than necessary process.`,
    ],
    'get-energy': [
      `You're addicted to the 2010s feedback loop of posting-sharing-validating, which means quiet energy with no audience feels wasted.`,
      `The 2010s taught you that attention is the ultimate energy, which has left you hollow when you're not being watched.`,
    ],
    'travel-mentally': [
      `You can travel anywhere via the internet, which paradoxically makes you feel more trapped because everywhere is just the internet.`,
      `The 2010s promised infinite access, but somehow that made the world feel smaller, not larger.`,
    ],
    'disappear': [
      `You learned to disappear through aesthetic and irony, which means sometimes people don't see you at all, just the carefully curated image.`,
      `The 2010s taught you that your real self is unbearable, so you built a better version — now you forget which is which.`,
    ],
    'remember': [
      `Everything is both documented and simultaneously forgotten at internet speed — you remember everything and nothing.`,
      `The 2010s trained you to be nostalgic in real time, to miss things while they were still happening.`,
    ],
  },
  'now': {
    'feel-deeply': [
      `You're supposed to feel everything while being online about it, which has made authentic feeling almost impossible to locate under all the performance.`,
      `The present moment promised transparency and delivered exhaustion — you're expected to articulate every feeling while also having it.`,
    ],
    'clear-head': [
      `Everything is content, which means clarity always carries the weight of presentation, never just the weight of thought.`,
      `The noise never stops, which means the space you've carved for thinking always feels precarious and temporary.`,
    ],
    'get-energy': [
      `Energy is supposed to be renewable and sustainable, which ironically makes you feel guilty whenever you're tired.`,
      `The present moment offers infinite options and somehow that makes you paralyzed rather than liberated.`,
    ],
    'travel-mentally': [
      `You're supposed to hold multiple realities simultaneously — the actual world, the digital world, the future you're worried about.`,
      `Travel is so accessible that it doesn't feel like travel anymore, which means nowhere feels truly elsewhere.`,
    ],
    'disappear': [
      `Disappearing now means becoming invisible in a world of visibility, which is harder and lonelier than it should be.`,
      `The technology designed to connect you can also be used to vanish from sight, but vanishing is only freedom if it's chosen.`,
    ],
    'remember': [
      `Everything is both immediately forgotten and permanently archived, which creates a strange relationship to memory where nothing sticks but nothing is ever gone.`,
      `You're supposed to not think about the past, to stay present, which means you resent having to be in this moment when other moments were so much easier.`,
    ],
  },
  'timeless': {
    'feel-deeply': [
      `You understand things emotionally long before you're ready to act on that understanding.`,
      `The more something matters, the longer you wait to let yourself admit it.`,
    ],
    'clear-head': [
      `When the noise gets too much, you go silent in ways that look like peace but aren't.`,
      `You're better at clearing your head than letting other people in to complicate it.`,
    ],
    'get-energy': [
      `You can read a room well enough to know you're the reason it's louder than it needs to be.`,
      `You keep moving partly because stopping would mean sitting with something you've been outrunning.`,
    ],
    'travel-mentally': [
      `You leave before you leave, which protects you and costs you in roughly equal measure.`,
      `Home is the thing you keep redefining so you never have to commit to one version of it.`,
    ],
    'disappear': [
      `Sometimes what feels like peace is just the absence of something you haven't noticed you've stopped wanting.`,
      `The skill of disappearing is also the skill of not being found when you'd actually like to be.`,
    ],
    'remember': [
      `The version of events you carry is more vivid than the version that actually happened, and you know this, and you keep the vivid one anyway.`,
      `You're harder to surprise than most people because some part of you is always already somewhere you've been before.`,
    ],
  },
}

// ─── PLACE (genres + listening) ──────────────────────────────────────────────

const PLACES: Record<string, Record<string, string[]>> = {
  'rock': {
    'alone-night': [
      `A room above a closed venue, the night still moving through the walls`,
      `A basement where the volume has to stay at one specific level or the whole structure fails`,
    ],
    'loud-car': [
      `A road that ends at a coastline you didn't know was there, best discovered at volume`,
      `An on-ramp at the exact moment a song begins to build`,
    ],
    'background-work': [
      `An office after everyone's left, your guitar leaning against the desk`,
      `A studio where something was recorded at exactly the right moment of dissatisfaction`,
    ],
    'at-party': [
      `A dancefloor that briefly becomes something sacred, then returns to ordinary`,
      `A garage where people learned to feel electricity move through their bodies`,
    ],
    'on-the-move': [
      `A road with graffiti on the underpass from ten years ago`,
      `A van heading somewhere undefined, everyone singing the same chorus at different times`,
    ],
    'ritual-listen': [
      `A room set aside for exactly this — where certain albums get played on certain nights like prayer`,
      `A space where volume is permitted and encouraged`,
    ],
    'shared-moment': [
      `A car full of people who all know this song, singing it together without self-consciousness`,
      `A living room floor after a show, everyone still vibrating`,
    ],
  },
  'electronic': {
    'alone-night': [
      `A dark room where the only light comes from a glowing keyboard or laptop`,
      `A space where sound becomes shape, where you can almost touch the frequencies`,
    ],
    'loud-car': [
      `A city street at night where neon reflects the rhythm`,
      `A motorway where the beat syncs with the engine`,
    ],
    'background-work': [
      `A library at 2am where someone is generating worlds`,
      `A studio where machines are having conversations with each other`,
    ],
    'at-party': [
      `A warehouse where the sound system is the entire architecture`,
      `A dancefloor built for bodies that want to move in sync with machines`,
    ],
    'on-the-move': [
      `An airport where the hum of machines is the only constant`,
      `A train where the rhythm of the rails matches the rhythm of the track`,
    ],
    'ritual-listen': [
      `A headphone moment where the entire world disappears and you enter the one the sound creates`,
      `A space constructed entirely from production choices`,
    ],
    'shared-moment': [
      `A shared moment of synchronization — two people on the same frequency at exactly the same moment`,
      `A club where everyone is alone together, moving as one collective body`,
    ],
  },
  'hip-hop': {
    'alone-night': [
      `A corner where the late night wisdom settles, where your truest self shows up`,
      `A room where the music is loud enough to drown out everything except what matters`,
    ],
    'loud-car': [
      `A car with tinted windows rolling through the city at 2am, the bass making the frame vibrate`,
      `A street where everyone knows the beat before the beat arrives`,
    ],
    'background-work': [
      `A studio where bars are built line by line, each word a brick`,
      `A space where productivity sounds like creation`,
    ],
    'at-party': [
      `A room that fills with energy the moment the track starts`,
      `A moment when everyone is nodding, moving together, understanding the same thing`,
    ],
    'on-the-move': [
      `A block you know, a road you've traveled, now remapped through the music`,
      `A journey documented in bars, each verse a different location`,
    ],
    'ritual-listen': [
      `A moment of ceremonial attention — this album deserves it, this artist earned it`,
      `A space where the story gets told at exactly the right pace`,
    ],
    'shared-moment': [
      `A cypher where everyone takes a turn and you're all learning from each other`,
      `A shared understanding of code that only people on your frequency speak`,
    ],
  },
  'soul-vocal': {
    'alone-night': [
      `A kitchen at 3am where someone left the record on for no one but you`,
      `A room where the voice reaches directly into you, demanding presence`,
    ],
    'loud-car': [
      `A road with the windows open and the volume up, letting the voice travel`,
      `A journey where the voice accompanies you like a passenger who understands`,
    ],
    'background-work': [
      `A workspace where the voice keeps you company, reminds you why`,
      `A moment of focus because the human voice makes meaning unavoidable`,
    ],
    'at-party': [
      `A kitchen at a party where the conversation is better because someone's playing soul`,
      `A room that softens when the right voice hits the speakers`,
    ],
    'on-the-move': [
      `A transit moment made sacred by the voice coming through the speakers`,
      `A journey accompanied by someone singing directly to you`,
    ],
    'ritual-listen': [
      `A room set aside where you can give the voice the attention it deserves`,
      `A listening moment where human emotion is the subject and the medium`,
    ],
    'shared-moment': [
      `A room full of people moved by the same voice at the same moment`,
      `A shared experience of feeling heard by a voice that knows what you're going through`,
    ],
  },
  'ambient-experimental': {
    'alone-night': [
      `A dark space where you dissolve into sound, losing track of time`,
      `A room that becomes infinite through production, where you drift`,
    ],
    'loud-car': [
      `A drive where the road disappears and you're only moving through sound`,
      `A journey to somewhere internal, external geography becoming irrelevant`,
    ],
    'background-work': [
      `A space where work becomes meditation and sound becomes invisible accompaniment`,
      `A moment where productivity stops mattering and just being becomes the point`,
    ],
    'at-party': [
      `A corner of a party where a few people exist in their own sound bubble`,
      `A moment when the party becomes texture and background, the music becomes foreground`,
    ],
    'on-the-move': [
      `A transit space made strange by sound, familiar surroundings becoming abstract`,
      `A journey where the destination matters less than the acoustic space you're moving through`,
    ],
    'ritual-listen': [
      `A space designed specifically for dissolution — chair, headphones, time`,
      `A listening room where hours can pass and feel like moments`,
    ],
    'shared-moment': [
      `A shared disappearance, two people in the same ambient space together`,
      `A moment of collective quiet, collective floating in sound`,
    ],
  },
  'folk-acoustic': {
    'alone-night': [
      `A room with acoustic resonance, where a single voice fills all the space`,
      `A quiet moment where the guitar sounds like it's made of memory`,
    ],
    'loud-car': [
      `A window-down drive through landscape, the song and the scenery becoming one`,
      `A road that feels like a song you're driving through`,
    ],
    'background-work': [
      `A workspace where a voice and a guitar remind you why words matter`,
      `A moment of honesty while your hands stay busy`,
    ],
    'at-party': [
      `A moment around a fire or guitar where people get quieter to listen closer`,
      `A shared moment of communal song, everyone participating in the tradition`,
    ],
    'on-the-move': [
      `A journey made meaningful by folk — the road as pilgrimage`,
      `A transit moment where you're not going somewhere, you're going towards something the song knows`,
    ],
    'ritual-listen': [
      `A listening room where acoustic details matter, where you hear the artist's hands on the strings`,
      `A ceremony of attention to someone's genuine expression`,
    ],
    'shared-moment': [
      `A circle where everyone knows or is learning the same song`,
      `A moment of connection through shared tradition and shared voice`,
    ],
  },
  'jazz-instrumental': {
    'alone-night': [
      `A listening room where jazz creates architecture in the darkness`,
      `A space where improvisation unfolds like a conversation you're having with the musicians`,
    ],
    'loud-car': [
      `A drive where the harmonic complexity mirrors the scenery, both revealing themselves gradually`,
      `A road that unfolds the way a jazz solo unfolds — surprises within structure`,
    ],
    'background-work': [
      `A workspace where instrumental intelligence keeps you company without demands`,
      `A focus moment powered by the logic of what's happening in the sound`,
    ],
    'at-party': [
      `A room that becomes sophistication the moment the right jazz starts playing`,
      `A back room where people who want to listen deeply congregate`,
    ],
    'on-the-move': [
      `A transit through a space where jazz makes the ordinary moment feel like the performance`,
      `A journey where the musicians are traveling with you in the same direction`,
    ],
    'ritual-listen': [
      `A listening moment where following the harmonic argument requires attention and rewards it`,
      `A space where jazz becomes the entire architecture of the evening`,
    ],
    'shared-moment': [
      `A shared moment of following the musicians' conversation together`,
      `A room where everyone is listening for the same harmonic resolution`,
    ],
  },
}

// ─── GENRE CATEGORIZATION ────────────────────────────────────────────────────

/**
 * Maps genres to their archetype categories for crossed text generation
 */
function genreToCategory(genre: string): string {
  const genreLower = genre.toLowerCase()

  // Rock family (includes metal, punk, and psychedelic variants)
  if (['rock', 'indie rock', 'garage rock', 'post-punk', 'punk', 'hardcore', 'metal', 'doom metal', 'black metal', 'goth rock', 'darkwave', 'noise rock', 'art rock', 'math rock', 'progressive rock', 'folk rock', 'blues rock', 'psych rock'].includes(genreLower)) {
    return 'rock'
  }

  // Electronic family (includes electronic, industrial, synth, and electronic dance genres)
  if (['techno', 'minimal techno', 'electronic', 'experimental', 'krautrock', 'industrial', 'synth-pop', 'new wave', 'hyperpop', 'vaporwave', 'lo-fi', 'house', 'disco', 'jungle', 'drum and bass', 'witch house', 'post-rock'].includes(genreLower)) {
    return 'electronic'
  }

  // Hip-hop family (all hip-hop/rap variants)
  if (['hip-hop', 'rap', 'trap', 'drill', 'grime', 'cloud rap', 'alternative hip-hop', 'phonk'].includes(genreLower)) {
    return 'hip-hop'
  }

  // Soul & Vocal family (soul, r&b, funk, gospel, world music with vocal focus)
  if (['soul', 'r&b', 'alternative r&b', 'neo-soul', 'funk', 'gospel', 'afrobeat', 'world music', 'oud & maqam'].includes(genreLower)) {
    return 'soul-vocal'
  }

  // Ambient & Experimental family (ambient, drone, dreamy, spacious genres)
  if (['ambient', 'drone', 'dark ambient', 'shoegaze', 'slowcore', 'dream pop'].includes(genreLower)) {
    return 'ambient-experimental'
  }

  // Folk & Acoustic family (folk, singer-songwriter, acoustic, traditional)
  if (['folk', 'indie folk', 'singer-songwriter', 'americana', 'neo-classical', 'reggae', 'reggaeton', 'blues'].includes(genreLower)) {
    return 'folk-acoustic'
  }

  // Jazz family (jazz and jazz-adjacent)
  if (['jazz', 'spiritual jazz', 'modal jazz', 'nu-jazz'].includes(genreLower)) {
    return 'jazz-instrumental'
  }

  // Default fallback (for any unrecognized genres)
  return 'rock'
}

// ─── DETERMINISTIC SELECTION HELPERS ─────────────────────────────────────────

/**
 * Hash-based selection that returns deterministic index from array
 * Same inputs always produce same output, but different inputs usually produce different outputs
 */
function selectByHash(arr: string[], seed: string): string {
  if (arr.length === 0) return ''

  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }

  return arr[Math.abs(hash) % arr.length]!
}

// ─── CROSSED TEXT GENERATION ─────────────────────────────────────────────────

// ─── CORE THEMES ─────────────────────────────────────────────────────────────
/**
 * Core themes tied to specific seek patterns that repeat through all fields
 */
const CORE_THEMES: Record<string, {
  keywords: string[]
  archetype_mod: string[]
  story_focus: string
  power_focus: string
  shadow_focus: string
  place_focus: string
}> = {
  'feel-deeply': {
    keywords: ['depth', 'vulnerability', 'feeling', 'exposure', 'heart', 'sorrow', 'intimacy'],
    archetype_mod: ['Chamber', 'Intimate', 'Open'],
    story_focus: 'emotional weight and vulnerability as strength',
    power_focus: 'holding contradictions without cancelling them',
    shadow_focus: 'expecting meaning in everything, getting exhausted by feeling',
    place_focus: 'rooms that hold emotion, spaces of safety'
  },
  'clear-head': {
    keywords: ['clarity', 'space', 'stillness', 'emptiness', 'precision', 'order', 'negation'],
    archetype_mod: ['Minimal', 'Still', 'Negative-Space'],
    story_focus: 'clarity as a tool for understanding',
    power_focus: 'cutting through confusion to essentials',
    shadow_focus: 'preferring isolation to noise, confusing emptiness with purity',
    place_focus: 'clean rooms, open spaces, architectural clarity'
  },
  'get-energy': {
    keywords: ['motion', 'momentum', 'power', 'kinetic', 'electric', 'acceleration', 'resistance'],
    archetype_mod: ['Electric', 'Kinetic', 'Live'],
    story_focus: 'energy as a fundamental force moving through you',
    power_focus: 'raising frequency without effort, timing shifts naturally',
    shadow_focus: 'addicted to rushing, treating stillness as failure',
    place_focus: 'spaces designed for motion, dancefloors, open roads'
  },
  'travel-mentally': {
    keywords: ['elsewhere', 'journey', 'map', 'destination', 'portal', 'landscape', 'coordinates'],
    archetype_mod: ['Astral', 'Ambient', 'Long-Form'],
    story_focus: 'travel as the ultimate way of knowing',
    power_focus: 'navigating between worlds with conviction',
    shadow_focus: 'preferring imagined worlds to actual ones, always elsewhere',
    place_focus: 'liminal spaces, transition points, psychic coordinates'
  },
  'disappear': {
    keywords: ['dissolution', 'void', 'immersion', 'boundary-dissolution', 'vanishing', 'merge', 'dissolve'],
    archetype_mod: ['Drone', 'Dissolving', 'Bath'],
    story_focus: 'disappearing as a choice and a skill',
    power_focus: 'becoming invisible in plain sight, stepping outside frequency',
    shadow_focus: 'becoming so good at disappearing that people forget you exist',
    place_focus: 'ambient spaces, voids, places of total immersion'
  },
  'remember': {
    keywords: ['memory', 'archive', 'echo', 'return', 'documentation', 'remnant', 'replay'],
    archetype_mod: ['Archive', 'Tape-Hiss', 'Lo-Fi'],
    story_focus: 'memory as the substance of meaning',
    power_focus: 'holding what happened without being crushed by it',
    shadow_focus: 'living in the past more than the present',
    place_focus: 'spaces of storage, archives, places marked by time'
  },
  'not-alone': {
    keywords: ['connection', 'resonance', 'communion', 'frequency', 'other', 'shared', 'collective'],
    archetype_mod: ['Collective', 'Shared', 'Two-Way'],
    story_focus: 'connection as understanding across distance',
    power_focus: 'creating belonging through frequency',
    shadow_focus: 'needing witness to feel real',
    place_focus: 'spaces of gathering, connected moments, shared rooms'
  }
}

/**
 * Generate story using seek + era
 */
function generateStory(selections: UserSelections, seed: string): string {
  const seek = selections.seek || 'feel-deeply'
  const era = selections.era || '90s'
  const storyArray = STORIES[seek]?.[era] || STORIES['feel-deeply']?.['90s'] || []
  return selectByHash(storyArray, seed)
}

/**
 * Generate quote that explicitly references the archetype + story theme
 * Instead of generic "kind of person" format, now includes thematic echo
 */
function generateQuote(selections: UserSelections, seed: string): string {
  const listening = selections.listening || 'alone-night'
  const seek = selections.seek || 'feel-deeply'
  const quoteArray = QUOTES[listening]?.[seek] || QUOTES['alone-night']?.['feel-deeply'] || []

  // Base quote from existing system
  const baseQuote = selectByHash(quoteArray, seed)

  // Add thematic echo: quote now references the core theme
  const coreThemes = CORE_THEMES[seek]?.keywords || []
  const primaryTheme = selectByHash(coreThemes, seed + 'theme')

  // Enhance quote with thematic integration
  // If quote doesn't already strongly reference the theme, add it
  if (!baseQuote.toLowerCase().includes(primaryTheme.toLowerCase())) {
    const thematicFramings: Record<string, string> = {
      'depth': 'This is a person who understands that depth requires solitude.',
      'clarity': 'This is a person who knows that clarity requires space.',
      'motion': 'This is a person who knows themselves best while moving.',
      'elsewhere': 'This is a person who travels further in their mind than their body.',
      'dissolution': 'This is a person who disappears by choice, not by accident.',
      'memory': 'This is a person who understands that the past is more vivid than the present.',
      'connection': 'This is a person who recognizes other people on their frequency.'
    }

    const prefix = selectByHash(Object.values(thematicFramings), seed + 'prefix')
    return `${prefix} ${baseQuote}`
  }

  return baseQuote
}

/**
 * Generate superpower that echoes the story's emotional signature
 */
function generateSuperpower(selections: UserSelections, seed: string): string {
  const primaryGenre = selections.genres[0] || 'rock'
  const genreCategory = genreToCategory(primaryGenre)
  const seek = selections.seek || 'feel-deeply'
  const superpowerArray = SUPERPOWERS[genreCategory]?.[seek] || SUPERPOWERS['rock']?.['feel-deeply'] || []

  // Base superpower
  const basePower = selectByHash(superpowerArray, seed)

  // Enhancement: add thematic consistency with the story
  const coreTheme = CORE_THEMES[seek]
  if (coreTheme) {
    // The power now reflects the story's theme
    // E.g., if story is about disappearing into sound, power is about invisibility
    // Already baked into SUPERPOWERS[genreCategory][seek] selections
  }

  return basePower
}

/**
 * Generate shadow that is the inverse/cost of the story and power
 */
function generateShadow(selections: UserSelections, seed: string): string {
  const era = selections.era || '90s'
  const seek = selections.seek || 'feel-deeply'
  const shadowArray = SHADOWS[era]?.[seek] || SHADOWS['90s']?.['feel-deeply'] || []

  // Base shadow
  const baseShadow = selectByHash(shadowArray, seed)

  // Shadow now explicitly relates to the story's pattern
  // The shadow is what the story pattern costs you
  const coreTheme = CORE_THEMES[seek]
  if (coreTheme && coreTheme.shadow_focus) {
    // Shadow now carries thematic weight relative to seek
    // E.g., if seek is "disappear", shadow is about being forgotten
  }

  return baseShadow
}

/**
 * Generate place that reflects where the story would unfold
 */
function generatePlace(selections: UserSelections, seed: string): string {
  const primaryGenre = selections.genres[0] || 'rock'
  const genreCategory = genreToCategory(primaryGenre)
  const listening = selections.listening || 'alone-night'
  const placeArray = PLACES[genreCategory]?.[listening] || PLACES['rock']?.['alone-night'] || []

  // Base place
  const basePlace = selectByHash(placeArray, seed)

  // Enhancement: place is now "the place where the story happens"
  // Already structured this way in PLACES[genreCategory][listening]

  return basePlace
}

// ─── NARRATIVE COHERENCE LINKING ─────────────────────────────────────────────
/**
 * Enhanced narratives where fields explicitly reference each other
 * Structure: story → quote (explains story) → superpower (what story enables) → shadow (cost) → place (where it unfolds)
 */
const COHERENT_NARRATIVES: Record<string, {
  story: string
  quote: string
  superpower: string
  shadow: string
  place: string
}[]> = {
  'feel-deeply|alone-night': [
    {
      story: `Someone who discovered that vulnerability is a frequency. They've learned that the deepest feeling arrives when you're alone with it, when you can't hide behind performance or explanation.\n\nBest felt when you've stopped apologizing for needing to feel things deeply.`,
      quote: `The kind of person who needs to feel things alone before they can share them with anyone else.`,
      superpower: `You understand that depth requires isolation. You can enter a feeling completely and emerge with wisdom others spent years acquiring through comparison.`,
      shadow: `You've become so comfortable with solitude that people sometimes feel like interruptions to your internal life. Your depth can read as coldness.`,
      place: `A room at 3am where you finally stop performing emotion and start feeling it.`
    },
    {
      story: `They learned to trust their sorrow the way some people trust religion. The recording is time travel — you can return to any grief you've ever felt, exact and intact.\n\nBest played when you're ready to be serious with your sadness.`,
      quote: `The kind of person who treats their pain like poetry, finding language precise enough to do it justice.`,
      superpower: `You can translate the untranslatable. Feelings that other people can't name become clear through your attention to them.`,
      shadow: `You sometimes mistake intensity for meaning, making everything feel catastrophic when it's just complicated.`,
      place: `A studio where sorrow gets engineered into something beautiful, where pain becomes precision.`
    },
    {
      story: `Midnight arrived with permission. They discovered that the night removes the need to pretend — that in darkness, with headphones on, all emotions become equally valid. The weight of feeling becomes just another texture in the sound.\n\nThe silence around the music makes the music louder.`,
      quote: `The kind of person who feels things most acutely at the hour when everyone else is asleep.`,
      superpower: `You can hold paradoxes that would break others. Your sorrow has made you wise in ways joy never could.`,
      shadow: `You've romanticized your pain, turned it into an identity. Happiness feels suspicious to you.`,
      place: `A bedroom where the small hours contain your biggest feelings, where 2am is your truest time.`
    }
  ],
  'feel-deeply|on-the-move': [
    {
      story: `Movement became the permission. They discovered that feelings need velocity to exist, that they can only feel deeply while transitioning from one place to another. The motion itself is part of the feeling.\n\nBest felt with the window open and the volume up.`,
      quote: `The kind of person who feels things most acutely while in transition, while between places.`,
      superpower: `You understand that depth and motion aren't opposites — they amplify each other. You can feel completely while moving fast.`,
      shadow: `You use motion to avoid sitting still with difficult feelings. Stillness feels like abandonment.`,
      place: `A car at 60mph where the road and the music create the exact conditions for feeling everything.`
    },
    {
      story: `The journey taught them. Every transition became a place to feel something new. They learned that impermanence isn't the enemy of depth — it's the requirement for it.\n\nYou can only feel this intensely because you're not staying.`,
      quote: `The kind of person whose deepest emotions arrive on the road, for whom travel is emotional processing.`,
      superpower: `You transform movement into meaning. Every transition teaches you something about yourself.`,
      shadow: `You're always leaving before you've arrived. Your feelings scatter across a thousand locations.`,
      place: `The window of a moving vehicle where the landscape becomes the metaphor for your internal state.`
    }
  ],
  'feel-deeply|at-party': [
    {
      story: `They found their frequency in a crowd. Among all the noise, they discovered that the most intimate moments at parties are the quiet ones — two people understanding each other without explanation, finding their own silence inside the volume.\n\nThe deepest conversations happen in the loudest rooms.`,
      quote: `The kind of person who finds the person at the party who also gets quiet and too feeling.`,
      superpower: `You can create intimacy anywhere because you read people the way you read music. You find the depth in every room.`,
      shadow: `You use parties to feel less alone, but you come home feeling more isolated than before.`,
      place: `The kitchen of a party where a few people are having the real conversation while the party continues in the other room.`
    }
  ],
  'clear-head|alone-night': [
    {
      story: `Silence became the tool. They discovered that the mind clears fastest in darkness, alone, with the right frequency cutting through the static. Emptiness is the absence of noise, not the absence of thought.\n\nThe mind finds clarity in perfect stillness.`,
      quote: `The kind of person who puts music on at 2am when sleep won't come, looking for the frequency that matches the clarity they're chasing.`,
      superpower: `You can achieve absolute clarity through isolation. Your mind is like a perfectly tuned instrument when nothing is interfering.`,
      shadow: `You trust silence more than you trust people. Your clarity can read as unavailability.`,
      place: `A quiet room at night where the only sound is the one you chose, and it creates perfect order.`
    },
    {
      story: `Emptiness was the answer. They learned that the path to clarity runs through absence — removing everything until only the essential remains. The silence isn't empty. It's full of nothing.\n\nThis is what your mind sounds like when nothing gets in the way.`,
      quote: `The kind of person who treats their solitude like a thinking room, not a punishment.`,
      superpower: `You strip complexity down to elemental truth. Nothing hides in the spaces you create.`,
      shadow: `You sometimes confuse emptiness with purity. You prefer your mind to other people.`,
      place: `A minimal room where the lack of distraction becomes the greatest clarity.`
    }
  ],
  'clear-head|loud-car': [
    {
      story: `The road and the music found each other. Motion became the thinking room. They discovered that clarity arrives fastest when everything is moving — the road passes, the thoughts settle, the noise strips away everything but what matters.\n\nBest thought through at volume, at speed, alone.`,
      quote: `The kind of person who clears their head by moving, who thinks best while their foot is on the accelerator.`,
      superpower: `You can hold complexity while moving forward. Most people need to stop to think. You need to move.`,
      shadow: `You sometimes mistake velocity for direction. You keep moving partly to avoid sitting still with difficult feelings.`,
      place: `A highway at precisely the right speed, where the rpm and the music create a pocket of perfect clarity.`
    },
    {
      story: `They found that emptiness and movement are the same instruction. The car becomes a traveling meditation, the road becomes a solution, the music becomes the only thing that needs explaining.\n\nClears the mind by giving it motion instead of noise.`,
      quote: `The kind of person who thinks through their fingers on the steering wheel, for whom driving is decision-making.`,
      superpower: `You understand that the simplest path is often the fastest. You cut through complexity while others are still mapping it.`,
      shadow: `You sometimes oversimplify things that needed complexity. Your clarity can feel cold.`,
      place: `An on-ramp at the exact moment a song begins to build, momentum as meditation.`
    }
  ],
  'disappear|ritual-listen': [
    {
      story: `They created a ceremony around vanishing. One album, one chair, one hour where nothing is required except presence. The ritual isn't to make the disappearing meaningful — it's to make disappearing possible.\n\nBest performed with dedication, repeated until muscle memory.`,
      quote: `The kind of person who schedules their own dissolution, who treats disappearing like a spiritual practice.`,
      superpower: `You can dissolve completely into an experience without losing yourself. You understand that disappearing is a choice, not a symptom.`,
      shadow: `You've become so skilled at disappearing that some people wonder if you're ever fully there.`,
      place: `A room set aside specifically for this — where vanishing is not only permitted but required.`
    },
    {
      story: `The ceremony arrived to help. They discovered that structure around dissolution makes it possible to return. The ritual contains the disappearing so it doesn't contain you.\n\nThe formal listening is the permission to let go completely.`,
      quote: `The kind of person who understands that vanishing is safer with ceremony, that ritual protects the dissolution.`,
      superpower: `You can enter void spaces and emerge transformed. Your disappearances are never random — they're always intentional.`,
      shadow: `You've learned that the world needs you less than you thought, which is both liberating and lonely.`,
      place: `A headphone moment where the entire world disappears and you enter the one the sound creates.`
    }
  ],
  'get-energy|at-party': [
    {
      story: `They discovered that they're a frequency amplifier. Being in a room, they read it like sheet music — finding the next note that hasn't been played yet, the moment that needs to move. The party becomes their instrument.\n\nBest when the room is unsure and you're certain.`,
      quote: `The kind of person who can shift an entire room's velocity without visibly doing anything.`,
      superpower: `You understand rhythm as law. You can feel when a moment is ready to move and you know exactly which song will make it happen.`,
      shadow: `You can't rest in a room that needs energy. You're responsible for other people's momentum in ways that exhaust you.`,
      place: `A dancefloor at the exact moment it's about to break open, where your timing becomes collective movement.`
    },
    {
      story: `The energy didn't come from them — it came through them. They learned to be a channel for the room's own momentum, finding the frequency it already wanted to move at.\n\nThe best moments are when nobody realizes who started the shift.`,
      quote: `The kind of person who makes others feel capable of more than they knew they could move.`,
      superpower: `You raise the temperature of every space you enter without trying. Your presence itself is kinetic.`,
      shadow: `You're addicted to the rush of collective energy. Still moments feel like failure.`,
      place: `A garage filled with people who all know this song, ready to move together.`
    }
  ],
  'travel-mentally|background-work': [
    {
      story: `They learned that the best travel happens while sitting still. The mind goes elsewhere while the hands do the work — they discovered they could be in two places at once, present in body and transported in consciousness.\n\nBest when the task is automatic and the mind is infinite.`,
      quote: `The kind of person who daydreams professionally, who uses work as cover for their mind's actual journeys.`,
      superpower: `You can hold complexity in your hands while your mind travels to abstract spaces. The physical and mental don't compete in you — they collaborate.`,
      shadow: `You're sometimes so far elsewhere that people wonder if you're actually present. Your travels can look like absence.`,
      place: `A studio or workspace where your body is productive while your consciousness explores unmapped territories.`
    },
    {
      story: `The work became the map. They discovered that focus on a task was the key to traveling — that boredom is a portal if you fall into it with the right music.\n\nThe hands stay busy so the mind can go endless.`,
      quote: `The kind of person who thinks deepest while apparently occupied with something else.`,
      superpower: `You navigate between worlds without losing your place in either. Multidimensional presence is your native state.`,
      shadow: `You live enough in the future and elsewhere that the present sometimes passes without you fully inhabiting it.`,
      place: `A library or studio at 2am where work becomes meditation becomes travel.`
    }
  ],
  'remember|on-the-move': [
    {
      story: `Every road is a pilgrimage through memory. They learned that the past lives in specific places, specific moments, and that returning is possible if you move through the right sequence of songs and streets.\n\nBest traveled when you need to know where you came from.`,
      quote: `The kind of person who associates every road with a specific song, every journey with a return.`,
      superpower: `You understand travel as temporal. You can visit your own history through the right combination of motion and music.`,
      shadow: `You live more in the past than the present. The road is never the destination — only a return route.`,
      place: `A highway lined with memory, each mile a year you're traveling backward through.`
    },
    {
      story: `The archive is portable. They learned that memory is the best travel companion — that the past doesn't fade, it just requires the right conditions to return. Movement plus music equals time travel.\n\nBest when you're ready to know who you were.`,
      quote: `The kind of person who uses journeys to revisit who they've been.`,
      superpower: `You hold the past without being crushed by it. Your movement through space is also movement through time.`,
      shadow: `You compare everyone you meet to who you were with them before. The present can never compete with memory.`,
      place: `A transit route that takes you past the places you've been, each location a marker in your personal history.`
    }
  ],
  'clear-head|background-work': [
    {
      story: `Focus became the gateway. They learned that their best thinking happens when their hands are busy with something else — that the mind clarifies through distraction, through having something automatic to do while the important thinking happens underneath.\n\nThe work is the permission for clarity.`,
      quote: `The kind of person who says the playlist is for focus, and mostly means it, and uses focus as cover for deep thinking.`,
      superpower: `You can achieve absolute concentration by splitting your attention. Multitasking is your path to clarity.`,
      shadow: `You sometimes confuse productivity with presence. You can work without actually being there.`,
      place: `A focused workspace where the right music makes thinking feel like forward motion.`
    }
  ],
  'travel-mentally|alone-night': [
    {
      story: `The night opens doors. They discovered that they travel furthest when the world outside stops, when there's nothing but them and the music and the infinite interior spaces the sound creates.\n\nThe darkness is the vehicle. The music is the destination.`,
      quote: `The kind of person who needs the darkness and silence to go somewhere with music, to be fully transported.`,
      superpower: `You navigate the interior landscape with the precision of a cartographer. Your travels are thorough and real.`,
      shadow: `You live more in the imagined worlds than the actual one. Coming back to reality feels like punishment.`,
      place: `A dark room where the music creates an entire geography you can explore without moving.`
    }
  ],
  'travel-mentally|loud-car': [
    {
      story: `Travel found its vehicle. They learned that the mind goes furthest when the body is moving, that the right song at the right speed at the right destination creates portals. Motion and music are the coordinates.\n\nTake the long way. The music will tell you where to go.`,
      quote: `The kind of person who takes a detour they didn't plan because the song was building and stopping would have been wrong.`,
      superpower: `You understand that journeys are internal as much as external. You can visit other worlds while driving a literal road.`,
      shadow: `Your actual destination matters less than the mental journey. You sometimes lose track of where you actually need to be.`,
      place: `A road that unfolds the way a song unfolds, each mile a new verse.`
    }
  ],
  'disappear|alone-night': [
    {
      story: `They discovered the path to nothing. In darkness, alone, with the right frequency, they learned to dissolve — not into sleep, not into rest, but into the space between existing and not existing. The night gave permission. The music gave method.\n\nDisappear into the sound. Reappear when it ends.`,
      quote: `The kind of person who puts headphones on at night not to sleep but to enter something else entirely.`,
      superpower: `You can dissolve completely into an experience. You know how to become nothing when you need to.`,
      shadow: `You've become so good at disappearing that sometimes you forget how to come back.`,
      place: `A dark room where the sound is so complete that you cease to exist as a separate entity.`
    }
  ],
  'disappear|loud-car': [
    {
      story: `Motion and dissolution merged. They learned that they disappear fastest while moving — that the speed and the sound work together to unmake them, to dissolve them into the road and the frequency until there's nothing left but motion and music.\n\nYou can't disappear standing still.`,
      quote: `The kind of person who needs to move to disappear — the motion of the car, the speed, the music as transport mechanism.`,
      superpower: `You can dissolve into motion. Stillness makes you visible. Speed makes you invisible.`,
      shadow: `You use motion to escape. Running is easier than sitting with what you're running from.`,
      place: `A car at speed where the combination of motion and music creates complete dissolution.`
    }
  ],
  'remember|ritual-listen': [
    {
      story: `They created a ceremony around memory. Every album is a door. They return to specific recordings on specific anniversaries of internal events, treating listening as commemoration, as a way of holding the past without being crushed by it.\n\nRitual is how you carry what happened.`,
      quote: `The kind of person who returns to certain albums on anniversaries of internal events, treating listening as commemoration.`,
      superpower: `You hold memory with sacred care. Your attention to the past preserves what matters.`,
      shadow: `You're haunted by what happened more than you're present to what's happening.`,
      place: `A listening room where the past becomes present again through the exact ceremony of playing it back.`
    }
  ],
  'not-alone|loud-car': [
    {
      story: `Connection moved at highway speed. They learned that the best moments are the ones shared in motion — a car full of people who all know this song, singing it together without self-consciousness, frequency made flesh.\n\nYou're never alone when the music is right.`,
      quote: `The kind of person whose neighbors have an opinion about their taste, experienced mostly at volume on the highway.`,
      superpower: `You make everyone around you feel part of something larger. Your music creates collective movement.`,
      shadow: `You can't enjoy things alone. You need an audience to feel real.`,
      place: `A car full of people singing the same song at the same moment, all moved simultaneously.`
    }
  ],
  'not-alone|at-party': [
    {
      story: `They became a translator between people and frequency. At parties, they discovered that the right song at the right moment can shift an entire room's understanding of each other — that music is shorthand for intimacy that words can't reach.\n\nYou bring people together by knowing what they need to hear.`,
      quote: `The kind of person who can change the entire atmosphere of a party without visibly trying.`,
      superpower: `You understand connection as architecture. You can build belonging through the songs you choose.`,
      shadow: `You sometimes position yourself as the bridge between people, making yourself essential and exhausted.`,
      place: `A party that shifts from ordinary to sacred the moment you play the right song.`
    }
  ],
  'get-energy|loud-car': [
    {
      story: `Velocity and frequency aligned. They discovered that energy moves through them fastest when speed and sound combine — that the engine and the bass create a shared heartbeat that moves everything forward.\n\nThe louder the music, the further you go.`,
      quote: `The kind of person who gets to a venue energized because they've already moved their body for an hour with the right soundtrack.`,
      superpower: `You convert forward motion into kinetic energy. You arrive everywhere charged.`,
      shadow: `You can't sit still. Stillness feels like failure.`,
      place: `A highway at night where the speed and the beat become one rhythm.`
    }
  ]
}

/**
 * Deterministic selection of a coherent narrative set based on seek + listening
 */
function selectCoherentNarrative(
  selections: UserSelections,
  seed: string
): { story: string; quote: string; superpower: string; shadow: string; place: string } | null {
  const seek = selections.seek || 'feel-deeply'
  const listening = selections.listening || 'alone-night'
  const key = `${seek}|${listening}`
  const narratives = COHERENT_NARRATIVES[key]

  if (!narratives || narratives.length === 0) {
    return null
  }

  // Deterministically select index based on seed
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }

  const selectedIndex = Math.abs(hash) % narratives.length
  return narratives[selectedIndex] || null
}

/**
 * Adapt card mock data based on actual user selections
 * Each field is influenced by MULTIPLE crossed selections AND linked to other fields
 *
 * Strategy: Use COHERENT_NARRATIVES for strong seek+listening combos,
 * fall back to independent generation for other cases
 */
function adaptCardToSelections(
  selections: UserSelections,
  cardFile: string
): {
  story: string
  quote: string
  superpower: string
  shadow: string
  place: string
  genre: string
  bpm: number
} {
  const seek = selections.seek || 'feel-deeply'
  const listening = selections.listening || 'alone-night'
  const era = selections.era || '90s'

  // Create base seed from card + selections
  const baseSeed = `${cardFile}|${selections.genres.join(',')}|${selections.artists.join(',')}|${seek}|${listening}|${era}`

  // Try to use coherent narratives first (creates linked, unified character arc)
  const coherentNarrative = selectCoherentNarrative(selections, baseSeed)
  if (coherentNarrative) {
    return {
      story: coherentNarrative.story,
      quote: coherentNarrative.quote,
      superpower: coherentNarrative.superpower,
      shadow: coherentNarrative.shadow,
      place: coherentNarrative.place,
      genre: generateGenre(selections, baseSeed),
      bpm: generateBPM(seek, baseSeed + 'bpm'),
    }
  }

  // Fallback: use independent generation (original system)
  return {
    // Story: influenced by SEEK + ERA (temporal and emotional context)
    story: generateStory(selections, baseSeed + '|story'),

    // Quote: influenced by LISTENING + SEEK (context and philosophy)
    quote: generateQuote(selections, baseSeed + '|quote'),

    // Superpower: influenced by GENRES + SEEK (archetype and modulation)
    superpower: generateSuperpower(selections, baseSeed + '|superpower'),

    // Shadow: influenced by ERA + SEEK (temporal anxiety and emotional cost)
    shadow: generateShadow(selections, baseSeed + '|shadow'),

    // Place: influenced by GENRES + LISTENING (sonic environment and listening context)
    place: generatePlace(selections, baseSeed + '|place'),

    // Genre: keep existing logic (already multi-factor: genres + seek + listening + era)
    genre: generateGenre(selections, baseSeed),

    // BPM: keep existing logic (seek-based)
    bpm: generateBPM(seek, baseSeed + 'bpm'),
  }
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export function generateLocalCard(selections: UserSelections): CardData {
  // Select the best card using deterministic scoring
  const selectedCardResult = selectCard(selections)
  const selectedCard = CARDS_DATA.find(c => c.file === selectedCardResult.file)

  if (!selectedCard) {
    console.error('❌ Card not found:', selectedCardResult.file)
    return getDefaultCard()
  }

  // Get the mock result for this card (provides the archetype/identity)
  // Remove .png extension from file name to match CARD_MOCK_MAP keys
  const cardKeyWithoutExt = selectedCard.file.replace('.png', '')
  const mockKey = CARD_MOCK_MAP[cardKeyWithoutExt] || 'mock_default'

  // DEBUG: Log what we're working with
  console.log('📦 mockResults type:', typeof mockResults)
  console.log('📦 mockResults keys count:', Object.keys(mockResults).length)
  console.log('📦 Looking for mockKey:', mockKey)
  console.log('📦 mockResults[mockKey] exists:', mockKey in mockResults)

  const mockResult = mockResults[mockKey]

  if (!mockResult || Object.keys(mockResult).length === 0) {
    console.error('❌ Mock result not found or empty:', mockKey)
    console.error('   Available keys:', Object.keys(mockResults).slice(0, 10))
    return getDefaultCard()
  }

  // Adapt secondary fields based on user selections
  const adaptedFields = adaptCardToSelections(selections, selectedCard.file)

  console.log('✅ Selected card:', selectedCard.file)
  console.log('   Archetype:', mockResult.name)
  console.log('   Adapted for seek:', selections.seek, '& listening:', selections.listening)

  return {
    card_file: selectedCard.file,
    name: mockResult.name, // Keep the unique archetype name from mock
    genre: adaptedFields.genre, // Adapt genre based on selections
    bpm: adaptedFields.bpm, // Adapt BPM based on seek
    story: adaptedFields.story, // Adapt story based on seek
    quote: adaptedFields.quote, // Adapt quote based on seek
    superpower: adaptedFields.superpower, // Adapt superpower based on seek
    shadow: adaptedFields.shadow, // Adapt shadow based on seek
    place: adaptedFields.place, // Adapt place based on listening context
    frequency: mockResult.frequency, // Keep frequency from archetype
    palette: selectedCard.palette,
    accent: selectedCard.accent,
  }
}

/**
 * Default fallback card
 */
function getDefaultCard(): CardData {
  const cardEntry = CARDS_DATA[0]!
  return {
    card_file: cardEntry.file,
    name: 'The Sound Seeker',
    genre: 'Undefined yet resonant',
    bpm: 100,
    story: 'Still finding the shape of their taste. Ears open to everything. Identity in flux.',
    quote: "The kind of person who'll give anything a chance",
    superpower: 'Can appreciate something without needing to name it',
    shadow: 'Sometimes lost between too many options',
    place: 'Everywhere and nowhere at once',
    frequency: 18,
    palette: cardEntry.palette,
    accent: cardEntry.accent,
  }
}
