'use client'

import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react'

/** Keep native details semantics while animating the space it occupies. */
export default function AnimatedDetails({ children, className }: { children: ReactNode; className?: string }) {
  const animation = useRef<Animation | null>(null)
  const expanded = useRef(false)

  useEffect(() => () => animation.current?.cancel(), [])

  function toggle(event: MouseEvent<HTMLDetailsElement>) {
    const element = event.currentTarget
    const summary = (event.target as Element).closest('summary')
    // Nested accordions handle their own clicks.
    if (!summary || summary.parentElement !== element) return
    event.preventDefault()

    const opening = !(animation.current ? expanded.current : element.open)
    expanded.current = opening
    const startHeight = element.getBoundingClientRect().height
    animation.current?.cancel()
    animation.current = null
    element.style.height = ''
    element.style.overflow = ''

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.open = opening
      return
    }

    element.open = true
    const computed = window.getComputedStyle(element)
    const collapsedHeight = summary.getBoundingClientRect().height
      + parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom)
      + parseFloat(computed.borderTopWidth) + parseFloat(computed.borderBottomWidth)
    const endHeight = opening ? element.getBoundingClientRect().height : collapsedHeight
    element.style.height = `${startHeight}px`
    element.style.overflow = 'hidden'
    const current = element.animate(
      [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
      { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' },
    )
    animation.current = current
    current.onfinish = () => {
      element.open = opening
      element.style.height = ''
      element.style.overflow = ''
      current.cancel()
      animation.current = null
    }
  }

  return <details className={className} onClick={toggle}>{children}</details>
}
