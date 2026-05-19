import type { CSSProperties, ReactNode } from 'react'
import { useInViewOnce } from '../hooks/useInViewOnce'

type Props = {
  children: ReactNode
  className?: string
  delayMs?: number
}

export function ScrollReveal({ children, className = '', delayMs = 0 }: Props) {
  const { ref, visible } = useInViewOnce<HTMLDivElement>()
  const style: CSSProperties | undefined = delayMs ? { transitionDelay: visible ? `${delayMs}ms` : '0ms' } : undefined

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  )
}
