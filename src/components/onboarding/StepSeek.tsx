import { SEEK_OPTIONS } from '../../data/onboardingData'

interface Props {
  selected: string
  onChange: (id: string) => void
}

function SeekVisual({ id, active }: { id: string; active: boolean }) {
  return (
    <div
      style={{ position: 'relative', width: '100%', height: 60, overflow: 'hidden' }}
      aria-hidden="true"
    >
      {id === 'clear-head' && (
        <div className={`sv-clear${active ? ' sv-active' : ''}`}>
          <div className="sv-ring sv-cr1" /><div className="sv-ring sv-cr2" /><div className="sv-ring sv-cr3" />
        </div>
      )}
      {id === 'feel-deeply' && (
        <div className={`sv-feel${active ? ' sv-active' : ''}`}>
          <div className="sv-glow sv-g1" /><div className="sv-glow sv-g2" />
        </div>
      )}
      {id === 'get-energy' && (
        <div className={`sv-energy${active ? ' sv-active' : ''}`}>
          <div className="sv-bolt" />
          <div className="sv-ray sv-ray1" /><div className="sv-ray sv-ray2" /><div className="sv-ray sv-ray3" />
        </div>
      )}
      {id === 'travel-mentally' && (
        <div className={`sv-travel${active ? ' sv-active' : ''}`}>
          <div className="sv-planet" />
          <div className="sv-orbit" />
          <div className="sv-dot sv-od" />
        </div>
      )}
      {id === 'disappear' && (
        <div className={`sv-disappear${active ? ' sv-active' : ''}`}>
          <div className="sv-fade sv-f1" /><div className="sv-fade sv-f2" /><div className="sv-fade sv-f3" />
        </div>
      )}
      {id === 'remember' && (
        <div className={`sv-remember${active ? ' sv-active' : ''}`}>
          <div className="sv-echo sv-e1" /><div className="sv-echo sv-e2" /><div className="sv-echo sv-e3" />
          <div className="sv-source" />
        </div>
      )}
      {id === 'not-alone' && (
        <div className={`sv-notalone${active ? ' sv-active' : ''}`}>
          <div className="sv-nd sv-nd1" /><div className="sv-nd sv-nd2" /><div className="sv-nd sv-nd3" />
          <div className="sv-link sv-lk1" /><div className="sv-link sv-lk2" />
        </div>
      )}

      <style>{`
        .sv-clear { position:absolute;inset:0;display:flex;align-items:center;justify-content:center; }
        .sv-ring { position:absolute;border-radius:50%;border:0.5px solid rgba(201,169,110,0.26); }
        .sv-cr1{width:16px;height:16px} .sv-cr2{width:30px;height:30px} .sv-cr3{width:46px;height:46px}
        .sv-active .sv-ring { border-color:rgba(201,169,110,0.48);animation:clearExpand 2.4s ease-out infinite; }
        .sv-active .sv-cr2{animation-delay:0.4s!important} .sv-active .sv-cr3{animation-delay:0.8s!important}
        @keyframes clearExpand { 0%{opacity:0.25;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} 100%{opacity:0.25;transform:scale(1.1)} }

        .sv-feel { position:absolute;inset:0;display:flex;align-items:center;justify-content:center; }
        .sv-glow { position:absolute;border-radius:50%;filter:blur(10px); }
        .sv-g1 { width:28px;height:28px;background:rgba(220,80,80,0.30); }
        .sv-g2 { width:16px;height:16px;background:rgba(220,80,80,0.50); }
        .sv-active .sv-glow { animation:heartPulse 1.8s ease-in-out infinite; }
        .sv-active .sv-g2 { animation-delay:0.2s!important; }
        @keyframes heartPulse { 0%,100%{transform:scale(0.9);opacity:0.55} 50%{transform:scale(1.2);opacity:1} }

        .sv-energy { position:absolute;inset:0;display:flex;align-items:center;justify-content:center; }
        .sv-bolt { width:2px;height:28px;background:linear-gradient(to bottom,rgba(240,200,60,0.75),rgba(240,200,60,0.15));border-radius:1px;transform:rotate(15deg); }
        .sv-active .sv-bolt { animation:boltFlash 1.2s ease-in-out infinite; }
        .sv-ray { position:absolute;height:1px;background:rgba(240,200,60,0.40);border-radius:1px;width:14px; }
        .sv-ray1{transform:rotate(0deg) translateX(12px)} .sv-ray2{transform:rotate(60deg) translateX(12px)} .sv-ray3{transform:rotate(-60deg) translateX(12px)}
        .sv-active .sv-ray { opacity:1;animation:rayFlash 1.2s ease-in-out infinite; }
        @keyframes boltFlash { 0%,100%{opacity:0.45} 50%{opacity:1} }
        @keyframes rayFlash { 0%,100%{opacity:0.25;transform-origin:left center} 50%{opacity:0.85} }

        .sv-travel { position:absolute;inset:0;display:flex;align-items:center;justify-content:center; }
        .sv-planet { width:12px;height:12px;border-radius:50%;background:rgba(100,140,220,0.42);border:0.5px solid rgba(100,140,220,0.60); }
        .sv-orbit { position:absolute;width:36px;height:22px;border-radius:50%;border:0.5px solid rgba(100,140,220,0.26);transform:rotateX(55deg); }
        .sv-active .sv-orbit { border-color:rgba(100,140,220,0.50);animation:orbitSpin 3s linear infinite; }
        .sv-od { width:4px;height:4px;border-radius:50%;background:rgba(240,235,224,0.70);position:absolute; }
        .sv-active .sv-od { animation:dotOrbit 3s linear infinite; }
        @keyframes orbitSpin { from{transform:rotateX(55deg) rotateZ(0deg)} to{transform:rotateX(55deg) rotateZ(360deg)} }
        @keyframes dotOrbit { 0%{transform:translateX(18px) translateY(-4px)} 50%{transform:translateX(-18px) translateY(4px)} 100%{transform:translateX(18px) translateY(-4px)} }

        .sv-disappear { position:absolute;inset:0;display:flex;align-items:center;justify-content:center; }
        .sv-fade { position:absolute;border-radius:50%;background:rgba(201,169,110,0.20); }
        .sv-f1{width:40px;height:40px} .sv-f2{width:24px;height:24px} .sv-f3{width:10px;height:10px}
        .sv-active .sv-fade { animation:fadeOut 2s ease-in-out infinite; }
        .sv-active .sv-f2{animation-delay:0.3s!important} .sv-active .sv-f3{animation-delay:0.6s!important}
        @keyframes fadeOut { 0%{opacity:0.70} 100%{opacity:0;transform:scale(1.4)} }

        .sv-remember { position:absolute;inset:0;display:flex;align-items:center;justify-content:center; }
        .sv-echo { position:absolute;border-radius:50%;border:0.5px solid rgba(201,169,110,0.26); }
        .sv-e1{width:48px;height:48px} .sv-e2{width:32px;height:32px} .sv-e3{width:18px;height:18px}
        .sv-active .sv-echo { border-color:rgba(201,169,110,0.50);animation:echoRipple 2.4s ease-out infinite; }
        .sv-active .sv-e2{animation-delay:0.5s!important} .sv-active .sv-e3{animation-delay:1s!important}
        .sv-source { width:6px;height:6px;border-radius:50%;background:rgba(201,169,110,0.60);position:absolute; }
        .sv-active .sv-source { background:#c9a96e;box-shadow:0 0 6px rgba(201,169,110,0.65); }
        @keyframes echoRipple { 0%{opacity:0.85;transform:scale(0.7)} 100%{opacity:0;transform:scale(1.2)} }

        .sv-notalone { position:absolute;inset:0;display:flex;align-items:center;justify-content:center; }
        .sv-nd { position:absolute;width:7px;height:7px;border-radius:50%;background:rgba(201,169,110,0.38);border:0.5px solid rgba(201,169,110,0.52); }
        .sv-nd1{transform:translate(-20px,-8px)} .sv-nd2{transform:translate(20px,-8px)} .sv-nd3{transform:translate(0,14px)}
        .sv-active .sv-nd { background:rgba(201,169,110,0.72);animation:nodePulse 2s ease-in-out infinite; }
        .sv-active .sv-nd2{animation-delay:0.3s!important} .sv-active .sv-nd3{animation-delay:0.6s!important}
        .sv-link { position:absolute;height:0.5px;background:rgba(201,169,110,0.26);transform-origin:left center; }
        .sv-lk1 { width:40px;transform:translate(-20px,-8px) rotate(0deg); }
        .sv-lk2 { width:28px;transform:translate(-8px,8px) rotate(-55deg); }
        .sv-active .sv-link { background:rgba(201,169,110,0.55);animation:linkPulse 2s ease-in-out infinite; }
        @keyframes nodePulse { 0%,100%{transform:translate(-20px,-8px) scale(1)} 50%{transform:translate(-20px,-8px) scale(1.3)} }
        @keyframes linkPulse { 0%,100%{opacity:0.40} 50%{opacity:0.90} }
      `}</style>
    </div>
  )
}

export default function StepSeek({ selected, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="What do you seek in music"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 8,
      }}
    >
      {SEEK_OPTIONS.map((opt, i) => {
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
            <SeekVisual id={opt.id} active={isSelected} />
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
