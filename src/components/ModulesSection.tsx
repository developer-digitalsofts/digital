import { useMemo } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  powerfulModulesCards,
  resolvePowerfulModuleHref,
  slugFromModuleHref,
} from '../data/powerfulModulesCards'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { ScrollReveal } from './ScrollReveal'
import { sectionTitle } from '../ui/saas'
import './powerful-modules-editorial.css'

type ModItem = {
  id: string
  href?: string
  sortOrder?: number
  active?: boolean
}

type ModulesCms = {
  items?: ModItem[]
}

const TAG_KEYS = ['tag1', 'tag2', 'tag3'] as const

export function ModulesSection() {
  const { t } = useI18n()
  const { data } = useCms()
  const block = data?.modules as ModulesCms | undefined

  const title = t('powerfulModules.title')

  const cmsHrefBySlug = useMemo(() => {
    const map = new Map<string, string>()
    const items = block?.items
      ? [...block.items]
          .filter((m) => m.active !== false)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      : []

    for (const item of items) {
      const href = item.href?.trim()
      if (!href) continue
      const slug = slugFromModuleHref(href)
      if (slug) map.set(slug, href)
    }

    return map
  }, [block?.items])

  return (
    <section id="modules" className="powerful-modules-editorial scroll-mt-28 home-section home-section--powerful-modules">
      <div className="industries-section__container">
        <ScrollReveal>
          <header className="powerful-modules-editorial__header">
            <h2 className={sectionTitle}>{title}</h2>
          </header>
        </ScrollReveal>

        <div className="powerful-modules-editorial__grid">
          {powerfulModulesCards.map((card) => {
            const Icon = card.icon
            const to = resolvePowerfulModuleHref(card.slug, cmsHrefBySlug)
            const base = `powerfulModules.cards.${card.key}`
            const cardTitle = t(`${base}.title`)
            const tags = TAG_KEYS.map((key) => t(`${base}.${key}`))

            return (
              <Link
                key={card.key}
                to={to}
                className="powerful-module-editorial-card"
                aria-label={`Explore ${cardTitle}`}
              >
                <span className="powerful-module-editorial-card__diagonal" aria-hidden="true" />

                <span className="powerful-module-editorial-card__number" aria-hidden="true">
                  {card.number}
                </span>

                <span className="powerful-module-editorial-card__icon" aria-hidden="true">
                  <Icon strokeWidth={1.8} />
                  <span className="powerful-module-editorial-card__icon-accent" />
                </span>

                <div className="powerful-module-editorial-card__content">
                  <h3 className="powerful-module-editorial-card__title">{cardTitle}</h3>
                  <p className="powerful-module-editorial-card__description">{t(`${base}.desc`)}</p>
                </div>

                <div className="powerful-module-editorial-card__tags">
                  {tags.map((tag) => (
                    <span key={tag} className="powerful-module-editorial-card__tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <span className="powerful-module-editorial-card__explore">{t('powerfulModules.exploreModule')}</span>

                <ArrowUpRight className="powerful-module-editorial-card__arrow" aria-hidden="true" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
