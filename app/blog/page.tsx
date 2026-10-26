import Link from 'next/link'
import { POSTS } from '@/lib/blog-posts'
import { fmtDate, postKind, readMinutes } from '@/lib/blog-meta'

export const metadata = {
  title: 'Blog',
  description: 'Plain-language guides on website costs, SEO, email and turning more visitors into customers, for small business owners in Canada.',
  alternates: { canonical: '/blog' },
}

export default function BlogIndex() {
  const posts = [...POSTS].sort((a, b) => b.updated.localeCompare(a.updated))
  return (
    <>
      <section className="dark page-hero">
        <div className="wrap">
          <span className="eyebrow">Blog · {posts.length} guides</span>
          <h1 className="h1">Guides for small business owners.</h1>
          <p className="lead">Plain answers on what websites and SEO cost, and how to turn more visitors into customers.</p>
        </div>
      </section>
      <section className="blog-list-section">
        <div className="wrap">
          <ul className="blog-grid">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="blog-card">
                  <span className="blog-card-kind">{postKind(p.slug)}</span>
                  <h2 className="blog-card-title">{p.h1}</h2>
                  <p className="blog-card-desc">{p.metaDescription}</p>
                  <span className="blog-card-meta">
                    {readMinutes(p)} min read · Updated <time dateTime={p.updated}>{fmtDate(p.updated)}</time>
                  </span>
                  <span className="blog-card-cta">Read the guide <span aria-hidden="true">→</span></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
