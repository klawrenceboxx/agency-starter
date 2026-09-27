'use client'

import { useEffect, useRef } from 'react'
import { useAuditModal } from '@/components/audit/AuditModalContext'

export default function HomeHero() {
  const { openModal } = useAuditModal()
  const heroRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  // interactive node network background
  useEffect(() => {
    const hero = heroRef.current
    const canvas = canvasRef.current
    if (!hero || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches
    const C = {
      nodeCountDesktop: 21, nodeCountMobile: 13, connectionDistance: 190, interactionDistance: 150,
      minRadius: 1.2, maxRadius: 2.4, speed: 0.075, nodeOpacity: 0.32, nodeHoverOpacity: 0.75,
      lineOpacity: 0.1, lineHoverOpacity: 0.24, mousePushStrength: 0.006, glowChance: 0.12,
    }
    let W = 0, H = 0, dpr = 1, raf: number | null = null, visible = false
    type Node = { x: number; y: number; vx: number; vy: number; r: number; glow: boolean; po: number; ps: number; pulse: number }
    let nodes: Node[] = []
    const ptr = { x: 0, y: 0, active: false }
    const count = () => (innerWidth < 700 ? C.nodeCountMobile : C.nodeCountDesktop)
    function mk(): Node {
      const a = Math.random() * Math.PI * 2, sp = C.speed * (0.45 + Math.random() * 0.7)
      return { x: Math.random() * W, y: Math.random() * H, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: C.minRadius + Math.random() * (C.maxRadius - C.minRadius), glow: Math.random() < C.glowChance, po: Math.random() * Math.PI * 2, ps: 0.0007 + Math.random() * 0.0007, pulse: 1 }
    }
    function resize() {
      const r = hero!.getBoundingClientRect(), wasEmpty = !W || !H
      W = r.width; H = r.height
      if (!W || !H) return
      dpr = Math.min(devicePixelRatio || 1, 2)
      canvas!.width = Math.round(W * dpr); canvas!.height = Math.round(H * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (wasEmpty || nodes.length !== count()) nodes = Array.from({ length: count() }, mk)
    }
    function update(n: Node, t: number) {
      if (!REDUCED) { n.x += n.vx; n.y += n.vy }
      if (ptr.active) {
        const dx = n.x - ptr.x, dy = n.y - ptr.y, d = Math.hypot(dx, dy)
        if (d > 0 && d < C.interactionDistance) { const k = (1 - d / C.interactionDistance) * C.mousePushStrength * 30; n.x += dx / d * k; n.y += dy / d * k }
      }
      const m = 25
      if (n.x < -m) n.x = W + m; if (n.x > W + m) n.x = -m; if (n.y < -m) n.y = H + m; if (n.y > H + m) n.y = -m
      n.pulse = n.glow && !REDUCED ? 0.75 + Math.sin(t * n.ps + n.po) * 0.25 : 1
    }
    function prox(x: number, y: number) { if (!ptr.active) return 0; return Math.max(0, 1 - Math.hypot(x - ptr.x, y - ptr.y) / C.interactionDistance) }
    function drawNode(n: Node) {
      const p = prox(n.x, n.y), op = C.nodeOpacity + p * (C.nodeHoverOpacity - C.nodeOpacity), rad = n.r * (1 + p * 0.65) * n.pulse
      if (n.glow || p > 0.35) {
        const gr = rad * (4 + p * 3), g = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, gr)
        g.addColorStop(0, `rgba(205,120,255,${0.12 + p * 0.2})`); g.addColorStop(1, 'rgba(205,120,255,0)')
        ctx!.beginPath(); ctx!.arc(n.x, n.y, gr, 0, Math.PI * 2); ctx!.fillStyle = g; ctx!.fill()
      }
      ctx!.beginPath(); ctx!.arc(n.x, n.y, rad, 0, Math.PI * 2); ctx!.fillStyle = `rgba(214,150,255,${op})`; ctx!.fill()
    }
    function lines() {
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y)
        if (d > C.connectionDistance) continue
        const s = 1 - d / C.connectionDistance, p = prox((a.x + b.x) / 2, (a.y + b.y) / 2)
        ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y)
        ctx!.strokeStyle = `rgba(200,130,255,${C.lineOpacity * s + p * C.lineHoverOpacity * s})`
        ctx!.lineWidth = 0.65 + p * 0.45; ctx!.stroke()
      }
    }
    function draw(t = 0) {
      raf = null
      if (!W || !H) return
      ctx!.clearRect(0, 0, W, H)
      nodes.forEach(n => update(n, t)); lines(); nodes.forEach(drawNode)
      if (!REDUCED && visible) raf = requestAnimationFrame(draw)
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(draw) }
    function onMove(e: PointerEvent) { const r = hero!.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; ptr.active = true; if (REDUCED) kick() }
    function onLeave() { ptr.active = false; if (REDUCED) kick() }
    hero.addEventListener('pointermove', onMove)
    hero.addEventListener('pointerleave', onLeave)
    const ro = new ResizeObserver(() => { resize(); kick() })
    ro.observe(hero)
    const io = new IntersectionObserver(es => es.forEach(e => { visible = e.isIntersecting; if (visible) kick() }))
    io.observe(hero)
    resize()
    return () => {
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
      ro.disconnect(); io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // magnetic CTA
  useEffect(() => {
    const btn = btnRef.current
    const hero = heroRef.current
    if (!btn || !hero) return
    const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (REDUCED || !matchMedia('(pointer: fine)').matches) return
    const NEAR = 380, MAX = 24, FLOOR = 0.12
    let tx = 0, ty = 0, cx = 0, cy = 0, sc = 1, tsc = 1, raf: number | null = null
    btn.classList.add('pulling')
    function aim(e: PointerEvent) {
      const r = btn!.getBoundingClientRect()
      const bx = r.left + r.width / 2 - cx, by = r.top + r.height / 2 - cy
      const dx = e.clientX - bx, dy = e.clientY - by, d = Math.hypot(dx, dy) || 1
      const t = Math.max(0, 1 - d / NEAR)
      const f = FLOOR + (1 - FLOOR) * t * t * t
      const mag = Math.min(MAX * f, d * 0.4)
      tx = dx / d * mag; ty = dy / d * mag
      tsc = 1 + 0.04 * t * t
      run()
    }
    function reset() { tx = 0; ty = 0; tsc = 1; run() }
    function run() { if (!raf) raf = requestAnimationFrame(tick) }
    function tick() {
      cx += (tx - cx) * 0.16; cy += (ty - cy) * 0.16; sc += (tsc - sc) * 0.16
      btn!.style.transform = `translate(${cx.toFixed(2)}px,${cy.toFixed(2)}px) scale(${sc.toFixed(3)})`
      raf = (Math.abs(tx - cx) + Math.abs(ty - cy) + Math.abs(tsc - sc) > 0.05) ? requestAnimationFrame(tick) : null
    }
    hero.addEventListener('pointermove', aim)
    hero.addEventListener('pointerleave', reset)
    return () => {
      hero.removeEventListener('pointermove', aim)
      hero.removeEventListener('pointerleave', reset)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="dark hero" ref={heroRef}>
      <canvas id="hero-network" aria-hidden="true" ref={canvasRef} />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Website conversion + automated emails</span>
          <h1 className="h1">Turn more leads<br /> into paying<br /> customers.</h1>
          <p className="lead">Convert more of the leads you already paid for with a conversion-focused website and an automated lead nurturing system.</p>
          <div className="hero-actions">
            <button ref={btnRef} className="btn btn-primary magnet" onClick={openModal}>Get Your Free Audit</button>
            <p className="micro">Free. Takes 30 seconds. Your audit lands in your inbox.</p>
          </div>
        </div>
        <div className="founder photo">
          <button className="play" aria-label="Play intro video" onClick={openModal} />
          <div className="cap"><strong>Kaleel Lawrence-Boxx</strong><span>Founder, Boxx Automations. Vaughan, Ontario.</span></div>
        </div>
      </div>
    </section>
  )
}
