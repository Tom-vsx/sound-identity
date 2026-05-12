import { useMemo } from 'react'
import { createRng } from '../lib/seededRandom'

interface Props {
  seed: number
  complexity: number  // 1–5
  tension: number     // 0.0–1.0
  accentColor: string
  width?: number
  height?: number
}

// 4-pointed star
function star4(cx: number, cy: number, outer: number, inner: number): string {
  let d = ''
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 2
    const r = i % 2 === 0 ? outer : inner
    d += (i === 0 ? 'M' : 'L') + ` ${(cx + Math.cos(a) * r).toFixed(2)} ${(cy + Math.sin(a) * r).toFixed(2)} `
  }
  return d + 'Z'
}

// Almond leaf from origin to tip with lateral bulge
function almondLeaf(ox: number, oy: number, tipX: number, tipY: number, bulge: number): string {
  const mx = (ox + tipX) / 2
  const my = (oy + tipY) / 2
  const dx = tipY - oy
  const dy = -(tipX - ox)
  const len = Math.hypot(dx, dy) || 1
  const nx = (dx / len) * bulge
  const ny = (dy / len) * bulge
  return `M ${ox.toFixed(2)} ${oy.toFixed(2)} Q ${(mx + nx).toFixed(2)} ${(my + ny).toFixed(2)} ${tipX.toFixed(2)} ${tipY.toFixed(2)} Q ${(mx - nx).toFixed(2)} ${(my - ny).toFixed(2)} ${ox.toFixed(2)} ${oy.toFixed(2)} Z`
}

type LeafEntry = { d: string; kind: 'leaf' | 'stem' }

