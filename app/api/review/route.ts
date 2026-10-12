import { NextResponse } from 'next/server'

// Private review routing. Server-side only: REVIEW_WEBHOOK_URL (n8n/Slack/email) never reaches the browser.
// Ratings 4-5 are logged (the page then sends the visitor to Google). Ratings 1-3 stay private here.
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

  const payload = {
    name: String(body.name || '').slice(0, 200),
    email: email.slice(0, 200),
    rating,
    feedback: String(body.feedback || '').slice(0, 4000),
    submittedAt: new Date().toISOString(),
  }

  const url = process.env.REVIEW_WEBHOOK_URL
  if (!url) {
    console.error('[review] REVIEW_WEBHOOK_URL is not set; response not delivered', { rating })
    return NextResponse.json({ ok: false }, { status: 202 })
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`webhook ${res.status}`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[review] webhook failed', err)
    return NextResponse.json({ ok: false }, { status: 202 })
  }
}
