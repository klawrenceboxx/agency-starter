import { client } from '@/sanity/client'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type CaseStudy = {
  title: string
  slug: string
  client: string
  industry: string
  challenge?: string
  solution?: string
  results: { metric: string; value: string }[]
  tags: string[]
  seoTitle?: string
  seoDescription?: string
  body?: unknown[]
}

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(`*[_type == "caseStudy"]{ "slug": slug.current }`)
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cs: Pick<CaseStudy, 'title' | 'challenge' | 'seoTitle' | 'seoDescription'> | null =
    await client.fetch(
      `*[_type == "caseStudy" && slug.current == $slug][0]{ title, challenge, seoTitle, seoDescription }`,
      { slug: params.slug }
    )
  if (!cs) return {}
  return {
    title: cs.seoTitle || cs.title,
    description: cs.seoDescription || cs.challenge?.slice(0, 155),
  }
}

export default async function CaseStudyDetailPage({ params }: { params: { slug: string } }) {
  const [cs, settings] = await Promise.all([
    client.fetch(
      `*[_type == "caseStudy" && slug.current == $slug][0]{
        title, "slug": slug.current, client, industry,
        challenge, solution, results, tags, body
      }`,
      { slug: params.slug }
    ) as Promise<CaseStudy | null>,
    client.fetch(`*[_type == "siteSettings"][0]{ calendlyUrl }`) as Promise<{ calendlyUrl?: string }>,
  ])

  if (!cs) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/case-studies" className="text-primary text-sm font-semibold hover:underline">
        &larr; All Case Studies
      </Link>

      <div className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
        {cs.industry}
      </div>
      <h1 className="text-4xl font-bold text-white mb-6 leading-snug">{cs.title}</h1>

      {/* Results bar */}
      {cs.results && cs.results.length > 0 && (
        <div
          className="rounded-xl p-6 mb-10 border grid gap-4 sm:grid-cols-3"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          {cs.results.map((r, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
                {r.value}
              </div>
              <div className="text-muted text-sm">{r.metric}</div>
            </div>
          ))}
        </div>
      )}

      {/* Challenge & Solution */}
      {cs.challenge && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-2">The Challenge</h2>
          <p className="text-white leading-relaxed">{cs.challenge}</p>
        </div>
      )}

      {cs.solution && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-2">The Solution</h2>
          <p className="text-white leading-relaxed">{cs.solution}</p>
        </div>
      )}

      {cs.body && (
        <div className="prose prose-invert prose-lg max-w-none mb-10">
          <PortableText value={cs.body as Parameters<typeof PortableText>[0]['value']} />
        </div>
      )}

      {cs.tags && cs.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {cs.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1 rounded-full border"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <h2 className="text-2xl font-bold text-white mb-3">Want results like this?</h2>
        <p className="text-muted mb-6">Let us talk about what we can build for you.</p>
        <a
          href={settings?.calendlyUrl || '/contact'}
          target={settings?.calendlyUrl ? '_blank' : undefined}
          rel={settings?.calendlyUrl ? 'noopener noreferrer' : undefined}
          className="inline-block font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          style={{ background: 'var(--color-primary)', color: 'var(--color-bg)' }}
        >
          Book a Free Call
        </a>
      </div>
    </div>
  )
}
