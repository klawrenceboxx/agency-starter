import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AuditTrigger from '@/components/audit/AuditTrigger'
import JsonLd from '@/components/JsonLd'
import { getPage, type Section } from '@/lib/local-seo-content'

export function localMetadata(slug: string): Metadata {
  const page = getPage(slug)
  if (!page) return {}
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/services/${slug}` },
  }
}

export function SectionBlock({ s }: { s: Section }) {
  return (
    <div className="local-block">
      <h2 className="h2">{s.h}</h2>
      {s.p?.map((t) => <p key={t}>{t}</p>)}
      {s.items && (
        <ul>
          {s.items.map((i) => <li key={i}>{i}</li>)}
        </ul>
      )}
    </div>
  )
}

export default function LocalPageView({ slug }: { slug: string }) {
  const page = getPage(slug)
  if (!page) notFound()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boxxautomations.space'
  const related = page.related.map((r) => getPage(r)).filter(Boolean)

  return (
    <>
      <JsonLd
        type="Service"
        data={{
          name: page.h1,
          description: page.metaDescription,
          url: `${siteUrl}/services/${slug}`,
          areaServed: ['Vaughan', 'Markham', 'Richmond Hill', 'Toronto', 'Greater Toronto Area'],
          provider: { '@type': 'Organization', name: 'Boxx Automations', url: siteUrl },
        }}
      />
      <section className="dark page-hero">
        <div className="wrap">
          <span className="eyebrow">{page.eyebrow}</span>
          <h1 className="h1">{page.h1}</h1>
          <p className="lead">{page.lead}</p>
          <div className="local-cta"><AuditTrigger>Get Your Free Audit</AuditTrigger></div>
        </div>
      </section>
      <section>
        <div className="wrap local-body">
          {page.sections.map((s) => <SectionBlock key={s.h} s={s} />)}
          <div className="local-block">
            <h2 className="h2">Common questions</h2>
            <div className="local-faq">
              {page.faq.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
          {related.length > 0 && (
            <p className="local-related">
              Related:{' '}
              {related.map((r, i) => (
                <span key={r!.slug}>
                  {i > 0 && ' · '}
                  <Link href={`/services/${r!.slug}`}>{r!.eyebrow}</Link>
                </span>
              ))}
            </p>
          )}
          <div className="process-foot"><AuditTrigger>Get Your Free Audit</AuditTrigger></div>
        </div>
      </section>
    </>
  )
}
