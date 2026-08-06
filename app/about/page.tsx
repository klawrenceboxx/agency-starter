import { client } from '@/sanity/client'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'

type TeamMember = { name: string; role: string; bio?: string; linkedinUrl?: string }
type AboutData = {
  headline?: string
  missionStatement?: string
  founderBio?: unknown[]
  body?: unknown[]
  teamMembers?: TeamMember[]
  trustSignals?: string[]
}

export const metadata = { title: 'About' }

export default async function AboutPage() {
  const [about, settings]: [AboutData, { calendlyUrl?: string }] = await Promise.all([
    client.fetch(`*[_type == "aboutPage"][0]{
      headline,
      missionStatement,
      founderBio,
      body,
      "teamMembers": teamMembers[]->{
        name, role, bio, linkedinUrl
      },
      trustSignals
    }`),
    client.fetch(`*[_type == "siteSettings"][0]{ calendlyUrl }`),
  ])

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-4">
        {about?.headline || 'About Us'}
      </h1>

      {about?.missionStatement && (
        <p className="text-lg text-muted mb-10 border-l-2 pl-4" style={{ borderColor: 'var(--color-primary)' }}>
          {about.missionStatement}
        </p>
      )}

      {about?.founderBio && (
        <div className="prose prose-invert prose-lg max-w-none mb-10">
          <PortableText value={about.founderBio as Parameters<typeof PortableText>[0]['value']} />
        </div>
      )}

      {about?.body && (
        <div className="prose prose-invert prose-lg max-w-none mb-10">
          <PortableText value={about.body as Parameters<typeof PortableText>[0]['value']} />
        </div>
      )}

      {/* Trust signals */}
      {about?.trustSignals && about.trustSignals.length > 0 && (
        <div className="grid grid-cols-2 gap-3 my-10">
          {about.trustSignals.map((signal, i) => (
            <div
              key={i}
              className="rounded-lg p-4 text-center border"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <span className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>{signal}</span>
            </div>
          ))}
        </div>
      )}

      {/* Team members */}
      {about?.teamMembers && about.teamMembers.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-white mb-6">The Team</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {about.teamMembers.map((member, i) => (
              <div
                key={i}
                className="rounded-xl p-5 border"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <div className="font-bold text-white mb-0.5">{member.name}</div>
                <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-3">{member.role}</div>
                {member.bio && <p className="text-muted text-sm leading-relaxed">{member.bio}</p>}
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-3 text-primary text-xs font-semibold hover:underline"
                  >
                    LinkedIn &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12">
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
