import { client } from '@/sanity/client'
import Hero from '@/components/Hero'
import TrustSignals from '@/components/TrustSignals'
import ServicesGrid from '@/components/ServicesGrid'
import Philosophy from '@/components/Philosophy'
import ProcessSteps from '@/components/ProcessSteps'
import Pricing from '@/components/Pricing'
import LeadForm from '@/components/LeadForm'

type ProcessStep = { stepNumber: number; title: string; description: string; icon: string }
type Stat = { value: string; label: string }

type HomeData = {
  processSteps?: ProcessStep[]
  stats?: Stat[]
}

type SiteSettings = {
  heroSubheadline?: string
  tagline?: string
  companyName?: string
  calendlyUrl?: string
  n8nLeadWebhookUrl?: string
}

export default async function HomePage() {
  const [home, settings]: [HomeData, SiteSettings] = await Promise.all([
    client.fetch(`*[_type == "homePage"][0]{
      "processSteps": processSteps[]->{
        stepNumber, title, description, icon
      } | order(stepNumber asc),
      stats
    }`),
    client.fetch(`*[_type == "siteSettings"][0]{
      heroSubheadline, tagline, companyName, calendlyUrl, n8nLeadWebhookUrl
    }`),
  ])

  return (
    <>
      <Hero
        subheadline={settings?.heroSubheadline || 'We build AI workflows that capture leads, qualify prospects, and fill your pipeline — while you sleep.'}
        tagline={settings?.tagline || 'AI Automation Agency'}
        calendlyUrl={settings?.calendlyUrl || '/contact'}
      />

      {home?.stats && home.stats.length > 0 && (
        <TrustSignals stats={home.stats} />
      )}

      <ServicesGrid />

      <Philosophy />

      {home?.processSteps && home.processSteps.length > 0 && (
        <ProcessSteps steps={home.processSteps} />
      )}

      {/* <Pricing calendlyUrl={settings?.calendlyUrl || '/contact'} /> */}

      <LeadForm webhookUrl={settings?.n8nLeadWebhookUrl || ''} />
    </>
  )
}
