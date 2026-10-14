'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import BoxxAuditForm from './BoxxAuditForm'
import { useAuditModal } from './AuditModalContext'
import { CALENDLY_URL, LINKEDIN_URL } from '@/lib/site-config'

const CONSENT_TEXT = 'Yes, email me my audit follow-ups and occasional tips from BOXX Automations. I can unsubscribe at any time.'

// The form's local-number example is Canadian. Preserve other contact formats;
// the workflow must validate E.164 before sending an SMS.
function normalizePhone(phone) {
  const raw = phone.trim()
  if (!/^\+?[\d\s().-]*$/.test(raw)) return raw
  const digits = raw.replace(/\D/g, '')
  if (raw.startsWith('+') && /^[1-9]\d{1,14}$/.test(digits)) return '+' + digits
  if (!raw.startsWith('+') && /^[2-9]\d{2}[2-9]\d{6}$/.test(digits)) return '+1' + digits
  if (!raw.startsWith('+') && /^1[2-9]\d{2}[2-9]\d{6}$/.test(digits)) return '+' + digits
  return raw
}

const EMPTY_LEAD = { name: '', email: '', phone: '', website: '', services: [], budget: '', consent: false }

export default function AuditModal({ webhookUrl, inline = false }) {
  const { open, closeModal } = useAuditModal()
  const [step, setStep] = useState(1)
  const [lead, setLead] = useState(EMPTY_LEAD)
  const [sending, setSending] = useState(false)
  const lastFocus = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    if (open && !inline) {
      lastFocus.current = document.activeElement
      setStep(1)
      setLead(EMPTY_LEAD)
      const timer = setTimeout(() => overlayRef.current?.querySelector('#audit-question')?.focus(), 50)
      return () => clearTimeout(timer)
    } else {
      lastFocus.current?.focus()
    }
  }, [open, inline])

  useEffect(() => {
    function onKey(e) {
      if (!open || inline) return
      if (sending) return
      if (e.key === 'Escape') closeModal()
      if (e.key === 'Tab') {
        const controls = [...overlayRef.current.querySelectorAll('a[href], button:not(:disabled), input:not(:disabled)')];
        const first = controls[0], last = controls[controls.length - 1];
        if (e.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement))) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, closeModal, inline, sending])

  if (!open && !inline) return null


  async function submitLead(form) {
    const services = form.service === 'BOTH' ? ['website', 'emails'] : [form.service === 'AUTOMATED_EMAILS' ? 'emails' : 'website'];
    const budgets = { 'Under $1,000': 'under-1000', '$1,000–$2,500': '1000-2500', '$2,500+': '2500-plus', 'Just exploring for now': '' };
    const submittedLead = { name: form.fullName.trim(), email: form.email.trim(), website: form.website.trim(), phone: normalizePhone(form.phone), services, budget: budgets[form.budget] || '', consent: form.emailConsent === true };
    const lead = submittedLead;
    setLead(submittedLead);
    setSending(true)
    const path = lead.services.length === 2 ? 'both' : lead.services[0]
    const payload = { ...lead, email_marketing_consent: form.emailConsent === true, sms_marketing_consent: form.smsConsent === true, consent: lead.consent === true, consent_text: lead.consent ? CONSENT_TEXT : '', path, submittedAt: new Date().toISOString(), source: inline ? 'networking' : (typeof window !== 'undefined' ? window.location.href : '') }
    if (!webhookUrl) {
      setSending(false)
      throw new Error("The audit form is temporarily unavailable. Please try again shortly.")
    }
    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        if (!response.ok) throw new Error('Submission rejected')
        const result = await response.json()
        if (result.ok === false) throw new Error('Submission rejected')
      } catch {
        setSending(false)
        throw new Error("That didn’t send. Check your connection and try again.")
      }
    }
    setSending(false)
    setStep('done')
  }

  const first = lead.name.split(' ')[0]

  return (
    <div className={inline ? "audit-inline" : "overlay show"} id="overlay" ref={overlayRef} onClick={e => { if (!inline && !sending && e.target === overlayRef.current) closeModal() }}>
      <div className="modal" role={inline ? "region" : "dialog"} aria-modal={inline ? undefined : true} aria-labelledby={typeof step === 'number' ? 'audit-question' : 'mTitle'}>
        <div className="m-top">
          {!inline && <button className="m-close" aria-label="Close" disabled={sending} onClick={closeModal}>&#10005;</button>}
        </div>
        <div className="m-body">
          {typeof step === 'number' && <BoxxAuditForm onSubmit={submitLead} phoneRequired={false} websiteRequired smsConsentEnabled={inline} />}
          {typeof step === 'number' && <span className="quick">Just want my contact info? <button type="button" disabled={sending} onClick={() => setStep('quick')}>Tap here</button></span>}

          {step === 'done' && (
            <div className="done ok">
              <div className="badge">
                <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              </div>
              <h2 id="mTitle">{`You're in, ${first}.`}</h2>
              <p className="sub">{`Your request has been received. I’ll personally review your business and follow up at ${lead.email}.`}</p>
              <div className="inbox">
                <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
                <p>Watch your inbox for next steps. If you don’t see an email, check spam or promotions.</p>
              </div>
              <div className="m-actions" style={{ marginTop: 20 }}>{inline ? <Link className="btn btn-ghost" href="/">Back to the site</Link> : <button className="btn btn-ghost" onClick={closeModal}>Back to the site</button>}</div>
            </div>
          )}

          {step === 'quick' && (
            <div className="profile">
              <div className="avatar photo" role="img" aria-label="Kaleel Lawrence-Boxx" />
              <h2 id="mTitle">Let&rsquo;s connect.</h2>
              <p className="sub">I help businesses get more customers with high-converting websites and automated emails.</p>
              <a className="btn btn-primary" style={{ width: '100%' }} href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a quick chat</a>
              <div className="links">
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <Link href="/about" onClick={closeModal}>About</Link>
                <Link href="/contact" onClick={closeModal}>Contact</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
