import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AuditTrigger from '@/components/audit/AuditTrigger'
import JsonLd from '@/components/JsonLd'
import { SectionBlock } from '@/components/LocalPageView'
import { POSTS, getPost } from '@/lib/local-seo-content'

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug)
  if (!post) return {}
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) notFound()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boxxautomations.space'

  return (
    <>
      <JsonLd
        type="Article"
        data={{
          headline: post.h1,
          description: post.metaDescription,
          datePublished: post.published,
          author: { '@type': 'Person', name: 'Kaleel Lawrence-Boxx' },
          publisher: { '@type': 'Organization', name: 'Boxx Automations', url: siteUrl },
          mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
        }}
      />
      <section className="dark page-hero">
        <div className="wrap">
          <Link className="eyebrow" href="/blog">Blog</Link>
          <h1 className="h1">{post.h1}</h1>
          <p className="lead">{post.lead}</p>
        </div>
      </section>
      <section>
        <div className="wrap local-body">
          {post.sections.map((s) => <SectionBlock key={s.h} s={s} />)}
          <div className="process-foot"><AuditTrigger>Get Your Free Audit</AuditTrigger></div>
        </div>
      </section>
    </>
  )
}
