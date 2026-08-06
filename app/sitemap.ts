import { client } from '@/sanity/client'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  const [serviceslugs, caseStudySlugs]: [{ slug: string }[], { slug: string }[]] = await Promise.all([
    client.fetch(`*[_type == "service"]{ "slug": slug.current }`),
    client.fetch(`*[_type == "caseStudy"]{ "slug": slug.current }`),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/case-studies`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
  ]

  const servicePages: MetadataRoute.Sitemap = serviceslugs.map((s) => ({
    url: `${siteUrl}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const caseStudyPages: MetadataRoute.Sitemap = caseStudySlugs.map((s) => ({
    url: `${siteUrl}/case-studies/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...servicePages, ...caseStudyPages]
}
