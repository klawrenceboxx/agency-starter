import Link from 'next/link'
import { CALENDLY_URL } from '@/lib/site-config'
import styles from './services.module.css'

export const metadata = {
  title: 'Services',
  description: 'Compare BOXX website conversion and email & SMS lead-nurturing packages. Explore the Complete Growth System and book a free strategy call.',
}

// Server-only opt-in. Prices are omitted from rendered HTML while disabled.
const showPrices = process.env.BOXX_SHOW_SERVICE_PRICES === 'true'
const prices = { website: [500, 1000, 1750], email: [350, 750, 1250], complete: 2500 }
const formatPrice = (amount: number) => `${new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(amount)} CAD`
const tiers = ['Starter', 'Growth', 'Premium']
type Category = {
  id: 'website' | 'email'
  title: string
  description: string
  packages: { title: string; description: string }[]
  rows: [string, string, string, string][]
}
const categories: Category[] = [
  {
    id: 'website', title: 'Website Conversion',
    description: 'Three packages designed to improve website performance, user experience, and conversions.',
    packages: [
      { title: 'Improve What Exists', description: 'Identify and address important conversion opportunities on an existing website.' },
      { title: 'Optimize Your Website', description: 'Improve the design, messaging, and conversion performance of your most important pages.' },
      { title: 'Build & Optimize', description: 'A comprehensive website design, development, and conversion optimization solution.' },
    ],
    rows: [
      ['Website audit & recommendations', 'Included', 'Included', 'Included'],
      ['Conversion optimization', '1 page', '3 pages', '5 pages'],
      ['Conversion copywriting', 'Basic', 'Full', 'Full'],
      ['Figma UI/UX design', 'Not included', 'Included', 'Included'],
      ['Website development', 'Not included', 'Limited', 'Up to 5 pages'],
      ['SEO optimization', 'Basic', 'Included', 'Included'],
      ['Analytics & tracking', 'Basic', 'Included', 'Included'],
      ['A/B testing', 'Not included', 'Not included', 'Included'],
      ['Premium Client Experience', 'Included', 'Included', 'Included'],
    ],
  },
  {
    id: 'email', title: 'Email & SMS Lead Nurturing',
    description: 'Capture opportunities, automate follow-ups, and turn more leads into customers.',
    packages: [
      { title: 'Start Following Up', description: 'Establish a foundation for consistent email communication and lead nurturing.' },
      { title: 'Automate Your Follow-Ups', description: 'Build automated email sequences and connect your lead management tools.' },
      { title: 'Complete Lead Nurturing System', description: 'Combine email, SMS, CRM integration, segmentation, and appointment automation into a comprehensive lead-nurturing system.' },
    ],
    rows: [
      ['Email copywriting & design', '3 emails', '5 emails', '7 emails'],
      ['Automated lead nurturing', 'Basic', 'Included', 'Advanced'],
      ['CRM integration', 'Not included', 'Basic', 'Included'],
      ['Customer segmentation', 'Not included', 'Basic', 'Advanced'],
      ['SMS lead nurturing', 'Not included', 'Not included', 'Included'],
      ['Appointment booking automation', 'Not included', 'Not included', 'Included'],
      ['Re-engagement sequence', 'Not included', 'Not included', 'Included'],
      ['Premium Client Experience', 'Included', 'Included', 'Included'],
    ],
  },
]
const completeInclusions = [
  'Complete website conversion audit and recommendations',
  'Figma UI/UX design and website development (up to 5 pages)',
  'Conversion-focused copywriting and optimization',
  'SEO optimization', 'Analytics and conversion tracking', 'A/B testing',
  '7 professionally written and designed emails', 'Advanced automated lead nurturing',
  'CRM setup and integration', 'Customer segmentation', 'SMS lead nurturing',
  'Appointment booking automation', 'Re-engagement sequence', 'All Premium Client Experience inclusions',
]
const experience = [
  ['Personalized Loom Walkthroughs', 'Personalized video walkthroughs explaining the completed work, system functionality, and how to use your delivered website or automations.'],
  ['Weekly Progress Updates', 'Regular updates during implementation outlining completed work, current progress, and upcoming priorities.'],
  ['Daily Action-Item Updates', 'Daily updates during active implementation outlining the work completed and the next planned actions.'],
  ['BOXX 120-Day Technical Protection Guarantee', 'Every BOXX system includes 120 days of complimentary technical support. If something we built breaks or stops working as intended, we’ll fix it at no additional cost.'],
  ['Personalized Pre-Implementation Audit', 'A personalized website and/or lead-nurturing audit identifying improvement opportunities before implementation begins.'],
  ['Complete Ownership & Handover', 'You receive ownership and access to your completed website, automations, and applicable project assets.'],
  ['Optional Performance-Based Email Partnership', 'Eligible clients can explore ongoing email marketing services in exchange for an agreed percentage of attributable revenue. This is optional, with terms established separately.'],
]

function StrategyCall() {
  return <a className={`btn btn-primary ${styles.call}`} href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a Free Strategy Call</a>
}

