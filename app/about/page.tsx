import AuditTrigger from '@/components/audit/AuditTrigger'

export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <section className="page-hero">
      <div className="wrap about-grid">
        <div className="founder photo" role="img" aria-label="Photo of Kaleel Lawrence-Boxx">
          <div className="cap"><strong>Kaleel Lawrence-Boxx</strong><span>Founder, Boxx Automations</span></div>
        </div>
        <div>
          <h1 className="h2">Hi, I&rsquo;m Kaleel.</h1>
          <p>I run Boxx Automations out of Vaughan, Ontario. I&rsquo;m a small business owner too, so I know what it feels like to spend money on ads and events and not see it come back.</p>
          <p>I studied mechanical engineering, and I&rsquo;ve been writing code for about seven years. I also spend a lot of time studying how people make buying decisions. Put together, that means I build websites and emails around one question: what does this person need to see to take the next step?</p>
          <p>I only take on five clients at a time, so every project gets my full attention.</p>
          <div className="hero-actions" style={{ marginTop: 28 }}><AuditTrigger>Get Your Free Audit</AuditTrigger></div>
        </div>
      </div>
    </section>
  )
}
