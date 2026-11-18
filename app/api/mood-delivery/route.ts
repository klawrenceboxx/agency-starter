import { NextRequest, NextResponse } from 'next/server'

// Separate from the networking guide's fixed PDF workflow. Enable only after its
// resource-specific workflow is configured and tested; never report a silent success.
export async function POST(request: NextRequest) {
  if (!process.env.MOOD_DELIVERY_WEBHOOK_URL) return NextResponse.json({ error: 'Email delivery is not configured. Use the direct downloads.' }, { status: 503 })
  if (request.headers.get('origin') !== new URL(request.url).origin) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  let body
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (body.company || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 })
  try {
    const response = await fetch(process.env.MOOD_DELIVERY_WEBHOOK_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, resource: 'mood', source: 'mood-page', email_marketing_consent: false, page: '/mood', channel: typeof body.channel === 'string' ? body.channel.slice(0, 100) : '', submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10000),
    })
    const result = await response.json().catch(() => null)
    if (!response.ok || result?.ok !== true) throw new Error('Not accepted')
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ error: 'Email request failed. Use the direct downloads.' }, { status: 502 }) }
}
