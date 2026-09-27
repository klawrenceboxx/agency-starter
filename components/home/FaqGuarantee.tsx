export default function FaqGuarantee() {
  return (
    <section>
      <div className="wrap faq-wrap">
        <h2 className="h2">Will this actually work for me?</h2>
        <p className="lead">The questions most business owners ask before they start.</p>
        <div className="guarantee">
          <div className="shield"><svg viewBox="0 0 24 24"><path d="M12 3l7 3v6c0 4-3 7.5-7 9-4-1.5-7-5-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg></div>
          <div>
            <strong>100% money-back guarantee</strong>
            <p>Not happy with your new website within 30 days of launch, or your email system within 90 days of launch? Tell me, and you choose: a full refund, or I keep working at no extra cost until you are.</p>
          </div>
        </div>
        <details>
          <summary>What if it doesn&rsquo;t work?</summary>
          <div className="ans"><p>You&rsquo;re covered by the guarantee above. If you&rsquo;re not happy with your website within 30 days of launch, or your emails within 90 days, you pick what happens next: a full refund, or I keep working at no extra cost.</p></div>
        </details>
        <details>
          <summary>How do I know this actually works?</summary>
          <div className="ans"><p>You&rsquo;re looking at it. This site was built with the same 10-phase system, step by step. You can watch every phase on the How It Works page.</p></div>
        </details>
        <details>
          <summary>Do you work with my type of business?</summary>
          <div className="ans"><p>If you get leads from ads, social media or in-person networking, this works for you. Online stores and service businesses both fit.</p></div>
        </details>
        <details>
          <summary>What does it cost?</summary>
          <div className="ans"><p>Your audit is free. The cost of a build depends on what needs fixing, and you&rsquo;ll get a clear quote on a short call before anything starts.</p></div>
        </details>
      </div>
    </section>
  )
}
