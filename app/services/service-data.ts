export type Deliverable = { label: string; detail: string }
export type ServicePackage = { name: string; positioning: string; included: Deliverable[]; excluded?: string }
export type ServiceCategory = { id: string; label: string; heading: string; description: string; packages: ServicePackage[] }
const website = {
  audit: 'Homepage audit, conversion problems, and improvement recommendations.',
  conversion: 'CTA optimization, form optimization, product/service page optimization, main page pathway optimization, and offer testing using videos.',
  copy: 'Homepage and product/service page copywriting, headlines, subheadlines, and objection handling.',
  figma: 'Homepage and product/service page UX/UI design.',
  development: 'Figma implementation, mobile responsiveness, website speed optimization, and additional pages such as testimonials and blogs.',
  seo: 'Homepage SEO, keyword research, educational blogs, and service blogs.',
  analytics: 'Microsoft Clarity, Google Search Console, GA4, and conversion tracking.',
  testing: 'Testing variations of existing conversion elements.',
}
const email = {
  copy: 'Email UX design and professionally written nurturing emails. Your package includes the quantity listed; additional emails can be scoped separately.',
  nurture: 'Personalized nurturing, automated follow-ups, and SendGrid/Klaviyo integration.',
  crm: 'CRM setup and integration with lead capture and nurturing systems.',
  segmentation: 'Targeted segmentation of leads and customers.',
  sms: 'Automated SMS sequences and follow-up messages.',
  booking: 'Booking integration, reminders, and follow-ups.',
  reengagement: 'A 60-day re-engagement sequence consisting of 2 emails.',
}
const item = (label: string, detail: string): Deliverable => ({ label, detail })
export const serviceCategories: ServiceCategory[] = [
  {
    id: 'website', label: 'Website Conversion', heading: 'Turn more visitors into customers.',
    description: "Whether you need to improve one page or rebuild your website, we’ll help make every visit count.",
    packages: [
      { name: 'Starter', positioning: 'Improve What Exists', included: [item('Website audit & recommendations', website.audit), item('Conversion optimization: 1 page', website.conversion), item('Basic conversion copywriting', website.copy), item('Basic SEO optimization', website.seo), item('Basic analytics & tracking', website.analytics)], excluded: 'Figma UI/UX design, website development, and A/B testing.' },
      { name: 'Growth', positioning: 'Optimize Key Pages', included: [item('Website audit & recommendations', website.audit), item('Conversion optimization: 3 pages', website.conversion), item('Full conversion copywriting', website.copy), item('Figma UI/UX design', website.figma), item('Limited website development', website.development), item('SEO optimization', website.seo), item('Analytics & tracking', website.analytics)], excluded: 'A/B testing.' },
      { name: 'Premium', positioning: 'Build & Optimize', included: [item('Website audit & recommendations', website.audit), item('Conversion optimization: 5 pages', website.conversion), item('Full conversion copywriting', website.copy), item('Figma UI/UX design', website.figma), item('Website development: up to 5 pages', website.development), item('SEO optimization', website.seo), item('Analytics & tracking', website.analytics), item('A/B testing', website.testing)] },
    ],
  },
  {
    id: 'email', label: 'Email & SMS Lead Nurturing', heading: 'Turn more leads into customers.',
    description: 'Automate your follow-ups, stay connected with potential customers, and make sure fewer opportunities slip through the cracks.',
    packages: [
      { name: 'Starter', positioning: 'Start Following Up', included: [item('3 professionally written and designed emails', email.copy), item('Basic automated lead nurturing', email.nurture)] },
      { name: 'Growth', positioning: 'Automate Nurturing', included: [item('5 professionally written and designed emails', email.copy), item('Automated lead nurturing', email.nurture), item('Basic CRM integration', email.crm), item('Basic customer segmentation', email.segmentation)] },
      { name: 'Premium', positioning: 'Complete Lead System', included: [item('7 professionally written and designed emails', email.copy), item('Advanced automated lead nurturing', email.nurture), item('CRM integration', email.crm), item('Advanced customer segmentation', email.segmentation), item('SMS lead nurturing', email.sms), item('Appointment booking automation', email.booking), item('60-day re-engagement sequence (2 emails)', email.reengagement)] },
    ],
  },
]
export const clientExperience = [
  ['Personalized Loom Walkthroughs', 'Videos explaining completed work, system functionality, and how to use delivered systems.'],
  ['Weekly Progress Updates', 'Weekly summaries of completed work, current progress, and upcoming priorities during implementation.'],
  ['Daily Action-Item Updates', 'Updates during active implementation outlining completed tasks and next planned actions.'],
  ['BOXX 120-Day Technical Protection Guarantee', '120 days of complimentary technical support for BOXX-attributable implementation defects. Covers bugs, broken forms, automation failures, and implementation errors. Excludes new features, redesign requests, third-party outages, and client-caused problems.'],
  ['Personalized Pre-Implementation Audit', 'A tailored website and/or lead-nurturing audit before implementation.'],
  ['Complete Ownership & Handover', 'Ownership and access to the completed website, automations, and applicable project assets.'],
  ['Optional Performance-Based Email Partnership', 'Eligible clients may explore an ongoing email-marketing arrangement based on an agreed percentage of attributable revenue. This is optional, with terms negotiated separately.'],
]
export const scopeNote = 'Deliverable explanations describe possible services, not every activity included in every tier. Your package sets the scope; exact implementation is confirmed in your proposal.'
