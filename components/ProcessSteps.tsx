'use client'

import { useEffect, useRef } from 'react'

type Step = { stepNumber: number; title: string; description: string; icon: string }
type Props = { steps: Step[] }

export default function ProcessSteps({ steps }: Props) {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[]
    if (cards.length < 2) return

    function onScroll() {
      cards.forEach((card, i) => {
        if (i >= cards.length - 1) return
        const next = cards[i + 1]
        if (!next) return
        const rect = next.getBoundingClientRect()
        const windowH = window.innerHeight
        const start = windowH * 0.72
        const end = windowH * 0.20
        const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)))
        card.style.transform = `scale(${1 - progress * 0.04})`
        card.style.filter = `blur(${progress * 6}px)`
        card.style.opacity = String(1 - progress * 0.38)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [steps])

  return (
    <section id="protocol" style={{ padding: '120px 64px', background: 'var(--navy)' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div className="mono" style={{ fontSize: '11px', color: 'var(--color-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
          How We Work
        </div>
        <h2 className="heading" style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: '80px' }}>
          The <span style={{ color: 'var(--muted)' }}>protocol</span>
        </h2>

        {steps.map((step, i) => (
          <div
            key={step.stepNumber}
            ref={el => { cardsRef.current[i] = el }}
            className="proto-card"
            style={{ marginBottom: i < steps.length - 1 ? '24px' : '0' }}
          >
            <div
              className="proto-grid"
              style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: '48px', alignItems: 'center' }}
            >
              <div>
                <div className="mono" style={{ fontSize: '72px', fontWeight: 700, color: 'rgba(168,85,247,0.08)', lineHeight: 1, marginBottom: '20px', letterSpacing: '-0.04em' }}>
                  {String(step.stepNumber).padStart(2, '0')}
                </div>
                <h3 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px', color: '#fff' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '16px', color: 'var(--muted)', lineHeight: 1.75, maxWidth: '420px' }}>
                  {step.description}
                </p>
              </div>

              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {step.stepNumber === 1 && (
                  <svg viewBox="0 0 160 160" width="160" height="160">
                    <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(168,85,247,0.08)" strokeWidth="1"/>
                    <circle cx="80" cy="80" r="52" fill="none" stroke="rgba(168,85,247,0.12)" strokeWidth="1"/>
                    <circle cx="80" cy="80" r="32" fill="none" stroke="rgba(168,85,247,0.18)" strokeWidth="1"/>
                    <g className="rotate-geom">
                      <circle cx="80" cy="8"   r="5" fill="var(--color-primary)" opacity="0.7"/>
                      <circle cx="80" cy="152" r="5" fill="var(--color-primary)" opacity="0.7"/>
                    </g>
                    <g className="rotate-geom-rev">
                      <rect x="76" y="4" width="8" height="8" rx="2" fill="rgba(168,85,247,0.5)"/>
                    </g>
                    <circle cx="80" cy="80" r="10" fill="rgba(168,85,247,0.12)"/>
                    <circle cx="80" cy="80" r="4"  fill="var(--color-primary)"/>
                  </svg>
                )}
                {step.stepNumber === 2 && (
                  <svg viewBox="0 0 160 160" width="160" height="160" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <rect width="160" height="160" fill="rgba(0,0,0,0.2)" rx="12"/>
                    <g opacity="0.25">
                      {([20,53,86,119] as number[]).flatMap(x =>
                        ([20,53,86,119] as number[]).map(y => (
                          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="var(--muted)"/>
                        ))
                      )}
                    </g>
                    <line
                      x1="-20" y1="80" x2="30" y2="80"
                      stroke="var(--color-primary)" strokeWidth="1.5"
                      className="scan-laser"
                      style={{ filter: 'drop-shadow(0 0 5px var(--color-primary))' }}
                    />
                  </svg>
                )}
                {step.stepNumber === 3 && (
                  <svg viewBox="0 0 160 80" width="160" height="80">
                    <path
                      d="M0,40 L15,40 L22,40 L28,12 L33,68 L38,40 L45,40 L50,22 L56,58 L61,40 L75,40 L82,16 L87,64 L93,40 L107,40 L112,28 L118,52 L123,40 L160,40"
                      fill="none"
                      stroke="var(--color-primary)"
                      strokeWidth="1.5"
                      className="ekg-path"
                      style={{ filter: 'drop-shadow(0 0 4px var(--color-primary))' }}
                    />
                  </svg>
                )}
                {step.stepNumber > 3 && (
                  <div className="mono" style={{ fontSize: '48px', fontWeight: 700, color: 'rgba(168,85,247,0.15)' }}>
                    {String(step.stepNumber).padStart(2, '0')}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #protocol { padding: 80px 24px !important; }
        }
      `}</style>
    </section>
  )
}
