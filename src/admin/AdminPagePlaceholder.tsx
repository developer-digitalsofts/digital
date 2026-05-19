import { Link } from 'react-router-dom'

type Props = {
  title: string
  description: string
}

export function AdminPagePlaceholder({ title, description }: Props) {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-xl font-bold text-slate-900">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
      <p className="mt-6 text-sm text-slate-500">
        For now, your marketing homepage is edited under{' '}
        <Link to="/admin/pages/home" className="font-semibold text-brand hover:underline">
          Pages → Home Page
        </Link>
        . Additional page editors can be added here later.
      </p>
    </div>
  )
}
