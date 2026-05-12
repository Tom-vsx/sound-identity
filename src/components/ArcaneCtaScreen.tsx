import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  onRestart: () => void
}

export default function ArcaneCtaScreen({ onRestart }: Props) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.32, 0.72, 0, 1],
      },
    },
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: '#0a0a0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Hero Visual Section */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40dvh',
          background: 'linear-gradient(to bottom, rgba(201,169,110,0.12) 0%, rgba(201,169,110,0.04) 40%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      />

      {/* Background gradient orbs */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          right: '-15%',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,169,110,0.10) 0%, transparent 75%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '-20%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 75%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: '760px',
          width: '100%',
          textAlign: 'center',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '64px',
          paddingBottom: '80px',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
      >
        {/* ARCANE Logo */}
        <motion.div variants={itemVariants}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--arcane-gold)',
              marginBottom: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '18px' }}>✦</span>
            ARCANE
            <span style={{ fontSize: '18px' }}>✦</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 variants={itemVariants}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 9vw, 72px)',
              fontWeight: 300,
              color: 'rgba(240,235,224,0.98)',
              margin: 0,
              marginBottom: '28px',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Your Sound<br />
            <span
              style={{
                color: 'var(--arcane-gold)',
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}
            >
              Unlocked
            </span>
          </div>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'clamp(15px, 3.5vw, 18px)',
            color: 'rgba(240,235,224,0.65)',
            lineHeight: 1.8,
            margin: 0,
            marginBottom: '28px',
            fontStyle: 'italic',
            maxWidth: 640,
          }}
        >
          You've discovered who you are as a listener. A precision-matched identity, decoded into one sacred card. Now comes the journey.
        </motion.p>

        {/* Secondary text */}
        <motion.p
          variants={itemVariants}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--arcane-gold)',
            margin: 0,
            marginBottom: '64px',
          }}
        >
          ✦ Your frequency awaits ✦
        </motion.p>

        {/* Benefits Bento Grid */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 24,
            width: '100%',
            maxWidth: 700,
            margin: '0 auto 72px',
          }}
        >
          {[
            {
              label: 'Saved Forever',
              description: 'Your identity card is permanently stored. Access it anytime, revisit your frequency, and watch how your taste evolves.',
              icon: '◆',
              colSpan: 1,
            },
            {
              label: 'Fully Shareable',
              description: 'Share your ARCANE card with friends. Start conversations about music taste and discover who matches your frequency.',
              icon: '✦',
              colSpan: 1,
            },
            {
              label: 'Endlessly Evolving',
              description: 'Your frequency adapts with you. Revisit the quiz anytime to capture your current musical journey and growth.',
              icon: '∞',
              colSpan: 2,
            },
            {
              label: 'Join the Collective',
              description: 'Become part of ARCANE—an exclusive community of sonic explorers. Access curated playlists, live events, and premium discoveries.',
              icon: '♪',
              colSpan: 1,
            },
            {
              label: 'Premium Frequency',
              description: 'Unlock advanced features: detailed genre breakdowns, artist affinities, era analysis, and personalized recommendations.',
              icon: '✧',
              colSpan: 1,
            },
          ].map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + idx * 0.08, duration: 0.5 }}
              style={{
                gridColumn: `span ${benefit.colSpan}`,
                padding: '32px',
                borderRadius: 16,
                backgroundColor: 'rgba(201,169,110,0.06)',
                border: '1px solid rgba(201,169,110,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = 'rgba(201,169,110,0.12)';
                el.style.borderColor = 'rgba(201,169,110,0.30)';
                el.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = 'rgba(201,169,110,0.06)';
                el.style.borderColor = 'rgba(201,169,110,0.15)';
                el.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  color: 'var(--arcane-gold)',
                  lineHeight: 1,
                }}
              >
                {benefit.icon}
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 18,
                    fontWeight: 400,
                    color: 'rgba(240,235,224,0.95)',
                    margin: '0 0 8px 0',
                    letterSpacing: '-0.005em',
                  }}
                >
                  {benefit.label}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 13,
                    color: 'rgba(240,235,224,0.65)',
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            alignItems: 'center',
            width: '100%',
            maxWidth: 360,
            margin: '0 auto 80px',
          }}
        >
          {/* Primary CTA */}
          <button
            onMouseEnter={() => setHoveredButton('share')}
            onMouseLeave={() => setHoveredButton(null)}
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
              width: '100%',
              fontWeight: 600,
              boxShadow: hoveredButton === 'share' ? '0 12px 32px rgba(201,169,110,0.25)' : '0 4px 16px rgba(201,169,110,0.12)',
              transform: hoveredButton === 'share' ? 'translateY(-2px)' : 'translateY(0)',
            }}
            onMouseDown={e => {
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96) translateY(-2px)'
            }}
            onMouseUp={e => {
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
            }}
          >
            Save & Share My Arcane
          </button>

          {/* Secondary CTA */}
          <button
            onClick={onRestart}
            onMouseEnter={() => setHoveredButton('restart')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '16px 48px',
              backgroundColor:
                hoveredButton === 'restart' ? 'rgba(201,169,110,0.10)' : 'transparent',
              border: `1px solid ${
                hoveredButton === 'restart' ? 'rgba(201,169,110,0.40)' : 'rgba(201,169,110,0.20)'
              }`,
              borderRadius: '999px',
              color:
                hoveredButton === 'restart' ? 'rgba(201,169,110,0.90)' : 'rgba(201,169,110,0.60)',
              cursor: 'pointer',
              transition: 'all 0.35s cubic-bezier(0.32,0.72,0,1)',
              minHeight: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
            onMouseDown={e => {
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)'
            }}
            onMouseUp={e => {
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
            }}
          >
            Discover Another Frequency
          </button>
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
