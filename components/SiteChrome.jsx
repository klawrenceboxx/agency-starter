'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Header from './Header'
import Footer from './Footer'
import { AuditModalProvider } from './audit/AuditModalContext'
import AuditModal from './audit/AuditModal'
import StickyMobileCta from './audit/StickyMobileCta'
import Nudge from './audit/Nudge'

export default function SiteChrome({ children, webhookUrl }) {
  const networking = usePathname() === "/audit"
  return (
    <AuditModalProvider>
      {!networking && <Header />}
      <main>{networking ? <div className="networking-audit">
        <Link className="logo" href="/" aria-label="Boxx Automations home"><span className="mark" aria-hidden="true"><i /><i /><i /><i /></span><b>BOXX AUTOMATIONS</b></Link>
        {children}
        <AuditModal webhookUrl={webhookUrl} inline />
      </div> : children}</main>
      {!networking && <>
        <Footer />
        <StickyMobileCta />
        <Nudge />
        <AuditModal webhookUrl={webhookUrl} />
      </>}
    </AuditModalProvider>
  )
}
