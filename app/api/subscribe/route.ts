import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, firstName } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.NEXT_PUBLIC_RESEND_AUDIENCE_ID

  if (!apiKey || !audienceId) {
    // Silently succeed if Resend not configured — form still works
    return NextResponse.json({ success: true })
  }

  try {
    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        first_name: firstName || '',
        unsubscribed: false,
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error('[subscribe] Resend error:', body)
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[subscribe] Unexpected error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
