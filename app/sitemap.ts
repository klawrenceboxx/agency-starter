import { client } from '@/sanity/client'
import type { MetadataRoute } from 'next'
import { LOCAL_PAGES, POSTS } from '@/lib/local-seo-content'
import { GUIDES } from '@/lib/guides'

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
    { url: `${siteUrl}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/partners`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/tools/missed-lead-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
    { url: `${siteUrl}/privacy`, lastModified: new Date('2026-10-15'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: new Date('2026-10-15'), changeFrequency: 'yearly', priority: 0.3 },
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

  const localPages: MetadataRoute.Sitemap = LOCAL_PAGES.map((p) => ({
    url: `${siteUrl}/services/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const blogPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    ...POSTS.map((p) => ({
      url: `${siteUrl}/blog/${p.slug}`,
      lastModified: new Date(p.updated),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]

  const guidePages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ...GUIDES.map((g) => ({
      url: `${siteUrl}/guides/${g.slug}`,
      lastModified: g.published ? new Date(g.published) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  return [...staticPages, ...guidePages, ...servicePages, ...localPages, ...blogPages, ...caseStudyPages]
}
