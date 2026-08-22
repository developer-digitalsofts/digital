import { Link } from 'react-router-dom'

/** Homepage editor tab — full management lives under Content → Testimonials. */
export function HomeTestimonialsForm() {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
      <p className="font-semibold text-slate-900">Testimonials are managed in the Content module.</p>
      <p className="mt-2">
        Use <Link to="/admin/content/testimonials" className="font-semibold text-brand">Content → Testimonials</Link> to add verified client quotes, publish testimonials, and configure the homepage section and `/testimonials` page.
      </p>
    </div>
  )
}
