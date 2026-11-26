// Free guides from the BOXX Instagram funnel. One JSON file per guide in content/guides.
// The JSON is the single source for the page, the PDF (scripts/build-guide-pdf.js) and the n8n delivery email.
import networkingFollowUp from '@/content/guides/networking-follow-up.json'
import addOneColour from '@/content/guides/add-one-colour-design-kit.json'
import classifiedFile from '@/content/guides/classified-file-animation.json'
import landingPageChecklist from '@/content/guides/landing-page-checklist.json'
import claudeVideoEditingLevels from '@/content/guides/claude-video-editing-levels.json'

export type GuideTool = {
  job: string
  name: string
  role: string
  used_in_video: boolean
  required?: boolean // default true
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

export type ChecklistItem = { id: string; title: string; desc: string; audit: string; build: string }
export type ChecklistPhase = { number: number; name: string; deliverable: string; items: ChecklistItem[] }
export type GuideChecklist = {
  leak: { title: string; good: string }[]
  bands: { min: number; label: string; text: string }[]
  phases: ChecklistPhase[]
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
  downloads?: { label: string; href: string }[]
  instructions?: { intro: string; inputs: string; steps: string }
  tools: GuideTool[]
  inputs_needed: string[]
  steps: GuideStep[]
  build_notes?: string
  // 'checklist' guides render an interactive checklist instead of prompts (guide 005).
  kind?: 'prompts' | 'checklist'
  meta_label?: string
  checklist?: GuideChecklist
}

// Newest first.
export const GUIDES: Guide[] = [claudeVideoEditingLevels as Guide, landingPageChecklist as Guide, classifiedFile, addOneColour, networkingFollowUp]

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

// Index / email label: "3 PROMPTS" for prompt guides, the guide's own label for checklists.
export function metaLabel(g: Guide) {
  return g.meta_label || `${g.steps.length} PROMPTS`
}
