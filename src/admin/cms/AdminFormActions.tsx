type Props = {
  saving: boolean
  onSave: () => void | Promise<void>
  onCancel: () => void
  saveLabel?: string
  disableSave?: boolean
  className?: string
}

export function AdminFormActions({
  saving,
  onSave,
  onCancel,
  saveLabel = 'Save Changes',
  disableSave = false,
  className = '',
}: Props) {
  return (
    <div className={`flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4 ${className}`.trim()}>
      <button
        type="button"
        onClick={() => void onSave()}
        disabled={disableSave || saving}
        className="inline-flex min-h-10 items-center justify-center rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? (
          <span className="inline-flex items-center gap-2">
            <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
            Saving…
          </span>
        ) : (
          saveLabel
        )}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
      >
        Cancel
      </button>
    </div>
  )
}
