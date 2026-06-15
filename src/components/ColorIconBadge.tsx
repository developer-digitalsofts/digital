import type { CSSProperties, ReactNode } from 'react'

type BadgeSize = 'sm' | 'md' | 'lg' | 'xl'

type ColorIconBadgeProps = {
  accentColor: string
  children: ReactNode
  className?: string
  size?: BadgeSize
  withGradientRing?: boolean
}

const sizeMap: Record<BadgeSize, { box: number; glyph: number }> = {
  sm: { box: 36, glyph: 18 },
  md: { box: 46, glyph: 22 },
  lg: { box: 63, glyph: 30 },
  xl: { box: 68, glyph: 32 },
}

function badgeStyle(accentColor: string, size: BadgeSize): CSSProperties {
  const s = sizeMap[size]
  return {
    width: s.box,
    height: s.box,
    borderRadius: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: accentColor,
    color: '#ffffff',
  }
}

/** Circular colored badge with white icon — inline colors (Tailwind JIT-safe). */
export function ColorIconBadge({
  accentColor,
  children,
  className = '',
  size = 'md',
  withGradientRing = false,
}: ColorIconBadgeProps) {
  const glyphSize = sizeMap[size].glyph

  const badge = (
    <span
      className={`card-icon-badge shrink-0 transition-transform duration-200 group-hover/premium:scale-[1.03] group-hover/vc:scale-[1.03] ${className}`}
      style={badgeStyle(accentColor, size)}
      aria-hidden
    >
      <span
        className="card-icon-badge__glyph flex items-center justify-center"
        style={{ width: glyphSize, height: glyphSize }}
      >
        {children}
      </span>
    </span>
  )

  if (!withGradientRing) return badge

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full p-1.5 transition-transform duration-200 group-hover/premium:scale-[1.02]"
      style={{
        background: `linear-gradient(135deg, ${accentColor}22 0%, ${accentColor}10 55%, ${accentColor}05 100%)`,
      }}
      aria-hidden
    >
      {badge}
    </span>
  )
}
