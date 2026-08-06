'use client'

import { useState, FormEvent } from 'react'

type Props = { webhookUrl: string }
type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function LeadForm({ webhookUrl }: Props) {
  const [state, setState] = useState<FormState>('idle')
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '', need: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email) return
    setState('submitting')
    try {
      if (webhookUrl) {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, source: 'website_lead_form', timestamp: new Date().toISOString() }),
        })
        if (!res.ok) throw new Error('Webhook error')
      }
      if (subscribeNewsletter && form.email) {
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, firstName: form.name.split(' ')[0] }),
        })
      }
      setState('success')
    } catch {
      setState('error')
    }
  }

  return (
    <section id="contact" style={{ padding: '120px 64px', background: 'var(--navy)' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div className="mono" style={{ fontSize: '11px', color: 'var(--color-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Get In Touch
        </div>
        <h2 className="heading" style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: '12px' }}>
          Ready to{' '}
          <span className="gradient-text" style={{ fontStyle: 'italic' }}>close more?</span>
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--muted)', marginBottom: '48px', lineHeight: 1.65 }}>
          Book a free 30-min strategy call. We&apos;ll map your pipeline and show you exactly what we&apos;d build.
        </p>

        <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.5rem', padding: '2.5rem' }}>
          {/* Terminal prompt header */}
          <div className="mono" style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--color-primary)' }}>$</span> initiate_contact --priority=high
          </div>

          {state === 'success' ? (
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', border: '1px solid var(--color-primary)', background: 'rgba(168,85,247,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '20px', color: 'var(--color-primary)' }}>✓</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', marginBottom: '8px' }}>Transmission received.</h3>
              <p style={{ fontSize: '14px', color: 'var(--muted)' }}>We will respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Name + Email 2-column */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label" htmlFor="name">Name <span style={{ color: 'var(--color-primary)' }}>*</span></label>
                  <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} className="form-input" placeholder="Alex Rivera" />
                </div>
                <div>
                  <label className="form-label" htmlFor="email">Email <span style={{ color: 'var(--color-primary)' }}>*</span></label>
                  <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className="form-input" placeholder="alex@company.com" />
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="company">Company</label>
                <input id="company" name="company" type="text" value={form.company} onChange={handleChange} className="form-input" placeholder="Your company name" />
              </div>

              <div>
                <label className="form-label" htmlFor="need">What do you need automated?</label>
                <textarea id="need" name="need" rows={4} value={form.need} onChange={handleChange} className="form-input" placeholder="Describe your current pipeline and where things break down..." style={{ resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingTop: '4px' }}>
                <input
                  id="newsletter" type="checkbox"
                  checked={subscribeNewsletter}
                  onChange={e => setSubscribeNewsletter(e.target.checked)}
                  style={{ marginTop: '2px', accentColor: 'var(--color-primary)', width: '14px', height: '14px', flexShrink: 0 }}
                />
                <label htmlFor="newsletter" style={{ fontSize: '13px', color: 'var(--muted)', cursor: 'pointer', lineHeight: 1.6 }}>
                  Send me occasional tips on AI automation and growing with tech
                </label>
              </div>

              {state === 'error' && (
                <p className="mono" style={{ color: '#f87171', fontSize: '12px' }}>ERR: Transmission failed. Email us directly instead.</p>
              )}

              <button
                type="submit"
                disabled={state === 'submitting'}
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start', padding: '14px 32px', fontSize: '14px', borderRadius: '8px' }}
              >
                {state === 'submitting' ? 'Transmitting...' : 'Send Message'}
              </button>

              {/* Status line */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="status-dot" />
                <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>System Operational — Response within 24hrs</span>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          #contact { padding: 80px 24px !important; }
          #contact form > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
