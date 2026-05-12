interface Props {
  step: number
  total: number
}

export default function ProgressBar({ step, total }: Props) {
  return (
    <div
      style={{ width: '100%', paddingTop: 28 }}
      aria-live="polite"
      aria-label={`Step ${step} of ${total}`}
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={1}
      aria-valuemax={total}
    >
      {/* Step indicator row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            color: 'rgba(201,169,110,0.80)',
            textTransform: 'uppercase',
          }}
          aria-hidden="false"
        >
          {step} / {total}
        </span>

        {/* Pip dots */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }} aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              style={{
                width: i + 1 === step ? 20 : 5,
                height: 5,
                borderRadius: 999,
                backgroundColor: i + 1 <= step
                  ? 'var(--arcane-gold)'
                  : 'rgba(201,169,110,0.20)',
                transition: 'all 0.5s cubic-bezier(0.32,0.72,0,1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Track */}
      <div
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'rgba(201,169,110,0.14)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${((step - 1) / (total - 1)) * 100}%`,
            backgroundColor: 'var(--arcane-gold)',
            transition: 'width 0.7s cubic-bezier(0.32,0.72,0,1)',
          }}
        />
      </div>
    </div>
  )
}
