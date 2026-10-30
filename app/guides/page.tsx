import Link from 'next/link'
import type { Metadata } from 'next'
import AuditTrigger from '@/components/audit/AuditTrigger'
import { GUIDES } from '@/lib/guides'
import styles from './guides.module.css'

export const metadata: Metadata = {
  title: 'Free Guides',
  description:
    'Free copy-paste prompts from my Instagram videos. Build each system with Claude in a few minutes, step by step.',
  alternates: { canonical: '/guides' },
}

export default function GuidesIndex() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="wrap">
          <p className={styles.eyebrow}>FREE GUIDES</p>
          <h1 className={styles.h1}>
            Copy the prompts. Build it yourself<span className={styles.dot}>.</span>
          </h1>
          <p className={styles.lead}>
            Every system from my videos, written out as copy-paste prompts. No code, just Claude.
          </p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionLast}`}>
        <div className="wrap">
          <ul className={styles.index}>
            {GUIDES.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className={styles.indexCard}>
                  {g.cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={g.cover} alt="" className={styles.indexCover} width={720} height={1280} />
                  )}
                  <div className={styles.indexBody}>
                    <div className={styles.indexMeta}>
                      <span>GUIDE {g.guide_number}</span>
                      <span>{g.steps.length} PROMPTS</span>
                      <span className={styles.pill}>{g.keyword}</span>
                    </div>
                    <h2 className={styles.h3}>{g.title}</h2>
                    <p className={styles.muted}>{g.promise}</p>
                    <span className={styles.open}>Open the guide →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

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
