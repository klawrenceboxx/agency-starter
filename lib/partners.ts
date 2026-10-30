// Businesses Boxx links to from /partners. Add a partner only after they have agreed to be listed,
// and describe them using their own site. No testimonials, stats or results here (BUSINESS.md).
export type Partner = { name: string; url: string; blurb: string }

export const PARTNERS: Partner[] = [
  {
    name: 'nextSYSTEM',
    url: 'https://nextsystem.ca',
    blurb:
      'AI tools, SOPs and business systems for owner-led service businesses. Good fit if your problem is how the work gets done inside the business, before it reaches your website or inbox.',
  },
]
