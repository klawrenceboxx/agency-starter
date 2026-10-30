import AuditTrigger from '@/components/audit/AuditTrigger'
import { PARTNERS } from '@/lib/partners'

export const metadata = {
  title: 'Partners',
  description:
    'Businesses Boxx Automations works alongside: people I send clients to when the job is not website conversion or automated email follow-up.',
  alternates: { canonical: '/partners' },
}

export default function PartnersPage() {
  return (
    <>
      <section className="dark page-hero">
        <div className="wrap">
          <h1 className="h1">Partners.</h1>
          <p className="lead">
            I build conversion-focused websites and automated email follow-up. When a job needs something else, these are the
            people I point you to.
          </p>
        </div>
      </section>
      <section>
        <div className="wrap local-body">
          <div className="local-block">
            <h2 className="h2">Who I work alongside</h2>
            {PARTNERS.length === 0 ? (
              <p>Partners will be listed here soon.</p>
            ) : (
              <ul>
                {PARTNERS.map((p) => (
                  <li key={p.url}>
                    <a href={p.url} target="_blank" rel="noopener">
                      {p.name}
                    </a>
                    . {p.blurb}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="local-block">
            <h2 className="h2">Not sure which one you need?</h2>
            <p>
              Start with the free audit. I will look at your website and tell you what I would fix first, and whether it is
              something I can help with.
            </p>
            <div className="process-foot">
              <AuditTrigger>Get Your Free Audit</AuditTrigger>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
