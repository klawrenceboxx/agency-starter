import type { Metadata } from 'next'
import MissedLeadCalculator from '@/components/tools/MissedLeadCalculator'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Missed-Lead Cost Calculator',
  description:
    'Find out what slow or missed follow-up costs your business each month. Type in four numbers and get an estimate in seconds. Free.',
  alternates: { canonical: '/tools/missed-lead-calculator' },
}

export default function MissedLeadCalculatorPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boxxautomations.space'
  return (
    <>
      <JsonLd
        type="Service"
        data={{
          name: 'Missed-Lead Cost Calculator',
          description: 'A free calculator that estimates the monthly and yearly cost of missed or slow follow-up.',
          url: `${siteUrl}/tools/missed-lead-calculator`,
          provider: { '@type': 'Organization', name: 'Boxx Automations', url: siteUrl },
        }}
      />
      <section className="dark page-hero">
        <div className="wrap">
          <h1 className="h1">What are missed leads costing you?</h1>
          <p className="lead">
            Every enquiry that waits too long is money you already paid to get. Type in four numbers to see your estimate.
          </p>
        </div>
      </section>
      <section>
        <div className="wrap">
          <MissedLeadCalculator />
        </div>
      </section>
    </>
  )
}
