type Props = {
  saving: boolean
  publishing?: boolean
  onSave: () => void | Promise<void>
  onPublish?: () => void | Promise<void>
  onCancel: () => void
  saveLabel?: string
  publishLabel?: string
  disableSave?: boolean
  disablePublish?: boolean
  statusLabel?: string | null
  className?: string
}

export function AdminFormActions({
  saving,
  publishing = false,
  onSave,
  onPublish,
  onCancel,
  saveLabel = 'Save Draft',
  publishLabel = 'Publish',
  disableSave = false,
  disablePublish = false,
  statusLabel = null,
  className = '',
}: Props) {
  const busy = saving || publishing
  return (
    <div className={`flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4 ${className}`.trim()}>
      <button
        type="button"
        onClick={() => void onSave()}
        disabled={disableSave || busy}
        className="inline-flex min-h-10 items-center justify-center rounded-xl bg-slate-800 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
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
      {onPublish ? (
        <button
          type="button"
          onClick={() => void onPublish()}
          disabled={disablePublish || busy}
          className="inline-flex min-h-10 items-center justify-center rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {publishing ? (
            <span className="inline-flex items-center gap-2">
              <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
              Publishing…
            </span>
          ) : (
            publishLabel
          )}
        </button>
      ) : null}
      <button
        type="button"
        onClick={onCancel}
        disabled={busy}
        className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
      >
        Cancel
      </button>
      {statusLabel ? (
        <span className="text-xs font-medium text-slate-500 sm:ml-auto">{statusLabel}</span>
      ) : null}
    </div>
  )
}
