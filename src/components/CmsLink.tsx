import { Link } from 'react-router-dom'

type Props = {
  to: string
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export function CmsLink({ to, className, children, onClick }: Props) {
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
  return (
    <Link to={to} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
