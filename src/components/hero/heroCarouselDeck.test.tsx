import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HeroCarouselDeck } from './HeroCarouselDeck'
import { DEFAULT_HERO_SLIDES } from './defaultHeroSlides'

vi.mock('./dashboards/HeroModuleDashboard', () => ({
  HeroModuleDashboard: ({ moduleType }: { moduleType: string }) => (
    <div data-testid="hero-mockup">{moduleType} mockup</div>
  ),
}))

vi.mock('../../i18n/I18nProvider', () => ({
  useI18n: () => ({ lang: 'en' as const, setLang: () => {}, toggleLang: () => {}, t: (p: string) => p }),
}))

describe('HeroCarouselDeck tabs', () => {
  it('switches active mockup when a module tab is clicked', () => {
    const onSelect = vi.fn()
    render(
      <HeroCarouselDeck
        slides={DEFAULT_HERO_SLIDES}
        activeIndex={0}
        animKey={1}
        reducedMotion
        durationMs={5000}
        autoplayEpoch={0}
        onSelect={onSelect}
        onTouchStart={() => {}}
        onTouchEnd={() => {}}
      />,
    )

    expect(screen.getByTestId('hero-mockup')).toHaveTextContent('erp mockup')

    fireEvent.click(screen.getByRole('tab', { name: /Finance/i }))
    expect(onSelect).toHaveBeenCalledWith(1)
  })

  it('exposes tablist with five module tabs', () => {
    render(
      <HeroCarouselDeck
        slides={DEFAULT_HERO_SLIDES}
        activeIndex={0}
        animKey={1}
        reducedMotion
        durationMs={5000}
        autoplayEpoch={0}
        onSelect={() => {}}
        onTouchStart={() => {}}
        onTouchEnd={() => {}}
      />,
    )

    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(5)
  })
})
