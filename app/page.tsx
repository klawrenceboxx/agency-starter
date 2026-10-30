import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { CHAMBER_LISTING_URL, COMPANY_LINKEDIN_URL, GOOGLE_PROFILE_URL, INSTAGRAM_URL, LINKEDIN_URL, PHONE_E164 } from '@/lib/site-config'
import HomeHero from '@/components/home/HomeHero'
import ProjectShowcase from '@/components/home/ProjectShowcase'
import ProblemSection from '@/components/home/ProblemSection'
import ServicesCore from '@/components/ServicesCore'
import FaqGuarantee from '@/components/home/FaqGuarantee'
import ProcessStepsHome from '@/components/home/ProcessStepsHome'
import FinalCta from '@/components/home/FinalCta'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function HomePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boxxautomations.space'
  return (
    <>
      {/* Service-area business: no street address is published, and no ratings or reviews are claimed. */}
      <JsonLd
        type="ProfessionalService"
        data={{
          '@id': `${siteUrl}/#business`,
          name: 'Boxx Automations',
          url: siteUrl,
          telephone: PHONE_E164,
          email: 'hello@boxxautomations.space',
          description:
            'Conversion-focused websites and automated email follow-up for small businesses in Vaughan, Ontario.',
          address: { '@type': 'PostalAddress', addressLocality: 'Vaughan', addressRegion: 'ON', addressCountry: 'CA' },
          areaServed: ['Vaughan', 'Markham', 'Richmond Hill', 'Toronto', 'Greater Toronto Area'],
          founder: { '@type': 'Person', name: 'Kaleel Lawrence-Boxx' },
          knowsAbout: ['Website design', 'Conversion rate optimization', 'Email marketing automation', 'Local SEO'],
          sameAs: [LINKEDIN_URL, COMPANY_LINKEDIN_URL, INSTAGRAM_URL, GOOGLE_PROFILE_URL, CHAMBER_LISTING_URL],
        }}
      />
      <HomeHero />
      <ProjectShowcase />
      <ProblemSection />
      <section className="tinted">
        <div className="wrap">
          <ServicesCore showHeader />
        </div>
      </section>
      <FaqGuarantee />
      <ProcessStepsHome />
      <FinalCta />
    </>
  )
}
