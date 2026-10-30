import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { client } from '@/sanity/client'
import JsonLd from '@/components/JsonLd'
import SiteChrome from '@/components/SiteChrome'
import { CHAMBER_LISTING_URL, COMPANY_LINKEDIN_URL, GOOGLE_PROFILE_URL, INSTAGRAM_URL, PHONE_E164 } from '@/lib/site-config'
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
    return await client.fetch(`*[_type == "siteSettings"][0]`, {}, { next: { revalidate: 60 } })
  } catch {
    return {}
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const siteUrl = (settings?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://boxxautomations.space').replace(/\/$/, '')
  return {
    metadataBase: new URL(siteUrl),
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
    // Preview deployments must never be indexed; only the production deployment is.
    robots: process.env.VERCEL_ENV === 'preview' ? { index: false, follow: false } : { index: true, follow: true },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-HSTF5T4CRQ" strategy="afterInteractive" />
        <Script id="google-tag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-HSTF5T4CRQ');`}
        </Script>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "z2azkbxwrn");`}
        </Script>
        <JsonLd
          type="Organization"
          data={{
            name: settings?.companyName || 'Boxx Automations',
            url: settings?.siteUrl,
            email: settings?.email,
            telephone: PHONE_E164,
            sameAs: [settings?.linkedinUrl, COMPANY_LINKEDIN_URL, INSTAGRAM_URL, GOOGLE_PROFILE_URL, CHAMBER_LISTING_URL].filter(Boolean),
          }}
        />
        <SiteChrome webhookUrl={settings?.n8nLeadWebhookUrl || ''}>{children}</SiteChrome>
      </body>
    </html>
  )
}
