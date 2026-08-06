'use client'

type Props = {
  settings?: {
    companyName?: string
    email?: string
    linkedinUrl?: string
    twitterUrl?: string
    googleBusinessUrl?: string
    calendlyUrl?: string
  }
}

export default function Footer({ settings }: Props) {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: '#060b1a', borderRadius: '4rem 4rem 0 0', padding: '80px 64px 48px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '60px', marginBottom: '60px' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '12px' }}>
              <div className="logo-mark">
                <svg viewBox="0 0 14 14" fill="white" width="13" height="13">
                  <rect x="1" y="1" width="5" height="5" rx="1"/>
                  <rect x="8" y="1" width="5" height="5" rx="1"/>
                  <rect x="1" y="8" width="5" height="5" rx="1"/>
                  <rect x="8" y="8" width="5" height="5" rx="1"/>
                </svg>
              </div>
              <span style={{ fontWeight: 800, fontSize: '15px', letterSpacing: '-0.03em', color: '#fff' }}>
                {settings?.companyName?.toUpperCase() || 'BOXX AUTOMATIONS'}
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '260px' }}>
              AI systems and automations that close leads while you sleep.
            </p>
            {(settings?.linkedinUrl || settings?.twitterUrl) && (
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                {settings?.linkedinUrl && (
                  <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '13px', color: 'var(--muted)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
                    LinkedIn
                  </a>
                )}
                {settings?.twitterUrl && (
                  <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '13px', color: 'var(--muted)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
                    Twitter
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Navigate */}
          <div>
            <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px' }}>Navigate</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { href: '/#features', label: 'Services' },
                { href: '/#protocol', label: 'Process' },
                { href: '/#pricing',  label: 'Pricing' },
                { href: '/#contact',  label: 'Contact' },
              ].map(({ href, label }) => (
                <a key={href} href={href}
                  style={{ fontSize: '14px', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px' }}>Legal</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms',   label: 'Terms of Service' },
              ].map(({ href, label }) => (
                <a key={href} href={href}
                  style={{ fontSize: '14px', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
            © {year} {settings?.companyName || 'Boxx Automations'}. All rights reserved.
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="status-dot" />
            <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>SYSTEM OPERATIONAL</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          footer { padding: 60px 24px 40px !important; border-radius: 2rem 2rem 0 0 !important; }
        }
      `}</style>
    </footer>
  )
}
