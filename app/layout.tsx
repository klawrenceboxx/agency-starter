import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { client } from '@/sanity/client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600'],
})

type SiteSettings = {
  companyName?: string
  email?: string
  tagline?: string
  brandPrimaryColor?: string
  brandBgColor?: string
  brandSurfaceColor?: string
  calendlyUrl?: string
  linkedinUrl?: string
  twitterUrl?: string
  siteUrl?: string
  googleBusinessUrl?: string
  metaTitle?: string
  metaDescription?: string
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
      default: settings?.metaTitle || settings?.companyName || 'AI Automation Agency',
      template: `%s | ${settings?.companyName || 'Agency'}`,
    },
    description: settings?.metaDescription || 'AI automation and web development for growing businesses.',
    openGraph: {
      type: 'website',
      siteName: settings?.companyName,
      url: settings?.siteUrl,
    },
    robots: { index: true, follow: true },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  const primary = settings?.brandPrimaryColor || '#a855f7'
  const primary2 = '#7c3aed'
  const bg = settings?.brandBgColor || '#0a0f1e'
  const surface = settings?.brandSurfaceColor || '#111827'

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <style>{`
          :root {
            --color-primary: ${primary};
            --color-primary-2: ${primary2};
            --color-accent: ${primary};
            --color-bg: ${bg};
            --color-surface: ${surface};
            --navy: ${bg};
            --surface: ${surface};
            --purple: ${primary};
            --purple2: ${primary2};
          }
        `}</style>
      </head>
      <body>
        <JsonLd
          type="Organization"
          data={{
            name: settings?.companyName,
            url: settings?.siteUrl,
            email: settings?.email,
            sameAs: [settings?.linkedinUrl, settings?.twitterUrl].filter(Boolean),
          }}
        />
        <Header settings={settings} />
        <main style={{ paddingTop: '96px' }}>{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
