export const NAV_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export const PHASES: [string, string, string][] = [
  ['Phase 0', 'Research & strategy', "Strategy brief: who the site is for, the one action it asks for, and why the old site didn't convert."],
  ['Phase 1', 'Offer & positioning', 'Positioning and offer sheet: two services, a clear guarantee and a real limit of five clients.'],
  ['Phase 2', 'Information architecture', 'Sitemap and page order, planned around how a visitor decides.'],
  ['Phase 3', 'Copy & messaging', 'Final page copy at a plain reading level, with objections answered where they come up.'],
  ['Phase 4', 'Attention & layout', 'Wireframes for desktop and mobile, sized by what matters most.'],
  ['Phase 5', 'Trust & persuasion', 'Proof plan: real founder, real guarantee, no fake reviews or numbers.'],
  ['Phase 6', 'UI & experience', 'The Boxx design system: colours, type, spacing and components.'],
  ['Phase 7', 'Conversion mechanics', 'The audit form: a short three-step flow with nothing in the way.'],
  ['Phase 8', 'Lead capture & nurture', 'Three email sequences that follow up automatically.'],
  ['Phase 9', 'Technical foundation', 'QA checklist: speed, mobile, errors and end-to-end testing.'],
  ['Phase 10', 'Measurement & optimization', "Analytics plan: what gets tracked after launch and how it's improved."],
]

// n8n workflow "BOXX - Guide Delivery" (n8n/workflows/5-boxx-guide-delivery.json).
export const GUIDE_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_GUIDE_WEBHOOK_URL || 'https://n8n.boxxautomations.space/webhook/boxx-guide'

export const CALENDLY_URL = 'https://calendly.com/kaleellawrenceboxx/discovery-call'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/klawrenceboxx'
export const COMPANY_LINKEDIN_URL = 'https://www.linkedin.com/company/boxx-automations/'
export const INSTAGRAM_URL = 'https://www.instagram.com/kaleel.lawrence/'

// Local profiles. Used as sameAs links in the Organization JSON-LD and the footer.
export const GOOGLE_PROFILE_URL = 'https://share.google/GQszDOf1hrtUuLe5y'
// Google review link (the "Ask for reviews" link). /review uses it when Sanity's googleBusinessUrl is empty.
export const GOOGLE_REVIEW_URL = 'https://g.page/r/CZ_WYO4FEv40EBM/review'
export const CHAMBER_LISTING_URL =
  'https://web.vaughanchamber.ca/atlas/directory/category/computer-consultants---i.t.,-web-design,-hosting-&-related-services/Boxx-Automation-8283'

// Must match the phone number on the Google Business Profile.
export const PHONE_DISPLAY = '(647) 632-1709'
export const PHONE_E164 = '+16476321709'

// n8n workflow "BOXX - Calculator Lead" (n8n/workflows/6-boxx-calculator-lead.json).
// The email box on the calculator page only shows once this env var is set in Vercel, so an
// un-imported workflow never shows visitors a broken form.
export const CALCULATOR_WEBHOOK_URL = process.env.NEXT_PUBLIC_CALCULATOR_WEBHOOK_URL || ''
