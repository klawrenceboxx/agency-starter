'use client'

import { useAuditModal } from './AuditModalContext'

type Props = {
  className?: string
  children: React.ReactNode
  id?: string
}

export default function AuditTrigger({ className = 'btn btn-primary', children, id }: Props) {
  const { openModal } = useAuditModal()
  return (
    <button type="button" id={id} className={className} onClick={openModal}>
      {children}
    </button>
  )
}
