'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { captureAttribution } from '@/lib/attribution'

// Saves the visitor's tracking tags on every page view (see lib/attribution.ts).
export default function AttributionCapture() {
  const pathname = usePathname()
  useEffect(() => {
    captureAttribution()
  }, [pathname])
  return null
}
