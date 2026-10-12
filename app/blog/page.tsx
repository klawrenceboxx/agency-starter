import Link from 'next/link'
import { POSTS } from '@/lib/local-seo-content'

export const metadata = {
  title: 'Blog',
  description: 'Plain-language guides on websites, search, and email follow-up for small businesses.',
  alternates: { canonical: '/blog' },
}

export default function BlogIndex() {
  return (
    <>
      <section className="dark page-hero">
        <div className="wrap">
          <h1 className="h1">Guides for small business owners.</h1>
          <p className="lead">Plain-language notes on websites, search, and follow-up.</p>
        </div>
      </section>
      <section>
        <div className="wrap local-body">
          {POSTS.map((p) => (
            <div className="local-block" key={p.slug}>
              <h2 className="h3"><Link href={`/blog/${p.slug}`}>{p.h1}</Link></h2>
              <p>{p.metaDescription}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
