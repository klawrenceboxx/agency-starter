import Link from 'next/link'

export default function ServicesCore({ showHeader = false }: { showHeader?: boolean }) {
  return (
    <>
      {showHeader && (
        <div className="svc-head">
          <h2 className="h2">Where Boxx fixes the leaks</h2>
          <Link className="textlink" href="/services">All services</Link>
        </div>
      )}
      <div className="svc-core">
        <article className="svc">
          <div className="ico"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 8h18M7 12h6M7 15h4" /></svg></div>
          <h3>Conversion-focused websites</h3>
          <p>{showHeader ? 'A site built around one goal: turning more of your visitors into customers.' : 'Redesigns and new builds planned around one goal before any design starts.'}</p>
          <ul>
            {showHeader ? (
              <>
                <li>Clear message in the first few seconds</li>
                <li>Calls to action where people are ready to act</li>
                <li>Fast and easy to use on a phone</li>
              </>
            ) : (
              <>
                <li>Strategy brief and positioning first</li>
                <li>Page copy written for your customers</li>
                <li>Mobile-first layout and a clear path to act</li>
                <li>Tracking set up so we can see what works</li>
              </>
            )}
          </ul>
        </article>
        <article className="svc">
          <div className="ico"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg></div>
          <h3>Automated email follow-up</h3>
          <p>{showHeader ? 'Emails that keep you top of mind, so people think of you first when they’re ready.' : 'Email sequences that bring people back when they’re ready to buy.'}</p>
          <ul>
            {showHeader ? (
              <>
                <li>Welcome and nurture sequences</li>
                <li>Abandoned cart and win-back flows</li>
                <li>Built for online stores and high-ticket services</li>
              </>
            ) : (
              <>
                <li>Welcome and nurture sequences</li>
                <li>Abandoned cart and post-purchase flows</li>
                <li>Win-back emails for past customers</li>
                <li>For online stores and one-to-one services</li>
              </>
            )}
          </ul>
        </article>
      </div>
      <div className="svc-support">
        <div className="svc-mini"><div><strong>Website audits</strong><span>{showHeader ? 'A free look at where your site loses people, with the fixes that matter most.' : 'Free. Where your site loses people, and the fixes that matter most.'}</span></div></div>
        <div className="svc-mini"><div><strong>SEO basics</strong><span>{showHeader ? 'Search health fixed, so the people looking for you can find you.' : 'Titles, indexing and search health, so people can find you.'}</span></div></div>
      </div>
    </>
  )
}
