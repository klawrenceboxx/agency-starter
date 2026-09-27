'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import AuditTrigger from './audit/AuditTrigger'
import { NAV_LINKS } from '@/lib/site-config'

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // The about page hero has a light background; every other page-hero is dark,
  // so only /about needs the glass pill before the visitor scrolls.
  const lightTop = pathname === '/about'

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 24) }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  const glass = scrolled || lightTop || open

  return (
    <header className={`site${glass ? ' glass' : ''}`}>
      <div className="nav-shell">
        <Link className="logo" href="/" aria-label="Boxx Automations home">
          <span className="mark" aria-hidden="true"><i /><i /><i /><i /></span>
          <b>BOXX AUTOMATIONS</b>
        </Link>
        <nav className={`main${open ? ' open' : ''}`} aria-label="Main">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>{label}</Link>
          ))}
        </nav>
        <AuditTrigger className="btn btn-primary btn-sm">Get Your Free Audit</AuditTrigger>
        <button
          className="menu-btn"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="nav"
          onClick={() => setOpen(o => !o)}
        >
          &#9776;
        </button>
      </div>
    </header>
  )
}
