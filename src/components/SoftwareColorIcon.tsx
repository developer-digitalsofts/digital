import type { CSSProperties } from 'react'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ColorIconBadge } from './ColorIconBadge'
import {
  detailCardIconAccent,
  softwareIconAccent,
  type SoftwareIconAccentOpts,
} from '../ui/cardIconColors'

function IconByName({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as unknown as Record<string, LucideIcon | undefined>)[name] ?? Icons.Circle
  return <Cmp className={className} strokeWidth={2} aria-hidden />
}

type SoftwareColorIconProps = SoftwareIconAccentOpts & {
  icon: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /** When set, uses rotating detail palette instead of entity slug color. */
  paletteIndex?: number
}

/** Circular colorful icon badge — consistent across homepage and software pages. */
export function SoftwareColorIcon({
  icon,
  slug,
  kind,
  cardKey,
  categoryId,
  index = 0,
  paletteIndex,
  size = 'md',
  className = '',
}: SoftwareColorIconProps) {
  const accent =
    paletteIndex !== undefined
      ? detailCardIconAccent(paletteIndex)
      : softwareIconAccent({ slug, kind, cardKey, categoryId, index })

  return (
    <ColorIconBadge accentColor={accent} size={size} className={className}>
      <IconByName name={icon} />
    </ColorIconBadge>
  )
}

export function softwareAccentStyle(accent: string): CSSProperties {
  return { '--card-accent': accent } as CSSProperties
}

export function detailCardAccentStyle(paletteIndex: number): CSSProperties {
  return softwareAccentStyle(detailCardIconAccent(paletteIndex))
}
