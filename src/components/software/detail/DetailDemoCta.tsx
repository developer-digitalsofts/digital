import type { FormEvent } from 'react'
import { SoftwareDemoCtaSection } from '../SoftwareDemoCtaSection'
import type { DetailDemoModel } from '../../../types/detailPageSections'
import type { LeadSubmitStatus } from '../../../utils/submitLead'

type Props = {
  uid: string
  model: DetailDemoModel
  demoEmail: string
  setDemoEmail: (v: string) => void
  honeypot?: string
  setHoneypot?: (v: string) => void
  onSubmit: (e: FormEvent) => void
  submitStatus?: LeadSubmitStatus
}

export function DetailDemoCta({
  uid,
  model,
  demoEmail,
  setDemoEmail,
  honeypot,
  setHoneypot,
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
        honeypot={honeypot}
        setHoneypot={setHoneypot}
        onSubmit={onSubmit}
        submitStatus={submitStatus}
      />
    </div>
  )
}
