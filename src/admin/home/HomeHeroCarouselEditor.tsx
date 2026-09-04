import type { HeroCarouselSlide, HeroModuleType } from '../../types/heroCarousel'
import { BilingualInputs } from '../cms/BilingualInputs'

const MODULE_TYPES: HeroModuleType[] = ['erp', 'finance', 'inventory', 'pos', 'hr']

const MODULE_ICONS: Record<HeroModuleType, string> = {
  erp: 'LayoutGrid',
  finance: 'Wallet',
  inventory: 'Package',
  pos: 'ShoppingCart',
  hr: 'Users',
}

function sortSlides(slides: HeroCarouselSlide[]) {
  return [...slides].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

type Props = {
  slides: HeroCarouselSlide[]
  carouselEnabled: boolean
  autoplayEnabled: boolean
  autoplayDurationMs: number
  onChange: (next: {
    slides: HeroCarouselSlide[]
    carouselEnabled: boolean
    autoplayEnabled: boolean
    autoplayDurationMs: number
  }) => void
}

export function HomeHeroCarouselEditor({ slides, carouselEnabled, autoplayEnabled, autoplayDurationMs, onChange }: Props) {
  const sorted = sortSlides(slides)
  const patch = (nextSlides: HeroCarouselSlide[]) =>
    onChange({ slides: nextSlides, carouselEnabled, autoplayEnabled, autoplayDurationMs })

  const updateSlide = (id: string, partial: Partial<HeroCarouselSlide>) => {
    patch(sorted.map((s) => (s.id === id ? { ...s, ...partial } : s)))
  }

  return (
    <div className="space-y-4 border-t border-slate-100 pt-6">
      <h3 className="text-sm font-bold text-slate-900">Hero carousel</h3>

      <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <input
          type="checkbox"
          checked={carouselEnabled}
          onChange={(e) =>
            onChange({ slides: sorted, carouselEnabled: e.target.checked, autoplayEnabled, autoplayDurationMs })
          }
        />
        Enable module carousel on homepage
      </label>

      <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <input
          type="checkbox"
          checked={autoplayEnabled}
          onChange={(e) =>
            onChange({ slides: sorted, carouselEnabled, autoplayEnabled: e.target.checked, autoplayDurationMs })
          }
        />
        Autoplay slides
      </label>

      <label className="block text-sm">
        <span className="font-semibold text-slate-800">Autoplay duration (ms)</span>
        <input
          type="number"
          min={3000}
          max={30000}
          step={500}
          className="mt-1 w-40 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          value={autoplayDurationMs}
          onChange={(e) =>
            onChange({
              slides: sorted,
              carouselEnabled,
              autoplayEnabled,
              autoplayDurationMs: Number(e.target.value) || 7000,
            })
          }
        />
      </label>

      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Slides ({sorted.length})</p>
        <button
          type="button"
          className="text-xs font-bold uppercase tracking-wide text-brand hover:underline"
          onClick={() => {
            const id = `slide-${crypto.randomUUID().slice(0, 8)}`
            patch([
              ...sorted,
              {
                id,
                moduleType: 'erp',
                navLabel: { en: 'New Module', ar: '' },
                navIcon: 'LayoutGrid',
                visible: true,
                sortOrder: sorted.length,
                pill: { en: '', ar: '' },
                titleBefore: { en: '', ar: '' },
                titleAccent: { en: '', ar: '' },
                body: { en: '', ar: '' },
                ctaPrimary: { label: { en: 'Book Free Demo', ar: '' }, href: '#get-demo' },
                ctaSecondary: { label: { en: 'Explore', ar: '' }, href: '/#modules' },
                dashboardImageUrl: '',
              },
            ])
          }}
        >
          + Add slide
        </button>
      </div>

      <div className="space-y-6">
        {sorted.map((slide, idx) => (
          <details key={slide.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4" open={idx === 0}>
            <summary className="cursor-pointer text-sm font-bold text-slate-900">
              {slide.navLabel.en || slide.moduleType} · order {slide.sortOrder ?? idx}
            </summary>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Module type</span>
                <select
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={slide.moduleType}
                  onChange={(e) => {
                    const moduleType = e.target.value as HeroModuleType
                    updateSlide(slide.id, {
                      moduleType,
                      navIcon: MODULE_ICONS[moduleType],
                    })
                  }}
                >
                  {MODULE_TYPES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Nav icon (Lucide name)</span>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono"
                  value={slide.navIcon}
                  onChange={(e) => updateSlide(slide.id, { navIcon: e.target.value })}
                />
              </label>

              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Sort order</span>
                <input
                  type="number"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={slide.sortOrder ?? idx}
                  onChange={(e) => updateSlide(slide.id, { sortOrder: Number(e.target.value) || 0 })}
                />
              </label>

              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={slide.visible !== false}
                  onChange={(e) => updateSlide(slide.id, { visible: e.target.checked })}
                />
                Show slide on homepage
              </label>

              <div className="sm:col-span-2">
                <BilingualInputs
                  labelEn="Navigation label (EN)"
                  labelAr="Navigation label (AR)"
                  value={slide.navLabel}
                  onChange={(navLabel) => updateSlide(slide.id, { navLabel })}
                />
              </div>

              <div className="sm:col-span-2">
                <BilingualInputs
                  labelEn="Eyebrow (EN)"
                  labelAr="Eyebrow (AR)"
                  value={slide.pill}
                  onChange={(pill) => updateSlide(slide.id, { pill })}
                />
              </div>

              <BilingualInputs
                labelEn="Heading before accent (EN)"
                labelAr="Heading before accent (AR)"
                value={slide.titleBefore}
                onChange={(titleBefore) => updateSlide(slide.id, { titleBefore })}
              />
              <BilingualInputs
                labelEn="Heading accent (EN)"
                labelAr="Heading accent (AR)"
                value={slide.titleAccent}
                onChange={(titleAccent) => updateSlide(slide.id, { titleAccent })}
              />
              <BilingualInputs
                labelEn="Heading line 2 (EN, optional)"
                labelAr="Heading line 2 (AR, optional)"
                value={slide.titleLine2 ?? { en: '', ar: '' }}
                onChange={(titleLine2) => updateSlide(slide.id, { titleLine2 })}
              />

              <div className="sm:col-span-2">
                <BilingualInputs
                  labelEn="Description (EN)"
                  labelAr="Description (AR)"
                  multiline
                  rows={3}
                  value={slide.body}
                  onChange={(body) => updateSlide(slide.id, { body })}
                />
              </div>

              <BilingualInputs
                labelEn="Primary CTA label (EN)"
                labelAr="Primary CTA label (AR)"
                value={slide.ctaPrimary.label}
                onChange={(label) =>
                  updateSlide(slide.id, { ctaPrimary: { ...slide.ctaPrimary, label } })
                }
              />
              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Primary CTA link</span>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={slide.ctaPrimary.href}
                  onChange={(e) =>
                    updateSlide(slide.id, { ctaPrimary: { ...slide.ctaPrimary, href: e.target.value } })
                  }
                  placeholder="#get-demo"
                />
              </label>

              <BilingualInputs
                labelEn="Secondary CTA label (EN)"
                labelAr="Secondary CTA label (AR)"
                value={slide.ctaSecondary.label}
                onChange={(label) =>
                  updateSlide(slide.id, { ctaSecondary: { ...slide.ctaSecondary, label } })
                }
              />
              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Secondary CTA link</span>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={slide.ctaSecondary.href}
                  onChange={(e) =>
                    updateSlide(slide.id, { ctaSecondary: { ...slide.ctaSecondary, href: e.target.value } })
                  }
                />
              </label>

              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Mockup mode</span>
                <select
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={slide.mockupMode ?? 'component'}
                  onChange={(e) =>
                    updateSlide(slide.id, { mockupMode: e.target.value as 'component' | 'image' })
                  }
                >
                  <option value="component">Component (built-in dashboard)</option>
                  <option value="image">Image</option>
                </select>
              </label>

              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Mockup module override</span>
                <select
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={slide.mockupModule ?? slide.moduleType}
                  onChange={(e) =>
                    updateSlide(slide.id, { mockupModule: e.target.value as HeroModuleType })
                  }
                >
                  {MODULE_TYPES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm sm:col-span-2">
                <span className="font-semibold text-slate-800">Dashboard image URL (optional legacy)</span>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={slide.mockupImage ?? slide.dashboardImageUrl ?? ''}
                  onChange={(e) =>
                    updateSlide(slide.id, {
                      mockupImage: e.target.value,
                      dashboardImageUrl: e.target.value,
                      mockupMode: e.target.value.trim() ? 'image' : slide.mockupMode ?? 'component',
                    })
                  }
                  placeholder="Leave empty — built-in dashboard mockup is used"
                />
              </label>

              <BilingualInputs
                labelEn="Mockup title override (EN)"
                labelAr="Mockup title override (AR)"
                value={slide.mockupData?.title ?? { en: '', ar: '' }}
                onChange={(title) =>
                  updateSlide(slide.id, { mockupData: { ...slide.mockupData, title } })
                }
              />

              <BilingualInputs
                labelEn="Mockup subtitle override (EN)"
                labelAr="Mockup subtitle override (AR)"
                value={slide.mockupData?.subtitle ?? { en: '', ar: '' }}
                onChange={(subtitle) =>
                  updateSlide(slide.id, { mockupData: { ...slide.mockupData, subtitle } })
                }
              />

              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={slide.mockupVisible !== false}
                  onChange={(e) => updateSlide(slide.id, { mockupVisible: e.target.checked })}
                />
                Show dashboard mockup for this slide
              </label>

              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <button
                  type="button"
                  className="text-xs font-bold text-slate-600 hover:underline"
                  disabled={idx === 0}
                  onClick={() => {
                    const arr = [...sorted]
                    const tmp = arr[idx - 1]
                    arr[idx - 1] = { ...arr[idx], sortOrder: idx - 1 }
                    arr[idx] = { ...tmp, sortOrder: idx }
                    patch(arr)
                  }}
                >
                  Move up
                </button>
                <button
                  type="button"
                  className="text-xs font-bold text-slate-600 hover:underline"
                  disabled={idx === sorted.length - 1}
                  onClick={() => {
                    const arr = [...sorted]
                    const tmp = arr[idx + 1]
                    arr[idx + 1] = { ...arr[idx], sortOrder: idx + 1 }
                    arr[idx] = { ...tmp, sortOrder: idx }
                    patch(arr)
                  }}
                >
                  Move down
                </button>
                <button
                  type="button"
                  className="text-xs font-bold text-red-600 hover:underline"
                  onClick={() => patch(sorted.filter((s) => s.id !== slide.id))}
                >
                  Delete slide
                </button>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
