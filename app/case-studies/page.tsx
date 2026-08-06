import { client } from '@/sanity/client'
import Link from 'next/link'

type CaseStudy = {
  title: string
  slug: string
  client: string
  industry: string
  results: { metric: string; value: string }[]
  tags: string[]
  publishedAt?: string
}

export const metadata = { title: 'Case Studies' }

export default async function CaseStudiesPage() {
  const caseStudies: CaseStudy[] = await client.fetch(`
    *[_type == "caseStudy"] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      client,
      industry,
      results,
      tags,
      publishedAt
    }
  `)

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-4">Results</h1>
      <p className="text-muted text-lg mb-12">
        Real outcomes from real builds. Here is what we have delivered for clients.
      </p>

      {caseStudies?.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {caseStudies.map((cs) => (
            <Link
              key={cs.slug}
              href={`/case-studies/${cs.slug}`}
              className="group rounded-xl p-6 border transition-all hover:border-primary flex flex-col"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                {cs.industry}
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-primary mb-4 transition-colors leading-snug">
                {cs.title}
              </h2>

              {cs.results && cs.results.length > 0 && (
                <div className="space-y-2 mb-5 flex-1">
                  {cs.results.slice(0, 3).map((r, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="font-bold text-lg" style={{ color: 'var(--color-primary)' }}>
                        {r.value}
                      </span>
                      <span className="text-muted text-sm">{r.metric}</span>
                    </div>
                  ))}
                </div>
              )}

              {cs.tags && cs.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cs.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded-full border"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted">Case studies coming soon.</p>
      )}
    </div>
  )
}
