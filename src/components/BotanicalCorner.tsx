interface Props {
  position: 'tl' | 'tr' | 'bl' | 'br'
  color?: string
  size?: number
}

// Base ornament designed for top-left; rotated for other corners
function CornerOrnamentSVG({ color = '#1e1a14' }: { color: string }) {
  return (
    <svg viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Corner diamond */}
      <rect
        x="4" y="4" width="5" height="5"
        transform="rotate(45 6.5 6.5)"
        fill={color}
        opacity={0.75}
      />
      {/* Horizontal arm */}
      <line x1="10" y1="6.5" x2="30" y2="6.5" stroke={color} strokeWidth="0.65" opacity={0.6} />
      {/* Vertical arm */}
      <line x1="6.5" y1="10" x2="6.5" y2="30" stroke={color} strokeWidth="0.65" opacity={0.6} />
      {/* Terminal dot — horizontal */}
      <circle cx="31" cy="6.5" r="1.2" fill={color} opacity={0.5} />
      {/* Terminal dot — vertical */}
      <circle cx="6.5" cy="31" r="1.2" fill={color} opacity={0.5} />
      {/* Leaf on horizontal arm */}
      <path
        d="M17,6.5 Q20,2.5 23,6.5 Q20,10.5 17,6.5"
        fill={color}
        opacity={0.55}
      />
      {/* Leaf on vertical arm */}
      <path
        d="M6.5,17 Q2.5,20 6.5,23 Q10.5,20 6.5,17"
        fill={color}
        opacity={0.55}
      />
      {/* Small secondary stem off horizontal leaf */}
      <path d="M23,6.5 Q26,3.5 28,5.5" stroke={color} strokeWidth="0.5" opacity={0.4} />
      <circle cx="28.5" cy="4.8" r="0.9" fill={color} opacity={0.4} />
      {/* Small secondary stem off vertical leaf */}
      <path d="M6.5,23 Q3.5,26 5.5,28" stroke={color} strokeWidth="0.5" opacity={0.4} />
      <circle cx="4.8" cy="28.5" r="0.9" fill={color} opacity={0.4} />
    </svg>
  )
}

const transforms: Record<Props['position'], string> = {
  tl: 'rotate(0deg)',
  tr: 'rotate(90deg)',
  br: 'rotate(180deg)',
  bl: 'rotate(270deg)',
}

export default function BotanicalCorner({ position, color = '#1e1a14', size = 48 }: Props) {
  return (
    <div
      style={{
        width: size,
        height: size,
        transform: transforms[position],
        flexShrink: 0,
      }}
    >
      <CornerOrnamentSVG color={color} />
    </div>
  )
}
