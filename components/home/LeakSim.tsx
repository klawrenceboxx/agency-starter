'use client'

import { useEffect, useRef, useState } from 'react'

type Mode = 'leaky' | 'boxx'
const COPY: Record<Mode, [string, string]> = {
  leaky: ['Without a system', 'Leads fall out at every stage.'],
  boxx: ['With Boxx', 'The gaps close, so more leads reach you.'],
}
const LEAK_P: Record<Mode, [number, number, number]> = { leaky: [0.34, 0.38, 0.42], boxx: [0.05, 0.05, 0.05] }
const LABELS = ['Visit → Leave', 'Inquire → Wait', 'Not ready → Forgotten']

export default function LeakSim() {
  const cvRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<Mode>('leaky')
  const pickRef = useRef<(m: Mode, user?: boolean) => void>(() => {})

  useEffect(() => {
    const cv = cvRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches

    let W = 0, H = 0, dpr = 1
    let mode2: Mode = 'leaky', auto = true, autoT = 0
    type Dot = { x: number; y: number; vx: number; vy: number; s: 'flow' | 'fall' | 'done'; chk: number; a: number; leak?: number }
    let dots: Dot[] = []
    let pulses = [0, 0, 0], goal = 0, spawnT = 0, last = 0, running = false, patch = 0

    function size() {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      W = cv!.clientWidth; H = cv!.clientHeight
      cv!.width = W * dpr; cv!.height = H * dpr; ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const geo = () => { const x0 = 16, x1 = W - 70, y = H * 0.36; return { x0, x1, y, leaks: [0.22, 0.5, 0.78].map(f => x0 + (x1 - x0) * f), holeY: H - 58, gx: W - 38 } }

    pickRef.current = (m: Mode, user?: boolean) => {
      mode2 = m; if (user) { auto = false; autoT = 0 }
      setMode(m)
      if (REDUCED) staticFrame()
    }

    function spawn(g: ReturnType<typeof geo>) { dots.push({ x: g.x0, y: g.y + (Math.random() - 0.5) * 10, vx: 80 + Math.random() * 40, vy: 0, s: 'flow', chk: 0, a: 1 }) }

    function step(dt: number) {
      const g = geo()
      patch += ((mode2 === 'boxx' ? 1 : 0) - patch) * Math.min(1, dt * 4)
      spawnT -= dt; if (spawnT <= 0) { spawn(g); spawnT = 0.16 + Math.random() * 0.1 }
      for (const d of dots) {
        if (d.s === 'flow') {
          d.x += d.vx * dt; d.y += (g.y - d.y) * Math.min(1, dt * 3)
          if (d.chk < 3 && d.x >= g.leaks[d.chk]) {
            if (Math.random() < LEAK_P[mode2][d.chk]) { d.s = 'fall'; d.leak = d.chk; d.vx *= 0.25 }
            d.chk++
          }
          if (d.x >= g.gx - 20) { d.s = 'done'; goal = 1 }
        } else if (d.s === 'fall') {
          d.vy += 620 * dt; d.y += d.vy * dt; d.x += d.vx * dt
          if (d.y >= g.holeY) { d.s = 'done'; pulses[d.leak!] = 1 }
        }
      }
      dots = dots.filter(d => d.s !== 'done')
      pulses = pulses.map(p => Math.max(0, p - dt * 2.5)) as typeof pulses; goal = Math.max(0, goal - dt * 2)
      if (auto && !REDUCED) { autoT += dt; if (autoT > 7) { mode2 = mode2 === 'leaky' ? 'boxx' : 'leaky'; autoT = 0; setMode(mode2) } }
    }

    function draw() {
      const g = geo(); ctx!.clearRect(0, 0, W, H)
      g.leaks.forEach((lx, i) => {
        const openAmt = 1 - patch
        ctx!.save()
        ctx!.globalAlpha = 0.35 + 0.65 * openAmt
        ctx!.fillStyle = '#1A0329'
        ctx!.beginPath(); ctx!.ellipse(lx, g.holeY, 26 + pulses[i] * 6, 8, 0, 0, Math.PI * 2); ctx!.fill()
        ctx!.strokeStyle = `rgba(255,255,255,${0.12 + pulses[i] * 0.4})`; ctx!.lineWidth = 1.5; ctx!.stroke()
        ctx!.setLineDash([3, 5]); ctx!.strokeStyle = `rgba(199,123,255,${0.35 * openAmt})`
        ctx!.beginPath(); ctx!.moveTo(lx, g.y + 8); ctx!.lineTo(lx, g.holeY - 10); ctx!.stroke(); ctx!.setLineDash([])
        ctx!.restore()
        ctx!.fillStyle = 'rgba(214,198,232,.9)'; ctx!.font = '500 12px Inter, Arial, sans-serif'; ctx!.textAlign = 'center'
        if (W > 520) ctx!.fillText(LABELS[i], lx, g.holeY + 26)
      })
      const gap = 14 * (1 - patch)
      const grad = ctx!.createLinearGradient(g.x0, 0, g.x1, 0)
      grad.addColorStop(0, 'rgba(255,255,255,.28)'); grad.addColorStop(1, patch > 0.5 ? 'rgba(156,22,244,.9)' : 'rgba(255,255,255,.28)')
      ctx!.strokeStyle = grad; ctx!.lineWidth = 4; ctx!.lineCap = 'round'
      let from = g.x0
      ;[...g.leaks, g.gx - 26].forEach((to, i) => {
        const end = i < 3 ? to - gap : to
        ctx!.beginPath(); ctx!.moveTo(from, g.y); ctx!.lineTo(end, g.y); ctx!.stroke()
        from = i < 3 ? to + gap : to
      })
      if (patch > 0.02) { g.leaks.forEach(lx => { ctx!.fillStyle = `rgba(156,22,244,${patch})`; ctx!.beginPath(); ctx!.arc(lx, g.y, 5 * patch + 1, 0, Math.PI * 2); ctx!.fill() }) }
      ctx!.beginPath(); ctx!.arc(g.gx, g.y, 20 + goal * 4, 0, Math.PI * 2)
      ctx!.fillStyle = `rgba(156,22,244,${0.25 + goal * 0.35})`; ctx!.fill()
      ctx!.lineWidth = 2; ctx!.strokeStyle = '#9C16F4'; ctx!.stroke()
      ctx!.fillStyle = '#fff'; ctx!.font = '700 12px Inter, Arial, sans-serif'; ctx!.textAlign = 'center'
      ctx!.fillText('Customers', g.gx - 4, g.y - 32)
      for (const d of dots) {
        ctx!.beginPath(); ctx!.arc(d.x, d.y, 4, 0, Math.PI * 2)
        ctx!.fillStyle = d.s === 'fall' ? 'rgba(214,198,232,.55)' : '#C77BFF'; ctx!.fill()
      }
    }

    function loop(t: number) {
      if (!running) return
      const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t
      step(dt); draw(); requestAnimationFrame(loop)
    }
    function staticFrame() {
      dots = []; patch = mode2 === 'boxx' ? 1 : 0
      for (let i = 0; i < 260; i++) step(1 / 60)
      pulses = [0, 0, 0]; goal = 0; draw()
    }
    function onResize() { size(); if (REDUCED) staticFrame() }
    window.addEventListener('resize', onResize)
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) size()
      if (REDUCED) { if (e.isIntersecting) staticFrame(); return }
      const was = running; running = e.isIntersecting
      if (running && !was) { last = 0; requestAnimationFrame(loop) }
    }), { threshold: 0.2 })
    io.observe(cv)
    size()
    if (REDUCED) staticFrame()

    return () => { window.removeEventListener('resize', onResize); io.disconnect(); running = false }
  }, [])

  return (
    <div className="leak-sim">
      <div className="leak-sim-top">
        <p className="leak-sim-title">{COPY[mode][0]}<span>{COPY[mode][1]}</span></p>
        <div className="seg" role="group" aria-label="Compare">
          <button type="button" aria-pressed={mode === 'leaky'} onClick={() => pickRef.current('leaky', true)}>Without a system</button>
          <button type="button" aria-pressed={mode === 'boxx'} onClick={() => pickRef.current('boxx', true)}>With Boxx</button>
        </div>
      </div>
      <canvas ref={cvRef} role="img" aria-label="Animation: leads travel toward becoming customers. Without a system, many fall out at the visit, inquiry and follow-up stages. With Boxx, the gaps are closed and most leads reach you." />
      <div className="leak-foot"><p>More of the leads you already paid for make it to the next step.</p></div>
    </div>
  )
}
