type Props = { calendlyUrl: string }

export default function Pricing({ calendlyUrl }: Props) {
  const isExternal = calendlyUrl.startsWith('http')
  const bookLink = isExternal ? calendlyUrl : '/contact'
  const linkProps = isExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {}

  return (
    <section id="pricing" style={{ padding: '120px 64px', background: 'var(--surface)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="mono" style={{ fontSize: '11px', color: 'var(--color-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Packages
        </div>
        <h2 className="heading" style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: '10px' }}>
          Pick your <span style={{ color: 'var(--muted)' }}>stack</span>
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--muted)', marginBottom: '64px' }}>
          Fixed scope. No retainers. No surprises.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>

          {/* Starter */}
          <div className="price-card">
            <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.14em', marginBottom: '12px' }}>STARTER</div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>Automation Starter</h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px', lineHeight: 1.6 }}>One workflow, one integration. Done in a week.</p>
            <div style={{ marginBottom: '28px' }}>
              <span className="mono" style={{ fontSize: '42px', fontWeight: 700, color: '#fff' }}>$1,500</span>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}> one-time</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '28px' }}>
              {['1 AI workflow built', '1 tool integration', 'Full documentation', '30-day async support'].map(item => (
                <div key={item} className="price-li"><span>—</span>{item}</div>
              ))}
            </div>
            <a className="btn btn-secondary" href="#contact" style={{ width: '100%', padding: '13px', display: 'flex', justifyContent: 'center' }}>Get Started</a>
          </div>

          {/* Growth — featured */}
          <div className="price-card featured" style={{ marginTop: '-12px' }}>
            <div className="mono" style={{ fontSize: '10px', color: 'var(--color-primary)', letterSpacing: '0.14em', marginBottom: '12px' }}>GROWTH</div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>Growth Stack</h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px', lineHeight: 1.6 }}>AI automation + CRM setup. The full acquisition engine.</p>
            <div style={{ marginBottom: '28px' }}>
              <span className="mono" style={{ fontSize: '42px', fontWeight: 700, color: 'var(--color-primary)' }}>$3,500</span>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}> one-time</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '28px' }}>
              {['Full AI automation system', 'CRM + email setup', 'Lead capture flows', 'Training session', '60-day async support'].map(item => (
                <div key={item} className="price-li"><span>—</span>{item}</div>
              ))}
            </div>
            <a className="btn btn-primary" href={bookLink} {...linkProps} style={{ width: '100%', padding: '13px', display: 'flex', justifyContent: 'center' }}>Book a Demo</a>
          </div>

          {/* Complete */}
          <div className="price-card">
            <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.14em', marginBottom: '12px' }}>FULL BUILD</div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>Complete System</h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px', lineHeight: 1.6 }}>AI + CRM + custom Next.js website. One agency, full stack.</p>
            <div style={{ marginBottom: '28px' }}>
              <span className="mono" style={{ fontSize: '42px', fontWeight: 700, color: '#fff' }}>$6,500+</span>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}> custom scope</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '28px' }}>
              {['Everything in Growth Stack', 'Custom Next.js website', 'CMS integration (Sanity)', '90-day priority support'].map(item => (
                <div key={item} className="price-li"><span>—</span>{item}</div>
              ))}
            </div>
            <a className="btn btn-secondary" href="#contact" style={{ width: '100%', padding: '13px', display: 'flex', justifyContent: 'center' }}>Get a Quote</a>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #pricing { padding: 80px 24px !important; }
        }
      `}</style>
    </section>
  )
}
