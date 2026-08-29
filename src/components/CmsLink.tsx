import { Link, useNavigate } from 'react-router-dom'
import { useLocale } from '../locale/LocaleContext'
import { useOptionalCity } from '../locale/CityContext'

type Props = {
  to: string
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, '')
  if (!id) return
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function isExternalPath(path: string) {
  return /^(https?:|mailto:|tel:)/i.test(path)
}

export function CmsLink({ to, className, children, onClick }: Props) {
  const navigate = useNavigate()
  const { href: localeHref } = useLocale()
  const city = useOptionalCity()
  const resolveHref = (path: string) => {
    const localized = localeHref(path)
    return city?.cityHref(localized) || localized
  }

  if (isExternalPath(to)) {
    const external = /^https?:/i.test(to)
    return (
      <a
        href={to}
        className={className}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' as const } : {})}
      >
        {children}
      </a>
    )
  }

  const hashIndex = to.indexOf('#')
  if (hashIndex >= 0) {
    const path = to.slice(0, hashIndex) || '/'
    const hash = to.slice(hashIndex)
    const localized = resolveHref(path)
    return (
      <a
        href={`${localized}${hash}`}
        className={className}
        onClick={(e) => {
          onClick?.()
          e.preventDefault()
          navigate({ pathname: localized, hash: hash.replace(/^#/, '') })
          window.requestAnimationFrame(() => scrollToHash(hash))
        }}
      >
        {children}
      </a>
    )
  }

  const localized = resolveHref(to.startsWith('/') ? to : `/${to}`)
  return (
    <Link to={localized} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
