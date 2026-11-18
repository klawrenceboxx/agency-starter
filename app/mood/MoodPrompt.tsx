'use client'
import { useState } from 'react'
import styles from './mood.module.css'

export default function MoodPrompt({ text }: { text: string }) {
  const [status, setStatus] = useState('')
  async function copy() {
    let timer: ReturnType<typeof setTimeout> | undefined
    try {
      await Promise.race([
        navigator.clipboard.writeText(text),
        new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Clipboard permission pending')), 1500) }),
      ])
      setStatus('Copied to clipboard.')
      window.gtag?.('event', 'mood_prompt_copy', { resource: 'mood' })
    } catch { setStatus('Clipboard access is unavailable. Expand the prompt to select it, or download the AI prompt above.') }
    finally { if (timer) clearTimeout(timer) }
  }
  return <div className={styles.promptBox}>
    <div className={styles.promptHeader}><strong>Your starter prompt</strong><button type="button" onClick={copy}>Copy prompt</button></div>
    <p role="status">{status}</p>
    <details><summary>Read the full prompt</summary><pre>{text}</pre></details>
  </div>
}
