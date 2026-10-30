'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { captureAttribution } from '@/lib/attribution'
import { track } from '@/lib/analytics'

// Saves the visitor's tracking tags on every page view (see lib/attribution.ts)
// and reports clicks on any Calendly booking link as a GA4 "booking_click" event.
export default function AttributionCapture() {
  const pathname = usePathname()
  useEffect(() => {
    captureAttribution()
  }, [pathname])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.('a[href*="calendly.com"]')
      if (link) track('booking_click', { link_url: (link as HTMLAnchorElement).href })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
