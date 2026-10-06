'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useAuditModal } from './AuditModalContext'
import { CALENDLY_URL, LINKEDIN_URL, SPOTS_OPEN, TOTAL_SPOTS } from '@/lib/site-config'

const EMPTY_LEAD = { name: '', email: '', phone: '', website: '', services: [], budget: '' }

const RULES = {
  name: v => v.trim().length >= 2,
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  website: v => /^(https?:\/\/)?[^\s.]+\.[^\s]{2,}/i.test(v.trim()),
  phone: v => !v.trim() || v.replace(/\D/g, '').length >= 10,
}

const TIERS = [
  ['under-1000', 'Under $1,000', 'Starting small'],
  ['1000-2500', '$1,000 – $2,500', 'Ready to invest'],
  ['2500-plus', '$2,500+', 'A more complete solution'],
]

export default function AuditModal({ webhookUrl, inline = false }) {
  const { open, closeModal } = useAuditModal()
  const [step, setStep] = useState(1)
  const [lead, setLead] = useState(EMPTY_LEAD)
  const [errors, setErrors] = useState({})
  const [groupErr, setGroupErr] = useState('')
  const [sending, setSending] = useState(false)
  const [sendErr, setSendErr] = useState('')
  const lastFocus = useRef(null)
  const overlayRef = useRef(null)
  const firstFieldRef = useRef(null)

  useEffect(() => {
    if (open && !inline) {
      lastFocus.current = document.activeElement
      setStep(1)
      setLead(EMPTY_LEAD)
      setErrors({})
      setGroupErr('')
      setSendErr('')
      setTimeout(() => firstFieldRef.current?.focus(), 50)
    } else {
      lastFocus.current?.focus()
    }
  }, [open, inline])

  useEffect(() => {
    function onKey(e) {
      if (!open || inline) return
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, closeModal, inline])

  if (!open && !inline) return null

  const progress = typeof step === 'number' ? step : 0
  const showBack = typeof step === 'number' && step > 1

  function checkField(id, value) {
    const ok = RULES[id](value)
    setErrors(prev => ({ ...prev, [id]: !ok }))
    return ok
  }

  function handleStep1Submit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const values = {
      name: form.elements.namedItem('fName').value,
      email: form.elements.namedItem('fEmail').value,
      website: form.elements.namedItem('fSite').value,
      phone: form.elements.namedItem('fPhone').value,
    }
    const fieldIds = { name: 'fName', email: 'fEmail', website: 'fSite', phone: 'fPhone' }
    const bad = Object.keys(RULES).filter(id => !checkField(id, values[id]))
    if (bad.length) {
      form.querySelector(`#${fieldIds[bad[0]]}`)?.focus()
      return
    }
    setLead(prev => ({ ...prev, name: values.name.trim(), email: values.email.trim(), website: values.website.trim(), phone: values.phone.trim() }))
    setStep(2)
  }

  function toggleService(s) {
    setLead(prev => {
      const has = prev.services.includes(s)
      return { ...prev, services: has ? prev.services.filter(x => x !== s) : [...prev.services, s] }
    })
    setGroupErr('')
  }

  function goStep3() {
    if (!lead.services.length) {
      setGroupErr('Pick at least one so I know what to audit.')
      return
    }
    setStep(3)
  }

  async function submitLead() {
    if (!lead.budget) {
      setGroupErr('Pick the range that fits best.')
      return
    }
    setSending(true)
    setSendErr('')
    const path = lead.services.length === 2 ? 'both' : lead.services[0]
    const payload = { ...lead, path, submittedAt: new Date().toISOString(), source: inline ? 'networking' : (typeof window !== 'undefined' ? window.location.href : '') }
    if (!webhookUrl) {
      setSending(false)
      setSendErr("The audit form is temporarily unavailable. Please try again shortly.")
      return
    }
    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        if (!response.ok) throw new Error('Submission rejected')
        const result = await response.json()
        if (result.ok === false) throw new Error('Submission rejected')
      } catch {
        setSending(false)
        setSendErr("That didn’t send. Check your connection and try again.")
        return
      }
    }
    setSending(false)
    setStep('done')
  }

  const first = lead.name.split(' ')[0]
  const spotsAvailable = SPOTS_OPEN > 0

  return (
    <div className={inline ? "audit-inline" : "overlay show"} id="overlay" ref={overlayRef} onClick={e => { if (!inline && e.target === overlayRef.current) closeModal() }}>
      <div className="modal" role={inline ? "region" : "dialog"} aria-modal={inline ? undefined : true} aria-labelledby="mTitle">
        <div className="m-top">
          <button className="m-back" hidden={!showBack} onClick={() => setStep(prev => (typeof prev === 'number' && prev > 1 ? (prev - 1) : prev))}>&lsaquo; Back</button>
          {!inline && <button className="m-close" aria-label="Close" onClick={closeModal}>&#10005;</button>}
        </div>
        {progress > 0 && (
          <div className="m-progress">
            <div className="bar"><i style={{ width: `${(progress / 3) * 100}%` }} /></div>
            <div className="m-step-label">Step {progress} of 3</div>
          </div>
        )}
        <div className="m-body">
          {step === 1 && (
            <>
              <h2 id="mTitle">Where should I send your audit?</h2>
              <p className="sub">This takes about 30 seconds.</p>
              <form onSubmit={handleStep1Submit} noValidate>
                <div className={`field${errors.name ? ' err' : ''}`}>
                  <label htmlFor="fName">Full name</label>
                  <input id="fName" name="fName" ref={firstFieldRef} autoComplete="name" defaultValue={lead.name} onBlur={e => e.target.value && checkField('name', e.target.value)} />
                  <div className="msg">Enter your name so I know who the audit is for.</div>
                </div>
                <div className={`field${errors.email ? ' err' : ''}`}>
                  <label htmlFor="fEmail">Email</label>
                  <input id="fEmail" name="fEmail" type="email" autoComplete="email" inputMode="email" defaultValue={lead.email} onBlur={e => e.target.value && checkField('email', e.target.value)} />
                  <div className="msg">Enter an email like you@business.com. Your audit is sent here.</div>
                </div>
                <div className={`field${errors.website ? ' err' : ''}`}>
                  <label htmlFor="fSite">Your website</label>
                  <input id="fSite" name="fSite" autoComplete="url" inputMode="url" placeholder="yourbusiness.com" defaultValue={lead.website} onBlur={e => e.target.value && checkField('website', e.target.value)} />
                  <div className="msg">Enter your website address, like yourbusiness.com, so I can audit it.</div>
                </div>
                <div className={`field${errors.phone ? ' err' : ''}`}>
                  <label htmlFor="fPhone">Phone <span className="opt">(optional)</span></label>
                  <input id="fPhone" name="fPhone" type="tel" autoComplete="tel" inputMode="tel" defaultValue={lead.phone} onBlur={e => e.target.value && checkField('phone', e.target.value)} />
                  <div className="msg">That number looks too short. Check it or leave it blank.</div>
                </div>
                <div className="m-actions"><button className="btn btn-primary" type="submit">Continue</button></div>
                <p className="expect">Free. No sales call required. Used only to send your audit and follow-up emails.</p>
              </form>
              <span className="quick">Just want my contact info? <button type="button" onClick={() => setStep('quick')}>Tap here</button></span>
            </>
          )}

          {step === 2 && (
            <>
              <h2 id="mTitle">What would you like to improve?</h2>
              <p className="sub">Choose one or both.</p>
              <div role="group" aria-label="Services">
                <button type="button" className="choice" aria-pressed={lead.services.includes('website')} onClick={() => toggleService('website')}>
                  <span className="ci"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 8h18M7 12h6M7 15h4" /></svg></span>
                  <span><strong>High-converting website</strong><span>Turn more visitors into customers.</span></span>
                  <span className="tick" />
                </button>
                <button type="button" className="choice" aria-pressed={lead.services.includes('emails')} onClick={() => toggleService('emails')}>
                  <span className="ci"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg></span>
                  <span><strong>Automated emails</strong><span>Turn more leads into paying customers.</span></span>
                  <span className="tick" />
                </button>
              </div>
              {groupErr && <p className="group-err show">{groupErr}</p>}
              <div className="m-actions"><button className="btn btn-primary" onClick={goStep3}>Continue</button></div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 id="mTitle">What level of investment are you comfortable with?</h2>
              <p className="sub">This helps me recommend the right fix. Your audit is free either way.</p>
              <div role="radiogroup" aria-label="Budget">
                {TIERS.map(([v, l, s]) => (
                  <button key={v} type="button" role="radio" className="choice radio" aria-checked={lead.budget === v} onClick={() => { setLead(prev => ({ ...prev, budget: v })); setGroupErr('') }}>
                    <span><strong>{l}</strong><span>{s}</span></span>
                    <span className="tick" />
                  </button>
                ))}
              </div>
              {(groupErr || sendErr) && <p className="group-err show">{sendErr || groupErr}</p>}
              <div className="m-actions"><button className="btn btn-primary" disabled={sending} onClick={submitLead}>{sending ? 'Sending…' : 'Send My Audit'}</button></div>
              <p className="expect">Your audit is emailed right away. I&rsquo;ll follow up with a few helpful emails. Unsubscribe anytime.</p>
            </>
          )}

          {step === 'done' && (
            <div className={`done ${spotsAvailable ? 'ok' : 'wait'}`}>
              <div className="badge">
                {spotsAvailable
                  ? <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                  : <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>}
              </div>
              <h2 id="mTitle">{spotsAvailable ? `You're in, ${first}.` : `You're on the waitlist, ${first}.`}</h2>
              <p className="spots">{spotsAvailable ? `I currently have ${SPOTS_OPEN} of ${TOTAL_SPOTS} client spots open.` : `All ${TOTAL_SPOTS} client spots are taken right now.`}</p>
              <p className="sub">{spotsAvailable ? `Your audit is on its way to ${lead.email}.` : `Your audit is still on its way to ${lead.email}, and I'll email you when a spot opens.`}</p>
              <div className="inbox">
                <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
                <p>Check your inbox in the next few minutes. Not there? Look in spam or promotions.</p>
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
