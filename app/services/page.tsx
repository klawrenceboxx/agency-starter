import { client } from '@/sanity/client'
import Link from 'next/link'

type Service = { title: string; slug: string; description: string; icon: string; featured: boolean }

export const metadata = { title: 'Services' }

export default async function ServicesPage() {
  const services: Service[] = await client.fetch(`
    *[_type == "service"] | order(featured desc, title asc) {
      title,
      "slug": slug.current,
      description,
      icon,
      featured
    }
  `)

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-4">Our Services</h1>
      <p className="text-muted text-lg mb-12">
        AI systems, automation workflows, and fast web builds for businesses ready to grow.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        {services?.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="group rounded-xl p-6 border transition-all hover:border-primary flex gap-5"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="text-3xl flex-shrink-0">{service.icon}</div>
            <div>
              <h2 className="text-lg font-bold text-white group-hover:text-primary mb-2 transition-colors">
                {service.title}
              </h2>
              <p className="text-muted text-sm leading-relaxed">{service.description}</p>
              <span className="inline-block mt-3 text-primary font-semibold text-sm">Learn more &rarr;</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 rounded-2xl p-8 text-center border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <h2 className="text-2xl font-bold text-white mb-2">Not sure what you need?</h2>
        <p className="text-muted mb-6">Book a free call and we will figure it out together.</p>
        <Link
          href="/contact"
          className="inline-block font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          style={{ background: 'var(--color-primary)', color: 'var(--color-bg)' }}
        >
          Book a Free Call
        </Link>
      </div>
    </div>
  )
}
