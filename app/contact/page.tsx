import AuditTrigger from '@/components/audit/AuditTrigger'
import { CALENDLY_URL, LINKEDIN_URL } from '@/lib/site-config'

export const metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <>
      <section className="dark page-hero">
        <div className="wrap">
          <h1 className="h1">Get in touch.</h1>
          <p className="lead">The fastest way to start is the free audit. If you&rsquo;d rather talk first, book a call.</p>
        </div>
      </section>
      <section>
        <div className="wrap contact-grid">
          <div className="contact-card">
            <strong>Free audit</strong>
            <p>Tell me about your business and get your audit by email.</p>
            <AuditTrigger>Get Your Free Audit</AuditTrigger>
          </div>
          <div className="contact-card">
            <strong>Book a call</strong>
            <p>Pick a time that works for you.</p>
            <a className="btn btn-ghost" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Open calendar</a>
          </div>
          <div className="contact-card">
            <strong>LinkedIn</strong>
            <p>Connect or send a message.</p>
            <a className="btn btn-ghost" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">View profile</a>
          </div>
        </div>
      </section>
    </>
  )
}
