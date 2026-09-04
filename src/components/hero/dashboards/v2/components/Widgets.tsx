import { Sparkles } from 'lucide-react'

export function AiInsightPanel({
  message,
  action,
  variant = 'inline',
}: {
  message: string
  action: string
  variant?: 'inline' | 'float'
}) {
  return (
    <div className={`dm-mock-v2__ai ${variant === 'float' ? 'dm-mock-v2__ai--float' : ''}`}>
      <div className="dm-mock-v2__ai-icon" aria-hidden>
        <Sparkles strokeWidth={2} />
      </div>
      <div className="dm-mock-v2__ai-body">
        <p>{message}</p>
        <button type="button" className="dm-mock-v2__ai-link" tabIndex={-1}>
          {action}
        </button>
      </div>
    </div>
  )
}

export function ActivityList({ items }: { items: { title: string; meta: string; amount?: string; tone?: 'default' | 'positive' | 'warning' }[] }) {
  return (
    <ul className="dm-mock-v2__activity">
      {items.map((item) => (
        <li key={item.title + item.meta}>
          <div>
            <span className="dm-mock-v2__activity-title">{item.title}</span>
            <span className="dm-mock-v2__activity-meta">{item.meta}</span>
          </div>
          {item.amount ? <span className={`dm-mock-v2__activity-amt dm-mock-v2__activity-amt--${item.tone ?? 'default'}`}>{item.amount}</span> : null}
        </li>
      ))}
    </ul>
  )
}

export function CompactList({ items }: { items: { label: string; value: string; hint?: string }[] }) {
  return (
    <ul className="dm-mock-v2__compact-list">
      {items.map((item) => (
        <li key={item.label}>
          <span>{item.label}</span>
          <span className="dm-mock-v2__compact-list-val">{item.value}</span>
          {item.hint ? <span className="dm-mock-v2__compact-list-hint">{item.hint}</span> : null}
        </li>
      ))}
    </ul>
  )
}

export function TillStatus({ items }: { items: { label: string; count: number; tone: 'live' | 'idle' | 'offline' }[] }) {
  return (
    <div className="dm-mock-v2__tills">
      {items.map((t) => (
        <div key={t.label} className={`dm-mock-v2__till dm-mock-v2__till--${t.tone}`}>
          <span className="dm-mock-v2__till-dot" aria-hidden />
          <span>{t.label}</span>
          <strong>{t.count}</strong>
        </div>
      ))}
    </div>
  )
}
