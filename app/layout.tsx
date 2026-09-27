import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { client } from '@/sanity/client'
import JsonLd from '@/components/JsonLd'
import SiteChrome from '@/components/SiteChrome'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
})

type SiteSettings = {
  companyName?: string
  email?: string
  linkedinUrl?: string
  siteUrl?: string
  metaTitle?: string
  metaDescription?: string
  n8nLeadWebhookUrl?: string
}

async function getSettings(): Promise<SiteSettings> {
  try {
    return await client.fetch(`*[_type == "siteSettings"][0]`)
  } catch {
    return {}
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: {
      default: settings?.metaTitle || 'Boxx Automations — Websites and automated emails that convert',
      template: `%s | Boxx Automations`,
    },
    description:
      settings?.metaDescription ||
      'Boxx Automations fixes the leaks between getting a lead and turning them into a customer, with conversion-focused websites and automated follow-up. Get a free audit.',
    openGraph: {
      type: 'website',
      siteName: settings?.companyName || 'Boxx Automations',
      url: settings?.siteUrl,
    },
    robots: { index: true, follow: true },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <JsonLd
          type="Organization"
          data={{
            name: settings?.companyName || 'Boxx Automations',
            url: settings?.siteUrl,
            email: settings?.email,
            sameAs: [settings?.linkedinUrl].filter(Boolean),
          }}
        />
        <SiteChrome webhookUrl={settings?.n8nLeadWebhookUrl || ''}>{children}</SiteChrome>
      </body>
    </html>
  )
}
