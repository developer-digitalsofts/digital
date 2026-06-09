import type { ReactNode } from 'react'
import { cardDesc, cardTitle, featureCard, iconBoxLg } from '../ui/saas'

type EnterpriseIconCardProps = {
  icon: ReactNode
  title: string
  description: string
  className?: string
}

/** Border-only feature card for value chain, about highlights, etc. */
export function EnterpriseIconCard({
  icon,
  title,
  description,
  className = '',
}: EnterpriseIconCardProps) {
  return (
    <article className={`${featureCard} ${className}`}>
      <div className={`${iconBoxLg} [&_svg]:size-8 [&_svg]:shrink-0 [&_svg]:text-brand`} aria-hidden>
        {icon}
      </div>
      <h3 className={`${cardTitle} mt-6 line-clamp-2`}>{title}</h3>
      <p className={`${cardDesc} line-clamp-2`}>{description}</p>
    </article>
  )
}
