'use client'

import Header from './Header'
import Footer from './Footer'
import { AuditModalProvider } from './audit/AuditModalContext'
import AuditModal from './audit/AuditModal'
import StickyMobileCta from './audit/StickyMobileCta'
import Nudge from './audit/Nudge'

export default function SiteChrome({ children, webhookUrl }: { children: React.ReactNode; webhookUrl: string }) {
  return (
    <AuditModalProvider>
      <Header />
      <main>{children}</main>
      <Footer />
      <StickyMobileCta />
      <Nudge />
      <AuditModal webhookUrl={webhookUrl} />
    </AuditModalProvider>
  )
}
