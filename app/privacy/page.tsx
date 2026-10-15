import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Boxx Automations collects, uses, and protects personal information, and how to contact us about your privacy.',
}

export default function PrivacyPage() {
  return (
    <article className="website-legal wrap">
      <h1 className="h1">Privacy Policy</h1>
      <p>Effective and last updated: October 15, 2026</p>
      <section>
        <h2>Who we are and what this covers</h2>
        <p>Boxx Automations is a web design and automation business based in Vaughan, Ontario, Canada. This policy covers our website, enquiries, free audits, and related communications. The EarnIt app has a separate <Link href="/earnit/privacy">privacy policy</Link>.</p>
      </section>
      <section>
        <h2>Information we collect</h2>
        <p>When you request an audit, contact us, book a call, subscribe, or submit feedback, we collect the information you provide. This may include your name, email address, phone number, website, service interests, budget, messages, rating, and feedback. Audit submissions also include the submission time, source page, and your email and SMS consent choices.</p>
        <p>Our hosting and infrastructure providers may process technical information such as IP addresses, browser details, requested pages, and server logs to deliver and secure the website. We use browser session storage to remember whether an audit reminder has been shown during your visit.</p>
      </section>
      <section>
        <h2>How we use information</h2>
        <p>We use information to respond to enquiries, prepare and deliver requested audits, arrange calls, provide agreed services, manage our business relationship, understand feedback, prevent abuse, and meet legal obligations. Where you opt in, we also send marketing follow-ups and occasional tips through the channels you selected.</p>
      </section>
      <section>
        <h2>Marketing and your choices</h2>
        <p>Email and SMS marketing choices are separate and optional. You can request an audit without agreeing to marketing. Unsubscribe from marketing email using the unsubscribe link or contact us. Reply STOP to opt out of SMS, or HELP for assistance. Message frequency varies; message and data rates may apply. Consent is not a condition of purchase.</p>
      </section>
      <section>
        <h2>Sharing and service providers</h2>
        <p>We use service providers for website hosting, email delivery (Resend), scheduling (Calendly), and automated enquiry processing (n8n and connected delivery or storage services). They process the information needed to perform those functions. If you follow an external link or book through Calendly, that service also handles information under its own privacy policy.</p>
        <p>We do not sell personal information. We do not share mobile numbers, SMS opt-in information, or consent records with third parties or affiliates for their marketing or promotional purposes. Providers may process this information only as needed to deliver our services. We may disclose information where required by law or necessary to protect legal rights.</p>
        <p>Providers may process information outside Canada, where it may be subject to local laws and lawful access by authorities.</p>
      </section>
      <section>
        <h2>Retention and security</h2>
        <p>We retain information for as long as needed to handle your request, provide services, maintain necessary business and consent records, resolve disputes, and meet legal obligations. We then delete or anonymize information when it is no longer needed. We may retain limited opt-out records to honour your communication preferences.</p>
        <p>We use reasonable safeguards appropriate to the information, but no internet transmission or storage system can be guaranteed completely secure. Please do not submit passwords, payment card details, or sensitive personal information through our enquiry forms.</p>
      </section>
      <section>
        <h2>Your privacy rights and contact</h2>
        <p>You can ask to access or correct your personal information, request deletion subject to applicable retention requirements, withdraw consent, or raise a privacy concern. Contact the person responsible for privacy at <a href="mailto:kaleellawrenceboxx@gmail.com">kaleellawrenceboxx@gmail.com</a>. We may need to verify your identity before handling a request. You may also raise a concern with the <a href="https://www.priv.gc.ca/en/">Office of the Privacy Commissioner of Canada</a>.</p>
      </section>
      <section>
        <h2>Changes</h2>
        <p>We will post updates here and change the date above. If we introduce a new use of personal information that requires consent, we will seek that consent.</p>
      </section>
      <p>See also our <Link href="/terms">Terms of Service</Link>.</p>
    </article>
  )
}
