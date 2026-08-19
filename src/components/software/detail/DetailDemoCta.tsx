import type { FormEvent } from 'react'
import { SoftwareDemoCtaSection } from '../SoftwareDemoCtaSection'
import type { DetailDemoModel } from '../../../types/detailPageSections'

type Props = {
  uid: string
  model: DetailDemoModel
  demoEmail: string
  setDemoEmail: (v: string) => void
  onSubmit: (e: FormEvent) => void
  submitStatus?: 'idle' | 'submitting' | 'success' | 'error'
}

export function DetailDemoCta({
  uid,
  model,
  demoEmail,
  setDemoEmail,
  onSubmit,
  submitStatus,
}: Props) {
  return (
    <div className="accounts-proto-demo">
      <SoftwareDemoCtaSection
        uid={uid}
        heading={model.heading}
        sub={model.sub}
        whatsappHref={model.whatsappHref}
        whatsappLabel={model.whatsappLabel}
        sendLabel={model.sendLabel}
        demoEmail={demoEmail}
        setDemoEmail={setDemoEmail}
        onSubmit={onSubmit}
        submitStatus={submitStatus}
      />
    </div>
  )
}
