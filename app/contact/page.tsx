import { CALENDLY_URL, LINKEDIN_URL, PHONE_DISPLAY, PHONE_E164 } from '@/lib/site-config'
import styles from './contact.module.css'

export const metadata = {
  title: 'Contact',
  description: 'Book a free strategy call with Boxx Automations in Vaughan, or call and text directly. Get help with your website and automated email follow-up.',
  alternates: { canonical: '/contact' },
}

function ContactIcon({ kind }: { kind: 'calendar' | 'phone' | 'linkedin' }) {
  return <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'calendar' ? <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 11h18M7 15h.01M12 15h.01M17 15h.01M7 18h.01M12 18h.01" /></> : kind === 'phone' ? <path d="M21 16.5v3a2 2 0 0 1-2.2 2A18 18 0 0 1 2.5 5.2 2 2 0 0 1 4.5 3h3a1 1 0 0 1 1 .85l.5 3a1 1 0 0 1-.3.9L7 9.5a14 14 0 0 0 7.5 7.5l1.75-1.7a1 1 0 0 1 .9-.3l3 .5a1 1 0 0 1 .85 1Z" /> : <><rect x="3" y="9" width="4" height="12" rx=".5" /><circle cx="5" cy="4" r="2" /><path d="M11 21V9h4v2a4 4 0 0 1 7 3v7h-4v-6a2 2 0 0 0-4 0v6" /></>}
  </svg>
}

export default function ContactPage() {
  return (
    <section className={styles.contact} aria-labelledby="contact-title">
      <div className={`wrap ${styles.container}`}>
        <div className={styles.intro}>
          <h1 className="h1" id="contact-title">Let&rsquo;s talk about your business.</h1>
          <p className="lead">Have a question or a project in mind? Choose whichever way works best for you.</p>
        </div>
        <div className={styles.cards}>
          <article className={`${styles.card} ${styles.primary}`}>
            <ContactIcon kind="calendar" />
            <h2>Book a free strategy call</h2>
            <p>Let&rsquo;s discuss your business, your goals, and what BOXX can help you improve.</p>
            <a className={`btn btn-primary ${styles.action}`} href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a Call</a>
          </article>
          <article className={styles.card}>
            <ContactIcon kind="phone" />
            <h2>Call or text directly</h2>
            <p>Prefer a quick conversation? Feel free to call or send a text.</p>
            <a className={`btn btn-ghost ${styles.action} ${styles.secondary}`} href={`tel:${PHONE_E164}`}>{PHONE_DISPLAY}</a>
          </article>
        </div>
        <article className={styles.linkedin}>
          <ContactIcon kind="linkedin" />
          <div><h2>Connect on LinkedIn</h2><p>Prefer messaging? Connect with me on LinkedIn.</p></div>
          <a className={`btn btn-ghost ${styles.profile}`} href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">View Profile</a>
        </article>
      </div>
    </section>
  )
}
