'use client'

import { useState } from 'react'
import styles from '@/app/guides/guides.module.css'
import { GUIDE_WEBHOOK_URL } from '@/lib/site-config'
import { attributionPayload } from '@/lib/attribution'

// The PDF comes with the weekly email (like Angus's "I send resources like this every week").
// The box is required and never pre-ticked. The prompts on the page stay free either way.
export const GUIDE_CONSENT_TEXT =
  'Send me the PDF and the weekly BOXX Automations email. I can unsubscribe anytime.'

type Props = { slug: string; resource: string }

// Soft gate: the prompts stay on the page. This only emails the PDF.
export default function GuidePdfForm({ slug, resource }: Props) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (state === 'sending') return
    const value = email.trim()
    if (!consent) {
      setError('Tick the box to get the PDF.')
      setState('error')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError('Enter an email like you@business.com.')
      setState('error')
      return
    }
    const hp = (e.currentTarget.elements.namedItem('company') as HTMLInputElement | null)?.value || ''
    setState('sending')
    setError('')
    const attr = attributionPayload()
    const payload = {
      email: value,
      slug,
      email_marketing_consent: consent,
      consent_text: consent ? GUIDE_CONSENT_TEXT : '',
      source: 'guide-page',
      page: window.location.href,
      ...attr,
      // The guide on screen is the resource, whatever link brought them here.
      resource,
      company: hp,
      submittedAt: new Date().toISOString(),
    }
    try {
      const res = await fetch(GUIDE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || json?.ok !== true) throw new Error('rejected')
      setState('done')
      window.gtag?.('event', 'guide_pdf_request', { guide: slug, weekly_opt_in: consent })
    } catch {
      setError('That didn’t send. Check your connection and try again.')
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div className={styles.pdfDone} role="status">
        <strong>Check your inbox.</strong> The PDF is on its way to {email.trim()}.
      </div>
    )
  }

  return (
    <form className={styles.pdfForm} onSubmit={submit} noValidate>
      <label htmlFor="guide-email" className={styles.pdfLabel}>
        Want the PDF? Drop your email.
      </label>
      <div className={styles.pdfRow}>
        <input
          id="guide-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@business.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={state === 'error' && !!error}
          aria-describedby={error ? 'guide-email-error' : undefined}
          required
        />
        <button
          type="submit"
          className={styles.btnSecondary}
          disabled={!consent || state === 'sending'}
          aria-describedby="guide-consent"
        >
          {state === 'sending' ? 'Sending…' : 'Send me the PDF'}
        </button>
      </div>
      {/* Honeypot: real people never see or fill this. */}
      <input className={styles.hp} type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className={styles.consent}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked)
            if (e.target.checked && state === 'error') { setState('idle'); setError('') }
          }}
          required
        />
        <span id="guide-consent">{GUIDE_CONSENT_TEXT}</span>
      </label>
      {error && (
        <p id="guide-email-error" className={styles.pdfError} role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
