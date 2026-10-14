import { NextResponse } from 'next/server'

// Review routing (server-side only; env vars never reach the browser).
//  - Every response (any rating) is emailed to ALERT_EMAIL via Resend and logged to REVIEW_WEBHOOK_URL (optional).
//  - The page then sends every visitor to Google (no rating-based gating).
// Env: RESEND_API_KEY, REVIEW_FROM_EMAIL (optional), REVIEW_WEBHOOK_URL (optional)
const ALERT_EMAIL = 'kaleellawrenceboxx@gmail.com'

type Payload = { name: string; email: string; rating: number; feedback: string; submittedAt: string }

async function sendAlert(p: Payload): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  const to = ALERT_EMAIL
  if (!key) return false
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.REVIEW_FROM_EMAIL || 'Boxx Automations <onboarding@resend.dev>',
      to: [to],
      reply_to: p.email,
      subject: `New ${p.rating}-star review response from ${p.name || p.email}`,
      text: [
        `Rating: ${p.rating} / 5`,
        `Name: ${p.name}`,
        `Email: ${p.email}`,
        `Submitted: ${p.submittedAt}`,
        '',
        'Feedback:',
        p.feedback || '(none)',
      ].join('\n'),
    }),
  })
  if (!res.ok) throw new Error(`resend ${res.status} ${await res.text()}`)
  return true
}

async function sendWebhook(p: Payload): Promise<boolean> {
  const url = process.env.REVIEW_WEBHOOK_URL
  if (!url) return false
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(p),
  })
  if (!res.ok) throw new Error(`webhook ${res.status}`)
  return true
}

export async function POST(req: Request) {
  let body: { name?: string; email?: string; rating?: number; feedback?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const rating = Number(body.rating)
  const email = String(body.email || '').trim()
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid rating or email' }, { status: 400 })
  }

  const payload: Payload = {
    name: String(body.name || '').slice(0, 200),
    email: email.slice(0, 200),
    rating,
    feedback: String(body.feedback || '').slice(0, 4000),
    submittedAt: new Date().toISOString(),
  }

  const jobs: Promise<boolean>[] = [sendWebhook(payload), sendAlert(payload)]
  const results = await Promise.allSettled(jobs)

  results.forEach((r) => {
    if (r.status === 'rejected') console.error('[review] delivery failed', r.reason)
  })
  const delivered = results.some((r) => r.status === 'fulfilled' && r.value)
  if (!delivered) {
    console.error('[review] response NOT delivered anywhere. Check RESEND_API_KEY.', {
      rating,
      email: payload.email,
    })
  }
  return NextResponse.json({ ok: delivered }, { status: delivered ? 200 : 202 })
}
