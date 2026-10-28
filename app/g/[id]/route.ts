import { NextResponse, type NextRequest } from 'next/server'
import { GUIDES } from '@/lib/guides'

// Short, numbered guide links (Angus uses /resources/95): boxxautomations.space/g/002
// Forwards to /guides/[slug] with resource=002 added. Any tags on the short link are kept.
export function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const n = Number(params.id)
  const g = Number.isInteger(n) ? GUIDES.find((x) => Number(x.guide_number) === n) : undefined
  const url = req.nextUrl.clone()
  if (!g) {
    url.pathname = '/guides'
    url.search = ''
    return NextResponse.redirect(url, 307)
  }
  url.pathname = `/guides/${g.slug}`
  url.searchParams.set('resource', g.guide_number)
  return NextResponse.redirect(url, 307)
}
