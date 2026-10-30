import Link from 'next/link'
import { CHAMBER_LISTING_URL, GOOGLE_PROFILE_URL, NAV_LINKS } from '@/lib/site-config'
import { FOOTER_BLOG_LINKS, FOOTER_SERVICE_LINKS } from '@/lib/internal-links'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site">
      <div className="wrap">
        <span>&copy; {year} Boxx Automations. Vaughan, Ontario.</span>
        <nav aria-label="Footer">
          <Link href="/">Home</Link>
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
          <Link href="/guides">Free Guides</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <a href={CHAMBER_LISTING_URL} target="_blank" rel="noopener noreferrer">Vaughan Chamber of Commerce member</a>
          <a href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer">Google Business Profile</a>
        </nav>
      </div>
      <div className="wrap footer-more">
        <nav aria-label="Local services">
          <span className="footer-more-h">Services</span>
          {FOOTER_SERVICE_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <nav aria-label="Blog posts">
          <span className="footer-more-h">From the blog</span>
          {FOOTER_BLOG_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
