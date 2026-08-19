import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import { WHATSAPP_URL } from '../constants'
import {
  getIndustryListingCards,
  INDUSTRY_FILTER_GROUPS,
  INDUSTRY_FILTER_ORDER,
  type IndustriesCmsBlock,
  type IndustryFilterCategory,
} from '../data/publishedIndustries'
import { IndustryListingCard } from '../components/IndustryListingCard'
import { ScrollReveal } from '../components/ScrollReveal'
import '../components/industry-listing-card.css'
import '../components/industries-listing-page.css'

const FILTER_I18N_KEYS: Record<IndustryFilterCategory, string> = {
  all: 'industryListing.filters.all',
  'retail-commerce': 'industryListing.filters.retailCommerce',
  manufacturing: 'industryListing.filters.manufacturing',
  energy: 'industryListing.filters.energy',
  services: 'industryListing.filters.services',
  agriculture: 'industryListing.filters.agriculture',
  logistics: 'industryListing.filters.logistics',
  construction: 'industryListing.filters.construction',
}

function matchesSearch(
  query: string,
  card: ReturnType<typeof getIndustryListingCards>[number],
): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  if (card.title.toLowerCase().includes(q)) return true
  if (card.label.toLowerCase().includes(q)) return true
  if (card.description.toLowerCase().includes(q)) return true
  return card.solutions.some((solution) => solution.label.toLowerCase().includes(q))
}

function matchesFilter(
  filter: IndustryFilterCategory,
  card: ReturnType<typeof getIndustryListingCards>[number],
): boolean {
  if (filter === 'all') return true
  const slugs = INDUSTRY_FILTER_GROUPS[filter]
  return slugs.includes(card.slug)
}

export function IndustriesPage() {
  const { t, lang } = useI18n()
  const { data } = useCms()
  const block = data?.industries as IndustriesCmsBlock | undefined
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<IndustryFilterCategory>('all')

  const eyebrow = t('industryListing.eyebrow')
  const title = block?.title ? pick(block.title, lang) : t('industryListing.title')
  const description = block?.subtitle
    ? pick(block.subtitle, lang)
    : t('industryListing.description')
  const exploreIndustryLabel = t('industryListing.exploreIndustry')

  const listingCards = useMemo(
    () => getIndustryListingCards(block, lang, t),
    [block, lang, t],
  )

  const filteredCards = useMemo(
    () =>
      listingCards.filter(
        (card) => matchesFilter(activeFilter, card) && matchesSearch(query, card),
      ),
    [listingCards, activeFilter, query],
  )

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return
    }
    window.scrollTo(0, 0)
  }, [])

  const filterOptions: IndustryFilterCategory[] = ['all', ...INDUSTRY_FILTER_ORDER]

  return (
    <main className="industries-listing-page scroll-mt-28">
      <div className="industries-listing-page__shell">
        <header className="industries-listing-page__hero">
          <div className="industries-listing-page__hero-glow" aria-hidden />
          <div className="industries-listing-page__hero-inner">
            <p className="industries-listing-page__eyebrow">{eyebrow}</p>
            <h1 className="industries-listing-page__title">{title}</h1>
            <p className="industries-listing-page__description">{description}</p>
          </div>
        </header>

        <div className="industries-listing-page__toolbar">
          <div className="industries-listing-page__search-wrap">
            <label htmlFor="industries-search" className="industries-listing-page__search-label">
              {t('industryListing.searchLabel')}
            </label>
            <input
              id="industries-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('industryListing.searchPlaceholder')}
              className="industries-listing-page__search"
              autoComplete="off"
            />
          </div>

          <div className="industries-listing-page__filters" role="group" aria-label={t('industryListing.searchLabel')}>
            {filterOptions.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`industries-listing-page__filter ${activeFilter === filter ? 'industries-listing-page__filter--active' : ''}`}
                aria-pressed={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              >
                {t(FILTER_I18N_KEYS[filter])}
              </button>
            ))}
          </div>
        </div>

        <div className="industries-listing-grid">
          {filteredCards.length === 0 ? (
            <div className="industries-listing-page__empty">
              <p className="industries-listing-page__empty-title">{t('industryListing.emptyTitle')}</p>
              <p className="industries-listing-page__empty-text">{t('industryListing.emptyText')}</p>
            </div>
          ) : (
            filteredCards.map((item, i) => (
                <ScrollReveal key={item.id} delayMs={i * 24}>
                  <IndustryListingCard
                    {...item}
                    variant="page"
                    footerActionLabel={exploreIndustryLabel}
                  />
                </ScrollReveal>
              ))
          )}
        </div>

        <section className="industries-listing-page__cta" aria-labelledby="industries-help-heading">
          <div className="industries-listing-page__cta-inner">
            <div className="industries-listing-page__cta-copy">
              <h2 id="industries-help-heading" className="industries-listing-page__cta-title">
                {t('industryListing.cta.heading')}
              </h2>
              <p className="industries-listing-page__cta-text">{t('industryListing.cta.text')}</p>
            </div>
            <div className="industries-listing-page__cta-actions">
              <Link
                to="/contact#contact-form"
                className="industries-listing-page__cta-btn industries-listing-page__cta-btn--primary"
              >
                {t('industryListing.cta.consultant')}
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="industries-listing-page__cta-btn industries-listing-page__cta-btn--secondary"
              >
                {t('industryListing.cta.whatsapp')}
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
