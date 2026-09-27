'use client'

import { useEffect, useRef } from 'react'
import { useAuditModal } from '@/components/audit/AuditModalContext'
import { SPOTS_OPEN, TOTAL_SPOTS } from '@/lib/site-config'

export default function FinalCta() {
  const { openModal } = useAuditModal()
  const secRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const sec = secRef.current
    if (!sec) return
    const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (REDUCED) return
    sec.classList.add('fill-ready')
    let timer: ReturnType<typeof setTimeout> | null = null
    function sectionIsScreen() {
      const r = sec!.getBoundingClientRect(), vh = innerHeight
      if (!r.height) return false
      const visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0))
      return visible / Math.min(r.height, vh) > 0.75
    }
    function setFocus(on: boolean) { sec!.classList.toggle('focus', on) }
    function onMove() {
      if (timer) clearTimeout(timer)
      if (!sectionIsScreen()) setFocus(false)
      timer = setTimeout(() => setFocus(sectionIsScreen()), 650)
    }
    addEventListener('scroll', onMove, { passive: true })
    addEventListener('resize', onMove)
    onMove()
    return () => {
      removeEventListener('scroll', onMove)
      removeEventListener('resize', onMove)
      if (timer) clearTimeout(timer)
    }
  }, [])

  return (
    <section className="dark final" ref={secRef}>
      <div className="wrap">
        <h2 className="h2 dim-soft">Find out where your leads are getting lost.</h2>
        <p className="lead dim">Get a free audit and see what I&rsquo;d fix first.</p>
        <button className="btn btn-primary fill-cta" onClick={openModal}>Get Your Free Audit</button>
        <div className="dim">
          <span className="capacity">
            <span className="dots" aria-hidden="true">
              {Array.from({ length: TOTAL_SPOTS }, (_, i) => <i key={i} className={i < SPOTS_OPEN ? 'open' : ''} />)}
            </span>
            {SPOTS_OPEN > 0
              ? `Currently accepting ${SPOTS_OPEN} more client ${SPOTS_OPEN === 1 ? 'project' : 'projects'}`
              : `All ${TOTAL_SPOTS} client spots are taken. Join the waitlist.`}
          </span>
        </div>
      </div>
    </section>
  )
}
