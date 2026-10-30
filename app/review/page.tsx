import { client } from '@/sanity/client'
import ReviewForm from '@/components/ReviewForm'
import { GOOGLE_REVIEW_URL } from '@/lib/site-config'

export const metadata = {
  title: 'How did we do?',
  robots: { index: false, follow: false },
}

export const revalidate = 60

export default async function ReviewPage() {
  let googleReviewUrl = GOOGLE_REVIEW_URL
  try {
    const s: { googleBusinessUrl?: string } | null = await client.fetch(`*[_type == "siteSettings"][0]{ googleBusinessUrl }`)
    googleReviewUrl = s?.googleBusinessUrl || GOOGLE_REVIEW_URL
  } catch {
    /* falls back to a thank-you screen */
  }
  return (
    <section className="page-hero">
      <div className="wrap">
        <ReviewForm googleReviewUrl={googleReviewUrl} />
      </div>
    </section>
  )
}
