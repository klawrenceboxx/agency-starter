import Link from 'next/link'
import { CHAMBER_LISTING_URL, COMPANY_LINKEDIN_URL, GOOGLE_PROFILE_URL, INSTAGRAM_URL, NAV_LINKS } from '@/lib/site-config'
import { FOOTER_BLOG_LINKS, FOOTER_SERVICE_LINKS } from '@/lib/internal-links'

const COMPANY_LINKS = [
  { href: '/', label: 'Home' },
  ...NAV_LINKS,
  { href: '/guides', label: 'Free Guides' },
  { href: '/blog', label: 'Blog' },
  { href: '/partners', label: 'Partners' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site">
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <span className="foot-name">Boxx Automations</span>
          <p>Conversion-focused websites and automated email follow-up for small businesses.</p>
          <p className="foot-place">Vaughan, Ontario</p>
          <div className="foot-social">
            <a href={COMPANY_LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="Boxx Automations on LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Boxx Automations on Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
          </div>
        </div>
        <nav aria-label="Company">
          <span className="foot-h">Company</span>
          {COMPANY_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <nav aria-label="Services">
          <span className="foot-h">Services</span>
          {FOOTER_SERVICE_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <nav aria-label="Blog posts">
          <span className="foot-h">From the blog</span>
          {FOOTER_BLOG_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
      </div>
      <div className="wrap foot-bar">
        <span>&copy; {year} Boxx Automations</span>
        <nav aria-label="Legal">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </nav>
        <nav aria-label="Profiles" className="foot-badges">
          <a href={CHAMBER_LISTING_URL} target="_blank" rel="noopener noreferrer">Vaughan Chamber of Commerce member</a>
          <a href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer">Google Business Profile</a>
        </nav>
      </div>
    </footer>
  )
}
