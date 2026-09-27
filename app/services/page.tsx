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
          <div className="process-foot"><AuditTrigger>Get Your Free Audit</AuditTrigger></div>
        </div>
      </section>
    </>
  )
}
