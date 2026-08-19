import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ColorIconBadge } from '../../ColorIconBadge'
import { resolveDetailIconName } from './detailIconMap'

type Props = {
  label: string
  iconHint?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function IconByName({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as unknown as Record<string, LucideIcon | undefined>)[name] ?? Icons.Sparkles
  return <Cmp className={className} strokeWidth={2} aria-hidden />
}

/** Unified orange-circle icon treatment for all approved detail sections. */
export function DetailIcon({ label, iconHint, size = 'md', className = '' }: Props) {
  const iconName = resolveDetailIconName(label, iconHint)
  return (
    <ColorIconBadge accentColor="#ff7048" size={size} className={`accounts-proto-icon ${className}`.trim()}>
      <IconByName name={iconName} />
    </ColorIconBadge>
  )
}
