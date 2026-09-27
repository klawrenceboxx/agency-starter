'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

type Ctx = { open: boolean; openModal: () => void; closeModal: () => void }

const AuditModalCtx = createContext<Ctx | null>(null)

export function AuditModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  const openModal = useCallback(() => {
    setOpen(true)
    document.body.classList.add('modal-open')
    document.body.style.overflow = 'hidden'
  }, [])

  const closeModal = useCallback(() => {
    setOpen(false)
    document.body.classList.remove('modal-open')
    document.body.style.overflow = ''
  }, [])

  const value = useMemo(() => ({ open, openModal, closeModal }), [open, openModal, closeModal])

  return <AuditModalCtx.Provider value={value}>{children}</AuditModalCtx.Provider>
}

export function useAuditModal() {
  const ctx = useContext(AuditModalCtx)
  if (!ctx) throw new Error('useAuditModal must be used within AuditModalProvider')
  return ctx
}
