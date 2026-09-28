// Live capacity (scarcity counter shown on the final CTA + audit "done" screen).
// TODO(Kaleel): wire this to real client-slot data once you have a CRM/backend for it —
// for now it's a hand-set number, update it manually as your open slots change.
export const TOTAL_SPOTS: number = 5
export const SPOTS_OPEN: number = 2

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

export const CALENDLY_URL = 'https://calendly.com/kaleellawrenceboxx/discovery-call'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/klawrenceboxx'
