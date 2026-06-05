import { Link, useNavigate } from 'react-router-dom'

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

export function CmsLink({ to, className, children, onClick }: Props) {
  const navigate = useNavigate()

  if (/^(https?:|mailto:|tel:)/i.test(to)) {
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
    return (
      <a
        href={to}
        className={className}
        onClick={(e) => {
          onClick?.()
          e.preventDefault()
          navigate({ pathname: path, hash: hash.replace(/^#/, '') })
          window.requestAnimationFrame(() => scrollToHash(hash))
        }}
      >
        {children}
      </a>
    )
  }

  return (
    <Link to={to} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