export default function GenerativeShape({
  seed, complexity, tension, accentColor, width = 280, height = 330,
}: Props) {
  const g = useMemo(() => {
    const rng = createRng(seed)
    const cx = width / 2

    // ── ROBE GEOMETRY ──
    const robeBottomY = height + 8           // slightly below frame edge
    const robeTopY = 90 + rng() * 20         // y of shoulders
    const baseHW = 66 + rng() * 20           // half-width at hem
    const shoulderHW = 20 + rng() * 9        // half-width at shoulders

    const lBx = cx - baseHW
    const rBx = cx + baseHW
    const lSx = cx - shoulderHW
    const rSx = cx + shoulderHW

    // Left bezier control points — slight outward billow driven by tension
    const lcp1 = {
      x: lBx + (rng() - 0.55) * tension * 22,
      y: robeBottomY - (robeBottomY - robeTopY) * 0.20,
    }
    const lcp2 = {
      x: lSx - 7 + (rng() - 0.5) * tension * 12,
      y: robeTopY + (robeBottomY - robeTopY) * 0.30,
    }
    // Right side — independent variation
    const rcp1 = {
      x: rBx + (rng() - 0.45) * tension * 22,
      y: robeBottomY - (robeBottomY - robeTopY) * 0.20 + (rng() - 0.5) * 8,
    }
    const rcp2 = {
      x: rSx + 7 + (rng() - 0.5) * tension * 12,
      y: robeTopY + (robeBottomY - robeTopY) * 0.30 + (rng() - 0.5) * 8,
    }

    const robePath = [
      `M ${lBx.toFixed(1)} ${robeBottomY}`,
      `C ${lcp1.x.toFixed(1)} ${lcp1.y.toFixed(1)} ${lcp2.x.toFixed(1)} ${lcp2.y.toFixed(1)} ${lSx.toFixed(1)} ${robeTopY.toFixed(1)}`,
      `Q ${cx} ${(robeTopY + 2).toFixed(1)} ${rSx.toFixed(1)} ${robeTopY.toFixed(1)}`,
      `C ${rcp2.x.toFixed(1)} ${rcp2.y.toFixed(1)} ${rcp1.x.toFixed(1)} ${rcp1.y.toFixed(1)} ${rBx.toFixed(1)} ${robeBottomY}`,
      `Q ${cx} ${(robeBottomY + 14).toFixed(1)} ${lBx.toFixed(1)} ${robeBottomY}`,
      'Z',
    ].join(' ')

    // ── HEAD ──
    const headR = 11 + rng() * 4
    const headCY = robeTopY - headR - 2

    // ── CELESTIAL ELEMENT (behind head/robe top) ──
    // 0 = filled sun disc, 1 = inner disc + outer ring, 2 = radiant sun
    const celestialType = Math.floor(rng() * 3)
    const celestialR = 24 + complexity * 4 + rng() * 8
    const celestialCY = headCY - headR * 0.4 - celestialR * 0.9 - rng() * 6
    const celestialCX = cx + (rng() - 0.5) * 10 * tension

    // ── BOTANICAL SIDE ELEMENTS ──
    const leafData: LeafEntry[] = []
    const leavesPerSide = 2 + Math.floor(complexity * 0.6)

    for (const sideVal of [-1, 1]) {
      const side = sideVal as 1 | -1
      const edgeX = cx + side * (baseHW * 0.60 + 14)
      const topY = robeTopY + (robeBottomY - robeTopY) * 0.05
      const botY = robeTopY + (robeBottomY - robeTopY) * 0.65

      // Main stem
      const smx = edgeX + side * (4 + rng() * 5)
      leafData.push({
        kind: 'stem',
        d: `M ${edgeX.toFixed(1)} ${botY.toFixed(1)} Q ${smx.toFixed(1)} ${((topY + botY) / 2).toFixed(1)} ${(edgeX + side * 9).toFixed(1)} ${topY.toFixed(1)}`,
      })

      for (let li = 0; li < leavesPerSide; li++) {
        const t = (li + 0.5) / leavesPerSide
        const ly = botY - t * (botY - topY)
        const lx = edgeX + side * t * 8
        const leafLen = 14 + rng() * 12
        // Leaf angle: pointing outward and slightly upward
        const baseAngle = side > 0 ? 0.15 : Math.PI - 0.15
        const leafAngle = baseAngle + (rng() - 0.5) * 0.45
        const tipX = lx + Math.cos(leafAngle) * leafLen
        const tipY = ly + Math.sin(leafAngle) * leafLen
        leafData.push({ kind: 'leaf', d: almondLeaf(lx, ly, tipX, tipY, 4 + rng() * 4) })

        // Extra small offset leaf for complexity ≥ 3
        if (complexity >= 3) {
          const li2Angle = leafAngle - side * 0.6
          const li2Len = leafLen * 0.55
          const t2x = lx + Math.cos(li2Angle) * li2Len
          const t2y = ly + Math.sin(li2Angle) * li2Len
          leafData.push({ kind: 'leaf', d: almondLeaf(lx, ly, t2x, t2y, 2.5 + rng() * 2) })
        }
      }
    }

    // ── SCATTERED STARS ──
    const stars: Array<{ x: number; y: number; r: number }> = []
    const starCount = 4 + Math.floor(complexity * 0.8)
    for (let i = 0; i < starCount; i++) {
      const sx = 16 + rng() * (width - 32)
      const sy = 12 + rng() * (robeTopY - 22)
      // Skip if too close to celestial
      if (Math.hypot(sx - celestialCX, sy - celestialCY) > celestialR + 12) {
        stars.push({ x: sx, y: sy, r: 1.6 + rng() * 2.4 })
      }
    }

    // ── HAIR / VEIL (extending from head, complexity ≥ 2) ──
    let veilPath: string | null = null
    if (complexity >= 2) {
      const veilW = shoulderHW + 8 + rng() * 12
      const veilLen = 30 + rng() * 25
      veilPath = `
        M ${(cx - veilW * 0.55).toFixed(1)} ${(headCY - headR * 0.4).toFixed(1)}
        Q ${(cx - veilW).toFixed(1)} ${(headCY + veilLen * 0.5).toFixed(1)} ${(cx - veilW * 0.7).toFixed(1)} ${(headCY + veilLen).toFixed(1)}
        Q ${cx} ${(headCY + veilLen + 6).toFixed(1)} ${(cx + veilW * 0.7).toFixed(1)} ${(headCY + veilLen).toFixed(1)}
        Q ${(cx + veilW).toFixed(1)} ${(headCY + veilLen * 0.5).toFixed(1)} ${(cx + veilW * 0.55).toFixed(1)} ${(headCY - headR * 0.4).toFixed(1)}
        Z
      `
    }

    return {
      robePath, headR, headCY, cx,
      celestialType, celestialR, celestialCY, celestialCX,
      leafData, stars, veilPath,
    }
  }, [seed, complexity, tension, width, height])

  const INK = '#1e1a14'

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-hidden="true"
      style={{ display: 'block', overflow: 'hidden' }}
    >
      {/* Stars (background layer) */}
      {g.stars.map((s, i) => (
        <path key={`star-${i}`} d={star4(s.x, s.y, s.r, s.r * 0.36)} fill={INK} opacity={0.22} />
      ))}

      {/* Celestial element — sits behind the figure */}
      {g.celestialType === 0 && (
        <circle cx={g.celestialCX} cy={g.celestialCY} r={g.celestialR} fill={accentColor} opacity={0.92} />
      )}
      {g.celestialType === 1 && (
        <>
          <circle cx={g.celestialCX} cy={g.celestialCY} r={g.celestialR} fill="none" stroke={INK} strokeWidth={0.7} opacity={0.28} />
          <circle cx={g.celestialCX} cy={g.celestialCY} r={g.celestialR * 0.6} fill={accentColor} opacity={0.88} />
        </>
      )}
      {g.celestialType === 2 && (
        <>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2
            return (
              <line
                key={i}
                x1={(g.celestialCX + Math.cos(a) * (g.celestialR + 3)).toFixed(2)}
                y1={(g.celestialCY + Math.sin(a) * (g.celestialR + 3)).toFixed(2)}
                x2={(g.celestialCX + Math.cos(a) * (g.celestialR + 14)).toFixed(2)}
                y2={(g.celestialCY + Math.sin(a) * (g.celestialR + 14)).toFixed(2)}
                stroke={INK} strokeWidth={0.8} opacity={0.25}
              />
            )
          })}
          <circle cx={g.celestialCX} cy={g.celestialCY} r={g.celestialR} fill={accentColor} opacity={0.9} />
        </>
      )}

      {/* Botanical stems */}
      {g.leafData.filter(l => l.kind === 'stem').map((l, i) => (
        <path key={`stem-${i}`} d={l.d} stroke={INK} strokeWidth={0.65} fill="none" opacity={0.42} />
      ))}

      {/* Botanical leaves */}
      {g.leafData.filter(l => l.kind === 'leaf').map((l, i) => (
        <path key={`leaf-${i}`} d={l.d} fill={INK} opacity={0.42} />
      ))}

      {/* Veil / hair (behind head, in front of robe) */}
      {g.veilPath && (
        <path d={g.veilPath} fill={INK} opacity={0.72} />
      )}

      {/* Robe — main silhouette */}
      <path d={g.robePath} fill={INK} opacity={0.9} />

      {/* Head */}
      <circle cx={g.cx} cy={g.headCY} r={g.headR} fill={INK} opacity={0.9} />
    </svg>
  )
}
