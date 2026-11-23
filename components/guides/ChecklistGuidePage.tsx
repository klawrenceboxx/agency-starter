import Link from 'next/link'
import AuditTrigger from '@/components/audit/AuditTrigger'
import GuidePdfForm from '@/components/guides/GuidePdfForm'
import { FrameworkChecklist, LeakScorer } from '@/components/guides/ChecklistGuide'
import { GUIDES, type Guide, type GuideChecklist } from '@/lib/guides'
import styles from '@/app/guides/guides.module.css'

const SITE = 'https://boxxautomations.space'

// Checklist guides (kind: "checklist"): everything is on the page, no signup. The PDF form is optional.
export default function ChecklistGuidePage({ g }: { g: Guide & { checklist: GuideChecklist } }) {
  const c = g.checklist
  const items = c.phases.reduce((a, p) => a + p.items.length, 0)
  const others = GUIDES.filter((o) => o.slug !== g.slug).slice(0, 2)

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: g.title,
    description: g.promise,
    url: `${SITE}/guides/${g.slug}`,
    step: c.phases.map((p, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: `Phase ${p.number}: ${p.name}`,
      text: p.items.map((it) => it.title).join('. ') + '.',
      url: `${SITE}/guides/${g.slug}#framework`,
    })),
  }

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={`wrap ${styles.heroGrid}`}>
          <div>
            <Link href="/guides" className={styles.back}>← All guides</Link>
            <p className={styles.eyebrow}>FREE GUIDE · {c.phases.length} PHASES · {items} ITEMS · NO SIGNUP</p>
            <h1 className={styles.h1}>
              {g.title}
              <span className={styles.dot}>.</span>
            </h1>
            <p className={styles.lead}>{g.promise} The same checklist I run on every client site, free.</p>
            <div className={styles.heroBtns}>
              <a href="#leak" className={styles.btnSecondary}>Score your page</a>
              <a href="#framework" className={styles.btnGhost}>See all {items} items</a>
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
              <div><dt>Phases</dt><dd>{c.phases.length}</dd></div>
              <div><dt>Items</dt><dd>{items}</dd></div>
              <div><dt>Signup</dt><dd>None</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      {/* LEAK REPORT */}
      <section id="leak" className={styles.section} style={{ paddingTop: 0 }}>
        <div className="wrap">
          <p className={styles.eyebrow}>STEP 1 · 2 MINUTES</p>
          <h2 className={styles.h2}>Score your page with the Leak Report</h2>
          <p className={styles.muted}>
            Open your homepage or landing page next to this one. Give each check a 0, 1 or 2. Be honest, nobody sees this but you.
          </p>
          <LeakScorer data={c} />
        </div>
      </section>

      {/* DONE FOR YOU */}
      <section className={styles.band} style={{ marginTop: 80 }}>
        <div className={`wrap ${styles.bandInner}`}>
          <div>
            <h2 className={styles.h2}>Rather I score it for you? I&rsquo;ll show you what to fix first.</h2>
            <p className={styles.muted}>Get a free audit of your site, built on this same framework.</p>
          </div>
          <AuditTrigger className="btn btn-primary">Get Your Free Audit</AuditTrigger>
        </div>
      </section>

      {/* FRAMEWORK */}
      <section id="framework" className={styles.section}>
        <div className="wrap">
          <p className={styles.eyebrow}>STEP 2 · THE FULL FRAMEWORK</p>
          <h2 className={styles.h2}>{c.phases.length} phases. {items} items. Audit it, then build it.</h2>
          <p className={styles.muted}>
            Every item has an <strong>Audit</strong> question (what&rsquo;s wrong now) and a <strong>Build</strong> step (the fix).
            Start with the phases behind your lowest Leak Report scores. Tick items off as you go; your progress saves in this browser.
          </p>
          <FrameworkChecklist data={c} />
        </div>
      </section>

      {/* DOWNLOADS + OPTIONAL EMAIL */}
      <section className={styles.section}>
        <div className="wrap">
          <h2 className={styles.h2}>Take it with you</h2>
          <p className={styles.muted}>Print the Leak Report for your next review, or keep the full framework as a PDF.</p>
          {!!g.downloads?.length && (
            <div className={styles.downloads}>
              {g.downloads.map((d) => (
                <a key={d.href} href={d.href} download className={styles.btnSecondary}>{d.label}</a>
              ))}
            </div>
          )}
        </div>
      </section>
      <section id="pdf" className={styles.gate} style={{ paddingTop: 40 }}>
        <div className="wrap">
          <GuidePdfForm slug={g.slug} resource={g.guide_number} pdfUrl={g.pdf_url} />
          <p className={styles.more}>
            <Link href="/guides">More free guides →</Link>
            {others.map((o) => (
              <Link key={o.slug} href={`/guides/${o.slug}`}>{o.title} →</Link>
            ))}
          </p>
        </div>
      </section>

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
