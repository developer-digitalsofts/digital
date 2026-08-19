import { Check, X } from 'lucide-react'
import type { ModuleChallengeSolutionModel } from '../../../types/moduleDetailPage'
import { moduleShellClass } from './moduleConstants'

type Props = {
  model: ModuleChallengeSolutionModel
}

export function ModuleChallengeSolution({ model }: Props) {
  return (
    <section className="mod-section mod-section--compare">
      <div className={moduleShellClass}>
        <div className="mod-compare">
          <div className="mod-compare__col mod-compare__col--challenge">
            <h2 className="mod-compare__title">{model.challengeHeading}</h2>
            <ul className="mod-compare__list">
              {model.challenges.map((item) => (
                <li key={item}>
                  <X className="mod-compare__icon mod-compare__icon--x" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mod-compare__vs" aria-hidden>
            VS
          </div>
          <div className="mod-compare__col mod-compare__col--solution">
            <h2 className="mod-compare__title">{model.solutionHeading}</h2>
            <ul className="mod-compare__list">
              {model.solutions.map((item) => (
                <li key={item}>
                  <Check className="mod-compare__icon mod-compare__icon--check" aria-hidden />
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
