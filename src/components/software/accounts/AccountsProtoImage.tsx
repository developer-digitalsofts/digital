import { useEffect, useState } from 'react'

type Props = {
  src: string
  alt: string
  className?: string
  priority?: boolean
  fallbacks?: string[]
}

export function AccountsProtoImage({
  src,
  alt,
  className = '',
  priority = false,
  fallbacks = [],
}: Props) {
  const chain = [src, ...fallbacks.filter((f) => f !== src)]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [src])

  return (
    <img
      src={chain[index] ?? src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => {
        setIndex((i) => (i + 1 < chain.length ? i + 1 : i))
      }}
    />
  )
}
