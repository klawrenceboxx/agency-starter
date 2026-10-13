'use client'

import { useState } from 'react'

export default function ReviewForm({ googleReviewUrl }: { googleReviewUrl: string }) {
  const [rating, setRating] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [feedback, setFeedback] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const happy = rating >= 4

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating || busy) return
    setBusy(true)
    // Fire and wait: the API route logs the response and forwards it to the private webhook.
    try {
      await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, rating, feedback: happy ? '' : feedback }),
      })
    } catch {
      /* never block the visitor on a failed log */
    }
    if (happy && googleReviewUrl) {
      window.location.href = googleReviewUrl
      return
    }
    setDone(true)
    setBusy(false)
  }

  if (done) {
    return (
      <div className="review-card">
        <h2 className="h3">Thank you.</h2>
        <p>{happy ? 'We appreciate it.' : 'I will read this myself and get back to you soon.'}</p>
        {!happy && googleReviewUrl && (
          <p>
            You are always welcome to share your experience publicly too:{' '}
            <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer">leave a Google review</a>.
          </p>
        )}
      </div>
    )
  }

  return (
    <form className="review-card" onSubmit={onSubmit}>
      <h2 className="h3">How likely are you to refer us?</h2>
      <p>1 means not likely. 5 means definitely.</p>
      <div className="review-scale" role="group" aria-label="Rating from 1 to 5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" aria-pressed={rating === n} onClick={() => setRating(n)}>
            {n}
          </button>
        ))}
      </div>
      {rating > 0 && !happy && (
        <>
          <p>Sorry we missed the mark. Tell me what happened and I will make it right.</p>
          <textarea rows={4} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Your feedback" />
        </>
      )}
      <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" autoComplete="email" />
      <button className="btn btn-primary" type="submit" disabled={!rating || busy}>
        {busy ? 'Sending...' : 'Submit'}
      </button>
    </form>
  )
}
