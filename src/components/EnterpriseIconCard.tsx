import type { CSSProperties, ReactNode } from 'react'
import { ColorIconBadge } from './ColorIconBadge'
import { cardDesc, cardTitle } from '../ui/saas'

type EnterpriseIconCardProps = {
  icon: ReactNode
  title: string
  description: string
  className?: string
  iconAccentColor?: string
}

/** Value-chain card — horizontal layout with left accent, distinct from module/industry cards. */
export function EnterpriseIconCard({
  icon,
  title,
  description,
  className = '',
  iconAccentColor,
}: EnterpriseIconCardProps) {
  const accentStyle = iconAccentColor
    ? ({ '--card-accent': iconAccentColor, borderLeftColor: iconAccentColor } as CSSProperties)
    : undefined

  return (
    <article
      className={`card-accent-hover group/vc relative flex h-full min-h-[8.5rem] gap-4 overflow-hidden rounded-xl border border-[rgba(15,23,42,0.12)] border-l-[3px] bg-white p-5 transition-[border-color,transform] duration-200 hover:-translate-y-px hover:border-brand/30 motion-reduce:hover:translate-y-0 sm:min-h-[9rem] sm:gap-5 sm:p-6 ${className}`}
      style={accentStyle}
    >
      {iconAccentColor ? (
        <ColorIconBadge accentColor={iconAccentColor} size="md">
          {icon}
        </ColorIconBadge>
      ) : (
        <div
          className="flex size-[46px] shrink-0 items-center justify-center rounded-full border border-[rgba(15,23,42,0.12)] bg-white text-brand [&_svg]:size-[22px] [&_svg]:shrink-0"
          aria-hidden
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h3 className={`${cardTitle} text-base font-bold sm:text-[1.0625rem]`}>{title}</h3>
        <p className={`${cardDesc} mt-2 line-clamp-3 text-sm leading-[1.6] text-slate-600`}>{description}</p>
      </div>
    </article>
  )
}