export default function ServicesPage() {
  return (
    <>
      <section className="dark page-hero">
        <div className={`wrap ${styles.hero}`}>
          <h1 className="h1">Two things, done properly.</h1>
          <p className="lead">A website that helps visitors take action. Follow-ups that keep the conversation going. Choose the support your business needs, or bring it all together.</p>
          <StrategyCall />
          <nav className={styles.jumpLinks} aria-label="Explore service packages">
            <a href="#website">Website Conversion</a><a href="#email">Email & SMS</a><a href="#complete">Complete Growth System</a>
          </nav>
        </div>
      </section>

      {categories.map(category => (
        <section className={styles.category} key={category.id} id={category.id} aria-labelledby={`${category.id}-title`}>
          <div className="wrap">
            <div className={styles.sectionIntro}>
              <h2 className="h2" id={`${category.id}-title`}>{category.title}</h2>
              <p className="lead">{category.description}</p>
            </div>
            <div className={styles.tableScroll} role="region" aria-label={`${category.title} package comparison, scroll horizontally on smaller screens`} tabIndex={0}>
              <table className={styles.comparison}>
                <caption className={styles.caption}>Compare Starter, Growth, and Premium. Every package includes the Premium Client Experience.</caption>
                <thead><tr><th scope="col">Your package</th>{category.packages.map((pkg, index) => (
                  <th scope="col" key={pkg.title} className={index === 1 ? styles.popular : undefined}>
                    {index === 1 && <span className={styles.badge}>Most Popular</span>}
                    <span className={styles.tier}>{tiers[index]}</span>
                    <span className={styles.packageTitle}>{pkg.title}</span>
                    <p>{pkg.description}</p>
                    {showPrices && <p className={styles.price}>{formatPrice(prices[category.id][index])}<small>One-time implementation</small></p>}
                  </th>
                ))}</tr></thead>
                <tbody>{category.rows.map(([label, ...values]) => (
                  <tr key={label}><th scope="row">{label}</th>{values.map((value, index) => <td key={index} className={index === 1 ? styles.popular : undefined}>{value === 'Not included' ? <span aria-label="Not included">—</span> : value}</td>)}</tr>
                ))}</tbody>
                <tfoot><tr><th scope="row">Let’s find your fit</th>{tiers.map((tier, index) => <td key={tier} className={index === 1 ? styles.popular : undefined}><StrategyCall /></td>)}</tr></tfoot>
              </table>
            </div>
          </div>
        </section>
      ))}

      <section id="complete" className={`dark ${styles.flagship}`} aria-labelledby="complete-title">
        <div className="wrap">
          <span className={styles.badge}>Flagship offer</span>
          <div className={styles.flagshipHeading}>
            <div><h2 className="h2" id="complete-title">BOXX Complete Growth System</h2><p className="lead">Everything your business needs to improve website conversions and automate lead nurturing.</p></div>
            <div>{showPrices && <p className={styles.price}>{formatPrice(prices.complete)}<small>One-time implementation · Save {formatPrice(500)} on the individual premium packages</small></p>}<StrategyCall /></div>
          </div>
          <p>Website Conversion Premium + Email &amp; SMS Lead Nurturing Premium, brought together in one complete implementation package.</p>
          <ul className={styles.inclusions}>{completeInclusions.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      <section className={styles.experience} aria-labelledby="experience-title">
        <div className="wrap">
          <div className={styles.sectionIntro}><h2 className="h2" id="experience-title">Premium Client Experience</h2><p className="lead">Included with every BOXX package, with the scope tailored to your purchased services.</p></div>
          <div className={styles.experienceGrid}>{experience.map(([title, description], index) => (
            <article key={title} className={index === 3 ? styles.guarantee : styles.experienceItem}>
              <h3 className="h3">{title}</h3><p>{description}</p>
              {index === 3 && <><p><strong>Covered:</strong> Bugs, broken forms, automation failures, and implementation errors attributable to BOXX.</p><p><strong>Not covered:</strong> New features, redesign requests, third-party service outages, or problems caused by client changes.</p></>}
            </article>
          ))}</div>
        </div>
      </section>

      <section className={styles.supporting} aria-labelledby="supporting-title">
        <div className="wrap">
          <h2 className="h2" id="supporting-title">Supporting Services</h2>
          <p className="lead">Optional add-ons available depending on your business needs.</p>
          <ul><li>Social media hook research</li><li>Trend reel posting</li><li>Reusable content format research</li></ul>
          <p className={styles.note}>Software subscriptions, hosting, SMS usage, and separately agreed ongoing management are not included in implementation fees.</p>
          <StrategyCall />
          <p className="local-related">Serving Vaughan and the GTA:{' '}<Link href="/services/web-design-vaughan">Web design in Vaughan</Link> ·{' '}<Link href="/services/seo-vaughan">SEO in Vaughan</Link> ·{' '}<Link href="/services/web-design-markham">Web design in Markham</Link> ·{' '}<Link href="/services/web-design-richmond-hill">Web design in Richmond Hill</Link> ·{' '}<Link href="/services/email-marketing-automation">Email follow-up</Link></p>
        </div>
      </section>
    </>
  )
}
