import { useCallback, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { submitDetailPageInquiry } from '../../utils/detailPageInquiry'
import { LeadSubmitError, statusFromLeadError, type LeadSubmitStatus } from '../../utils/submitLead'

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useDetailPageInquiry(displayName: string, slug: string) {
  const location = useLocation()
  const [demoEmail, setDemoEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [submitStatus, setSubmitStatus] = useState<LeadSubmitStatus>('idle')

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      const email = demoEmail.trim()
      if (!emailRe.test(email)) {
        setSubmitStatus('validation')
        return
      }

      setSubmitStatus('submitting')
      try {
        await submitDetailPageInquiry({
          email,
          pageTitle: displayName,
          slug,
          sourcePath: `${location.pathname}${location.search}`,
          honeypot,
        })
        setSubmitStatus('success')
      } catch (err) {
        setSubmitStatus(statusFromLeadError(err))
        if (!(err instanceof LeadSubmitError)) {
          setSubmitStatus('error')
        }
      }
    },
    [demoEmail, displayName, slug, location.pathname, location.search, honeypot],
  )

  return { demoEmail, setDemoEmail, honeypot, setHoneypot, submitStatus, onSubmit }
}
