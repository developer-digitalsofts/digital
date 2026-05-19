import type { LucideIcon } from 'lucide-react'
import * as Icons from 'lucide-react'

const cache = new Map<string, LucideIcon | null>()

export function getLucideIcon(name: string | undefined): LucideIcon | null {
  if (!name) return null
  if (cache.has(name)) return cache.get(name) ?? null
  const Cmp = (Icons as unknown as Record<string, LucideIcon | undefined>)[name]
  cache.set(name, Cmp ?? null)
  return Cmp ?? null
}

type Props = { name?: string; className?: string; strokeWidth?: number }

export function LucideByName({ name, className, strokeWidth = 1.75 }: Props) {
  const Cmp = getLucideIcon(name)
  if (!Cmp) return null
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden />
}
