import { TIME_OPTIONS } from '../../data/onboardingData'

interface Props {
  selected: string
  onChange: (value: string) => void
}

function TimeVisual({ id, active }: { id: string; active: boolean }) {
  return (
    <div
      style={{ position: 'relative', width: '100%', height: 60, overflow: 'hidden' }}
      aria-hidden="true"
    >
      {id === 'early-morning' && (
        <div className={`tv-morning${active ? ' tv-active' : ''}`}>
          <div className="tv-sky" />
          <div className="tv-sun" />
          <div className="tv-ray tv-ray1" /><div className="tv-ray tv-ray2" />
          <div className="tv-ray tv-ray3" />
        </div>
      )}
      {id === 'afternoon' && (
        <div className={`tv-afternoon${active ? ' tv-active' : ''}`}>
          <div className="tv-sky-bright" />
          <div className="tv-sun-bright" />
          <div className="tv-ray-bright tv-rb1" /><div className="tv-ray-bright tv-rb2" />
          <div className="tv-ray-bright tv-rb3" /><div className="tv-ray-bright tv-rb4" />
        </div>
      )}
      {id === 'evening' && (
        <div className={`tv-evening${active ? ' tv-active' : ''}`}>
          <div className="tv-sky-warm" />
          <div className="tv-sun-warm" />
          <div className="tv-ray-warm tv-rw1" /><div className="tv-ray-warm tv-rw2" />
          <div className="tv-ray-warm tv-rw3" />
        </div>
      )}
      {id === 'late-night' && (
        <div className={`tv-night${active ? ' tv-active' : ''}`}>
          <div className="tv-moon" />
          <div className="tv-glow" />
          <div className="tv-star tv-st1" /><div className="tv-star tv-st2" />
          <div className="tv-star tv-st3" /><div className="tv-star tv-st4" />
        </div>
      )}
      <style>{`
        .tv-morning { position:absolute;inset:0;display:flex;align-items:center;justify-content:center; }
        .tv-sky { position:absolute;inset:0;background:linear-gradient(180deg,rgba(140,160,200,0.15) 0%,rgba(160,180,220,0.08) 100%); }
        .tv-sun { position:absolute;width:16px;height:16px;border-radius:50%;background:rgba(240,160,100,0.5);left:30%;top:30%; }
        .tv-active .tv-sun { animation:sunRise 2.5s ease-in-out infinite;background:rgba(240,160,100,0.7); }
        .tv-ray { position:absolute;height:1px;background:linear-gradient(to right,transparent,rgba(240,160,100,0.35),transparent);width:24px; }
        .tv-ray1 { left:24%;top:30%;width:28px; } .tv-ray2 { left:28%;top:40%;width:20px; } .tv-ray3 { left:32%;top:20%;width:24px; }
        .tv-active .tv-ray { background:linear-gradient(to right,transparent,rgba(240,160,100,0.55),transparent); }
        @keyframes sunRise { 0%{transform:translateY(8px);opacity:0.4} 50%{opacity:0.75} 100%{transform:translateY(0);opacity:0.5} }

        .tv-afternoon { position:absolute;inset:0;display:flex;align-items:center;justify-content:center; }
        .tv-sky-bright { position:absolute;inset:0;background:linear-gradient(180deg,rgba(100,150,220,0.12) 0%,rgba(180,200,240,0.06) 100%); }
        .tv-sun-bright { position:absolute;width:18px;height:18px;border-radius:50%;background:rgba(250,190,80,0.65);box-shadow:0 0 12px rgba(250,190,80,0.3); }
        .tv-active .tv-sun-bright { animation:sunGlow 2s ease-in-out infinite;box-shadow:0 0 16px rgba(250,190,80,0.5); }
        .tv-ray-bright { position:absolute;width:2px;height:12px;background:rgba(250,190,80,0.4);border-radius:1px; }
        .tv-rb1 { top:16px;left:50%;transform:translateX(-50%); } .tv-rb2 { bottom:16px;left:50%;transform:translateX(-50%); }
        .tv-rb3 { left:16px;top:50%;transform:translateY(-50%); } .tv-rb4 { right:16px;top:50%;transform:translateY(-50%); }
        .tv-active .tv-ray-bright { opacity:0.75;animation:rayFlicker 1.5s ease-in-out infinite; }
        .tv-rb2 { animation-delay:0.3s!important } .tv-rb4 { animation-delay:0.6s!important }
        @keyframes sunGlow { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        @keyframes rayFlicker { 0%,100%{opacity:0.45} 50%{opacity:0.75} }

        .tv-evening { position:absolute;inset:0;display:flex;align-items:center;justify-content:center; }
        .tv-sky-warm { position:absolute;inset:0;background:linear-gradient(180deg,rgba(180,100,80,0.18) 0%,rgba(140,80,60,0.1) 100%); }
        .tv-sun-warm { position:absolute;width:17px;height:17px;border-radius:50%;background:rgba(210,100,50,0.65); }
        .tv-active .tv-sun-warm { animation:sunSet 2.8s ease-in-out infinite;background:rgba(210,100,50,0.75); }
        .tv-ray-warm { position:absolute;height:1px;background:linear-gradient(to right,transparent,rgba(210,100,50,0.4),transparent);width:26px; }
        .tv-rw1 { left:26%;top:32%;width:30px; } .tv-rw2 { left:30%;top:42%;width:22px; } .tv-rw3 { left:34%;top:22%;width:26px; }
        .tv-active .tv-ray-warm { background:linear-gradient(to right,transparent,rgba(210,100,50,0.6),transparent); }
        @keyframes sunSet { 0%{transform:translateY(-6px);opacity:0.55} 50%{opacity:0.8} 100%{transform:translateY(6px);opacity:0.5} }

        .tv-night { position:absolute;inset:0;display:flex;align-items:center;justify-content:center; }
        .tv-moon { position:absolute;width:20px;height:20px;border-radius:50%;background:rgba(220,210,180,0.55);left:45%;top:35%; }
        .tv-glow { position:absolute;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle,rgba(150,140,200,0.12) 0%,transparent 70%);left:41%;top:31%; }
        .tv-active .tv-moon { animation:moonFloat 3s ease-in-out infinite;background:rgba(220,210,180,0.75); }
        .tv-active .tv-glow { animation:glowPulse 3s ease-in-out infinite; }
        .tv-star { position:absolute;width:1.5px;height:1.5px;border-radius:50%;background:rgba(200,190,250,0.45); }
        .tv-st1{top:12px;left:22%} .tv-st2{top:14px;right:20%} .tv-st3{bottom:18px;left:28%} .tv-st4{bottom:16px;right:32%}
        .tv-active .tv-star { animation:starTwinkle 2.4s ease-in-out infinite; }
        .tv-st2 { animation-delay:0.4s!important } .tv-st4 { animation-delay:0.8s!important }
        @keyframes moonFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes glowPulse { 0%,100%{opacity:0.3} 50%{opacity:0.6} }
        @keyframes starTwinkle { 0%,100%{opacity:0.35} 50%{opacity:0.75} }
      `}</style>
    </div>
  )
}

