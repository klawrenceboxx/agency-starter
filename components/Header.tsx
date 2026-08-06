'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

type Props = {
  settings?: {
    companyName?: string
    calendlyUrl?: string
  }
}

const NAV_LINKS = [
  { href: '/#features', label: 'Services' },
  { href: '/#protocol', label: 'Process' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#contact', label: 'Contact' },
]

export default function Header({ settings }: Props) {
  const [scrollState, setScrollState] = useState<'none' | 'light' | 'full'>('none')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      if (y > 80) setScrollState('full')
      else if (y > 20) setScrollState('light')
      else setScrollState('none')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const companyName = settings?.companyName?.toUpperCase() || 'AGENCY'

  return (
    <>
      {/* Floating pill navbar */}
      <nav
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          padding: '12px 24px',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          gap: '36px',
          width: 'max-content',
          maxWidth: 'calc(100vw - 40px)',
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border 0.4s ease, box-shadow 0.4s ease',
          background: scrollState === 'full' ? 'rgba(10,15,30,0.8)' : scrollState === 'light' ? 'rgba(10,15,30,0.35)' : 'transparent',
          backdropFilter: scrollState !== 'none' ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrollState !== 'none' ? 'blur(24px)' : 'none',
          border: scrollState === 'full'
            ? '1px solid rgba(168,85,247,0.25)'
            : scrollState === 'light'
            ? '1px solid rgba(255,255,255,0.12)'
            : '1px solid transparent',
          boxShadow: scrollState === 'full'
            ? '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(168,85,247,0.08)'
            : scrollState === 'light'
            ? '0 4px 24px rgba(0,0,0,0.3), 0 0 16px rgba(255,255,255,0.04)'
            : 'none',
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}
        >
          <div className="logo-mark">
            <svg viewBox="0 0 14 14" fill="white" width="13" height="13">
              <rect x="1" y="1" width="5" height="5" rx="1"/>
              <rect x="8" y="1" width="5" height="5" rx="1"/>
              <rect x="1" y="8" width="5" height="5" rx="1"/>
              <rect x="8" y="8" width="5" height="5" rx="1"/>
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: '15px', letterSpacing: '-0.03em', color: 'var(--body)' }}>
            {companyName}
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-links-wrap" style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              style={{ color: 'rgba(241,245,249,0.6)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s ease' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(241,245,249,0.6)')}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href={settings?.calendlyUrl || '/contact'}
          target={settings?.calendlyUrl ? '_blank' : undefined}
          rel={settings?.calendlyUrl ? 'noopener noreferrer' : undefined}
          className="btn btn-primary nav-links-wrap"
          style={{ padding: '10px 20px', fontSize: '13px', borderRadius: '8px' }}
        >
          Book a Demo
        </a>

        {/* Mobile hamburger */}
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'none' }}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          className="mobile-menu-btn"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {open ? (
              <>
                <line x1="4" y1="4" x2="16" y2="16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="16" y1="4" x2="4" y2="16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="17" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="3" y1="10" x2="17" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="3" y1="14" x2="17" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 999,
            width: 'calc(100vw - 40px)',
            maxWidth: '400px',
            background: 'rgba(10,15,30,0.97)',
            border: '1px solid rgba(168,85,247,0.14)',
            borderRadius: '20px',
            padding: '12px',
            backdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{ padding: '12px 16px', borderRadius: '12px', color: 'rgba(241,245,249,0.7)', fontSize: '15px', fontWeight: 500, textDecoration: 'none', transition: 'background 0.15s ease, color 0.15s ease', display: 'block' }}
            >
              {label}
            </a>
          ))}
          <a
            href={settings?.calendlyUrl || '/contact'}
            target={settings?.calendlyUrl ? '_blank' : undefined}
            rel={settings?.calendlyUrl ? 'noopener noreferrer' : undefined}
            onClick={() => setOpen(false)}
            className="btn btn-primary"
            style={{ marginTop: '8px', borderRadius: '12px', justifyContent: 'center', padding: '13px 20px' }}
          >
            Book a Demo
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links-wrap { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
