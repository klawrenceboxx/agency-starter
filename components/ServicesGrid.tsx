'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ── Card 1: Pipeline Shuffler ──────────────────────────────
function PipelineCard() {
  const [order, setOrder] = useState([0, 1, 2])

  useEffect(() => {
    const id = setInterval(() => {
      setOrder(prev => {
        const next = [...prev]
        const last = next.pop()!
        next.unshift(last)
        return next
      })
    }, 2800)
    return () => clearInterval(id)
  }, [])

  const TRANSFORMS = ['translateY(0px)', 'translateY(52px)', 'translateY(96px)']
  const OPACITIES = [1, 0.65, 0.38]
  const Z_INDICES = [3, 2, 1]

  const items = [
    { color: '#34d399', shadow: '#34d399', label: 'Lead Capture Active' },
    { color: 'var(--color-primary)', shadow: 'var(--color-primary)', label: 'CRM Sync Running' },
    { color: '#c084fc', shadow: '#c084fc', label: 'Follow-up Triggered' },
  ]

  return (
    <div className="feat-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="mono" style={{ fontSize: '10px', color: 'var(--color-primary)', letterSpacing: '0.14em', marginBottom: '10px' }}>01 — CAPTURE</div>
      <h3 style={{ fontSize: '21px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px', color: '#fff' }}>Capture on autopilot</h3>
      <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '24px' }}>Every lead captured, qualified, and routed — 24/7, zero manual work.</p>
      <div className="pipeline-stack">
        {items.map((item, i) => {
          const pos = order.indexOf(i)
          return (
            <div
              key={i}
              className="pipeline-item"
              style={{
                transform: TRANSFORMS[pos],
                opacity: OPACITIES[pos],
                zIndex: Z_INDICES[pos],
              }}
            >
              <div style={{ width: '8px', height: '8px', background: item.color, borderRadius: '50%', flexShrink: 0, boxShadow: `0 0 8px ${item.shadow}` }} />
              <span className="mono" style={{ fontSize: '12px' }}>{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Card 2: Typewriter + Live Feed ─────────────────────────
const MSGS = [
  'New lead captured — contact form',
  'CRM updated — Apex Solutions',
  'Follow-up sent to 14 contacts',
  'Workflow triggered: onboarding',
  'Lead scored 91/100 — qualified',
  'Demo booked — calendar invite sent',
]

function TypewriterCard() {
  const [typeText, setTypeText] = useState('')
  const stateRef = useRef({ mIdx: 0, cIdx: 0, running: true })

  useEffect(() => {
    const s = stateRef.current
    let timeout: ReturnType<typeof setTimeout>

    function type() {
      if (!s.running) return
      const m = MSGS[s.mIdx]
      if (s.cIdx < m.length) {
        s.cIdx++
        setTypeText(m.slice(0, s.cIdx))
        timeout = setTimeout(type, 42)
      } else {
        timeout = setTimeout(() => {
          s.cIdx = 0
          s.mIdx = (s.mIdx + 1) % MSGS.length
          setTypeText('')
          timeout = setTimeout(type, 280)
        }, 2600)
      }
    }

    type()
    return () => { s.running = false; clearTimeout(timeout) }
  }, [])

  return (
    <div className="feat-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="mono" style={{ fontSize: '10px', color: 'var(--color-primary)', letterSpacing: '0.14em', marginBottom: '10px' }}>02 — INTEGRATE</div>
      <h3 style={{ fontSize: '21px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px', color: '#fff' }}>Your pipeline, always moving</h3>
      <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '20px' }}>Real-time integrations keep your CRM, email, and calendar in sync.</p>
      <div style={{ background: 'rgba(0,0,0,0.28)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="live-badge" style={{ marginBottom: '12px' }}>
          <div className="live-dot" />LIVE FEED
        </div>
        <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '12px', color: 'var(--body)', marginBottom: '8px', minHeight: '18px' }}>
          {typeText}<span className="type-cursor" />
        </div>
        <div className="feed-log">CRM updated — Apex Solutions</div>
        <div className="feed-log">Follow-up sent to 12 contacts</div>
        <div className="feed-log">Onboarding sequence triggered</div>
      </div>
    </div>
  )
}

// ── Card 3: Virtual Cursor Scheduler ───────────────────────
function SchedulerCard() {
  const containerRef = useRef<HTMLDivElement>(null)
  const dayCellsRef = useRef<(HTMLDivElement | null)[]>([])
  const btnRef = useRef<HTMLButtonElement>(null)
  const [activeDay, setActiveDay] = useState<number | null>(null)
  const [btnPressed, setBtnPressed] = useState(false)
  const [cursor, setCursor] = useState({ left: '10px', top: '50px', opacity: 0, scale: 1 })
  const runningRef = useRef(false)
  const observedRef = useRef(false)

  const runCursor = useCallback(() => {
    if (runningRef.current) return
    runningRef.current = true

    const cont = containerRef.current
    const target = dayCellsRef.current[3]
    const btn = btnRef.current
    if (!cont || !target || !btn) { runningRef.current = false; return }

    function getPos(el: HTMLElement) {
      const cr = el.getBoundingClientRect()
      const pr = cont!.getBoundingClientRect()
      return { left: (cr.left - pr.left + 6) + 'px', top: (cr.top - pr.top + 4) + 'px' }
    }

    const start = getPos(dayCellsRef.current[0]!)
    setCursor({ ...start, opacity: 0, scale: 1 })

    const t = (ms: number, fn: () => void) => setTimeout(fn, ms)
    t(200,  () => setCursor(c => ({ ...c, opacity: 1 })))
    t(700,  () => setCursor(c => ({ ...c, ...getPos(target) })))
    t(1250, () => { setActiveDay(3); setCursor(c => ({ ...c, scale: 0.8 })) })
    t(1450, () => setCursor(c => ({ ...c, scale: 1 })))
    t(1900, () => setCursor(c => ({ ...c, ...getPos(btn!) })))
    t(2400, () => { setCursor(c => ({ ...c, scale: 0.82 })); setBtnPressed(true) })
    t(2620, () => { setCursor(c => ({ ...c, scale: 1 })); setBtnPressed(false) })
    t(3100, () => setCursor(c => ({ ...c, opacity: 0 })))
    t(4000, () => { setActiveDay(null); runningRef.current = false; setTimeout(runCursor, 900) })
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el || observedRef.current) return
    observedRef.current = true
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(runCursor, 600); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [runCursor])

  const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="feat-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="mono" style={{ fontSize: '10px', color: 'var(--color-primary)', letterSpacing: '0.14em', marginBottom: '10px' }}>03 — DELIVER</div>
      <h3 style={{ fontSize: '21px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px', color: '#fff' }}>Ship and walk away</h3>
      <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '20px' }}>We build, test, and hand off — you get a live system, not an ongoing project.</p>
      <div
        ref={containerRef}
        style={{ background: 'rgba(0,0,0,0.28)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}
      >
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px', fontWeight: 500 }}>Deployment Schedule</div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
          {DAYS.map((d, i) => (
            <div
              key={i}
              ref={el => { dayCellsRef.current[i] = el }}
              className={`day-cell${activeDay === i ? ' active' : ''}`}
            >
              {d}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            ref={btnRef}
            className="btn btn-primary"
            style={{ padding: '8px 20px', fontSize: '13px', borderRadius: '8px', transform: btnPressed ? 'scale(0.96)' : 'scale(1)', transition: 'transform 0.2s ease' }}
          >
            Deploy
          </button>
        </div>
        {/* Virtual cursor */}
        <svg
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: 10,
            opacity: cursor.opacity,
            left: cursor.left,
            top: cursor.top,
            transform: `scale(${cursor.scale})`,
            filter: 'drop-shadow(0 0 6px var(--color-primary))',
            transition: 'left 0.5s cubic-bezier(0.25,0.46,0.45,0.94), top 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.3s ease, transform 0.15s ease',
          }}
          width="16" height="20" viewBox="0 0 16 20"
        >
          <path d="M0 0L0 15L3.5 11L6.5 17L8.5 16L5.5 10L10 10Z" fill="var(--color-primary)" opacity="0.92"/>
        </svg>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────
export default function ServicesGrid() {
  return (
    <section id="features" style={{ padding: '120px 64px', background: 'var(--navy)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="mono" style={{ fontSize: '11px', color: 'var(--color-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
          What We Build
        </div>
        <h2 className="heading" style={{ fontSize: 'clamp(36px, 5vw, 62px)', maxWidth: '580px', marginBottom: '64px', lineHeight: 1.05 }}>
          Every feature is a{' '}
          <span style={{ color: 'var(--muted)' }}>functional artifact</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <PipelineCard />
          <TypewriterCard />
          <SchedulerCard />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #features { padding: 80px 24px !important; }
        }
      `}</style>
    </section>
  )
}
