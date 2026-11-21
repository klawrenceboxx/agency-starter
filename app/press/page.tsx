import AuditTrigger from '@/components/audit/AuditTrigger'
import { PRESS } from '@/lib/press'

export const metadata = {
  title: 'Press',
  description:
    'Articles and publications featuring Kaleel Lawrence-Boxx and Boxx Automations.',
  alternates: { canonical: '/press' },
}

function formatDate(d: string) {
  return new Date(`${d}T12:00:00`).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function PressPage() {
  return (
    <>
      <section className="dark page-hero">
        <div className="wrap">
          <h1 className="h1">Press.</h1>
          <p className="lead">Articles and publications featuring Kaleel Lawrence-Boxx and Boxx Automations.</p>
        </div>
      </section>
      <section>
        <div className="wrap local-body">
          <div className="local-block">
            <h2 className="h2">Featured in</h2>
            <ul>
              {PRESS.map((p) => (
                <li key={p.url}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    {p.outlet}: {p.title}
                  </a>
                  <br />
                  <small>{formatDate(p.date)}</small>
                  <p>{p.summary}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="local-block">
            <h2 className="h2">Media inquiries</h2>
            <p>
              Writing a piece on websites, conversion or automated follow-up for small businesses? Email{' '}
              <a href="mailto:hello@boxxautomations.space">hello@boxxautomations.space</a>.
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
