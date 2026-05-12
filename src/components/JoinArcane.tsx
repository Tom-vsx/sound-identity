import { motion } from 'framer-motion'
import { useState } from 'react'

interface Props {
  onContinue: () => void
}

export default function JoinArcane({ onContinue }: Props) {
  const [hoveredTile, setHoveredTile] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  }

  const tileVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.32, 0.72, 0, 1],
      },
    },
  }

  const tiles = [
    {
      icon: '✦',
      title: 'Your Archetype',
      description: 'A precision-matched identity, not an algorithm. Your sound decoded in one card.',
    },
    {
      icon: '♪',
      title: 'Instant Discovery',
      description: 'Curated recommendations that match your frequency. Music that feels like it was made for you.',
    },
    {
      icon: '∞',
      title: 'Eternal Access',
      description: 'Your card, your identity, your frequency — forever. Share it, revisit it, evolve with it.',
    },
    {
      icon: '◆',
      title: 'Premium Frequency',
      description: 'Join the ARCANE collective. Access exclusive features, playlists, and experiences.',
    },
  ]

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: '#0a0a0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient elements */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-20%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-25%',
          right: '-10%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: '920px',
          width: '100%',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <motion.div variants={tileVariants} style={{ textAlign: 'center', marginBottom: 64 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--arcane-gold)',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span>✦</span>
            Welcome to ARCANE
            <span>✦</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 8vw, 56px)',
              fontWeight: 300,
              color: 'rgba(240,235,224,0.98)',
              margin: 0,
              marginBottom: 16,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            What Comes Next
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'clamp(14px, 2.5vw, 16px)',
              color: 'rgba(240,235,224,0.58)',
              lineHeight: 1.7,
              margin: 0,
              maxWidth: 520,
              margin: '0 auto',
            }}
          >
            Your frequency has been revealed. Now unlock the full ARCANE experience — exclusive features, curated discoveries, and a community of sonic explorers like you.
          </p>
        </motion.div>

        {/* Tiles Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
            marginBottom: 64,
            width: '100%',
          }}
        >
          {tiles.map((tile, idx) => (
            <motion.button
              key={idx}
              variants={tileVariants}
              onMouseEnter={() => setHoveredTile(idx)}
              onMouseLeave={() => setHoveredTile(null)}
              onClick={onContinue}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <motion.div
                animate={{
                  backgroundColor:
                    hoveredTile === idx
                      ? 'rgba(201,169,110,0.12)'
                      : 'rgba(201,169,110,0.04)',
                  borderColor:
                    hoveredTile === idx
                      ? 'rgba(201,169,110,0.35)'
                      : 'rgba(201,169,110,0.15)',
                  transform: hoveredTile === idx ? 'translateY(-4px)' : 'translateY(0)',
                }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                style={{
                  padding: 'clamp(24px, 5vw, 32px)',
                  border: '1px solid rgba(201,169,110,0.15)',
                  borderRadius: 16,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    color: 'var(--arcane-gold)',
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {tile.icon}
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 16,
                    fontWeight: 400,
                    color: 'rgba(240,235,224,0.92)',
                    margin: 0,
                    letterSpacing: '-0.005em',
                  }}
                >
                  {tile.title}
                </h3>

                <p
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: 'rgba(240,235,224,0.62)',
                    margin: 0,
                    marginTop: 4,
                  }}
                >
                  {tile.description}
                </p>
              </motion.div>
            </motion.button>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          variants={tileVariants}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <button
            onClick={onContinue}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)'
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
            }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '16px 48px',
              backgroundColor: 'var(--arcane-gold)',
              border: '1px solid var(--arcane-gold)',
              borderRadius: '999px',
              color: '#0a0a0f',
              cursor: 'pointer',
              transition: 'all 0.35s cubic-bezier(0.32,0.72,0,1)',
              minHeight: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
            }}
          >
            Enter ARCANE
          </button>

          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 12,
              color: 'rgba(240,235,224,0.45)',
              margin: 0,
              textAlign: 'center',
              maxWidth: 400,
            }}
          >
            Your sound identity is now part of the ARCANE frequency. Explore what's possible when music truly understands you.
          </p>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
