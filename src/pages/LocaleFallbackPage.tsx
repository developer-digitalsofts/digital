import { Link } from 'react-router-dom'
import { useLocale } from '../locale/LocaleContext'
import './content-pages.css'

export function LocaleFallbackPage() {
  const { localePrefix, country, lang } = useLocale()

  return (
    <main className="content-page">
      <div className="content-page__container">
        <h1>Page not available</h1>
        <p className="content-page__intro">
          This page is not yet published for {country.toUpperCase()} · {lang.toUpperCase()}. Browse the Pakistan English site or contact us for assistance.
        </p>
        <p>
          <Link to="/">Go to Pakistan homepage</Link>
          {' · '}
          <Link to={localePrefix || '/'}>Go to regional homepage</Link>
        </p>
      </div>
    </main>
  )
}
