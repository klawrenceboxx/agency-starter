import Link from 'next/link'
import ServicesCore from '@/components/ServicesCore'
import AuditTrigger from '@/components/audit/AuditTrigger'

export const metadata = { title: 'Services' }

export default function ServicesPage() {
  return (
    <>
      <section className="dark page-hero">
        <div className="wrap">
          <h1 className="h1">Two things, done properly.</h1>
          <p className="lead">Websites that convert, and emails that follow up. Everything else supports those two.</p>
        </div>
      </section>
      <section>
        <div className="wrap">
          <ServicesCore />
          <p className="local-related">
            Serving Vaughan and the GTA:{' '}
            <Link href="/services/web-design-vaughan">Web design in Vaughan</Link> ·{' '}
            <Link href="/services/seo-vaughan">SEO in Vaughan</Link> ·{' '}
            <Link href="/services/web-design-markham">Web design in Markham</Link> ·{' '}
            <Link href="/services/web-design-richmond-hill">Web design in Richmond Hill</Link> ·{' '}
            <Link href="/services/email-marketing-automation">Email follow-up</Link>
          </p>
          <div className="process-foot"><AuditTrigger>Get Your Free Audit</AuditTrigger></div>
        </div>
      </section>
    </>
  )
}
