import { useCallback, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { submitDetailPageInquiry } from '../../utils/detailPageInquiry'

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useDetailPageInquiry(displayName: string, slug: string) {
  const location = useLocation()
  const [demoEmail, setDemoEmail] = useState('')
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      const email = demoEmail.trim()
      if (!emailRe.test(email)) {
        setSubmitStatus('error')
        return
      }

      setSubmitStatus('submitting')
      try {
        await submitDetailPageInquiry({
          email,
          pageTitle: displayName,
          slug,
          sourcePath: `${location.pathname}${location.search}`,
        })
        setSubmitStatus('success')
      } catch {
        setSubmitStatus('error')
      }
    },
    [demoEmail, displayName, slug, location.pathname, location.search],
  )

  return { demoEmail, setDemoEmail, submitStatus, onSubmit }
}
