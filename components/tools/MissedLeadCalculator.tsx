'use client'

import { useMemo, useState } from 'react'
import AuditTrigger from '@/components/audit/AuditTrigger'
import { CALCULATOR_WEBHOOK_URL } from '@/lib/site-config'
import { attributionPayload } from '@/lib/attribution'
import { track } from '@/lib/analytics'
import { calcMissedLeadCost, cleanInputs } from '@/lib/missed-lead-math'

export const CALC_CONSENT_TEXT =
  'Email me this estimate and the weekly BOXX Automations email. I can unsubscribe anytime.'

const money = (n: number) => '$' + n.toLocaleString('en-CA')
const toNum = (v: string) => (v.trim() === '' ? NaN : Number(v.replace(/[$,%\s,]/g, '')))

export default function MissedLeadCalculator() {
  const [leads, setLeads] = useState('')
  const [missed, setMissed] = useState('')
  const [close, setClose] = useState('')
  const [value, setValue] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const [tracked, setTracked] = useState(false)

  const raw = { leadsPerMonth: toNum(leads), missedPct: toNum(missed), closePct: toNum(close), jobValue: toNum(value) }
  const ready = Object.values(raw).every((n) => Number.isFinite(n)) && raw.leadsPerMonth > 0
  const result = useMemo(() => (ready ? calcMissedLeadCost(raw) : null), [ready, leads, missed, close, value]) // eslint-disable-line react-hooks/exhaustive-deps

  function onBlur() {
    if (ready && !tracked) {
      setTracked(true)
      track('calculator_use', { tool: 'missed-lead-cost' })
    }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (state === 'sending' || !result) return
    const value = email.trim()
    if (!consent) {
      setError('Tick the box to get the estimate by email.')
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
    const inputs = cleanInputs(raw)
    try {
      const res = await fetch(CALCULATOR_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: value,
          email_marketing_consent: consent,
          consent_text: CALC_CONSENT_TEXT,
          source: 'missed-lead-calculator',
          page: window.location.href,
          leads_per_month: inputs.leadsPerMonth,
          missed_pct: inputs.missedPct,
          close_pct: inputs.closePct,
          job_value: inputs.jobValue,
          lost_monthly: result.lostMonthly,
          lost_yearly: result.lostYearly,
          ...attributionPayload(),
          company: hp,
          submittedAt: new Date().toISOString(),
        }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || json?.ok !== true) throw new Error('rejected')
      setState('done')
      track('generate_lead', { lead_type: 'calculator', form_location: 'missed-lead-calculator' })
    } catch {
      setError('That didn’t send. Check your connection and try again.')
      setState('error')
    }
  }

  return (
    <div className="calc">
      <div className="calc-grid">
        <div className="calc-field">
          <label htmlFor="calc-leads">New enquiries a month</label>
          <input id="calc-leads" inputMode="numeric" placeholder="e.g. 40" value={leads} onChange={(e) => setLeads(e.target.value)} onBlur={onBlur} />
          <span className="calc-hint">Calls, forms, emails and messages from people who might buy.</span>
        </div>
        <div className="calc-field">
          <label htmlFor="calc-missed">% that get no reply, or a late one</label>
          <input id="calc-missed" inputMode="numeric" placeholder="e.g. 25" value={missed} onChange={(e) => setMissed(e.target.value)} onBlur={onBlur} />
          <span className="calc-hint">Your best guess. Check your inbox and missed calls if you&rsquo;re not sure.</span>
        </div>
        <div className="calc-field">
          <label htmlFor="calc-close">% of answered enquiries that become customers</label>
          <input id="calc-close" inputMode="numeric" placeholder="e.g. 20" value={close} onChange={(e) => setClose(e.target.value)} onBlur={onBlur} />
          <span className="calc-hint">Out of every 10 people you talk to, how many buy?</span>
        </div>
        <div className="calc-field">
          <label htmlFor="calc-value">Average value of one new customer ($)</label>
          <input id="calc-value" inputMode="decimal" placeholder="e.g. 1500" value={value} onChange={(e) => setValue(e.target.value)} onBlur={onBlur} />
          <span className="calc-hint">What one customer pays you, on average.</span>
        </div>
      </div>

      <div className="calc-result" aria-live="polite">
        {result ? (
          <>
            <p className="calc-big">{money(result.lostMonthly)}<span> a month</span></p>
            <p className="calc-sub">
              That&rsquo;s about <strong>{money(result.lostYearly)} a year</strong> from roughly {result.missedLeads} enquiries a
              month that never got a fast answer. At your close rate, that&rsquo;s about {result.lostCustomers} customers.
            </p>
            <p className="calc-note">This is an estimate from the numbers you typed in. It isn&rsquo;t a promise of what you&rsquo;d win back.</p>
          </>
        ) : (
          <p className="calc-sub">Fill in all four boxes to see your number.</p>
        )}
      </div>

      {result && (
        <div className="calc-next">
          <p>Want to see where your leads are slipping through? I&rsquo;ll look at your site and your follow-up.</p>
          <AuditTrigger>Get Your Free Audit</AuditTrigger>

          {CALCULATOR_WEBHOOK_URL && (
            state === 'done' ? (
              <p className="calc-done" role="status"><strong>Check your inbox.</strong> Your estimate is on its way to {email.trim()}.</p>
            ) : (
              <form className="calc-email" onSubmit={submit} noValidate>
                <label htmlFor="calc-email">Want this estimate in your inbox?</label>
                <div className="calc-row">
                  <input id="calc-email" type="email" autoComplete="email" inputMode="email" placeholder="you@business.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={state === 'error' && !!error} />
                  <button type="submit" className="btn btn-ghost" disabled={!consent || state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Email it to me'}</button>
                </div>
                <input className="calc-hp" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <label className="calc-consent">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>{CALC_CONSENT_TEXT}</span>
                </label>
                {error && <p className="calc-error" role="alert">{error}</p>}
              </form>
            )
          )}
        </div>
      )}
    </div>
  )
}
