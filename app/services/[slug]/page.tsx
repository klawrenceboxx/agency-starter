import { client } from '@/sanity/client'
import { PortableText } from '@portabletext/react'
import JsonLd from '@/components/JsonLd'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Service = {
  title: string
  slug: string
  description: string
  icon: string
  seoTitle?: string
  seoDescription?: string
  body?: unknown[]
}

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(`*[_type == "service"]{ "slug": slug.current }`)
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service: Pick<Service, 'title' | 'description' | 'seoTitle' | 'seoDescription'> | null =
    await client.fetch(
      `*[_type == "service" && slug.current == $slug][0]{ title, description, seoTitle, seoDescription }`,
      { slug: params.slug }
    )
  if (!service) return {}
  return {
    title: service.seoTitle || service.title,
    description: service.seoDescription || service.description?.slice(0, 155),
  }
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const [service, settings] = await Promise.all([
    client.fetch(
      `*[_type == "service" && slug.current == $slug][0]{ title, "slug": slug.current, description, icon, body }`,
      { slug: params.slug }
    ) as Promise<Service | null>,
    client.fetch(`*[_type == "siteSettings"][0]{ companyName, siteUrl, calendlyUrl }`) as Promise<{ companyName?: string; siteUrl?: string; calendlyUrl?: string }>,
  ])

  if (!service) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <JsonLd
        type="Service"
        data={{
          name: service.title,
          description: service.description,
          provider: {
            '@type': 'Organization',
            name: settings?.companyName,
            url: settings?.siteUrl,
          },
        }}
      />

      <Link href="/services" className="text-primary text-sm font-semibold hover:underline">
        &larr; All Services
      </Link>

      <div className="mt-6 mb-2 text-5xl">{service.icon}</div>
      <h1 className="text-4xl font-bold text-white mb-4">{service.title}</h1>
      <p className="text-lg text-muted mb-8">{service.description}</p>

      {service.body && (
        <div className="prose prose-invert prose-lg max-w-none">
          <PortableText value={service.body as Parameters<typeof PortableText>[0]['value']} />
        </div>
      )}

      <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <h2 className="text-2xl font-bold text-white mb-3">Ready to get started?</h2>
        <p className="text-muted mb-6">
          Let us scope out a {service.title.toLowerCase()} solution for your business.
        </p>
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
