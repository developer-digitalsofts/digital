import { Check, X } from 'lucide-react'
import type { DetailChallengeSolutionModel } from '../../../types/detailPageSections'
import { detailShellClass } from './detailConstants'

type Props = {
  model: DetailChallengeSolutionModel
}

export function ChallengeSolution({ model }: Props) {
  return (
    <section className="accounts-proto__section">
      <div className={detailShellClass}>
        <div className="accounts-proto-compare">
          <div className="accounts-proto-compare__col accounts-proto-compare__col--challenge">
            <h2 className="accounts-proto-compare__title">{model.challengeHeading}</h2>
            {model.challengeIntro ? <p className="accounts-proto-compare__intro">{model.challengeIntro}</p> : null}
            {model.challengeListLead ? (
              <p className="accounts-proto-compare__lead">{model.challengeListLead}</p>
            ) : null}
            {model.challenges.length > 0 ? (
              <ul className="accounts-proto-compare__list">
                {model.challenges.map((item) => (
                  <li key={item}>
                    <X className="size-4 shrink-0 text-red-500" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="accounts-proto-compare__col accounts-proto-compare__col--solution">
            <h2 className="accounts-proto-compare__title">{model.solutionHeading}</h2>
            <ul className="accounts-proto-compare__list accounts-proto-compare__list--solution">
              {model.solutions.map((item) => (
                <li key={item}>
                  <Check className="size-4 shrink-0 text-emerald-600" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
