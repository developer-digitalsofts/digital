import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type ToastKind = 'success' | 'error' | 'info'

export type ToastItem = { id: string; message: string; kind: ToastKind }

type Ctx = {
  push: (message: string, kind?: ToastKind) => void
  dismiss: (id: string) => void
}

const ToastCtx = createContext<Ctx | null>(null)

export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setItems((xs) => xs.filter((t) => t.id !== id))
  }, [])

  const push = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setItems((xs) => [...xs, { id, message, kind }])
    window.setTimeout(() => dismiss(id), 4500)
  }, [dismiss])

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[200] flex max-w-sm flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${
              t.kind === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : t.kind === 'error'
                  ? 'border-red-200 bg-red-50 text-red-900'
                  : 'border-slate-200 bg-white text-slate-800'
            }`}
            role="status"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useAdminToast() {
  const c = useContext(ToastCtx)
  if (!c) throw new Error('useAdminToast requires AdminToastProvider')
  return c
}
