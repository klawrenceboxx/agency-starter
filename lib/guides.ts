// Free guides from the BOXX Instagram funnel. One JSON file per guide in content/guides.
// The JSON is the single source for the page, the PDF (scripts/build-guide-pdf.js) and the n8n delivery email.
import networkingFollowUp from '@/content/guides/networking-follow-up.json'

export type GuideTool = {
  job: string
  name: string
  role: string
  used_in_video: boolean
  alternatives: string[]
  link: string
}

export type GuideStep = {
  number: string
  phase: string
  title: string
  prompt: string
  check: string
}

export type Guide = {
  slug: string
  guide_number: string
  keyword: string
  title: string
  promise: string
  video_url: string
  pdf_url: string
  cover: string
  published: string
  seo: { meta_title: string; meta_description: string; primary_search_phrase: string }
  tools: GuideTool[]
  inputs_needed: string[]
  steps: GuideStep[]
  build_notes?: string
}

// Newest first.
export const GUIDES: Guide[] = [networkingFollowUp as Guide]

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug)
}

// Main tools for the eyebrow: "BUILT WITH CLAUDE + GMAIL".
export function builtWith(g: Guide) {
  return g.tools
    .filter((t) => t.used_in_video)
    .slice(0, 2)
    .map((t) => t.name.replace(/\s*\(.*\)\s*/, '').toUpperCase())
    .join(' + ')
}

// "[YOUR NAME] (e.g. Sam Lee)" -> { label: "[YOUR NAME]", example: "Sam Lee" }
export function splitInput(s: string) {
  const m = s.match(/^(\[[^\]]+\])\s*(?:\((?:e\.g\.\s*)?(.*)\))?$/)
  return m ? { label: m[1], example: m[2] || '' } : { label: s, example: '' }
}
