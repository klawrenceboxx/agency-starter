'use client'

import { useEffect, useRef, useState } from 'react'

type Stat = { value: string; label: string }
type Props = { stats: Stat[] }

function parseValue(val: string) {
  const match = val.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return null
  return { prefix: match[1], num: parseFloat(match[2]), suffix: match[3] }
}

function CountUp({ value, isActive }: { value: string; isActive: boolean }) {
  const parsed = parseValue(value)
  const [display, setDisplay] = useState(parsed ? `${parsed.prefix}0${parsed.suffix}` : value)

  useEffect(() => {
    if (!isActive || !parsed) return
    const { prefix, num, suffix } = parsed
    const duration = 1400
    const isDecimal = String(num).includes('.')
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = num * eased
      const formatted = isDecimal ? current.toFixed(1) : Math.floor(current).toString()
      setDisplay(`${prefix}${formatted}${suffix}`)
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [isActive]) // eslint-disable-line react-hooks/exhaustive-deps

  return <>{display}</>
}

export default function TrustSignals({ stats }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '48px 64px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div className="mono" style={{ fontSize: '44px', fontWeight: 600, color: 'var(--color-primary)' }}>
              <CountUp value={stat.value} isActive={isVisible} />
            </div>
            <div style={{ fontSize: '11px', letterSpacing: '0.14em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: '6px' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
