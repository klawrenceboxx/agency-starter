// Visitor attribution, Angus-style: which guide (resource), which link (channel),
// which email send (dlv) and the utm tags. Saved in the browser on arrival so a
// form submitted later, on any page, still knows where the visitor came from.

export const ATTR_KEYS = [
  'resource', 'channel', 'dlv',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content',
] as const

export type AttrKey = (typeof ATTR_KEYS)[number]
export type Touch = Partial<Record<AttrKey, string>> & { landing?: string; referrer?: string; at?: string }

const FIRST = 'boxx_attr_first'
const LAST = 'boxx_attr_last'

function read(key: string): Touch | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as Touch) : null
  } catch {
    return null
  }
}

function write(key: string, t: Touch) {
  try {
    localStorage.setItem(key, JSON.stringify(t))
  } catch {
    // Private mode or blocked storage: the current URL still gets sent.
  }
}

// Tags on the current URL, if any.
export function tagsFromUrl(): Touch {
  if (typeof window === 'undefined') return {}
  const p = new URLSearchParams(window.location.search)
  const t: Touch = {}
  for (const k of ATTR_KEYS) {
    const v = p.get(k)
    if (v) t[k] = v.slice(0, 120)
  }
  return t
}

// Call on every page view. First touch is kept forever; last touch updates whenever a tagged link is used.
export function captureAttribution() {
  if (typeof window === 'undefined') return
  const tags = tagsFromUrl()
  const hasTags = Object.keys(tags).length > 0
  const touch: Touch = {
    ...tags,
    landing: window.location.pathname + window.location.search,
    referrer: document.referrer ? document.referrer.slice(0, 200) : '',
    at: new Date().toISOString(),
  }
  if (!read(FIRST)) write(FIRST, touch)
  if (hasTags) write(LAST, touch)
}

// Flat fields for a form payload: tags on this URL win, then the last tagged visit.
// The first visit goes along as a JSON string.
export function attributionPayload() {
  const now = tagsFromUrl()
  const last = read(LAST) || {}
  const first = read(FIRST)
  const out: Record<string, string> = {}
  for (const k of ATTR_KEYS) out[k] = now[k] || last[k] || ''
  out.first_touch = first ? JSON.stringify(first).slice(0, 600) : ''
  return out
}
