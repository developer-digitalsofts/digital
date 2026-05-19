import type { Bilingual } from '../../cms/types'

type Props = {
  value: Bilingual
  onChange: (next: Bilingual) => void
  labelEn: string
  labelAr: string
  multiline?: boolean
  rows?: number
}

export function BilingualInputs({ value, onChange, labelEn, labelAr, multiline, rows = 4 }: Props) {
  const Field = multiline ? 'textarea' : 'input'
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm">
        <span className="mb-1 block font-semibold text-slate-800">{labelEn}</span>
        <Field
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-brand/30 focus:ring-2"
          value={value.en}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
          rows={multiline ? rows : undefined}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-semibold text-slate-800">{labelAr}</span>
        <Field
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-brand/30 focus:ring-2"
          dir="rtl"
          value={value.ar}
          onChange={(e) => onChange({ ...value, ar: e.target.value })}
          rows={multiline ? rows : undefined}
        />
      </label>
    </div>
  )
}
