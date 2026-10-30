import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  alternates: { canonical: '/terms' },
  description: 'Terms for using the Boxx Automations website, requesting audits, and communicating with our business.',
}

export default function TermsPage() {
  return (
    <article className="website-legal wrap">
      <h1 className="h1">Terms of Service</h1>
      <p>Effective and last updated: October 15, 2026</p>
      <section>
        <h2>About these terms</h2>
        <p>These terms govern use of the Boxx Automations website and requests made through it. Boxx Automations is based in Vaughan, Ontario, Canada. By using the website, you agree to these terms. If you are acting for a business, you must have authority to do so.</p>
      </section>
      <section>
        <h2>Website use</h2>
        <p>Use the website lawfully and provide accurate information when contacting us. Do not interfere with the website, attempt unauthorized access, submit malicious code or spam, or submit information you do not have permission to share.</p>
      </section>
      <section>
        <h2>Free audits and paid services</h2>
        <p>Requesting a free audit or booking a call does not commit you to a purchase or create a paid service agreement. Audit recommendations are based on the information available and do not guarantee revenue, conversion rates, search rankings, or other business results.</p>
        <p>Paid projects require a separate written agreement covering scope, pricing, payment, timelines, deliverables, ownership, cancellation, and any guarantees. That agreement controls if it conflicts with these website terms. Website descriptions do not replace the agreed project scope.</p>
      </section>
      <section>
        <h2>Email and SMS communications</h2>
        <p>When you request information or services, we may contact you to fulfil that request. Marketing email and SMS require your separate opt-in choices. You do not need to consent to marketing to buy services or request an audit.</p>
        <p>If you opt in to Boxx Automations SMS, you may receive follow-ups and occasional tips. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe or HELP for assistance, or email <a href="mailto:kaleellawrenceboxx@gmail.com">kaleellawrenceboxx@gmail.com</a>. Carriers are not liable for delayed or undelivered messages. You must own or be authorized to use the number you provide.</p>
      </section>
      <section>
        <h2>Content and third-party services</h2>
        <p>Our website content and branding belong to Boxx Automations or their respective owners. You may view and share links to public pages. Other use of our original materials requires permission unless permitted by law. You retain ownership of information and materials you submit and permit us to use them to handle your request and provide agreed services.</p>
        <p>External sites and services, including scheduling tools, have their own terms and privacy policies. We do not control their availability or content.</p>
      </section>
      <section>
        <h2>Availability and liability</h2>
        <p>We aim to keep website information accurate and the site available, but errors and interruptions can occur. To the extent permitted by applicable law, the website and free informational materials are provided as available without warranties of uninterrupted operation or suitability for a particular purpose.</p>
        <p>To the extent permitted by applicable law, Boxx Automations is not liable for indirect or consequential losses arising from use of the website or free informational materials. Nothing in these terms excludes liability or consumer rights that cannot lawfully be excluded. Liability for paid services is addressed in your project agreement.</p>
      </section>
      <section>
        <h2>Privacy, changes, and governing law</h2>
        <p>Our <Link href="/privacy">Privacy Policy</Link> explains how we handle personal information. We may update these terms by posting a revised version with a new date. Changes apply to future website use and do not alter an existing project agreement.</p>
        <p>These terms are governed by Ontario law and applicable Canadian federal law, subject to any mandatory protections under the laws that apply to you.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>Questions about these terms: <a href="mailto:kaleellawrenceboxx@gmail.com">kaleellawrenceboxx@gmail.com</a>.</p>
      </section>
    </article>
  )
}
