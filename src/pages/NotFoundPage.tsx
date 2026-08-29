import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="content-page">
      <div className="content-page__container">
        <h1>Page not found</h1>
        <p className="content-page__intro">
          This city or path is not published on DigitalManager Pakistan. Check the URL or return to the homepage.
        </p>
        <p className="mt-4">
          <Link to="/" className="font-semibold text-brand">
            Back to homepage
          </Link>
        </p>
      </div>
    </main>
  )
}
