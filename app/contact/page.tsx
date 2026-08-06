import { client } from '@/sanity/client'
import LeadForm from '@/components/LeadForm'

export const metadata = { title: 'Contact' }

export default async function ContactPage() {
  const settings = await client.fetch(`
    *[_type == "siteSettings"][0]{
      companyName, email, calendlyUrl, n8nLeadWebhookUrl
    }
  `)

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="grid gap-12 md:grid-cols-2">
        {/* Left: Info */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">Let us talk</h1>
          <p className="text-muted text-lg mb-10">
            Tell us what you are working on. We will get back to you within 24 hours —
            usually same day.
          </p>

          <div className="space-y-6">
            {settings?.email && (
              <div>
                <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Email</div>
                <a href={`mailto:${settings.email}`} className="text-white hover:text-primary transition-colors font-medium">
                  {settings.email}
                </a>
              </div>
            )}

            {settings?.calendlyUrl && (
              <div>
                <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Book a Call</div>
                <a
                  href={settings.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:opacity-90 transition-opacity"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Schedule 30 minutes &rarr;
                </a>
              </div>
            )}

            <div
              className="mt-8 rounded-xl p-5 border"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <div className="text-white font-semibold mb-1 text-sm">Typical response time</div>
              <div className="text-muted text-sm">Within 24 hours, often same day</div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div>
          <LeadForm webhookUrl={settings?.n8nLeadWebhookUrl || ''} />
        </div>
      </div>
    </div>
  )
}
