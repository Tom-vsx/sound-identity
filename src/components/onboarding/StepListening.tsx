import { LISTENING_OPTIONS } from '../../data/onboardingData'

interface Props {
  selected: string
  onChange: (id: string) => void
}

function ListenVisual({ id, active }: { id: string; active: boolean }) {
  return (
    <div
      style={{ position: 'relative', width: '100%', height: 60, overflow: 'hidden' }}
      aria-hidden="true"
    >
      {id === 'alone-night' && (
        <div className={`lv-night${active ? ' lv-active' : ''}`}>
          <div className="lv-moon" />
          <div className="lv-star lv-s1" /><div className="lv-star lv-s2" />
          <div className="lv-star lv-s3" /><div className="lv-star lv-s4" />
          <div className="lv-star lv-s5" /><div className="lv-star lv-s6" />
        </div>
      )}
      {id === 'loud-car' && (
        <div className={`lv-car${active ? ' lv-active' : ''}`}>
          <div className="lv-road" />
          <div className="lv-streak lv-st1" /><div className="lv-streak lv-st2" />
          <div className="lv-streak lv-st3" />
        </div>
      )}
      {id === 'background-work' && (
        <div className={`lv-work${active ? ' lv-active' : ''}`}>
          <div className="lv-grid" />
          <div className="lv-cursor" />
        </div>
      )}
      {id === 'at-party' && (
        <div className={`lv-party${active ? ' lv-active' : ''}`}>
          <div className="lv-light lv-l1" /><div className="lv-light lv-l2" />
          <div className="lv-light lv-l3" /><div className="lv-light lv-l4" />
        </div>
      )}
      {id === 'on-the-move' && (
        <div className={`lv-move${active ? ' lv-active' : ''}`}>
          <div className="lv-wave lv-w1" /><div className="lv-wave lv-w2" />
          <div className="lv-wave lv-w3" />
        </div>
      )}
      {id === 'ritual-listen' && (
        <div className={`lv-ritual${active ? ' lv-active' : ''}`}>
          <div className="lv-ring lv-r1" /><div className="lv-ring lv-r2" />
          <div className="lv-ring lv-r3" /><div className="lv-dot" />
        </div>
      )}
      {id === 'shared-moment' && (
        <div className={`lv-shared${active ? ' lv-active' : ''}`}>
          <div className="lv-node lv-n1" /><div className="lv-node lv-n2" />
          <div className="lv-bridge" />
        </div>
      )}
      <style>{`
        .lv-night { position:absolute;inset:0;display:flex;align-items:center;justify-content:center; }
        .lv-moon { width:18px;height:18px;border-radius:50%;background:rgba(240,235,224,0.18);border:0.5px solid rgba(240,235,224,0.28); }
        .lv-active .lv-moon { background:rgba(240,235,224,0.36);border-color:rgba(240,235,224,0.52); }
        .lv-star { position:absolute;width:2px;height:2px;border-radius:50%;background:rgba(240,235,224,0.42); }
        .lv-active .lv-star { animation:starTwinkle 2s ease-in-out infinite; }
        .lv-s1{top:12px;left:20%} .lv-s2{top:8px;left:55%} .lv-s3{top:20px;right:18%}
        .lv-s4{bottom:14px;left:30%} .lv-s5{bottom:8px;right:30%} .lv-s6{top:28px;left:45%}
        @keyframes starTwinkle { 0%,100%{opacity:0.42} 50%{opacity:1} }
        .lv-s2 { animation-delay:0.4s!important } .lv-s4 { animation-delay:0.8s!important } .lv-s6 { animation-delay:1.2s!important }

        .lv-car { position:absolute;inset:0; }
        .lv-road { position:absolute;bottom:20px;left:0;right:0;height:1px;background:linear-gradient(to right,transparent,rgba(201,169,110,0.28),transparent); }
        .lv-streak { position:absolute;height:1px;background:linear-gradient(to right,transparent,rgba(240,235,224,0.45),transparent);border-radius:1px; }
        .lv-st1 { width:45%;top:28px;left:-100%;animation:carStreak 1.2s linear infinite; }
        .lv-st2 { width:30%;top:38px;left:-100%;animation:carStreak 1.2s linear infinite 0.4s; }
        .lv-st3 { width:55%;top:18px;left:-100%;animation:carStreak 1.5s linear infinite 0.2s; }
        .lv-active .lv-streak { opacity:1 } .lv-streak { opacity:0.35 }
        @keyframes carStreak { from{left:-60%} to{left:110%} }

        .lv-work { position:absolute;inset:0; }
        .lv-grid { position:absolute;inset:0;background-image:linear-gradient(rgba(201,169,110,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(201,169,110,0.09) 1px,transparent 1px);background-size:12px 12px; }
        .lv-cursor { position:absolute;bottom:22px;left:50%;transform:translateX(-50%);width:2px;height:14px;background:rgba(201,169,110,0.65);border-radius:1px; }
        .lv-active .lv-cursor { animation:cursorBlink 1s step-end infinite; }
        @keyframes cursorBlink { 50%{opacity:0} }

        .lv-party { position:absolute;inset:0; }
        .lv-light { position:absolute;width:20px;height:20px;border-radius:50%;filter:blur(8px);opacity:0.45; }
        .lv-active .lv-light { opacity:0.72;animation:lightPulse 1.6s ease-in-out infinite; }
        .lv-l1{background:#e85d5d;top:10px;left:20%} .lv-l2{background:#5d8ae8;top:30px;right:20%}
        .lv-l3{background:#e8d05d;bottom:10px;left:40%} .lv-l4{background:#5de885;top:15px;right:35%}
        .lv-l2{animation-delay:0.4s!important} .lv-l3{animation-delay:0.8s!important} .lv-l4{animation-delay:1.2s!important}
        @keyframes lightPulse { 0%,100%{transform:scale(1);opacity:0.55} 50%{transform:scale(1.4);opacity:0.85} }

        .lv-move { position:absolute;inset:0;overflow:hidden; }
        .lv-wave { position:absolute;left:0;right:0;height:1px;border-radius:1px; }
        .lv-w1 { top:22px;background:linear-gradient(to right,transparent,rgba(201,169,110,0.58),transparent);animation:waveSlide 1.8s ease-in-out infinite; }
        .lv-w2 { top:32px;background:linear-gradient(to right,transparent,rgba(201,169,110,0.36),transparent);animation:waveSlide 1.8s ease-in-out infinite 0.3s; }
        .lv-w3 { top:42px;background:linear-gradient(to right,transparent,rgba(201,169,110,0.20),transparent);animation:waveSlide 1.8s ease-in-out infinite 0.6s; }
        .lv-move:not(.lv-active) .lv-wave { opacity:0.45 }
        @keyframes waveSlide { 0%,100%{transform:translateX(-10%)} 50%{transform:translateX(10%)} }

        .lv-ritual { position:absolute;inset:0;display:flex;align-items:center;justify-content:center; }
        .lv-ring { position:absolute;border-radius:50%;border:0.5px solid rgba(201,169,110,0.26); }
        .lv-r1{width:48px;height:48px} .lv-r2{width:32px;height:32px} .lv-r3{width:18px;height:18px}
        .lv-active .lv-ring { border-color:rgba(201,169,110,0.52);animation:ringPulse 3s ease-in-out infinite; }
        .lv-active .lv-r2{animation-delay:0.5s!important} .lv-active .lv-r3{animation-delay:1s!important}
        @keyframes ringPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        .lv-dot { width:5px;height:5px;border-radius:50%;background:rgba(201,169,110,0.65);position:absolute; }
        .lv-active .lv-dot { background:#c9a96e;box-shadow:0 0 8px #c9a96e; }

        .lv-shared { position:absolute;inset:0;display:flex;align-items:center;justify-content:center; }
        .lv-node { width:8px;height:8px;border-radius:50%;position:absolute;background:rgba(201,169,110,0.40);border:0.5px solid rgba(201,169,110,0.55); }
        .lv-n1{transform:translateX(-22px)} .lv-n2{transform:translateX(22px)}
        .lv-active .lv-node { background:rgba(201,169,110,0.75);box-shadow:0 0 10px rgba(201,169,110,0.40); }
        .lv-bridge { position:absolute;width:36px;height:1px;background:linear-gradient(to right,rgba(201,169,110,0.40),rgba(201,169,110,0.75),rgba(201,169,110,0.40)); }
        .lv-active .lv-bridge { animation:bridgePulse 2s ease-in-out infinite; }
        @keyframes bridgePulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>
    </div>
  )
}

export default function StepListening({ selected, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="How do you listen"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 8,
      }}
    >
      {LISTENING_OPTIONS.map((opt, i) => {
        const isSelected = selected === opt.id
        return (
          <button
            key={opt.id}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.id)}
            style={{
              textAlign: 'left',
              background: isSelected
                ? 'rgba(201,169,110,0.09)'
                : 'rgba(255,255,255,0.025)',
              border: `1px solid ${isSelected
                ? 'rgba(201,169,110,0.55)'
                : 'rgba(255,255,255,0.09)'}`,
              borderRadius: 10,
              padding: '12px 12px 14px',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.32,0.72,0,1)',
            }}
            onMouseEnter={e => {
              if (isSelected) return
              const b = e.currentTarget as HTMLButtonElement
              b.style.borderColor = 'rgba(201,169,110,0.28)'
              b.style.background = 'rgba(255,255,255,0.04)'
            }}
            onMouseLeave={e => {
              if (isSelected) return
              const b = e.currentTarget as HTMLButtonElement
              b.style.borderColor = 'rgba(255,255,255,0.09)'
              b.style.background = 'rgba(255,255,255,0.025)'
            }}
          >
            <ListenVisual id={opt.id} active={isSelected} />
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 8 }}>
              <span
                aria-hidden="true"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: isSelected
                    ? 'rgba(201,169,110,0.75)'
                    : 'rgba(255,255,255,0.32)',
                  letterSpacing: '0.05em',
                  flexShrink: 0,
                  paddingTop: 2,
                  transition: 'color 0.2s',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 14,
                    fontWeight: 500,
                    color: isSelected
                      ? 'rgba(240,235,224,0.95)'
                      : 'rgba(240,235,224,0.72)',
                    lineHeight: 1.3,
                    marginBottom: 4,
                    transition: 'color 0.2s',
                  }}
                >
                  {opt.label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 12,
                    color: isSelected
                      ? 'rgba(201,169,110,0.72)'
                      : 'rgba(240,235,224,0.44)',
                    lineHeight: 1.45,
                    transition: 'color 0.2s',
                  }}
                >
                  {opt.sub}
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
