import { useCallback, useRef, type ChangeEvent } from 'react'
import { adminFetch, adminDownloadBlob } from './adminApi'
import { useAdminToast } from './AdminToastContext'

export function AdminBackup() {
  const toast = useAdminToast()
  const inputRef = useRef<HTMLInputElement>(null)

  const exportBackup = useCallback(async () => {
    try {
      const blob = await adminDownloadBlob('/api/admin/backup/export')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `digitalmanager-cms-backup-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.push('Backup downloaded', 'success')
    } catch (e) {
      toast.push(e instanceof Error ? e.message : 'Export failed', 'error')
    }
  }, [toast])

  const onImportFile = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const text = await file.text()
      let parsed: unknown
      try {
        parsed = JSON.parse(text)
      } catch {
        toast.push('File is not valid JSON', 'error')
        e.target.value = ''
        return
      }
      if (typeof parsed !== 'object' || parsed === null) {
        toast.push('Invalid backup structure', 'error')
        e.target.value = ''
        return
      }
      const obj = parsed as Record<string, unknown>
      const files =
        'files' in obj && obj.files && typeof obj.files === 'object' && !Array.isArray(obj.files)
          ? (obj.files as Record<string, unknown>)
          : obj
      const payload = { files }
      const jsonKeys = Object.keys(files).filter((k) => k.endsWith('.json'))
      if (jsonKeys.length === 0) {
        toast.push('Backup must include JSON file entries (*.json)', 'error')
        e.target.value = ''
        return
      }
      if (
        !window.confirm(
          'Import will overwrite JSON data files on the server. A pre-import snapshot of each file is saved when possible. Continue?',
        )
      ) {
        e.target.value = ''
        return
      }
      try {
        const res = await adminFetch<{ imported?: number }>('/api/admin/backup/import', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        toast.push(`Imported ${res.imported ?? 0} file(s). Reload the admin if values look stale.`, 'success')
      } catch (err) {
        toast.push(err instanceof Error ? err.message : 'Import failed', 'error')
      }
      e.target.value = ''
    },
    [toast],
  )

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Backup & restore</h1>
        <p className="text-sm text-slate-600">
          Export a single JSON bundle of all CMS data files, or import a bundle previously exported from this installation.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Export</h2>
        <p className="mt-2 text-sm text-slate-600">Downloads all <code className="text-xs">server/data/*.json</code> definitions in one file.</p>
        <button
          type="button"
          onClick={exportBackup}
          className="mt-4 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-brand-dark"
        >
          Download backup
        </button>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-amber-900">Import</h2>
        <p className="mt-2 text-sm text-amber-950/90">
          Only use trusted backup files. Invalid structure will be rejected. Existing files are copied as <code className="text-xs">backup-pre-import-*</code> when possible before overwrite.
        </p>
        <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={onImportFile} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 rounded-xl border border-amber-300 bg-white px-5 py-2.5 text-sm font-semibold text-amber-950 shadow-sm hover:bg-amber-100/80"
        >
          Choose backup JSON…
        </button>
      </div>
    </div>
  )
}
