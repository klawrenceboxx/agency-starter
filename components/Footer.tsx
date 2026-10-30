import Link from 'next/link'
import { CHAMBER_LISTING_URL, GOOGLE_PROFILE_URL, NAV_LINKS } from '@/lib/site-config'
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
