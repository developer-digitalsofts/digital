import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { CmsLink } from './CmsLink'
import { ColorIconBadge } from './ColorIconBadge'
import { cardDesc, cardEyebrowIndustry, cardBorderStrong, linkAccent } from '../ui/saas'

export type PremiumFeatureCardProps = {
  title: string
  description: string
  exploreLabel: string
  to: string
  icon: ReactNode
  eyebrow?: string
  useCmsLink?: boolean
  variant?: 'module' | 'industry'
  iconAccentColor?: string
}

function exploreText(label: string) {
  return label.replace(/\s*[→←]\s*$/u, '').trim() || label
}

export function PremiumFeatureCard({
  title,
  description,
  exploreLabel,
  to,
  icon,
  eyebrow,
  useCmsLink = false,
  variant = 'module',
  iconAccentColor,
}: PremiumFeatureCardProps) {
  const LinkEl = useCmsLink ? CmsLink : Link
  const linkLabel = exploreText(exploreLabel)
  const accentStyle = iconAccentColor
    ? ({ '--card-accent': iconAccentColor } as CSSProperties)
    : undefined

  const isModule = variant === 'module'

  const cardShell = isModule
    ? `card-accent-hover group/premium relative flex h-full min-h-[16.5rem] flex-col overflow-hidden rounded-xl border ${cardBorderStrong} bg-white p-6 transition-[border-color,transform] duration-200 hover:-translate-y-px hover:border-brand/40 motion-reduce:hover:translate-y-0 sm:min-h-[17rem] sm:p-7`
    : `card-accent-hover group/premium relative flex h-full min-h-[17rem] flex-col overflow-hidden rounded-xl border ${cardBorderStrong} bg-white p-6 transition-[border-color,transform] duration-200 hover:-translate-y-px hover:border-brand/40 motion-reduce:hover:translate-y-0 sm:min-h-[17.5rem] sm:p-7`

  return (
    <article className={cardShell} style={accentStyle}>
      <div className="relative flex items-start gap-4">
        {iconAccentColor ? (
          <ColorIconBadge accentColor={iconAccentColor} size={isModule ? 'lg' : 'lg'}>
            {icon}
          </ColorIconBadge>
        ) : (
          <div
            className="flex size-[55px] shrink-0 items-center justify-center rounded-full border border-[rgba(15,23,42,0.12)] bg-white text-brand [&_svg]:size-[26px] [&_svg]:shrink-0"
            aria-hidden
          >
            {icon}
          </div>
        )}
        {!isModule && eyebrow ? (
          <span className={`${cardEyebrowIndustry} ms-auto max-w-[9.5rem] text-right leading-tight`}>
            {eyebrow}
          </span>
        ) : null}
      </div>

      <div className="relative mt-5 flex flex-1 flex-col sm:mt-6">
        <h3
          className={`font-heading font-bold leading-snug tracking-tight text-slate-900 line-clamp-2 ${
            isModule ? 'text-[1.25rem] sm:text-[1.375rem]' : 'text-[1.25rem] sm:text-[1.375rem]'
          }`}
        >
          {title}
        </h3>
        <p className={`${cardDesc} mt-3.5 line-clamp-3 text-[0.9375rem] leading-[1.64] text-slate-600 sm:mt-4`}>
          {description}
        </p>

        <div className="mt-auto border-t border-slate-100 pt-5 sm:pt-6">
          <LinkEl
            to={to}
            className={`${linkAccent} gap-2 text-[0.9375rem] font-semibold group-hover/premium:gap-2.5`}
          >
            <span>{linkLabel}</span>
            <ArrowUpRight
              className="size-[1.0625rem] shrink-0 transition-transform duration-300 group-hover/premium:translate-x-0.5 group-hover/premium:-translate-y-0.5"
              aria-hidden
            />
          </LinkEl>
        </div>
      </div>
    </article>
  )
}
