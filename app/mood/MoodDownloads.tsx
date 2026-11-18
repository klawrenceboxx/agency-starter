'use client'
import { useState } from 'react'
import { attributionPayload } from '@/lib/attribution'
import styles from './mood.module.css'

export default function MoodDownloads({ emailEnabled }: { emailEnabled: boolean }) {
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  function track(asset: string) { window.gtag?.('event', 'mood_download', { asset, resource: 'mood' }) }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return
    const form = event.currentTarget, data = new FormData(form)
    setBusy(true); setStatus('')
    try {
      const response = await fetch('/api/mood-delivery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: data.get('email'), company: data.get('company'), ...attributionPayload(), resource: 'mood' }) })
      if (!response.ok) throw new Error()
      setStatus('Your email request was accepted. You can also download both files below.'); form.reset()
      window.gtag?.('event', 'mood_email_request', { resource: 'mood' })
    } catch { setStatus('Your email request could not be completed. Use the downloads below. No signup is required.') }
    finally { setBusy(false) }
  }
  return <>
    {emailEnabled && <form onSubmit={submit} className={styles.form}>
      <label htmlFor="mood-email">Email me the skill and prompt</label><div><input id="mood-email" type="email" name="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /><button disabled={busy}>{busy ? 'Requesting…' : 'Email me the kit'}</button></div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className={styles.honeypot} />
      <small>This requests the kit only. It does not subscribe you to marketing emails. <a href="/privacy">Privacy policy</a></small>
      <p role="status">{status}</p>
    </form>}
    <div className={styles.actions}>
      <a href="/mood/Mood_to_Motion_Skill.zip" download onClick={() => track('skill-zip')} className={styles.cta}>Download skill ZIP</a>
      <a href="/mood/Mood_to_Motion_Standalone_Prompt.md" download onClick={() => track('standalone-prompt')} className={styles.secondary}>Download AI prompt</a>
    </div>
    <p className={styles.micro}>No signup required. Both files are available directly.</p>
  </>
}
