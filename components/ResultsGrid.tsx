import Link from 'next/link'

type Result = { metric: string; value: string }
type CaseStudy = {
  title: string; slug: string; client: string
  industry: string; results: Result[]; tags: string[]
}
type Props = { results: CaseStudy[] }

export default function ResultsGrid({ results }: Props) {
  return (
    <section
      id="results"
      style={{ padding: '120px 64px', background: 'var(--navy)' }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="mono" style={{ fontSize: '11px', color: 'var(--color-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
          ROI Proof
        </div>
        <h2 className="heading" style={{ fontSize: 'clamp(36px, 5vw, 62px)', maxWidth: '580px', marginBottom: '64px', lineHeight: 1.05 }}>
          Results that{' '}
          <span style={{ color: 'var(--muted)' }}>speak numbers</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {results.map((cs) => (
            <div key={cs.slug} className="feat-card" style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Industry pill — monospace */}
              <div style={{ marginBottom: '12px' }}>
                <span
                  className="mono"
                  style={{
                    display: 'inline-block', fontSize: '10px', fontWeight: 600,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    padding: '3px 10px', borderRadius: '999px',
                    background: 'rgba(168,85,247,0.07)',
                    border: '1px solid rgba(168,85,247,0.2)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {cs.industry}
                </span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '20px', color: '#fff', lineHeight: 1.3 }}>
                {cs.title}
              </h3>

              {/* Massive metric callouts */}
              {cs.results && cs.results.length > 0 && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                  {cs.results.slice(0, 2).map((r, i) => (
                    <div key={i}>
                      <div
                        className="mono"
                        style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1, marginBottom: '4px' }}
                      >
                        {r.value}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {r.metric}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tags + link */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {cs.tags?.slice(0, 2).map((tag, i) => (
                    <span key={i} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--muted)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={`/case-studies/${cs.slug}`} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Full study &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '48px' }}>
          <Link href="/case-studies" className="btn btn-secondary" style={{ fontSize: '14px' }}>
            View All Case Studies
          </Link>
        </div>
      </div>
    </section>
  )
}
