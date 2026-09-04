import { useMemo } from 'react'
import { CmsLink } from './CmsLink'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import {
  getHomepageShowcaseCards,
  type IndustriesCmsBlock,
} from '../data/publishedIndustries'
import { ScrollReveal } from './ScrollReveal'
import { IndustryListingCard } from './IndustryListingCard'
import { sectionEyebrow, sectionTitle, sectionWhite } from '../ui/saas'
import './industry-listing-card.css'

/** Image-grid industry showcase on the homepage (six priority cards). */
export function IndustryShowcaseSection() {
  const { t, lang } = useI18n()
  const { data } = useCms()
  const block = data?.industries as IndustriesCmsBlock | undefined

  const eyebrow = block?.eyebrow ? pick(block.eyebrow, lang) : t('industryShowcase.eyebrow')
  const title = block?.title ? pick(block.title, lang) : t('industryShowcase.title')
  const viewAll = block?.viewAllLabel ? pick(block.viewAllLabel, lang) : t('industryShowcase.viewAll')
  const viewAllSolutionsLabel = t('industryShowcase.viewAllSolutions')

  const visibleCards = useMemo(
    () => getHomepageShowcaseCards(block, lang, t),
    [block, lang, t],
  )

  return (
    <section
      id="about"
      className={`industries-section relative scroll-mt-28 overflow-hidden bg-white home-section home-section--industries ${sectionWhite}`}
    >
      <div className="industries-section__container relative">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <p className={`${sectionEyebrow} uppercase tracking-[0.14em]`}>{eyebrow}</p>
          <h2 className={`${sectionTitle} mt-2`}>{title}</h2>
        </ScrollReveal>

        <div className="home-industry-grid">
          {visibleCards.map((item, i) => (
              <ScrollReveal key={item.id} delayMs={i * 40}>
                <IndustryListingCard
                  {...item}
                  variant="home"
                  footerActionLabel={viewAllSolutionsLabel}
                />
              </ScrollReveal>
            ))}
        </div>

        <div className="home-industry-section__view-all-wrap">
          <CmsLink to="/industries" className="home-industry-section__view-all group">
            {viewAll}
            <ArrowRight className="home-industry-section__view-all-icon" aria-hidden />
          </CmsLink>
        </div>
      </div>
    </section>
  )
}
