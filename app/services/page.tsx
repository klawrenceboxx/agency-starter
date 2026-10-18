import Image from 'next/image'
import { CALENDLY_URL } from '@/lib/site-config'
import ServicePackages from './ServicePackages'
import { clientExperience } from './service-data'
import styles from './services.module.css'

export const metadata = {
  title: 'Services',
  description: 'Compare BOXX website conversion and email & SMS lead-nurturing packages. Explore the Complete Growth System and book a free strategy call.',
}

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="services-title">
        <div className={`wrap ${styles.heroGrid}`}>
          <h1 className="h1" id="services-title">BOXX Automations Services</h1>
          <div className={styles.heroArt}>
            {/* Replace this asset to update the device composition without changing the layout. */}
            <Image src="/services/devices.webp" alt="BOXX laptop: Websites that convert. Smartphone: Automated follow-ups that get results." width={1600} height={640} sizes="(max-width: 700px) 100vw, 70vw" priority />
          </div>
        </div>
      </section>
      <ServicePackages />
      <section className={styles.flagship} aria-labelledby="complete-title">
        <div className={`wrap ${styles.flagshipGrid}`}>
          <div className={styles.flagshipCopy}>
            <span className={styles.badge}>Our recommendation</span>
            <h2 className="h2" id="complete-title">Complete Growth System</h2>
            <p className={styles.description}>Everything in Website Conversion Premium + Email &amp; SMS Premium, including the Premium Client Experience.</p>
            <ul className={styles.primaryInclusions}>{['Complete website conversion system', 'Automated email and SMS nurturing', 'CRM, booking, analytics and integrations', 'All seven Premium Client Experience inclusions'].map(item => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
            <a className={`btn btn-primary ${styles.call}`} href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a Free Strategy Call</a>
            <p className={styles.disclaimer}>One-time implementation fee. Software subscriptions, hosting, SMS usage and ongoing management are separate.</p>
          </div>
          <div className={styles.systemCards}>
            <article className={styles.systemCard}><span className={styles.systemIcon} aria-hidden="true">▤</span><div><h3>Website Conversion Premium</h3><p>Design and development for up to 5 pages, full conversion copywriting, SEO, analytics, and A/B testing.</p></div></article>
            <span className={styles.connector} aria-hidden="true">+</span>
            <article className={styles.systemCard}><span className={styles.systemIcon} aria-hidden="true">✉</span><div><h3>Email &amp; SMS Premium</h3><p>7 designed nurturing emails, advanced automation and segmentation, CRM, SMS, booking, and a 60-day re-engagement sequence (2 emails).</p></div></article>
            <span className={styles.connector} aria-hidden="true">+</span>
            <article className={`${styles.systemCard} ${styles.experienceCard}`}>
              <div className={styles.experienceHeading}><span className={styles.systemIcon} aria-hidden="true">◇</span><div><h3>Premium Client Experience</h3><p>Clear communication, complete ownership, and 120-day technical protection.</p></div></div>
              <details className={styles.experienceDetails}><summary>Explore all seven inclusions<span className={styles.expand} aria-hidden="true">+</span></summary><ol>{clientExperience.map(([title, description], index) => <li key={title} className={index === 3 ? styles.guarantee : undefined}><details><summary>{title}<span className={styles.expand} aria-hidden="true">+</span></summary><p>{description}</p></details></li>)}</ol></details>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
