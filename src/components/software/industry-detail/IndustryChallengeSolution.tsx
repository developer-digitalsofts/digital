import { Check, X } from 'lucide-react'
import type { IndustryChallengeSolutionModel } from '../../../types/industryDetailPage'
import { industryShellClass } from './industryConstants'

type Props = { model: IndustryChallengeSolutionModel }

export function IndustryChallengeSolution({ model }: Props) {
  return (
    <section className="ind-section ind-section--compare">
      <div className={industryShellClass}>
        <div className="ind-compare">
          <div className="ind-compare__col ind-compare__col--challenge">
            <h2 className="ind-compare__title">{model.challengeHeading}</h2>
            <ul className="ind-compare__list">
              {model.challenges.map((item) => (
                <li key={item}>
                  <X className="ind-compare__icon ind-compare__icon--x" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ind-compare__vs" aria-hidden>
            <span>↔</span>
          </div>
          <div className="ind-compare__col ind-compare__col--solution">
            <h2 className="ind-compare__title">{model.solutionHeading}</h2>
            <ul className="ind-compare__list">
              {model.solutions.map((item) => (
                <li key={item}>
                  <Check className="ind-compare__icon ind-compare__icon--check" aria-hidden />
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