export default function StepTime({ selected, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="When does music find you"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 8,
      }}
    >
      {TIME_OPTIONS.map((opt, i) => {
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
              if (!isSelected) {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.backgroundColor = 'rgba(201,169,110,0.04)'
                btn.style.borderColor = 'rgba(255,255,255,0.15)'
              }
            }}
            onMouseLeave={e => {
              if (!isSelected) {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.backgroundColor = 'rgba(255,255,255,0.025)'
                btn.style.borderColor = 'rgba(255,255,255,0.09)'
              }
            }}
          >
            <TimeVisual id={opt.id} active={isSelected} />

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(240,235,224,0.45)',
                marginBottom: 6,
                marginTop: 8,
              }}
            >
              0{i + 1}
            </div>

            <div
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 14,
                fontWeight: 500,
                color: isSelected ? 'rgba(240,235,224,0.9)' : 'rgba(240,235,224,0.75)',
                lineHeight: 1.3,
                marginBottom: 6,
                transition: 'color 0.25s cubic-bezier(0.32,0.72,0,1)',
              }}
            >
              {opt.label}
            </div>

            <div
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 13,
                color: 'rgba(240,235,224,0.55)',
                lineHeight: 1.4,
              }}
            >
              {opt.sub}
            </div>
          </button>
        )
      })}
    </div>
  )
}
