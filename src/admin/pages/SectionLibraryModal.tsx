import { X } from 'lucide-react'
import { SECTION_LIBRARY, type SectionType } from '../../cms/sectionCatalog'

type Props = {
  open: boolean
  onClose: () => void
  onSelect: (type: SectionType) => void
  busy?: boolean
}

export function SectionLibraryModal({ open, onClose, onSelect, busy }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add New Section</h2>
            <p className="text-sm text-slate-600">Choose an approved template. Each section uses existing public styling.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close">
            <X className="size-5" />
          </button>
        </div>
        <div className="grid gap-3 overflow-y-auto p-5 sm:grid-cols-2 lg:grid-cols-3">
          {SECTION_LIBRARY.map((item) => (
            <div key={item.type} className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="mb-3 flex h-20 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-xs font-bold uppercase tracking-wide text-slate-400">
                Preview
              </div>
              <h3 className="font-bold text-slate-900">{item.name}</h3>
              <p className="mt-1 flex-1 text-xs text-slate-600">{item.description}</p>
              <button
                type="button"
                disabled={busy}
                onClick={() => onSelect(item.type)}
                className="mt-4 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
