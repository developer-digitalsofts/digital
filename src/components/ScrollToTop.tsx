import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * SPA navigations preserve scroll by default — reset to top on route/hash change.
 */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname, search, hash])

  return null
}
