import { useEffect, useState } from 'react'

type Props = {
  src: string
  alt: string
  objectPosition?: string
  fallbacks?: string[]
  slug?: string
}

export function IndustryHeroMedia({ src, alt, objectPosition = 'center', fallbacks = [], slug }: Props) {
  const chain = [src, ...fallbacks.filter((item) => item && item !== src)]
  const [index, setIndex] = useState(0)
  const [exhausted, setExhausted] = useState(false)

  useEffect(() => {
    setIndex(0)
    setExhausted(false)
  }, [src])

  if (exhausted) {
    return (
      <div className="industryHeroMedia__placeholder" role="img" aria-label={alt}>
        <span className="industryHeroMedia__placeholder-icon" aria-hidden />
        <span className="industryHeroMedia__placeholder-text">{alt}</span>
      </div>
    )
  }

  const current = chain[index] ?? src

  return (
    <img
      src={current}
      alt={alt}
      loading="eager"
      decoding="async"
      fetchPriority="high"
      width={1600}
      height={1000}
      style={{ objectPosition }}
      onError={() => {
        if (import.meta.env.DEV) {
          console.warn('[IndustryHero] missing image', { slug, src: current, index })
        }
        if (index + 1 < chain.length) {
          setIndex((value) => value + 1)
        } else {
          setExhausted(true)
        }
      }}
    />
  )
}
