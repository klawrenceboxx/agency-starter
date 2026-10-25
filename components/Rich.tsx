import Link from 'next/link'
import type { ReactNode } from 'react'

// Renders a plain string with two inline marks: **bold** and [label](href).
// Internal links (starting with "/") use next/link; external ones open in a new tab.
const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g

export default function Rich({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter(Boolean)
  return (
    <>
      {parts.map((part, i): ReactNode => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
        if (link) {
          const [, label, href] = link
          return href.startsWith('/') ? (
            <Link key={i} href={href}>{label}</Link>
          ) : (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
          )
        }
        return part
      })}
    </>
  )
}

// Strips the inline marks, for word counts, schema and meta text.
export const plain = (text: string) =>
  text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1')
