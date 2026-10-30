import type { Post } from './blog-posts'

// Label shown on blog cards. Keep it short: it is a scan aid, not a category system.
const KIND: Record<string, string> = {
  'how-much-does-a-website-cost-in-canada': 'Pricing',
  'how-much-does-seo-cost-in-canada': 'Pricing',
  'how-to-choose-a-web-designer': 'Hiring',
  'website-conversion-checklist-small-business': 'Checklist',
  'email-marketing-for-small-business': 'Email',
  'abandoned-cart-emails': 'Email',
  'wix-vs-squarespace-vs-shopify-vs-wordpress': 'Comparison',
  'how-to-get-google-reviews': 'Reviews',
  'klaviyo-pricing': 'Pricing',
  'klaviyo-vs-mailchimp': 'Comparison',
  'klaviyo-vs-omnisend': 'Comparison',
}

export const postKind = (slug: string) => KIND[slug] ?? 'Guide'

const strip = (t: string) =>
  t.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1')

export function readMinutes(post: Post) {
  const blocks = [...post.sections, post.field]
  const text = [
    post.quickAnswer,
    post.proofLine,
    ...blocks.flatMap((b) => [b.h, b.answer ?? '', ...(b.p ?? []), ...(b.items ?? []), ...(b.after ?? [])]),
    ...post.faq.flatMap((f) => [f.q, f.a]),
    post.bridge,
  ].join(' ')
  return Math.max(1, Math.round(strip(text).split(/\s+/).filter(Boolean).length / 220))
}

export const fmtDate = (d: string) =>
  new Date(`${d}T12:00:00`).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
