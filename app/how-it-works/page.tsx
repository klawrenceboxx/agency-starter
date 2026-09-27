import AuditTrigger from '@/components/audit/AuditTrigger'
import { PHASES } from '@/lib/site-config'

export const metadata = { title: 'How It Works' }

export default function HowItWorksPage() {
  return (
    <>
      <section className="dark page-hero">
        <div className="wrap">
          <h1 className="h1">How this site was built.</h1>
          <p className="lead">Every phase of my conversion framework, shown on this site, with the real deliverable from each step. It&rsquo;s the same process your project would follow.</p>
        </div>
      </section>
      <section>
        <div className="wrap">
          <ol className="phase-list">
            {PHASES.map(([tag, title, desc]) => (
              <li className="phase" key={tag}>
                <div className="vid">Video coming soon</div>
                <div><span className="tag">{tag}</span><h3>{title}</h3><p>{desc}</p></div>
              </li>
            ))}
          </ol>
          <div className="process-foot"><AuditTrigger>Get Your Free Audit</AuditTrigger></div>
        </div>
      </section>
    </>
  )
}
