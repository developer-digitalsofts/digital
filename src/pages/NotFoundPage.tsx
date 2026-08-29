import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="content-page">
      <div className="content-page__container">
        <h1>Page not found</h1>
        <p className="content-page__intro">
          This city or path is not published on DigitalManager Pakistan. Check the URL or return to a
          published page.
        </p>
        <ul className="mt-6 space-y-2">
          <li>
            <Link to="/" className="font-semibold text-brand">
              Homepage
            </Link>
          </li>
          <li>
            <Link to="/cities" className="font-semibold text-brand">
              DigitalManager across Pakistan
            </Link>
          </li>
          <li>
            <a href="/sitemap.xml" className="font-semibold text-brand">
              Sitemap
            </a>
          </li>
          <li>
            <a href="/llms.txt" className="font-semibold text-brand">
              llms.txt
            </a>
          </li>
        </ul>
      </div>
    </main>
  )
}
