'use client'

import AnimatedDetails from './AnimatedDetails'

import { useRef, useState } from 'react'
import { scopeNote, serviceCategories } from './service-data'
import styles from './services.module.css'

function PackageIcon({ tier }: { tier: number }) {
  return <svg className={styles.packageIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" />{tier === 2 ? <path d="m14 18 3 3 5-7" /> : tier === 1 ? <path d="M14 18h8m-4-4v8" /> : <rect x="14" y="14" width="7" height="7" rx="2" />}</svg>
}

export default function ServicePackages() {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  function select(index: number) { setActive(index); tabs.current[index]?.focus() }
  return (
    <section className={styles.packages} aria-label="Service packages">
      <div className="wrap">
        <div className={styles.tabs} role="tablist" aria-label="Choose a service">
          {serviceCategories.map((category, index) => <button key={category.id} ref={el => { tabs.current[index] = el }} id={`tab-${category.id}`} role="tab" type="button" aria-selected={index === active} aria-controls={`panel-${category.id}`} tabIndex={index === active ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => {
            if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
              event.preventDefault()
              select(event.key === 'Home' ? 0 : event.key === 'End' ? 1 : (active + 1) % 2)
            }
          }}>{category.label}</button>)}
        </div>
        <div className={styles.panels}>
          {serviceCategories.map((category, index) => <div key={category.id} id={`panel-${category.id}`} role="tabpanel" aria-labelledby={`tab-${category.id}`} hidden={index !== active} tabIndex={0}>
            <div className={styles.packageIntro}><h2 className="h2">{category.heading}</h2><p>{category.description}</p></div>
            <div className={styles.cards}>
              {category.packages.map((pkg, tier) => <article key={pkg.name} className={`${styles.card} ${tier === 2 ? styles.premium : ''}`}>
                <PackageIcon tier={tier} />
                <h3>{pkg.name}</h3><p className={styles.positioning}>{pkg.positioning}</p>
                <ul className={styles.deliverables}>{pkg.included.map(deliverable => <li key={deliverable.label}><AnimatedDetails><summary><span aria-hidden="true" className={styles.check}>✓</span><span>{deliverable.label}</span><span className={styles.expand} aria-hidden="true">+</span></summary><p>{deliverable.detail}</p></AnimatedDetails></li>)}</ul>
                <AnimatedDetails className={styles.fullDetails}><summary>View Full Details<span aria-hidden="true" className={styles.expand}>+</span></summary><div>{pkg.excluded && <p><strong>Not included:</strong> {pkg.excluded}</p>}<p>Premium Client Experience is included, tailored to your purchased services.</p><p>{scopeNote}</p></div></AnimatedDetails>
              </article>)}
            </div>
          </div>)}
        </div>
        <p className={styles.scope}>{scopeNote}</p>
      </div>
    </section>
  )
}
