'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type Props = {
  subheadline: string
  tagline: string
  calendlyUrl: string
}

export default function Hero({ subheadline, tagline, calendlyUrl }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animIdRef = useRef<number>(0)

  // Entrance animation states
  const [show, setShow] = useState([false, false, false, false, false])

  useEffect(() => {
    // Stagger entrance animations
    const delays = [100, 250, 400, 550, 700]
    const timers = delays.map((delay, i) =>
      setTimeout(() => {
        setShow(prev => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const hero = sectionRef.current
    if (!canvas || !hero) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0, H = 0
    let particles: Array<{
      x: number; y: number; vx: number; vy: number; r: number;
      step(): void; draw(): void;
    }> = []

    function createParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
        step() {
          this.x += this.vx; this.y += this.vy
          if (this.x < 0 || this.x > W) this.vx *= -1
          if (this.y < 0 || this.y > H) this.vy *= -1
        },
        draw() {
          ctx!.beginPath()
          ctx!.arc(this.x, this.y, this.r, 0, Math.PI * 2)
          ctx!.fillStyle = 'rgba(168,85,247,0.7)'
          ctx!.fill()
        }
      }
    }

    function resize() {
      W = canvas!.width = hero!.offsetWidth
      H = canvas!.height = hero!.offsetHeight
      const n = Math.min(Math.floor(W * H / 8000), 100)
      particles = Array.from({ length: n }, createParticle)
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H)
      const MAX_PP = 160, MAX_MP = 220
      const mouse = mouseRef.current
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        a.step(); a.draw()
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < MAX_PP) {
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y)
            ctx!.strokeStyle = `rgba(168,85,247,${(1 - d / MAX_PP) * 0.35})`
            ctx!.lineWidth = 0.8; ctx!.stroke()
          }
        }
        const dx = a.x - mouse.x, dy = a.y - mouse.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < MAX_MP) {
          ctx!.beginPath()
          ctx!.moveTo(a.x, a.y); ctx!.lineTo(mouse.x, mouse.y)
          ctx!.strokeStyle = `rgba(192,132,252,${(1 - d / MAX_MP) * 0.55})`
          ctx!.lineWidth = 1; ctx!.stroke()
        }
      }
      animIdRef.current = requestAnimationFrame(draw)
    }

    function onMouseMove(e: MouseEvent) {
      const r = hero!.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    function onMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    window.addEventListener('resize', resize)
    hero.addEventListener('mousemove', onMouseMove)
    hero.addEventListener('mouseleave', onMouseLeave)
    resize()
    draw()

    return () => {
      cancelAnimationFrame(animIdRef.current)
      window.removeEventListener('resize', resize)
      hero.removeEventListener('mousemove', onMouseMove)
      hero.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  const isExternal = calendlyUrl.startsWith('http')

  const entranceStyle = (i: number): React.CSSProperties => ({
    opacity: show[i] ? 1 : 0,
    transform: show[i] ? 'translateY(0)' : 'translateY(36px)',
    transition: 'opacity 0.65s ease, transform 0.65s ease',
  })

  return (
    <section
      ref={sectionRef}
      style={{
        height: '100dvh',
        marginTop: '-96px',
        backgroundImage: `
          linear-gradient(to bottom, rgba(10,15,30,0.92) 0%, transparent 28%),
          linear-gradient(to top, #0a0f1e 12%, rgba(10,15,30,0.72) 55%, rgba(10,15,30,0.28) 100%),
          url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '80px 64px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.38,
        }}
      />

      {/* Glow blobs */}
      <div style={{
        position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
        filter: 'blur(80px)',
        background: 'radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 70%)',
        width: '700px', height: '700px', top: '-150px', left: '-200px', opacity: 0.8,
      }} />
      <div style={{
        position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
        filter: 'blur(80px)',
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        width: '400px', height: '400px', bottom: '100px', right: '-100px', opacity: 0.4,
      }} />

      {/* Content — bottom left */}
      <div style={{ maxWidth: '700px', position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <div style={{ ...entranceStyle(0), display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '999px', padding: '5px 14px', marginBottom: '28px' }}>
          <div className="status-dot" />
          <span className="mono" style={{ fontSize: '11px', color: 'var(--color-primary)', letterSpacing: '0.12em' }}>
            {tagline.toUpperCase()}
          </span>
        </div>

        {/* Headline line 1 */}
        <div
          className="heading"
          style={{ ...entranceStyle(1), fontSize: 'clamp(52px, 8vw, 100px)', color: 'var(--body)', lineHeight: 0.93, marginBottom: '8px' }}
        >
          Systems that
        </div>

        {/* Headline line 2 */}
        <div
          className="heading"
          style={{ ...entranceStyle(2), fontSize: 'clamp(52px, 8vw, 100px)', lineHeight: 0.93, marginBottom: '32px' }}
        >
          <span className="gradient-text" style={{ fontStyle: 'italic' }}>close</span>
          <span style={{ color: 'var(--body)' }}> leads while you sleep.</span>
        </div>

        {/* Subheadline */}
        <p style={{ ...entranceStyle(3), fontSize: '18px', color: 'var(--muted)', maxWidth: '480px', lineHeight: 1.65, marginBottom: '36px' }}>
          {subheadline}
        </p>

        {/* CTAs */}
        <div style={{ ...entranceStyle(4), display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {isExternal ? (
            <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Book a Demo
            </a>
          ) : (
            <Link href={calendlyUrl} className="btn btn-primary">
              Book a Demo
            </Link>
          )}
          <a href="#features" className="btn btn-secondary">
            See Our Work
          </a>
        </div>
      </div>

      {/* Mobile padding adjustment */}
      <style>{`
        @media (max-width: 768px) {
          section[data-hero] { padding: 60px 24px !important; }
        }
      `}</style>
    </section>
  )
}
