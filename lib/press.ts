// Real press only. Newest first. Used by the homepage strip and /press.
export type PressItem = {
  outlet: string
  title: string
  url: string
  date: string // YYYY-MM-DD
  summary: string
}

export const PRESS: PressItem[] = [
  {
    outlet: 'PSEEDR',
    title: 'Which Part of Your Internal AI Tool Should You Still Own?',
    url: 'https://pseedr.com/enterprise/which-part-of-your-internal-ai-tool-should-you-still-own',
    date: '2026-10-30',
    summary: 'Kaleel Lawrence-Boxx shares his view on which parts of an internal AI tool a business should keep in-house.',
  },
]
