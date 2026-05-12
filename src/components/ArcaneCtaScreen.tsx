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
      {/* Starfield background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(2px 2px at 20px 30px, #eee, rgba(255,255,255,0.2)),
                       radial-gradient(2px 2px at 60px 70px, #fff, rgba(255,255,255,0.3)),
                       radial-gradient(1px 1px at 50px 50px, #fff, rgba(255,255,255,0.2)),
                       radial-gradient(1px 1px at 130px 80px, #fff, rgba(255,255,255,0.2)),
                       radial-gradient(2px 2px at 90px 10px, #fff, rgba(255,255,255,0.3))`,
          backgroundSize: '200px 200px',
          backgroundPosition: '0 0, 40px 60px, 130px 270px, 70px 100px, 150px 200px',
          opacity: 0.20,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Cosmic rings */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '800px',
          height: '800px',
          transform: 'translate(-50%, -50%) rotateX(75deg)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '20%',
            border: '1.5px solid rgba(201,169,110,0.15)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '10%',
            border: '1.5px solid rgba(201,169,110,0.12)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '0%',
            border: '1.5px solid rgba(201,169,110,0.10)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Hero Visual Section */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40dvh',
          background: 'linear-gradient(to bottom, rgba(201,169,110,0.16) 0%, rgba(201,169,110,0.06) 40%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
          overflow: 'hidden',
        }}
      />

      {/* Background gradient orbs */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          right: '-15%',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '-20%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)',
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
              description: 'Become part of ARCANE: an exclusive community of sonic explorers. Access curated playlists, live events, and premium discoveries.',
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
                backgroundColor: 'rgba(201,169,110,0.14)',
                border: '1.5px solid rgba(201,169,110,0.35)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = 'rgba(201,169,110,0.22)';
                el.style.borderColor = 'rgba(201,169,110,0.50)';
                el.style.transform = 'translateY(-6px)';
                el.style.boxShadow = '0 16px 40px rgba(201,169,110,0.20)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = 'rgba(201,169,110,0.14)';
                el.style.borderColor = 'rgba(201,169,110,0.35)';
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
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
                    color: 'rgba(240,235,224,0.70)',
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
            flexDirection: 'row',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: 620,
            margin: '0 auto 80px',
            flexWrap: 'wrap',
          }}
        >
          {/* Primary CTA */}
          <button
            onMouseEnter={() => setHoveredButton('share')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '18px 56px',
              backgroundColor: 'var(--arcane-gold)',
              border: '2px solid var(--arcane-gold)',
              borderRadius: '8px',
              color: '#0a0a0f',
              cursor: 'pointer',
              transition: 'all 0.35s cubic-bezier(0.32,0.72,0,1)',
              minHeight: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '1 1 auto',
              minWidth: '280px',
              fontWeight: 700,
              boxShadow: hoveredButton === 'share' ? '0 20px 50px rgba(201,169,110,0.40)' : '0 12px 32px rgba(201,169,110,0.25)',
              transform: hoveredButton === 'share' ? 'translateY(-4px)' : 'translateY(0)',
            }}
            onMouseDown={e => {
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.95) translateY(-4px)'
            }}
            onMouseUp={e => {
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-4px)'
            }}
          >
            Save & Share
          </button>

          {/* Secondary CTA */}
          <button
            onClick={onRestart}
            onMouseEnter={() => setHoveredButton('restart')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '18px 56px',
              backgroundColor:
                hoveredButton === 'restart' ? 'rgba(201,169,110,0.25)' : 'rgba(201,169,110,0.15)',
              border: `2px solid ${
                hoveredButton === 'restart' ? 'rgba(201,169,110,0.75)' : 'rgba(201,169,110,0.60)'
              }`,
              borderRadius: '8px',
              color:
                hoveredButton === 'restart' ? 'var(--arcane-gold)' : 'var(--arcane-gold)',
              cursor: 'pointer',
              transition: 'all 0.35s cubic-bezier(0.32,0.72,0,1)',
              minHeight: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '1 1 auto',
              minWidth: '280px',
              fontWeight: 600,
              boxShadow: hoveredButton === 'restart' ? '0 16px 40px rgba(201,169,110,0.28)' : '0 8px 20px rgba(201,169,110,0.15)',
              transform: hoveredButton === 'restart' ? 'translateY(-4px)' : 'translateY(0)',
            }}
            onMouseDown={e => {
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97) translateY(-4px)'
            }}
            onMouseUp={e => {
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-4px)'
            }}
          >
            Another Frequency
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
