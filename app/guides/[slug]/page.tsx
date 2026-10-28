import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AuditTrigger from '@/components/audit/AuditTrigger'
import CopyPrompt from '@/components/guides/CopyPrompt'
import GuidePdfForm from '@/components/guides/GuidePdfForm'
import { GUIDES, builtWith, getGuide, splitInput } from '@/lib/guides'
import styles from '../guides.module.css'

const SITE = 'https://boxxautomations.space'

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const g = getGuide(params.slug)
  if (!g) return {}
  const url = `${SITE}/guides/${g.slug}`
  return {
    // Absolute: the meta_title already ends in "| BOXX".
    title: { absolute: g.seo.meta_title },
    description: g.seo.meta_description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: g.seo.meta_title,
      description: g.seo.meta_description,
      images: g.cover ? [{ url: `${SITE}${g.cover}` }] : undefined,
    },
  }
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const g = getGuide(params.slug)
  if (!g) notFound()

  const n = g.steps.length
  const others = GUIDES.filter((o) => o.slug !== g.slug).slice(0, 2)
  const notes = (g.build_notes || '').split('\n').map((s) => s.trim()).filter(Boolean)

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: g.title,
    description: g.promise,
    url: `${SITE}/guides/${g.slug}`,
    tool: g.tools.map((t) => ({ '@type': 'HowToTool', name: t.name })),
    step: g.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: `${s.phase}: ${s.title}. ${s.check}`,
      url: `${SITE}/guides/${g.slug}#step-${s.number}`,
    })),
  }
  const video = g.video_url
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: g.title,
        description: g.promise,
        thumbnailUrl: g.cover ? `${SITE}${g.cover}` : undefined,
        contentUrl: g.video_url,
        ...(g.published ? { uploadDate: g.published } : {}),
      }
    : null

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      {video && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(video) }} />}

      {/* HERO */}
      <section className={styles.hero}>
        <div className={`wrap ${styles.heroGrid}`}>
          <div>
            <Link href="/guides" className={styles.back}>← All guides</Link>
            <p className={styles.eyebrow}>
              FREE GUIDE · {n} PROMPTS · BUILT WITH {builtWith(g)}
            </p>
            <h1 className={styles.h1}>
              {g.title}
              <span className={styles.dot}>.</span>
            </h1>
            <p className={styles.lead}>
              {g.promise} Copy each prompt into Claude and it builds the system with you.
            </p>
            <div className={styles.heroBtns}>
              <a href="#steps" className={styles.btnSecondary}>Get the prompts</a>
              <a href="#pdf" className={styles.btnGhost}>Download PDF</a>
              {g.video_url && (
                <a href={g.video_url} className={styles.btnGhost} target="_blank" rel="noopener noreferrer">
                  Watch the video
                </a>
              )}
            </div>
          </div>
          <aside className={styles.sideCard}>
            {g.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={g.cover} alt={`${g.title}: video cover`} className={styles.cover} width={720} height={1280} />
            )}
            <dl className={styles.counts}>
              <div><dt>Prompts</dt><dd>{n}</dd></div>
              <div><dt>Tools</dt><dd>{g.tools.length}</dd></div>
              <div><dt>PDF</dt><dd>Free</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      {/* SOFT GATE */}
      <section id="pdf" className={styles.gate}>
        <div className="wrap">
          <GuidePdfForm slug={g.slug} resource={g.guide_number} pdfUrl={g.pdf_url} />
        </div>
      </section>

      {/* DONE FOR YOU */}
      <section className={styles.band}>
        <div className={`wrap ${styles.bandInner}`}>
          <div>
            <h2 className={styles.h2}>Don&rsquo;t want to build it? I&rsquo;ll set it up for your business.</h2>
            <p className={styles.muted}>Start with a free audit and I&rsquo;ll show you where your leads are slipping through.</p>
          </div>
          <AuditTrigger className="btn btn-primary">Get Your Free Audit</AuditTrigger>
        </div>
      </section>

      {/* TOOLS */}
      <section className={styles.section}>
        <div className="wrap">
          <h2 className={styles.h2}>What you&rsquo;ll need</h2>
          <div className={styles.toolGrid}>
            {g.tools.map((t) => (
              <div key={t.name} className={styles.card}>
                <span className={styles.job}>{t.job}</span>
                <h3 className={styles.h3}>
                  {t.link ? <a href={t.link} target="_blank" rel="noopener noreferrer">{t.name}</a> : t.name}
                </h3>
                <p className={styles.muted}>{t.role}</p>
                <div className={styles.tags}>
                  <span className={t.required === false ? styles.pillMuted : styles.pill}>
                    {t.required === false ? 'Optional' : 'Required'}
                  </span>
                  {t.used_in_video && <span className={styles.pillMuted}>Used in video</span>}
                </div>
                {t.alternatives.length > 0 && (
                  <div className={styles.options}>
                    <span>Options:</span>
                    <span className={styles.option}>{t.name.replace(/\s*\(.*\)\s*/, '')}</span>
                    {t.alternatives.map((a) => (
                      <span key={a} className={styles.option}>{a}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INPUTS */}
      <section className={styles.section}>
        <div className="wrap">
          <h2 className={styles.h2}>Before you start</h2>
          <p className={styles.muted}>
            Replace every <mark className={styles.markInline}>[BRACKET]</mark> in Prompt 1 with your own details before you paste it.
            Leave one blank and Claude will ask you for it.
          </p>
          <ul className={styles.inputs}>
            {g.inputs_needed.map((s) => {
              const { label, example } = splitInput(s)
              return (
                <li key={label}>
                  <code>{label}</code>
                  {example && <span>e.g. {example}</span>}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* STEPS */}
      <section id="steps" className={`${styles.section} ${notes.length ? '' : styles.sectionLast}`}>
        <div className="wrap">
          <h2 className={styles.h2}>Copy. Paste. Build.</h2>
          <p className={styles.muted}>Open the Claude app, start a new chat, and paste these in order.</p>
          <ol className={styles.steps}>
            {g.steps.map((s) => (
              <li key={s.number} id={`step-${s.number}`} className={styles.step}>
                <div className={styles.stepHead}>
                  <span className={styles.num}>{s.number}</span>
                  <div>
                    <span className={styles.phase}>{s.phase}</span>
                    <h3 className={styles.h3}>{s.title}</h3>
                  </div>
                </div>
                <CopyPrompt text={s.prompt} label={`Prompt ${Number(s.number)}`} />
                <p className={styles.check}>
                  <strong>✓</strong> {s.check}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* BUILD NOTES */}
      {notes.length > 0 && (
        <section className={`${styles.section} ${styles.sectionLast}`}>
          <div className="wrap">
            <h2 className={styles.h2}>Build notes</h2>
            <p className={styles.muted}>What I learned testing this on my own phone.</p>
            <ul className={styles.notes}>
              {notes.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <p className={styles.more}>
              <Link href="/guides">More free guides →</Link>
              {others.map((o) => (
                <Link key={o.slug} href={`/guides/${o.slug}`}>{o.title} →</Link>
              ))}
            </p>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className={`dark final ${styles.final}`}>
        <div className="wrap">
          <h2 className="h2">Find out where your leads are getting lost.</h2>
          <p className="lead">Get a free audit and see what I&rsquo;d fix first.</p>
          <AuditTrigger className="btn btn-primary">Get Your Free Audit</AuditTrigger>
        </div>
      </section>
    </div>
  )
}
