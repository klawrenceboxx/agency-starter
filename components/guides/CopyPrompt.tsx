'use client'

import { useState } from 'react'
import styles from '@/app/guides/guides.module.css'

// Shows a prompt with its [BRACKETS] highlighted. Copies the raw text, brackets intact.
export default function CopyPrompt({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  // Long prompts start collapsed (like Angus's "Expand full prompt"). Copy always grabs the full text.
  const long = text.split('\n').length > 9 || text.length > 520
  const [open, setOpen] = useState(!long)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    window.gtag?.('event', 'guide_prompt_copy', { prompt: label })
  }

  const parts = text.split(/(\[[^\]]+\])/g)

  return (
    <div className={styles.promptBox}>
      <div className={styles.promptBar}>
        <span>{label}</span>
        <button type="button" className={styles.copyBtn} onClick={copy} aria-live="polite">
          {copied ? 'Copied ✓' : 'Copy prompt'}
        </button>
      </div>
      <div className={`${styles.promptWrap} ${open ? '' : styles.promptCollapsed}`}>
        <pre className={styles.prompt}>
          {parts.map((p, i) =>
            /^\[[^\]]+\]$/.test(p) ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>
          )}
        </pre>
      </div>
      {long && (
        <button type="button" className={styles.expandBtn} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? 'Collapse prompt' : 'Expand full prompt'}
        </button>
      )}
    </div>
  )
}
