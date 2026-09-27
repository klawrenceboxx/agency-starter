'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuditModal } from './AuditModalContext'

const store = {
  get(k: string) { try { return sessionStorage.getItem(k) } catch { return null } },
  set(k: string, v: string) { try { sessionStorage.setItem(k, v) } catch {} },
}

export default function Nudge() {
  const pathname = usePathname()
  const { open, openModal } = useAuditModal()
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(false)
    if (pathname === '/' ) return
    if (store.get('boxx_nudged') || store.get('boxx_opened')) return
    const t = setTimeout(() => {
      if (store.get('boxx_opened')) return
      setShow(true)
      store.set('boxx_nudged', '1')
    }, 6000)
    return () => clearTimeout(t)
  }, [pathname])

  useEffect(() => {
    if (open) { setShow(false); store.set('boxx_opened', '1') }
  }, [open])

  if (!show) return null

  return (
    <div className="nudge show" role="dialog" aria-label="Free audit offer">
      <p>Want your free audit?</p>
      <div className="row">
        <button className="btn btn-primary btn-sm" onClick={() => { setShow(false); openModal() }}>Yes, show me</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setShow(false)}>Not now</button>
      </div>
    </div>
  )
}
