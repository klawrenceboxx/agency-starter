'use client'

import { useEffect, useRef, useState } from 'react'

export default function Philosophy() {
  const p1Ref = useRef<HTMLParagraphElement>(null)
  const p2Ref = useRef<HTMLParagraphElement>(null)
  const [p1Visible, setP1Visible] = useState(false)
  const [p2Visible, setP2Visible] = useState(false)

  useEffect(() => {
    function observe(el: HTMLElement | null, setter: (v: boolean) => void) {
      if (!el) return
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setter(true); obs.disconnect() } },
        { threshold: 0.2 }
      )
      obs.observe(el)
      return () => obs.disconnect()
    }
    const c1 = observe(p1Ref.current, setP1Visible)
    const c2 = observe(p2Ref.current, setP2Visible)
    return () => { c1?.(); c2?.() }
  }, [])

  return (
    <section
      style={{
        padding: '160px 64px',
        position: 'relative',
        overflow: 'hidden',
        background: '#060b1a',
      }}
    >
      {/* Background circuit image overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80')",
        backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.035,
      }} />
      {/* Center glow */}
      <div style={{
        position: 'absolute', width: '900px', height: '900px',
        top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        borderRadius: '50%', pointerEvents: 'none',
        filter: 'blur(80px)',
        background: 'radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 70%)',
        opacity: 0.5,
      }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="mono" style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '56px' }}>
          The Manifesto
        </div>
        <p
          ref={p1Ref}
          style={{
            fontSize: 'clamp(18px, 2.2vw, 24px)',
            color: 'var(--muted)',
            lineHeight: 1.6,
            marginBottom: '32px',
            opacity: p1Visible ? 1 : 0,
            transform: p1Visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          Most agencies focus on: <em>looking busy.</em>
        </p>
        <p
          ref={p2Ref}
          className="heading"
          style={{
            fontSize: 'clamp(38px, 5.5vw, 72px)',
            color: 'var(--body)',
            lineHeight: 1.05,
            opacity: p2Visible ? 1 : 0,
            transform: p2Visible ? 'translateY(0)' : 'translateY(36px)',
            transition: 'opacity 1.05s ease 0.12s, transform 1.05s ease 0.12s',
          }}
        >
          We focus on: systems that{' '}
          <span
            className="gradient-text"
            style={{ fontStyle: 'italic' }}
          >
            compound.
          </span>
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #philosophy-section { padding: 100px 24px !important; }
        }
      `}</style>
    </section>
  )
}
