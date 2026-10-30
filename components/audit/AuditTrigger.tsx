'use client'

import { useAuditModal } from './AuditModalContext'

type Props = {
  className?: string
  children: React.ReactNode
  id?: string
}

// Renders a real link to /audit so crawlers and no-JS visitors can follow it.
// A plain click opens the audit modal instead of navigating (the modal is the primary conversion path).
export default function AuditTrigger({ className = 'btn btn-primary', children, id }: Props) {
  const { openModal } = useAuditModal()
  return (
    <a
      href="/audit"
      id={id}
      className={className}
      onClick={(e) => {
        // let new-tab / new-window clicks go to the /audit page
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        openModal()
      }}
    >
      {children}
    </a>
  )
}
