import { useEffect, useRef, useState } from 'react'

/** Fires once when the element enters the viewport (then disconnects). */
export function useInViewOnce<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return { ref, visible }
}
