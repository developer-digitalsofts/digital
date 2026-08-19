import { useI18n } from '../../i18n/I18nProvider'
import { pick } from '../../cms/pick'
import { LucideByName } from '../../utils/lucideFromName'
import type { HeroCarouselSlide } from '../../types/heroCarousel'
import { HeroModuleDashboard } from './dashboards/HeroModuleDashboard'

type Props = {
  slides: HeroCarouselSlide[]
  activeIndex: number
  animKey: number
  reducedMotion: boolean
  durationMs: number
  autoplayEpoch: number
  onSelect: (index: number) => void
  onTouchStart: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
}

export function HeroCarouselDeck({
  slides,
  activeIndex,
  animKey,
  reducedMotion,
  durationMs,
  autoplayEpoch,
  onSelect,
  onTouchStart,
  onTouchEnd,
}: Props) {
  const { lang } = useI18n()
  const progressKey = `${activeIndex}-${autoplayEpoch}`

  return (
    <div className="dm-hero__deck" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="dm-hero__right-stack">
        <div className="dm-hero__progress" aria-hidden={slides.length <= 1}>
          {slides.map((slide, i) => {
            const active = i === activeIndex
            const label = pick(slide.navLabel, lang)
            return (
              <button
                key={slide.id}
                type="button"
                className={`dm-hero__progress-track ${active ? 'is-active' : ''}`}
                onClick={() => onSelect(i)}
                aria-label={`Show ${label} dashboard`}
                aria-current={active ? 'true' : undefined}
              >
                {active && !reducedMotion ? (
                  <span
                    key={progressKey}
                    className="dm-hero__progress-fill"
                    style={{ animationDuration: `${durationMs}ms` }}
                  />
                ) : null}
              </button>
            )
          })}
        </div>

        <div className="dm-hero__controls">
          <div className="dm-hero__controls-bar">
            <div className="dm-hero__nav" role="tablist" aria-label="Module navigation">
              {slides.map((slide, i) => {
                const active = i === activeIndex
                const label = pick(slide.navLabel, lang)
                return (
              <button
                key={slide.id}
                id={`hero-tab-${slide.id}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`hero-tabpanel-${slide.id}`}
                tabIndex={active ? 0 : -1}
                className={`dm-hero__tab ${active ? 'dm-hero__tab--active' : ''}`}
                onClick={() => onSelect(i)}
              >
                    <LucideByName name={slide.navIcon} className="dm-hero__tab-icon" strokeWidth={2} aria-hidden />
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="dm-hero__stage dm-hero__dashboard-stage">
          {slides.map((slide, i) => {
            const active = i === activeIndex
            const dashLabel = pick(slide.navLabel, lang)
            return (
              <div
                key={slide.id}
                className={`dm-hero__slide dm-hero__dashboard-slide ${active ? 'is-active' : ''} ${
                  active && !reducedMotion ? 'dm-hero__slide--enter' : ''
                }`}
                aria-hidden={!active}
                aria-label={active ? `${dashLabel} dashboard preview` : undefined}
              >
                {active ? (
                  <HeroModuleDashboard
                    key={`${slide.id}-${animKey}`}
                    moduleType={slide.moduleType}
                    animate={!reducedMotion}
                    preview={false}
                  />
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
