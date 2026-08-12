import { BilingualInputs } from '../cms/BilingualInputs'
import { AdminLayoutMediaField } from '../layout/AdminLayoutMediaField'
import type { Bilingual } from '../../cms/types'
import type { PageSectionRecord, SectionType } from '../../cms/sectionCatalog'

type Props = {
  section: PageSectionRecord
  onChange: (next: PageSectionRecord) => void
}

function bi(en = '', ar = ''): Bilingual {
  return { en, ar }
}

function setContent(section: PageSectionRecord, patch: Record<string, unknown>): PageSectionRecord {
  return { ...section, content: { ...(section.content || {}), ...patch } }
}

export function SectionEditorForm({ section, onChange }: Props) {
  const c = section.content || {}

  const setBi = (key: string, value: Bilingual) => onChange(setContent(section, { [key]: value }))
  const setVal = (key: string, value: unknown) => onChange(setContent(section, { [key]: value }))

  const renderItemsEditor = (
    key: string,
    fields: ('title' | 'description' | 'value' | 'icon' | 'accentColor' | 'href' | 'question' | 'answer' | 'name' | 'price')[],
  ) => {
    const items = (c[key] as Record<string, unknown>[]) || []
    return (
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={String(item.id || idx)} className="rounded-xl border border-slate-200 p-3 space-y-2">
            {fields.includes('icon') ? (
              <label className="block text-xs font-semibold text-slate-700">
                Icon name
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                  value={String(item.icon || '')}
                  onChange={(e) => {
                    const next = items.map((row, i) => (i === idx ? { ...row, icon: e.target.value } : row))
                    setVal(key, next)
                  }}
                />
              </label>
            ) : null}
            {fields.includes('accentColor') ? (
              <label className="block text-xs font-semibold text-slate-700">
                Accent colour
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                  value={String(item.accentColor || '')}
                  onChange={(e) => {
                    const next = items.map((row, i) => (i === idx ? { ...row, accentColor: e.target.value } : row))
                    setVal(key, next)
                  }}
                />
              </label>
            ) : null}
            {fields.includes('title') ? (
              <BilingualInputs
                labelEn="Title (English)"
                labelAr="Title (Arabic)"
                value={bi(String((item.title as Bilingual)?.en || ''), String((item.title as Bilingual)?.ar || ''))}
                onChange={(title) => {
                  const next = items.map((row, i) => (i === idx ? { ...row, title } : row))
                  setVal(key, next)
                }}
              />
            ) : null}
            {fields.includes('name') ? (
              <BilingualInputs
                labelEn="Name (English)"
                labelAr="Name (Arabic)"
                value={bi(String((item.name as Bilingual)?.en || ''), String((item.name as Bilingual)?.ar || ''))}
                onChange={(name) => {
                  const next = items.map((row, i) => (i === idx ? { ...row, name } : row))
                  setVal(key, next)
                }}
              />
            ) : null}
            {fields.includes('description') ? (
              <BilingualInputs
                labelEn="Description (English)"
                labelAr="Description (Arabic)"
                multiline
                value={bi(String((item.description as Bilingual)?.en || ''), String((item.description as Bilingual)?.ar || ''))}
                onChange={(description) => {
                  const next = items.map((row, i) => (i === idx ? { ...row, description } : row))
                  setVal(key, next)
                }}
              />
            ) : null}
            {fields.includes('question') ? (
              <BilingualInputs
                labelEn="Question (English)"
                labelAr="Question (Arabic)"
                value={bi(String((item.question as Bilingual)?.en || ''), String((item.question as Bilingual)?.ar || ''))}
                onChange={(question) => {
                  const next = items.map((row, i) => (i === idx ? { ...row, question } : row))
                  setVal(key, next)
                }}
              />
            ) : null}
            {fields.includes('answer') ? (
              <BilingualInputs
                labelEn="Answer (English)"
                labelAr="Answer (Arabic)"
                multiline
                value={bi(String((item.answer as Bilingual)?.en || ''), String((item.answer as Bilingual)?.ar || ''))}
                onChange={(answer) => {
                  const next = items.map((row, i) => (i === idx ? { ...row, answer } : row))
                  setVal(key, next)
                }}
              />
            ) : null}
            {fields.includes('value') ? (
              <label className="block text-xs font-semibold text-slate-700">
                Value
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                  value={String(item.value || '')}
                  onChange={(e) => {
                    const next = items.map((row, i) => (i === idx ? { ...row, value: e.target.value } : row))
                    setVal(key, next)
                  }}
                />
              </label>
            ) : null}
            {fields.includes('price') ? (
              <BilingualInputs
                labelEn="Price (English)"
                labelAr="Price (Arabic)"
                value={bi(String((item.price as Bilingual)?.en || ''), String((item.price as Bilingual)?.ar || ''))}
                onChange={(price) => {
                  const next = items.map((row, i) => (i === idx ? { ...row, price } : row))
                  setVal(key, next)
                }}
              />
            ) : null}
            {fields.includes('href') ? (
              <label className="block text-xs font-semibold text-slate-700">
                Link URL
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                  value={String(item.href || '')}
                  onChange={(e) => {
                    const next = items.map((row, i) => (i === idx ? { ...row, href: e.target.value } : row))
                    setVal(key, next)
                  }}
                />
              </label>
            ) : null}
          </div>
        ))}
      </div>
    )
  }

  const ctaPair = (prefix: 'ctaPrimary' | 'ctaSecondary' | 'primary' | 'secondary', label: string) => {
    const row = (c[prefix] as { label?: Bilingual; href?: string }) || {}
    return (
      <div className="space-y-2 rounded-xl border border-slate-200 p-3">
        <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
        <BilingualInputs
          labelEn="Label (English)"
          labelAr="Label (Arabic)"
          value={bi(row.label?.en || '', row.label?.ar || '')}
          onChange={(lbl) => setVal(prefix, { ...row, label: lbl })}
        />
        <label className="block text-xs font-semibold text-slate-700">
          Link
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            value={row.href || ''}
            onChange={(e) => setVal(prefix, { ...row, href: e.target.value })}
          />
        </label>
      </div>
    )
  }

  switch (section.type as SectionType) {
    case 'hero':
      return (
        <div className="space-y-4">
          <BilingualInputs labelEn="Pill (English)" labelAr="Pill (Arabic)" value={bi(String((c.pill as Bilingual)?.en || ''), String((c.pill as Bilingual)?.ar || ''))} onChange={(pill) => setBi('pill', pill)} />
          <BilingualInputs labelEn="Title before accent (English)" labelAr="Title before accent (Arabic)" value={bi(String((c.titleBefore as Bilingual)?.en || ''), String((c.titleBefore as Bilingual)?.ar || ''))} onChange={(titleBefore) => setBi('titleBefore', titleBefore)} />
          <BilingualInputs labelEn="Accent text (English)" labelAr="Accent text (Arabic)" value={bi(String((c.titleAccent as Bilingual)?.en || ''), String((c.titleAccent as Bilingual)?.ar || ''))} onChange={(titleAccent) => setBi('titleAccent', titleAccent)} />
          <BilingualInputs labelEn="Title line 2 (English)" labelAr="Title line 2 (Arabic)" value={bi(String((c.titleLine2 as Bilingual)?.en || ''), String((c.titleLine2 as Bilingual)?.ar || ''))} onChange={(titleLine2) => setBi('titleLine2', titleLine2)} />
          <BilingualInputs labelEn="Description (English)" labelAr="Description (Arabic)" multiline rows={4} value={bi(String((c.body as Bilingual)?.en || ''), String((c.body as Bilingual)?.ar || ''))} onChange={(body) => setBi('body', body)} />
          {ctaPair('ctaPrimary', 'Primary button')}
          {ctaPair('ctaSecondary', 'Secondary button')}
          <AdminLayoutMediaField label="Hero image" value={String(c.imageUrl || '')} onChange={(imageUrl) => setVal('imageUrl', imageUrl)} />
          <BilingualInputs labelEn="Image alt (English)" labelAr="Image alt (Arabic)" value={bi(String((c.imageAlt as Bilingual)?.en || ''), String((c.imageAlt as Bilingual)?.ar || ''))} onChange={(imageAlt) => setBi('imageAlt', imageAlt)} />
        </div>
      )
    case 'stats':
      return (
        <div className="space-y-4">
          <BilingualInputs labelEn="Section title (English)" labelAr="Section title (Arabic)" value={bi(String((c.title as Bilingual)?.en || ''), String((c.title as Bilingual)?.ar || ''))} onChange={(title) => setBi('title', title)} />
          {renderItemsEditor('items', ['value', 'icon', 'accentColor', 'title'])}
        </div>
      )
    case 'imageText':
      return (
        <div className="space-y-4">
          <BilingualInputs labelEn="Eyebrow (English)" labelAr="Eyebrow (Arabic)" value={bi(String((c.eyebrow as Bilingual)?.en || ''), String((c.eyebrow as Bilingual)?.ar || ''))} onChange={(eyebrow) => setBi('eyebrow', eyebrow)} />
          <BilingualInputs labelEn="Heading (English)" labelAr="Heading (Arabic)" value={bi(String((c.heading as Bilingual)?.en || ''), String((c.heading as Bilingual)?.ar || ''))} onChange={(heading) => setBi('heading', heading)} />
          <BilingualInputs labelEn="Body (English)" labelAr="Body (Arabic)" multiline rows={5} value={bi(String((c.body as Bilingual)?.en || ''), String((c.body as Bilingual)?.ar || ''))} onChange={(body) => setBi('body', body)} />
          <AdminLayoutMediaField label="Image" value={String(c.imageUrl || '')} onChange={(imageUrl) => setVal('imageUrl', imageUrl)} />
          <BilingualInputs labelEn="Image alt (English)" labelAr="Image alt (Arabic)" value={bi(String((c.imageAlt as Bilingual)?.en || ''), String((c.imageAlt as Bilingual)?.ar || ''))} onChange={(imageAlt) => setBi('imageAlt', imageAlt)} />
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <input type="checkbox" checked={c.imageLeft === true} onChange={(e) => setVal('imageLeft', e.target.checked)} />
            Image on left
          </label>
          {ctaPair('ctaPrimary', 'Primary button')}
        </div>
      )
    case 'featureCards':
      return (
        <div className="space-y-4">
          <BilingualInputs labelEn="Title (English)" labelAr="Title (Arabic)" value={bi(String((c.title as Bilingual)?.en || ''), String((c.title as Bilingual)?.ar || ''))} onChange={(title) => setBi('title', title)} />
          <BilingualInputs labelEn="Subtitle (English)" labelAr="Subtitle (Arabic)" value={bi(String((c.subtitle as Bilingual)?.en || ''), String((c.subtitle as Bilingual)?.ar || ''))} onChange={(subtitle) => setBi('subtitle', subtitle)} />
          {renderItemsEditor('items', ['icon', 'accentColor', 'title', 'description'])}
        </div>
      )
    case 'featureStrip':
      return <div className="space-y-4">{renderItemsEditor('items', ['icon', 'title'])}</div>
    case 'comparison':
      return (
        <div className="space-y-4">
          <BilingualInputs labelEn="Title (English)" labelAr="Title (Arabic)" value={bi(String((c.title as Bilingual)?.en || ''), String((c.title as Bilingual)?.ar || ''))} onChange={(title) => setBi('title', title)} />
          <BilingualInputs labelEn="Left column title (English)" labelAr="Left column title (Arabic)" value={bi(String((c.leftTitle as Bilingual)?.en || ''), String((c.leftTitle as Bilingual)?.ar || ''))} onChange={(leftTitle) => setBi('leftTitle', leftTitle)} />
          <BilingualInputs labelEn="Right column title (English)" labelAr="Right column title (Arabic)" value={bi(String((c.rightTitle as Bilingual)?.en || ''), String((c.rightTitle as Bilingual)?.ar || ''))} onChange={(rightTitle) => setBi('rightTitle', rightTitle)} />
        </div>
      )
    case 'workflowSteps':
      return (
        <div className="space-y-4">
          <BilingualInputs labelEn="Title (English)" labelAr="Title (Arabic)" value={bi(String((c.title as Bilingual)?.en || ''), String((c.title as Bilingual)?.ar || ''))} onChange={(title) => setBi('title', title)} />
          <BilingualInputs labelEn="Subtitle (English)" labelAr="Subtitle (Arabic)" value={bi(String((c.subtitle as Bilingual)?.en || ''), String((c.subtitle as Bilingual)?.ar || ''))} onChange={(subtitle) => setBi('subtitle', subtitle)} />
          {renderItemsEditor('steps', ['title', 'description'])}
        </div>
      )
    case 'modules':
    case 'industries':
      return (
        <div className="space-y-4">
          <BilingualInputs labelEn="Title (English)" labelAr="Title (Arabic)" value={bi(String((c.title as Bilingual)?.en || ''), String((c.title as Bilingual)?.ar || ''))} onChange={(title) => setBi('title', title)} />
          <BilingualInputs labelEn="Subtitle (English)" labelAr="Subtitle (Arabic)" value={bi(String((c.subtitle as Bilingual)?.en || ''), String((c.subtitle as Bilingual)?.ar || ''))} onChange={(subtitle) => setBi('subtitle', subtitle)} />
          {renderItemsEditor('items', ['icon', 'accentColor', 'title', 'description', 'href'])}
        </div>
      )
    case 'pricing':
      return (
        <div className="space-y-4">
          <BilingualInputs labelEn="Title (English)" labelAr="Title (Arabic)" value={bi(String((c.title as Bilingual)?.en || ''), String((c.title as Bilingual)?.ar || ''))} onChange={(title) => setBi('title', title)} />
          <BilingualInputs labelEn="Subtitle (English)" labelAr="Subtitle (Arabic)" value={bi(String((c.subtitle as Bilingual)?.en || ''), String((c.subtitle as Bilingual)?.ar || ''))} onChange={(subtitle) => setBi('subtitle', subtitle)} />
          {renderItemsEditor('plans', ['name', 'price', 'accentColor', 'href'])}
        </div>
      )
    case 'faqs':
      return (
        <div className="space-y-4">
          <BilingualInputs labelEn="Title (English)" labelAr="Title (Arabic)" value={bi(String((c.title as Bilingual)?.en || ''), String((c.title as Bilingual)?.ar || ''))} onChange={(title) => setBi('title', title)} />
          {renderItemsEditor('items', ['question', 'answer'])}
        </div>
      )
    case 'cta':
      return (
        <div className="space-y-4">
          <BilingualInputs labelEn="Title (English)" labelAr="Title (Arabic)" value={bi(String((c.title as Bilingual)?.en || ''), String((c.title as Bilingual)?.ar || ''))} onChange={(title) => setBi('title', title)} />
          <BilingualInputs labelEn="Body (English)" labelAr="Body (Arabic)" multiline value={bi(String((c.body as Bilingual)?.en || ''), String((c.body as Bilingual)?.ar || ''))} onChange={(body) => setBi('body', body)} />
          {ctaPair('primary', 'Primary button')}
          {ctaPair('secondary', 'Secondary button')}
        </div>
      )
    case 'richText':
    default:
      return (
        <div className="space-y-4">
          <BilingualInputs labelEn="Heading (English)" labelAr="Heading (Arabic)" value={bi(String((c.heading as Bilingual)?.en || ''), String((c.heading as Bilingual)?.ar || ''))} onChange={(heading) => setBi('heading', heading)} />
          <BilingualInputs labelEn="Body (English)" labelAr="Body (Arabic)" multiline rows={8} value={bi(String((c.body as Bilingual)?.en || ''), String((c.body as Bilingual)?.ar || ''))} onChange={(body) => setBi('body', body)} />
        </div>
      )
  }
}
