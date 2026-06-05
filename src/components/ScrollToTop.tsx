import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

function scrollToHashTarget(hash: string): boolean {
  const id = hash.replace(/^#/, '')
  if (!id) return false
  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({ behavior: 'auto', block: 'start' })
  return true
}

/**
 * SPA navigations preserve scroll by default — reset to top on route change,
 * or scroll to the in-page anchor when the URL includes a hash.
 */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) {
      if (scrollToHashTarget(hash)) return
      const timer = window.setTimeout(() => {
        scrollToHashTarget(hash)
      }, 0)
      return () => window.clearTimeout(timer)
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname, search, hash])

  return null
}
