import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AuditTrigger from '@/components/audit/AuditTrigger'
import JsonLd from '@/components/JsonLd'
import Rich, { plain } from '@/components/Rich'
import { POSTS, getPost, type Block, type Post, type Table } from '@/lib/blog-posts'

// Locked blog template: quick answer → proof line → main table → question H2s → field section
// → FAQ → bridge CTA → read next → author box. Content lives in lib/blog-posts.ts.

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug)
  if (!post) return {}
  return {
    title: { absolute: post.metaTitle },
    description: post.metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.metaTitle,
      description: post.metaDescription,
      publishedTime: post.published,
      modifiedTime: post.updated,
      authors: ['Kaleel Lawrence-Boxx'],
    },
  }
}

const fmt = (d: string) =>
  new Date(`${d}T12:00:00`).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })

function words(post: Post) {
  const blocks = [...post.sections, post.field]
  const text = [
    post.quickAnswer,
    post.proofLine,
    ...blocks.flatMap((b) => [b.h, b.answer ?? '', ...(b.p ?? []), ...(b.items ?? []), ...(b.after ?? [])]),
    ...post.faq.flatMap((f) => [f.q, f.a]),
    post.bridge,
  ].join(' ')
  return plain(text).split(/\s+/).filter(Boolean).length
}

function DataTable({ t }: { t: Table }) {
  return (
    <figure className="post-table">
      <div className="post-table-scroll">
        <table>
          <caption>{t.caption}</caption>
          <thead>
            <tr>{t.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
          </thead>
          <tbody>
            {t.rows.map((r) => (
              <tr key={r.join('|')}>
                {r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {t.note && <figcaption><Rich text={t.note} /></figcaption>}
    </figure>
  )
}

function PostBlock({ b }: { b: Block }) {
  const List = b.ordered ? 'ol' : 'ul'
  return (
    <div className="local-block">
      <h2 className="h2">{b.h}</h2>
      {b.answer && <p className="post-section-answer"><Rich text={b.answer} /></p>}
      {b.p?.map((t) => <p key={t}><Rich text={t} /></p>)}
      {b.items && (
        <List>
          {b.items.map((i) => <li key={i}><Rich text={i} /></li>)}
        </List>
      )}
      {b.table && <DataTable t={b.table} />}
      {b.after?.map((t) => <p key={t}><Rich text={t} /></p>)}
    </div>
  )
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) notFound()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boxxautomations.space'
  const url = `${siteUrl}/blog/${post.slug}`
  const minutes = Math.max(1, Math.round(words(post) / 220))
  const next = getPost(post.next)

  return (
    <>
      <JsonLd
        type="Article"
        data={{
          headline: post.h1,
          description: post.metaDescription,
          datePublished: post.published,
          dateModified: post.updated,
          image: `${siteUrl}/founder.jpg`,
          author: {
            '@type': 'Person',
            name: 'Kaleel Lawrence-Boxx',
            url: `${siteUrl}/about`,
            jobTitle: 'Founder, Boxx Automations',
            alumniOf: 'Toronto Metropolitan University',
          },
          publisher: { '@type': 'Organization', name: 'Boxx Automations', url: siteUrl },
          mainEntityOfPage: url,
        }}
      />
      <JsonLd
        type="FAQPage"
        data={{
          mainEntity: post.faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: plain(f.a) },
          })),
        }}
      />

      <section className="dark page-hero">
        <div className="wrap">
          <Link className="eyebrow" href="/blog">Blog</Link>
          <h1 className="h1">{post.h1}</h1>
          <p className="post-meta">
            By <Link href="/about">Kaleel Lawrence-Boxx</Link> · Updated{' '}
            <time dateTime={post.updated}>{fmt(post.updated)}</time> · {minutes} min read
          </p>
        </div>
      </section>

      <section>
        <article className="wrap local-body">
          <div className="post-answer">
            <span className="post-answer-label">Quick answer</span>
            <p><Rich text={post.quickAnswer} /></p>
          </div>
          <p className="post-proof"><Rich text={post.proofLine} /></p>

          <DataTable t={post.mainTable} />

          {post.sections.map((b) => <PostBlock key={b.h} b={b} />)}

          <PostBlock b={post.field} />

          <div className="local-block">
            <h2 className="h2">Common questions</h2>
            <div className="local-faq">
              {post.faq.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p><Rich text={f.a} /></p>
                </details>
              ))}
            </div>
          </div>

          <div className="post-bridge">
            <p><Rich text={post.bridge} /></p>
            <AuditTrigger>Get Your Free Audit</AuditTrigger>
          </div>

          {next && (
            <p className="post-next">
              Read next: <Link href={`/blog/${next.slug}`}>{next.h1}</Link>
            </p>
          )}

          <aside className="post-author">
            <Image src="/founder.jpg" alt="Kaleel Lawrence-Boxx" width={72} height={72} />
            <div>
              <p className="post-author-name">Kaleel Lawrence-Boxx</p>
              <p>
                Founder of Boxx Automations in Vaughan, Ontario. Mechanical engineering graduate from Toronto Metropolitan
                University with about seven years of coding. Builds conversion-focused websites and automated email follow-up
                for small businesses. <Link href="/about">More about Kaleel</Link>
              </p>
            </div>
          </aside>
        </article>
      </section>
    </>
  )
}
