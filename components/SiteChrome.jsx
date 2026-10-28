'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import { AuditModalProvider } from './audit/AuditModalContext'
import AuditModal from './audit/AuditModal'
import StickyMobileCta from './audit/StickyMobileCta'
import Nudge from './audit/Nudge'
import AttributionCapture from './AttributionCapture'

export default function SiteChrome({ children, webhookUrl }) {
  const networking = usePathname() === "/audit"
  return (
    <AuditModalProvider>
      <AttributionCapture />
      {!networking && <Header />}
      <main>{networking ? <div className="networking-audit">
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
