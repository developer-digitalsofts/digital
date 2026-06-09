import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { CmsLink } from './CmsLink'
import { cardDesc, cardEyebrow, cardEyebrowIndustry, cardFooter, cardTitle, linkAccent } from '../ui/saas'

export type PremiumFeatureCardProps = {
  title: string
  description: string
  exploreLabel: string
  to: string
  icon: ReactNode
  eyebrow?: string
  useCmsLink?: boolean
  variant?: 'module' | 'industry'
}

const cardShellModule =
  'group/premium relative flex h-full min-h-[15.5rem] flex-col rounded-2xl border border-slate-200/90 bg-white p-6 transition-[border-color,transform] duration-300 ease-out hover:-translate-y-[3px] hover:border-brand focus-within:-translate-y-[3px] focus-within:border-brand motion-reduce:transition-colors motion-reduce:hover:translate-y-0 sm:p-7'

const cardShellIndustry =
  'group/premium relative flex h-full min-h-[16.5rem] flex-col rounded-2xl border border-slate-200/85 bg-slate-50/40 p-6 transition-[border-color,transform,background-color] duration-300 ease-out hover:-translate-y-[3px] hover:border-brand hover:bg-white focus-within:-translate-y-[3px] focus-within:border-brand motion-reduce:transition-colors motion-reduce:hover:translate-y-0 sm:min-h-[17rem] sm:p-7'

const iconShellModule =
  'flex size-[3.75rem] shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-slate-50/90 text-brand transition-colors duration-300 group-hover/premium:border-brand/35 group-hover/premium:bg-brand/[0.08] [&_svg]:size-8 [&_svg]:shrink-0 [&_svg]:text-brand'

const iconShellIndustry =
  'flex size-16 shrink-0 items-center justify-center rounded-2xl border border-slate-200/90 bg-white text-brand transition-colors duration-300 group-hover/premium:border-brand/35 group-hover/premium:bg-brand/[0.08] [&_svg]:size-8 [&_svg]:shrink-0 [&_svg]:text-brand'

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
}: PremiumFeatureCardProps) {
  const LinkEl = useCmsLink ? CmsLink : Link
  const linkLabel = exploreText(exploreLabel)
  const isIndustry = variant === 'industry'

  return (
    <article className={isIndustry ? cardShellIndustry : cardShellModule}>
      <div className="flex items-start justify-between gap-3">
        <div className={isIndustry ? iconShellIndustry : iconShellModule} aria-hidden>
          {icon}
        </div>
        {eyebrow ? (
          <span className={isIndustry ? cardEyebrowIndustry : cardEyebrow}>{eyebrow}</span>
        ) : null}
      </div>

      <div className="mt-7 flex flex-1 flex-col">
        <h3
          className={`${cardTitle} line-clamp-2 ${isIndustry ? 'text-lg font-bold sm:text-xl' : 'text-lg font-bold'}`}
        >
          {title}
        </h3>
        <p className={`${cardDesc} mt-3 line-clamp-2`}>{description}</p>

        <div className={`${cardFooter} mt-auto pt-5`}>
          <LinkEl
            to={to}
            className={`${linkAccent} gap-2 font-semibold group-hover/premium:gap-2.5`}
          >
            <span>{linkLabel}</span>
            <ArrowUpRight
              className="size-[1.125rem] shrink-0 transition-transform duration-300 group-hover/premium:translate-x-0.5 group-hover/premium:-translate-y-0.5"
              aria-hidden
            />
          </LinkEl>
        </div>
      </div>
    </article>
  )
}
