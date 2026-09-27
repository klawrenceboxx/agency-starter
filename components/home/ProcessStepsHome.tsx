import Link from 'next/link'
import AuditTrigger from '@/components/audit/AuditTrigger'

const STEPS: [string, string][] = [
  ['Get your free audit', 'Click the button to start.'],
  ['Tell me about your business', 'A quick form. About 30 seconds.'],
  ['Get your results', 'Your audit arrives by email, right away.'],
  ['Get your recommendations', "What I'd fix first."],
  ['Book a quick call', 'Talk through your goals, no pressure.'],
]

export default function ProcessStepsHome() {
  return (
    <section className="tinted">
      <div className="wrap">
        <div className="process-head">
          <h2 className="h2">From free audit to a clear next step</h2>
          <p className="lead">No sales pitch up front. You get something useful first, then decide.</p>
        </div>
        <ol className="steps">
          {STEPS.map(([title, sub], i) => (
            <li key={title}><div className="num">{i + 1}</div><div><strong>{title}</strong><span>{sub}</span></div></li>
          ))}
        </ol>
        <div className="process-foot">
          <AuditTrigger>Get Your Free Audit</AuditTrigger>
          <Link className="textlink" href="/how-it-works">See the full 10-phase system &rarr;</Link>
        </div>
      </div>
    </section>
  )
}
