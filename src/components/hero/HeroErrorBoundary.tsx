import { Component, type ErrorInfo, type ReactNode } from 'react'
import { HeroCarousel } from './HeroCarousel'
import { DEFAULT_HERO_SLIDES } from './defaultHeroSlides'

type Props = {
  children: ReactNode
}

type State = { error: Error | null }

/** Keeps the homepage hero visible when carousel rendering throws in production. */
export class HeroErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[HeroErrorBoundary] Hero render failed — showing bundled fallback slide', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <HeroCarousel
          slides={[DEFAULT_HERO_SLIDES[0]]}
          cmsLoaded={false}
          loading={false}
        />
      )
    }
    return this.props.children
  }
}
