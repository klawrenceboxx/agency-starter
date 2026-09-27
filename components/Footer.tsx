import Link from 'next/link'
import { NAV_LINKS } from '@/lib/site-config'

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
        </nav>
      </div>
    </footer>
  )
}
