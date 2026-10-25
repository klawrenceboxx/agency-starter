import Link from 'next/link'
import { POSTS } from '@/lib/blog-posts'

export const metadata = {
  title: 'Blog',
  description: 'Plain-language guides on website costs, SEO, and turning more visitors into customers, for small business owners in Canada.',
  alternates: { canonical: '/blog' },
}

const fmt = (d: string) =>
  new Date(`${d}T12:00:00`).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })

export default function BlogIndex() {
  const posts = [...POSTS].sort((a, b) => b.updated.localeCompare(a.updated))
  return (
    <>
      <section className="dark page-hero">
        <div className="wrap">
          <h1 className="h1">Guides for small business owners.</h1>
          <p className="lead">Plain answers on what websites and SEO cost, and how to turn more visitors into customers.</p>
        </div>
      </section>
      <section>
        <div className="wrap local-body">
          {posts.map((p) => (
            <div className="local-block" key={p.slug}>
              <h2 className="h3"><Link href={`/blog/${p.slug}`}>{p.h1}</Link></h2>
              <p className="post-meta-light">Updated <time dateTime={p.updated}>{fmt(p.updated)}</time></p>
              <p>{p.metaDescription}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
