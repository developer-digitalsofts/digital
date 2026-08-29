import { Link } from 'react-router-dom'
import { PK_CITY_NAMES, PK_CITY_SLUGS } from '../market/pakistanConfig'
import { pageShellClass } from '../ui/pageShell'
import { sectionPad } from '../ui/saas'

export function CitiesIndexPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50/50">
        <div className={`${pageShellClass} ${sectionPad}`}>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            DigitalManager across Pakistan
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-[1.65] text-slate-600">
            DigitalManager provides localized cloud ERP pages for businesses in every major Pakistan city.
            Each city URL opens the complete DigitalManager homepage with city-specific copy for finance,
            inventory, POS, payroll and multi-branch operations. These pages are published for customers
            and crawlers — choose a city to open its full product experience.
          </p>
        </div>
      </section>

      <section className={`${pageShellClass} ${sectionPad}`}>
        <h2 className="font-heading text-xl font-bold text-slate-900">City pages</h2>
        <p className="mt-2 max-w-3xl text-base leading-[1.65] text-slate-600">
          Open a city to see DigitalManager ERP software positioned for that market. Service availability
          is national; a city page does not imply a local DigitalManager office.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PK_CITY_SLUGS.map((slug) => (
            <li key={slug}>
              <Link
                to={`/${slug}`}
                className="flex min-h-14 items-center rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 transition-colors hover:border-brand hover:text-brand"
              >
                DigitalManager in {PK_CITY_NAMES[slug]}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
