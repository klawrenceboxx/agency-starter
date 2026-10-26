'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Milestone } from './journey-data'
import styles from './about.module.css'

export default function JourneyTimeline({ milestones }: { milestones: Milestone[] }) {
  const track = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLElement | null)[]>([])
  const [active, setActive] = useState(0)
  const drag = useRef<{ id: number; x: number; scrollLeft: number } | null>(null)

  const navigate = useCallback((index: number, instant = false) => {
    const target = Math.max(0, Math.min(milestones.length - 1, index))
    const container = track.current
    const card = cards.current[target]
    if (!container || !card) return
    const offset = card.getBoundingClientRect().left - container.getBoundingClientRect().left
      - (container.clientWidth - card.offsetWidth) / 2
    container.scrollTo({ left: container.scrollLeft + offset, behavior: instant || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }, [milestones.length])

  useEffect(() => {
    const container = track.current
    if (!container) return
    let frame = 0
    function updateActive() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!container) return
        const center = container.getBoundingClientRect().left + container.clientWidth / 2
        let nearest = 0
        let distance = Infinity
        cards.current.forEach((card, index) => {
          if (!card) return
          const rect = card.getBoundingClientRect()
          const delta = Math.abs(rect.left + rect.width / 2 - center)
          if (delta < distance) { distance = delta; nearest = index }
        })
        setActive(nearest)
      })
    }
    // Horizontal wheel gestures do not advance milestones; vertical scrolling stays natural.
    function wheel(event: WheelEvent) {
      if (!event.deltaX) return
      event.preventDefault()
      const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1
      window.scrollBy({ top: event.deltaY * scale, behavior: 'instant' })
    }
    container.addEventListener('wheel', wheel, { passive: false })
    container.addEventListener('scroll', updateActive, { passive: true })
    const observer = new ResizeObserver(updateActive)
    observer.observe(container)
    updateActive()
  return () => { container.removeEventListener('wheel', wheel); container.removeEventListener('scroll', updateActive); observer.disconnect(); cancelAnimationFrame(frame) }
  }, [])

  function finishDrag() {
    const container = track.current
    if (!container || !drag.current) return
    drag.current = null
    delete container.dataset.dragging
    container.style.scrollSnapType = ''
    const center = container.getBoundingClientRect().left + container.clientWidth / 2
    let nearest = 0
    let distance = Infinity
    cards.current.forEach((card, index) => {
      if (!card) return
      const rect = card.getBoundingClientRect()
      const delta = Math.abs(rect.left + rect.width / 2 - center)
      if (delta < distance) { nearest = index; distance = delta }
    })
    navigate(nearest)
  }

  return (
    <div className={`wrap ${styles.carousel}`} role="region" aria-roledescription="carousel" aria-label="Kaleel’s journey">
      <div className={styles.viewport}><div className={styles.track} ref={track} id="journey-track" tabIndex={0} onPointerDown={event => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return
        const container = event.currentTarget
        drag.current = { id: event.pointerId, x: event.clientX, scrollLeft: container.scrollLeft }
        container.setPointerCapture(event.pointerId)
        container.style.scrollSnapType = 'none'
        container.dataset.dragging = 'true'
        container.focus({ preventScroll: true })
      }} onPointerMove={event => {
        if (!drag.current || event.pointerId !== drag.current.id) return
        event.currentTarget.scrollLeft = drag.current.scrollLeft - (event.clientX - drag.current.x)
      }} onPointerUp={finishDrag} onPointerCancel={finishDrag} onLostPointerCapture={finishDrag} aria-label="Journey milestones. Use left and right arrow keys to navigate." onKeyDown={event => {
        if (event.target !== event.currentTarget) return
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
          event.preventDefault()
          navigate(event.key === 'Home' ? 0 : event.key === 'End' ? milestones.length - 1 : active + (event.key === 'ArrowRight' ? 1 : -1))
        }
      }}>
        {milestones.map((milestone, index) => <article key={milestone.title} ref={element => { cards.current[index] = element }} className={`${styles.milestone} ${index === active ? styles.active : ''}`} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${milestones.length}: ${milestone.title}`}>
          <div className={styles.milestoneImage}>
            {milestone.image ? (milestone.image.fit === 'contain' ? <><Image src={milestone.image.src} alt="" aria-hidden="true" fill draggable={false} sizes="(max-width: 700px) 80vw, 420px" className={styles.imageBackdrop} style={{ objectFit: 'cover' }} /><Image src={milestone.image.src} alt={milestone.image.alt} fill draggable={false} sizes="(max-width: 700px) 80vw, 420px" style={{ objectFit: 'contain' }} /></> : <Image src={milestone.image.src} alt={milestone.image.alt} fill draggable={false} sizes="(max-width: 700px) 80vw, 420px" style={{ objectFit: 'cover', objectPosition: milestone.image.position }} />) : <div className={styles.placeholder}><span>{milestone.placeholder}</span><small>Photo to come</small></div>}
          </div>
          <div className={styles.milestoneCopy}><span className={styles.label}>{milestone.label}</span><h3>{milestone.title}</h3><ul>{milestone.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul></div>
        </article>)}
      </div></div>
      <div className={styles.controls}>
        <button type="button" className={styles.arrow} onClick={() => navigate(active - 1)} disabled={active === 0} aria-label="Previous milestone" aria-controls="journey-track"><span aria-hidden="true">←</span></button>
        <div className={styles.progress}>
          <span className={styles.counter} aria-live="polite" aria-atomic="true">{active + 1} / {milestones.length}</span>
          <div className={styles.segments} aria-label="Go to a milestone">{milestones.map((milestone, index) => <button key={milestone.title} type="button" onClick={() => navigate(index)} aria-label={`Go to milestone ${index + 1}: ${milestone.title}`} aria-current={index === active ? 'step' : undefined} aria-controls="journey-track"><span /></button>)}</div>
        </div>
        <button type="button" className={styles.arrow} onClick={() => navigate(active + 1)} disabled={active === milestones.length - 1} aria-label="Next milestone" aria-controls="journey-track"><span aria-hidden="true">→</span></button>
      </div>
    </div>
  )
}
