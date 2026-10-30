// Thin GA4 event helper. Safe to call anywhere on the client: does nothing if gtag is blocked or not loaded.
// Never pass personal info (names, emails, phone numbers) as params.

type Params = Record<string, string | number | boolean | undefined>

export function track(event: string, params: Params = {}) {
  if (typeof window === 'undefined') return
  try {
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    if (typeof gtag === 'function') gtag('event', event, { page_path: window.location.pathname, ...params })
  } catch {
    // analytics must never break the page
  }
}
